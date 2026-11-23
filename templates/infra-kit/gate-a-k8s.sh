#!/usr/bin/env bash
# Reusable Gate A Offline Manifest Validator (CODE_OR_INFRA / Kubernetes GitOps)
# Usage: bash <harness>/templates/infra-kit/gate-a-k8s.sh <path1> [path2 ...]
set -euo pipefail

if [ "$#" -lt 1 ]; then
  echo "Usage: $0 <manifest-file-or-dir> [...]" >&2
  exit 2
fi

fail=0
files=()
for target in "$@"; do
  if [ -d "$target" ]; then
    while IFS= read -r -d '' f; do files+=("$f"); done < <(find "$target" -type f \( -name '*.yaml' -o -name '*.yml' \) -print0)
  elif [ -f "$target" ]; then
    files+=("$target")
  else
    echo "ERROR: path not found: $target" >&2
    exit 2
  fi
done

if [ "${#files[@]}" -eq 0 ]; then
  echo "ERROR: no YAML files found" >&2
  exit 2
fi

echo "==> 1. YAML syntax parse (${#files[@]} files)"
python3 - "${files[@]}" <<'PY'
import sys, yaml
errs = 0
for p in sys.argv[1:]:
    try:
        with open(p, "r", encoding="utf-8") as fh:
            list(yaml.safe_load_all(fh))
    except Exception as e:
        print(f"YAML ERROR in {p}: {e}", file=sys.stderr)
        errs += 1
sys.exit(1 if errs else 0)
PY

echo "==> 2. Floating :latest/:main image tag check"
if grep -En 'image:[[:space:]]*[^#[:space:]]+:(latest|main)([[:space:]]|$)' "${files[@]}"; then
  echo "FAIL: floating :latest or :main image tag detected" >&2
  fail=1
else
  echo "OK: no floating :latest/:main image tags"
fi

echo "==> 3. Plaintext secret heuristic check"
if grep -EIn '(BEGIN (RSA|OPENSSH|EC|PGP) PRIVATE KEY|ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|xox[baprs]-[A-Za-z0-9-]{10,}|AKIA[0-9A-Z]{16}|sk-[A-Za-z0-9]{20,}|AIza[0-9A-Za-z_-]{35})' "${files[@]}"; then
  echo "FAIL: potential plaintext secret detected" >&2
  fail=1
else
  echo "OK: no obvious plaintext secret patterns"
fi

echo "==> 4. Schema validation (kubeconform / kubectl --dry-run=client)"
if command -v kubeconform >/dev/null 2>&1; then
  kubeconform -strict -ignore-missing-schemas -summary "${files[@]}" || fail=1
elif command -v kubectl >/dev/null 2>&1; then
  for f in "${files[@]}"; do
    kubectl apply --dry-run=client -f "$f" >/dev/null || fail=1
  done
  echo "OK: kubectl --dry-run=client passed"
else
  echo "UNVERIFIED: neither kubeconform nor kubectl is installed (red-team must not issue clean PASS)" >&2
  fail=1
fi

exit "$fail"

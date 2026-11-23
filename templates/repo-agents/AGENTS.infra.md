# GitOps & Infrastructure Workspace (`<REPO_NAME>`)

## Default Workflow (`/fleet`)
- Treat any infrastructure, Kubernetes, monitoring, or migration task in this repository as an implicit `/fleet` mission (`CODE_OR_INFRA`). Immediately activate the `fleet` skill and dispatch `@scout`.

## Topology & Verification Guardrails
- **Declarative GitOps Only:** Never mutate cluster state imperatively; use two-phase zero-downtime cutovers (deploy & verify replacement green before pruning legacy manifests) and preserve full alerting/scrape parity.
- **Gate A (Pre-Push):** Run `<harness>/templates/infra-kit/gate-a-k8s.sh <target-path>` (`helm template` + `kubeconform`/`kubectl --dry-run=client`, pinned image tags, secret hygiene).
- **Gate B (Post-Push Live Consumer Path):** Verify live sync/pod health and query through the actual consumer/UI endpoint before reporting completion.

## Learned Gotchas (Maintained by `@evolver`)

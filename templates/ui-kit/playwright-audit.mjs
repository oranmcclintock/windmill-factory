#!/usr/bin/env node
/**
 * Reusable Gate B Playwright UI, iOS PWA & GEO Audit (STYLE_BIBLE.md v1)
 * Usage (from the app root):
 *   node <harness>/templates/ui-kit/playwright-audit.mjs <baseUrl> \
 *     [--routes=/,/settings] [--pwa] [--expect-sw] [--geo] \
 *     [--interactions=./audit-interactions.mjs] [--allow-no-axe] [--out=./.audit-screenshots]
 *
 * Requires in the app: playwright (+ chromium) and @axe-core/playwright (unless --allow-no-axe).
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const args = process.argv.slice(2);
const baseUrl = args.find((a) => !a.startsWith("--"));
if (!baseUrl) {
  console.error("Usage: node playwright-audit.mjs <baseUrl> [--routes=/] [--pwa] [--expect-sw] [--geo] [--interactions=./hook.mjs] [--allow-no-axe] [--out=./.audit-screenshots]");
  process.exit(2);
}

const routesArg = args.find((a) => a.startsWith("--routes="));
const routes = routesArg ? routesArg.slice("--routes=".length).split(",").filter(Boolean) : ["/"];
const checkPwa = args.includes("--pwa");
const expectSw = args.includes("--expect-sw");
const checkGeo = args.includes("--geo");
const allowNoAxe = args.includes("--allow-no-axe");
const interactionsArg = args.find((a) => a.startsWith("--interactions="))?.slice("--interactions=".length);
const outDir = args.find((a) => a.startsWith("--out="))?.slice("--out=".length) || "./.audit-screenshots";
fs.mkdirSync(outDir, { recursive: true });

// Resolve deps from the audited app's CWD so one canonical script serves every app.
const appRequire = createRequire(path.join(process.cwd(), "package.json"));

let chromium;
try {
  ({ chromium } = appRequire("playwright"));
} catch {
  console.error("ERROR: playwright not resolvable from " + process.cwd() + ". Run `npm i -D playwright && npx playwright install chromium` in the app root.");
  process.exit(2);
}

let AxeBuilder = null;
try {
  const axeMod = appRequire("@axe-core/playwright");
  AxeBuilder = axeMod.AxeBuilder ?? axeMod.default ?? axeMod;
} catch {
  if (!allowNoAxe) {
    console.error("ERROR: @axe-core/playwright not installed in " + process.cwd() + ". Install it (`npm i -D @axe-core/playwright`) or pass --allow-no-axe (forces CONDITIONAL PASS).");
    process.exit(2);
  }
  console.warn("WARN: @axe-core/playwright bypassed via --allow-no-axe; WCAG AA audit is UNVERIFIED.");
}

let runInteractions = null;
if (interactionsArg) {
  const hookPath = path.resolve(process.cwd(), interactionsArg);
  const mod = await import(pathToFileURL(hookPath).href);
  if (typeof mod.default !== "function") {
    console.error(`ERROR: --interactions module ${hookPath} must export a default async function(page, ctx).`);
    process.exit(2);
  }
  runInteractions = mod.default;
}

const viewports = [
  { name: "desktop", width: 1440, height: 900, hasTouch: false },
  { name: "mobile", width: 390, height: 844, hasTouch: true },
];

const failures = [];
const launchOpts = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
  ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH }
  : {};
const browser = await chromium.launch(launchOpts);

try {
  let checkedLlmsTxt = false;

  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      hasTouch: vp.hasTouch,
    });

    for (const route of routes) {
      const page = await context.newPage();
      const url = new URL(route, baseUrl).toString();
      const consoleErrors = [];
      const pageErrors = [];
      const httpErrors = [];

      page.on("console", (msg) => {
        if (msg.type() === "error") consoleErrors.push(msg.text());
      });
      page.on("pageerror", (err) => pageErrors.push(String(err)));
      page.on("response", (res) => {
        if (res.status() >= 400) httpErrors.push(`${res.status()} ${res.url()}`);
      });

      // Use 'load' + settle instead of 'networkidle' so SSE/WebSocket/polling apps do not hang.
      await page.goto(url, { waitUntil: "load", timeout: 30000 });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(300);

      const metrics = await page.evaluate(
        async ({ isMobile, isPwa, shouldCheckSw, isGeo }) => {
          const doc = document.documentElement;
          const overflow = doc.scrollWidth > window.innerWidth;
          const rootStyle = getComputedStyle(doc);
          const bgToken = rootStyle.getPropertyValue("--background").trim();

          const isVisible = (el) => {
            const st = getComputedStyle(el);
            if (st.display === "none" || st.visibility === "hidden" || parseFloat(st.opacity) === 0) return false;
            const r = el.getBoundingClientRect();
            return r.width > 0 && r.height > 0;
          };

          // Enforce 12px minimum font-size floor across all visible text-bearing elements.
          const sub12Text = [];
          for (const el of document.querySelectorAll("body, body *")) {
            if (!isVisible(el)) continue;
            const hasDirectText = Array.from(el.childNodes).some(
              (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim().length > 0
            );
            if (!hasDirectText) continue;
            const fsPx = parseFloat(getComputedStyle(el).fontSize);
            if (fsPx < 12) sub12Text.push(`${el.tagName.toLowerCase()}:${fsPx}px`);
          }

          const smallInputs = [];
          const smallTargets = [];
          const nonZoomTypes = new Set(["hidden", "checkbox", "radio", "range", "file", "color", "submit", "button"]);

          if (isMobile) {
            for (const el of document.querySelectorAll("input, select, textarea")) {
              if (!isVisible(el)) continue;
              if (el.tagName === "INPUT" && nonZoomTypes.has((el.type || "text").toLowerCase())) continue;
              const fsPx = parseFloat(getComputedStyle(el).fontSize);
              if (fsPx < 16) smallInputs.push(`${el.tagName.toLowerCase()}:${fsPx}px`);
            }
            if (isPwa) {
              for (const el of document.querySelectorAll("button, [role='button'], nav a, header a")) {
                if (!isVisible(el)) continue;
                const r = el.getBoundingClientRect();
                if (r.width < 44 || r.height < 44) {
                  smallTargets.push(`${el.tagName.toLowerCase()}(${Math.round(r.width)}x${Math.round(r.height)})`);
                }
              }
            }
          }

          let swCount = null;
          if (shouldCheckSw && "serviceWorker" in navigator) {
            const regs = await navigator.serviceWorker.getRegistrations();
            swCount = regs.length;
          }

          let geoIssues = [];
          if (isGeo) {
            if (!document.title || !document.title.trim()) geoIssues.push("missing <title>");
            const desc = document.querySelector('meta[name="description"]')?.getAttribute("content")?.trim();
            if (!desc) geoIssues.push('missing meta[name="description"]');
            const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute("href")?.trim();
            if (!canonical) geoIssues.push('missing link[rel="canonical"]');
            const h1Count = document.querySelectorAll("h1").length;
            if (h1Count !== 1) geoIssues.push(`expected 1 <h1>, found ${h1Count}`);
            if (!document.querySelector("main")) geoIssues.push("missing <main> landmark");
            const ldScripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
            if (!ldScripts.length) {
              geoIssues.push('missing script[type="application/ld+json"]');
            } else {
              for (const s of ldScripts) {
                try {
                  const parsed = JSON.parse(s.textContent || "");
                  const items = Array.isArray(parsed) ? parsed : [parsed];
                  for (const item of items) {
                    if (!item["@context"] || !item["@type"]) {
                      geoIssues.push("JSON-LD missing @context or @type");
                    }
                  }
                } catch {
                  geoIssues.push("invalid JSON in application/ld+json");
                }
              }
            }
          }

          const vpMeta = document.querySelector('meta[name="viewport"]')?.getAttribute("content") || "";
          const touchIcon = document.querySelector('link[rel="apple-touch-icon"]')?.getAttribute("href") || "";
          const manifestHref = document.querySelector('link[rel="manifest"]')?.getAttribute("href") || "";

          return {
            overflow,
            scrollWidth: doc.scrollWidth,
            innerWidth: window.innerWidth,
            sub12Text: sub12Text.slice(0, 10),
            hasBgToken: Boolean(bgToken),
            smallInputs,
            smallTargets: smallTargets.slice(0, 10),
            vpMeta,
            touchIcon,
            manifestHref,
            swCount,
            geoIssues,
          };
        },
        { isMobile: vp.name === "mobile", isPwa: checkPwa, shouldCheckSw: expectSw, isGeo: checkGeo }
      );

      if (metrics.overflow) {
        failures.push(`[${vp.name} ${route}] horizontal overflow: scrollWidth=${metrics.scrollWidth} > innerWidth=${metrics.innerWidth}`);
      }
      if (metrics.sub12Text.length) failures.push(`[${vp.name} ${route}] text <12px floor: ${metrics.sub12Text.join(", ")}`);
      if (!metrics.hasBgToken) failures.push(`[${vp.name} ${route}] missing --background CSS token`);
      if (checkGeo && vp.name === "desktop") {
        for (const issue of metrics.geoIssues) failures.push(`[geo ${route}] ${issue}`);
        if (!checkedLlmsTxt) {
          checkedLlmsTxt = true;
          const llmsUrl = new URL("/llms.txt", baseUrl).toString();
          const res = await page.request.get(llmsUrl);
          if (res.status() !== 200) {
            failures.push(`[geo /llms.txt] HTTP ${res.status()} at ${llmsUrl}`);
          } else {
            const body = (await res.text()).trim();
            if (!body.startsWith("#")) failures.push(`[geo /llms.txt] expected Markdown starting with '#' H1`);
          }
        }
      }

      if (vp.name === "mobile" && checkPwa) {
        if (!metrics.vpMeta.includes("viewport-fit=cover")) failures.push(`[mobile ${route}] missing viewport-fit=cover`);
        if (!metrics.touchIcon) failures.push(`[mobile ${route}] missing link[rel="apple-touch-icon"]`);
        if (!metrics.manifestHref) {
          failures.push(`[mobile ${route}] missing link[rel="manifest"]`);
        } else {
          const manifestUrl = new URL(metrics.manifestHref, url).toString();
          const res = await page.request.get(manifestUrl);
          if (res.status() !== 200) {
            failures.push(`[mobile ${route}] manifest HTTP ${res.status()} at ${manifestUrl}`);
          } else {
            try {
              const json = await res.json();
              if (!json.display || !json.start_url) {
                failures.push(`[mobile ${route}] manifest missing display/start_url`);
              }
            } catch {
              failures.push(`[mobile ${route}] manifest invalid JSON at ${manifestUrl}`);
            }
          }
        }
        if (metrics.smallInputs.length) failures.push(`[mobile ${route}] inputs <16px (iOS auto-zoom): ${metrics.smallInputs.join(", ")}`);
        if (metrics.smallTargets.length) failures.push(`[mobile ${route}] tap targets <44x44px: ${metrics.smallTargets.join(", ")}`);
      }

      if (expectSw && (!metrics.swCount || metrics.swCount < 1)) {
        failures.push(`[${vp.name} ${route}] --expect-sw set but 0 service workers registered`);
      }

      if (runInteractions) {
        try {
          await runInteractions(page, { viewport: vp.name, route, baseUrl });
        } catch (err) {
          failures.push(`[${vp.name} ${route}] interaction hook failed: ${err instanceof Error ? err.message : String(err)}`);
        }
      }

      // Check runtime/network errors after interactions so interactive failures are caught too.
      if (consoleErrors.length) failures.push(`[${vp.name} ${route}] console.error: ${consoleErrors.join(" | ")}`);
      if (pageErrors.length) failures.push(`[${vp.name} ${route}] pageerror: ${pageErrors.join(" | ")}`);
      if (httpErrors.length) failures.push(`[${vp.name} ${route}] HTTP >=400: ${httpErrors.join(" | ")}`);

      if (AxeBuilder) {
        const axeResults = await new AxeBuilder({ page }).analyze();
        const serious = axeResults.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
        if (serious.length) {
          failures.push(`[${vp.name} ${route}] axe-core violations: ${serious.map((v) => `${v.id}(${v.impact})`).join(", ")}`);
        }
      }

      const safeRoute = route === "/" ? "root" : route.replace(/[^a-z0-9]+/gi, "_");
      await page.screenshot({ path: path.join(outDir, `${vp.name}_${safeRoute}.png`), fullPage: true });
      await page.close();
    }
    await context.close();
  }
} finally {
  await browser.close();
}

if (failures.length) {
  console.error("PLAYWRIGHT AUDIT FAILED:");
  for (const f of failures) console.error(" - " + f);
  process.exit(1);
}

console.log(`PLAYWRIGHT AUDIT PASSED (${routes.length} routes x ${viewports.length} viewports, axe=${Boolean(AxeBuilder)}, pwa=${checkPwa}, geo=${checkGeo}, interactions=${Boolean(runInteractions)}).`);

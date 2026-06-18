// Post-deploy smoke test: fail the deploy if the live site is wired to the
// Firebase emulator instead of production. Catches the "127.0.0.1 refused to
// connect" class of bug (a dev/emulator bundle shipped to prod) before users do.
//
// Usage: node scripts/post-deploy-smoke.mjs [url]
//   url defaults to https://sneat.app
import { chromium } from '@playwright/test';

const url = process.argv[2] || 'https://sneat.app';
const loginUrl = url.replace(/\/$/, '') + '/login';

const browser = await chromium.launch();
const page = await browser.newPage();

const emulatorHits = [];
page.on('request', (r) => {
  if (/127\.0\.0\.1|:9099|:8080|localhost/.test(r.url())) {
    emulatorHits.push(r.url().slice(0, 80));
  }
});
const consoleErrors = [];
page.on('console', (m) => {
  if (m.type() === 'error') consoleErrors.push(m.text());
});

console.log(`Smoke: loading ${loginUrl}`);
await page.goto(loginUrl, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(4000);

// Trigger the auth flow (where the emulator iframe would load if misconfigured).
try {
  await page.getByText(/google/i).first().click({ timeout: 5000 });
  await page.waitForTimeout(6000);
} catch {
  // No Google control found is itself suspicious, but the request check below
  // is the real assertion.
}

await browser.close();

const emulatorMisconfig = consoleErrors.some((e) =>
  /Emulator config present on a non-localhost host/.test(e),
);

if (emulatorHits.length || emulatorMisconfig) {
  console.error('❌ SMOKE FAILED: production site is using the Firebase emulator.');
  if (emulatorHits.length) {
    console.error('   emulator/localhost requests:');
    emulatorHits.forEach((u) => console.error('     - ' + u));
  }
  if (emulatorMisconfig) {
    console.error('   init-firebase logged the non-localhost emulator guard.');
  }
  process.exit(1);
}

console.log('✅ SMOKE PASSED: no emulator/localhost traffic; production config active.');

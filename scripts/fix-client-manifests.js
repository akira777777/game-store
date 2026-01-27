const fs = require('fs');
const path = require('path');

// Copies the top-level client-reference manifest into nested route groups
// to work around missing files that Vercel CLI expects for App Router pages.
const base = path.join(process.cwd(), '.next', 'server', 'app', '[locale]');
const source = path.join(base, 'page_client-reference-manifest.js');

const targets = [
  path.join(base, '(store)', 'page_client-reference-manifest.js'),
  path.join(base, '(admin)', 'page_client-reference-manifest.js'),
  path.join(base, '(auth)', 'page_client-reference-manifest.js'),
];

if (!fs.existsSync(source)) {
  console.warn(`[fix-client-manifests] Source manifest not found: ${source}`);
  process.exit(0);
}

for (const target of targets) {
  const dir = path.dirname(target);
  if (!fs.existsSync(dir)) continue;
  if (fs.existsSync(target)) continue;

  try {
    fs.copyFileSync(source, target);
    console.log(`[fix-client-manifests] Copied manifest to ${target}`);
  } catch (err) {
    console.warn(`[fix-client-manifests] Failed to copy to ${target}:`, err.message);
  }
}

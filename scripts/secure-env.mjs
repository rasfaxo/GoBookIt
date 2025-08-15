// scripts/secure-env.mjs
// Move server-side secrets from .env.local into .env.local.local and replace with placeholders.
import fs from 'fs';
import path from 'path';

const root = path.resolve('.');
const envPath = path.join(root, '.env.local');
const backupPath = path.join(root, '.env.local.bak');
const securePath = path.join(root, '.env.local.local');

if (!fs.existsSync(envPath)) {
  console.error('.env.local not found, aborting.');
  process.exit(1);
}

// Backup
fs.copyFileSync(envPath, backupPath);
console.log('Backed up .env.local to .env.local.bak');

const raw = fs.readFileSync(envPath, 'utf8');
const lines = raw.split(/\r?\n/);

const serverKeys = new Set([
  'APPWRITE_API_KEY',
  'APPWRITE_ENDPOINT',
  'APPWRITE_PROJECT',
  'NEXT_APPWRITE_API_KEY',
  'NEXT_APPWRITE_KEY',
  'NEXT_APPWRIT_KEY',
]);

const secureLines = [];
const newLines = [];

for (const line of lines) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) {
    newLines.push(line);
    continue;
  }
  const idx = line.indexOf('=');
  if (idx === -1) {
    newLines.push(line);
    continue;
  }
  const key = line.slice(0, idx).trim();
  const val = line.slice(idx + 1);
  if (serverKeys.has(key)) {
    secureLines.push(`${key}=${val}`);
    newLines.push(`${key}=__MOVED_TO_.env.local.local__`);
  } else {
    newLines.push(line);
  }
}

if (secureLines.length > 0) {
  fs.writeFileSync(securePath, secureLines.join('\n') + '\n', { flag: 'w' });
  fs.writeFileSync(envPath, newLines.join('\n'));
  console.log('Moved server-side secrets to .env.local.local and updated .env.local');
  console.log(
    'Wrote .env.local.local with server-only keys. Make sure .env.local.local is in .gitignore'
  );
} else {
  console.log('No server-side keys found to move.');
}

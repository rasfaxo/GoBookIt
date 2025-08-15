// scripts/check-appwrite.mjs
// Simple smoke test that reads .env.local (if present) and tries to list documents from Appwrite
import fs from 'fs';
import { Client, Databases } from 'node-appwrite';

// Load .env.local manually (non-invasive)
try {
  let envPath = new URL('../.env.local', import.meta.url).pathname;
  try {
    envPath = decodeURIComponent(envPath);
  } catch (e) {
    /* ignore */
  }
  // On Windows the pathname can start with a leading slash like /D:/... — strip it
  if (/^\/[A-Za-z]:\//.test(envPath)) {
    envPath = envPath.slice(1);
  }
  console.log('Checking env path:', envPath);
  console.log('cwd:', process.cwd());
  if (fs.existsSync(envPath)) {
    const raw = fs.readFileSync(envPath, 'utf8');
    raw.split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const idx = trimmed.indexOf('=');
      if (idx === -1) return;
      const key = trimmed.slice(0, idx).trim();
      let val = trimmed.slice(idx + 1).trim();
      // remove inline comments (e.g. "value  # comment") and surrounding quotes
      val = val.replace(/\s+#.*$/, '').trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = val;
    });
  } else {
    console.log('.env.local not found at', envPath);
  }
  // Also try loading .env.local.local (server-only secrets)
  try {
    let envLocalLocal = new URL('../.env.local.local', import.meta.url).pathname;
    try {
      envLocalLocal = decodeURIComponent(envLocalLocal);
    } catch (e) {}
    if (/^\/[A-Za-z]:\//.test(envLocalLocal)) envLocalLocal = envLocalLocal.slice(1);
    if (fs.existsSync(envLocalLocal)) {
      console.log('Also loading server-only env:', envLocalLocal);
      const raw2 = fs.readFileSync(envLocalLocal, 'utf8');
      raw2.split(/\r?\n/).forEach((line) => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) return;
        const idx = trimmed.indexOf('=');
        if (idx === -1) return;
        const key = trimmed.slice(0, idx).trim();
        let val = trimmed.slice(idx + 1).trim();
        val = val.replace(/\s+#.*$/, '').trim();
        if (
          (val.startsWith('"') && val.endsWith('"')) ||
          (val.startsWith("'") && val.endsWith("'"))
        ) {
          val = val.slice(1, -1);
        }
        // For server-only secrets, always override placeholders from .env.local
        process.env[key] = val;
      });
    }
  } catch (e) {
    // ignore
  }
} catch (e) {
  console.error('Error loading .env.local', e);
  // ignore
}

const endpoint = process.env.APPWRITE_ENDPOINT || process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const project = process.env.APPWRITE_PROJECT || process.env.NEXT_PUBLIC_APPWRITE_PROJECT;
const apiKey =
  process.env.APPWRITE_API_KEY ||
  process.env.NEXT_APPWRITE_API_KEY ||
  process.env.NEXT_APPWRITE_KEY ||
  process.env.NEXT_PUBLIC_APPWRITE_API_KEY;

if (!endpoint || !project || !apiKey) {
  console.error(
    'Missing required Appwrite env vars. Please set APPWRITE_ENDPOINT, APPWRITE_PROJECT and APPWRITE_API_KEY or NEXT_APPWRITE_API_KEY in .env.local'
  );
  process.exit(1);
}

const client = new Client().setEndpoint(endpoint).setProject(project).setKey(apiKey);
const databases = new Databases(client);

(async () => {
  try {
    const dbId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE;
    const collectionId = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS;
    console.log(
      'Using endpoint=',
      endpoint,
      'project=',
      project,
      'database=',
      dbId,
      'collection=',
      collectionId
    );
    const res = await databases.listDocuments(dbId, collectionId);
    console.log('Success: documents count=', res.documents?.length ?? 0);
    // Print small summary
    console.log(res.documents?.slice(0, 5).map((d) => ({ id: d.$id, title: d.name })));
    process.exit(0);
  } catch (err) {
    console.error('Appwrite request failed:');
    console.error(err);
    process.exit(2);
  }
})();

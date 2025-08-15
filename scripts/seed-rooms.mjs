// scripts/seed-rooms.mjs
// Seed rooms from constants/data/rooms.json into Appwrite collection (development use)
import fs from 'fs';
import path from 'path';
import { Client, Databases } from 'node-appwrite';

// Load .env.local similar to check-appwrite.mjs
const loadEnv = () => {
  try {
    let envPath = path.resolve(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
      const raw = fs.readFileSync(envPath, 'utf8');
      raw.split(/\r?\n/).forEach((line) => {
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
        if (!process.env[key]) process.env[key] = val;
      });
    }
  } catch (e) {
    console.warn('Failed to load .env.local', e);
  }
};

loadEnv();

const endpoint = process.env.APPWRITE_ENDPOINT || process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const project = process.env.APPWRITE_PROJECT || process.env.NEXT_PUBLIC_APPWRITE_PROJECT;
const apiKey =
  process.env.APPWRITE_API_KEY ||
  process.env.NEXT_APPWRITE_API_KEY ||
  process.env.NEXT_APPWRITE_KEY ||
  process.env.NEXT_PUBLIC_APPWRITE_API_KEY;

if (!endpoint || !project || !apiKey) {
  console.error('Missing required Appwrite env vars (endpoint/project/api key). See .env.local');
  process.exit(1);
}

const client = new Client().setEndpoint(endpoint).setProject(project).setKey(apiKey);
const databases = new Databases(client);

const dataPath = path.resolve(process.cwd(), 'constants', 'data', 'rooms.json');
if (!fs.existsSync(dataPath)) {
  console.error('rooms.json not found at', dataPath);
  process.exit(1);
}

const raw = fs.readFileSync(dataPath, 'utf8');
let rooms;
try {
  rooms = JSON.parse(raw);
} catch (e) {
  console.error('Failed to parse rooms.json', e);
  process.exit(1);
}

(async () => {
  const dbId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE;
  const collectionId = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS;
  if (!dbId || !collectionId) {
    console.error(
      'Please set NEXT_PUBLIC_APPWRITE_DATABASE and NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS in .env.local'
    );
    process.exit(1);
  }

  console.log(`Seeding ${rooms.length} rooms to ${dbId}/${collectionId}`);

  for (const r of rooms) {
    try {
      const docId = r.$id ? String(r.$id) : undefined;
      const payload = {
        ...r,
        sqft: r.sqft !== undefined ? String(r.sqft) : undefined,
        capacity: r.capacity !== undefined ? String(r.capacity) : undefined,
        price_per_hour: r.price_per_hour !== undefined ? String(r.price_per_hour) : undefined,
      };
      delete payload.$id;

      if (docId) {
        try {
          await databases.createDocument(dbId, collectionId, docId, payload);
          console.log('Created document', docId);
        } catch (err) {
          try {
            await databases.updateDocument(dbId, collectionId, docId, payload);
            console.log('Updated document', docId);
          } catch (upErr) {
            console.error('Failed to create or update document', docId, upErr);
          }
        }
      } else {
        const res = await databases.createDocument(dbId, collectionId, undefined, payload);
        console.log('Created document (new id)=', res.$id);
      }
    } catch (err) {
      console.error('Failed seeding entry', r, err);
    }
  }

  console.log('Seeding finished');
  process.exit(0);
})();

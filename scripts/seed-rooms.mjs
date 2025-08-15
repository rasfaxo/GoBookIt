import fs from 'fs';
import path from 'path';
import { Client, Databases, Storage, ID } from 'node-appwrite';
import axios from 'axios'; 
import FormData from 'form-data'; 


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

// Setup Appwrite client
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
const storage = new Storage(client);

// Load rooms data
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

// Function to upload image using direct HTTP request to Appwrite API
// This avoids the Node.js compatibility issues with the Appwrite SDK
async function uploadImageWithAxios(bucketId, filePath, fileName) {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const fileSize = fs.statSync(filePath).size;

    const formData = new FormData();
    formData.append('fileId', ID.unique());
    formData.append('file', fileBuffer, {
      filename: fileName,
      knownLength: fileSize,
    });

    const response = await axios.post(`${endpoint}/storage/buckets/${bucketId}/files`, formData, {
      headers: {
        ...formData.getHeaders(),
        'X-Appwrite-Project': project,
        'X-Appwrite-Key': apiKey,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Upload error:', error.response?.data || error.message);
    throw error;
  }
}

// Main function
(async () => {
  const dbId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE;
  const collectionId = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS;
  const bucketId = process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ROOMS;

  if (!dbId || !collectionId || !bucketId) {
    console.error(
      'Please set NEXT_PUBLIC_APPWRITE_DATABASE, NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS, and NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ROOMS in .env.local'
    );
    process.exit(1);
  }

  console.log(
    `Seeding ${rooms.length} rooms to ${dbId}/${collectionId} with images to bucket ${bucketId}`
  );

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

      // Upload local image to Appwrite Storage if available
      if (r.image && bucketId) {
        try {
          const localImagePath = path.resolve(
            process.cwd(),
            'public',
            'images',
            'rooms',
            String(r.image)
          );

          if (fs.existsSync(localImagePath)) {
            console.log(`Uploading image ${r.image} from ${localImagePath}`);

            // Use the custom upload function
            const uploaded = await uploadImageWithAxios(bucketId, localImagePath, r.image);

            if (uploaded && uploaded.$id) {
              payload.image = uploaded.$id;
              console.log('Successfully uploaded image:', r.image, '-> fileId:', uploaded.$id);
            }
          } else {
            console.warn('Local image not found:', localImagePath);
          }
        } catch (imgErr) {
          console.error('Image upload failed for', r.image, imgErr);
        }
      }

      // Create or update document in the database
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
        const res = await databases.createDocument(dbId, collectionId, ID.unique(), payload);
        console.log('Created document with new ID:', res.$id);
      }
    } catch (err) {
      console.error('Failed seeding entry', r, err);
    }
  }

  console.log('Seeding finished successfully');
  process.exit(0);
})();

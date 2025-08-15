'use server';
import { revalidatePath } from 'next/cache';
import { ID } from 'node-appwrite';

import checkAuth from '../auth/checkAuth';

import { createAdminClient } from '@/lib/appwrite';
import { parseCreateRoomForm, type CreateRoomInput } from '@/utils/validation';

export interface CreateRoomState {
  success?: boolean;
  error?: string;
}

// Helper: gather and validate environment configuration.
function getRoomEnvConfig() {
  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE;
  const collectionId = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS;
  if (!databaseId || !collectionId) {
    return { error: 'Room storage not configured' } as const;
  }
  return { databaseId, collectionId } as const;
}

// Helper: check if we have a valid image file to upload.
function hasValidImage(file: File | null | undefined): file is File {
  return !!file && file.size > 0 && file.name !== 'undefined';
}

// Helper: upload image and return new file id (or error message)
interface StorageClient {
  createFile: (bucketId: string, id: string, file: File) => Promise<{ $id: string }>;
}
async function uploadRoomImage(
  storage: StorageClient,
  file: File
): Promise<{ imageID?: string; error?: string }> {
  const bucketId = process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ROOMS;
  if (!bucketId) return { error: 'Storage bucket not configured' };
  try {
    const upload = await storage.createFile(bucketId, ID.unique(), file);
    return { imageID: (upload as { $id: string }).$id };
  } catch {
    return { error: 'Error uploading image' };
  }
}

// Helper: map the validated input to the DB document shape.
function mapCreateRoomToDocument(userId: string, input: CreateRoomInput, imageID?: string) {
  const doc: Record<string, unknown> = {
    user_id: userId,
    name: input.name,
    description: input.description,
    capacity: input.capacity,
    location: input.location,
    address: input.address,
    availability: input.availability,
    price_per_hour: input.price_per_hour,
    amenities: input.amenities,
    image: imageID,
  };

  // Convert numbers to string and truncate to be safe.
  if (input.sqft !== undefined && input.sqft !== null) {
    const sqftStr = String(input.sqft).slice(0, 25);
    doc.sqft = sqftStr;
  }

  // Ensure capacity and price_per_hour are strings to match Appwrite schema.
  if (input.capacity !== undefined && input.capacity !== null) {
    doc.capacity = String(input.capacity).slice(0, 25);
  }

  if (input.price_per_hour !== undefined && input.price_per_hour !== null) {
    doc.price_per_hour = String(input.price_per_hour).slice(0, 25);
  }

  return doc;
}

function isErrorMessageAvailable(err: unknown): err is { response: unknown } {
  return typeof err === 'object' && err !== null && 'response' in err;
}

function isStringMessageAvailableInResponse(resp: unknown): resp is { message: string } {
  return (
    typeof resp === 'object' &&
    resp !== null &&
    'message' in resp &&
    typeof (resp as any).message === 'string'
  );
}

function formatUnknownError(err: unknown): string {
  if (isErrorMessageAvailable(err)) {
    const resp = (err as { response: unknown }).response;
    if (isStringMessageAvailableInResponse(resp)) {
      return (resp as { message: string }).message;
    }
  }
  return 'An unexpected error has occurred';
}

// Server Action: receives previous state and form data, returns new state
export default async function createRoom(
  _prev: CreateRoomState,
  formData: FormData
): Promise<CreateRoomState> {
  const { user } = await checkAuth();
  if (!user) return { error: 'You must be logged in to create a room' };

  const parsed = parseCreateRoomForm(formData);
  if ('error' in parsed) return { error: parsed.error };

  const envConfig = getRoomEnvConfig();
  if ('error' in envConfig) return { error: envConfig.error };

  try {
    const { databases, storage } = await createAdminClient();

    let imageID: string | undefined;
    if (hasValidImage(parsed.image)) {
      const uploadResult = await uploadRoomImage(storage, parsed.image);
      if (uploadResult.error) return { error: uploadResult.error };
      imageID = uploadResult.imageID;
    }

    await databases.createDocument(
      envConfig.databaseId,
      envConfig.collectionId,
      ID.unique(),
      mapCreateRoomToDocument(user.id, parsed, imageID)
    );

    revalidatePath('/', 'layout');
    return { success: true };
  } catch (err) {
    return { error: formatUnknownError(err) };
  }
}

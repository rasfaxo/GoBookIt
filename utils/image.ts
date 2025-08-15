// Helpers for building image URLs for Appwrite storage and fallback behavior
export type BuildAppwriteImageUrlArgs = {
  bucketId?: string | null;
  projectId?: string | null;
  fileId?: string | null | undefined;
  endpoint?: string | null;
};

export function buildAppwriteImageUrl({
  bucketId,
  projectId,
  fileId,
  endpoint,
}: BuildAppwriteImageUrlArgs): string | null {
  // If no file specified, nothing to build
  if (!fileId) return null;

  const ep = (endpoint || process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || '').toString();
  const b = (bucketId || process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ROOMS || '').toString();
  const p = (projectId || process.env.NEXT_PUBLIC_APPWRITE_PROJECT || '').toString();

  if (!ep || !b || !p) return null;

  // Ensure no trailing slashes on the endpoint
  const base = ep.replace(/\/+$|\/$/g, '').replace(/\\/g, '/');

  // Appwrite storage file view endpoint (endpoint may already include /v1)
  return (
    base +
    '/storage/buckets/' +
    encodeURIComponent(b) +
    '/files/' +
    encodeURIComponent(String(fileId)) +
    '/view?project=' +
    encodeURIComponent(p)
  );
}

export function getFallbackImage(): string {
  // Public fallback image in /public/images/no-image.jpg
  return '/images/no-image.jpg';
}

export function shouldBypassNextImageOptimization(): boolean {
  // If env flag set to 1 (or any truthy non-zero string), bypass Next/Image optimization.
  const v = process.env.NEXT_PUBLIC_BYPASS_IMAGE_OPT;
  return !!v && v !== '0';
}

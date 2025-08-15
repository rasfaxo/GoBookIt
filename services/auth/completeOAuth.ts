// Service: completeOAuth
// Responsibility: Finalize OAuth sign-in by exchanging Appwrite session for JWT and persisting session cookie via internal API.

async function fetchJWT(endpoint: string, project: string): Promise<string> {
  const jwtRes = await fetch(`${endpoint}/account/jwt`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Appwrite-Project': project,
    },
    credentials: 'include',
  });

  if (!jwtRes.ok) {
    throw new Error('Failed to create JWT');
  }

  const { jwt } = await jwtRes.json();
  if (!jwt) throw new Error('No JWT returned');

  return jwt;
}

async function persistJWT(jwt: string): Promise<{ ok: boolean }> {
  const persistRes = await fetch('/api/auth/oauth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jwt }),
  });

  if (!persistRes.ok) {
    throw new Error('Failed to persist session');
  }

  return { ok: true };
}

function validateEnv(endpoint?: string, project?: string): void {
  if (!endpoint || !project) {
    throw new Error('Missing Appwrite OAuth env configuration');
  }
}

export default async function completeOAuthClient(): Promise<{ ok: boolean }> {
  const rawEndpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || '';
  const endpoint = rawEndpoint.replace(/\/$/, '');
  const project = process.env.NEXT_PUBLIC_APPWRITE_PROJECT;

  validateEnv(endpoint, project);

  // Exchange current Appwrite session (from provider redirect) for a JWT
  const jwt = await fetchJWT(endpoint, project!);

  // Persist JWT on server (httpOnly cookie) through our internal API route
  const result = await persistJWT(jwt);

  return result;
}

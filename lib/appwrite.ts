import { Client, Databases, Account, Storage, Users } from 'node-appwrite';

const getApiKey = () =>
  process.env.APPWRITE_API_KEY ||
  process.env.NEXT_APPWRITE_API_KEY ||
  process.env.NEXT_APPWRITE_KEY ||
  process.env.NEXT_APPWRIT_KEY ||
  undefined;

export const createAdminClient = () => {
  const endpoint = process.env.APPWRITE_ENDPOINT || process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
  const project = process.env.APPWRITE_PROJECT || process.env.NEXT_PUBLIC_APPWRITE_PROJECT;
  if (!endpoint || !project)
    throw new Error('Missing Appwrite env configuration (endpoint/project)');

  const key = getApiKey();
  if (!key)
    throw new Error(
      'Missing Appwrite API key for admin client (APPWRITE_API_KEY or NEXT_APPWRITE_API_KEY)'
    );

  const client = new Client()
    .setEndpoint(String(endpoint))
    .setProject(String(project))
    .setKey(String(key));

  return {
    client,
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
    get storage() {
      return new Storage(client);
    },
    get users() {
      return new Users(client);
    },
  };
};

export const createPublicClient = () => {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
  const project = process.env.NEXT_PUBLIC_APPWRITE_PROJECT;
  if (!endpoint || !project) throw new Error('Missing public Appwrite env configuration');
  const client = new Client().setEndpoint(endpoint).setProject(project);
  return {
    client,
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
    get storage() {
      return new Storage(client);
    },
  };
};

//Create a session-authenticated client using a JWT token (server-side usage).
export const createSessionClient = (token?: string) => {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
  const project = process.env.NEXT_PUBLIC_APPWRITE_PROJECT;
  if (!endpoint || !project) throw new Error('Missing Appwrite env configuration');
  const client = new Client().setEndpoint(endpoint).setProject(project);
  if (token) client.setJWT(token);
  return {
    client,
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
  };
};


//Create a session client using a secret token (for server-side operations).
//This is used for operations that require an authenticated session.
export const createSecretSessionClient = createSessionClient;
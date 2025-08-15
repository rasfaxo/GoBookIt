export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  currentUser: AuthUser | null;
}

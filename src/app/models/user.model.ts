export type UserRole = 'admin' | 'customer';
export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  message: string;
  user: User;
}
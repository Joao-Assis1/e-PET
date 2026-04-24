export interface IUser {
  id: string;
  name: string;
  email: string;
  role: 'ACS' | 'DOCTOR' | 'ADMIN';
}

export interface IAuthState {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface ILoginResponse {
  user: IUser;
  access_token: string;
}

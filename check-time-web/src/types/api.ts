export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    name: string;
    registration: string;
    role: 'ADMIN' | 'EMPLOYEE';
  };
}

export interface LoginRequest {
  registration: string;
  password: string;
} 
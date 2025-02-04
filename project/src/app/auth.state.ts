export interface AuthState {
    user: { name: string; email: string; role: string } | null;
  }
  
  export const initialState: AuthState = {
    user: null,
  };
  
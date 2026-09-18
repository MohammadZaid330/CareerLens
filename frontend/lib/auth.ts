import { api } from './api';

export interface UserSession {
  user_id: number;
  email: string;
  full_name: string;
  role: 'student' | 'recruiter' | 'admin';
  access_token: string;
}

export const saveSession = (session: UserSession) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('careerlens_token', session.access_token);
    localStorage.setItem('careerlens_user', JSON.stringify(session));
  }
};

export const getSession = (): UserSession | null => {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('careerlens_user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {        return null;
      }
    }
  }
  return null;
};

export const clearSession = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('careerlens_token');
    localStorage.removeItem('careerlens_user');
  }
};

export const loginDemoAccount = async (role: 'student' | 'recruiter' | 'admin'): Promise<UserSession> => {
  const res = await api.post(`/auth/demo-login/${role}`);
  const session: UserSession = res.data;
  saveSession(session);
  return session;
};

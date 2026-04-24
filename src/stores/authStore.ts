import { defineStore } from 'pinia';
import api from '@/services/api';
import { jwtDecode } from 'jwt-decode';
import type { IAuthState, ILoginResponse, IUser } from '@/types/auth';

export const useAuthStore = defineStore('auth', {
  state: (): IAuthState => {
    const storedUser = localStorage.getItem('user');
    let user = null;
    
    if (storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
      try {
        user = JSON.parse(storedUser);
      } catch (e) {
        console.error('Error parsing stored user:', e);
        localStorage.removeItem('user');
      }
    }

    return {
      user,
      token: localStorage.getItem('token'),
      isAuthenticated: !!localStorage.getItem('token'),
      loading: false,
      error: null,
    };
  },

  actions: {
    async login(cpf: string, senha: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.post<ILoginResponse>('/login', { cpf, senha });
        const { access_token, user } = response.data;

        this.token = access_token;
        this.user = user;
        this.isAuthenticated = true;

        localStorage.setItem('token', access_token);
        localStorage.setItem('user', JSON.stringify(user));

        return true;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Erro ao realizar login';
        return false;
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.token = null;
      this.user = null;
      this.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },

    checkAuth() {
      const token = localStorage.getItem('token');
      if (!token || token === 'undefined' || token === 'null') {
        this.logout();
        return false;
      }
      try {
        const decoded: any = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          this.logout();
          return false;
        }
        this.isAuthenticated = true;
        return true;
      } catch (e) {
        console.error('Invalid token found:', e);
        this.logout();
        return false;
      }
    }
  }
});

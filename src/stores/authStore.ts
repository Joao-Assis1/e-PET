import type { IAuthState, ILoginResponse, IUser } from '@/types/auth'
import { jwtDecode } from 'jwt-decode'
import { defineStore } from 'pinia'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', {
  state: (): IAuthState => {
    const storedUser = localStorage.getItem('user')
    let user = null

    if (storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
      try {
        user = JSON.parse(storedUser)
      } catch (error) {
        console.error('Error parsing stored user:', error)
        localStorage.removeItem('user')
      }
    }

    return {
      user,
      token: null, // Token agora gerenciado via HttpOnly Cookie
      isAuthenticated: !!user,
      loading: false,
      error: null,
    }
  },

  actions: {
    async login (cpf: string, senha: string) {
      this.loading = true
      this.error = null
      try {
        const response = await api.post<ILoginResponse>('/login', { cpf, senha })
        // O token é recebido via cookie 'Set-Cookie', não mais no corpo (corpo contém apenas dados do usuário)
        const user = response.data.user || (response.data as any)

        this.user = user
        this.isAuthenticated = true

        localStorage.setItem('user', JSON.stringify(user))

        return true
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Erro ao realizar login'
        return false
      } finally {
        this.loading = false
      }
    },

    logout () {
      this.token = null
      this.user = null
      this.isAuthenticated = false
      localStorage.removeItem('user')
      // Nota: Para remover o cookie HttpOnly, o backend precisaria de uma rota de /logout
    },

    checkAuth () {
      // Como não podemos ler o HttpOnly Cookie via JS, confiamos na presença do usuário no state
      // Uma verificação robusta envolveria uma chamada api.get('/auth/me')
      return this.isAuthenticated
    },
  },
})

import { defineStore } from 'pinia'
import { syncService } from '@/services/syncService'

export const useSyncStore = defineStore('sync', {
  state: () => ({
    isSyncing: false,
    lastSync: localStorage.getItem('lastSync') || null,
    error: null as string | null,
    progress: 0,
  }),

  actions: {
    async startSync () {
      this.isSyncing = true
      this.error = null
      try {
        await syncService.performInitialSync()
        this.lastSync = new Date().toISOString()
        localStorage.setItem('lastSync', this.lastSync)
      } catch (error: any) {
        this.error = error.message || 'Erro durante a sincronização'
      } finally {
        this.isSyncing = false
      }
    },
  },
})

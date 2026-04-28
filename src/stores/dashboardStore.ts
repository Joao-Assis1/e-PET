import type { IDashboardFilters, IDashboardStats, IPriorityCitizen } from '@/types/dashboard'
import { defineStore } from 'pinia'
import { dashboardService } from '@/services/dashboardService'

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    stats: null as IDashboardStats | null,
    priorityCitizens: [] as IPriorityCitizen[],
    neighborhoods: [] as string[],
    filters: {
      startDate: undefined,
      endDate: undefined,
      neighborhood: undefined,
      visitOutcome: undefined,
    } as IDashboardFilters,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchStats () {
      this.loading = true
      try {
        const [stats, citizens] = await Promise.all([
          dashboardService.getDashboardStats(this.filters),
          dashboardService.getPriorityCitizens(this.filters),
        ])
        this.stats = stats
        this.priorityCitizens = citizens
      } catch (error: any) {
        this.error = 'Erro ao carregar dados do dashboard'
        console.error(error)
      } finally {
        this.loading = false
      }
    },

    async fetchNeighborhoods () {
      try {
        this.neighborhoods = await dashboardService.getNeighborhoods()
      } catch (error) {
        console.error('Erro ao carregar bairros', error)
      }
    },

    setFilters (newFilters: Partial<IDashboardFilters>) {
      this.filters = { ...this.filters, ...newFilters }
      this.fetchStats()
    },
  },
})

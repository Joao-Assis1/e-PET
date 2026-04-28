import type { IDashboardFilters, IDashboardStats, IPriorityCitizen } from '@/types/dashboard'
import api from './api'

export const dashboardService = {
  async getDashboardStats (filters: IDashboardFilters): Promise<IDashboardStats> {
    const response = await api.get<IDashboardStats>('/dashboard/stats', { params: filters })
    return response.data
  },

  async getPriorityCitizens (filters: IDashboardFilters): Promise<IPriorityCitizen[]> {
    const response = await api.get<IPriorityCitizen[]>('/dashboard/priority-citizens', { params: filters })
    return response.data
  },

  async getNeighborhoods (): Promise<string[]> {
    const response = await api.get<string[]>('/dashboard/neighborhoods')
    return response.data
  },
}

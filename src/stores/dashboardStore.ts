import type { IDashboardFilters, IDashboardStats, IPriorityCitizen } from '@/types/dashboard'
import { defineStore } from 'pinia'
import { db } from '@/services/localDb'

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
        // 1. Fetch all data from LocalDB
        let families = await db.families.toArray()
        let citizens = await db.citizens.toArray()
        const conditions = await db.health_conditions.toArray()

        // 2. Apply filters (Neighborhood)
        if (this.filters.neighborhood) {
          const filteredCitizens = citizens.filter(c => c.neighborhood === this.filters.neighborhood)
          const citizenFamilyIds = new Set(filteredCitizens.map(c => c.familyId))
          families = families.filter(f => citizenFamilyIds.has(f.id))
          citizens = filteredCitizens
        }

        // 3. Aggregate Risk Distribution (from Families)
        const riskDistribution = { R0: 0, R1: 0, R2: 0, R3: 0 }
        families.forEach(f => {
          if (f.riskClass === 'R0') riskDistribution.R0++
          else if (f.riskClass === 'R1') riskDistribution.R1++
          else if (f.riskClass === 'R2') riskDistribution.R2++
          else if (f.riskClass === 'R3') riskDistribution.R3++
        })

        // 4. Aggregate Vulnerability Factors (Sentinels from Families)
        const vulnerabilityFactors = {
          bedridden: families.reduce((acc, f) => acc + (f.bedriddenCount || 0), 0),
          illiterate: families.reduce((acc, f) => acc + (f.illiterateCount || 0), 0),
          physicalDisability: families.reduce((acc, f) => acc + (f.physicalDisabilityCount || 0), 0),
          mentalDisability: families.reduce((acc, f) => acc + (f.mentalDisabilityCount || 0), 0),
          severeMalnutrition: families.reduce((acc, f) => acc + (f.severeMalnutritionCount || 0), 0),
        }

        // 5. Aggregate Health Conditions
        const healthConditions = {
          hypertension: families.reduce((acc, f) => acc + (f.hypertensionCount || 0), 0),
          diabetes: families.reduce((acc, f) => acc + (f.diabetesCount || 0), 0),
          pregnant: conditions.filter(c => c.label.toLowerCase().includes('gestante')).length,
          mentalIllness: families.reduce((acc, f) => acc + (f.mentalDisabilityCount || 0), 0),
          smoker: conditions.filter(c => c.label.toLowerCase().includes('fumante')).length,
          alcoholUser: conditions.filter(c => c.label.toLowerCase().includes('álcool')).length,
        }

        // 6. Set Stats
        this.stats = {
          totalCitizens: citizens.length,
          totalFamilies: families.length,
          activeHouseholds: new Set(families.map(f => f.householdId)).size,
          visitEfficiency: 85, // Placeholder for logic
          riskDistribution,
          vulnerabilityFactors,
          healthConditions,
        }

        // 7. Extract Priority Citizens (R2 and R3)
        this.priorityCitizens = citizens
          .filter(c => c.riskClass === 'R2' || c.riskClass === 'R3')
          .slice(0, 50)
          .map(c => ({
            id: c.id,
            name: c.name,
            cns: c.cns || '',
            riskClass: c.riskClass || 'Sem Risco',
            lastVisit: c.lastUpdate ? new Date(c.lastUpdate).toLocaleDateString() : 'N/A',
            conditions: conditions.filter(cond => cond.individualId === c.id).map(cond => cond.label),
          }))
      } catch (error: any) {
        this.error = 'Erro ao processar dados do dashboard localmente'
        console.error(error)
      } finally {
        this.loading = false
      }
    },

    async fetchNeighborhoods () {
      try {
        const citizens = await db.citizens.toArray()
        const neighborhoods = [...new Set(citizens.map(c => c.neighborhood).filter(Boolean))] as string[]
        this.neighborhoods = neighborhoods.sort()
      } catch (error) {
        console.error('Erro ao carregar bairros localmente', error)
      }
    },

    setFilters (newFilters: Partial<IDashboardFilters>) {
      this.filters = { ...this.filters, ...newFilters }
      this.fetchStats()
    },
  },
})

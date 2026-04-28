export interface IDashboardStats {
  totalCitizens: number
  totalFamilies: number
  activeHouseholds: number
  visitEfficiency: number
  riskDistribution: {
    R0: number
    R1: number
    R2: number
    R3: number
  }
  vulnerabilityFactors: {
    bedridden: number
    illiterate: number
    physicalDisability: number
    mentalDisability: number
    severeMalnutrition: number
  }
  healthConditions: {
    hypertension: number
    diabetes: number
    pregnant: number
    mentalIllness: number
    smoker: number
    alcoholUser: number
  }
}

export interface IDashboardFilters {
  startDate?: string
  endDate?: string
  neighborhood?: string
  visitOutcome?: 'Realizada' | 'Recusa' | 'Ausente'
}

export interface IPriorityCitizen {
  id: string
  name: string
  cns: string
  riskClass: string
  lastVisit: string
  conditions: string[]
}

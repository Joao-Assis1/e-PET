export interface ICitizen {
  id: string
  name: string
  cpf?: string
  cns?: string
  birthDate: string
  sex?: 'Masculino' | 'Feminino'
  genderIdentity?: string
  motherName?: string
  fatherName?: string
  nationality?: string
  birthMunicipality?: string
  phone?: string
  address?: string
  neighborhood?: string
  zipCode?: string
  isResponsible: boolean
  familyId?: string
  riskClass?: string
  riskScore?: number
  lastUpdate?: string
  responsibleUnit?: string
  responsibleTeam?: string
}

export interface IFamily {
  id: string
  householdId?: string
  familyCode: string
  riskScore?: number
  riskClass?: string
  bedriddenCount?: number
  physicalDisabilityCount?: number
  mentalDisabilityCount?: number
  severeMalnutritionCount?: number
  drugAddictionCount?: number
  unemployedCount?: number
  illiterateCount?: number
  under6MonthsCount?: number
  over70YearsCount?: number
  hypertensionCount?: number
  diabetesCount?: number
  basicSanitation?: boolean
}

export interface IHealthCondition {
  id: string
  individualId: string
  label: string
  value: any
  type?: string
  updatedAt?: string
}

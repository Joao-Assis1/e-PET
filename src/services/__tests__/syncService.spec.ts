import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { syncService } from '../syncService'
import { db } from '../localDb'

vi.mock('axios')
const mockedAxios = axios as vi.Mocked<typeof axios>

describe('syncService', () => {
  beforeEach(async () => {
    // Clear the database before each test
    await db.citizens.clear()
    await db.families.clear()
    await db.health_conditions.clear()
    
    // Setup token
    localStorage.setItem('token', 'fake-token')
    
    vi.clearAllMocks()
  })

  it('should fetch data from Neon and sync to local database', async () => {
    // Mock Neon API Responses
    const mockFamilies = [{ id: 'fam-1', numero_prontuario: 'PRONT-01', pontuacao_risco: 5, domicilio_id: 'dom-1' }]
    const mockIndividuals = [{ 
      id: 'ind-1', 
      nome_completo: 'João Silva', 
      cpf: '12345678900', 
      cartao_sus: '12345', 
      data_nascimento: '1990-01-01', 
      is_responsavel: true,
      familia_id: 'fam-1'
    }]
    const mockConditions = [{ 
      id: 'cond-1', 
      individual_id: 'ind-1', 
      label: 'Hipertensão', 
      value: true 
    }]

    mockedAxios.get.mockImplementation((url) => {
      if (url.includes('/families')) return Promise.resolve({ data: mockFamilies })
      if (url.includes('/individuals')) return Promise.resolve({ data: mockIndividuals })
      if (url.includes('/individual_health_conditions')) return Promise.resolve({ data: mockConditions })
      return Promise.reject(new Error('Unknown URL'))
    })

    const result = await syncService.performInitialSync()

    expect(result).toBe(true)
    
    // Verify Dexie storage
    const citizens = await db.citizens.toArray()
    expect(citizens).toHaveLength(1)
    expect(citizens[0].name).toBe('João Silva')
    expect(citizens[0].familyId).toBe('fam-1')

    const families = await db.families.toArray()
    expect(families).toHaveLength(1)
    expect(families[0].familyCode).toBe('PRONT-01')

    const conditions = await db.health_conditions.toArray()
    expect(conditions).toHaveLength(1)
    expect(conditions[0].label).toBe('Hipertensão')
  })

  it('should throw error if token is missing', async () => {
    localStorage.removeItem('token')
    await expect(syncService.performInitialSync()).rejects.toThrow('Token de autenticação não encontrado. Faça login novamente.')
  })
})

import type { ICitizen, IFamily, IHealthCondition } from '@/types/citizen'
import api from './api'
import { db } from './localDb'

export const syncService = {
  async performInitialSync () {
    try {
      console.log('Iniciando sincronização via Backend NestJS (Cookies HttpOnly)...')

      // 1. Chamar o endpoint especializado de sincronização inicial
      const response = await api.get('/sync/initial')

      if (!response.data || !response.data.data) {
        throw new Error('Resposta do servidor malformada: campo "data" não encontrado.')
      }

      const { individuals, families: rawFamilies } = response.data.data

      const citizens: ICitizen[] = []
      const conditions: IHealthCondition[] = [];

      (individuals || []).forEach((i: any) => {
        const mappedCitizen: ICitizen = {
          id: i.id,
          name: i.nome_completo || 'Sem Nome',
          cpf: i.cpf,
          cns: i.cartao_sus,
          birthDate: i.data_nascimento ? i.data_nascimento.split('T')[0] : '',
          sex: i.sexo,
          motherName: i.nome_mae,
          phone: i.telefone_celular,
          address: i.household?.logradouro || i.family?.household?.logradouro || '',
          neighborhood: i.household?.bairro || i.family?.household?.bairro || '',
          zipCode: i.household?.cep || i.family?.household?.cep || '',
          isResponsible: i.is_responsavel || false,
          familyId: i.family_id || i.family?.id,
          riskClass: i.classificacao_risco || 'Sem Risco',
          lastUpdate: i.updated_at,
        }
        citizens.push(mappedCitizen)

        // Extrair condições de saúde embutidas
        if (i.healthConditions) {
          const hc = i.healthConditions
          const mapping = [
            { key: 'diabetes', label: 'Diabetes' },
            { key: 'hipertensao_arterial', label: 'Hipertensão Arterial' },
            { key: 'insuficiencia_renal', label: 'Insuficiência Renal' },
            { key: 'doenca_respiratoria', label: 'Doença Respiratória' },
            { key: 'hanseniase', label: 'Hanseníase' },
            { key: 'tuberculose', label: 'Tuberculose' },
            { key: 'teve_cancer', label: 'Câncer' },
          ]

          for (const m of mapping) {
            if (hc[m.key]) {
              conditions.push({
                id: `${i.id}-${m.key}`,
                individualId: i.id,
                label: m.label,
                type: 'Condição Crônica',
                value: 'Identificado no prontuário.',
                updatedAt: i.updated_at,
              })
            }
          }
        }
      })

      console.log(`[Sync] Cidadãos mapeados: ${citizens.length}. Condições: ${conditions.length}.`)

      // 2. Mapear Famílias com Sentinelas Enriquecidas
      const families: IFamily[] = (rawFamilies || []).map((f: any) => ({
        id: f.id,
        familyCode: f.numero_prontuario || 'Sem Prontuário',
        riskScore: f.pontuacao_risco || 0,
        riskClass: f.classificacao_risco || 'Sem Risco',
        householdId: f.household_id || f.household?.id,
        created_at: f.created_at || new Date().toISOString(),
        bedriddenCount: f.sentinels?.bedriddenCount || 0,
        physicalDisabilityCount: f.sentinels?.physicalDisabilityCount || 0,
        mentalDisabilityCount: f.sentinels?.mentalDisabilityCount || 0,
        severeMalnutritionCount: f.sentinels?.severeMalnutritionCount || 0,
        drugAddictionCount: f.sentinels?.drugAddictionCount || 0,
        unemployedCount: f.sentinels?.unemployedCount || 0,
        illiterateCount: f.sentinels?.illiterateCount || 0,
        under6MonthsCount: f.sentinels?.under6MonthsCount || 0,
        over70YearsCount: f.sentinels?.over70YearsCount || 0,
        hypertensionCount: f.sentinels?.hypertensionCount || 0,
        diabetesCount: f.sentinels?.diabetesCount || 0,
        basicSanitation: f.sentinels ? f.sentinels.basicSanitation : !f.saneamento_inadequado,
      }))

      // Transação Atômica no IndexedDB
      console.log('[Sync] Iniciando gravação no IndexedDB...')
      await db.transaction('rw', [db.families, db.citizens, db.health_conditions], async () => {
        await db.families.clear()
        await db.citizens.clear()
        await db.health_conditions.clear()

        if (families.length > 0) {
          await db.families.bulkAdd(families)
        }
        if (citizens.length > 0) {
          await db.citizens.bulkAdd(citizens)
        }
        if (conditions.length > 0) {
          await db.health_conditions.bulkAdd(conditions)
        }
      })

      console.log('[Sync] Sincronização concluída com sucesso!')
      return true
    } catch (error: any) {
      console.error('Erro na sincronização:', error.response?.data || error.message)
      throw error
    }
  },
}

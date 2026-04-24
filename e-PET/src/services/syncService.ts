import axios from 'axios';
import { db } from './localDb';
import type { ICitizen, IFamily, IHealthCondition } from '@/types/citizen';

// Usamos a URL base da sua API NestJS
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const syncService = {
  async performInitialSync() {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Token de autenticação não encontrado. Faça login novamente.');

    const headers = {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    };

    try {
      console.log('Iniciando sincronização via Backend NestJS (Offline-First)...');

      // 1. Chamar o endpoint especializado de sincronização inicial
      const syncResponse = await axios.get(`${API_BASE_URL}/sync/initial`, { headers });
      const { individuals, families: rawFamilies } = syncResponse.data.data;

      const citizens: ICitizen[] = [];
      const conditions: IHealthCondition[] = [];

      (individuals || []).forEach((i: any) => {
        citizens.push({
          id: i.id,
          name: i.nome_completo,
          cpf: i.cpf,
          cns: i.cartao_sus,
          birthDate: i.data_nascimento,
          sex: i.sexo,
          motherName: i.nome_mae,
          phone: i.telefone,
          address: i.endereco,
          neighborhood: i.bairro,
          zipCode: i.cep,
          isResponsible: i.is_responsavel || false,
          familyId: i.family_id,
          riskClass: i.classificacao_risco,
          lastUpdate: i.updated_at
        });

        // Extrair condições de saúde embutidas
        if (i.healthConditions) {
          const hcArray = Array.isArray(i.healthConditions) ? i.healthConditions : [i.healthConditions];
          hcArray.forEach((hc: any) => {
             const mapping = [
              { key: 'diabetes', label: 'Diabetes' },
              { key: 'hipertensao_arterial', label: 'Hipertensão Arterial' },
              { key: 'insuficiencia_renal', label: 'Insuficiência Renal' },
              { key: 'doenca_respiratoria', label: 'Doença Respiratória' },
              { key: 'hanseniase', label: 'Hanseníase' },
              { key: 'tuberculose', label: 'Tuberculose' },
              { key: 'cancer', label: 'Câncer' }
            ];

            mapping.forEach(m => {
              if (hc[m.key]) {
                conditions.push({
                  id: `${i.id}-${m.key}`,
                  individualId: i.id,
                  label: m.label,
                  type: 'Condição Crônica',
                  value: 'Identificado no prontuário clínico.',
                  updatedAt: i.updated_at
                });
              }
            });
          });
        }
      });

      // 2. Mapear Famílias com Sentinelas Enriquecidas
      const families: IFamily[] = rawFamilies.map((f: any) => ({
        id: f.id,
        familyCode: f.numero_prontuario,
        riskScore: f.pontuacao_risco,
        riskClass: f.classificacao_risco,
        householdId: f.household_id,
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
        basicSanitation: f.sentinels ? f.sentinels.basicSanitation : !f.saneamento_inadequado
      }));

      // 3. Sincronizar Condições de Saúde Adicionais (Removido call redundante que gerava 400)
      console.log('Condições de saúde processadas via payload inicial.');

      // Transação Atômica no IndexedDB
      await db.transaction('rw', [db.families, db.citizens, db.health_conditions], async () => {
        await db.families.clear();
        await db.citizens.clear();
        await db.health_conditions.clear();

        await db.families.bulkAdd(families);
        await db.citizens.bulkAdd(citizens);
        if (conditions.length > 0) {
          await db.health_conditions.bulkAdd(conditions);
        }
      });

      console.log('Sincronização concluída com sucesso!');
      return true;
    } catch (error: any) {
      console.error('Erro na sincronização:', error.response?.data || error.message);
      throw error;
    }
  }
};

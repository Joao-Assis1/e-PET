import type { ICitizen } from '@/types/citizen'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import api from '@/services/api'

export const useCitizenStore = defineStore('citizen', () => {
  // State
  const citizen = ref<ICitizen | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const errorCode = ref<number | null>(null)

  // Getter: idade
  const idade = computed(() => {
    if (!citizen.value || !citizen.value.birthDate) {
      return 0
    }

    const dataNasc = new Date(citizen.value.birthDate)
    const hoje = new Date()

    let age = hoje.getFullYear() - dataNasc.getFullYear()
    const m = hoje.getMonth() - dataNasc.getMonth()

    if (m < 0 || (m === 0 && hoje.getDate() < dataNasc.getDate())) {
      age--
    }

    return age
  })

  // Action: fetchCitizenSummary
  async function fetchCitizenSummary (id: string) {
    loading.value = true
    error.value = null
    errorCode.value = null
    try {
      const response = await api.get<ICitizen>(`/individuals/${id}`)
      citizen.value = response.data
    } catch (error_: any) {
      errorCode.value = error_.response?.status || 500
      error.value = error_.response?.data?.message || 'Erro ao carregar resumo do cidadão'
      console.error('fetchCitizenSummary Error:', error_)
    } finally {
      loading.value = false
    }
  }

  return {
    citizen,
    loading,
    error,
    errorCode,
    idade,
    fetchCitizenSummary,
  }
})

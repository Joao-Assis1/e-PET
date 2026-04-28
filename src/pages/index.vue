<template>
  <v-container
    class="pa-4 pa-md-8 bg-background"
    fluid
    style="min-height: 100vh"
  >
    <!-- Top Stats / Header -->
    <v-row class="mb-4 align-center">
      <v-col cols="12" md="6">
        <div class="d-flex align-center">
          <v-avatar class="mr-4 elevation-2" color="primary" size="48">
            <v-icon color="white" icon="mdi-account-search" />
          </v-avatar>
          <div>
            <h1 class="text-h4 font-weight-black text-primary">Cidadãos</h1>
            <p class="text-subtitle-2 text-grey-darken-1">
              Gestão e busca de prontuários locais
            </p>
          </div>
        </div>
      </v-col>
      <v-col class="text-md-right" cols="12" md="6">
        <v-btn
          class="rounded-xl px-6"
          color="primary"
          :loading="syncStore.isSyncing"
          prepend-icon="mdi-sync"
          size="large"
          variant="elevated"
          @click="syncStore.startSync"
        >
          Sincronizar Dados
        </v-btn>
      </v-col>
    </v-row>

    <!-- Bento Grid Search Section -->
    <v-row class="mb-8">
      <v-col cols="12">
        <v-card border class="bento-card overflow-hidden">
          <div class="pa-1 bg-primary" />
          <v-card-text class="pa-6 pa-md-8">
            <v-row g="4">
              <!-- Main Search -->
              <v-col cols="12" md="6">
                <div class="field-label mb-2">Busca Principal</div>
                <v-text-field
                  v-model="search"
                  bg-color="grey-lighten-4"
                  class="search-input"
                  flat
                  hide-details
                  placeholder="Nome completo, CPF ou CNS"
                  prepend-inner-icon="mdi-magnify"
                  variant="solo"
                  @keyup.enter="performSearch"
                />
              </v-col>

              <!-- Secondary Filters -->
              <v-col cols="12" md="3" sm="6">
                <div class="field-label mb-2">Nascimento</div>
                <v-text-field
                  v-model="birthDateFilter"
                  v-maska="'##/##/####'"
                  density="comfortable"
                  hide-details
                  placeholder="00/00/0000"
                  prepend-inner-icon="mdi-calendar"
                  variant="outlined"
                />
              </v-col>

              <v-col cols="12" md="3" sm="6">
                <div class="field-label mb-2">Nome da Mãe</div>
                <v-text-field
                  v-model="motherNameFilter"
                  density="comfortable"
                  hide-details
                  placeholder="Busca parcial..."
                  prepend-inner-icon="mdi-human-female"
                  variant="outlined"
                />
              </v-col>
            </v-row>

            <div class="d-flex align-center justify-space-between mt-8">
              <div class="text-caption text-grey">
                <v-icon class="mr-1" size="14">mdi-information-outline</v-icon>
                Pressione Enter para buscar ou use o botão ao lado
              </div>
              <div class="d-flex gap-2">
                <v-btn
                  class="mr-2"
                  color="grey-darken-1"
                  variant="text"
                  @click="clearFilters"
                >
                  Limpar
                </v-btn>
                <v-btn
                  class="px-10 rounded-lg"
                  color="primary"
                  @click="performSearch"
                >
                  Filtrar Cidadãos
                </v-btn>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Content Area -->
    <div v-if="citizens.length > 0 || syncStore.isSyncing">
      <div class="d-flex align-center mb-6">
        <h2 class="text-h5 font-weight-bold text-grey-darken-4">
          {{
            syncStore.isSyncing
              ? "Atualizando registros..."
              : search
                ? "Resultados da Busca"
                : "Registros Recentes"
          }}
        </h2>
        <v-chip
          v-if="!syncStore.isSyncing"
          class="ml-4 font-weight-black"
          color="primary"
          size="small"
        >
          {{ filteredCitizens.length }}
        </v-chip>
      </div>

      <!-- Skeleton Grid -->
      <v-row v-if="syncStore.isSyncing">
        <v-col v-for="i in 4" :key="i" cols="12" md="6">
          <v-skeleton-loader
            class="rounded-xl border pa-4"
            type="list-item-avatar-three-line"
          />
        </v-col>
      </v-row>

      <!-- Results Cards -->
      <v-row v-else>
        <v-col
          v-for="citizen in filteredCitizens"
          :key="citizen.id"
          cols="12"
          lg="4"
          md="6"
        >
          <v-card
            border
            class="citizen-bento-card mb-4"
            hover
            @click="goToDetail(citizen.id)"
          >
            <v-card-text class="pa-5">
              <div class="d-flex align-start mb-4">
                <v-avatar
                  class="mr-4 rounded-lg"
                  :color="getRiskColor(citizen.riskClass) + '-lighten-5'"
                  size="56"
                >
                  <v-icon
                    :color="getRiskColor(citizen.riskClass)"
                    size="32"
                  >mdi-account</v-icon>
                </v-avatar>
                <div class="flex-grow-1 overflow-hidden">
                  <div
                    class="text-h6 font-weight-black text-truncate text-grey-darken-4 mb-0"
                  >
                    {{ citizen.name }}
                  </div>
                  <div class="d-flex align-center flex-wrap gap-2 mt-1">
                    <v-chip
                      class="font-weight-bold px-2"
                      :color="getRiskColor(getEffectiveRisk(citizen).label)"
                      size="x-small"
                      variant="flat"
                    >
                      {{ getEffectiveRisk(citizen).label }}
                    </v-chip>
                    <v-icon
                      v-if="getEffectiveRisk(citizen).source === 'familia'"
                      color="grey"
                      icon="mdi-account-group-outline"
                      size="14"
                      title="Risco herdado da família"
                    />
                    <span
                      class="text-caption text-grey-darken-1 font-weight-medium"
                    >
                      {{ calculateAge(citizen.birthDate) }} anos
                    </span>
                  </div>
                </div>
              </div>

              <v-divider class="mb-4 border-dashed" />

              <div class="citizen-info-grid">
                <div class="info-item">
                  <span class="info-label">CPF</span>
                  <span class="info-value">{{ citizen.cpf || "---" }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">CNS</span>
                  <span class="info-value">{{ citizen.cns || "---" }}</span>
                </div>
                <div class="info-item full-width">
                  <span class="info-label">Nome da Mãe</span>
                  <span class="info-value text-truncate">{{
                    citizen.motherName || "---"
                  }}</span>
                </div>
              </div>

              <div class="d-flex align-center justify-space-between mt-4 pt-2">
                <div class="text-caption text-grey">
                  Ref:
                  <span class="font-weight-bold text-grey-darken-1">{{
                    formatDate(citizen.lastUpdate || "")
                  }}</span>
                </div>
                <v-btn
                  class="rounded-lg font-weight-black px-4"
                  color="primary"
                  prepend-icon="mdi-file-eye-outline"
                  size="small"
                  variant="tonal"
                >
                  Prontuário
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Empty Results -->
        <v-col
          v-if="filteredCitizens.length === 0"
          class="text-center py-16"
          cols="12"
        >
          <v-icon class="mb-4" color="grey-lighten-2" size="80">mdi-account-off-outline</v-icon>
          <div class="text-h5 font-weight-bold text-grey">
            Cidadão não encontrado
          </div>
          <p class="text-body-2 text-grey-lighten-1">
            Verifique os dados ou tente uma nova sincronização
          </p>
        </v-col>
      </v-row>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-16 empty-state-container">
      <v-icon class="mb-6 opacity-20" color="primary" size="120">mdi-account-heart</v-icon>
      <h2 class="text-h5 font-weight-bold text-grey-darken-1 mb-2">
        Painel de Atendimento
      </h2>
      <p class="text-body-1 text-grey mb-8">
        Pesquise por nome, CPF ou CNS para acessar o prontuário eletrônico.
      </p>
      <v-btn
        class="rounded-xl px-12"
        color="primary"
        elevation="0"
        size="x-large"
        @click="performSearch"
      >
        Começar Atendimento
      </v-btn>
    </div>
  </v-container>
</template>

<script setup lang="ts">
  import type { ICitizen, IFamily } from '@/types/citizen'
  import { useObservable } from '@vueuse/rxjs'
  import { liveQuery } from 'dexie'
  import { computed, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { db } from '@/services/localDb'
  import { useSyncStore } from '@/stores/syncStore'

  const router = useRouter()
  const syncStore = useSyncStore()

  const search = ref('')
  const birthDateFilter = ref('')
  const motherNameFilter = ref('')
  const hasPerformedSearch = ref(false)

  const citizensRaw = useObservable<ICitizen[]>(
    liveQuery(() => db.citizens.toArray()) as any,
  )
  const citizens = computed(() => citizensRaw.value || [])

  const familiesRaw = useObservable<IFamily[]>(
    liveQuery(() => db.families.toArray()) as any,
  )
  const familiesMap = computed(() => {
    const map = new Map<string, IFamily>()
    for (const f of (familiesRaw.value || [])) map.set(f.id, f)
    return map
  })

  function getEffectiveRisk (citizen: ICitizen) {
    // Se o cidadão tem risco individual explícito, usa ele
    if (
      citizen.riskClass
      && citizen.riskClass !== 'Sem Risco'
      && citizen.riskClass !== 'Sem Classificação'
    ) {
      return { label: citizen.riskClass, source: 'individual' }
    }

    // Caso contrário, tenta pegar o da família
    const family = citizen.familyId
      ? familiesMap.value.get(citizen.familyId)
      : null
    if (
      family
      && family.riskClass
      && family.riskClass !== 'Sem Risco'
      && family.riskClass !== 'Sem Classificação'
    ) {
      return { label: family.riskClass, source: 'familia' }
    }

    return { label: 'Sem Classificação', source: 'none' }
  }

  const filteredCitizens = computed(() => {
    let result = citizens.value

    // Se não fez busca, mostra todos os sincronizados por padrão (limitado a 50 para performance)
    if (!search.value && !birthDateFilter.value && !motherNameFilter.value) {
      return result.slice(0, 50)
    }

    if (search.value) {
      const sNumbers = search.value.replace(/\D/g, '')
      const sLower = search.value.toLowerCase()
      result = result.filter(c => {
        const matchName = c.name.toLowerCase().includes(sLower)
        const matchCpf = sNumbers && c.cpf && c.cpf.includes(sNumbers)
        const matchCns = sNumbers && c.cns && c.cns.includes(sNumbers)
        return matchName || matchCpf || matchCns
      })
    }

    if (birthDateFilter.value && birthDateFilter.value.length === 10) {
      const [day, month, year] = birthDateFilter.value.split('/')
      const dateToMatch = `${year}-${month}-${day}`
      result = result.filter(
        c => c.birthDate && c.birthDate.startsWith(dateToMatch),
      )
    }

    if (motherNameFilter.value) {
      const mLower = motherNameFilter.value.toLowerCase()
      result = result.filter(
        c => c.motherName && c.motherName.toLowerCase().includes(mLower),
      )
    }

    return result
  })

  function performSearch () {
  // A busca agora é reativa via computed
  }

  function clearFilters () {
    search.value = ''
    birthDateFilter.value = ''
    motherNameFilter.value = ''
    hasPerformedSearch.value = false
  }

  function goToDetail (id: string) {
    router.push(`/citizen/${id}`)
  }

  function formatDate (dateStr: string) {
    if (!dateStr) return '---'
    const date = new Date(dateStr)
    return isNaN(date.getTime()) ? '---' : date.toLocaleDateString('pt-BR')
  }

  function calculateAge (birthDate: string) {
    if (!birthDate) return 0
    const birth = new Date(birthDate)
    const today = new Date()
    let age = today.getFullYear() - birth.getFullYear()
    const m = today.getMonth() - birth.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
    return age
  }

  function getRiskColor (risk?: string) {
    if (!risk) return 'grey'
    const r = risk.toUpperCase()
    if (r.includes('MÁXIMO') || r.includes('MAXIMO') || r.includes('R3')) return 'red-darken-4'
    if (r.includes('MÉDIO') || r.includes('MEDIO') || r.includes('R2')) return 'deep-orange-darken-2'
    if (r.includes('MENOR') || r.includes('R1')) return 'orange-darken-2'
    if (r.includes('BAIXO') || r.includes('R0') || r.includes('SEM RISCO')) return 'green-darken-2'
    return 'grey'
  }
</script>

<style scoped>
.bento-card {
  border-radius: 20px !important;
  box-shadow: 0 4px 20px -5px rgba(0, 0, 0, 0.05) !important;
  background: white;
}

.field-label {
  font-size: 0.75rem;
  font-weight: 800;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.search-input :deep(.v-field) {
  border-radius: 12px !important;
  font-size: 1.1rem;
}

.citizen-bento-card {
  border-radius: 16px !important;
  transition: all 0.3s ease;
  overflow: hidden;
}

.citizen-bento-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px -10px rgba(0, 0, 0, 0.12) !important;
  border-color: #004092 !important;
}

.citizen-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.info-item.full-width {
  grid-column: span 2;
}

.info-label {
  font-size: 0.65rem;
  font-weight: 700;
  color: #999;
  text-transform: uppercase;
}

.info-value {
  font-size: 0.85rem;
  font-weight: 700;
  color: #444;
}

.border-dashed {
  border-style: dashed !important;
}

.grayscale {
  filter: grayscale(1);
}

.opacity-20 {
  opacity: 0.2;
}

.gap-2 {
  gap: 8px;
}
</style>

<template>
  <v-container
    fluid
    class="pa-4 pa-md-8 bg-background"
    style="min-height: 100vh"
  >
    <!-- Top Stats / Header -->
    <v-row class="mb-4 align-center">
      <v-col cols="12" md="6">
        <div class="d-flex align-center">
          <v-avatar color="primary" size="48" class="mr-4 elevation-2">
            <v-icon icon="mdi-account-search" color="white"></v-icon>
          </v-avatar>
          <div>
            <h1 class="text-h4 font-weight-black text-primary">Cidadãos</h1>
            <p class="text-subtitle-2 text-grey-darken-1">
              Gestão e busca de prontuários locais
            </p>
          </div>
        </div>
      </v-col>
      <v-col cols="12" md="6" class="text-md-right">
        <v-btn
          color="primary"
          size="large"
          variant="elevated"
          prepend-icon="mdi-sync"
          :loading="syncStore.isSyncing"
          @click="syncStore.startSync"
          class="rounded-xl px-6"
        >
          Sincronizar Dados
        </v-btn>
      </v-col>
    </v-row>

    <!-- Bento Grid Search Section -->
    <v-row class="mb-8">
      <v-col cols="12">
        <v-card class="bento-card overflow-hidden" border>
          <div class="pa-1 bg-primary"></div>
          <v-card-text class="pa-6 pa-md-8">
            <v-row g="4">
              <!-- Main Search -->
              <v-col cols="12" md="6">
                <div class="field-label mb-2">Busca Principal</div>
                <v-text-field
                  v-model="search"
                  placeholder="Nome completo, CPF ou CNS"
                  prepend-inner-icon="mdi-magnify"
                  variant="solo"
                  flat
                  bg-color="grey-lighten-4"
                  class="search-input"
                  hide-details
                  @keyup.enter="performSearch"
                ></v-text-field>
              </v-col>

              <!-- Secondary Filters -->
              <v-col cols="12" sm="6" md="3">
                <div class="field-label mb-2">Nascimento</div>
                <v-text-field
                  v-model="birthDateFilter"
                  placeholder="00/00/0000"
                  prepend-inner-icon="mdi-calendar"
                  v-maska="'##/##/####'"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="3">
                <div class="field-label mb-2">Nome da Mãe</div>
                <v-text-field
                  v-model="motherNameFilter"
                  placeholder="Busca parcial..."
                  prepend-inner-icon="mdi-human-female"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                ></v-text-field>
              </v-col>
            </v-row>

            <div class="d-flex align-center justify-space-between mt-8">
              <div class="text-caption text-grey">
                <v-icon size="14" class="mr-1">mdi-information-outline</v-icon>
                Pressione Enter para buscar ou use o botão ao lado
              </div>
              <div class="d-flex gap-2">
                <v-btn
                  variant="text"
                  color="grey-darken-1"
                  @click="clearFilters"
                  class="mr-2"
                >
                  Limpar
                </v-btn>
                <v-btn
                  color="primary"
                  class="px-10 rounded-lg"
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
          color="primary"
          class="ml-4 font-weight-black"
          size="small"
        >
          {{ filteredCitizens.length }}
        </v-chip>
      </div>

      <!-- Skeleton Grid -->
      <v-row v-if="syncStore.isSyncing">
        <v-col v-for="i in 4" :key="i" cols="12" md="6">
          <v-skeleton-loader
            type="list-item-avatar-three-line"
            class="rounded-xl border pa-4"
          ></v-skeleton-loader>
        </v-col>
      </v-row>

      <!-- Results Cards -->
      <v-row v-else>
        <v-col
          v-for="citizen in filteredCitizens"
          :key="citizen.id"
          cols="12"
          md="6"
          lg="4"
        >
          <v-card
            @click="goToDetail(citizen.id)"
            class="citizen-bento-card mb-4"
            border
            hover
          >
            <v-card-text class="pa-5">
              <div class="d-flex align-start mb-4">
                <v-avatar
                  :color="getRiskColor(citizen.riskClass) + '-lighten-5'"
                  size="56"
                  class="mr-4 rounded-lg"
                >
                  <v-icon :color="getRiskColor(citizen.riskClass)" size="32"
                    >mdi-account</v-icon
                  >
                </v-avatar>
                <div class="flex-grow-1 overflow-hidden">
                  <div
                    class="text-h6 font-weight-black text-truncate text-grey-darken-4 mb-0"
                  >
                    {{ citizen.name }}
                  </div>
                  <div class="d-flex align-center flex-wrap gap-2 mt-1">
                    <v-chip
                      size="x-small"
                      :color="getRiskColor(getEffectiveRisk(citizen).label)"
                      variant="flat"
                      class="font-weight-bold px-2"
                    >
                      {{ getEffectiveRisk(citizen).label }}
                    </v-chip>
                    <v-icon
                      v-if="getEffectiveRisk(citizen).source === 'familia'"
                      icon="mdi-account-group-outline"
                      size="14"
                      color="grey"
                      title="Risco herdado da família"
                    ></v-icon>
                    <span
                      class="text-caption text-grey-darken-1 font-weight-medium"
                    >
                      {{ calculateAge(citizen.birthDate) }} anos
                    </span>
                  </div>
                </div>
              </div>

              <v-divider class="mb-4 border-dashed"></v-divider>

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
                  variant="tonal"
                  color="primary"
                  size="small"
                  class="rounded-lg font-weight-black px-4"
                  prepend-icon="mdi-file-eye-outline"
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
          cols="12"
          class="text-center py-16"
        >
          <v-icon size="80" color="grey-lighten-2" class="mb-4"
            >mdi-account-off-outline</v-icon
          >
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
      <v-icon size="120" color="primary" class="mb-6 opacity-20"
        >mdi-account-heart</v-icon
      >
      <h2 class="text-h5 font-weight-bold text-grey-darken-1 mb-2">
        Painel de Atendimento
      </h2>
      <p class="text-body-1 text-grey mb-8">
        Pesquise por nome, CPF ou CNS para acessar o prontuário eletrônico.
      </p>
      <v-btn
        color="primary"
        size="x-large"
        class="rounded-xl px-12"
        elevation="0"
        @click="performSearch"
      >
        Começar Atendimento
      </v-btn>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useSyncStore } from "@/stores/syncStore";
import { db } from "@/services/localDb";
import { useObservable } from "@vueuse/rxjs";
import { liveQuery } from "dexie";
import type { ICitizen, IFamily } from "@/types/citizen";

const router = useRouter();
const syncStore = useSyncStore();

const search = ref("");
const birthDateFilter = ref("");
const motherNameFilter = ref("");
const hasPerformedSearch = ref(false);

const citizensRaw = useObservable<ICitizen[]>(
  liveQuery(() => db.citizens.toArray()) as any,
);
const citizens = computed(() => citizensRaw.value || []);

const familiesRaw = useObservable<IFamily[]>(
  liveQuery(() => db.families.toArray()) as any,
);
const familiesMap = computed(() => {
  const map = new Map<string, IFamily>();
  (familiesRaw.value || []).forEach((f) => map.set(f.id, f));
  return map;
});

const getEffectiveRisk = (citizen: ICitizen) => {
  // Se o cidadão tem risco individual explícito, usa ele
  if (
    citizen.riskClass &&
    citizen.riskClass !== "Sem Risco" &&
    citizen.riskClass !== "Sem Classificação"
  ) {
    return { label: citizen.riskClass, source: "individual" };
  }

  // Caso contrário, tenta pegar o da família
  const family = citizen.familyId
    ? familiesMap.value.get(citizen.familyId)
    : null;
  if (
    family &&
    family.riskClass &&
    family.riskClass !== "Sem Risco" &&
    family.riskClass !== "Sem Classificação"
  ) {
    return { label: family.riskClass, source: "familia" };
  }

  return { label: "Sem Classificação", source: "none" };
};

const filteredCitizens = computed(() => {
  let result = citizens.value;
  
  // Se não fez busca, mostra todos os sincronizados por padrão (limitado a 50 para performance)
  if (!search.value && !birthDateFilter.value && !motherNameFilter.value) {
    return result.slice(0, 50);
  }

  if (search.value) {
    const sNumbers = search.value.replace(/\D/g, "");
    const sLower = search.value.toLowerCase();
    result = result.filter((c) => {
      const matchName = c.name.toLowerCase().includes(sLower);
      const matchCpf = sNumbers && c.cpf && c.cpf.includes(sNumbers);
      const matchCns = sNumbers && c.cns && c.cns.includes(sNumbers);
      return matchName || matchCpf || matchCns;
    });
  }

  if (birthDateFilter.value && birthDateFilter.value.length === 10) {
    const [day, month, year] = birthDateFilter.value.split("/");
    const dateToMatch = `${year}-${month}-${day}`;
    result = result.filter(
      (c) => c.birthDate && c.birthDate.startsWith(dateToMatch),
    );
  }

  if (motherNameFilter.value) {
    const mLower = motherNameFilter.value.toLowerCase();
    result = result.filter(
      (c) => c.motherName && c.motherName.toLowerCase().includes(mLower),
    );
  }

  return result;
});

const performSearch = () => {
  // A busca agora é reativa via computed
};

const clearFilters = () => {
  search.value = "";
  birthDateFilter.value = "";
  motherNameFilter.value = "";
  hasPerformedSearch.value = false;
};

const goToDetail = (id: string) => {
  router.push(`/citizen/${id}`);
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return "---";
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? "---" : date.toLocaleDateString("pt-BR");
};

const calculateAge = (birthDate: string) => {
  if (!birthDate) return 0;
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};

const getRiskColor = (risk?: string) => {
  if (!risk) return 'grey';
  const r = risk.toUpperCase();
  if (r.includes('MÁXIMO') || r.includes('MAXIMO') || r.includes('R3')) return 'red-darken-4';
  if (r.includes('MÉDIO') || r.includes('MEDIO') || r.includes('R2')) return 'deep-orange-darken-2';
  if (r.includes('MENOR') || r.includes('R1')) return 'orange-darken-2';
  if (r.includes('BAIXO') || r.includes('R0') || r.includes('SEM RISCO')) return 'green-darken-2';
  return 'grey';
};
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

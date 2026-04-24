<template>
  <v-container v-if="citizen" fluid class="pa-0 bg-background min-h-screen">
    <!-- Sticky Header Summary -->
    <v-card class="sticky-header pa-4 pa-md-6 border-b" flat rounded="0">
      <div class="d-flex align-center flex-wrap gap-4">
        <v-btn
          icon="mdi-arrow-left"
          variant="tonal"
          color="primary"
          size="small"
          @click="$router.back()"
          class="mr-2"
        ></v-btn>

        <v-avatar color="primary" size="64" class="elevation-2">
          <v-icon icon="mdi-account" color="white" size="36"></v-icon>
        </v-avatar>

        <div class="flex-grow-1">
          <div class="d-flex align-center flex-wrap gap-2">
            <h1 class="text-h4 font-weight-black text-grey-darken-4 mb-0">
              {{ citizen.name }}
            </h1>
            <v-chip
              :color="getRiskColor(effectiveRisk.label)"
              variant="flat"
              class="font-weight-black px-4"
              size="small"
            >
              {{ effectiveRisk.label }}
            </v-chip>
            <v-icon
              v-if="effectiveRisk.source === 'família'"
              icon="mdi-account-group-outline"
              size="18"
              color="grey"
              title="Risco herdado da família"
            ></v-icon>
          </div>
          <div
            class="text-subtitle-1 text-grey-darken-1 font-weight-medium mt-1"
          >
            {{ citizen.sex }} • {{ calculateAge(citizen.birthDate) }} anos •
            {{ formatDate(citizen.birthDate) }}
          </div>
        </div>

        <div class="text-right d-none d-md-block">
          <div
            class="text-caption text-grey font-weight-bold uppercase letter-spacing-1"
          >
            Última Atualização
          </div>
          <div class="text-h6 font-weight-black text-primary">
            {{ formatDate(citizen.lastUpdate || "") }}
          </div>
        </div>
      </div>

      <!-- Quick Info Strip -->
      <v-row
        class="mt-6 info-strip pa-3 rounded-lg bg-grey-lighten-4"
        no-gutters
      >
        <v-col cols="6" sm="4" md="2" class="px-2 border-r">
          <div class="label">CPF</div>
          <div class="value">{{ citizen.cpf || "---" }}</div>
        </v-col>
        <v-col cols="6" sm="4" md="2" class="px-2 border-r">
          <div class="label">CNS</div>
          <div class="value">{{ citizen.cns || "---" }}</div>
        </v-col>
        <v-col cols="6" sm="4" md="3" class="px-2 border-r">
          <div class="label">Nome da Mãe</div>
          <div class="value text-truncate">
            {{ citizen.motherName || "---" }}
          </div>
        </v-col>
        <v-col cols="6" sm="4" md="2" class="px-2 border-r">
          <div class="label">Telefone</div>
          <div class="value">{{ citizen.phone || "---" }}</div>
        </v-col>
        <v-col cols="12" sm="4" md="3" class="px-2">
          <div class="label">Unidade Responsável</div>
          <div class="value text-truncate">
            {{ citizen.responsibleUnit || "---" }}
          </div>
        </v-col>
      </v-row>
    </v-card>

    <!-- Tab Navigation -->
    <div class="bg-white border-b">
      <v-tabs
        v-model="tab"
        color="primary"
        align-tabs="start"
        class="px-4 custom-tabs"
      >
        <v-tab value="info" prepend-icon="mdi-information">Informações</v-tab>
        <v-tab value="cover" prepend-icon="mdi-card-account-details"
          >Folha de Rosto</v-tab
        >
      </v-tabs>
    </div>

    <v-window v-model="tab" class="pa-4 pa-md-8">
      <!-- Informações Tab -->
      <v-window-item value="info">
        <v-row>
          <v-col cols="12" lg="8">
            <v-card border class="mb-6 pa-6">
              <div class="d-flex align-center mb-6">
                <v-icon
                  icon="mdi-account-details"
                  color="primary"
                  class="mr-2"
                ></v-icon>
                <h3 class="text-h6 font-weight-bold">Dados Pessoais</h3>
              </div>

              <v-row class="details-grid">
                <v-col cols="12" sm="6" md="4">
                  <div class="detail-label">Nome Completo</div>
                  <div class="detail-value">{{ citizen.name }}</div>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <div class="detail-label">Data de Nascimento</div>
                  <div class="detail-value">
                    {{ formatDate(citizen.birthDate) }}
                  </div>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <div class="detail-label">Sexo</div>
                  <div class="detail-value">{{ citizen.sex || "---" }}</div>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <div class="detail-label">CPF</div>
                  <div class="detail-value">{{ citizen.cpf || "---" }}</div>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <div class="detail-label">CNS</div>
                  <div class="detail-value">{{ citizen.cns || "---" }}</div>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <div class="detail-label">Nacionalidade</div>
                  <div class="detail-value">
                    {{ citizen.nationality || "Brasileira" }}
                  </div>
                </v-col>
              </v-row>
            </v-card>

            <v-card border class="pa-6">
              <div class="d-flex align-center mb-6">
                <v-icon
                  icon="mdi-map-marker-radius"
                  color="primary"
                  class="mr-2"
                ></v-icon>
                <h3 class="text-h6 font-weight-bold">Endereço e Contato</h3>
              </div>
              <v-row class="details-grid">
                <v-col cols="12" sm="6">
                  <div class="detail-label">CEP</div>
                  <div class="detail-value">{{ citizen.zipCode || "---" }}</div>
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="detail-label">Telefone</div>
                  <div class="detail-value">{{ citizen.phone || "---" }}</div>
                </v-col>
              </v-row>
            </v-card>
          </v-col>

          <v-col cols="12" lg="4">
            <v-card border class="pa-6 bg-primary-lighten-5 mb-6">
              <h3
                class="text-subtitle-1 font-weight-black text-primary mb-4 uppercase letter-spacing-1"
              >
                Equipe Responsável
              </h3>
              <div class="mb-4">
                <div class="detail-label">Equipe</div>
                <div class="detail-value text-primary">
                  {{ citizen.responsibleTeam || "Não atribuída" }}
                </div>
              </div>
              <div>
                <div class="detail-label">Unidade</div>
                <div class="detail-value">
                  {{ citizen.responsibleUnit || "---" }}
                </div>
              </div>
            </v-card>

            <v-alert
              type="info"
              variant="tonal"
              border="start"
              class="rounded-lg"
              icon="mdi-information-outline"
            >
              As informações de equipe são baseadas no cadastro individual mais
              recente.
            </v-alert>
          </v-col>
        </v-row>
      </v-window-item>

      <!-- Folha de Rosto Tab -->
      <v-window-item value="cover">
        <v-row>
          <v-col cols="12" md="4">
            <v-card border class="health-card">
              <div
                class="health-card-header bg-red-lighten-5 text-red-darken-4 pa-4 d-flex align-center"
              >
                <v-icon icon="mdi-alert-octagon" class="mr-2"></v-icon>
                <span class="font-weight-black">LISTA DE PROBLEMAS</span>
                <v-spacer></v-spacer>
                <v-chip
                  size="x-small"
                  color="red-darken-4"
                  class="font-weight-bold"
                  >{{ healthConditions.length }}</v-chip
                >
              </div>
              <v-list class="pa-0">
                <v-list-item
                  v-for="cond in allConditions"
                  :key="cond.id"
                  @click="openConditionDetail(cond)"
                  class="border-b py-3"
                  hover
                >
                  <template v-slot:prepend>
                    <v-icon
                      :color="cond.isFamily ? 'orange-darken-2' : 'red'"
                      size="small"
                      :icon="
                        cond.isFamily
                          ? 'mdi-account-group-outline'
                          : 'mdi-circle-medium'
                      "
                    ></v-icon>
                  </template>
                  <v-list-item-title
                    class="text-body-2 font-weight-bold text-grey-darken-3"
                  >
                    {{ cond.label }}
                  </v-list-item-title>
                  <template v-slot:append>
                    <v-icon
                      size="small"
                      icon="mdi-chevron-right"
                      color="grey"
                    ></v-icon>
                  </template>
                </v-list-item>
                <div
                  v-if="allConditions.length === 0"
                  class="pa-10 text-center"
                >
                  <v-icon
                    icon="mdi-check-circle-outline"
                    color="green-lighten-3"
                    size="48"
                    class="mb-2"
                  ></v-icon>
                  <div class="text-caption text-grey italic">
                    Nenhuma condição ativa registrada
                  </div>
                </div>
              </v-list>
            </v-card>
          </v-col>

          <v-col cols="12" md="4">
            <v-card border class="health-card">
              <div
                class="health-card-header bg-blue-lighten-5 text-blue-darken-4 pa-4 d-flex align-center"
              >
                <v-icon icon="mdi-pill" class="mr-2"></v-icon>
                <span class="font-weight-black">MEDICAMENTOS ATIVOS</span>
              </div>
              <div class="pa-12 text-center">
                <v-icon
                  icon="mdi-pill-off"
                  color="grey-lighten-2"
                  size="48"
                  class="mb-2"
                ></v-icon>
                <div class="text-caption text-grey italic">
                  Nenhum medicamento em uso
                </div>
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" md="4">
            <v-card border class="health-card">
              <div
                class="health-card-header bg-orange-lighten-5 text-orange-darken-4 pa-4 d-flex align-center"
              >
                <v-icon icon="mdi-test-tube" class="mr-2"></v-icon>
                <span class="font-weight-black">EXAMES RECENTES</span>
              </div>
              <div class="pa-12 text-center">
                <v-icon
                  icon="mdi-flask-empty-outline"
                  color="grey-lighten-2"
                  size="48"
                  class="mb-2"
                ></v-icon>
                <div class="text-caption text-grey italic">
                  Sem registros nos últimos 6 meses
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-window-item>
    </v-window>

    <!-- Condition Dialog -->
    <v-dialog v-model="dialog" width="500">
      <v-card v-if="selectedCondition" class="overflow-hidden">
        <v-toolbar color="red-darken-1" flat>
          <v-toolbar-title class="font-weight-black">{{
            selectedCondition.label
          }}</v-toolbar-title>
          <v-btn icon="mdi-close" @click="dialog = false"></v-btn>
        </v-toolbar>
        <v-card-text class="pa-6">
          <div class="mb-6">
            <div class="detail-label mb-1">Identificado em</div>
            <div class="text-h6">
              {{ formatDate(selectedCondition.updatedAt || "") }}
            </div>
          </div>
          <div class="mb-6">
            <div class="detail-label mb-1">Classificação</div>
            <v-chip color="red" variant="tonal" class="font-weight-bold">{{
              selectedCondition.type || "Condição de Saúde"
            }}</v-chip>
          </div>
          <v-divider class="mb-6"></v-divider>
          <div>
            <div class="detail-label mb-1">Notas Clínicas</div>
            <div class="text-body-1 bg-grey-lighten-4 pa-4 rounded-lg italic">
              {{ selectedCondition.value || "Sem observações adicionais." }}
            </div>
          </div>
        </v-card-text>
        <v-card-actions class="pa-4 bg-grey-lighten-5">
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" @click="dialog = false"
            >Fechar</v-btn
          >
          <v-btn color="primary" class="px-6">Ver no Histórico</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>

  <v-container v-else class="fill-height justify-center bg-background">
    <div class="text-center">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
        class="mb-4"
      ></v-progress-circular>
      <div class="text-h6 font-weight-bold text-grey">
        Carregando Prontuário...
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { db } from "@/services/localDb";
import type { ICitizen, IFamily, IHealthCondition } from "@/types/citizen";

const route = useRoute();
const citizen = ref<ICitizen | null>(null);
const family = ref<IFamily | null>(null);
const healthConditions = ref<IHealthCondition[]>([]);
const tab = ref("info");
const dialog = ref(false);
const selectedCondition = ref<IHealthCondition | null>(null);

const loadCitizen = async () => {
  const id = route.params.id as string;
  const data = await db.citizens.get(id);
  if (data) {
    citizen.value = data;
    if (data.familyId) {
      family.value = (await db.families.get(data.familyId)) || null;
    }
    healthConditions.value = await db.health_conditions
      .where("individualId")
      .equals(id)
      .toArray();
  }
};

const effectiveRisk = computed(() => {
  if (
    citizen.value?.riskClass &&
    citizen.value.riskClass !== "Sem Risco" &&
    citizen.value.riskClass !== "Sem Classificação"
  ) {
    return { label: citizen.value.riskClass, source: "individual" };
  }
  if (
    family.value?.riskClass &&
    family.value.riskClass !== "Sem Risco" &&
    family.value.riskClass !== "Sem Classificação"
  ) {
    return { label: family.value.riskClass, source: "família" };
  }
  return {
    label: citizen.value?.riskClass || "Sem Classificação",
    source: "none",
  };
});

const familySentinels = computed(() => {
  if (!family.value) return [];

  const sentinels: any[] = [];
  const f = family.value;

  const check = (
    count: number | undefined,
    label: string,
    type: string = "Risco da Família",
  ) => {
    if (count && count > 0) {
      sentinels.push({
        id: `family-${label}`,
        label: `${label}`,
        type,
        value: `Identificado na estratificação da família. Ocorrências: ${count}`,
        isFamily: true,
      });
    }
  };

  check(f.bedriddenCount, "Acamado");
  check(f.physicalDisabilityCount, "Deficiência física");
  check(f.mentalDisabilityCount, "Deficiência mental");
  check(f.severeMalnutritionCount, "Desnutrição grave");
  check(f.drugAddictionCount, "Drogadição");
  check(f.unemployedCount, "Desemprego");
  check(f.illiterateCount, "Analfabetismo");
  check(f.under6MonthsCount, "Criança < 6 meses");
  check(f.over70YearsCount, "Idoso > 70 anos");
  check(f.hypertensionCount, "Hipertensão");
  check(f.diabetesCount, "Diabetes");

  if (f.basicSanitation === false) {
    sentinels.push({
      id: "family-sanitation",
      label: "Saneamento Inadequado",
      type: "Risco Ambiental (Família)",
      value:
        "Baixas condições de saneamento identificadas no domicílio da família.",
      isFamily: true,
    });
  }

  return sentinels;
});

const allConditions = computed(() => {
  return [...healthConditions.value, ...familySentinels.value];
});

const openConditionDetail = (cond: any) => {
  selectedCondition.value = cond;
  dialog.value = true;
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

onMounted(loadCitizen);
</script>

<style scoped>
.sticky-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03) !important;
}

.min-h-screen {
  min-height: 100vh;
}

.uppercase {
  text-transform: uppercase;
}

.letter-spacing-1 {
  letter-spacing: 1px;
}

.info-strip .label {
  font-size: 0.6rem;
  font-weight: 800;
  color: #999;
  text-transform: uppercase;
}

.info-strip .value {
  font-size: 0.9rem;
  font-weight: 700;
  color: #333;
}

.border-r {
  border-right: 1px solid #ddd;
}

.custom-tabs :deep(.v-tab) {
  font-weight: 800;
  font-size: 0.85rem;
  text-transform: none;
  letter-spacing: 0;
}

.details-grid .detail-label {
  font-size: 0.7rem;
  font-weight: 700;
  color: #888;
  text-transform: uppercase;
  margin-bottom: 2px;
}

.details-grid .detail-value {
  font-size: 1rem;
  font-weight: 600;
  color: #222;
}

.health-card {
  border-radius: 12px !important;
  overflow: hidden;
  height: 100%;
}

.health-card-header {
  font-size: 0.75rem;
  letter-spacing: 0.5px;
}

.italic {
  font-style: italic;
}

.gap-2 {
  gap: 8px;
}

.gap-4 {
  gap: 16px;
}
</style>

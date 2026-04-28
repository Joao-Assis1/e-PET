<template>
  <v-container class="pa-6 bg-grey-lighten-4 min-vh-100" fluid>
    <!-- Header -->
    <div class="d-flex flex-column flex-sm-row align-sm-center justify-space-between mb-6 ga-4">
      <div>
        <h1 class="text-h4 font-weight-bold text-primary mb-1">Dashboard Territorial</h1>
        <p class="text-subtitle-1 text-grey-darken-1">Visão analítica da saúde do território</p>
      </div>
      <v-btn
        class="align-self-start align-self-sm-center"
        color="primary"
        elevation="1"
        :loading="store.loading"
        prepend-icon="mdi-refresh"
        @click="store.fetchStats()"
      >
        Atualizar Dados
      </v-btn>
    </div>

    <!-- Filters -->
    <FilterBar
      :neighborhoods="store.neighborhoods"
      @update:filters="store.setFilters"
    />

    <!-- KPIs -->
    <v-row v-if="store.stats">
      <v-col cols="12" md="3" sm="6">
        <KpiCard
          color="blue"
          icon="mdi-account-group"
          title="Total Cidadãos"
          :value="store.stats.totalCitizens"
        />
      </v-col>
      <v-col cols="12" md="3" sm="6">
        <KpiCard
          color="green"
          icon="mdi-home-group"
          title="Total Famílias"
          :value="store.stats.totalFamilies"
        />
      </v-col>
      <v-col cols="12" md="3" sm="6">
        <KpiCard
          color="teal"
          icon="mdi-home-city"
          title="Domicílios Ativos"
          :value="store.stats.activeHouseholds"
        />
      </v-col>
      <v-col cols="12" md="3" sm="6">
        <KpiCard
          color="orange"
          icon="mdi-trending-up"
          title="Eficiência Visitas"
          :value="store.stats.visitEfficiency + '%'"
        />
      </v-col>
    </v-row>

    <!-- Charts -->
    <v-row v-if="store.stats" class="mt-4">
      <v-col cols="12" lg="4">
        <RiskDonutChart v-if="Object.keys(store.stats.riskDistribution).length > 0" :data="store.stats.riskDistribution" />
      </v-col>
      <v-col cols="12" lg="8">
        <VulnerabilityBarChart :data="store.stats.vulnerabilityFactors" />
      </v-col>
    </v-row>

    <v-row v-if="store.stats" class="mt-4">
      <v-col cols="12">
        <HealthProfileChart :data="store.stats.healthConditions" />
      </v-col>
    </v-row>

    <!-- Active Search Table -->
    <v-row class="mt-4">
      <v-col cols="12">
        <PrioritySearchTable
          :items="store.priorityCitizens"
          :loading="store.loading"
          @view="goToCitizen"
        />
      </v-col>
    </v-row>

    <!-- Error State -->
    <v-snackbar v-model="showError" color="error" timeout="5000">
      {{ store.error }}
      <template #actions>
        <v-btn variant="text" @click="showError = false">Fechar</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
  import { onMounted, ref, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import FilterBar from '@/components/FilterBar.vue'
  import HealthProfileChart from '@/components/HealthProfileChart.vue'
  import KpiCard from '@/components/KpiCard.vue'
  import PrioritySearchTable from '@/components/PrioritySearchTable.vue'
  import RiskDonutChart from '@/components/RiskDonutChart.vue'
  import VulnerabilityBarChart from '@/components/VulnerabilityBarChart.vue'
  import { useDashboardStore } from '@/stores/dashboardStore'

  const store = useDashboardStore()
  const router = useRouter()
  const showError = ref(false)

  watch(() => store.error, val => {
    if (val) showError.value = true
  })

  onMounted(() => {
    store.fetchStats()
    store.fetchNeighborhoods()
  })

  function goToCitizen (id: string) {
    router.push({ name: 'citizen-summary', params: { id } })
  }
</script>

<style scoped>
.min-vh-100 {
  min-height: 100vh;
}
</style>

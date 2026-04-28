<template>
  <v-card class="pa-4" elevation="1">
    <div class="d-flex flex-column flex-sm-row align-sm-center justify-space-between mb-4 ga-2">
      <h3 class="text-h6">Busca Ativa - Cidadãos Prioritários</h3>
      <v-text-field
        v-model="search"
        class="search-field"
        density="compact"
        hide-details
        label="Pesquisar por nome ou CNS"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
      />
    </div>

    <v-data-table
      class="elevation-0"
      :headers="headers"
      hover
      :items="items"
      :loading="loading"
      :search="search"
    >
      <template #item.riskClass="{ item }">
        <v-chip
          class="font-weight-bold"
          :color="getRiskColor(item.riskClass)"
          label
          size="small"
        >
          {{ item.riskClass }}
        </v-chip>
      </template>

      <template #item.conditions="{ item }">
        <div class="d-flex flex-wrap gap-1">
          <v-chip
            v-for="condition in item.conditions"
            :key="condition"
            size="x-small"
            variant="tonal"
          >
            {{ condition }}
          </v-chip>
        </div>
      </template>

      <template #item.actions="{ item }">
        <v-btn
          color="primary"
          icon="mdi-eye"
          size="small"
          variant="text"
          @click="$emit('view', item.id)"
        />
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup lang="ts">
  import type { IPriorityCitizen } from '@/types/dashboard'
  import { ref } from 'vue'

  defineProps<{
    items: IPriorityCitizen[]
    loading: boolean
  }>()

  defineEmits(['view'])

  const search = ref('')

  const headers = [
    { title: 'Nome', key: 'name' },
    { title: 'CNS', key: 'cns' },
    { title: 'Risco', key: 'riskClass', width: '100px' },
    { title: 'Condições', key: 'conditions', sortable: false },
    { title: 'Última Visita', key: 'lastVisit' },
    { title: 'Ações', key: 'actions', sortable: false, width: '60px' },
  ]

  function getRiskColor (risk: string) {
    switch (risk) {
      case 'R3': { return 'error'
      }
      case 'R2': { return 'warning'
      }
      case 'R1': { return 'yellow-darken-2'
      }
      default: { return 'success'
      }
    }
  }
</script>

<style scoped>
.search-field {
  width: 100%;
}
@media (min-width: 600px) {
  .search-field {
    max-width: 300px;
  }
}
.gap-1 {
  gap: 4px;
}
</style>

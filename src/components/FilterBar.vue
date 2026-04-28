<template>
  <v-card class="mb-6 pa-4" elevation="1">
    <v-row align="center" dense>
      <v-col cols="12" md="3">
        <v-autocomplete
          v-model="filters.neighborhood"
          clearable
          density="compact"
          :items="neighborhoods"
          label="Bairro"
          prepend-inner-icon="mdi-map-marker"
          variant="outlined"
          @update:model-value="emitFilters"
        />
      </v-col>

      <v-col cols="12" md="4">
        <v-text-field
          v-model="dateRangeText"
          density="compact"
          label="Período"
          prepend-inner-icon="mdi-calendar"
          readonly
          variant="outlined"
          @click="showDatePicker = true"
        />

        <v-dialog v-model="showDatePicker" width="auto">
          <v-date-picker
            v-model="selectedDates"
            multiple="range"
            @update:model-value="handleDateChange"
          >
            <template #actions>
              <v-spacer />
              <v-btn color="primary" @click="showDatePicker = false">OK</v-btn>
            </template>
          </v-date-picker>
        </v-dialog>
      </v-col>

      <v-col cols="12" md="3">
        <v-select
          v-model="filters.visitOutcome"
          clearable
          density="compact"
          :items="['Realizada', 'Recusa', 'Ausente']"
          label="Desfecho da Visita"
          prepend-inner-icon="mdi-check-circle"
          variant="outlined"
          @update:model-value="emitFilters"
        />
      </v-col>

      <v-col class="text-left text-md-right" cols="12" md="2">
        <v-btn
          class="px-0 px-md-4"
          color="secondary"
          prepend-icon="mdi-filter-off"
          variant="text"
          @click="resetFilters"
        >
          Limpar
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
  import type { IDashboardFilters } from '@/types/dashboard'
  import { computed, reactive, ref } from 'vue'

  defineProps<{
    neighborhoods: string[]
  }>()

  const emit = defineEmits(['update:filters'])

  const showDatePicker = ref(false)
  const selectedDates = ref<Date[]>([])

  const filters = reactive<IDashboardFilters>({
    neighborhood: undefined,
    startDate: undefined,
    endDate: undefined,
    visitOutcome: undefined,
  })

  const dateRangeText = computed(() => {
    if (selectedDates.value.length === 0) return ''
    const start = selectedDates.value[0]
    if (selectedDates.value.length === 1) return start.toLocaleDateString()

    const end = selectedDates.value.at(-1)
    return end
      ? `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`
      : start.toLocaleDateString()
  })

  function handleDateChange (dates: Date[]) {
    if (dates && dates.length >= 2) {
      const start = dates[0]
      const end = dates.at(-1)

      if (start) filters.startDate = start.toISOString()
      if (end) filters.endDate = end.toISOString()

      emitFilters()
    }
  }

  function emitFilters () {
    emit('update:filters', { ...filters })
  }

  function resetFilters () {
    filters.neighborhood = undefined
    filters.startDate = undefined
    filters.endDate = undefined
    filters.visitOutcome = undefined
    selectedDates.value = []
    emitFilters()
  }
</script>

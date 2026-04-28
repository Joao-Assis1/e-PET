<template>
  <v-card class="pa-4" elevation="1">
    <h3 class="text-h6 mb-4">Distribuição de Risco Familiar</h3>
    <div class="chart-container">
      <Doughnut :data="chartData" :options="chartOptions" />
    </div>
  </v-card>
</template>

<script setup lang="ts">
  import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js'
  import { computed } from 'vue'
  import { Doughnut } from 'vue-chartjs'

  ChartJS.register(ArcElement, Tooltip, Legend)

  const props = defineProps<{
    data: {
      R0: number
      R1: number
      R2: number
      R3: number
    }
  }>()

  const chartData = computed(() => ({
    labels: ['R0 (Baixo)', 'R1 (Médio)', 'R2 (Alto)', 'R3 (Crítico)'],
    datasets: [
      {
        backgroundColor: ['#4CAF50', '#FFEB3B', '#FF9800', '#F44336'],
        data: [props.data.R0, props.data.R1, props.data.R2, props.data.R3],
      },
    ],
  }))

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  }
</script>

<style scoped>
.chart-container {
  height: 300px;
  position: relative;
}
</style>

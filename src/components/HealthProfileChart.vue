<template>
  <v-card class="pa-4" elevation="1">
    <h3 class="text-h6 mb-4">Saúde da População</h3>
    <div class="chart-container">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
  </v-card>
</template>

<script setup lang="ts">
  import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js'
  import { computed } from 'vue'
  import { Bar } from 'vue-chartjs'

  ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

  const props = defineProps<{
    data: {
      hypertension: number
      diabetes: number
      pregnant: number
      mentalIllness: number
      smoker: number
      alcoholUser: number
    }
  }>()

  const chartData = computed(() => ({
    labels: ['Hipertensão', 'Diabetes', 'Gestantes', 'Doença Mental', 'Fumantes', 'Uso Álcool'],
    datasets: [
      {
        label: 'Cidadãos',
        backgroundColor: ['#E91E63', '#9C27B0', '#2196F3', '#00BCD4', '#607D8B', '#795548'],
        data: [
          props.data.hypertension,
          props.data.diabetes,
          props.data.pregnant,
          props.data.mentalIllness,
          props.data.smoker,
          props.data.alcoholUser,
        ],
      },
    ],
  }))

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
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

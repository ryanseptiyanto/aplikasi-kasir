<template>
  <bar-chart
    :chart-data="chartData"
    :chart-options="chartOptions"
    :height="200"
    :width="400"
  />
</template>
  
<script>
import { defineComponent, computed } from 'vue'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import { Bar } from 'vue-chartjs'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
)

export default defineComponent({
  name: 'SalesChart',
  components: { BarChart: Bar },
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const chartData = computed(() => ({
      labels: props.data.map(r => r.tanggal),
      datasets: [
        {
          label: 'Omzet Harian',
          data: props.data.map(r => r.omzet_harian),
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }
      ]
    }))

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: true, // Ubah ke true
      scales: {
        y: { beginAtZero: true }
      }
    }

    return { chartData, chartOptions }
  }
})
</script>

<template>
    <div class="p-4">
      <h2>Dashboard</h2>
      <div v-if="data">
        <ul>
          <li>Total Produk        : {{ data.productCount }}</li>
          <li>Produk Stok Rendah  : {{ data.lowStockCount }}</li>
          <li>Transaksi Hari Ini  : {{ data.todaySalesCount }}</li>
        </ul>
      </div>
      <div v-else>Memuat data...</div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Dashboard',
    data() {
      return { data: null };
    },
    async mounted() {
      this.data = await window.api.fetchDashboard();
    }
  }
  </script>
  
  <style scoped>
  /* gaya sederhana */
  </style>
  
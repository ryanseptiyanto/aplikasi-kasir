<template>
    <div class="page">
      <!-- Header -->
      <header class="navbar navbar-expand-md navbar-light bg-white shadow-sm">
        <div class="container-xl">
          <router-link to="/dashboard" class="navbar-brand">Mini Kasir</router-link>
          <div class="navbar-nav ms-auto">
            <router-link to="/dashboard" class="nav-link">Dashboard</router-link>
            <router-link to="/products" class="nav-link">Produk</router-link>
            <router-link to="/members" class="nav-link">Members</router-link>
            <router-link to="/pos" class="nav-link">Kasir</router-link>
            <router-link to="/transactions" class="nav-link">Riwayat</router-link>
            <router-link to="/report/sales" class="nav-link">Laporan Penjualan</router-link>
            <router-link to="/report/products" class="nav-link active">Laporan Produk</router-link>
            <button class="btn btn-outline-danger btn-sm ms-3" @click="logout">Logout</button>
          </div>
        </div>
      </header>
  
      <!-- Content -->
      <div class="page-wrapper">
        <div class="container-xl mt-4">
          <h2>Laporan Produk Terlaris</h2>
          <div class="card">
            <div class="card-body">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Produk</th>
                    <th class="text-end">Jumlah Terjual</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(p, idx) in report" :key="p.product_id">
                    <td>{{ idx + 1 }}</td>
                    <td>{{ p.name }}</td>
                    <td class="text-end">{{ p.total_qty }}</td>
                  </tr>
                  <tr v-if="report.length === 0">
                    <td colspan="3" class="text-center">Tidak ada data</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  
  export default {
    name: 'ProductReport',
    setup() {
      const report = ref([]);
  
      onMounted(async () => {
        report.value = await window.api.fetchProductReport();
      });
  
      const logout = () => {
        localStorage.removeItem('user');
        window.location.href = '#/login';
      };
  
      return { report, logout };
    }
  };
  </script>
  
  <style scoped>
  .page-wrapper { background: #f1f3f5; min-height: calc(100vh - 56px); }
  </style>
  
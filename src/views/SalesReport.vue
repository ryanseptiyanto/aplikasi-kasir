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
            <router-link to="/report/sales" class="nav-link active">Laporan Penjualan</router-link>
            <button class="btn btn-outline-danger btn-sm ms-3" @click="logout">Logout</button>
          </div>
        </div>
      </header>
  
      <!-- Content -->
      <div class="page-wrapper">
        <div class="container-xl mt-4">
          <h2>Laporan Penjualan Harian</h2>
          <!-- Filter periode -->
          <div class="row mb-3">
            <div class="col-md-3">
              <label class="form-label">Dari</label>
              <input type="date" v-model="fromDate" class="form-control" />
            </div>
            <div class="col-md-3">
              <label class="form-label">Sampai</label>
              <input type="date" v-model="toDate" class="form-control" />
            </div>
            <div class="col-md-6 d-flex align-items-end">
              <button class="btn btn-primary me-2" @click="loadReport">Tampilkan</button>
              <button class="btn btn-secondary" @click="resetFilter">Reset</button>
            </div>
          </div>
  
          <!-- Tabel Laporan -->
          <div class="card">
            <div class="card-body">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>Tanggal</th>
                    <th class="text-end">Jumlah Transaksi</th>
                    <th class="text-end">Omzet (IDR)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in report" :key="row.tanggal">
                    <td>{{ row.tanggal }}</td>
                    <td class="text-end">{{ row.transaksi_count }}</td>
                    <td class="text-end">{{ formatCurrency(row.omzet_harian) }}</td>
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
  import { ref } from 'vue';
  
  export default {
    name: 'SalesReport',
    setup() {
      const fromDate = ref('');
      const toDate = ref('');
      const report = ref([]);
  
      const loadReport = async () => {
        if (!fromDate.value || !toDate.value) return;
        report.value = await window.api.fetchSalesReport({ from: fromDate.value, to: toDate.value });
      };
  
      const resetFilter = () => {
        fromDate.value = '';
        toDate.value = '';
        report.value = [];
      };
  
      const formatCurrency = (v) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v);
  
      const logout = () => {
        localStorage.removeItem('user');
        window.location.href = '#/login';
      };
  
      return { fromDate, toDate, report, loadReport, resetFilter, formatCurrency, logout };
    }
  };
  </script>
  
  <style scoped>
  .page-wrapper { background: #f1f3f5; min-height: calc(100vh - 56px); }
  </style>
  
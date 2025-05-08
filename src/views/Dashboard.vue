<template>
    <div class="page">
      <!-- Navbar -->
      <header class="navbar navbar-expand-md navbar-light bg-white shadow-sm">
        <div class="container-xl">
          <router-link to="/dashboard" class="navbar-brand">Mini Kasir</router-link>
          <div class="navbar-nav ms-auto">
            <router-link to="/products" class="nav-link">Produk</router-link>
            <router-link to="/pos" class="nav-link">Kasir</router-link>
            <router-link to="/members" class="nav-link">Member</router-link>
            <router-link to="/transactions" class="nav-link">Transaksi</router-link>
            <router-link to="/report/sales" class="nav-link">Laporan Penjualan</router-link>
            <router-link to="/report/products" class="nav-link">Laporan Produk</router-link>
            <span class="nav-link">Halo, {{ user.username }}</span>
            <button class="btn btn-outline-danger btn-sm" @click="logout">Logout</button>
          </div>
        </div>
      </header>
  
      <!-- Konten Dashboard -->
      <div class="page-wrapper">
        <div class="container-xl mt-4">
          <h2>Dashboard</h2>
          <div class="row">
            <!-- Sales Chart -->
            <div class="col-md-6">
              <div class="card mb-4">
                <div class="card-body">
                  <SalesChart :data="salesData" />
                </div>
              </div>
            </div>
  
            <!-- Card di Sebelah Kanan -->
            <div class="col-md-6">
              <div class="card mb-4">
                <div class="card-body">
                  <h5 class="card-title">Informasi Tambahan</h5>
                  <p class="card-text">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  </p>
                  <button class="btn btn-primary">Aksi</button>
                </div>
              </div>
            </div>
          </div>
          <div class="row row-deck row-cards">
            <div class="col-sm-4" v-for="stat in stats" :key="stat.label">
              <div class="card">
                <div class="card-body">
                  <div class="d-flex align-items-center">
                    <span :class="['stamp stamp-md', stat.color, 'me-3']">
                      <i :class="stat.icon"></i>
                    </span>
                    <div>
                      <div class="h3 mb-1">{{ stat.value }}</div>
                      <div class="text-muted">{{ stat.label }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import SalesChart from '@/views/SalesChart.vue'
  import { ref, onMounted } from 'vue'

  export default {
    name: 'Dashboard',
    data() {
      return {
        user: JSON.parse(localStorage.getItem('user') || '{}'),
        stats: []
      }
    },
    methods: {
      async fetchStats() {
        const d = await window.api.fetchDashboard()
        this.stats = [
          { label: 'Total Produk',        value: d.productCount,   icon: 'bi bi-box-seam',      color: 'bg-primary' },
          { label: 'Stok Rendah',         value: d.lowStockCount,  icon: 'bi bi-exclamation-triangle', color: 'bg-warning' },
          { label: 'Transaksi Hari Ini',  value: d.todaySalesCount, icon: 'bi bi-receipt',       color: 'bg-success' }
        ]
      },
      logout() {
        localStorage.removeItem('user')
        this.$router.push('/login')
      }
    },
    mounted() {
      this.fetchStats()
    },
    components: { SalesChart },
    setup() {
      const salesData = ref([])

      onMounted(async () => {
        const today = new Date().toISOString().slice(0,10)
        // fetch last 7 days report as contoh
        const from = new Date(new Date().setDate(new Date().getDate()-6)).toISOString().slice(0,10)
        salesData.value = await window.api.fetchSalesReport({ from, to: today })
      })

      return { salesData }
    }
  }
  </script>
  
  <style scoped>
  .page-wrapper {
    background: #f1f3f5;
    min-height: calc(100vh - 56px);
  }
  .row-cards .card {
    transition: transform .15s ease;
  }
  .row-cards .card:hover {
    transform: translateY(-4px);
  }
  </style>

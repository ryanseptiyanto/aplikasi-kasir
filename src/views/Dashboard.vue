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
            <span class="nav-link">Halo, {{ user.username }}</span>
            <button class="btn btn-outline-danger btn-sm" @click="logout">Logout</button>
          </div>
        </div>
      </header>
  
      <!-- Konten Dashboard -->
      <div class="page-wrapper">
        <div class="container-xl mt-4">
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
  export default {
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
  
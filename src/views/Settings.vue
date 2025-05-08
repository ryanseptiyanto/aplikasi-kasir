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
            <router-link to="/report/products" class="nav-link">Laporan Produk</router-link>
            <router-link to="/settings" class="nav-link active">Settings</router-link>
            <button class="btn btn-outline-danger btn-sm ms-3" @click="logout">Logout</button>
          </div>
        </div>
      </header>
  
      <!-- Content -->
      <div class="page-wrapper">
        <div class="container-xl mt-4">
          <h2>Pengaturan Database</h2>
          <div class="card mb-3">
            <div class="card-body d-flex justify-content-between">
              <button class="btn btn-primary" @click="backupDatabase">
                Backup Database
              </button>
              <button class="btn btn-secondary" @click="restoreDatabase">
                Restore Database
              </button>
            </div>
          </div>
          <h2>Pengaturan Toko</h2>
          <div class="d-flex justify-content-start">
            <button class="btn btn-primary" @click="$router.push('/settings/store')">
              Pengaturan Toko
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import Swal from 'sweetalert2'
  
  export default {
    name: 'Settings',
    methods: {
      backupDatabase() {
        window.api.backupDB()
        .then(result => {
        if (!result) return; // user cancel
          Swal.fire('Sukses', 'Database berhasil dibackup', 'success')
        })
        .catch(err => {
          Swal.fire('Gagal', 'Backup database gagal: ' + err.message, 'error')
        })
      },
      restoreDatabase() {
        window.api.restoreDB()
          .then(result => {
            if (!result) return;
            Swal.fire('Sukses', 'Database berhasil direstore', 'success')
            .then(() => {
              location.reload();
            });
          })
          .catch(err => {
            Swal.fire('Gagal', 'Restore database gagal: ' + err.message, 'error');
          });
        },
      logout() {
        localStorage.removeItem('user')
        this.$router.push('/login')
      }
    }
  }
  </script>
  
  <style scoped>
  .page-wrapper { background: #f1f3f5; min-height: calc(100vh - 56px); }
  </style>

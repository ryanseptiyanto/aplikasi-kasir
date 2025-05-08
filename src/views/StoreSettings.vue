<template>
    <div class="page">
      <!-- Header -->
      <header class="navbar navbar-expand-md navbar-light bg-white shadow-sm">
        <div class="container-xl">
          <router-link to="/dashboard" class="navbar-brand">Mini Kasir</router-link>
          <div class="navbar-nav ms-auto">
            <router-link to="/dashboard" class="nav-link">Dashboard</router-link>
            <router-link to="/settings" class="nav-link active">Pengaturan Toko</router-link>
            <button class="btn btn-outline-danger btn-sm ms-3" @click="logout">Logout</button>
          </div>
        </div>
      </header>
  
      <!-- Content -->
      <div class="page-wrapper">
        <div class="container-xl mt-4">
          <h2>Pengaturan Toko</h2>
          <div class="card">
            <div class="card-body">
              <form @submit.prevent="saveSettings">
                <div class="mb-3">
                  <label class="form-label">Nama Toko</label>
                  <input v-model="form.store_name" type="text" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Alamat</label>
                  <textarea v-model="form.store_address" class="form-control" rows="2"></textarea>
                </div>
                <div class="mb-3">
                  <label class="form-label">No. Telepon</label>
                  <input v-model="form.store_phone" type="text" class="form-control" />
                </div>
                <button type="submit" class="btn btn-primary">Simpan Pengaturan</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import Swal from 'sweetalert2'
  
  export default {
    name: 'StoreSettings',
    data() {
      return {
        form: {
          store_name: '',
          store_address: '',
          store_phone: ''
        }
      }
    },
    methods: {
      async loadSettings() {
        try {
          const settings = await window.api.fetchSettings()
          this.form.store_name = settings.store_name || ''
          this.form.store_address = settings.store_address || ''
          this.form.store_phone = settings.store_phone || ''
        } catch (err) {
          Swal.fire('Error', 'Gagal memuat pengaturan: ' + err.message, 'error')
        }
      },
      async saveSettings() {
        try {
          await window.api.updateSetting('store_name', this.form.store_name)
          await window.api.updateSetting('store_address', this.form.store_address)
          await window.api.updateSetting('store_phone', this.form.store_phone)
          Swal.fire('Sukses', 'Pengaturan toko disimpan', 'success')
        } catch (err) {
          Swal.fire('Error', 'Gagal menyimpan: ' + err.message, 'error')
        }
      },
      logout() {
        localStorage.removeItem('user')
        this.$router.push('/login')
      }
    },
    mounted() {
      this.loadSettings()
    }
  }
  </script>
  
  <style scoped>
  .page-wrapper { background: #f1f3f5; min-height: calc(100vh - 56px); }
  </style>
  
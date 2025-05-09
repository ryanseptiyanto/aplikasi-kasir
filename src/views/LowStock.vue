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
            <router-link to="/settings" class="nav-link">Settings</router-link>
            <router-link to="/report/low-stock" class="nav-link active">Stok Menipis</router-link>
            <button class="btn btn-outline-danger btn-sm ms-3" @click="logout">Logout</button>
          </div>
        </div>
      </header>
  
      <!-- Content -->
      <div class="page-wrapper">
        <div class="container-xl mt-4">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h2>Produk dengan Stok Menipis</h2>
            <button class="btn btn-success" @click="exportCSV">Export CSV</button>
          </div>
          <div class="card">
            <div class="card-body">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nama</th>
                    <th>Barcode</th>
                    <th>Stok</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(p, i) in lowStockProducts" :key="p.id" class="table-warning">
                    <td>{{ i + 1 }}</td>
                    <td>{{ p.name }}</td>
                    <td>{{ p.barcode }}</td>
                    <td>{{ p.stock }}</td>
                    <td>
                      <button class="btn btn-sm btn-success" @click="openStockModal(p)">+Stok</button>
                    </td>
                  </tr>
                  <tr v-if="lowStockProducts.length === 0">
                    <td colspan="5" class="text-center">Tidak ada produk menipis</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Modal Adjust Stock -->
      <div class="modal fade" id="stockModal" tabindex="-1" ref="stockModalEl">
        <div class="modal-dialog">
          <div class="modal-content">
            <form @submit.prevent="saveStock">
              <div class="modal-header">
                <h5 class="modal-title">Penyesuaian Stok</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div class="modal-body">
                <div class="mb-3">
                  <label class="form-label">Produk</label>
                  <input type="text" class="form-control" :value="stockForm.name" readonly />
                </div>
                <div class="mb-3">
                  <label class="form-label">Jumlah (+ untuk masuk, - untuk keluar)</label>
                  <input v-model.number="stockForm.delta" type="number" class="form-control" required />
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Batal</button>
                <button type="submit" class="btn btn-primary">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, reactive, computed, onMounted } from 'vue';
  import { Modal } from 'bootstrap';
  import Swal from 'sweetalert2';
  
  export default {
    name: 'LowStock',
    setup() {
      const products = ref([]);
      const threshold = ref(null);
      const stockModalEl = ref(null);
      let stockModal;
  
      const stockForm = reactive({ product_id: null, name: '', delta: 0 });
  
      // Load threshold from settings
      const loadThreshold = async () => {
        const allProducts = await window.api.fetchProducts();
        // Ambil nilai min_stock terkecil dari semua produk
        const minStockValues = allProducts.map(product => product.min_stock);
        threshold.value = Math.min(...minStockValues) || 0; // Default ke 0 jika tidak ada produk
      };
  
      // Load all products
      const loadProducts = async () => {
        const all = await window.api.fetchProducts();
        products.value = all;
      };
  
      // Compute low stock products
      const lowStockProducts = computed(() =>
        products.value.filter(p => p.stock <= threshold.value)
      );
  
      onMounted(async () => {
        await loadThreshold();
        await loadProducts();
        stockModal = new Modal(stockModalEl.value);
      });
  
      const openStockModal = (p) => {
        stockForm.product_id = p.id;
        stockForm.name = p.name;
        stockForm.delta = 0;
        stockModal.show();
      };
  
      const saveStock = async () => {
        const newStock = await window.api.adjustStock(
          stockForm.product_id,
          stockForm.delta
        );
        Swal.fire('Sukses', `Stok "${stockForm.name}" kini ${newStock}`, 'success');
        stockModal.hide();
        await loadProducts();
      };
  
      // Export low stock to CSV
      const exportCSV = () => {
        if (lowStockProducts.value.length === 0) {
          Swal.fire('Info', 'Tidak ada data untuk diexport', 'info');
          return;
        }
        const header = ['No', 'Nama', 'Barcode', 'Stok'];
        const rows = lowStockProducts.value.map((p, i) => [
          i + 1,
          p.name,
          p.barcode,
          p.stock
        ]);
        const csvContent = [header, ...rows].map(e => e.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `low_stock_${new Date().toISOString().slice(0,10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      };
  
      const logout = () => {
        localStorage.removeItem('user');
        window.location.href = '#/login';
      };
  
      return {
        threshold,
        lowStockProducts,
        stockModalEl,
        stockForm,
        openStockModal,
        saveStock,
        exportCSV,
        logout
      };
    }
  };
  </script>
  
  <style scoped>
  .page-wrapper { background: #f1f3f5; min-height: calc(100vh - 56px); }
  .table-warning { background-color: #fff3cd; }
  </style>

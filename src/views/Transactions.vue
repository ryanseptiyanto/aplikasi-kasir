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
            <router-link to="/transactions" class="nav-link active">Riwayat</router-link>
            <button class="btn btn-outline-danger btn-sm ms-3" @click="logout">Logout</button>
          </div>
        </div>
      </header>
  
      <!-- Content -->
      <div class="page-wrapper">
        <div class="container-xl mt-4">
          <h2>Riwayat Transaksi</h2>
          <div class="card">
            <div class="card-body">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>No. Transaksi</th>
                    <th>Tanggal</th>
                    <th>Kasir</th>
                    <th>Total</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(t, i) in transactions" :key="t.id">
                    <td>{{ i + 1 }}</td>
                    <td>{{ t.faktur }}</td>
                    <td>{{ formatDate(t.tanggal) }}</td>
                    <td>{{ t.kasir }}</td>
                    <td>{{ formatCurrency(t.total) }}</td>
                    <td>
                      <button class="btn btn-sm btn-primary" @click="showDetail(t.faktur)">
                        Detail
                      </button>
                    </td>
                  </tr>
                  <tr v-if="transactions.length === 0">
                    <td colspan="6" class="text-center">Belum ada transaksi</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
  
          <!-- Detail Modal -->
          <div class="modal fade" id="detailModal" tabindex="-1" ref="detailModalEl">
            <div class="modal-dialog modal-lg">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">Detail Transaksi</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                  <table class="table table-sm">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Nama</th>
                        <th>Unit</th>
                        <th class="text-end">Qty</th>
                        <th class="text-end">Harga</th>
                        <th class="text-end">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(d, idx) in detail" :key="idx">
                        <td>{{ idx + 1 }}</td>
                        <td>{{ d.name }}</td>
                        <td>{{ d.unit_name }}</td>
                        <td class="text-end">{{ d.qty }}</td>
                        <td class="text-end">{{ formatCurrency(d.price) }}</td>
                        <td class="text-end">{{ formatCurrency(d.subtotal) }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { Modal } from 'bootstrap';
  
  export default {
    name: 'Transactions',
    setup() {
      const transactions = ref([]);
      const detail = ref([]);
      const detailModalEl = ref(null);
      let detailModal = null;
  
      onMounted(async () => {
        transactions.value = await window.api.fetchTransactions();
        detailModal = new Modal(detailModalEl.value);
      });
  
      const showDetail = async (faktur) => {
        detail.value = await window.api.getTransactionDetail(faktur);
        detailModal.show();
      };
  
      const formatCurrency = (v) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v);
  
      const formatDate = (dt) =>
        new Date(dt).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
  
      const logout = () => {
        localStorage.removeItem('user');
        window.location.href = '#/login';
      };
  
      return { transactions, detail, showDetail, formatCurrency, formatDate, detailModalEl, logout };
    }
  };
  </script>
  
  <style scoped>
  .page-wrapper { background: #f1f3f5; min-height: calc(100vh - 56px); }
  </style>
  
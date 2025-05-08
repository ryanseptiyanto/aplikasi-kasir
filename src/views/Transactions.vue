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
          <!-- Filter Tanggal -->
          <div class="row mb-3">
            <div class="col-md-3">
              <label class="form-label">Dari</label>
              <input type="date" v-model="dateFrom" class="form-control" />
            </div>
            <div class="col-md-3">
              <label class="form-label">Sampai</label>
              <input type="date" v-model="dateTo" class="form-control" />
            </div>
            <div class="col-md-4">
              <label class="form-label">Cari</label>
              <input type="text" v-model="searchQuery" class="form-control" placeholder="Cari transaksi..." />
            </div>
            <div class="col-md-2 d-flex align-items-end justify-content-end">
              <button class="btn btn-secondary me-2" @click="clearFilter">Reset Filter</button>
            </div>
          </div>
  
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
                  <tr v-for="(t, i) in displayedTransactions" :key="t.id">
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
                  <tr v-if="displayedTransactions.length === 0">
                    <td colspan="6" class="text-center">Tidak ada transaksi</td>
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
  import { ref, onMounted, computed } from 'vue';
  import { Modal } from 'bootstrap';
  
  export default {
    name: 'Transactions',
    setup() {
      const transactions = ref([]);
      const detail = ref([]);
      const dateFrom = ref('');
      const dateTo = ref('');
      const searchQuery = ref('');
      const detailModalEl = ref(null);
      let detailModal = null;
  
      onMounted(async () => {
        transactions.value = await window.api.fetchTransactions();
        detailModal = new Modal(detailModalEl.value);
      });
  
      const displayedTransactions = computed(() => {
        return transactions.value.filter(t => {
          const date = t.tanggal.slice(0, 10); // YYYY-MM-DD
          const afterFrom = dateFrom.value ? date >= dateFrom.value : true;
          const beforeTo = dateTo.value ? date <= dateTo.value : true;
          const matchesQuery = searchQuery.value ? t.faktur.includes(searchQuery.value) : true;
          return afterFrom && beforeTo && matchesQuery;
        });
      });
  
      const showDetail = async (faktur) => {
        detail.value = await window.api.getTransactionDetail(faktur);
        detailModal.show();
      };
  
      const clearFilter = () => {
        dateFrom.value = '';
        dateTo.value = '';
        searchQuery.value = '';
      };
  
      const formatCurrency = (v) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v);
  
      const formatDate = (dt) =>
        new Date(dt).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
  
      const logout = () => {
        localStorage.removeItem('user');
        window.location.href = '#/login';
      };
  
      return { transactions, detail, dateFrom, dateTo, searchQuery, displayedTransactions, showDetail, clearFilter, formatCurrency, formatDate, detailModalEl, logout };
    }
  };
  </script>
  
  <style scoped>
  .page-wrapper { background: #f1f3f5; min-height: calc(100vh - 56px); }
  </style>

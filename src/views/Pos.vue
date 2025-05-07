<template>
    <div class="page">
      <!-- Navbar -->
      <header class="navbar navbar-expand-md navbar-light bg-white shadow-sm">
        <div class="container-xl">
          <router-link to="/dashboard" class="navbar-brand">Mini Kasir</router-link>
          <div class="navbar-nav ms-auto">
            <router-link to="/dashboard" class="nav-link">Dashboard</router-link>
            <router-link to="/products" class="nav-link">Produk</router-link>
            <router-link to="/pos" class="nav-link active">Kasir</router-link>
            <button class="btn btn-outline-danger btn-sm ms-3" @click="logout">Logout</button>
          </div>
        </div>
      </header>
  
      <!-- POS Content -->
      <div class="page-wrapper">
        <div class="container-xl mt-4">
          <!-- Input Produk -->
          <div class="row mb-3">
            <div class="col-md-6">
              <label class="form-label">Scan atau pilih produk</label>
              <div class="input-group">
                <input v-model="scanInput" @keyup.enter="addByScan" type="text" class="form-control" placeholder="Masukkan barcode atau nama" />
                <button class="btn btn-outline-secondary" @click="addByScan">Tambah</button>
              </div>
            </div>
          </div>
  
          <!-- Tabel Keranjang -->
          <div class="card mb-3">
            <div class="card-body">
              <table class="table table-sm">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nama</th>
                    <th>Satuan</th>
                    <th>Qty</th>
                    <th>Harga</th>
                    <th>Subtotal</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, idx) in cart" :key="idx">
                    <td>{{ idx+1 }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.unit_name }}</td>
                    <td>
                      <input type="number" v-model.number="item.qty" @change="updateItem(item)" class="form-control form-control-sm" style="width:80px" />
                    </td>
                    <td>{{ formatCurrency(item.price) }}</td>
                    <td>{{ formatCurrency(item.subtotal) }}</td>
                    <td>
                      <button class="btn btn-sm btn-danger" @click="removeItem(idx)">
                        <i class="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                  <tr v-if="cart.length===0">
                    <td colspan="7" class="text-center">Keranjang kosong</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
  
          <!-- Ringkasan & Pembayaran -->
          <div class="card">
            <div class="card-body">
              <div class="row align-items-end">
                <div class="col-md-4">
                  <label class="form-label">Total</label>
                  <input :value="formatCurrency(total)" type="text" class="form-control" readonly />
                </div>
                <div class="col-md-4">
                  <label class="form-label">Bayar</label>
                  <input v-model.number="payment" type="number" class="form-control" />
                </div>
                <div class="col-md-4">
                  <label class="form-label">Kembalian</label>
                  <input :value="formatCurrency(change)" type="text" class="form-control" readonly />
                </div>
              </div>
              <div class="mt-3 text-end">
                <button class="btn btn-success" :disabled="!canPay" @click="checkout">
                  Bayar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, reactive, computed, onMounted } from 'vue';
  import Swal from 'sweetalert2';
  
  export default {
    name: 'Pos',
    setup() {
      const products = ref([]);
      const cart = reactive([]);
      const scanInput = ref('');
      const payment = ref(0);
  
      const loadProducts = async () => {
        const list = await window.api.fetchProducts();
        // also fetch units per product
        for (const p of list) {
          p.units = await window.api.fetchUnits(p.id);
        }
        products.value = list;
      };
  
      const findProduct = (term) => {
        return products.value.find(p => p.barcode === term || p.name.toLowerCase().includes(term.toLowerCase()));
      };
  
      const addByScan = () => {
        const term = scanInput.value.trim();
        if (!term) return;
        const p = findProduct(term);
        if (!p) {
          Swal.fire('Error', 'Produk tidak ditemukan', 'error');
          scanInput.value = '';
          return;
        }
        // pilih unit pertama sebagai default
        const u = p.units[0];
        const existing = cart.find(item => item.product_id===p.id && item.unit_id===u.id);
        if (existing) {
          existing.qty += 1;
          existing.subtotal = existing.qty * existing.price;
        } else {
          cart.push({
            product_id: p.id,
            unit_id: u.id,
            name: p.name,
            unit_name: u.unit_name,
            qty: 1,
            price: u.price_regular,
            subtotal: u.price_regular
          });
        }
        scanInput.value = '';
      };
  
      const updateItem = (item) => {
        item.subtotal = item.qty * item.price;
      };
  
      const removeItem = (idx) => {
        cart.splice(idx, 1);
      };
  
      const total = computed(() => cart.reduce((sum, i) => sum + i.subtotal, 0));
      const change = computed(() => payment.value - total.value);
      const canPay = computed(() => cart.length>0 && payment.value>= total.value);
  
      const checkout = async () => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const payload = {
          kasir_id: user.id,
          items: cart.map(i => ({
            product_id: i.product_id,
            unit_id: i.unit_id,
            qty: i.qty,
            price: i.price,
            subtotal: i.subtotal
          })),
          bayar: payment.value
        };
        const res = await window.api.createTransaction(payload);
        Swal.fire('Sukses', `Faktur: ${res.faktur}\nKembalian: ${formatCurrency(res.kembalian)}`, 'success');
        // reset
        cart.splice(0);
        payment.value = 0;
      };
  
      const formatCurrency = (v) => new Intl.NumberFormat('id-ID', { style:'currency', currency:'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v);
  
      const logout = () => {
        localStorage.removeItem('user');
        window.location.href = '#/login';
      };
  
      onMounted(loadProducts);
  
      return { scanInput, cart, payment, total, change, canPay, addByScan, updateItem, removeItem, checkout, formatCurrency, logout };
    }
  };
  </script>
  
  <style scoped>
  .page-wrapper { background: #f1f3f5; min-height: calc(100vh - 56px); }
  </style>
  
<template>
    <div class="page">
      <!-- Navbar -->
      <header class="navbar navbar-expand-md navbar-light bg-white shadow-sm">
        <div class="container-xl">
          <router-link to="/dashboard" class="navbar-brand">Mini Kasir</router-link>
          <div class="navbar-nav ms-auto">
            <router-link to="/dashboard" class="nav-link">Dashboard</router-link>
            <router-link to="/products" class="nav-link">Produk</router-link>
            <router-link to="/suppliers" class="nav-link">Suppliers</router-link>
            <router-link to="/purchase-orders" class="nav-link active">Pembelian</router-link>
            <button class="btn btn-outline-danger btn-sm ms-3" @click="logout">Logout</button>
          </div>
        </div>
      </header>
  
      <!-- Content -->
      <div class="page-wrapper">
        <div class="container-xl mt-4">
          <h2>Input Purchase Order</h2>
          <!-- Supplier & Tanggal -->
          <div class="row g-3 mb-3">
            <div class="col-md-4">
              <label class="form-label">Supplier</label>
              <select v-model="selectedSupplier" class="form-select">
                <option value="">Pilih Supplier</option>
                <option v-for="s in suppliers" :key="s.id" :value="s.id">
                  {{ s.name }}
                </option>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label">Tanggal</label>
              <input type="date" v-model="orderDate" class="form-control" />
            </div>
            <div class="col-md-4">
              <label class="form-label">Scan/Cari Produk</label>
              <div class="input-group">
                <input
                  v-model="scanInput"
                  @keyup.enter="addByScan"
                  type="text"
                  class="form-control"
                  placeholder="Kode atau nama produk"
                />
                <button class="btn btn-outline-secondary" @click="addByScan">Tambah</button>
              </div>
            </div>
          </div>
  
          <!-- Order Items -->
          <div class="card mb-3">
            <div class="card-body">
              <table class="table table-sm">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nama</th>
                    <th>Qty</th>
                    <th>Harga Beli</th>
                    <th>Subtotal</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, idx) in items" :key="idx">
                    <td>{{ idx + 1 }}</td>
                    <td>{{ item.name }}</td>
                    <td>
                      <input type="number" v-model.number="item.qty" @change="updateItem(item)" class="form-control form-control-sm" style="width:80px" />
                    </td>
                    <td>
                      <input type="number" v-model.number="item.price" @change="updateItem(item)" class="form-control form-control-sm" style="width:100px" />
                    </td>
                    <td>{{ formatCurrency(item.subtotal) }}</td>
                    <td>
                      <button class="btn btn-sm btn-danger" @click="removeItem(idx)"><i class="bi bi-trash"></i></button>
                    </td>
                  </tr>
                  <tr v-if="items.length === 0">
                    <td colspan="6" class="text-center">Belum ada item</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
  
          <!-- Footer Buttons -->
          <div class="d-flex justify-content-end">
            <button class="btn btn-secondary me-2" @click="clearOrder">Clear</button>
            <button class="btn btn-primary" :disabled="!canSave" @click="saveOrder">Simpan PO</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, reactive, computed, onMounted } from 'vue';
  import Swal from 'sweetalert2';
  
  export default {
    name: 'PurchaseOrder',
    setup() {
      const suppliers = ref([]);
      const selectedSupplier = ref('');
      const orderDate = ref(new Date().toISOString().slice(0,10));
      const scanInput = ref('');
      const items = reactive([]);
      const products = ref([]);
  
      const loadSuppliers = async () => {
        suppliers.value = await window.api.fetchSuppliers();
      };
      const loadProducts = async () => {
        products.value = await window.api.fetchProducts();
      };
  
      onMounted(async () => {
        await loadSuppliers();
        await loadProducts();
      });
  
      const addByScan = () => {
        const term = scanInput.value.trim();
        if (!term) return;
        const p = products.value.find(p => p.barcode === term || p.name.toLowerCase().includes(term.toLowerCase()));
        if (!p) {
          Swal.fire('Error', 'Produk tidak ditemukan', 'error');
          scanInput.value = '';
          return;
        }
        const existing = items.find(i => i.product_id === p.id);
        if (existing) {
          existing.qty++;
          existing.subtotal = existing.qty * existing.price;
        } else {
          items.push({ product_id: p.id, name: p.name, qty: 1, price: 0, subtotal: 0 });
        }
        scanInput.value = '';
      };
  
      const updateItem = (item) => {
        item.subtotal = item.qty * item.price;
      };
      const removeItem = (idx) => {
        items.splice(idx, 1);
      };
      const clearOrder = () => {
        selectedSupplier.value = '';
        orderDate.value = new Date().toISOString().slice(0,10);
        scanInput.value = '';
        items.splice(0);
      };
  
      const total = computed(() => items.reduce((sum, i) => sum + i.subtotal, 0));
      const canSave = computed(() => selectedSupplier.value && items.length > 0);
  
      const saveOrder = async () => {
        const payload = {
          supplier_id: selectedSupplier.value,
          items: items.map(i => ({ product_id: i.product_id, qty: i.qty, price: i.price, subtotal: i.subtotal }))
        };
        const res = await window.api.createPurchaseOrder(payload);
        Swal.fire('Sukses', `PO #${res.orderId} disimpan. Total: ${formatCurrency(res.total)}`, 'success');
        clearOrder();
      };
  
      const formatCurrency = (v) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v);
  
      const logout = () => {
        localStorage.removeItem('user');
        window.location.href = '#/login';
      };
  
      return {
        suppliers,
        selectedSupplier,
        orderDate,
        scanInput,
        items,
        canSave,
        addByScan,
        updateItem,
        removeItem,
        clearOrder,
        saveOrder,
        formatCurrency,
        logout
      };
    }
  };
  </script>
  
  <style scoped>
  .page-wrapper { background: #f1f3f5; min-height: calc(100vh - 56px); }
  </style>
  
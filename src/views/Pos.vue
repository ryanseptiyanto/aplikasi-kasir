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
          <!-- Langkah 1: Top Bar Tambah Tanggal, Member, Scan & Total -->
          <div class="row align-items-end g-3 mb-3">
            <div class="col-md-8">
              <div class="row g-2">
                <div class="col-sm-4">
                  <label class="form-label">Tanggal</label>
                  <input type="text" class="form-control" :value="today" readonly />
                </div>
                <div class="col-sm-4">
                  <label class="form-label">Member</label>
                  <input v-model="member" type="text" class="form-control" placeholder="Masukkan kode/member" />
                </div>
                <div class="col-sm-4">
                  <label class="form-label">Scan / Cari Produk</label>
                  <div class="input-group">
                    <input
                      v-model="scanInput"
                      @keyup.enter="addByScan"
                      type="text"
                      class="form-control"
                      placeholder="Barcode atau nama"
                    />
                    <button class="btn btn-outline-secondary" @click="addByScan">Tambah</button>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-4 text-end">
              <label class="form-label">Total</label>
              <div class="h2">{{ formatCurrency(total) }}</div>
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
                    <td>{{ idx + 1 }}</td>
                    <td>{{ item.name }}</td>
                    <!-- Dropdown Satuan -->
                    <td>
                      <select
                        v-model="item.unit_id"
                        @change="updateItem(item)"
                        class="form-select form-select-sm"
                      >
                        <option
                          v-for="u in getUnits(item.product_id)"
                          :key="u.id"
                          :value="u.id"
                        >
                          {{ u.unit_name }}
                        </option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="number"
                        v-model.number="item.qty"
                        @change="updateItem(item)"
                        class="form-control form-control-sm"
                        style="width:80px"
                      />
                    </td>
                    <td>{{ formatCurrency(item.price) }}</td>
                    <td>{{ formatCurrency(item.subtotal) }}</td>
                    <td>
                      <button class="btn btn-sm btn-danger" @click="removeItem(idx)">
                        <i class="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                  <tr v-if="cart.length === 0">
                    <td colspan="7" class="text-center">Keranjang kosong</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
  
          <!-- Tombol Bayar & Clear -->
          <div class="d-flex justify-content-end mb-4">
            <button class="btn btn-secondary me-2" @click="clearCart()">Clear</button>
            <button class="btn btn-success" @click="openPaymentModal()" :disabled="cart.length===0">Bayar</button>
          </div>
  
          <!-- Modal Pembayaran -->
          <div class="modal fade" id="paymentModal" tabindex="-1" ref="paymentModalEl">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">Pembayaran</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                  <div class="mb-3">
                    <label class="form-label">Total</label>
                    <input type="text" class="form-control" :value="formatCurrency(total)" readonly />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Bayar</label>
                    <input v-model.number="payment" type="number" class="form-control" />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Kembalian</label>
                    <input type="text" class="form-control" :value="formatCurrency(change)" readonly />
                  </div>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Kembali</button>
                  <button type="button" class="btn btn-primary" @click="confirmCheckout()" :disabled="!canPay">Cetak Struk</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, reactive, computed, onMounted, watch } from 'vue'
  import { Modal } from 'bootstrap'
  import Swal from 'sweetalert2'
  
  export default {
    name: 'Pos',
    setup() {
      const today = new Date().toLocaleDateString('id-ID')
      const member = ref('')
      const isMember = computed(() => member.value.trim() !== '')
  
      const products = ref([])
      const scanInput = ref('')
      const cart = reactive([])
      const payment = ref(0)
      let paymentModal = null
  
      onMounted(async () => {
        // load products + units
        const list = await window.api.fetchProducts()
        for (const p of list) {
          p.units = await window.api.fetchUnits(p.id)
        }
        products.value = list
        // init payment modal
        paymentModal = new Modal(paymentModalEl)
      })
  
      const getUnits = (pid) => {
        const p = products.value.find(x => x.id === pid)
        return p ? p.units : []
      }
  
      const recalculateCart = () => {
        cart.forEach(item => {
          const units = getUnits(item.product_id)
          const u = units.find(x => x.id === item.unit_id) || units[0]
          item.unit_name = u.unit_name
          item.price = isMember.value ? u.price_member : u.price_regular
          item.subtotal = item.qty * item.price
        })
      }
  
      watch(member, () => {
        recalculateCart()
      })
  
      const addByScan = () => {
        const term = scanInput.value.trim()
        if (!term) return
        const p = products.value.find(
          x => x.barcode === term || x.name.toLowerCase().includes(term.toLowerCase())
        )
        if (!p) {
          Swal.fire('Error', 'Produk tidak ditemukan', 'error')
          scanInput.value = ''
          return
        }
        const defaultUnit = p.units[0]
        const price = isMember.value ? defaultUnit.price_member : defaultUnit.price_regular
        const existing = cart.find(
          it => it.product_id === p.id && it.unit_id === defaultUnit.id
        )
        if (existing) {
          existing.qty++
          existing.subtotal = existing.qty * existing.price
        } else {
          cart.push({
            product_id: p.id,
            unit_id: defaultUnit.id,
            name: p.name,
            unit_name: defaultUnit.unit_name,
            qty: 1,
            price,
            subtotal: price
          })
        }
        scanInput.value = ''
      }
  
      const updateItem = (item) => {
        const units = getUnits(item.product_id)
        const u = units.find(x => x.id === item.unit_id)
        item.unit_name = u.unit_name
        item.price = isMember.value ? u.price_member : u.price_regular
        item.subtotal = item.qty * item.price
      }
  
      const removeItem = (idx) => {
        cart.splice(idx, 1)
      }
  
      const clearCart = () => {
        cart.splice(0)
        payment.value = 0
      }
  
      const total = computed(() => cart.reduce((sum, i) => sum + i.subtotal, 0))
      const change = computed(() => payment.value - total.value)
      const canPay = computed(() => cart.length > 0 && payment.value >= total.value)
  
      const openPaymentModal = () => {
        paymentModal.show()
      }
  
      const confirmCheckout = async () => {
        const payload = {
          kasir_id: JSON.parse(localStorage.getItem('user')).id,
          items: cart.map(i => ({
            product_id: i.product_id,
            unit_id: i.unit_id,
            qty: i.qty,
            price: i.price,
            subtotal: i.subtotal
          })),
          bayar: payment.value
        }
        const res = await window.api.createTransaction(payload)
        Swal.fire('Sukses', `Faktur: ${res.faktur}\nKembalian: ${formatCurrency(res.kembalian)}`, 'success')
        paymentModal.hide()
        clearCart()
      }
  
      const formatCurrency = (v) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v)
  
      const logout = () => {
        localStorage.removeItem('user')
        window.location.href = '#/login'
      }
  
      return {
        today,
        member,
        isMember,
        scanInput,
        cart,
        payment,
        total,
        change,
        canPay,
        addByScan,
        updateItem,
        removeItem,
        clearCart,
        openPaymentModal,
        confirmCheckout,
        formatCurrency,
        logout,
        getUnits,
        paymentModalEl: ref(null)
      }
    }
  }
  </script>
  
  <style scoped>
  .page-wrapper { background: #f1f3f5; min-height: calc(100vh - 56px); }
  </style>
  
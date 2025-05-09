<template>
  <div class="page">
    <!-- Header -->
    <header class="navbar navbar-expand-md navbar-light bg-white shadow-sm">
      <div class="container-xl">
        <router-link to="/dashboard" class="navbar-brand">Mini Kasir</router-link>
        <div class="navbar-nav ms-auto">
          <router-link to="/dashboard" class="nav-link">Dashboard</router-link>
          <router-link to="/products" class="nav-link active">Produk</router-link>
          <router-link to="/members" class="nav-link">Members</router-link>
          <router-link to="/pos" class="nav-link">Kasir</router-link>
          <router-link to="/transactions" class="nav-link">Riwayat</router-link>
          <router-link to="/settings" class="nav-link">Settings</router-link>
          <button class="btn btn-outline-danger btn-sm ms-3" @click="logout">Logout</button>
        </div>
      </div>
    </header>

    <!-- Konten Produk -->
    <div class="page-wrapper">
      <div class="container-xl mt-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h2>Manajemen Produk</h2>
          <button class="btn btn-primary" @click="openModal()">+ Tambah Produk</button>
        </div>

        <!-- Tabel Produk -->
        <div class="card">
          <div class="card-body">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nama</th>
                  <th>Barcode</th>
                  <th>Harga</th>
                  <th>Stok</th>
                  <th>Min. Stok</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(p, i) in products" :key="p.id">
                  <td>{{ i + 1 }}</td>
                  <td>{{ p.name }}</td>
                  <td>{{ p.barcode }}</td>
                  <td>{{ formatCurrency(p.price) }}</td>
                  <td>{{ p.stock }}</td>
                  <td>{{ p.min_stock }}</td>
                  <td>
                    <button class="btn btn-sm btn-success me-1" @click="openStockModal(p)">+Stok</button>
                    <button class="btn btn-sm btn-warning me-1" @click="openModal(p)"><i class="bi bi-pencil"></i></button>
                    <button class="btn btn-sm btn-danger" @click="confirmDelete(p.id)"><i class="bi bi-trash"></i></button>
                  </td>
                </tr>
                <tr v-if="products.length === 0">
                  <td colspan="7" class="text-center">Belum ada produk</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Tambah/Edit -->
    <div class="modal fade" id="productModal" tabindex="-1" ref="modalEl">
      <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <form @submit.prevent="saveProduct">
            <div class="modal-header">
              <h5 class="modal-title">{{ modalTitle }}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <!-- Row 1: Nama Produk & Barcode -->
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Nama Produk</label>
                  <input v-model="form.name" type="text" class="form-control" required />
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Barcode</label>
                  <input v-model="form.barcode" type="text" class="form-control" required />
                </div>
              </div>
              <!-- Row 2: Harga Dasar & Stok -->
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Harga Dasar (pcs)</label>
                  <input v-model.number="form.price" type="number" class="form-control" required />
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Stok (pcs)</label>
                  <input v-model.number="form.stock" type="number" class="form-control" required />
                </div>
              </div>
              <!-- Row 3: Min. Stok & placeholder -->
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Min. Stok (pcs)</label>
                  <input v-model.number="form.min_stock" type="number" class="form-control" required />
                </div>
                <div class="col-md-6"><!-- Kosong untuk align --></div>
              </div>

              <!-- Units & Harga -->
              <h6 class="mt-4">Units & Harga</h6>
              <table class="table table-sm">
                <thead>
                  <tr>
                    <th>Satuan</th>
                    <th>Konversi (pcs)</th>
                    <th>Harga Ecer</th>
                    <th>Harga Member</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(u, index) in form.units" :key="index">
                    <td>
                      <input
                        v-model="u.unit_name"
                        class="form-control form-control-sm"
                        required
                      />
                    </td>
                    <td>
                      <input
                        v-model.number="u.quantity"
                        type="number"
                        class="form-control form-control-sm"
                        required
                      />
                    </td>
                    <td>
                      <input
                        v-model.number="u.price_regular"
                        type="number"
                        class="form-control form-control-sm"
                        required
                      />
                    </td>
                    <td>
                      <input
                        v-model.number="u.price_member"
                        type="number"
                        class="form-control form-control-sm"
                        required
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        class="btn btn-sm btn-danger"
                        @click="removeUnitRow(index)"
                      >
                        <i class="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <button
                type="button"
                class="btn btn-sm btn-outline-primary"
                @click="addUnitRow()"
              >
                + Tambah Satuan
              </button>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-outline-secondary"
                data-bs-dismiss="modal"
              >
                Batal
              </button>
              <button type="submit" class="btn btn-primary">{{ modalAction }}</button>
            </div>
          </form>
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
          <!-- Form Nama Produk -->
          <div class="mb-3">
            <label class="form-label">Produk</label>
            <input type="text" class="form-control" :value="stockForm.name" readonly />
          </div>

          <!-- Form Dropdown Masuk/Keluar -->
          <div class="mb-3">
            <label class="form-label">Jenis Penyesuaian</label>
            <select v-model="stockForm.type" class="form-select" required>
              <option value="masuk">Masuk</option>
              <option value="keluar">Keluar</option>
            </select>
          </div>

          <!-- Form Jumlah -->
          <div class="mb-3">
            <label class="form-label">Jumlah</label>
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
import { ref, reactive, onMounted } from 'vue';
import { Modal } from 'bootstrap'
import Swal from 'sweetalert2'

export default {
  name: 'Products',
  data() {
    return {
      products: [],
      form: {
        id: null,
        name: '',
        barcode: '',
        price: 0,
        stock: 0,
        min_stock: 0,
        units: [
          { unit_name: 'pcs', quantity: 1, price_regular: 0, price_member: 0 }
        ]
      },
      modal: null,
      stockForm: { product_id: null, name: '', delta: 0, type: 'masuk' },
      stockModal: null,
      threshold: ref(5),
    }
  },
  computed: {
    modalTitle() {
      return this.form.id ? 'Edit Produk' : 'Tambah Produk'
    },
    modalAction() {
      return this.form.id ? 'Simpan Perubahan' : 'Tambah'
    }
  },
  methods: {
    async loadProducts() {
      this.products = await window.api.fetchProducts()
    },
    // Load low stock threshold from settings
    async loadThreshold() {
      const settings = await window.api.fetchSettings();
      this.threshold.value = Number(settings.low_stock_threshold) || 5;
    },
    openModal(product = null) {
      if (product) {
        this.form = {
          id: product.id,
          name: product.name,
          barcode: product.barcode,
          price: product.price,
          stock: product.stock,
          min_stock: product.min_stock,
          units: []
        };
        window.api.fetchUnits(product.id)
          .then(units => {
            this.form.units = units || [
              { unit_name: 'pcs', quantity: 1, price_regular: 0, price_member: 0 }
            ];
          })
          .catch(() => {
            this.form.units = [
              { unit_name: 'pcs', quantity: 1, price_regular: 0, price_member: 0 }
            ];
          });
      } else {
        this.form = {
          id: null,
          name: '',
          barcode: '',
          price: 0,
          stock: 0,
          min_stock: 0,
          units: [
            { unit_name: 'pcs', quantity: 1, price_regular: 0, price_member: 0 }
          ]
        };
      }
      this.$nextTick(() => {
        this.modal = new Modal(this.$refs.modalEl);
        this.modal.show();
      });
    },
    async saveProduct() {
      const productData = {
        id: this.form.id,
        name: this.form.name,
        barcode: this.form.barcode,
        price: this.form.price,
        stock: this.form.stock,
        min_stock: this.form.min_stock
      }
      const unitData = this.form.units.map(u => ({
        unit_name: u.unit_name,
        quantity: u.quantity,
        price_regular: u.price_regular,
        price_member: u.price_member
      }))

      if (this.form.id) {
        await window.api.updateProduct(productData, unitData)
        Swal.fire('Berhasil', 'Data produk diperbarui', 'success')
      } else {
        await window.api.createProduct(productData, unitData)
        Swal.fire('Berhasil', 'Produk baru ditambahkan', 'success')
      }
      this.modal.hide()
      this.loadProducts()
    },
    confirmDelete(id) {
      Swal.fire({
        title: 'Hapus produk?',
        text: 'Data yang dihapus tidak dapat dikembalikan.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya, Hapus'
      }).then(async res => {
        if (res.isConfirmed) {
          try {
            await window.api.deleteProduct(id);
            Swal.fire('Dihapus', 'Produk telah dihapus', 'success');
            this.loadProducts();
          } catch (err) {
            Swal.fire('Gagal', 'Produk gagal dihapus: ' + err.message, 'error');
          }
        }
      });
    },
    addUnitRow() {
      this.form.units.push({
        unit_name: '',
        quantity: 1,
        price_regular: 0,
        price_member: 0
      });
    },
    removeUnitRow(index) {
      this.form.units.splice(index, 1)
    },
    formatCurrency(value) {
      if (value == null) return 'Rp 0';
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    },
    logout() {
      localStorage.removeItem('user')
      this.$router.push('/login')
    },

     // Buka modal penyesuaian stok untuk produk
    openStockModal(product) {
      this.stockForm.product_id = product.id;
      this.stockForm.name = product.name;
      this.stockForm.type = 'masuk'; // Default ke "masuk"
      this.stockForm.delta = 0;
      this.stockModal.show();
    },

    // Simpan penyesuaian stok (masuk atau keluar)
    async saveStock() {
      if (this.stockForm.delta <= 0) {
        Swal.fire('Error', 'Jumlah harus lebih besar dari 0', 'error');
        return;
      }
      const adjustment = this.stockForm.type === 'keluar' ? -this.stockForm.delta : this.stockForm.delta;
      const updatedStock = await window.api.adjustStock(
        this.stockForm.product_id,
        adjustment
      );
      Swal.fire('Sukses', `Stok diperbarui menjadi ${updatedStock}`, 'success');
      this.stockModal.hide();
      this.loadProducts();
    },


  },
  mounted() {
    this.loadThreshold();
    this.loadProducts();
    this.$nextTick(() => {
      this.productModal = new Modal(this.$refs.modalEl);
      this.stockModal = new Modal(this.$refs.stockModalEl);
    });
  }
}
</script>

<style scoped>
.page-wrapper {
  background: #f1f3f5;
  min-height: calc(100vh - 56px);
}
.table-warning { background-color: #fff3cd; }
</style>

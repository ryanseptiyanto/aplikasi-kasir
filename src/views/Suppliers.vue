<template>
    <div class="page">
      <!-- Navbar -->
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
            <router-link to="/report/low-stock" class="nav-link">Stok Menipis</router-link>
            <router-link to="/suppliers" class="nav-link active">Suppliers</router-link>
            <button class="btn btn-outline-danger btn-sm ms-3" @click="logout">Logout</button>
          </div>
        </div>
      </header>
  
      <!-- Content -->
      <div class="page-wrapper">
        <div class="container-xl mt-4">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h2>Manajemen Supplier</h2>
            <button class="btn btn-primary" @click="openModal()">+ Tambah Supplier</button>
          </div>
          <div class="card">
            <div class="card-body">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nama</th>
                    <th>Telepon</th>
                    <th>Alamat</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(s, i) in suppliers" :key="s.id">
                    <td>{{ i + 1 }}</td>
                    <td>{{ s.name }}</td>
                    <td>{{ s.phone }}</td>
                    <td>{{ s.address }}</td>
                    <td>
                      <button class="btn btn-sm btn-warning me-1" @click="openModal(s)"><i class="bi bi-pencil"></i></button>
                      <button class="btn btn-sm btn-danger" @click="confirmDelete(s.id)"><i class="bi bi-trash"></i></button>
                    </td>
                  </tr>
                  <tr v-if="suppliers.length === 0">
                    <td colspan="5" class="text-center">Belum ada supplier</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Modal Tambah/Edit Supplier -->
      <div class="modal fade" id="supplierModal" tabindex="-1" ref="modalEl">
        <div class="modal-dialog">
          <div class="modal-content">
            <form @submit.prevent="saveSupplier">
              <div class="modal-header">
                <h5 class="modal-title">{{ modalTitle }}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div class="modal-body">
                <div class="mb-3">
                  <label class="form-label">Nama Supplier</label>
                  <input v-model="form.name" type="text" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Telepon</label>
                  <input v-model="form.phone" type="text" class="form-control" />
                </div>
                <div class="mb-3">
                  <label class="form-label">Alamat</label>
                  <textarea v-model="form.address" class="form-control" rows="2"></textarea>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Batal</button>
                <button type="submit" class="btn btn-primary">{{ modalAction }}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, reactive, onMounted } from 'vue';
  import { Modal } from 'bootstrap';
  import Swal from 'sweetalert2';
  
  export default {
    name: 'Suppliers',
    setup() {
      const suppliers = ref([]);
      const modalEl = ref(null);
      let supplierModal;
  
      const form = reactive({ id: null, name: '', phone: '', address: '' });
  
      const modalTitle = () => form.id ? 'Edit Supplier' : 'Tambah Supplier';
      const modalAction = () => form.id ? 'Simpan' : 'Tambah';
  
      const loadSuppliers = async () => {
        suppliers.value = await window.api.fetchSuppliers();
      };
  
      onMounted(() => {
        loadSuppliers();
        supplierModal = new Modal(modalEl.value);
      });
  
      const openModal = (s = null) => {
        if (s) {
          form.id = s.id;
          form.name = s.name;
          form.phone = s.phone;
          form.address = s.address;
        } else {
          form.id = null;
          form.name = '';
          form.phone = '';
          form.address = '';
        }
        supplierModal.show();
      };
  
      const saveSupplier = async () => {
        if (form.id) {
          await window.api.createSupplier({ id: form.id, name: form.name, phone: form.phone, address: form.address });
          Swal.fire('Sukses', 'Supplier diperbarui', 'success');
        } else {
          await window.api.createSupplier({ name: form.name, phone: form.phone, address: form.address });
          Swal.fire('Sukses', 'Supplier baru ditambahkan', 'success');
        }
        supplierModal.hide();
        loadSuppliers();
      };
  
      const confirmDelete = async (id) => {
        const res = await Swal.fire({
          title: 'Hapus supplier?',
          text: 'Data ini akan dihapus permanen.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Ya, hapus'
        });
        if (res.isConfirmed) {
          await window.api.deleteSupplier(id);
          Swal.fire('Dihapus', 'Supplier telah dihapus', 'success');
          loadSuppliers();
        }
      };
  
      const logout = () => {
        localStorage.removeItem('user');
        window.location.href = '#/login';
      };
  
      return {
        suppliers,
        modalEl,
        form,
        modalTitle,
        modalAction,
        openModal,
        saveSupplier,
        confirmDelete,
        logout
      };
    }
  };
  </script>
  
  <style scoped>
  .page-wrapper { background: #f1f3f5; min-height: calc(100vh - 56px); }
  </style>
  
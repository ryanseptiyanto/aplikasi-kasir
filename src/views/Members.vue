<template>
    <div class="page">
      <!-- Header -->
      <header class="navbar navbar-expand-md navbar-light bg-white shadow-sm">
        <div class="container-xl">
          <router-link to="/dashboard" class="navbar-brand">Mini Kasir</router-link>
          <div class="navbar-nav ms-auto">
            <router-link to="/dashboard" class="nav-link">Dashboard</router-link>
            <router-link to="/products" class="nav-link">Produk</router-link>
            <router-link to="/members" class="nav-link active">Members</router-link>
            <button class="btn btn-outline-danger btn-sm ms-3" @click="logout">Logout</button>
          </div>
        </div>
      </header>
  
      <!-- Content -->
      <div class="page-wrapper">
        <div class="container-xl mt-4">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h2>Manajemen Members</h2>
            <button class="btn btn-primary" @click="openModal()">+ Tambah Member</button>
          </div>
          <div class="card">
            <div class="card-body">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Kode</th>
                    <th>Nama</th>
                    <th>Telepon</th>
                    <th>Tanggal Daftar</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(m, i) in members" :key="m.id">
                    <td>{{ i+1 }}</td>
                    <td>{{ m.code }}</td>
                    <td>{{ m.name }}</td>
                    <td>{{ m.phone }}</td>
                    <td>{{ formatDate(m.created) }}</td>
                    <td>
                      <button class="btn btn-sm btn-warning me-1" @click="openModal(m)">
                        <i class="bi bi-pencil"></i>
                      </button>
                      <button class="btn btn-sm btn-danger" @click="confirmDelete(m.id)">
                        <i class="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                  <tr v-if="members.length===0">
                    <td colspan="6" class="text-center">Belum ada member</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Modal Tambah/Edit Member -->
      <div class="modal fade" id="memberModal" tabindex="-1" ref="modalEl">
        <div class="modal-dialog">
          <div class="modal-content">
            <form @submit.prevent="saveMember">
              <div class="modal-header">
                <h5 class="modal-title">{{ modalTitle }}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div class="modal-body">
                <div class="mb-3">
                  <label class="form-label">Kode Member</label>
                  <input v-model="form.code" type="text" class="form-control" :readonly="form.id" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Nama</label>
                  <input v-model="form.name" type="text" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Telepon</label>
                  <input v-model="form.phone" type="text" class="form-control" />
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
  import { Modal } from 'bootstrap'
  import Swal from 'sweetalert2'
  
  export default {
    name: 'Members',
    data() {
      return {
        members: [],
        form: { id: null, code: '', name: '', phone: '', created: '' },
        modal: null
      }
    },
    computed: {
      modalTitle() { return this.form.id ? 'Edit Member' : 'Tambah Member' },
      modalAction() { return this.form.id ? 'Simpan' : 'Tambah' }
    },
    methods: {
      async loadMembers() {
        this.members = await window.api.fetchMembers()
      },
      openModal(member = null) {
        if (member) {
          this.form = { ...member }
        } else {
          this.form = { id: null, code: '', name: '', phone: '', created: '' }
        }
        this.$nextTick(() => {
          this.modal = new Modal(this.$refs.modalEl)
          this.modal.show()
        })
      },
      async saveMember() {
        if (this.form.id) {
          await window.api.updateMember(this.form)
          Swal.fire('Berhasil', 'Member diperbarui', 'success')
        } else {
          // set created timestamp Jakarta
          this.form.created = new Date(
            new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })
          ).toISOString().slice(0, 19).replace('T', ' ')
          await window.api.createMember(this.form)
          Swal.fire('Berhasil', 'Member baru ditambahkan', 'success')
        }
        this.modal.hide()
        this.loadMembers()
      },
      confirmDelete(id) {
        Swal.fire({
          title: 'Hapus member?',
          text: 'Data ini akan dihapus permanen.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Ya, hapus'
        }).then(async res => {
          if (res.isConfirmed) {
            await window.api.deleteMember(id)
            Swal.fire('Dihapus', 'Member telah dihapus', 'success')
            this.loadMembers()
          }
        })
      },
      formatDate(dt) {
        return new Date(dt).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })
      },
      logout() {
        localStorage.removeItem('user')
        this.$router.push('/login')
      }
    },
    mounted() {
      this.loadMembers()
    }
  }
  </script>
  
  <style scoped>
  .page-wrapper { background: #f1f3f5; min-height: calc(100vh - 56px); }
  </style>
  
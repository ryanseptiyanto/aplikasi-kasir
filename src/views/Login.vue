<template>
  <div class="page page-center">
    <div class="container-tight px-4 py-4">
      <div class="card card-md">
        <div class="card-body">
          <h2 class="card-title text-center mb-4">Mini Kasir</h2>
          <form @submit.prevent="handleLogin">
            <div class="mb-3">
              <label for="username" class="form-label">Username</label>
              <input
                id="username"
                v-model="username"
                type="text"
                class="form-control"
                placeholder="Masukkan username"
                required
              />
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">Password</label>
              <input
                id="password"
                v-model="password"
                type="password"
                class="form-control"
                placeholder="Masukkan password"
                required
              />
            </div>
            <div class="mb-3">
              <button type="submit" class="btn btn-primary w-100">
                Masuk
              </button>
            </div>
            <p v-if="error" class="text-danger text-center">{{ error }}</p>
          </form>
        </div>
      </div>
      <div class="text-center text-muted mt-3">
        &copy; 2025 Mini Kasir
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
      error: ''
    }
  },
  methods: {
    async handleLogin() {
      this.error = ''
      const res = await window.api.login(this.username, this.password)
      if (res) {
        localStorage.setItem('user', JSON.stringify(res))
        this.$router.push('/dashboard')
      } else {
        this.error = 'Login gagal: username atau password salah'
      }
    }
  }
}
</script>

<style scoped>
.page-center {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
}
</style>

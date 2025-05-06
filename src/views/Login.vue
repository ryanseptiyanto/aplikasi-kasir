<template>
    <div class="login">
      <h2>Login</h2>
      <input v-model="username" placeholder="Username" />
      <input v-model="password" type="password" placeholder="Password" />
      <button @click="handleLogin">Login</button>
      <p v-if="error" style="color: red">{{ error }}</p>
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
        const res = await window.api.login(this.username, this.password)
        if (res) {
          localStorage.setItem('user', JSON.stringify(res))
          this.$router.push('/dashboard')
        } else {
          this.error = 'Login gagal, periksa kembali.'
        }
      }
    }
  }
  </script>
  
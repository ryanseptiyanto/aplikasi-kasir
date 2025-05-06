// ─ src/router.js ─────────────────────────
import { createRouter, createWebHashHistory } from 'vue-router';
import Login from './views/Login.vue';
import Dashboard from './views/Dashboard.vue';
import Products from './views/Products.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path:'/',       redirect:'/login' },
    { path:'/login',  component:Login },
    { path:'/dashboard', component:Dashboard },
    { path:'/products', component: Products }
  ]
});

router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (to.path !== '/login' && !user)      return next('/login');
  if (to.path === '/login' && user)       return next('/dashboard');
  next();
});

export default router;

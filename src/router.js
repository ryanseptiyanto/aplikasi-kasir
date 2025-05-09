import { createRouter, createWebHashHistory } from 'vue-router'
import Login          from './views/Login.vue'
import Dashboard      from './views/Dashboard.vue'
import Products       from './views/Products.vue'
import Members        from './views/Members.vue'
import Pos            from './views/Pos.vue'
import Transactions   from './views/Transactions.vue'
import Receipt        from './views/Receipt.vue'
import SalesReport    from './views/SalesReport.vue'
import ProductReport  from './views/ProductReport.vue'
import LowStock       from './views/LowStock.vue'
import Settings       from './views/Settings.vue'
import StoreSettings  from './views/StoreSettings.vue'
import Suppliers          from './views/Suppliers.vue'
import PurchaseOrder      from './views/PurchaseOrder.vue'


const routes = [
  { path: '/',                redirect: '/login' },
  { path: '/login',           component: Login },
  { path: '/dashboard',       component: Dashboard },
  { path: '/products',        component: Products },
  { path: '/members',         component: Members },
  { path: '/pos',             component: Pos },
  { path: '/transactions',    component: Transactions },
  { path: '/receipt/:faktur', component: Receipt },
  { path: '/report/sales',    component: SalesReport },
  { path: '/report/products', component: ProductReport },
  { path: '/report/low-stock',component: LowStock },
  { path: '/settings',        component: Settings },
  { path: '/settings/store',  component: StoreSettings },
  { path: '/suppliers',       component: Suppliers },
  { path: '/purchase-orders', component: PurchaseOrder }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  // Jika belum login, arahkan ke /login
  if (to.path !== '/login' && !user) {
    return next('/login')
  }

  // Jika sudah login dan ke /login, kirim ke dashboard
  if (to.path === '/login' && user) {
    return next('/dashboard')
  }

  // Proteksi akses POS berdasarkan role (contoh: hanya 'kasir' dan 'admin' boleh)
  if (to.path === '/pos' && user && !['kasir','admin'].includes(user.role)) {
    return next('/dashboard')  // atau page 403
  }

  next()
})

export default router

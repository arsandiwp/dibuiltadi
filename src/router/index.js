import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";

// Auth pages
import Login from "../pages/auth/Login.vue";
import Register from "../pages/auth/Register.vue";

// Dummy dashboard (sementara)
const Dashboard = { template: "<h1 class='p-6'>Dashboard (dummy)</h1>" };

const routes = [
  { path: "/login", component: Login, meta: { guest: true } },
  { path: "/register", component: Register, meta: { guest: true } },
  { path: "/dashboard", component: Dashboard, meta: { requiresAuth: true } },
  { path: "/", redirect: "/login" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// ✅ Router Guard
router.beforeEach((to, from, next) => {
  const auth = useAuthStore();

  if (to.meta.requiresAuth && !auth.token) {
    // butuh login tapi belum ada token
    next("/login");
  } else if (to.meta.guest && auth.token) {
    // kalau sudah login tapi akses login/register → lempar ke dashboard
    next("/dashboard");
  } else {
    next();
  }
});

export default router;

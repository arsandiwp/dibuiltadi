import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";

import Login from "../pages/auth/Login.vue";
import Register from "../pages/auth/Register.vue";

import ProfilePage from "../pages/Profile.vue";
import UpdatePassword from "../pages/UpdatePassword.vue";

import Dashboard from "../pages/Dashboard.vue";

import CustomerList from "../pages/customers/CustomerList.vue";
import CustomerDetail from "../pages/customers/CustomerDetail.vue";

import TransactionList from "../pages/transactions/TransactionList.vue";
import TransactionDetail from "../pages/transactions/TransactionDetail.vue";

const routes = [
  { path: "/login", component: Login, meta: { guest: true } },
  { path: "/register", component: Register, meta: { guest: true } },

  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: { requiresAuth: true },
  },

  {
    path: "/customers",
    name: "Customers",
    component: CustomerList,
    meta: { requiresAuth: true },
  },
  {
    path: "/customers/add",
    name: "CustomerCreate",
    component: CustomerDetail,
    meta: { requiresAuth: true },
  },
  {
    path: "/customers/:code",
    name: "CustomerDetail",
    component: CustomerDetail,
    meta: { requiresAuth: true },
  },
  {
    path: "/customers/:code/edit",
    name: "CustomerEdit",
    component: CustomerDetail,
    meta: { requiresAuth: true },
  },

  {
    path: "/transactions",
    name: "Transactions",
    component: TransactionList,
    meta: { requiresAuth: true },
  },
  {
    path: "/transactions/:no",
    name: "Detail Transaction",
    component: TransactionDetail,
    meta: { requiresAuth: true },
  },

  {
    path: "/profile",
    name: "Profile",
    component: ProfilePage,
    meta: { requiresAuth: true },
  },
  {
    path: "/update-password",
    name: "UpdatePassword",
    component: UpdatePassword,
    meta: { requiresAuth: true },
  },

  { path: "/", redirect: "/login" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});


router.beforeEach((to, from, next) => {
  const auth = useAuthStore();

  if (to.meta.requiresAuth && !auth.token) {    
    next("/login");
  } else if (to.meta.guest && auth.token) {    
    next("/dashboard");
  } else {
    next();
  }
});

export default router;

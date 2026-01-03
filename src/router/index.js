import { createWebHistory, createRouter } from "vue-router";
import { supabase } from "../lib/supabase";

import LoginPage from "../views/LoginPage.vue";
import SignUp from "../views/SignUp.vue";
import MainHome from "../views/MainHome.vue";
import CoffeMenu from "../views/CoffeMenu.vue";
import MilkshakeMenu from "../views/MilkshakeMenu.vue";
import SnackMenu from "../views/SnackMenu.vue";
import Cart from "../views/Cart.vue";
import CheckoutView from "../views/CheckoutView.vue";
import InvoiceView from "../views/InvoiceView.vue";

// Admin
import DashboardAdmin from "../views/admin/DashboardAdmin.vue";
import ProductAdmin from "../views/admin/ProductAdmin.vue";
import UsersAdmin from "../views/admin/UsersAdmin.vue";

const routes = [
  { path: "/", component: LoginPage },
  { path: "/sign-up", component: SignUp },

  { path: "/home", component: MainHome, meta: { requiresAuth: true } },
  { path: "/coffe-menu", component: CoffeMenu, meta: { requiresAuth: true } },
  {
    path: "/milkshake-menu",
    component: MilkshakeMenu,
    meta: { requiresAuth: true },
  },
  { path: "/snack-menu", component: SnackMenu, meta: { requiresAuth: true } },
  { path: "/cart", component: Cart, meta: { requiresAuth: true } },
  {
    path: "/checkout",
    name: "checkout",
    component: CheckoutView,
    meta: { requiresAuth: true },
  },
  {
    path: "/invoice/:orderId",
    name: "invoice",
    component: InvoiceView,
    meta: { requiresAuth: true },
  },

  // Admin
  {
    path: "/admin",
    redirect: "/admin/dashboard",
    meta: { requiresAuth: true },
  },
  {
    path: "/admin/dashboard",
    component: DashboardAdmin,
    meta: { requiresAuth: true },
  },
  {
    path: "/admin/products",
    component: ProductAdmin,
    meta: { requiresAuth: true },
  },
  {
    path: "/admin/users",
    component: UsersAdmin,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,

  // 🔝 selalu scroll ke atas
  scrollBehavior() {
    return { top: 0 };
  },
});

// 🔐 AUTH GUARD
router.beforeEach(async (to, from, next) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // belum login
  if (to.meta.requiresAuth && !session) {
    return next("/");
  }

  // khusus admin
  if (to.path.startsWith("/admin")) {
    const userId = session?.user?.id;

    const { data: user, error } = await supabase
      .from("tbl_users")
      .select("role")
      .eq("id", userId)
      .single();

    if (error || user.role !== "admin") {
      return next("/home");
    }
  }

  next();
});

export default router;

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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (to.meta.requiresAuth && !session) {
    next("/");
    return;
  }

  next();
});

export default router;

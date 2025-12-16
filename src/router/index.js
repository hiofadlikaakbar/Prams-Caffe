import { createWebHistory, createRouter } from "vue-router";
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
  { path: "/home", component: MainHome },
  { path: "/coffe-menu", component: CoffeMenu },
  { path: "/milkshake-menu", component: MilkshakeMenu },
  { path: "/snack-menu", component: SnackMenu },
  { path: "/cart", component: Cart },
  {
    path: "/checkout",
    name: "checkout",
    component: CheckoutView,
  },
  {
    path: "/invoice/:orderId",
    name: "invoice",
    component: InvoiceView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

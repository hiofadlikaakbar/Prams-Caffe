<template>
  <nav
    class="fixed top-0 left-0 w-full z-50 font-lexend bg-light-pink shadow-sm px-6 md:px-10 py-5 flex items-center justify-between"
  >
    <div class="flex items-center gap-12">
      <!-- LOGO -->
      <RouterLink to="/home" class="flex items-center gap-2 cursor-pointer">
        <img :src="prams_logo" alt="prams-logo" />
        <span class="font-semibold text-brown text-lg">PRMS</span>
      </RouterLink>

      <!-- DESKTOP MENU -->
      <ul class="hidden md:flex items-center gap-12 font-medium text-slate-900">
        <li>
          <RouterLink to="/coffe-menu" class="hover:text-brown cursor-pointer">
            Coffe
          </RouterLink>
        </li>
        <li>
          <RouterLink
            to="/milkshake-menu"
            class="hover:text-brown cursor-pointer"
          >
            Milkshake
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/snack-menu" class="hover:text-brown cursor-pointer">
            Snacks
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/cart" class="hover:text-brown cursor-pointer">
            Order
          </RouterLink>
        </li>
        <li v-if="isAdmin">
          <RouterLink
            to="/admin/dashboard"
            class="hover:text-brown cursor-pointer"
          >
            Dashboard
          </RouterLink>
        </li>
      </ul>
    </div>

    <!-- RIGHT -->
    <div class="flex items-center gap-4">
      <!-- DESKTOP ICONS -->
      <div class="hidden md:flex items-center gap-6">
        <!-- ACCOUNT -->
        <div class="relative">
          <button
            @click="toggleDropdown('account')"
            class="flex items-center gap-2 hover:text-brown cursor-pointer"
          >
            <User :size="20" />
            Account
            <component
              :is="activeDropdown === 'account' ? ChevronUp : ChevronDown"
              :size="16"
            />
          </button>

          <div
            v-if="activeDropdown === 'account'"
            class="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg border p-2"
          >
            <RouterLink
              to="/sign-up"
              class="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 rounded cursor-pointer"
            >
              <DoorOpen :size="16" />
              Sign Out
            </RouterLink>
          </div>
        </div>

        <!-- CART -->
        <div class="relative">
          <button
            @click="toggleDropdown('cart')"
            class="flex items-center gap-2 hover:text-brown cursor-pointer"
          >
            <div class="relative">
              <ShoppingCart :size="20" />
              <span
                v-if="cart.totalQty"
                class="absolute -top-2 -right-2 bg-coffe text-white text-xs w-5 h-5 rounded-full flex items-center justify-center"
              >
                {{ cart.totalQty }}
              </span>
            </div>
            Cart
            <component
              :is="activeDropdown === 'cart' ? ChevronUp : ChevronDown"
              :size="16"
            />
          </button>

          <div
            v-if="activeDropdown === 'cart'"
            class="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-lg border p-4"
          >
            <p v-if="!cart.items.length" class="text-center text-slate-500">
              Keranjang masih kosong
            </p>

            <ul v-else class="space-y-3 max-h-64 overflow-auto">
              <li
                v-for="item in cart.items"
                :key="item.id"
                class="flex justify-between"
              >
                <div>
                  <p class="font-semibold">{{ item.name }}</p>
                  <p class="text-sm text-slate-500">
                    {{ formatRupiah(item.price) }} x{{ item.quantity }}
                  </p>
                </div>
                <button
                  @click="cart.removeItem(item.id)"
                  class="text-slate-400 hover:text-red-500 cursor-pointer"
                >
                  <Trash2 :size="16" />
                </button>
              </li>
            </ul>

            <RouterLink
              to="/cart"
              class="block mt-4 bg-coffe text-white text-center py-2 rounded-lg hover:bg-coffe/90 cursor-pointer"
            >
              Lihat Keranjang
            </RouterLink>
          </div>
        </div>
      </div>

      <!-- MOBILE HAMBURGER -->
      <button
        @click="isOpen = true"
        class="md:hidden hover:text-brown cursor-pointer"
      >
        <Menu :size="26" />
      </button>
    </div>
  </nav>

  <!-- MOBILE SIDEBAR -->
  <transition name="slide">
    <div
      v-if="isOpen"
      class="fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-60 p-6 flex flex-col"
    >
      <button
        @click="isOpen = false"
        class="self-end mb-6 hover:text-brown cursor-pointer"
      >
        <X :size="26" />
      </button>

      <ul class="flex flex-col gap-6 text-lg font-medium">
        <RouterLink
          @click="close"
          to="/coffe-menu"
          class="cursor-pointer hover:text-brown"
        >
          Coffe
        </RouterLink>

        <RouterLink
          @click="close"
          to="/milkshake-menu"
          class="cursor-pointer hover:text-brown"
        >
          Milkshake
        </RouterLink>

        <RouterLink
          @click="close"
          to="/snack-menu"
          class="cursor-pointer hover:text-brown"
        >
          Snacks
        </RouterLink>

        <RouterLink
          @click="close"
          to="/cart"
          class="flex items-center gap-2 cursor-pointer hover:text-brown"
        >
          Order
          <span
            v-if="cart.totalQty"
            class="bg-coffe text-white text-xs px-2 py-0.5 rounded-full"
          >
            {{ cart.totalQty }}
          </span>
        </RouterLink>
      </ul>

      <!-- MOBILE SIGN OUT -->
      <div class="mt-auto pt-6 border-t">
        <RouterLink
          to="/sign-up"
          class="flex items-center gap-2 text-red-500 hover:bg-red-50 px-3 py-2 rounded cursor-pointer"
        >
          <DoorOpen :size="18" />
          Sign Out
        </RouterLink>
      </div>
    </div>
  </transition>

  <!-- BACKDROP -->
  <div
    v-if="isOpen"
    @click="isOpen = false"
    class="fixed inset-0 bg-black/30 z-55 cursor-pointer"
  ></div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { RouterLink } from "vue-router";
import { supabase } from "../lib/supabase";
import { useCartStore } from "../stores/cart";
import {
  ShoppingCart,
  Menu,
  X,
  User,
  ChevronDown,
  ChevronUp,
  Trash2,
  DoorOpen,
} from "lucide-vue-next";
import prams_logo from "../assets/prams-nav.png";

const cart = useCartStore();
onMounted(() => cart.fetchCart());

const isOpen = ref(false);
const close = () => (isOpen.value = false);

const activeDropdown = ref(null);
const toggleDropdown = (name) =>
  (activeDropdown.value = activeDropdown.value === name ? null : name);

function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(value);
}

const isAdmin = ref(false);
onMounted(async () => {
  const { data } = await supabase.auth.getSession();
  if (!data?.session) return;

  const res = await supabase
    .from("tbl_users")
    .select("role")
    .eq("id", data.session.user.id)
    .single();

  isAdmin.value = res.data?.role === "admin";
});
</script>

<style scoped>
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
.slide-enter-to,
.slide-leave-from {
  transform: translateX(0);
  opacity: 1;
}
.slide-enter-active,
.slide-leave-active {
  transition: 0.25s ease;
}
</style>

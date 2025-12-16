<template>
  <nav
    class="fixed top-0 left-0 w-full z-50 font-lexend bg-light-pink shadow-sm px-6 md:px-10 py-5 flex items-center justify-between"
  >
    <div class="flex items-center gap-12">
      <!-- LEFT : Logo -->
      <RouterLink to="/home" class="flex items-center gap-2 cursor-pointer">
        <img :src="prams_logo" alt="prams-logo" />
        <span class="font-semibold text-brown text-lg">PRMS</span>
      </RouterLink>

      <ul class="hidden md:flex items-center gap-12 font-medium text-slate-900">
        <li>
          <RouterLink to="/coffe-menu" class="hover:text-brown duration-200"
            >Coffe</RouterLink
          >
        </li>
        <li>
          <RouterLink to="/milkshake-menu" class="hover:text-brown duration-200"
            >Milkshake</RouterLink
          >
        </li>
        <li>
          <RouterLink to="/snack-menu" class="hover:text-brown duration-200"
            >Snacks</RouterLink
          >
        </li>
        <li>
          <RouterLink to="/cart" class="hover:text-brown duration-200"
            >Order</RouterLink
          >
        </li>
      </ul>
    </div>
    <!-- RIGHT : Icons + Mobile Hamburger -->
    <div class="flex items-center gap-4">
      <!-- RIGHT : Desktop -->
      <div class="hidden md:flex items-center gap-6">
        <!-- ACCOUNT DROPDOWN -->

        <div class="relative font-lexend">
          <button
            @click="toggleDropdown('account')"
            class="flex items-center gap-2 text-slate-900 hover:text-brown cursor-pointer"
          >
            <User :size="20" />
            <span class="text-sm font-medium">Account</span>

            <component
              :is="activeDropdown === 'account' ? ChevronUp : ChevronDown"
              :size="16"
              class="transition-transform duration-200"
            />
          </button>

          <div
            v-if="activeDropdown === 'account'"
            class="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg border p-2 z-50"
          >
            <ul class="text-sm">
              <li
                class="px-4 py-2 hover:bg-slate-100 text-base font-medium rounded cursor-pointer"
              >
                <User :size="16" class="inline mr-1" />
                Akunku
              </li>
              <li
                class="px-4 py-2 hover:bg-slate-100 text-base font-medium rounded cursor-pointer"
              >
                <Settings :size="16" class="inline mr-1" />
                Settings
              </li>

              <hr class="my-2" />

              <li
                class="px-4 py-2 text-red-500 font-medium hover:bg-red-50 text-base rounded cursor-pointer"
              >
                <DoorOpen :size="16" class="inline mr-1" />
                <RouterLink to="/sign-up"> Sign Out </RouterLink>
              </li>
            </ul>
          </div>
        </div>

        <!-- CART DROPDOWN -->

        <div class="relative font-lexend">
          <button
            @click="toggleDropdown('cart')"
            class="flex items-center gap-2 text-slate-900 cursor-pointer hover:text-brown"
          >
            <div class="relative">
              <ShoppingCart :size="20" />
              <span
                v-if="cart.totalQty > 0"
                class="absolute -top-2 -right-2 bg-coffe text-white text-xs min-w-[18px] h-[18px] rounded-full flex items-center justify-center"
              >
                {{ cart.totalQty }}
              </span>
            </div>

            <span class="text-sm font-medium">My Cart</span>

            <component
              :is="activeDropdown === 'cart' ? ChevronUp : ChevronDown"
              :size="16"
              class="transition-transform duration-200"
            />
          </button>

          <!-- MINI CART -->
          <div
            v-if="activeDropdown === 'cart'"
            class="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-lg border p-4 z-50"
          >
            <p
              v-if="cart.items.length === 0"
              class="text-base text-slate-500 text-center"
            >
              Keranjangnya masih kosong lho ya
            </p>

            <ul v-else class="space-y-3 max-h-64 overflow-auto">
              <li
                v-for="item in cart.items"
                :key="item.id"
                class="flex items-start justify-between gap-3"
              >
                <div class="flex-1">
                  <p class="text-lg font-semibold mb-1">{{ item.name }}</p>
                  <p class="text-base text-slate-500">
                    {{ formatRupiah(item.price) }}
                    <span class="ml-2">x{{ item.quantity }}</span>
                  </p>
                </div>

                <button
                  @click="cart.removeItem(item.id)"
                  class="text-slate-400 cursor-pointer hover:text-red-500"
                >
                  <Trash2 :size="16" />
                </button>
              </li>
            </ul>

            <div v-if="cart.items.length" class="mt-4 border-t pt-3">
              <div class="flex justify-between text-sm font-semibold mb-3">
                <span>Total</span>
                <span>{{ formatRupiah(cart.totalPrice) }}</span>
              </div>

              <RouterLink
                to="/cart"
                class="block w-full text-center bg-coffe text-white py-2 rounded-lg hover:bg-coffe/90"
              >
                Lihat Keranjang
              </RouterLink>
            </div>
          </div>
        </div>
      </div>

      <button
        @click="isOpen = true"
        class="md:hidden text-slate-900 hover:text-brown duration-200 cursor-pointer"
      >
        <Menu :size="26" />
      </button>
    </div>
  </nav>

  <!-- MOBILE SIDEBAR MENU -->
  <transition name="slide">
    <div
      v-if="isOpen"
      class="fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-60 p-6 flex flex-col"
    >
      <!-- Close Button -->
      <button
        @click="isOpen = false"
        class="self-end mb-6 text-slate-900 cursor-pointer hover:text-brown duration-200"
      >
        <X :size="26" />
      </button>

      <!-- Menu Items -->
      <ul class="flex flex-col gap-6 text-slate-900 font-medium text-lg">
        <li>
          <RouterLink @click="close" to="/coffe-menu" class="hover:text-brown"
            >Coffe</RouterLink
          >
        </li>
        <li>
          <RouterLink
            @click="close"
            to="/milkshake-menu"
            class="hover:text-brown"
            >Milkshake</RouterLink
          >
        </li>
        <li>
          <RouterLink @click="close" to="/snack-menu" class="hover:text-brown"
            >Snacks</RouterLink
          >
        </li>
        <li>
          <RouterLink
            @click="close"
            to="/cart"
            class="hover:text-brown flex items-center gap-2"
          >
            Order
            <span
              v-if="cart.totalQty > 0"
              class="bg-coffe text-white text-xs px-2 py-0.5 rounded-full"
            >
              {{ cart.totalQty }}
            </span>
          </RouterLink>
        </li>
      </ul>
    </div>
  </transition>

  <!-- BACKDROP -->
  <div
    v-if="isOpen"
    @click="isOpen = false"
    class="fixed inset-0 bg-black/30 z-55"
  ></div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { RouterLink } from "vue-router";
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
  Settings,
} from "lucide-vue-next";
import prams_logo from "../assets/prams-nav.png";

// notifikasi jumlah item di cart
const cart = useCartStore();
onMounted(() => {
  cart.fetchCart();
});

// buka tutup navbar
const isOpen = ref(false);
const close = () => (isOpen.value = false);

const activeDropdown = ref(null); // 'account' | 'cart' | null

function toggleDropdown(name) {
  activeDropdown.value = activeDropdown.value === name ? null : name;
}

function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(value);
}
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

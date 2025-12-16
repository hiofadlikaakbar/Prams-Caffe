<template>
  <Navbar />

  <div
    class="container mx-auto mt-20 sm:mt-28 font-lexend max-w-5xl px-4 sm:px-0"
  >
    <h1 class="text-xl sm:text-2xl font-semibold mb-6 sm:mb-8">
      Keranjang Belanja
    </h1>

    <!-- Jika kosong -->
    <div
      v-if="cart.items.length === 0"
      class="text-slate-600 text-center py-6 sm:py-0"
    >
      Keranjang masih kosong.
    </div>

    <!-- Jika ada item -->
    <div v-else class="space-y-4 sm:space-y-6">
      <!-- Card Keranjang -->
      <div class="bg-white rounded-xl shadow p-4 sm:p-6 space-y-4">
        <p class="text-sm sm:text-base text-slate-500">
          {{ cart.items.length }} item dalam keranjang
        </p>

        <!-- Item -->
        <div
          v-for="item in cart.items"
          :key="item.id"
          class="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-4 last:border-b-0 gap-4 sm:gap-0"
        >
          <div class="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <!-- Image -->
            <img
              :src="item.image_url"
              class="w-full sm:w-40 h-28 rounded-lg object-cover"
            />

            <!-- Info -->
            <div class="flex-1">
              <p class="font-medium text-sm sm:text-base mb-1">
                {{ item.name }}
              </p>
              <p class="text-xs sm:text-sm text-slate-500">
                {{ formatRupiah(item.price) }}
              </p>
            </div>
          </div>

          <!-- Qty + Remove -->
          <div class="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-0">
            <!-- Minus -->
            <button
              @click="cart.decreaseQty(item.id)"
              class="w-8 h-8 flex items-center justify-center cursor-pointer"
            >
              <MinusCircle />
            </button>

            <span class="w-5 text-center text-sm">{{ item.quantity }}</span>

            <!-- Plus -->
            <button
              @click="cart.increaseQty(item.id)"
              class="w-8 h-8 flex items-center justify-center cursor-pointer"
            >
              <PlusCircle />
            </button>

            <!-- Remove -->
            <button
              @click="cart.removeItem(item.id)"
              class="text-slate-500 hover:text-red-500 ml-2 cursor-pointer"
            >
              <Trash2 />
            </button>
          </div>
        </div>
      </div>

      <!-- Subtotal -->
      <div class="bg-white rounded-xl shadow p-4 sm:p-6">
        <div
          class="flex flex-col sm:flex-row justify-between text-base sm:text-lg font-semibold gap-2 sm:gap-0"
        >
          <span>Subtotal</span>
          <span>{{ formatRupiah(cart.totalPrice) }}</span>
        </div>

        <button
          @click="checkout"
          class="mt-4 sm:mt-5 w-full bg-coffe cursor-pointer hover:bg-coffe/90 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2"
        >
          Checkout
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import Navbar from "../components/Navbar.vue";
import { onMounted } from "vue";
import { useCartStore } from "../stores/cart";
import { useRouter } from "vue-router";
import { PlusCircle, MinusCircle, Trash2 } from "lucide-vue-next";
const cart = useCartStore();
const router = useRouter();

onMounted(() => {
  cart.fetchCart();
});

function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(value);
}

function checkout() {
  Swal.fire({
    icon: "success",
    title: "KELAZZ Masbroo!",
  });
  router.push("/checkout");
}
</script>

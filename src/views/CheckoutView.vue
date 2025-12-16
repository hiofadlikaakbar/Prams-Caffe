<template>
  <div class="container mx-auto px-4 py-10 max-w-5xl">
    <h1 class="text-3xl font-lexend-zetta text-coffe mb-10 text-center">
      Checkout
    </h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- LEFT -->
      <div class="md:col-span-2 space-y-6">
        <!-- CART -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <h2 class="font-semibold text-lg mb-4">Ringkasan Pesanan</h2>

          <div
            v-for="item in cart.items"
            :key="item.id"
            class="flex justify-between items-center border-b py-4 last:border-none"
          >
            <div>
              <p class="font-medium">{{ item.name }}</p>
              <p class="text-sm text-gray-500">
                {{ item.quantity }} × {{ formatRupiah(item.price) }}
              </p>
            </div>
            <p class="font-semibold text-coffe">
              {{ formatRupiah(item.price * item.quantity) }}
            </p>
          </div>
        </div>

        <!-- PAYMENT -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <h2 class="font-semibold text-lg mb-4">Metode Pembayaran</h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label
              v-for="method in paymentMethods"
              :key="method.value"
              class="flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition"
              :class="
                paymentMethod === method.value
                  ? 'border-coffe bg-coffe/10'
                  : 'hover:border-gray-400'
              "
            >
              <input
                type="radio"
                class="accent-coffe"
                :value="method.value"
                v-model="paymentMethod"
              />
              <span class="font-medium">{{ method.label }}</span>
            </label>
          </div>
        </div>
      </div>

      <!-- RIGHT -->
      <div class="bg-white rounded-xl shadow-sm p-6 h-fit">
        <h2 class="font-semibold text-lg mb-4">Total Pembayaran</h2>

        <div class="flex justify-between mb-2 text-gray-600">
          <span>Subtotal</span>
          <span>{{ formatRupiah(total) }}</span>
        </div>

        <div class="flex justify-between font-bold text-xl text-coffe mb-6">
          <span>Total</span>
          <span>{{ formatRupiah(total) }}</span>
        </div>

        <button
          @click="handleCheckout"
          class="w-full bg-coffe hover:bg-coffe/90 text-white py-3 rounded-lg font-semibold transition shadow-md"
        >
          Buat Pesanan
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "../lib/supabase";
import { useCartStore } from "../stores/cart";

const router = useRouter();
const cart = useCartStore();

const paymentMethod = ref("cash");

onMounted(() => {
  cart.fetchCart();
});

const paymentMethods = [
  { value: "cash", label: "Bayar di Tempat" },
  { value: "ovo", label: "OVO" },
  { value: "qris", label: "QRIS" },
  { value: "credit_card", label: "Kartu Kredit" },
];

const total = computed(() =>
  cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
);

function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(value);
}

async function handleCheckout() {
  if (!cart.items.length) {
    return Swal.fire("Keranjang kosong", "", "warning");
  }

  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;

  // 1️⃣ INSERT ORDER
  const { data: order, error } = await supabase
    .from("tbl_orders")
    .insert({
      user_id: user.id,
      total_price: total.value,
      payment_method: paymentMethod.value,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    return Swal.fire("Gagal", error.message, "error");
  }

  // 2️⃣ INSERT ORDER ITEMS
  const itemsPayload = cart.items.map((item) => ({
    order_id: order.id,
    product_id: item.product_id,
    product_type: item.product_type,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    subtotal: item.price * item.quantity,
  }));

  await supabase.from("tbl_order_items").insert(itemsPayload);

  // 3️⃣ CLEAR CART
  await supabase.from("tbl_cart").delete().eq("user_id", user.id);

  // 4️⃣ REDIRECT INVOICE
  router.push(`/invoice/${order.id}`);
}
</script>

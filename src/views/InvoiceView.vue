<template>
  <div
    class="min-h-screen bg-coffe flex justify-center items-center py-10 font-lexend"
  >
    <div
      class="bg-[#fffdf9] w-[380px] rounded-xl shadow-xl p-6 font-mono text-[#3b2f2f]"
    >
      <!-- HEADER -->
      <div class="text-center mb-4">
        <h1 class="font-bold text-2xl tracking-widest font-lexend-zetta mb-1">
          PRMS CF
        </h1>
        <p class="text-sm text-gray-500">Coffee & Chill</p>
      </div>

      <!-- INFO ORDER -->
      <div
        class="border-t border-b border-dashed py-3 text-base mb-4 space-y-1"
      >
        <p><span class="font-semibold">Order ID:</span> {{ order?.id }}</p>
        <p>
          <span class="font-semibold">Tanggal:</span>
          {{ formatDate(order?.created_at) }}
        </p>
        <p>
          <span class="font-semibold">Pembayaran:</span>
          {{ paymentLabel(order?.payment_method) }}
        </p>
      </div>

      <!-- ITEMS -->
      <div class="text-base space-y-3 mb-4">
        <div v-for="item in items" :key="item.id">
          <div class="flex justify-between font-medium">
            <span>{{ item.quantity }}x {{ item.name }}</span>
            <span>{{ formatRupiah(item.subtotal) }}</span>
          </div>
          <div class="text-sm text-gray-500 pl-3">
            @ {{ formatRupiah(item.price) }}
          </div>
        </div>
      </div>

      <!-- TOTAL -->
      <div
        class="border-t border-dashed pt-3 flex justify-between font-bold text-base"
      >
        <span>TOTAL</span>
        <span>{{ formatRupiah(order?.total_price) }}</span>
      </div>

      <!-- PAY VIA WA -->
      <button
        @click="goToWhatsapp"
        class="mt-6 w-full bg-green-600 hover:bg-green-700 transition text-white py-3 rounded-lg font-semibold"
      >
        Lanjutkan Pembayaran via WhatsApp
      </button>

      <!-- FOOTER -->
      <div class="mt-4 text-center text-sm text-gray-500">
        <p>Makasih sudah nongkrong 🫰😹</p>
        <p class="font-semibold text-coffe mt-1">PRMS CF</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { supabase } from "../lib/supabase";

const route = useRoute();
const order = ref(null);
const items = ref([]);

onMounted(async () => {
  const orderId = route.params.orderId;

  const { data: orderData } = await supabase
    .from("tbl_orders")
    .select("*")
    .eq("id", orderId)
    .single();

  const { data: itemsData } = await supabase
    .from("tbl_order_items")
    .select("*")
    .eq("order_id", orderId);

  order.value = orderData;
  items.value = itemsData || [];
});

/* ================== WA ================== */
function goToWhatsapp() {
  const phone = "6282124063463";

  let message = `Halo admin PRMS CF 👋%0A%0A`;
  message += `Saya mau melanjutkan pembayaran:%0A%0A`;
  message += `Order ID: ${order.value.id}%0A`;
  message += `Tanggal: ${formatDate(order.value.created_at)}%0A%0A`;
  message += `Pesanan:%0A`;

  items.value.forEach((i) => {
    message += `${i.quantity}x ${i.name} - ${formatRupiah(i.subtotal)}%0A`;
  });

  message += `%0ATotal: ${formatRupiah(order.value.total_price)}%0A%0A`;
  message += `Terima kasih 🙏`;

  window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
}

/* ================== UTILS ================== */
function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(value || 0);
}

function formatDate(date) {
  return date ? new Date(date).toLocaleString("id-ID") : "-";
}

function paymentLabel(method) {
  const map = {
    cash: "Bayar di Tempat",
    transfer: "Transfer Bank",
    qris: "QRIS",
  };
  return map[method] || "-";
}
</script>

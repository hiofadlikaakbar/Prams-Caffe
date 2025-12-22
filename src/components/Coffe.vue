<template>
  <div id="menu" class="container mx-auto mt-10 pb-32">
    <div class="text-center mb-10">
      <h1 class="text-coffe font-lexend-zetta text-2xl mb-1">Kopi Pilihan</h1>
      <p class="text-slate-950 text-base font-lexend">
        Varian kopi populer kami
      </p>
    </div>

    <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-10 items-center">
      <div
        v-for="coffee in coffees"
        :key="coffee.id"
        class="relative group bg-white rounded-xl overflow-hidden shadow"
      >
        <!-- IMAGE WRAPPER -->
        <div class="w-full h-64 overflow-hidden">
          <img
            :src="coffee.image_full_url"
            :alt="coffee.name"
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <!-- INFO -->
        <div
          class="absolute bottom-0 left-0 w-full bg-black/75 text-white text-center py-2 font-lexend"
        >
          <p class="text-sm">{{ coffee.name }}</p>

          <div class="flex items-center justify-between px-4 mt-1">
            <span class="text-sm">{{ formatRupiah(coffee.price) }}</span>
            <button
              @click="cart.addToCart(coffee, 'coffee')"
              class="bg-white hover:bg-coffe hover:text-white cursor-pointer transition duration-200 text-black text-xs px-3 py-1 rounded"
            >
              Beli
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div
        v-if="loading"
        class="col-span-full text-center text-slate-600 font-lexend"
      >
        Memuat data kopi...
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useCartStore } from "../stores/cart";
import { supabase } from "../lib/supabase";
const coffees = ref([]);
const loading = ref(true);
const cart = useCartStore();
async function fetchCoffee() {
  loading.value = true;

  const { data, error } = await supabase
    .from("tbl_coffee")
    .select("*")
    .limit(4);

  if (error) {
    console.error("Error fetch coffee:", error);
    loading.value = false;
    return;
  }

  // Tambah URL Gambar Storage
  coffees.value = data.map((item) => ({
    ...item,
    image_full_url: supabase.storage
      .from("coffee_images")
      .getPublicUrl(item.image_url).data.publicUrl,
  }));

  loading.value = false;
}

function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(value);
}

onMounted(() => {
  fetchCoffee();
});
</script>

<template>
  <div class="page">
    <Navbar />

    <div class="container mx-auto mt-28 pb-20">
      <div class="text-center mb-10">
        <h1 class="text-coffe font-lexend-zetta text-2xl mb-1">Semua Snack</h1>
        <p class="text-slate-950 text-base font-lexend">
          Teman ngemil yang bikin nagih
        </p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-10 items-start">
        <!-- Loop Snack -->
        <div
          v-for="snack in snacks"
          :key="snack.id"
          class="relative group rounded-lg overflow-hidden shadow-md bg-white"
        >
          <!-- Gambar seragam -->
          <img
            :src="snack.image_full_url"
            :alt="snack.name"
            class="w-full h-56 object-cover"
          />

          <!-- Footer card -->
          <div
            class="absolute bottom-0 left-0 w-full bg-black/75 text-white text-center py-3 font-lexend backdrop-blur"
          >
            <p class="text-sm truncate">{{ snack.name }}</p>

            <div class="flex items-center justify-between px-4 mt-2">
              <span class="text-sm">{{ formatRupiah(snack.price) }}</span>
              <button
                @click="cart.addToCart(snack, 'snack')"
                class="bg-white hover:bg-coffe hover:text-white cursor-pointer transition duration-200 text-black text-xs px-3 py-1 rounded"
              >
                Beli
              </button>
            </div>
          </div>
        </div>

        <!-- Loading -->
        <div
          v-if="loading"
          class="col-span-full text-center text-slate-600 font-lexend"
        >
          Memuat snack...
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Navbar from "../components/Navbar.vue";
import { ref, onMounted } from "vue";
import { supabase } from "../lib/supabase";
import { useCartStore } from "../stores/cart";
const snacks = ref([]);
const loading = ref(true);
const cart = useCartStore();
async function fetchSnacks() {
  loading.value = true;

  const { data, error } = await supabase.from("tbl_snacks").select("*");

  if (error) {
    console.error("Error fetch snacks:", error);
    loading.value = false;
    return;
  }

  // Tambahkan URL storage
  snacks.value = data.map((item) => ({
    ...item,
    image_full_url: supabase.storage
      .from("snacks_images")
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
  fetchSnacks();
});
</script>

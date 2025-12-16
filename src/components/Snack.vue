<template>
  <div class="container mx-auto mt-10 pb-32">
    <div class="text-center mb-10">
      <h1 class="text-coffe font-lexend-zetta text-2xl mb-1">Snacks</h1>
      <p class="text-slate-950 text-base font-lexend">
        Temen ngemil enak lho ya
      </p>
    </div>

    <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-10 items-center">
      <div v-for="snack in snacks" :key="snack.id" class="relative group">
        <img :src="snack.full_image_url" :alt="snack.name" class="w-full" />

        <div
          class="absolute bottom-0 left-0 w-full bg-black/75 text-white text-center py-2 font-lexend"
        >
          <p class="text-sm">{{ snack.name }}</p>

          <div class="flex items-center justify-between px-4 mt-1">
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

      <div
        v-if="loading"
        class="col-span-full text-center text-slate-600 font-lexend"
      >
        Memuat data snack...
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "../lib/supabase";
import { useCartStore } from "../stores/cart";
const snacks = ref([]);
const loading = ref(true);
const cart = useCartStore();
async function fetchSnacks() {
  loading.value = true;

  const { data, error } = await supabase
    .from("tbl_snacks")
    .select("*")
    .order("id")
    .limit(4);

  if (error) {
    console.error("Error fetch snacks:", error);
    loading.value = false;
    return;
  }

  snacks.value = data.map((item) => {
    const imageUrl = supabase.storage
      .from("snacks_images")
      .getPublicUrl(item.image_url).data.publicUrl;

    return {
      ...item,
      full_image_url: imageUrl,
    };
  });

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

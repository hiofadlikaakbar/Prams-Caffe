<template>
  <div class="container mx-auto mt-10 pb-32">
    <!-- HEADER -->
    <div class="text-center mb-10">
      <h1 class="text-coffe font-lexend-zetta text-2xl mb-1">Snacks</h1>
      <p class="text-slate-950 text-base font-lexend">
        Temen ngemil enak lho ya
      </p>
    </div>

    <!-- MARQUEE -->
    <div class="marquee-wrapper">
      <div
        ref="track"
        class="marquee-track"
        @mouseenter="paused = true"
        @mouseleave="paused = false"
      >
        <div
          v-for="(snack, index) in duplicatedSnacks"
          :key="index"
          class="item relative bg-white rounded-xl overflow-hidden shadow"
        >
          <!-- IMAGE -->
          <div class="w-full h-64 overflow-hidden">
            <img
              :src="snack.full_image_url"
              :alt="snack.name"
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          <!-- INFO -->
          <div
            class="absolute bottom-0 left-0 w-full bg-black/75 text-white text-center py-2 font-lexend"
          >
            <p class="text-sm truncate">{{ snack.name }}</p>

            <div class="flex items-center justify-between px-4 mt-1">
              <span class="text-sm">{{ formatRupiah(snack.price) }}</span>
              <button
                @click="cart.addToCart(snack, 'snacks')"
                class="bg-white hover:bg-coffe hover:text-white transition cursor-pointer text-black text-xs px-3 py-1 rounded"
              >
                Beli
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- LOADING -->
      <div
        v-if="loading"
        class="absolute inset-0 flex items-center justify-center text-slate-600 font-lexend"
      >
        Memuat data snack...
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { supabase } from "../lib/supabase";
import { useCartStore } from "../stores/cart";

const snacks = ref([]);
const loading = ref(true);
const paused = ref(false);
const cart = useCartStore();

const track = ref(null);
let x = 0;
let rafId = null;
let trackWidth = 0;

/* DUPLIKASI DATA UNTUK SEAMLESS */
const duplicatedSnacks = computed(() => [...snacks.value, ...snacks.value]);

/* FETCH DATA */
async function fetchSnacks() {
  loading.value = true;

  const { data, error } = await supabase
    .from("tbl_snacks")
    .select("*")
    .order("id")
    .limit(4);

  if (!error) {
    snacks.value = data.map((item) => ({
      ...item,
      full_image_url: supabase.storage
        .from("snacks_images")
        .getPublicUrl(item.image_url).data.publicUrl,
    }));
  }

  loading.value = false;
}

/* FORMAT RUPIAH */
function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(value);
}

/* ANIMASI MARQUEE KE KANAN */
function animate() {
  if (!paused.value) {
    x -= 1;
    if (Math.abs(x) >= trackWidth / 2) {
      x = 0;
    }
    track.value.style.transform = `translateX(${x}px)`;
  }
  rafId = requestAnimationFrame(animate);
}

onMounted(async () => {
  await fetchSnacks();

  requestAnimationFrame(() => {
    trackWidth = track.value.scrollWidth;
    animate();
  });
});

onBeforeUnmount(() => {
  cancelAnimationFrame(rafId);
});
</script>

<style scoped>
.marquee-wrapper {
  position: relative;
  overflow: hidden;
  width: 100%;
}

.marquee-track {
  display: flex;
  gap: 2.5rem;
  width: max-content;
}

.item {
  min-width: 260px;
}
</style>

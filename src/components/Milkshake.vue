<template>
  <div id="menu" class="container mx-auto mt-10 pt-10 pb-10">
    <!-- HEADER -->
    <div class="text-center mb-10">
      <h1 class="text-coffe font-lexend-zetta text-2xl mb-1">Milkshake</h1>
      <p class="text-slate-950 text-base font-lexend">
        Milkshake teman nongkrong kamu
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
          v-for="(milkshake, index) in duplicatedMilkshakes"
          :key="index"
          class="item relative bg-white rounded-xl overflow-hidden shadow"
        >
          <!-- IMAGE -->
          <div class="w-full h-56 overflow-hidden">
            <img
              :src="milkshake.image_full_url"
              :alt="milkshake.name"
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          <!-- INFO -->
          <div
            class="absolute bottom-0 left-0 w-full bg-black/75 text-white text-center py-2 font-lexend"
          >
            <p class="text-sm truncate">{{ milkshake.name }}</p>

            <div class="flex items-center justify-between px-4 mt-1">
              <span class="text-sm">
                {{ formatRupiah(milkshake.price) }}
              </span>
              <button
                @click="cart.addToCart(milkshake, 'milkshake')"
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
        Memuat data milkshake...
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { supabase } from "../lib/supabase";
import { useCartStore } from "../stores/cart";

const milkshakes = ref([]);
const loading = ref(true);
const paused = ref(false);
const cart = useCartStore();

const track = ref(null);
let x = 0;
let rafId = null;
let trackWidth = 0;

/* DUPLIKASI DATA (ANTI KEDIP) */
const duplicatedMilkshakes = computed(() => [
  ...milkshakes.value,
  ...milkshakes.value,
]);

/* FETCH DATA */
async function fetchMilkshakes() {
  loading.value = true;

  const { data, error } = await supabase
    .from("tbl_milkshake")
    .select("*")
    .limit(4);

  if (!error) {
    milkshakes.value = data.map((item) => ({
      ...item,
      image_full_url: supabase.storage
        .from("milkshake_images")
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

/* LOOP ANIMATION (SEAMLESS) */
function animate() {
  if (!paused.value) {
    x -= 1; // SPEED SAMA DENGAN COFFEE
    if (Math.abs(x) >= trackWidth / 2) {
      x = 0;
    }
    track.value.style.transform = `translateX(${x}px)`;
  }
  rafId = requestAnimationFrame(animate);
}

onMounted(async () => {
  await fetchMilkshakes();

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

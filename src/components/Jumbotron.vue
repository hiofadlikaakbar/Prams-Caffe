<template>
  <section
    class="w-full h-[85vh] px-4 bg-cover bg-center relative flex items-center justify-center"
    :style="`background-image: url(${prams_bg});`"
  >
    <!-- Overlay gelap transparan -->
    <div class="absolute inset-0 bg-black/20"></div>

    <!-- Gradient putih dari bawah -->
    <div
      class="absolute bottom-0 left-0 right-0 h-full bg-linear-to-t from-white to-transparent"
    ></div>

    <!-- TEXT CONTENT -->
    <div class="relative z-10 text-center text-coffe">
      <p class="tracking-widest font-medium font-lexend-zetta text-base mb-3">
        Berdiri 2024
      </p>

      <h1
        class="text-3xl lg:text-6xl font-lexend-zetta text-slate-950 font-bold leading-tight"
      >
        PRAMS <span class="text-brown">CAFFE</span>
      </h1>

      <p class="mt-4 text-coffe text-base lg:text-xl font-lexend">
        Beragam kehangatan dan cerita ada di cafe kami
      </p>

      <a
        @click.prevent="scrollToMenu"
        class="mt-6 px-6 py-2 inline-block border cursor-pointer border-[#8a522e] font-lexend-zetta text-[#8a522e] rounded-full hover:bg-coffe hover:text-white transition"
      >
        Jelajahi Menu
      </a>
    </div>
  </section>
</template>

<script setup>
import prams_bg from "../assets/prams-bg.jpg";
const scrollToMenu = () => {
  const menu = document.getElementById("menu");
  if (!menu) return;

  const offset = 120;
  const elementPosition = menu.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth",
  });
};
</script>

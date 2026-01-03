<template>
  <header>
    <Navbar />
  </header>

  <section>
    <Jumbotron />
  </section>

  <section>
    <Coffe />
  </section>

  <section class="bg-light-pink">
    <Milkshake />
  </section>

  <section>
    <Snack />
  </section>
  <footer>
    <Footer></Footer>
  </footer>
</template>

<script setup>
import Navbar from "../components/Navbar.vue";
import Jumbotron from "../components/Jumbotron.vue";
import Coffe from "../components/Coffe.vue";
import Milkshake from "../components/Milkshake.vue";
import Snack from "../components/Snack.vue";
import Footer from "../components/Footer.vue";
</script>

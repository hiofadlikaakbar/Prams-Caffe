<template>
  <div class="page">
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
  </div>
</template>

<script setup>
import Navbar from "../components/Navbar.vue";
import Jumbotron from "../components/Jumbotron.vue";
import Coffe from "../components/Coffe.vue";
import Milkshake from "../components/Milkshake.vue";
import Snack from "../components/Snack.vue";
</script>

<style scoped>
.page {
  min-height: 100vh;
}
</style>

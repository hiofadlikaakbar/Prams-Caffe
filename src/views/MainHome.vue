<template>
  <header>
    <Navbar></Navbar>
  </header>
  <section>
    <Jumbotron></Jumbotron>
  </section>
  <section>
    <Coffe></Coffe>
  </section>
  <section class="bg-light-pink">
    <Milkshake></Milkshake>
  </section>
  <section>
    <Snack></Snack>
  </section>
</template>

<script setup>
import Navbar from "../components/Navbar.vue";
import Jumbotron from "../components/Jumbotron.vue";
import Coffe from "../components/Coffe.vue";
import Milkshake from "../components/Milkshake.vue";
import Snack from "../components/Snack.vue";
</script>

<template>
  <section class="w-full min-h-screen flex">
    <!-- LEFT SIDE -->
    <div
      class="hidden w-1/2 bg-linear-to-br from-[#f9f3ef] to-[#f4ebe6] md:flex flex-col justify-center items-center text-center px-16"
    >
      <img :src="coffe_logo" alt="coffe-logo" class="mb-5" />

      <h1 class="text-3xl font-semibold text-[#6b5142] mb-">Selamat Datang!</h1>

      <p class="text-[#8d7a6f] text-lg">
        Daftar dan nikmati pengalaman kopi terbaik bersama PRMS CF
      </p>
    </div>

    <!-- RIGHT SIDE -->
    <div class="w-full md:w-1/2 flex justify-center items-center">
      <div class="w-[70%] max-w-md">
        <!-- Logo -->
        <div class="flex flex-col items-center mb-8">
          <Coffee :size="42" class="text-brown" />
          <div class="font-semibold text-brown tracking-wide mt-2">PRMS CF</div>
        </div>

        <h2 class="text-2xl font-semibold text-[#6b5142] mb-2 text-center">
          Buat Akun
        </h2>
        <p class="text-center text-[#8d7a6f] mb-8">
          Silakan daftar untuk melanjutkan
        </p>

        <!-- FORM -->
        <form>
          <!-- NAMA -->
          <label class="text-sm text-slate-900">Nama</label>
          <div class="relative">
            <User class="absolute left-0 top-3 text-gray-500" :size="18" />
            <input
              v-model="name"
              type="text"
              placeholder="Nama lengkap"
              class="mt-1 mb-4 w-full border-b border-gray-300 focus:outline-none py-2 pl-7"
            />
          </div>

          <!-- EMAIL -->
          <label class="text-sm text-slate-900">Email</label>
          <div class="relative">
            <Mail class="absolute left-0 top-3 text-gray-500" :size="18" />
            <input
              v-model="email"
              type="email"
              placeholder="nama@email.com"
              class="mt-1 mb-4 w-full border-b border-gray-300 focus:outline-none py-2 pl-7"
            />
          </div>

          <!-- PASSWORD -->
          <label class="text-sm text-slate-900">Password</label>
          <div class="relative">
            <Lock class="absolute left-0 top-3 text-gray-500" :size="18" />

            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Masukkan password"
              class="mt-1 mb-1 w-full border-b border-gray-300 focus:outline-none py-2 pl-7 pr-8"
            />

            <!-- Eye icon -->
            <component
              :is="showPassword ? EyeOff : Eye"
              class="absolute right-0 top-3 text-gray-500 cursor-pointer"
              :size="18"
              @click="showPassword = !showPassword"
            />
          </div>

          <button
            @click.prevent="handleSignup"
            class="w-full py-3 bg-brown text-white cursor-pointer rounded-md font-semibold mt-6"
          >
            <span v-if="!loading">Daftar</span>
            <span v-else>Loading...</span>
          </button>
        </form>

        <p class="text-center text-sm mt-5 text-[#8d7a6f]">
          Sudah punya akun?
          <RouterLink to="/" class="text-brown font-semibold"
            >Lanjut Sini</RouterLink
          >
        </p>
      </div>
    </div>
  </section>
</template>
<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

import { supabase } from "../lib/supabase";

import coffe_logo from "../assets/coffe-logo.png";
import { Coffee, Mail, Lock, Eye, EyeOff, User } from "lucide-vue-next";

const router = useRouter();

const showPassword = ref(false);
const name = ref("");
const email = ref("");
const password = ref("");
const loading = ref(false);

async function handleSignup() {
  if (!name.value || !email.value || !password.value) {
    return Swal.fire("Waduh 😹", "Semua field wajib diisi", "warning");
  }

  loading.value = true;

  // 1️⃣ SIGN UP KE SUPABASE AUTH
  const { data, error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
  });

  if (error) {
    loading.value = false;
    return Swal.fire({
      icon: "error",
      title: "Gagal daftar",
      text: error.message,
      confirmButtonColor: "#6b5142",
    });
  }

  // 2️⃣ INSERT PROFILE KE tbl_users
  const { error: profileError } = await supabase.from("tbl_users").insert({
    id: data.user.id,
    name: name.value,
    email: email.value,
  });

  loading.value = false;

  if (profileError) {
    return Swal.fire({
      icon: "error",
      title: "Gagal nyimpen profile",
      text: profileError.message,
      confirmButtonColor: "#6b5142",
    });
  }

  // 3️⃣ SUCCESS
  Swal.fire({
    icon: "success",
    title: "Hore😹 akun berhasil dibuat",
    text: "Langsung order ga sih",
    confirmButtonColor: "#6b5142",
  }).then(() => {
    router.push("/home");
  });
}
</script>

<template>
  <section class="w-full min-h-screen flex">
    <!-- LEFT SIDE -->
    <div
      class="hidden w-1/2 bg-linear-to-br from-[#f9f3ef] to-[#f4ebe6] md:flex flex-col justify-center items-center text-center px-16"
    >
      <img :src="coffe_logo" alt="coffe-logo" class="mb-5" />

      <h1 class="text-3xl font-semibold text-[#6b5142] mb-">
        Selamat Datang Kembali
      </h1>

      <p class="text-[#8d7a6f] text-lg">
        Nikmati pengalaman kopi terbaik bersama PRMS CF
      </p>
    </div>

    <!-- RIGHT SIDE -->
    <div class="w-full md:w-1/2 flex justify-center items-center">
      <div class="w-[70%] max-w-md">
        <!-- LOGO APP -->
        <div class="flex flex-col items-center mb-8">
          <Coffee :size="42" class="text-brown" />
          <div class="font-semibold text-brown tracking-wide mt-2">PRMS CF</div>
        </div>

        <h2 class="text-2xl font-semibold text-[#6b5142] mb-2 text-center">
          Login
        </h2>
        <p class="text-center text-[#8d7a6f] mb-8">Selamat datang kembali!</p>

        <!-- FORM LOGIN -->
        <form>
          <!-- EMAIL -->
          <label class="text-sm text-slate-900">Email</label>
          <div class="relative">
            <Mail class="absolute left-0 top-3 text-gray-500" :size="18" />

            <!-- v-model EMAIL -->
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

            <!-- v-model PASSWORD + show/hide -->
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Masukkan password"
              class="mt-1 mb-1 w-full border-b border-gray-300 focus:outline-none py-2 pl-7 pr-8"
            />

            <!-- Eye icon (show/hide) -->
            <component
              :is="showPassword ? EyeOff : Eye"
              class="absolute right-0 top-3 text-gray-500 cursor-pointer"
              :size="18"
              @click="showPassword = !showPassword"
            />
          </div>

          <p class="text-right text-sm text-[#8d7a6f] cursor-pointer mb-6">
            Lupa Password?
          </p>

          <!-- BUTTON LOGIN -->
          <button
            @click.prevent="handleLogin"
            class="w-full py-3 bg-brown text-white rounded-md font-semibold cursor-pointer"
          >
            <span v-if="!loading">Masuk</span>
            <span v-else>Loading...</span>
          </button>
        </form>

        <p class="text-center text-sm mt-5 text-[#8d7a6f]">
          Belum punya akun?
          <RouterLink to="/sign-up" class="text-brown font-semibold">
            Buat Sini
          </RouterLink>
        </p>

        <!-- FOOTER -->
        <div
          class="text-center text-xs text-[#8d7a6f] mt-10 flex flex-col items-center gap-1"
        >
          <div class="flex items-center gap-2">
            <Phone :size="14" /> <span>+123-456-789</span>
          </div>
          <div class="flex items-center gap-2">
            <Mail :size="14" /> <span>prmscf@gmail.com</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// IMPORT SEMUA YANG DIBUTUHKAN
import { ref } from "vue";
import { supabase } from "../lib/supabase"; // Supabase client
import coffe_logo from "../assets/coffe-logo.png";

// Icon
import { Coffee, Mail, Lock, Eye, EyeOff, Phone } from "lucide-vue-next";

// STATE UNTUK SHOW/HIDE PASSWORD
const showPassword = ref(false);

// STATE INPUT FORM LOGIN
const email = ref("");
const password = ref("");

// LOADING STATE UNTUK TOMBOL
const loading = ref(false);

/*  
  ===========================
  FUNGSI LOGIN
  ===========================
*/
async function handleLogin() {
  loading.value = true;

  if (!email.value || !password.value) {
    loading.value = false;
    return Swal.fire({
      icon: "warning",
      title: "Apesal kau ni lengkapin semua dulu dong😹",
      text: "Email dan password wajib diisi",
      confirmButtonColor: "#6b5142",
    });
  }

  // ✅ LOGIN VIA SUPABASE AUTH
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  });

  loading.value = false;

  if (error) {
    return Swal.fire({
      icon: "error",
      title: "Gagal login, Password atau email salah😹",
      text: error.message,
      confirmButtonColor: "#6b5142",
    });
  }

  // ✅ AMBIL PROFILE USER
  const { data: profile } = await supabase
    .from("tbl_users")
    .select("*")
    .eq("id", data.user.id)
    .single();

  // (optional) simpan ke localStorage / pinia
  localStorage.setItem("user", JSON.stringify(profile));

  Swal.fire({
    icon: "success",
    title: "Yo Nakama😹",
    text: "Welcome back to PRMS CF",
    confirmButtonColor: "#6b5142",
  }).then(() => {
    window.location.href = "/home";
  });
}
</script>

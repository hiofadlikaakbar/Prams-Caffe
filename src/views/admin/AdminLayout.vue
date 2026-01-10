<template>
  <div class="h-screen flex bg-[#faf7f3] font-lexend overflow-hidden">
    <aside
      class="hidden md:flex w-64 flex-col bg-linear-to-b from-[#3b2f2f] to-[#2a1f1f] text-white px-6 py-8"
    >
      <h1 class="text-xl font-bold mb-10 tracking-wide">PRMS CF</h1>

      <nav class="space-y-1">
        <RouterLink
          v-for="item in menu"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 px-4 py-2 rounded-lg transition cursor-pointer"
          active-class="bg-white/15"
        >
          <component :is="item.icon" class="w-5 h-5" />
          <span>{{ item.label }}</span>
        </RouterLink>
      </nav>

      <button
        @click="logout"
        class="mt-auto flex items-center gap-2 text-sm opacity-70 hover:opacity-100 cursor-pointer"
      >
        <LogOut class="w-4 h-4" />
        Logout
      </button>
    </aside>

    <main class="flex-1 overflow-y-auto p-6 md:p-10">
      <slot></slot>
    </main>
  </div>
</template>

<script setup>
import { supabase } from "../../lib/supabase";
import { useRouter } from "vue-router";
import {
  LayoutDashboard,
  Package,
  Users,
  LogOut,
  ShoppingCart,
} from "lucide-vue-next";

const router = useRouter();

const menu = [
  { label: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Produk", to: "/admin/products", icon: Package },
  { label: "Users", to: "/admin/users", icon: Users },
  { label: "Order", to: "/admin/orders", icon: ShoppingCart },
];

async function logout() {
  await supabase.auth.signOut();
  router.push("/");
}
</script>

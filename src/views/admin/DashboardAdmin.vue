<template>
  <AdminLayout>
    <h1 class="text-3xl font-semibold mb-8">Dashboard</h1>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
      <StatCard title="Coffee" :value="stats.coffee" />
      <StatCard title="Milkshake" :value="stats.milkshake" />
      <StatCard title="Snacks" :value="stats.snack" />
      <StatCard title="Users" :value="stats.users" />
    </div>

    <div class="bg-white rounded-xl shadow p-6">
      <h2 class="font-semibold mb-4">Produk Terbaru</h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          v-for="p in recentProducts"
          :key="p.id"
          class="border rounded-lg p-4 hover:shadow transition"
        >
          <p class="font-medium">{{ p.name }}</p>
          <p class="text-sm text-gray-500">
            {{ formatRupiah(p.price) }}
          </p>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "../../lib/supabase";
import AdminLayout from "./AdminLayout.vue";
import StatCard from "../../components/admin/StatCard.vue";

const stats = ref({
  coffee: 0,
  milkshake: 0,
  snack: 0,
  users: 0,
});

const recentProducts = ref([]);

onMounted(async () => {
  const { count: coffee } = await supabase
    .from("tbl_coffee")
    .select("*", { count: "exact", head: true });

  const { count: milkshake } = await supabase
    .from("tbl_milkshake")
    .select("*", { count: "exact", head: true });

  const { count: snack } = await supabase
    .from("tbl_snacks")
    .select("*", { count: "exact", head: true });

  const { count: users } = await supabase
    .from("tbl_users")
    .select("*", { count: "exact", head: true });

  stats.value = { coffee, milkshake, snack, users };

  const { data } = await supabase
    .from("tbl_coffee")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(3);

  recentProducts.value = data || [];
});

function formatRupiah(v) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(v);
}
</script>

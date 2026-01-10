<template>
  <AdminLayout>
    <h1 class="text-3xl font-semibold mb-8">Dashboard</h1>

    <!-- STAT CARDS -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
      <StatCard title="Coffee" :value="stats.coffee" />
      <StatCard title="Milkshake" :value="stats.milkshake" />
      <StatCard title="Snacks" :value="stats.snack" />
      <StatCard title="Users" :value="stats.users" />
    </div>

    <!-- CHART -->
    <div class="bg-white rounded-xl shadow p-6 mb-10">
      <h2 class="font-semibold mb-4">Pendapatan Bulanan</h2>
      <canvas ref="chartEl" height="100"></canvas>
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
import Chart from "chart.js/auto";

const stats = ref({
  coffee: 0,
  milkshake: 0,
  snack: 0,
  users: 0,
});

const recentProducts = ref([]);
const chartEl = ref(null);
let chartInstance = null;

onMounted(async () => {
  const [
    { count: coffee },
    { count: milkshake },
    { count: snack },
    { count: users },
  ] = await Promise.all([
    supabase.from("tbl_coffee").select("*", { count: "exact", head: true }),
    supabase.from("tbl_milkshake").select("*", { count: "exact", head: true }),
    supabase.from("tbl_snacks").select("*", { count: "exact", head: true }),
    supabase.from("tbl_users").select("*", { count: "exact", head: true }),
  ]);

  stats.value = { coffee, milkshake, snack, users };

  const { data } = await supabase
    .from("tbl_coffee")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(3);

  recentProducts.value = data || [];

  fetchIncomeChart();
});

async function fetchIncomeChart() {
  const { data, error } = await supabase
    .from("tbl_orders")
    .select("total_price, created_at")
    .eq("status", "paid");

  if (error) {
    console.error(error);
    return;
  }

  // group per bulan
  const grouped = {};
  data.forEach((o) => {
    const d = new Date(o.created_at);
    const key = d.toLocaleString("id-ID", {
      month: "short",
      year: "numeric",
    });

    grouped[key] = (grouped[key] || 0) + o.total_price;
  });

  renderChart(Object.keys(grouped), Object.values(grouped));
}

// chart
function renderChart(labels, values) {
  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(chartEl.value, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Pendapatan",
          data: values,
          backgroundColor: "#36241a",
          borderRadius: 8,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
      },
      scales: {
        y: {
          ticks: {
            callback: (v) =>
              new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                maximumFractionDigits: 0,
              }).format(v),
          },
        },
      },
    },
  });
}

// util
function formatRupiah(v) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(v || 0);
}
</script>

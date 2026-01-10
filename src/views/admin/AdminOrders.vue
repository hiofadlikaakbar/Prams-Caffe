<template>
  <AdminLayout>
    <!-- HEADER -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold">Orders</h1>

      <!-- FILTER -->
      <div class="flex gap-1 bg-[#3b2f2f] p-1 rounded-lg">
        <button
          v-for="f in filters"
          :key="f.value"
          @click="setFilter(f.value)"
          class="px-4 py-2 text-sm rounded-md transition cursor-pointer font-medium"
          :class="
            filter === f.value
              ? 'bg-[#6f4e37] text-white shadow'
              : 'text-white/70 hover:text-white'
          "
        >
          {{ f.label }}
        </button>
      </div>
    </div>

    <!-- TABLE -->
    <div class="bg-white rounded-xl shadow overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-100">
          <tr>
            <th class="p-3 text-left">Order ID</th>
            <th class="p-3 text-center">Total</th>
            <th class="p-3 text-center">Metode</th>
            <th class="p-3 text-center">Status</th>
            <th class="p-3 text-center">Tanggal</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="o in orders" :key="o.id" class="border-t hover:bg-gray-50">
            <td class="p-3 font-mono text-xs">
              {{ o.id }}
            </td>

            <td class="p-3 text-center">
              {{ formatRupiah(o.total_price) }}
            </td>

            <td class="p-3 text-center capitalize">
              {{ o.payment_method }}
            </td>

            <!-- STATUS TAG -->
            <td class="p-3 text-center">
              <span
                @click="toggleStatus(o)"
                class="px-2 py-1 text-xs rounded-full font-medium cursor-pointer select-none"
                :class="
                  o.status === 'paid'
                    ? 'bg-green-100 text-green-600'
                    : 'bg-yellow-100 text-yellow-700'
                "
              >
                {{ o.status === "paid" ? "Paid" : "Pending" }}
              </span>
            </td>

            <td class="p-3 text-center text-xs text-gray-500">
              {{ formatDate(o.created_at) }}
            </td>
          </tr>

          <tr v-if="orders.length === 0">
            <td colspan="5" class="text-center py-6 text-gray-500">
              Tidak ada order
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "../../lib/supabase";
import AdminLayout from "./AdminLayout.vue";

const orders = ref([]);
const filter = ref("all");

// fetch
async function fetchOrders() {
  let query = supabase
    .from("tbl_orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (filter.value !== "all") {
    query = query.eq("status", filter.value);
  }

  const { data, error } = await query;

  if (error) {
    Swal.fire("Error", error.message, "error");
    return;
  }

  orders.value = data || [];
}

onMounted(fetchOrders);

// status pembayaran
async function toggleStatus(order) {
  const nextStatus = order.status === "pending" ? "paid" : "pending";

  const confirm = await Swal.fire({
    title: "Ubah status?",
    text: `Order akan diubah menjadi ${nextStatus}`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Ya",
  });

  if (!confirm.isConfirmed) return;

  const { error } = await supabase
    .from("tbl_orders")
    .update({ status: nextStatus })
    .eq("id", order.id);

  if (error) {
    Swal.fire("Error", error.message, "error");
    return;
  }

  // 🔥 update lokal (tanpa reload)
  order.status = nextStatus;
}

const filters = [
  { label: "Semua", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Paid", value: "paid" },
];

function setFilter(val) {
  filter.value = val;
  fetchOrders();
}

// utils
function formatRupiah(v) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(v || 0);
}

function formatDate(d) {
  return d ? new Date(d).toLocaleString("id-ID") : "-";
}
</script>

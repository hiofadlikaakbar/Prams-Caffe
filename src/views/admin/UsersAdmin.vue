<template>
  <AdminLayout>
    <!-- HEADER -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold">Users</h1>

      <button
        @click="openAdd"
        class="bg-coffe text-white px-4 py-2 rounded flex items-center gap-2 cursor-pointer hover:opacity-90 transition"
      >
        <UserPlus class="w-4 h-4" />
        Tambah User
      </button>
    </div>

    <!-- TABLE -->
    <div class="bg-white rounded-xl shadow overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-100">
          <tr>
            <th class="p-3 text-left">User</th>
            <th class="p-3 text-center">Role</th>
            <th class="p-3 text-center">Aksi</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="u in users" :key="u.id" class="border-t hover:bg-gray-50">
            <!-- USER -->
            <td class="p-3">
              <div class="flex items-center gap-3">
                <div
                  class="w-9 h-9 rounded-full bg-coffe text-white font-semibold flex items-center justify-center"
                >
                  {{ getInitial(u.name) }}
                </div>

                <div class="leading-tight">
                  <p class="font-medium">{{ u.name }}</p>
                  <p class="text-xs text-gray-400">{{ u.email }}</p>
                </div>
              </div>
            </td>

            <!-- ROLE -->
            <td class="p-3 text-center">
              <span
                class="px-2 py-1 text-xs rounded-full font-medium"
                :class="
                  u.role === 'admin'
                    ? 'bg-red-100 text-red-600'
                    : 'bg-gray-100 text-gray-600'
                "
              >
                {{ u.role }}
              </span>
            </td>

            <!-- AKSI -->
            <td class="p-3 text-center space-x-3">
              <button
                @click="openEdit(u)"
                class="text-blue-500 hover:text-blue-700 cursor-pointer transition"
              >
                <Pencil class="w-4 h-4 inline" />
              </button>

              <button
                @click="remove(u.id)"
                class="text-red-500 hover:text-red-700 cursor-pointer transition"
              >
                <Trash2 class="w-4 h-4 inline" />
              </button>
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

import { Pencil, Trash2, UserPlus } from "lucide-vue-next";

/* ================= STATE ================= */
const users = ref([]);

/* ================= FETCH ================= */
async function fetchUsers() {
  const { data, error } = await supabase
    .from("tbl_users")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    Swal.fire("Error", error.message, "error");
    return;
  }

  users.value = data || [];
}

onMounted(fetchUsers);

/* ================= ADD ================= */
async function openAdd() {
  const { value } = await Swal.fire({
    title: "Tambah User",
    html: `
      <input id="swal-name" class="swal2-input" placeholder="Nama">
      <input id="swal-email" class="swal2-input" placeholder="Email">
      <select id="swal-role" class="swal2-input">
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
    `,
    showCancelButton: true,
    confirmButtonText: "Simpan",
    focusConfirm: false,
    preConfirm: () => {
      const name = document.getElementById("swal-name").value;
      const email = document.getElementById("swal-email").value;
      const role = document.getElementById("swal-role").value;

      if (!name || !email) {
        Swal.showValidationMessage("Nama dan Email wajib diisi");
        return;
      }

      return { name, email, role };
    },
  });

  if (!value) return;

  const { error } = await supabase.from("tbl_users").insert(value);

  if (error) {
    Swal.fire("Error", error.message, "error");
    return;
  }

  Swal.fire("Berhasil", "User berhasil ditambahkan", "success");
  fetchUsers();
}

/* ================= EDIT ================= */
async function openEdit(u) {
  const { value } = await Swal.fire({
    title: "Edit User",
    html: `
      <input id="swal-name" class="swal2-input" value="${u.name}">
      <input class="swal2-input" value="${u.email}" disabled>
      <select id="swal-role" class="swal2-input">
        <option value="user" ${
          u.role === "user" ? "selected" : ""
        }>User</option>
        <option value="admin" ${
          u.role === "admin" ? "selected" : ""
        }>Admin</option>
      </select>
    `,
    showCancelButton: true,
    confirmButtonText: "Update",
    focusConfirm: false,
    preConfirm: () => {
      const name = document.getElementById("swal-name").value;
      const role = document.getElementById("swal-role").value;

      if (!name) {
        Swal.showValidationMessage("Nama tidak boleh kosong");
        return;
      }

      return { name, role };
    },
  });

  if (!value) return;

  const { error } = await supabase
    .from("tbl_users")
    .update(value)
    .eq("id", u.id);

  if (error) {
    Swal.fire("Error", error.message, "error");
    return;
  }

  Swal.fire("Berhasil", "User berhasil diperbarui", "success");
  fetchUsers();
}

/* ================= DELETE ================= */
async function remove(id) {
  const result = await Swal.fire({
    title: "Hapus user?",
    text: "Data tidak bisa dikembalikan",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    confirmButtonText: "Ya, hapus",
  });

  if (!result.isConfirmed) return;

  const { error } = await supabase.from("tbl_users").delete().eq("id", id);

  if (error) {
    Swal.fire("Error", error.message, "error");
    return;
  }

  Swal.fire("Terhapus", "User berhasil dihapus", "success");
  fetchUsers();
}

/* ================= UTILS ================= */
function getInitial(name) {
  return name?.charAt(0).toUpperCase() || "?";
}
</script>

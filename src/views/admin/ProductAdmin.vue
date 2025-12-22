<template>
  <AdminLayout>
    <!-- HEADER -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold">Produk</h1>

      <button
        @click="openForm()"
        class="bg-coffe text-white px-4 py-2 rounded flex items-center gap-2 cursor-pointer hover:opacity-90 transition"
      >
        <Plus class="w-4 h-4" />
        Tambah Produk
      </button>
    </div>

    <!-- CATEGORY -->
    <div class="flex gap-2 mb-6">
      <button
        v-for="c in categories"
        :key="c.value"
        @click="selectedCategory = c.value"
        class="px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition"
        :class="
          selectedCategory === c.value
            ? 'bg-coffe text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        "
      >
        {{ c.label }}
      </button>
    </div>

    <!-- LIST PRODUK -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div
        v-for="p in products"
        :key="p.id"
        class="bg-white rounded-xl p-4 shadow hover:shadow-md transition"
      >
        <img
          :src="getImageUrl(p.image_url)"
          class="w-full h-40 object-cover rounded mb-3"
        />

        <p class="font-semibold truncate">{{ p.name }}</p>
        <p class="text-sm text-coffe font-semibold">
          {{ formatRupiah(p.price) }}
        </p>

        <div class="flex gap-2 mt-4">
          <button
            @click="openForm(p)"
            class="flex-1 bg-[#3b2f2f] text-white py-1 rounded cursor-pointer hover:opacity-90 transition flex items-center justify-center gap-1"
          >
            <Pencil class="w-4 h-4" /> Edit
          </button>

          <button
            @click="deleteProduct(p)"
            class="flex-1 border border-red-400 text-red-500 py-1 rounded cursor-pointer hover:bg-red-50 transition flex items-center justify-center gap-1"
          >
            <Trash2 class="w-4 h-4" /> Hapus
          </button>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";

import { Plus, Pencil, Trash2 } from "lucide-vue-next";
import { supabase } from "../../lib/supabase";
import AdminLayout from "./AdminLayout.vue";

/* ================= CONFIG ================= */
const CATEGORY_CONFIG = {
  coffee: { table: "tbl_coffee", bucket: "coffee_images" },
  milkshake: { table: "tbl_milkshake", bucket: "milkshake_images" },
  snacks: { table: "tbl_snacks", bucket: "snacks_images" },
};

const categories = [
  { label: "Coffee", value: "coffee" },
  { label: "Milkshake", value: "milkshake" },
  { label: "Snacks", value: "snacks" },
];

/* ================= STATE ================= */
const selectedCategory = ref("coffee");
const products = ref([]);
const imageFile = ref(null);

const form = ref({
  id: null,
  name: "",
  price: 0,
  image_url: "",
});

/* ================= FETCH ================= */
async function fetchProducts() {
  const { table } = CATEGORY_CONFIG[selectedCategory.value];

  const { data } = await supabase
    .from(table)
    .select("*")
    .order("id", { ascending: false });

  products.value = data || [];
}

onMounted(fetchProducts);
watch(selectedCategory, fetchProducts);

/* ================= STORAGE ================= */
async function uploadImage() {
  if (!imageFile.value) return form.value.image_url;

  const { bucket } = CATEGORY_CONFIG[selectedCategory.value];
  const ext = imageFile.value.name.split(".").pop();

  // 👉 PAKAI NAMA ASLI FILE (BIAR MASUK AKAL)
  const fileName = imageFile.value.name.replace(/\s+/g, "-").toLowerCase();

  await supabase.storage.from(bucket).upload(fileName, imageFile.value, {
    upsert: true,
  });

  return fileName; // ⬅️ SIMPAN FILE NAME AJA
}
function getImageUrl(fileName) {
  if (!fileName) return "";

  const { bucket } = CATEGORY_CONFIG[selectedCategory.value];

  return `https://gvergloqhajtcunrbfxg.supabase.co/storage/v1/object/public/${bucket}/${fileName}`;
}

/* ================= FORM SWEETALERT ================= */
async function openForm(p = null) {
  imageFile.value = null;
  form.value = p ? { ...p } : { id: null, name: "", price: 0, image_url: "" };

  const { value } = await Swal.fire({
    title: p ? "Edit Produk" : "Tambah Produk",
    html: `
      <input id="name" class="swal2-input" placeholder="Nama Produk" value="${form.value.name}">
      <input id="price" type="number" class="swal2-input" placeholder="Harga" value="${form.value.price}">
      <input id="image" type="file" class="swal2-file">
    `,
    confirmButtonText: "Simpan",
    showCancelButton: true,
    cancelButtonText: "Batal",
    focusConfirm: false,
    preConfirm: () => {
      imageFile.value = document.getElementById("image").files[0];
      return {
        name: document.getElementById("name").value,
        price: document.getElementById("price").value,
      };
    },
  });

  if (!value) return;

  form.value.name = value.name;
  form.value.price = value.price;

  saveProduct();
}

/* ================= SAVE ================= */
async function saveProduct() {
  const { table } = CATEGORY_CONFIG[selectedCategory.value];
  const imageUrl = await uploadImage();

  if (form.value.id) {
    await supabase
      .from(table)
      .update({
        name: form.value.name,
        price: form.value.price,
        image_url: imageUrl,
      })
      .eq("id", form.value.id);
  } else {
    await supabase.from(table).insert({
      name: form.value.name,
      price: form.value.price,
      image_url: imageUrl,
    });
  }

  fetchProducts();

  Swal.fire({
    icon: "success",
    title: "Berhasil",
    timer: 1200,
    showConfirmButton: false,
  });
}

/* ================= DELETE ================= */
async function deleteProduct(product) {
  const confirm = await Swal.fire({
    title: "Hapus produk?",
    text: product.name,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Hapus",
    cancelButtonText: "Batal",
  });

  if (!confirm.isConfirmed) return;

  const { table, bucket } = CATEGORY_CONFIG[selectedCategory.value];

  await supabase.storage.from(bucket).remove([product.image_url]);
  await supabase.from(table).delete().eq("id", product.id);

  fetchProducts();

  Swal.fire({
    icon: "success",
    title: "Produk dihapus",
    timer: 1200,
    showConfirmButton: false,
  });
}

/* ================= UTIL ================= */
function formatRupiah(val) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(val);
}
</script>

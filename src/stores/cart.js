import { defineStore } from "pinia";
import { supabase } from "../lib/supabase";

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: [],
    loading: false,
  }),

  actions: {
    // 🔹 Ambil user login
    async getUser() {
      const { data } = await supabase.auth.getUser();
      return data.user;
    },

    // 🔹 Fetch cart user
    async fetchCart() {
      this.loading = true;

      const user = await this.getUser();
      if (!user) return (this.loading = false);

      const { data, error } = await supabase
        .from("tbl_cart")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error) {
        this.items = data;
      }

      this.loading = false;
    },

    // 🔹 Add to cart
    async addToCart(product, type) {
      const { data: auth } = await supabase.auth.getUser();
      const user = auth.user;

      if (!user) {
        return Swal.fire("Login dulu 😹", "Biar bisa beli", "warning");
      }

      const { data: existing } = await supabase
        .from("tbl_cart")
        .select("*")
        .eq("user_id", user.id)
        .eq("product_id", product.id)
        .eq("product_type", type)
        .maybeSingle();

      if (existing) {
        await supabase
          .from("tbl_cart")
          .update({ quantity: existing.quantity + 1 })
          .eq("id", existing.id);
      } else {
        await supabase.from("tbl_cart").insert({
          user_id: user.id,
          product_id: product.id,
          product_type: type,
          name: product.name,
          price: product.price,
          image_url: product.image_full_url,
          quantity: 1,
        });
      }

      this.fetchCart();
    },

    // ============================
    // ➕ INCREASE QTY
    // ============================
    async increaseQty(id) {
      const item = this.items.find((i) => i.id === id);
      if (!item) return;

      await supabase
        .from("tbl_cart")
        .update({ quantity: item.quantity + 1 })
        .eq("id", id);

      item.quantity++; // update lokal (biar responsif)
    },

    // ============================
    // ➖ DECREASE QTY
    // ============================
    async decreaseQty(id) {
      const item = this.items.find((i) => i.id === id);
      if (!item) return;

      if (item.quantity <= 1) {
        await supabase.from("tbl_cart").delete().eq("id", id);
        this.items = this.items.filter((i) => i.id !== id);
        return;
      }

      await supabase
        .from("tbl_cart")
        .update({ quantity: item.quantity - 1 })
        .eq("id", id);

      item.quantity--;
    },

    // 🔹 Remove item
    async removeItem(id) {
      await supabase.from("tbl_cart").delete().eq("id", id);
      this.items = this.items.filter((item) => item.id !== id);
    },

    // 🔹 Clear cart
    async clearCart() {
      const user = await this.getUser();
      if (!user) return;

      await supabase.from("tbl_cart").delete().eq("user_id", user.id);
      this.items = [];
    },
  },

  getters: {
    totalQty: (state) =>
      state.items.reduce((sum, item) => sum + item.quantity, 0),

    totalPrice: (state) =>
      state.items.reduce((sum, item) => sum + item.quantity * item.price, 0),
  },
});

import { defineStore } from "pinia";
import axios from "axios";

export const useSalesStore = defineStore("sales", {
  state: () => ({
    list: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchSales() {
      this.loading = true;
      try {
        const res = await axios.get("/api/v1/sales/list");
        this.list = res.data.items || [];
      } catch (err) {
        this.error = err.response?.data?.message || "Gagal ambil sales list";
      } finally {
        this.loading = false;
      }
    },
  },
});

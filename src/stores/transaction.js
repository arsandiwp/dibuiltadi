import { defineStore } from "pinia";
import axios from "axios";

export const useTransactionStore = defineStore("transaction", {
  state: () => ({
    transactions: [],
    transaction: null,
    page: 1,
    perPage: 10,
    totalItems: 0,
    search: "",
    sortBy: "created_at",
    sortDirection: "desc",
    startDate: "2023-01-01",
    endDate: "2026-12-30",
    customerCode: null,
    salesCode: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchTransactions() {
      this.loading = true;
      this.error = null;
      try {
        const res = await axios.get("/api/v1/transactions", {
          params: {
            page: this.page,
            perPage: this.perPage,
            search: this.search,
            sortBy: this.sortBy,
            sortDirection: this.sortDirection,
            startDate: this.startDate,
            endDate: this.endDate,
            customerCode: this.customerCode,
            salesCode: this.salesCode,
          },
        });
        this.transactions = res.data.items;
        this.totalItems = res.data.total;
      } catch (err) {
        this.error = err.response?.data?.message || "Gagal mengambil data";
      } finally {
        this.loading = false;
      }
    },

    async fetchTransaction(no) {
      this.loading = true;
      this.error = null;
      try {
        const res = await axios.get(`/api/v1/transactions/${no}`);
        this.transaction = res.data;
        return res.data;
      } catch (err) {
        this.error = err.response?.data?.message || "Gagal ambil detail";
        throw err;
      } finally {
        this.loading = false;
      }
    },
  },
});

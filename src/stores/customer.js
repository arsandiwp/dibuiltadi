import { defineStore } from "pinia";
import axios from "axios";

export const useCustomerStore = defineStore("customer", {
  state: () => ({
    customers: [],
    customer: null,
    page: 1,
    perPage: 10,
    totalItems: 0,
    search: "",
    sortBy: "created_at",
    sortDirection: "desc",
    startDate: "2023-01-01",
    endDate: "2026-12-30",
    loading: false,
    error: null,
  }),
  actions: {
    async fetchCustomers() {
      this.loading = true;
      this.error = null;
      try {
        const res = await axios.get("/api/v1/customers", {
          params: {
            page: this.page,
            perPage: this.perPage,
            search: this.search,
            sortBy: this.sortBy,
            sortDirection: this.sortDirection,
            startDate: this.startDate,
            endDate: this.endDate,
          },
        });
        this.customers = res.data.items;
        this.totalItems = res.data.total;
      } catch (err) {
        this.error = err.response?.data?.message || "Gagal mengambil data";
      } finally {
        this.loading = false;
      }
    },

    async fetchCustomer(code) {
      this.loading = true;
      this.error = null;
      try {
        const res = await axios.get(`/api/v1/customers/${code}`);
        this.customer = res.data;
        return res.data;
      } catch (err) {
        this.error = err.response?.data?.message || "Gagal ambil detail";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async createCustomer(payload) {
      this.loading = true;
      this.error = null;
      try {
        const res = await axios.post("/api/v1/customers", payload);
        return res.data;
      } catch (err) {
        this.error = err.response?.data?.message || "Gagal membuat customer";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async updateCustomer(code, payload) {
      this.loading = true;
      this.error = null;
      try {
        const res = await axios.put(`/api/v1/customers/${code}`, payload);
        return res.data;
      } catch (err) {
        this.error = err.response?.data?.message || "Gagal update customer";
        throw err;
      } finally {
        this.loading = false;
      }
    },
  },
});

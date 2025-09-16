import { defineStore } from "pinia";
import axios from "axios";

export const useSummaryStore = defineStore("summary", {
  state: () => ({
    daily: [],
    monthly: [],
    yearly: [],
    customers: [],
    salesCodes: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchDaily(params) {
      this.loading = true;
      try {
        const res = await axios.get("/api/v1/summaries/daily-transactions", {
          params,
        });
        this.daily = res.data.items || [];
      } catch (err) {
        this.error =
          err.response?.data?.message || "Gagal ambil transaksi harian";
      } finally {
        this.loading = false;
      }
    },

    async fetchMonthly(params) {
      this.loading = true;
      try {
        const res = await axios.get("/api/v1/summaries/monthly-transactions", {
          params,
        });
        this.monthly = res.data.items || [];
      } catch (err) {
        this.error =
          err.response?.data?.message || "Gagal ambil transaksi bulanan";
      } finally {
        this.loading = false;
      }
    },

    async fetchYearly(params) {
      this.loading = true;
      try {
        const res = await axios.get("/api/v1/summaries/yearly-transactions", {
          params,
        });
        this.yearly = res.data || [];
      } catch (err) {
        this.error =
          err.response?.data?.message || "Gagal ambil transaksi tahunan";
      } finally {
        this.loading = false;
      }
    },

    async fetchTopCustomers(params) {
      this.loading = true;
      try {
        const res = await axios.get("/api/v1/summaries/top-customers", {
          params,
        });
        this.customers = res.data.items || [];
      } catch (err) {
        this.error =
          err.response?.data?.message || "Gagal ambil top customer";
      } finally {
        this.loading = false;
      }
    },
  },
});

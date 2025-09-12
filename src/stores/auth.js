import { defineStore } from "pinia";
import axios from "axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
  }),
  actions: {
    async register(payload) {
      this.loading = true;
      this.error = null;
      try {
        const res = await axios.post("/api/v1/auth/register", payload);
        // register tidak langsung login → redirect ke login
        return res.data;
      } catch (err) {
        this.error = err.response?.data?.message || "Register gagal";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async login(payload) {
      this.loading = true;
      this.error = null;
      try {
        const res = await axios.post("/api/v1/auth/login", payload);
        this.token = res.data.token;
        this.user = res.data.user || null;

        localStorage.setItem("token", this.token);
        return res.data;
      } catch (err) {
        this.error = err.response?.data?.message || "Login gagal";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      try {
        await axios.post(
          "/api/v1/auth/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          }
        );
      } catch (err) {
        console.error("Logout gagal", err);
      } finally {
        this.user = null;
        this.token = null;
        localStorage.removeItem("token");
      }
    },
  },
});

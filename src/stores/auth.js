import { defineStore } from "pinia";
import axios from "axios";
import router from "../router";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: JSON.parse(localStorage.getItem("user")) || null,
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

        this.token = res.data.accessToken;
        this.user = {
          code: res.data.code,
          name: res.data.name,
          phone: res.data.phone,
          email: res.data.email,
          profileImage: res.data.profileImage,
          roleCode: res.data.roleCode,
          roleName: res.data.roleName,
        };

        localStorage.setItem("token", this.token);
        localStorage.setItem("user", JSON.stringify(this.user));

        return res.data;
      } catch (err) {
        this.error = err.response?.data?.responseMessage || "Login gagal";
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
          { headers: { Authorization: `Bearer ${this.token}` } }
        );
      } catch (err) {
        console.error("Logout gagal", err);
      } finally {
        localStorage.clear();
        this.token = null;
        this.user = null;
        
        router.push("/login");
      }
    },

    async fetchProfile() {
      this.loading = true;
      this.error = null;
      try {
        const res = await axios.get("/api/v1/auth/profile", {
          headers: { Authorization: `Bearer ${this.token}` },
        });
        this.user = res.data;
        localStorage.setItem("user", JSON.stringify(this.user));
        return res.data;
      } catch (err) {
        this.error =
          err.response?.data?.responseMessage || "Gagal ambil profile";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async updatePassword(payload) {
      this.loading = true;
      this.error = null;
      try {
        const res = await axios.put("/api/v1/auth/password", payload, {
          headers: { Authorization: `Bearer ${this.token}` },
        });
        return res.data;
      } catch (err) {
        this.error =
          err.response?.data?.responseMessage || "Gagal update password";
        throw err;
      } finally {
        this.loading = false;
      }
    },
  },
});

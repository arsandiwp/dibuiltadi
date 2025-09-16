<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth";
import { useUiStore } from "../../stores/ui";
import BaseDialog from "../../components/BaseDialog.vue";

const name = ref("");
const email = ref("");
const phone = ref("");
const address = ref("");
const password = ref("");
const errors = reactive({});

const router = useRouter();
const auth = useAuthStore();
const ui = useUiStore();

const validate = () => {
  errors.name = !name.value ? "Nama required" : "";
  errors.phone = !phone.value ? "Nomor telepon required" : "";
  errors.email = !email.value
    ? "Email required"
    : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)
    ? "Format email no valid"
    : "";
  errors.address = !address.value ? "Alamat required" : "";
  errors.password =
    !password.value || password.value.length < 8
      ? "Password min 8 caracters"
      : "";

  return !Object.values(errors).some((e) => e);
};

const register = async () => {
  if (!validate()) return;

  try {
    const res = await auth.register({
      name: name.value,
      email: email.value,
      phone: phone.value,
      address: address.value,
      password: password.value,
    });
    // ui.openDialog("success", res.responseMessage || "Registrasi berhasil!");
    router.push("/login");
  } catch (err) {
    const backendErrors = err.response?.data?.errors || {};
    let msg = err.response?.data?.responseMessage || "Registrasi gagal";

    if (Object.keys(backendErrors).length > 0) {
      msg = Object.values(backendErrors).join(", ");
    }

    ui.openDialog("error", msg);
  }
};
</script>

<template>
  <div>
    <div class="text-center mb-6">
      <h1 class="text-3xl font-bold text-gray-800">Create Account</h1>
      <p class="text-gray-500">Register to get started</p>
    </div>

    <form @submit.prevent="register" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1"
          >Full Name</label
        >
        <input
          v-model="name"
          type="text"
          placeholder="Enter your name"
          class="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-primary outline-none"
          autocomplete="name"
        />
        <p v-if="errors.name" class="text-red-500 text-sm mt-1">
          {{ errors.name }}
        </p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1"
          >Phone</label
        >
        <input
          v-model="phone"
          type="text"
          placeholder="Enter your phone number"
          class="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-primary outline-none"
          autocomplete="tel"
        />
        <p v-if="errors.phone" class="text-red-500 text-sm mt-1">
          {{ errors.phone }}
        </p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1"
          >Email</label
        >
        <input
          v-model="email"
          type="email"
          placeholder="Enter your email"
          class="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-primary outline-none"
          autocomplete="email"
        />
        <p v-if="errors.email" class="text-red-500 text-sm mt-1">
          {{ errors.email }}
        </p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1"
          >Address</label
        >
        <input
          v-model="address"
          type="text"
          placeholder="Enter your address"
          class="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-primary outline-none"
          autocomplete="address"
        />
        <p v-if="errors.address" class="text-red-500 text-sm mt-1">
          {{ errors.address }}
        </p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1"
          >Password</label
        >
        <input
          v-model="password"
          type="password"
          placeholder="Enter your password"
          class="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-primary outline-none"
          autocomplete="password"
        />
        <p v-if="errors.password" class="text-red-500 text-sm mt-1">
          {{ errors.password }}
        </p>
      </div>

      <button
        type="submit"
        class="w-full bg-primary text-white py-2 rounded-xl hover:bg-primary-dark transition"
        :disabled="auth.loading"
      >
        {{ auth.loading ? "Loading..." : "Register" }}
      </button>
    </form>

    <p class="mt-6 text-center text-sm text-gray-600">
      Sudah punya akun?
      <router-link to="/login" class="text-primary hover:underline"
        >Login</router-link
      >
    </p>

    <BaseDialog />
  </div>
</template>

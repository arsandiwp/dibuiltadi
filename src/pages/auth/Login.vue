<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth";
import { useUiStore } from "../../stores/ui";
import BaseDialog from "../../components/BaseDialog.vue";

const phone = ref("");
const password = ref("");
const errors = reactive({});

const router = useRouter();
const auth = useAuthStore();
const ui = useUiStore();

const validate = () => {
  errors.phone = !phone.value ? "Phone required" : "";
  errors.password = !password.value
    ? "Password required"
    : password.value.length < 8
    ? "Password min 8 caracters"
    : "";

  return !Object.values(errors).some((e) => e);
};

const login = async () => {
  if (!validate()) return;

  try {
    const res = await auth.login({
      phone: phone.value,
      password: password.value,
    });

    router.push("/dashboard");
  } catch (err) {
    const backendErrors = err.response?.data?.errors || {};
    let msg = err.response?.data?.responseMessage || "Login gagal";

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
      <h1 class="text-3xl font-bold text-gray-800">Welcome Back!</h1>
      <p class="text-gray-500">Login to continue</p>
    </div>

    <form @submit.prevent="login" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Phone
        </label>
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
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
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
        {{ auth.loading ? "Loading..." : "Sign In" }}
      </button>
    </form>

    <p class="mt-6 text-center text-sm text-gray-600">
      Belum punya akun?
      <router-link to="/register" class="text-primary hover:underline">
        Daftar
      </router-link>
    </p>
    
    <BaseDialog />
  </div>
</template>

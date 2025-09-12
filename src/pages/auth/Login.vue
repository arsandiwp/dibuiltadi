<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth";

const phone = ref("");
const password = ref("");
const router = useRouter();
const auth = useAuthStore();

const login = async () => {
  try {
    await auth.login({
      phone: phone.value,
      password: password.value,
    });
    router.push("/dashboard");
  } catch (err) {
    alert(auth.error);
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
        <label class="block text-sm font-medium text-gray-700 mb-1"
          >Phone</label
        >
        <input
          v-model="phone"
          type="text"
          placeholder="Enter your phone number"
          class="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1"
          >Password</label
        >
        <input
          v-model="password"
          type="password"
          placeholder="Enter your password"
          class="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <!-- Remember Me + Forgot Password -->
      <div class="flex items-center justify-end text-sm">
        <!-- <label class="flex items-center space-x-2">
          <input type="checkbox" class="rounded border-gray-300" />
          <span>Remember Me</span>
        </label> -->
        <a href="#" class="text-blue-500 hover:underline">Forgot Password?</a>
      </div>

      <button
        type="submit"
        class="w-full bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 transition"
        :disabled="auth.loading"
      >
        {{ auth.loading ? "Loading..." : "Sign In" }}
      </button>
    </form>

    <p class="mt-6 text-center text-sm text-gray-600">
      Belum punya akun?
      <router-link to="/register" class="text-blue-500 hover:underline"
        >Daftar</router-link
      >
    </p>
  </div>
</template>

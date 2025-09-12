<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth";

const name = ref("");
const email = ref("");
const phone = ref("");
const address = ref("");
const password = ref("");
const router = useRouter();
const auth = useAuthStore();

const register = async () => {
  try {
    await auth.register({
      name: name.value,
      email: email.value,
      phone: phone.value,
      address: address.value,
      password: password.value,
    });
    alert("Registrasi berhasil, silakan login!");
    router.push("/login");
  } catch (err) {
    alert(auth.error);
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
          class="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1"
          >Phone</label
        >
        <input
          v-model="phone"
          type="text"
          placeholder="Enter your phone number"
          class="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1"
          >Email</label
        >
        <input
          v-model="email"
          type="email"
          placeholder="Enter your email"
          class="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1"
          >Address</label
        >
        <input
          v-model="address"
          type="text"
          placeholder="Enter your address"
          class="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
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
          class="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
        />
      </div>

      <button
        type="submit"
        class="w-full bg-green-500 text-white py-2 rounded-xl hover:bg-green-600 transition"
        :disabled="auth.loading"
      >
        {{ auth.loading ? "Loading..." : "Register" }}
      </button>
    </form>

    <p class="mt-6 text-center text-sm text-gray-600">
      Sudah punya akun?
      <router-link to="/login" class="text-green-500 hover:underline"
        >Login</router-link
      >
    </p>
  </div>
</template>

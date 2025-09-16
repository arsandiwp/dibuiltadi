<template>
  <div class="flex h-screen bg-gray-50">
    <aside class="w-64 bg-white shadow-md flex flex-col">
      <!-- ini entar image aja -->
      <!-- <div class="p-6 flex items-center border-b">
        <span class="text-lg font-bold">MyApp</span>
      </div> -->

      <nav class="flex-1 p-4 space-y-2">
        <router-link
          to="/dashboard"
          class="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100"
          active-class="bg-primary-light text-primary font-medium"
        >
          <i class="fas fa-home w-5"></i>
          Dashboard
        </router-link>

        <router-link
          to="/customers"
          class="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100"
          active-class="bg-primary-light text-primary font-medium"
        >
          <i class="fas fa-users w-5"></i>
          Customers
        </router-link>

        <router-link
          to="/transactions"
          class="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100"
          active-class="bg-primary-light text-primary font-medium"
        >
          <i class="fas fa-file-invoice w-5"></i>
          Transactions
        </router-link>
      </nav>
    </aside>

    <div class="flex-1 flex flex-col">
      <main class="flex-1 overflow-y-auto p-6 space-y-6">
        <div
          class="bg-white shadow px-6 py-3 flex justify-between items-center"
        >
          <h1 class="text-xl font-semibold">{{ title }}</h1>

          <div class="flex items-center gap-3 relative" ref="dropdownRef">
            <img
              :src="
                auth.user?.profileImage ||
                'https://ui-avatars.com/api/?name=' + (auth.user?.name || 'U')
              "
              alt="Avatar"
              class="w-10 h-10 rounded-full cursor-pointer border object-cover"
              @click="toggleDropdown"
            />
            <span class="font-medium text-gray-700">{{
              auth.user?.name || "User"
            }}</span>

            <div
              v-if="dropdownOpen"
              class="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg z-50"
            >
              <button
                @click="goToProfile"
                class="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                My Profile
              </button>
              <button
                @click="goToUpdatePassword"
                class="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Update Password
              </button>
              <button
                @click="handleLogout"
                class="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        <div class="bg-white shadow rounded-lg p-6">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const dropdownOpen = ref(false);
const dropdownRef = ref(null);

const title = computed(() => route.name || "Dashboard");

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

const handleClickOutside = (e) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    dropdownOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});
onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

const goToProfile = () => {
  dropdownOpen.value = false;
  router.push("/profile");
};

const goToUpdatePassword = () => {
  dropdownOpen.value = false;
  router.push("/update-password");
};

const handleLogout = () => {
  dropdownOpen.value = false;
  auth.logout();
  router.push("/login");
};
</script>

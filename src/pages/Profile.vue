<template>
  <div class="relative">
    <div v-if="loading" class="flex justify-center py-10">
      <div class="animate-pulse text-gray-500">Loading profile...</div>
    </div>

    <BaseDetailForm
      v-else-if="profile"
      :fields="fields"
      :data="profile"
      mode="detail"
    >
      <template #extra>
        <div class="flex justify-center mb-6">
          <img
            :src="profile?.profileImage || 'https://via.placeholder.com/100'"
            class="w-24 h-24 rounded-full border shadow"
          />
        </div>
      </template>
    </BaseDetailForm>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useAuthStore } from "../stores/auth";
import BaseDetailForm from "../components/BaseDetailForm.vue";

const auth = useAuthStore();
const profile = ref(null);
const loading = ref(false);

const fields = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "roleName", label: "Role" },
];

onMounted(async () => {
  loading.value = true;
  try {
    const res = await axios.get("/api/v1/auth/profile", {
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    profile.value = res.data;
  } catch (err) {
    console.error("Gagal fetch profile", err);
  } finally {
    loading.value = false;
  }
});
</script>

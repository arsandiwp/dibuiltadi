<template>
  <div class="relative">
    <BaseDetailForm
      v-if="!loading && localData"
      :fields="fields"
      :data="localData"
      :mode="mode"
      @save="handleSave"
      @cancel="handleCancel"
    />

    <div
      v-if="loading"
      class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
    >
      <div
        class="bg-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3"
      >
        <svg
          class="animate-spin h-6 w-6 text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          ></path>
        </svg>
        <span class="text-gray-700 font-medium">Loading data...</span>
      </div>
    </div>
  </div>

  <BaseDialog />
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { useCustomerStore } from "../../stores/customer";
import { useUiStore } from "../../stores/ui";
import BaseDetailForm from "../../components/BaseDetailForm.vue";

const route = useRoute();
const router = useRouter();
const store = useCustomerStore();
const ui = useUiStore();

const mode = ref("detail");
const localData = ref({});
const loading = ref(false);

const fields = ref([
  { key: "name", label: "Nama Customer" },
  { key: "identityNo", label: "Nomor Identitas" },
  { key: "npwp", label: "NPWP" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Telepon" },
  { key: "mobile_phone", label: "Nomor HP" },
  { key: "provinceCode", label: "Provinsi", type: "select", options: [] },
  { key: "cityCode", label: "Kota", type: "select", options: [] },
  { key: "address", label: "Alamat" },
  {
    key: "companyType",
    label: "Jenis Perusahaan",
    type: "select",
    options: [
      { label: "Person", value: "person" },
      { label: "Company", value: "company" },
    ],
  },
]);

async function fetchProvinces() {
  try {
    const res = await axios.get("/api/v1/provinces/list");
    const provOptions = (res.data.items || []).map((p) => ({
      label: p.name,
      value: p.code,
    }));
    const provField = fields.value.find((f) => f.key === "provinceCode");
    if (provField) provField.options = provOptions;
  } catch (err) {
    console.error("Gagal ambil provinsi", err);
  }
}

async function fetchCities() {
  try {
    const res = await axios.get("/api/v1/cities/list");
    const cityOptions = (res.data.items || []).map((c) => ({
      label: c.name,
      value: c.code,
    }));
    const cityField = fields.value.find((f) => f.key === "cityCode");
    if (cityField) cityField.options = cityOptions;
  } catch (err) {
    console.error("Gagal ambil kota", err);
  }
}

onMounted(async () => {
  loading.value = true;
  await Promise.all([fetchProvinces(), fetchCities()]);

  if (route.params.code) {
    mode.value = route.path.endsWith("/edit") ? "edit" : "detail";
    await store.fetchCustomer(route.params.code);
    localData.value = {
      ...store.customer,
      provinceCode: store.customer.province?.code || null,
      cityCode: store.customer.city?.code || null,
      mobile_phone: store.customer.mobilePhone || null,
    };
  } else {
    mode.value = "create";
    localData.value = {};
  }

  loading.value = false;
});

watch(
  () => store.customer,
  (val) => {
    if (mode.value === "edit") {
      localData.value = { ...val };
    }
  },
  { deep: true }
);

async function handleSave(data) {
  try {
    if (mode.value === "create") {
      const res = await store.createCustomer(data);
      // ui.openDialog(
      //   "success",
      //   res.responseMessage || "Customer berhasil dibuat!"
      // );
      router.push("/customers");
    } else if (mode.value === "edit") {
      const res = await store.updateCustomer(route.params.code, data);
      // ui.openDialog(
      //   "success",
      //   res.responseMessage || "Customer berhasil diupdate!"
      // );
      router.push("/customers");
    }
  } catch (err) {
    const backendErrors = err.response?.data?.errors || {};
    let msg = err.response?.data?.responseMessage || "Gagal update password";

    if (Object.keys(backendErrors).length > 0) {
      msg = Object.values(backendErrors).join(", ");
    }

    ui.openDialog("error", msg);
  }
}

function handleCancel() {
  router.push("/customers");
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Customer Management</h1>
          <p class="text-gray-600 mt-1">
            Manage and monitor your registered customers
          </p>
        </div>
        <div
          class="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm border"
        >
          <div class="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <span class="text-sm font-medium text-gray-700"
            >{{ store.totalItems }} Total Customers</span
          >
        </div>
      </div>
    </div>

    <div
      class="bg-white shadow-xl rounded-2xl border border-gray-200 p-6 mb-8 overflow-hidden"
    >
      <div class="flex items-center space-x-3 mb-6">
        <div class="bg-gradient-to-r from-blue-500 to-blue-600 p-2 rounded-lg">
          <svg
            class="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <div>
          <h2 class="text-xl font-bold text-gray-900">Advanced Filters</h2>
          <p class="text-sm text-gray-600">
            Filter customers by registration date
          </p>
        </div>
      </div>

      <div
        class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-end"
      >
        <div class="space-y-2">
          <label class="block text-sm font-semibold text-gray-700">
            <svg
              class="w-4 h-4 inline-block mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              ></path>
            </svg>
            Start Date
          </label>
          <input
            type="date"
            v-model="store.startDate"
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:shadow-md"
          />
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-semibold text-gray-700">
            <svg
              class="w-4 h-4 inline-block mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              ></path>
            </svg>
            End Date
          </label>
          <input
            type="date"
            v-model="store.endDate"
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:shadow-md"
          />
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-semibold text-gray-700 opacity-0">
            Action
          </label>
          <button
            @click="store.fetchCustomers"
            :disabled="store.loading"
            class="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 focus:ring-4 focus:ring-blue-200 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            <svg
              v-if="store.loading"
              class="animate-spin w-5 h-5 inline-block mr-2"
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
            <svg
              v-else
              class="w-5 h-5 inline-block mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
            {{ store.loading ? "Filtering..." : "Apply Filters" }}
          </button>
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-semibold text-gray-700 opacity-0">
            Add
          </label>
          <router-link
            to="/customers/add"
            class="block w-full text-center bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 focus:ring-4 focus:ring-green-200 transition-all transform hover:scale-105 active:scale-95 shadow-lg"
          >
            + Add Customer
          </router-link>
        </div>
      </div>
    </div>

    <div
      v-if="store.loading"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm"
    >
      <div
        class="bg-white px-8 py-6 rounded-2xl shadow-2xl border border-gray-200 max-w-sm mx-4"
      >
        <div class="flex items-center space-x-4">
          <div class="relative">
            <div
              class="w-8 h-8 border-4 border-blue-200 rounded-full animate-spin"
            ></div>
            <div
              class="w-8 h-8 border-4 border-blue-600 rounded-full animate-spin absolute top-0 left-0"
              style="
                border-right-color: transparent;
                border-top-color: transparent;
              "
            ></div>
          </div>
          <div>
            <p class="text-gray-800 font-semibold">Loading Customers</p>
            <p class="text-gray-500 text-sm">
              Please wait while we fetch your data...
            </p>
          </div>
        </div>
      </div>
    </div>

    <BaseTable
      v-else
      :headers="headers"
      :items="store.customers"
      :page="store.page"
      :perPage="store.perPage"
      :totalItems="store.totalItems"
      has-actions
      enable-search
      :sortByProp="store.sortBy"
      :sortDirectionProp="store.sortDirection"
      @update:page="
        store.page = $event;
        store.fetchCustomers();
      "
      @update:perPage="
        store.perPage = $event;
        store.fetchCustomers();
      "
      @update:search="
        store.search = $event;
        store.fetchCustomers();
      "
      @update:sortBy="
        store.sortBy = $event;
        store.fetchCustomers();
      "
      @update:sortDirection="
        store.sortDirection = $event;
        store.fetchCustomers();
      "
    >
      <template #actions="{ item }">
        <router-link
          :to="`/customers/${item.code}`"
          class="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 focus:ring-2 focus:ring-blue-200 transition-all transform hover:scale-105 active:scale-95 shadow-sm"
        >
          Detail
        </router-link>
        <router-link
          :to="`/customers/${item.code}/edit`"
          class="ml-2 inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-semibold rounded-lg hover:from-green-600 hover:to-green-700 focus:ring-2 focus:ring-green-200 transition-all transform hover:scale-105 active:scale-95 shadow-sm"
        >
          Edit
        </router-link>
      </template>
    </BaseTable>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useCustomerStore } from "../../stores/customer";
import BaseTable from "../../components/BaseTable.vue";

const store = useCustomerStore();

const headers = [
  { title: "Code", key: "code" },
  { title: "Nama", key: "name" },
  { title: "Area", key: "area" },
  { title: "Province", key: "province" },
  { title: "City", key: "city" },
];

onMounted(() => {
  store.fetchCustomers();
});
</script>

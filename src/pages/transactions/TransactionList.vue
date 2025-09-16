<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">
            Transaction Management
          </h1>
          <p class="text-gray-600 mt-1">
            Monitor and manage your sales transactions
          </p>
        </div>
        <div
          class="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm border"
        >
          <div class="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <span class="text-sm font-medium text-gray-700"
            >{{ store.totalItems }} Total Records</span
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
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
            ></path>
          </svg>
        </div>
        <div>
          <h2 class="text-xl font-bold text-gray-900">Advanced Filters</h2>
          <p class="text-sm text-gray-600">
            Filter transactions by date range and sales person
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
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              ></path>
            </svg>
            Sales Person
          </label>
          <div class="relative">
            <select
              v-model="store.salesCode"
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:shadow-md appearance-none bg-white pr-10"
            >
              <option value="">All Sales Representatives</option>
              <option
                v-for="s in salesStore.list"
                :key="s.code"
                :value="s.code"
              >
                {{ s.name }}
              </option>
            </select>
            <div
              class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
            >
              <svg
                class="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-semibold text-gray-700 opacity-0"
            >Action</label
          >
          <button
            @click="store.fetchTransactions"
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
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
              ></path>
            </svg>
            {{ store.loading ? "Filtering..." : "Apply Filters" }}
          </button>
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
            <p class="text-gray-800 font-semibold">Loading Transactions</p>
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
      :items="store.transactions"
      :page="store.page"
      :perPage="store.perPage"
      :totalItems="store.totalItems"
      has-actions
      enable-search
      :sortByProp="store.sortBy"
      :sortDirectionProp="store.sortDirection"
      @update:page="
        store.page = $event;
        store.fetchTransactions();
      "
      @update:perPage="
        store.perPage = $event;
        store.fetchTransactions();
      "
      @update:search="
        store.search = $event;
        store.fetchTransactions();
      "
      @update:sortBy="
        store.sortBy = $event;
        store.fetchTransactions();
      "
      @update:sortDirection="
        store.sortDirection = $event;
        store.fetchTransactions();
      "
    >
      <template #actions="{ item }">
        <router-link
          :to="`/transactions/${item.referenceNo}`"
          class="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 focus:ring-2 focus:ring-blue-200 transition-all transform hover:scale-105 active:scale-95 shadow-sm"
        >
          <svg
            class="w-3 h-3 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            ></path>
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            ></path>
          </svg>
          View Details
        </router-link>
      </template>
    </BaseTable>
  </div>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useTransactionStore } from "../../stores/transaction";
import { useSalesStore } from "../../stores/sales";
import BaseTable from "../../components/BaseTable.vue";

const store = useTransactionStore();
const salesStore = useSalesStore();

const headers = [
  { title: "Reference No", key: "referenceNo" },
  { title: "Customer", key: "customer.name" },
  { title: "Sales", key: "sales" },
  { title: "Total Amount", key: "amountTotal" },
];

onMounted(() => {
  salesStore.fetchSales();
  store.fetchTransactions();
});
</script>

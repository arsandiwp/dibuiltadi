<template>
  <div
    class="bg-white shadow-xl rounded-2xl border border-gray-200 overflow-hidden"
  >
    <div
      v-if="enableSearch"
      class="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200"
    >
      <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div class="relative flex-1 max-w-md">
          <div
            class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
          >
            <svg
              class="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search..."
            class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
            @keyup.enter="doSearch"
          />
        </div>

        <button
          @click="doSearch"
          class="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 focus:ring-4 focus:ring-blue-200 transition-all transform hover:scale-105 active:scale-95 shadow-lg"
        >
          <svg
            class="w-4 h-4 inline-block mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
          Search
        </button>
      </div>
    </div>

    <div class="overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th
                v-for="header in headers"
                :key="header.key"
                class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors select-none group"
                @click="toggleSort(header)"
              >
                <div class="flex items-center space-x-2">
                  <span>{{ header.title }}</span>
                  <div class="flex flex-col">
                    <svg
                      :class="[
                        'w-3 h-3 transition-colors',
                        sortBy === header.key && sortDirection === 'asc'
                          ? 'text-blue-600'
                          : 'text-gray-400 group-hover:text-gray-600',
                      ]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        transform="rotate(180 10 10)"
                      />
                    </svg>
                    <svg
                      :class="[
                        'w-3 h-3 -mt-1 transition-colors',
                        sortBy === header.key && sortDirection === 'desc'
                          ? 'text-blue-600'
                          : 'text-gray-400 group-hover:text-gray-600',
                      ]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      />
                    </svg>
                  </div>
                </div>
              </th>
              <th
                v-if="hasActions"
                class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="(item, i) in items"
              :key="i"
              class="hover:bg-blue-50 transition-colors duration-200 group"
            >
              <td
                v-for="header in headers"
                :key="header.key"
                class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
              >
                <div class="font-medium">{{ getValue(item, header.key) }}</div>
              </td>
              <td
                v-if="hasActions"
                class="px-6 py-4 whitespace-nowrap text-sm font-medium"
              >
                <div class="flex items-center space-x-3">
                  <slot name="actions" :item="item"></slot>
                </div>
              </td>
            </tr>

            <tr v-if="!items.length">
              <td
                :colspan="headers.length + (hasActions ? 1 : 0)"
                class="px-6 py-12 text-center"
              >
                <div class="flex flex-col items-center justify-center">
                  <svg
                    class="w-12 h-12 text-gray-400 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1"
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    ></path>
                  </svg>
                  <h3 class="text-lg font-medium text-gray-900 mb-1">
                    No data found
                  </h3>
                  <p class="text-gray-500">
                    There are no transactions to display at the moment.
                  </p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div
      class="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-t border-gray-200"
    >
      <div class="flex flex-col lg:flex-row justify-between items-center gap-4">
        <div class="flex items-center space-x-2">
          <button
            :disabled="page === 1"
            @click="changePage(page - 1)"
            class="flex items-center space-x-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
            <span>Previous</span>
          </button>

          <div class="hidden sm:flex items-center space-x-1">
            <template v-for="pageNum in visiblePages" :key="pageNum">
              <button
                v-if="pageNum !== '...'"
                @click="changePage(pageNum)"
                :class="[
                  'px-3 py-2 text-sm font-medium rounded-lg transition-all',
                  pageNum === page
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500',
                ]"
              >
                {{ pageNum }}
              </button>
              <span v-else class="px-2 py-2 text-gray-500">...</span>
            </template>
          </div>

          <button
            :disabled="page === totalPages"
            @click="changePage(page + 1)"
            class="flex items-center space-x-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <span>Next</span>
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </button>
        </div>

        <div class="text-sm text-gray-600 text-center lg:text-left">
          Showing
          <span class="font-semibold text-gray-900">{{ startItem }}</span> to
          <span class="font-semibold text-gray-900">{{ endItem }}</span> of
          <span class="font-semibold text-gray-900">{{ totalItems }}</span>
          results
        </div>

        <div class="flex items-center space-x-2">
          <label class="text-sm text-gray-700 font-medium">Show:</label>
          <select
            v-model.number="localPerPage"
            @change="changePerPage"
            class="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          >
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
          <span class="text-sm text-gray-700">per page</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";

const props = defineProps({
  headers: { type: Array, required: true },
  items: { type: Array, required: true },
  page: { type: Number, required: true },
  perPage: { type: Number, required: true },
  totalItems: { type: Number, required: true },
  hasActions: { type: Boolean, default: false },
  enableSearch: { type: Boolean, default: true },
  sortByProp: { type: String, default: "createdAt" },
  sortDirectionProp: { type: String, default: "desc" },
});

const emit = defineEmits([
  "update:page",
  "update:perPage",
  "update:search",
  "update:sortBy",
  "update:sortDirection",
]);

const localPerPage = ref(props.perPage);
watch(
  () => props.perPage,
  (val) => (localPerPage.value = val)
);

const searchQuery = ref("");
const sortBy = ref(props.sortByProp);
const sortDirection = ref(props.sortDirectionProp);

const totalPages = computed(() =>
  Math.max(1, Math.ceil(props.totalItems / props.perPage))
);

const startItem = computed(() => (props.page - 1) * props.perPage + 1);
const endItem = computed(() =>
  Math.min(props.page * props.perPage, props.totalItems)
);

const visiblePages = computed(() => {
  const total = totalPages.value;
  const current = props.page;
  const pages = [];

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(total);
    } else if (current >= total - 3) {
      pages.push(1);
      pages.push("...");
      for (let i = total - 4; i <= total; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      pages.push("...");
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(total);
    }
  }

  return pages;
});

const changePage = (newPage) => emit("update:page", newPage);
const changePerPage = () => emit("update:perPage", localPerPage.value);
const doSearch = () => emit("update:search", searchQuery.value);

const toggleSort = (header) => {
  if (sortBy.value === header.key) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    sortBy.value = header.key;
    sortDirection.value = "asc";
  }
  emit("update:sortBy", sortBy.value);
  emit("update:sortDirection", sortDirection.value);
};

const getValue = (item, key) => {
  const val = key.split(".").reduce((o, k) => (o ? o[k] : null), item);

  if (["amountDue", "amountUntaxed", "amountTotal"].includes(key)) {
    return formatCurrency(val);
  }

  if (["dateOrder", "dateDue", "paidAt", "createdAt"].includes(key)) {
    return formatDate(val);
  }

  return val ?? "-";
};

const formatCurrency = (value) => {
  if (!value) return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

tr:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>

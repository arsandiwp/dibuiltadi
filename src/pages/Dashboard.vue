<script setup>
import { ref, computed, h, onMounted } from "vue";
import { useSummaryStore } from "../stores/summary";
import { useSalesStore } from "../stores/sales";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Bar } from "vue-chartjs";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const store = useSummaryStore();
const salesStore = useSalesStore();

const dailyParams = ref({
  startDate: "2025-09-01",
  endDate: "2025-09-15",
  salesCode: "",
});

const monthlyParams = ref({
  startMonth: "2025-01",
  endMonth: "2025-09",
  salesCode: "",
});

const yearlyParams = ref({
  year: 2025,
  salesCode: "",
});

const customerParams = ref({
  startDate: "2025-01-01",
  endDate: "2025-09-15",
  limit: 5,
});

const ChartWrapper = {
  name: "ChartWrapper",
  props: ["data", "options"],
  render() {
    return h(Bar, { data: this.data, options: this.options });
  },
};

const dailyChart = computed(() =>
  store.daily.length
    ? {
        labels: store.daily.map((d) => d.date),
        datasets: [
          {
            label: "Daily Transaction (Rp)",
            data: store.daily.map((d) => parseFloat(d.amount)),
            backgroundColor: "rgba(59, 130, 246, 0.8)",
            borderColor: "rgba(59, 130, 246, 1)",
            borderWidth: 1,
            borderRadius: 8,
            borderSkipped: false,
          },
        ],
      }
    : null
);

const monthlyChart = computed(() =>
  store.monthly.length
    ? {
        labels: store.monthly.map((m) => m.month),
        datasets: [
          {
            label: "Current Period (Rp)",
            data: store.monthly.map((m) => parseFloat(m.current)),
            backgroundColor: "rgba(34, 197, 94, 0.8)",
            borderColor: "rgba(34, 197, 94, 1)",
            borderWidth: 1,
            borderRadius: 8,
            borderSkipped: false,
          },
          {
            label: "Previous Period (Rp)",
            data: store.monthly.map((m) => parseFloat(m.previous)),
            backgroundColor: "rgba(248, 113, 113, 0.8)",
            borderColor: "rgba(248, 113, 113, 1)",
            borderWidth: 1,
            borderRadius: 8,
            borderSkipped: false,
          },
        ],
      }
    : null
);

const yearlyChart = computed(() =>
  store.yearly.current
    ? {
        labels: ["Current Year", "Previous Year"],
        datasets: [
          {
            label: "Yearly Comparison (Rp)",
            data: [
              parseFloat(store.yearly.current.amount),
              parseFloat(store.yearly.previous.amount),
            ],
            backgroundColor: [
              "rgba(59, 130, 246, 0.8)",
              "rgba(156, 163, 175, 0.8)",
            ],
            borderColor: ["rgba(59, 130, 246, 1)", "rgba(156, 163, 175, 1)"],
            borderWidth: 1,
            borderRadius: 8,
            borderSkipped: false,
          },
        ],
      }
    : null
);

const customersChart = computed(() =>
  store.customers.length
    ? {
        labels: store.customers.map((c) => c.customer.name),
        datasets: [
          {
            label: "Transaction Amount (Rp)",
            data: store.customers.map((c) => parseFloat(c.amount)),
            backgroundColor: "rgba(245, 158, 11, 0.8)",
            borderColor: "rgba(245, 158, 11, 1)",
            borderWidth: 1,
            borderRadius: 8,
            borderSkipped: false,
          },
        ],
      }
    : null
);

const getChartOptions = (isHorizontal = false) => ({
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: isHorizontal ? "y" : "x",
  plugins: {
    legend: {
      position: "top",
      labels: {
        usePointStyle: true,
        padding: 20,
        font: {
          size: 12,
          weight: "500",
        },
      },
    },
    tooltip: {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      titleColor: "white",
      bodyColor: "white",
      borderColor: "rgba(255, 255, 255, 0.1)",
      borderWidth: 1,
      cornerRadius: 8,
      displayColors: true,
      callbacks: {
        label: (context) => {
          return `${context.dataset.label}: Rp ${new Intl.NumberFormat(
            "id-ID"
          ).format(context.parsed.y || context.parsed.x)}`;
        },
      },
    },
  },
  scales: {
    [isHorizontal ? "x" : "y"]: {
      beginAtZero: true,
      grid: {
        color: "rgba(0, 0, 0, 0.1)",
        drawBorder: false,
      },
      ticks: {
        font: {
          size: 11,
        },
        callback: (val) => "Rp " + new Intl.NumberFormat("id-ID").format(val),
      },
    },
    [isHorizontal ? "y" : "x"]: {
      grid: {
        display: false,
      },
      ticks: {
        font: {
          size: 11,
        },
      },
    },
  },
});

const loadDaily = () => store.fetchDaily(dailyParams.value);
const loadMonthly = () => store.fetchMonthly(monthlyParams.value);
const loadYearly = () => store.fetchYearly(yearlyParams.value);
const loadCustomers = () => store.fetchTopCustomers(customerParams.value);

onMounted(() => {
  loadDaily();
  loadMonthly();
  loadYearly();
  loadCustomers();
  salesStore.fetchSales();
});
</script>

<template>
  <div class="min-h-screen">
    <div
      v-if="store.loading || salesStore.loading"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm"
    >
      <div
        class="bg-white px-8 py-6 rounded-xl shadow-2xl flex items-center space-x-4"
      >
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
          <p class="text-gray-800 font-semibold">Loading Dashboard</p>
          <p class="text-gray-500 text-sm">Please wait...</p>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto pb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">
            Sales Analytics Dashboard
          </h1>
          <p class="text-gray-600 mt-1">
            Monitor your sales performance and customer insights
          </p>
        </div>
        <div
          class="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-lg"
        >
          <div class="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <span class="text-sm font-medium text-gray-700">Live Data</span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
      <section
        class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
      >
        <div class="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
          <div class="flex items-center space-x-3">
            <div class="bg-white bg-opacity-20 p-2 rounded-lg">
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                ></path>
              </svg>
            </div>
            <h2 class="text-xl font-bold text-white">Daily Transactions</h2>
          </div>
        </div>

        <div class="p-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Start Date</label
              >
              <input
                type="date"
                v-model="dailyParams.startDate"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >End Date</label
              >
              <input
                type="date"
                v-model="dailyParams.endDate"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Sales Person</label
              >
              <select
                v-model="dailyParams.salesCode"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="">All Sales</option>
                <option
                  v-for="s in salesStore.list"
                  :key="s.code"
                  :value="s.code"
                >
                  {{ s.name }}
                </option>
              </select>
            </div>
          </div>

          <button
            @click="loadDaily"
            class="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 focus:ring-4 focus:ring-blue-200 transition-all transform hover:scale-105 active:scale-95"
          >
            Apply Filter
          </button>

          <div class="mt-6 h-80">
            <div
              v-if="!dailyChart"
              class="h-full bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded-lg"
            ></div>
            <ChartWrapper
              v-else
              :data="dailyChart"
              :options="getChartOptions()"
            />
          </div>
        </div>
      </section>

      <section
        class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
      >
        <div class="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
          <div class="flex items-center space-x-3">
            <div class="bg-white bg-opacity-20 p-2 rounded-lg">
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
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                ></path>
              </svg>
            </div>
            <h2 class="text-xl font-bold text-white">Monthly Transactions</h2>
          </div>
        </div>

        <div class="p-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Start Month</label
              >
              <input
                type="month"
                v-model="monthlyParams.startMonth"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >End Month</label
              >
              <input
                type="month"
                v-model="monthlyParams.endMonth"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
              />
            </div>
            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Sales Person</label
              >
              <select
                v-model="monthlyParams.salesCode"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
              >
                <option value="">All Sales</option>
                <option
                  v-for="s in salesStore.list"
                  :key="s.code"
                  :value="s.code"
                >
                  {{ s.name }}
                </option>
              </select>
            </div>
          </div>

          <button
            @click="loadMonthly"
            class="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 focus:ring-4 focus:ring-green-200 transition-all transform hover:scale-105 active:scale-95"
          >
            Apply Filter
          </button>

          <div class="mt-6 h-80">
            <div
              v-if="!monthlyChart"
              class="h-full bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded-lg"
            ></div>
            <ChartWrapper
              v-else
              :data="monthlyChart"
              :options="getChartOptions()"
            />
          </div>
        </div>
      </section>

      <section
        class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
      >
        <div class="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
          <div class="flex items-center space-x-3">
            <div class="bg-white bg-opacity-20 p-2 rounded-lg">
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
                  d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                ></path>
              </svg>
            </div>
            <h2 class="text-xl font-bold text-white">Yearly Transactions</h2>
          </div>
        </div>

        <div class="p-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Year</label
              >
              <input
                type="number"
                v-model="yearlyParams.year"
                placeholder="Enter year"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Sales Person</label
              >
              <select
                v-model="yearlyParams.salesCode"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
              >
                <option value="">All Sales</option>
                <option
                  v-for="s in salesStore.list"
                  :key="s.code"
                  :value="s.code"
                >
                  {{ s.name }}
                </option>
              </select>
            </div>
          </div>

          <button
            @click="loadYearly"
            class="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-purple-700 focus:ring-4 focus:ring-purple-200 transition-all transform hover:scale-105 active:scale-95"
          >
            Apply Filter
          </button>

          <div class="mt-6 h-80">
            <div
              v-if="!yearlyChart"
              class="h-full bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded-lg"
            ></div>
            <ChartWrapper
              v-else
              :data="yearlyChart"
              :options="getChartOptions()"
            />
          </div>
        </div>
      </section>

      <section
        class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
      >
        <div class="bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-4">
          <div class="flex items-center space-x-3">
            <div class="bg-white bg-opacity-20 p-2 rounded-lg">
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                ></path>
              </svg>
            </div>
            <h2 class="text-xl font-bold text-white">Top Customers</h2>
          </div>
        </div>

        <div class="p-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Start Date</label
              >
              <input
                type="date"
                v-model="customerParams.startDate"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >End Date</label
              >
              <input
                type="date"
                v-model="customerParams.endDate"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>

          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Number of Top Customers</label
            >
            <input
              type="number"
              min="3"
              max="20"
              v-model="customerParams.limit"
              placeholder="Minimum 3 customers"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
            />
          </div>

          <button
            @click="loadCustomers"
            class="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-amber-600 hover:to-amber-700 focus:ring-4 focus:ring-amber-200 transition-all transform hover:scale-105 active:scale-95"
          >
            Apply Filter
          </button>

          <div class="mt-6 h-80">
            <div
              v-if="!customersChart"
              class="h-full bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded-lg"
            ></div>
            <ChartWrapper
              v-else
              :data="customersChart"
              :options="getChartOptions(true)"
            />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.transform {
  transition: transform 0.2s ease-in-out;
}

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>

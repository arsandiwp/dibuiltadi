<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
    <div v-if="store.loading" class="flex justify-center py-16">
      <div
        class="bg-white px-6 py-4 rounded-xl shadow-md flex items-center space-x-3"
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
          />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          />
        </svg>
        <span class="text-gray-700 font-medium">Loading transaction...</span>
      </div>
    </div>

    <div v-else-if="store.transaction" class="space-y-8">
      <BaseDetailForm
        :fields="fields"
        :data="store.transaction"
        :mode="isEdit ? 'edit' : 'detail'"
        title="Transaction Detail"
        subtitle="Review or edit transaction information"
        @save="handleSave"
        @cancel="handleCancel"
      />

      <div
        v-if="store.transaction?.items?.length"
        class="bg-white shadow-xl rounded-2xl border p-6"
      >
        <h2 class="text-xl font-bold text-gray-900 mb-4">Transaction Items</h2>
        <div class="overflow-x-auto">
          <table
            class="min-w-full border border-gray-200 text-sm rounded-lg overflow-hidden"
          >
            <thead class="bg-gray-50 text-gray-700 font-semibold">
              <tr>
                <th class="border px-4 py-2 text-left">Product</th>
                <th class="border px-4 py-2 text-right">Qty</th>
                <th class="border px-4 py-2 text-right">Price</th>
                <th class="border px-4 py-2 text-right">Discount</th>
                <th class="border px-4 py-2 text-right">Subtotal</th>
                <th class="border px-4 py-2 text-right">Margin</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in store.transaction.items"
                :key="index"
                class="hover:bg-gray-50 even:bg-gray-50/30"
              >
                <td class="border px-4 py-2">{{ item.productName }}</td>
                <td class="border px-4 py-2 text-right">{{ item.quantity }}</td>
                <td class="border px-4 py-2 text-right">
                  {{ formatCurrency(item.price) }}
                </td>
                <td class="border px-4 py-2 text-right">{{ item.discount }}</td>
                <td class="border px-4 py-2 text-right">
                  {{ formatCurrency(item.priceSubtotal) }}
                </td>
                <td class="border px-4 py-2 text-right">
                  {{ formatCurrency(item.marginSubtotal) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-red-500 font-medium py-10">
      Data tidak ditemukan
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useTransactionStore } from "../../stores/transaction";
import BaseDetailForm from "../../components/BaseDetailForm.vue";

const route = useRoute();
const router = useRouter();
const store = useTransactionStore();

const isEdit = ref(false);

const fields = [
  { key: "referenceNo", label: "Reference No" },
  { key: "customer.name", label: "Customer" },
  { key: "sales", label: "Sales" },
  { key: "amountTotal", label: "Amount Total" },
  { key: "amountUntaxed", label: "Amount Untaxed" },
  { key: "amountDue", label: "Amount Due" },
  { key: "dateOrder", label: "Date Order" },
  { key: "dateDue", label: "Date Due" },
  { key: "paidAt", label: "Paid At" },
  { key: "createdAt", label: "Created At" },
];

onMounted(() => {
  store.fetchTransaction(route.params.no);
});

function formatCurrency(value) {
  if (!value) return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function handleSave(data) {
  console.log("Save data", data);
}

function handleCancel() {
  router.push({ name: "Transactions" });
}
</script>

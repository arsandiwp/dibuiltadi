<script setup>
import { useUiStore } from "../stores/ui";
const ui = useUiStore();
</script>

<template>
  <div
    v-if="ui.dialog.show"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
  >
    <div
      class="bg-white p-6 rounded-xl shadow-2xl w-96 max-w-full text-center relative transform transition-all duration-300 scale-100 opacity-100"
    >
      <div class="flex justify-center mb-3">
        <div
          v-if="ui.dialog.type === 'error'"
          class="w-12 h-12 flex items-center justify-center rounded-full bg-red-100 text-red-600 text-3xl"
        >
          ✖
        </div>
        <div
          v-else
          class="w-12 h-12 flex items-center justify-center rounded-full bg-green-100 text-green-600 text-3xl"
        >
          ✓
        </div>
      </div>

      <h2
        class="text-xl font-bold mb-2"
        :class="ui.dialog.type === 'error' ? 'text-red-600' : 'text-green-600'"
      >
        {{ ui.dialog.type === "error" ? "Error" : "Success" }}
      </h2>

      <p class="text-gray-600 mb-4">{{ ui.dialog.message }}</p>

      <ul
        v-if="ui.dialog.errors"
        class="text-left text-sm text-red-600 mb-4 list-disc list-inside space-y-1"
      >
        <li v-for="(msg, field) in ui.dialog.errors" :key="field">
          {{ msg }}
        </li>
      </ul>

      <button
        @click="ui.closeDialog()"
        class="bg-blue-600 text-white w-full py-2 rounded-lg hover:bg-blue-700 transition"
      >
        OK
      </button>
    </div>
  </div>
</template>

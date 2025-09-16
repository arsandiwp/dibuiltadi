<template>
  <div class="bg-white shadow rounded-lg p-6">
    <slot name="extra"></slot>

    <h1 class="text-2xl font-bold mb-4">{{ title }}</h1>

    <form
      @submit.prevent="handleSubmit"
      class="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <template v-for="field in fields" :key="field.key">
        <div :class="field.colSpan ? `md:col-span-${field.colSpan}` : ''">
          <label class="block text-sm font-medium">{{ field.label }}</label>

          <component
            :is="
              field.type === 'textarea'
                ? 'textarea'
                : field.type === 'select'
                ? 'select'
                : 'input'
            "
            :value="getValue(localData, field.key)"
            @input="setValue(localData, field.key, $event.target.value)"
            :disabled="isDetail || field.readonly"
            class="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-primary outline-none mt-1"
            :type="
              field.type !== 'textarea' && field.type !== 'select'
                ? field.type || 'text'
                : undefined
            "
          >
            <option
              v-if="field.type === 'select'"
              v-for="opt in field.options"
              :key="opt.value"
              :value="opt.value"
            >
              {{ opt.label }}
            </option>
          </component>
        </div>
      </template>

      <div
        v-if="!isDetail"
        class="mt-6 flex justify-end space-x-3 md:col-span-2"
      >
        <button
          type="button"
          @click="$emit('cancel')"
          class="bg-gray-300 px-4 py-2 rounded"
        >
          Batal
        </button>
        <button
          @click="handleSubmit"
          type="submit"
          class="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {{ mode === "create" ? "Simpan" : "Update" }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";

const props = defineProps({
  mode: { type: String, default: "detail" }, // detail | create | edit
  data: { type: Object, default: () => ({}) },
  fields: { type: Array, default: () => [] },
  title: { type: String, default: "" },
  subtitle: { type: String, default: "" },
});

const emit = defineEmits(["save", "cancel"]);
const localData = ref({});

watch(
  () => props.data,
  (val) => {
    localData.value = { ...(val || {}) };
  },
  { immediate: true, deep: true }
);

const isDetail = computed(() => props.mode === "detail");

function handleSubmit() {
  emit("save", { ...localData.value });
}

function getValue(obj, path) {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
}

function setValue(obj, path, value) {
  const parts = path.split(".");
  let current = obj;
  parts.forEach((p, idx) => {
    if (idx === parts.length - 1) {
      current[p] = value;
    } else {
      if (!current[p]) current[p] = {};
      current = current[p];
    }
  });
}
</script>

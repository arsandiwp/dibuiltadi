<script setup>
import { ref } from "vue";
import { useAuthStore } from "../stores/auth";
import BaseDetailForm from "../components/BaseDetailForm.vue";
import { useUiStore } from "../stores/ui";

const ui = useUiStore();
const auth = useAuthStore();

const form = ref({
  currentPassword: "",
  newPassword: "",
  newPasswordConfirmation: "",
});

const fields = [
  {
    key: "currentPassword",
    label: "Current Password",
    type: "password",
    colSpan: 2,
  },
  { key: "newPassword", label: "New Password", type: "password", colSpan: 2 },
  {
    key: "newPasswordConfirmation",
    label: "Confirm New Password",
    type: "password",
    colSpan: 2,
  },
];

async function handleSubmit(data) {
  try {
    await auth.updatePassword(data);

    ui.openDialog("success", "Password berhasil diperbarui");

    form.value = {
      currentPassword: "",
      newPassword: "",
      newPasswordConfirmation: "",
    };
  } catch (err) {
    const backendErrors = err.response?.data?.errors || {};
    let msg = err.response?.data?.responseMessage || "Gagal update password";

    if (Object.keys(backendErrors).length > 0) {
      msg = Object.values(backendErrors).join(", ");
    }

    ui.openDialog("error", msg);
  }
}
</script>

<template>
  <BaseDetailForm
    :fields="fields"
    :data="form"
    mode="edit"
    @save="handleSubmit"
  />

  <BaseDialog />
</template>

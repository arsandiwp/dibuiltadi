import { defineStore } from "pinia";

export const useUiStore = defineStore("ui", {
  state: () => ({
    dialog: {
      show: false,
      type: "success",
      message: "",
      errors: null,
    },
  }),
  actions: {
    openDialog(type, message, errors = null) {
      this.dialog.show = true;
      this.dialog.type = type;
      this.dialog.message = message;
      this.dialog.errors = errors;
    },
    closeDialog() {
      this.dialog.show = false;
      this.dialog.message = "";
      this.dialog.errors = null;
    },
  },
});

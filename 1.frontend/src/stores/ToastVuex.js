import { defineStore } from 'pinia';

export const useToastStore = defineStore('toast', {
  state: () => ({
    message: null,
    style: null,
    display: false,
  }),

  actions: {
    showMessage(data) {
      this.message = data.message;
      this.style = data.style;
      this.display = !this.display;
    },
  },
});
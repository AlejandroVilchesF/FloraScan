import { defineStore } from 'pinia';
import Settings from "@/settings"

export const useEventsStore = defineStore('events', {
  state: () => ({
    message: "",
  }),

  actions: {
    subscribe() {
      try {
        const eventSource = new EventSource(Settings.template.site.eventsurl);

        eventSource.onmessage = (event) => {
          // Por criterio en este proyecto solo nos comunicamos por JSON
          // así que lo parseamos a su llegada
          this.message = JSON.parse(event.data);
        };

        eventSource.onerror = (error) => {
          console.error('Error en la conexión SSE:', error);
          eventSource.close();

          // Intentar reconexión después de un tiempo
          setTimeout(() => {
            this.subscribe();
          }, 5000); // Intentar reconexión después de 5 segundos (ajusta según tus necesidades)
        };

      } catch (error) {
        throw error;
      }
    },
  }
});
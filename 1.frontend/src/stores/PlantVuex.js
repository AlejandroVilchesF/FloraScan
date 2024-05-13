import { defineStore } from 'pinia';

export const usePlantStore = defineStore('plants', {
  state: () => ({
    scientificName: "",
    family: "",
    genus: "",
    commonName: ""
  }),

  actions: {
    setData(data) {
      this.scientificName = data.species.scientificNameWithoutAuthor;
      this.family = data.species.family.scientificNameWithoutAuthor;
      this.genus = data.species.genus.scientificNameWithoutAuthor;
      this.commonName = data.species.commonNames[0];
    },
    resetState() {
      this.scientificName = "";
      this.family = "";
      this.genus = "";
      this.commonName = "";
    }
  },
});
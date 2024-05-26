import { defineStore } from 'pinia';

export const usePlantStore = defineStore('plants', {
  state: () => ({
    scientificName: "",
    family: "",
    genus: "",
    commonName: "",
    description:"",
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
    },
    setDetailSearch(scientificName){
      this.scientificName=scientificName;
    },
    setDefaultData(nombre_cientifico,nombre_comun,familia,genero,descripcion){
      this.scientificName = nombre_cientifico;
      this.commonName = nombre_comun;
      this.family = familia;
      this.genus = genero;
      this.description=descripcion;
    }
  },
});
<template>
    <div class="card my-2">
        <div class="card-header">
            <h5 class="card-title mb-0">{{ capitalize(plantStore.scientificName) }}</h5>
        </div>
        <div class="card-body" v-if="plantInfo != null">
            <div class="row">
                <div class="col-12 col-md-8">
                    <h6>Datos</h6>
                    <p>{{ plantInfo.descripcion }}</p>
                </div>
                <div class="col-12 col-md-4">
                    <h6>Etiquetas</h6>
                    <p>Aqui van las etiquetas</p>
                </div>
            </div>
        </div>
        <div class="card-footer" v-if="plantInfo != null">
            <ul class="list-group list-group-horizontal">
                <li class="list-group-item">
                    Familia: <span class="text-muted">{{ capitalize(plantInfo.familia) }}</span>
                </li>
                <li class="list-group-item">
                    Genero: <span class="text-muted">{{ capitalize(plantInfo.genero) }}</span>
                </li>
            </ul>
        </div>
    </div>
    <div class="card my-2">
        <div class="card-header">
            <h5 class="card-title mb-0">{{ 'Mapa de aportaciones' }}</h5>
        </div>
        <div class="card-body">
            <div class="fluid-wrapper">
                <Leafletmap ref="mapDetails"></Leafletmap>
            </div>
        </div>
    </div>
</template>



<script>
import PlantService from "../../services/PlantService";
import { usePlantStore } from "@/stores/PlantVuex";
import { useRouter } from 'vue-router';
import Leafletmap from "@/components/maps/Leafletmap.vue";


export default {
    components: {
        Leafletmap
    },
    data() {
        return {
            plantStore: usePlantStore(),
            router: useRouter(),
            plantInfo: null,
            lineList: [],
        };
    },
    async mounted() {
        await this.retriveDetails();
    },
    computed: {},
    watch: {
        plantInfo: function (){
            this.createMarkers();
        }
    },
    methods: {
        async retriveDetails() {
            try {
                const response = await PlantService.getPlant(this.plantStore.scientificName);
                this.plantInfo = response.data;
                console.log(this.plantInfo);
            } catch (error) {
                console.error(error);
            }
        },
        createMarkers(){
            this.$refs.mapDetails.contributionMarkers(this.plantInfo.ubicacion);
        },
        capitalize(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
    }
};
</script>

<style scoped>
.fluid-wrapper {
    height: calc(100vh - 200px);
}
</style>
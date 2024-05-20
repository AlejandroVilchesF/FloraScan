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
                    Nombre Comun: <span class="text-muted">{{ capitalize(plantInfo.nombre_comun) }}</span>
                </li>
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
    <div class="row">
        <div class="col-md-6 col-12" v-if="plantInfo != null">
            <div class="card my-2">
                <div class="card-header">
                    <h5 class="card-title mb-0">Enfermedades</h5>
                </div>
                <div class="card-body">
                    <ul class="list-group">
                        <li class="list-group-item diseaseList" v-for="objeto in plantInfo.enfermedades"
                            @click="diseaseModal(objeto)">
                            {{ objeto.nombre_cientifico }}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="col-md-6 col-12" v-if="plantInfo != null">
            <div class="card my-2">
                <div class="card-header">
                    <h5 class="card-title mb-0">Altitudes</h5>
                </div>
                <div class="card-body">
                </div>
            </div>
        </div>
        <!-- Modal de detalles de enfermedad -->
        <Modal ref="diseaseDetails" id="diseaseDetails" :title="diseaseTitle" :footer="true" :frameless="true">
            <template v-slot:modalBody>
                <div class="row">
                    <div class="col-12 col-md-6">
                        <h6>Descripcion</h6>
                        <p>{{ diseaseDescription }}</p>
                    </div>
                    <div class="col-12 col-md-6">
                        <h6>Tratamiento</h6>
                        <p>{{ diseaseTreament }}</p>
                    </div>
                </div>
            </template>
            <template v-slot:modalFooter>
                <ul class="list-group">
                    <li class="list-group-item">
                        Nombre Comun: <span class="text-muted">{{ diseaseCommonName }}</span>
                    </li>
                </ul>
            </template>
        </Modal>
    </div>
    <!-- Galeria de Imagenes -->
    <div class="card my-2" v-if="plantInfo != null" >
        <div class="card-header">
            <h5 class="card-title mb-0">Galeria de Imagenes</h5>
        </div>
        <div class="card-body">
            <ul class="list-group list-group-horizontal">
                <li class="list-group-item listHover" v-for="(item, index) in plantInfo.imagenes">
                    <img class="img-fluid" :src="item" @click="showModal(index)">
                </li>
            </ul>
        </div>
        <!-- Modal para mostrar la imagen en grande -->
        <Modal ref="imageModal" id="imageModal" :title="'Imagen Original'" :footer="false" :frameless="true">
            <template v-slot:modalBody>
                <img class="img-fluid" :src="largeImage" alt="Imagen original" style="width: 100%; height: 100%;">
            </template>
        </Modal>
    </div>
</template>



<script>
import PlantService from "../../services/PlantService";
import { usePlantStore } from "@/stores/PlantVuex";
import { useRouter } from 'vue-router';
import Leafletmap from "@/components/maps/Leafletmap.vue";
import Modal from "@/components/commons/Modal.vue";


export default {
    components: {
        Leafletmap,
        Modal
    },
    data() {
        return {
            plantStore: usePlantStore(),
            router: useRouter(),
            plantInfo: null,
            lineList: [],
            diseaseTitle:"",
            diseaseDescription:"",
            diseaseTreament:"",
            diseaseCommonName:"",
            largeImage: ""
        };
    },
    async mounted() {
        await this.retriveDetails();
    },
    computed: {},
    watch: {
        plantInfo: function () {
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
        createMarkers() {
            this.$refs.mapDetails.contributionMarkers(this.plantInfo.ubicacion);
        },
        capitalize(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        },
        diseaseModal(objeto) {
            this.$refs.diseaseDetails.openModal();
            this.diseaseTitle=objeto.nombre_cientifico;
            this.diseaseDescription=objeto.descripcion;
            this.diseaseTreament=objeto.tratamiento;
            this.diseaseCommonName=objeto.nombre_comun;
        },
        showModal(index) {
            // Obtener la URL de la imagen en grande
            this.largeImage = this.plantInfo.imagenes[index];
            // Abrir el modal
            this.$refs.imageModal.openModal();
        }
    }
};
</script>

<style scoped>
.fluid-wrapper {
    height: calc(100vh - 200px);
}
.diseaseList:hover{
    cursor: pointer;
}
img{
    height: 150px;
    width: 150px;
}
</style>
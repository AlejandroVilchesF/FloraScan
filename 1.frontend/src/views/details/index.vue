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
                    <div v-if="plantInfo.etiquetas.length > 0">
                        <ul class="list-inline">
                            <li class="list-inline-item" v-for="label in plantInfo.etiquetas">
                                <span class="badge bg-primary">{{ label.nombre_etiqueta }}</span>
                            </li>
                        </ul>
                    </div>
                    <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#labelModal">
                        <span><i class="bi bi-plus-circle"></i> Agregar</span>
                    </button>
                </div>
            </div>
            <!-- Modal para muestra de las etiquetas -->
            <Modal ref="labelModal" id="labelModal" :title="'Selecciona las etiquetas'" :footer="false"
                :frameless="true">
                <template v-slot:modalBody>
                    <ul class="list-inline">
                        <li class="list-inline-item labelCursor" v-for="label in labelList">
                            <span class="badge" :class="checkLabel(label) ? 'bg-success' : 'bg-primary'"
                                @click="handleLabels(label, $event)">{{ label.nombre_etiqueta
                                }}</span>
                        </li>
                    </ul>
                    <div>
                        <button class="btn btn-success w-100" @click="sendLabels">
                            <i class="fa-solid fa-paper-plane"></i> Enviar
                        </button>
                    </div>
                </template>
            </Modal>
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
        <!-- Card de enfermedades -->
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
                <div class="card-footer">
                    <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#newDisease">
                        <span><i class="bi bi-plus-circle"></i> Agregar</span>
                    </button>
                </div>
            </div>
        </div>
        <!-- Modal di aggregazione delle malattie -->
        <Modal ref="newDisease" id="newDisease" :title="'Datos de la enfermedad'" :footer="false" :frameless="true">
            <template v-slot:modalBody>
                <div class="row">
                    <div class="col-md-6 col-12">
                        <Input :label="'Nombre Cientifio'" id="newDiseaseScientificName" type="text"
                            v-model="newDiseaseTitle" :required="true" icon="fa-solid fa-flask"
                            :additionalClass="familyCheck ? 'bg-danger' : ''"></Input>
                    </div>
                    <div class="col-md-6 col-12">
                        <Input :label="'Nombre Común'" id="commonName" type="text" v-model="newDiseaseCommonName"
                            :required="false" icon="fa-solid fa-comment"></Input>
                    </div>
                    <div class="col-md-6 col-12">
                        <h5>Introduce una descripcion</h5>
                        <div class="fluid-wrapper">
                            <textarea v-model="newDiseaseDescription" id="newDiseaseDescription"
                                class="form-control mb-3 h-100"></textarea>
                        </div>
                    </div>
                    <div class="col-md-6 col-12">
                        <h5>Introduce un tratramiento</h5>
                        <div class="fluid-wrapper">
                            <textarea v-model="newDiseaseTreatment" id="newDiseaseTreatment"
                                class="form-control mb-3 h-100"></textarea>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12 col-md-6 offset-md-3 mt-2">
                        <button class="btn btn-success w-100" @click="addDisease">
                            <i class="fa-solid fa-paper-plane"></i> Enviar
                        </button>
                    </div>
                </div>
            </template>
        </Modal>
        <div class="col-md-6 col-12" v-if="plantInfo != null">
            <div class="card my-2">
                <div class="card-header">
                    <h5 class="card-title mb-0">Temperatura ideal por Mes</h5>
                </div>
                <div class="card-body">
                    <BarChart ref="barchart" :dataSet="dataResponseBar" :categories="barCategories" chartID="barchart"
                        estilo="width: 100%; height: 350px;" v-if="barGraphReady" />
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
    <div class="card my-2" v-if="plantInfo != null">
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
import LabelService from "../../services/LabelService";
import DiseaseService from "../../services/DiseaseService";
import { usePlantStore } from "@/stores/PlantVuex";
import { useRouter } from 'vue-router';
import Leafletmap from "@/components/maps/Leafletmap.vue";
import Modal from "@/components/commons/Modal.vue";
import Input from "@/components/commons/Input.vue";
import BarChart from "./components/BarChart";


export default {
    components: {
        Leafletmap,
        Modal,
        Input,
        BarChart
    },
    data() {
        return {
            plantStore: usePlantStore(),
            router: useRouter(),
            plantInfo: null,
            lineList: [],
            diseaseTitle: "",
            diseaseDescription: "",
            diseaseTreament: "",
            diseaseCommonName: "",
            largeImage: "",
            labelList: [],
            idLabelList: [],
            newDiseaseTitle: "",
            newDiseaseDescription: "",
            newDiseaseTreatment: "",
            newDiseaseCommonName: "",
            dataResponseBar: [],
            barCategories: [],
            barGraphReady: false,
            tempMin: [],
            tempMax: []
        };
    },
    async mounted() {
        await this.retriveDetails();
        await this.retriveLabels();
        this.labelListFirstState();
    },
    computed: {},
    watch: {
        plantInfo: function () {
            this.createMarkers();
            if (this.plantInfo.temperaturas.length > 0) {
                this.graphData();
            }
        }
    },
    methods: {
        async retriveDetails() {
            try {
                const response = await PlantService.getPlant(this.plantStore.scientificName);
                this.plantInfo = response.data;
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
            this.diseaseTitle = objeto.nombre_cientifico;
            this.diseaseDescription = objeto.descripcion;
            this.diseaseTreament = objeto.tratamiento;
            this.diseaseCommonName = objeto.nombre_comun;
        },
        showModal(index) {
            // Obtener la URL de la imagen en grande
            this.largeImage = this.plantInfo.imagenes[index];
            // Abrir el modal
            this.$refs.imageModal.openModal();
        },
        async retriveLabels() {
            try {
                const response = await LabelService.getAll();
                this.labelList = response.data;
            } catch (error) {
                console.error(error);
            }
        },
        handleLabels(label, event) {
            const clickedSpan = event.target;
            clickedSpan.classList.toggle("bg-primary");
            const comprobacion = clickedSpan.classList.toggle("bg-success");

            if (comprobacion) {
                this.idLabelList.push(label._id);
            } else {
                const index = this.idLabelList.indexOf(label._id);
                this.idLabelList.splice(index, 1);
            }
        },
        async sendLabels() {
            try {
                this.idLabelList = this.idLabelList.filter(el => el !== null);
                await PlantService.insertLabels(this.plantInfo.nombre_cientifico, this.idLabelList);
                await this.retriveDetails();
                this.$refs.labelModal.closeModal();
            } catch (error) {
                console.error(error);
            }
        },
        checkLabel(label) {
            return this.plantInfo.etiquetas.some(el => el._id === label._id);;
        },
        labelListFirstState() {
            this.plantInfo.etiquetas.forEach(el => {
                this.idLabelList.push(el._id);
            })
        },
        async addDisease() {
            try {
                let body = {
                    nombre_cientifico: this.newDiseaseTitle,
                    nombre_comun: this.newDiseaseCommonName,
                    descripcion: this.newDiseaseDescription,
                    tratamiento: this.newDiseaseTreatment,
                    nombre_planta: this.plantInfo.nombre_cientifico
                }
                const response = await DiseaseService.newDisease(body);
                if (response.data._id == undefined) {
                    await PlantService.insertDisease(this.plantInfo.nombre_cientifico, response.data);
                } else {
                    await PlantService.insertDisease(this.plantInfo.nombre_cientifico, response.data._id);
                }
                this.newDiseaseTitle = "";
                this.newDiseaseCommonName = "";
                this.newDiseaseDescription = "";
                this.newDiseaseTreatment = "";
                this.retriveDetails();
                this.$refs.newDisease.closeModal();
            } catch (error) {
                console.error(error);
            }
        },
        graphData() {
            try {
                this.dataResponseBar=[];
                this.barCategories = ["Primavera", "Verano", "Otoño", "Invierno"];
                this.formatTemps();
                // Objeto para la grafica de barras
                let barObject1 = {
                    name: 'Temperatura Minima',
                    data: this.tempMin,
                    type: 'bar',
                    showBackground: true,
                    backgroundStyle: {
                        color: 'rgba(180, 180, 180, 0.2)'
                    }
                }

                // Objeto para la grafica de barras
                let barObject2 = {
                    name: 'Temperatura Maxima',
                    data: this.tempMax,
                    type: 'bar',
                    showBackground: true,
                    backgroundStyle: {
                        color: 'rgba(180, 180, 180, 0.2)'
                    }
                }

                this.dataResponseBar.push(barObject1);
                this.dataResponseBar.push(barObject2);
                this.barGraphReady = true;
            } catch (error) {
                console.error(error);
            }
        },
        formatTemps() {
            this.tempMax=[];
            this.tempMin=[];
            this.plantInfo.temperaturas.forEach(el => {
                if (el.minima != null) {
                    this.tempMin.push(el.minima);
                } else {
                    this.tempMin.push(0);
                }
                if (el.maxima != null) {
                    this.tempMax.push(el.maxima);
                } else {
                    this.tempMax.push(0);
                }

            })
        }
    }
};
</script>

<style scoped>
.fluid-wrapper {
    height: calc(100vh - 200px);
}

.diseaseList:hover {
    cursor: pointer;
}

img {
    height: 150px;
    width: 150px;
}
.labelCursor{
    cursor: pointer;
}
</style>
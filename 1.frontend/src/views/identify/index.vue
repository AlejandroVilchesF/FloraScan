<template>
    <div class="card my-3">
        <div class="card-header">
            <h5 class="card-title mb-0">{{ 'Identificación' }}</h5>
        </div>
        <div class="card-body">
            <h5>Bienvenido a la identificación por IA de FloraScan</h5>
            <p>Para usarla, simplemente elige una imagen de tu galería,
                y preferiblemente un órgano de la planta para que la búsqueda sea más precisa.
            </p>
            <hr>
            <div class="row">
                <div class="col-7">
                    <h6>Selecciona una imagen</h6>
                    <input class="form-control mb-3" type="file" ref="fileInput" @change="updateButton">
                    <button class="btn btn-success" @click="getIdentification" :disabled="fileSelected">
                        <span><i class="bi bi-flower2"></i> Identificar</span>
                    </button>
                </div>
                <div class="col-5" :hidden="this.flowerOrgan == 'auto'">
                    <h6>Organo seleccionado</h6>
                    <img :src="organImage" alt="Organo Seleccionado" class="img-fluid">
                </div>
            </div>
            <!-- Modal de seleccion de organo -->
            <Modal ref="flowerModal" id="flowerModal" :title="'Selecciona un organo'" :footer="false" :frameless="true">
                <template v-slot:modalBody>
                    <div class="list-group">
                        <button type="button" class="list-group-item list-group-item-action"
                            @click="selectOrgan('flower')">
                            <img src="~@/assets/img/organs/flower.png" alt="Flor" width="30"> Flor
                        </button>
                        <button type="button" class="list-group-item list-group-item-action"
                            @click="selectOrgan('leaf')">
                            <img src="~@/assets/img/organs/leaf.png" alt="Hoja" width="30"> Hoja
                        </button>
                        <button type="button" class="list-group-item list-group-item-action"
                            @click="selectOrgan('fruit')">
                            <img src="~@/assets/img/organs/fruit.png" alt="Fruto" width="30"> Fruto
                        </button>
                        <button type="button" class="list-group-item list-group-item-action"
                            @click="selectOrgan('bark')">
                            <img src="~@/assets/img/organs/bark.png" alt="Corteza" width="30"> Corteza
                        </button>
                    </div>
                </template>
            </Modal>
        </div>
    </div>
    <div>
        <Spinner v-if="waitingPrediction"></Spinner>
    </div>
    <!-- Card de muestra de Imagenes -->
    <div class="card my-3" v-if="plantsIdentify.length > 0" v-for="(item, index) in plantsIdentify.slice(0, 3)">
        <div class="card-header">
            <h5 class="card-title mb-0">{{ item.species.scientificNameWithoutAuthor }}
                <em class="text-muted" style="font-size: 12px !important;">{{ (item.score * 100).toFixed(2) }}%</em>
            </h5>
        </div>
        <!-- Cardbody muestra de imagenes -->
        <div class="card-body">
            <ul class="list-group list-group-horizontal">
                <li class="list-group-item listHover" v-for="(img, imgIndex) in item.images" :key="imgIndex">
                    <img class="img-fluid" :src="img.url.s" @click="showModal(index, imgIndex)">
                </li>
            </ul>
        </div>
        <!-- Cardfooter de muestra de imagenes con enlaces a la informacion/colaboracion -->
        <div class="card-footer">
            <a class="router-link" @click="seeDetails(item.species.scientificNameWithoutAuthor,index)">
                <i class="bi bi-search me-2" data-theme-icon="bi-search"></i>
                <span class="align-middle">{{ 'Ver detalles' }}</span>
            </a>
        </div>
    </div>
    <div>
        <!-- Modal para mostrar la imagen en grande -->
        <Modal ref="imageModal" id="imageModal" :title="'Imagen Original'" :footer="false" :frameless="true">
            <template v-slot:modalBody>
                <img class="img-fluid" :src="largeImage" alt="Imagen original" style="width: 100%; height: 100%;">
            </template>
        </Modal>
        <!-- Modal de detalles de la planta -->
        <Modal ref="plantDetails" id="plantDetails" :title="detailsTitle" :footer="false" :frameless="true">
            <template v-slot:modalBody>
                <div class="row">
                    <div class="col-12 col-md-9">
                        <p class="text-start">{{ detailsDescription }}</p>
                    </div>
                    <div class="col-12 col-md-3">
                        <img :src="detailsImage" class="image-fluid" style="width: 100%; height: 100%;" />
                    </div>
                </div>
                <div>
                    <ul class="list-group list-group-horizontal">
                        <li class="list-group-item">Familia: {{ detailsFamily }}</li>
                        <li class="list-group-item">Genero: {{ detailsGenus }}</li>
                    </ul>
                </div>
            </template>
        </Modal>
        <!-- Modal de confirmacion de colaboracion -->
        <ModalConfirm 
            id="colaborationModal" 
            :title="'Confirmación de Colaboración'" 
            :message="'No existen datos de esta planta, ¿Desea agregar los datos?'"
            :confirm="'Sí, quiero colaborar'"
            :reject="'No, gracias'"
        />
        <button ref="colaborationButton" class="btn" data-bs-toggle="modal" data-bs-target="#colaborationModal" hidden></button>
    </div>
</template>

<script>
import DetectionService from "../../services/DetectionService";
import Modal from "../../components/commons/Modal.vue";
import ModalConfirm from "../../components/commons/ModalConfirm.vue";
import Spinner from "../../components/commons/Spinner.vue";
import PlantService from "../../services/PlantService";
import { usePlantStore } from "@/stores/PlantVuex";

export default {
    components: {
        Modal,
        Spinner,
        ModalConfirm
    },
    data() {
        return {
            fileSelected: true,
            flowerOrgan: 'auto',
            organImage: "",
            plantsIdentify: [],
            largeImage: "",
            waitingPrediction: false,
            detailsTitle: "",
            detailsCommon: "",
            detailsDescription: "",
            detailsImage: "",
            detailsFamily: "",
            detailsGenus: "",
        };
    },
    mounted() { },
    computed: {},
    watch: {},
    methods: {
        getIdentification() {
            this.waitingPrediction = true;
            const fileInput = this.$refs.fileInput;
            const file = fileInput.files[0];
            const reader = new FileReader();
            reader.onload = async (event) => {
                const fileContent = event.target.result;
                const formData = new FormData();
                formData.append('fileName', file.name);
                formData.append('fileContent', fileContent);
                formData.append('flowerOrgan', this.flowerOrgan);
                try {
                    // Llamar al método identify y esperar la respuesta
                    const response = await DetectionService.identify(formData);
                    // Asignar la respuesta a la variable plantsIdentify
                    this.plantsIdentify = response.data;
                    this.waitingPrediction = false;
                } catch (error) {
                    // Manejar cualquier error que ocurra durante la llamada a DetectionService.identify
                    console.error("Error al identificar plantas:", error);
                }
            }
            reader.readAsDataURL(file);
        },
        updateButton() {
            this.fileSelected = !this.fileSelected;
            this.$refs.flowerModal.openModal();
        },
        selectOrgan(valor) {
            this.flowerOrgan = valor;
            this.$refs.flowerModal.closeModal();
            this.organImage = require(`@/assets/img/organs/${valor}.png`);
        },
        deleteOrgan() {
            this.organImage = "";
            this.flowerOrgan = "auto";
            this.$refs.flowerModal.openModal();
        },
        showModal(itemIndex, imgIndex) {
            // Obtener la URL de la imagen en grande
            this.largeImage = this.plantsIdentify[itemIndex].images[imgIndex].url.o;
            // Abrir el modal
            this.$refs.imageModal.openModal();
        },
        async seeDetails(plantName,indice) {
            try {
                this.restartDetails();
                const response = await PlantService.getPlant(plantName.toLowerCase());
                if (response.code === 2001) {
                    this.detailsTitle = this.capitalize(response.data.nombre_cientifico);
                    this.detailsCommon = response.data.nombre_comun ? this.capitalize(response.data.nombre_comun) : "";
                    this.detailsFamily = this.capitalize(response.data.familia);
                    this.detailsGenus = this.capitalize(response.data.genero);
                    this.detailsImage = response.data.imagenes[0];
                    this.detailsDescription = response.data.descripcion;
                    this.$refs.plantDetails.openModal();
                } else {
                    usePlantStore().setData(this.plantsIdentify[indice]);
                    this.$refs.colaborationButton.click();
                }
            } catch (error) {
                console.error("Error al obtener los detalles de la planta");
            }
        },
        restartDetails() {
            this.detailsTitle = "";
            this.detailsCommon = "";
            this.detailsFamily = "";
            this.detailsGenus = "";
            this.detailsImage = "";
            this.detailsDescription = "";
        },
        capitalize(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
    }
};
</script>

<style scoped>
.router-link {
    text-decoration: none !important;
}

.router-link:hover {
    cursor: pointer !important;
}
</style>
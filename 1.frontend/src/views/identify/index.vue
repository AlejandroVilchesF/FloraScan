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
</template>

<script>
import DetectionService from "../../services/DetectionService";
import Modal from "../../components/commons/Modal.vue";
export default {
    components: {
        Modal
    },
    data() {
        return {
            fileSelected: true,
            flowerOrgan: 'auto',
            organImage: ""
        };
    },
    mounted() { },
    computed: {},
    watch: {},
    methods: {
        getIdentification() {
            const fileInput = this.$refs.fileInput;
            const file = fileInput.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                const fileContent = event.target.result;
                const formData = new FormData();
                formData.append('fileName', file.name);
                formData.append('fileContent', fileContent);
                formData.append('flowerOrgan', this.flowerOrgan);
                DetectionService.identify(formData);
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
        deleteOrgan(){
            this.organImage = "";
            this.flowerOrgan = "auto";
            this.$refs.flowerModal.openModal();
        }
    }
};
</script>

<style scoped></style>
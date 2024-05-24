<template>
    <div class="card my-2" ref="firstDiv">
        <div class="card-header">
            <h5 class="card-title mb-0">{{ 'Formulario de contribución' }}</h5>
        </div>
        <div class="card-body">
            <p> Con esta contribución nos ayuda a ampliar el conocimiento almacenado en FloraScan.
                <br>
                Por favor introduce los datos de la nueva planta.
            </p>
            <hr />
            <form ref="plantForm" class="position-relative">
                <!-- Primera Fila -->
                <div class="row">
                    <div class="col-md-6 col-12">
                        <Input :label="'Nombre Científico'" id="cientificiName" type="text" v-model="scientificName"
                            :required="true" icon="fa-solid fa-flask"
                            :additionalClass="cientificCheck ? 'bg-danger' : ''"></Input>
                    </div>
                    <div class="col-md-6 col-12">
                        <Input :label="'Nombre Común'" id="commonName" type="text" v-model="commonName"
                            :required="false" icon="fa-solid fa-comment"></Input>
                    </div>
                </div>
                <!-- Segunda Fila -->
                <div class="row">
                    <div class="col-md-6 col-12">
                        <Input :label="'Familia'" id="family" type="text" v-model="family" :required="true"
                            icon="fa-solid fa-people-group" :additionalClass="familyCheck ? 'bg-danger' : ''"></Input>
                    </div>
                    <div class="col-md-6 col-12">
                        <Input :label="'Género'" id="genus" type="text" v-model="genus" :required="true"
                            icon="fa-solid fa-clipboard-list" :additionalClass="genusCheck ? 'bg-danger' : ''"></Input>
                    </div>
                </div>
                <!-- Tercera Fila -->
                <div class="row">
                    <div class="col-md-6 col-12">
                        <label for="plantImage" class="form-label">Selecciona una imagen</label>
                        <input class="form-control mb-3" type="file" ref="plantImage" id="plantImage"
                            @change="checkPlantImage" :class="plantImageCheck ? 'bg-danger' : ''">
                    </div>
                </div>
                <!-- Boton Show Extra Info -->
                <div class="position-absolute bottom-0 end-0" @click="showExtraInfo" v-if="!extraInfo">
                    <button class="btn btn-success"><i class="fa-solid fa-sitemap"></i> Informacion adicional</button>
                </div>
                <!-- Informacion adicional -->
                <div class="row" v-if="extraInfo">
                    <h6 class="form-label">Temperaturas ideales segun estacion</h6>
                    <!-- Primavera -->
                    <div class="col-md-6 col-12">
                        <label for="temp" class="form-label">Primavera</label>
                        <div class="row">
                            <div class="col-md-6 col-12">
                                Minima
                                <input class="form-control mb-3" type="number" v-model="spring.minima">
                            </div>
                            <div class="col-md-6 col-12">
                                Maxima
                                <input class="form-control mb-3" type="number" v-model="spring.maxima">
                            </div>
                        </div>
                    </div>
                    <!-- Verano -->
                    <div class="col-md-6 col-12">
                        <label for="temp" class="form-label">Verano</label>
                        <div class="row">
                            <div class="col-md-6 col-12">
                                Minima
                                <input class="form-control mb-3" type="number" v-model="summer.minima">
                            </div>
                            <div class="col-md-6 col-12">
                                Maxima
                                <input class="form-control mb-3" type="number" v-model="summer.maxima">
                            </div>
                        </div>
                    </div>
                    <!-- Otoño -->
                    <div class="col-md-6 col-12">
                        <label for="temp" class="form-label">Otoño</label>
                        <div class="row">
                            <div class="col-md-6 col-12">
                                Minima
                                <input class="form-control mb-3" type="number" v-model="autumn.minima">
                            </div>
                            <div class="col-md-6 col-12">
                                Maxima
                                <input class="form-control mb-3" type="number" v-model="autumn.maxima">
                            </div>
                        </div>
                    </div>
                    <!-- Invierno -->
                    <div class="col-md-6 col-12">
                        <label for="temp" class="form-label">Invierno</label>
                        <div class="row">
                            <div class="col-md-6 col-12">
                                Minima
                                <input class="form-control mb-3" type="number" v-model="winter.minima">
                            </div>
                            <div class="col-md-6 col-12">
                                Maxima
                                <input class="form-control mb-3" type="number" v-model="winter.maxima">
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Boton de ocultar informacion adicional -->
                <div class="text-end" @click="showExtraInfo" v-if="extraInfo">
                    <button class="btn btn-danger"><i class="fa-solid fa-sitemap"></i> Ocultar informacion adicional</button>
                </div>
            </form>
        </div>
    </div>
    <!-- Descripcion y ubicacion -->
    <div class="row">
        <!-- Descripcion -->
        <div class="col-md-6 col-12">
            <div class="card my-2">
                <div class="card-header">
                    <h5 class="card-title mb-0">{{ 'Descripción' }}
                        <em class="small text-muted">Introduce una descripción</em>
                    </h5>
                </div>
                <div class="card-body">
                    <div class="fluid-wrapper">
                        <textarea v-model="description" id="description" class="form-control mb-3 h-100"></textarea>
                    </div>
                </div>
                <div class="card-footer">
                    <button class="btn btn-success w-100" @click="handleForm">
                        <i class="fa-solid fa-paper-plane"></i> Enviar
                    </button>
                </div>
            </div>
        </div>
        <!-- Ubicacion -->
        <div class="col-md-6 col-12">
            <div class="card my-2">
                <div class="card-header">
                    <h5 class="card-title mb-0">{{ 'Ubicación' }}
                        <em class="small text-muted">Selecciona una ubicación</em>
                    </h5>
                </div>
                <div class="card-body" :class="ubicationCheck ? 'bg-danger' : ''">
                    <div class="fluid-wrapper">
                        <Leafletmap ref="map" @mapClick="handleMapClick"></Leafletmap>
                    </div>
                </div>
                <div class="card-footer">
                    <button class="btn btn-danger w-100" @click="resetForm">
                        <i class="fa-solid fa-trash"></i> Reiniciar
                    </button>
                </div>
            </div>
        </div>
    </div>
    <!-- Div de errores -->
    <div class="card my-2 bg-danger" :class="errors.length === 0 ? 'd-none' : ''" ref="divErrors">
        <div class="card-header">
            <h5 class="card-title mb-0">{{ 'Errores' }}</h5>
        </div>
        <div class="card-body">
            <ul class="list-group">
                <li class="list-group-item bg-danger" v-for="(item) in errors"> {{ item }}</li>
            </ul>
        </div>
    </div>
</template>

<script>
import Input from "@/components/commons/Input.vue";
import Leafletmap from "@/components/maps/Leafletmap.vue";
import PlantService from "../../services/PlantService";
import { usePlantStore } from "@/stores/PlantVuex";
import { useRouter } from 'vue-router';

export default {
    components: {
        Input,
        Leafletmap
    },
    data() {
        return {
            scientificName: "",
            commonName: "",
            family: "",
            genus: "",
            description: "",
            ubication: [],
            errors: [],
            cientificCheck: false,
            familyCheck: false,
            genusCheck: false,
            plantImageCheck: false,
            ubicationCheck: false,
            plantStore: usePlantStore(),
            router: useRouter(),
            extraInfo: false,
            spring: {
                minima: null,
                maxima: null
            },
            summer: {
                minima: null,
                maxima: null
            },
            autumn: {
                minima: null,
                maxima: null
            },
            winter: {
                minima: null,
                maxima: null
            }
        };
    },
    mounted() {
        //Si llegamos desde el modal confirm de identificacion obtenemos los datos guardados en PiniaStore
        if (this.router.options.history.state.back == "/general/identificacion") {
            this.handleIdentifyRedirection();
        }
    },
    computed: {},
    watch: {
        scientificName: function (newVal, oldVal) {
            if (newVal.trim().length > 0) {
                this.cientificCheck = false;
                this.errors = this.errors.filter(error => error !== "El nombre cientifico no puede estar vacio");
            }
        },
        family: function (newVal, oldVal) {
            if (newVal.trim().length > 0) {
                this.familyCheck = false;
                this.errors = this.errors.filter(error => error !== "Debe incluir la familia en su contribucion");
            }
        },
        genus: function (newVal, oldVal) {
            if (newVal.trim().length > 0) {
                this.genusCheck = false;
                this.errors = this.errors.filter(error => error !== "Debe incluir el genero en su contribucion");
            }
        },
        ubication: function (newVal, oldVal) {
            if (newVal.length > 0) {
                this.ubicationCheck = false;
                this.errors = this.errors.filter(error => error !== "Debe seleccionar la ubicacion desde donde tomo la imagen");
            }
        }
    },
    methods: {
        handleMapClick() {
            this.ubication = [this.$refs.map.lat, this.$refs.map.lng];
        },
        async handleForm() {
            if (this.validateForm()) {
                try {
                    let imagen = await this.imageToBase64();
                    let body = {
                        scientificName: this.scientificName,
                        commonName: this.commonName,
                        family: this.family,
                        genus: this.genus,
                        description: this.description,
                        image: imagen,
                        ubication: this.ubication,
                        temp: [this.spring,this.summer,this.autumn,this.winter]
                    }
                    try {
                        await PlantService.newPlant(body);
                        this.resetForm();
                    } catch (error) {
                        console.error("Error al crear una nueva planta");
                    }
                } catch (error) {
                    console.error("Error al convertir la imagen a base 64:", error);
                }
            } else {
                this.$nextTick(() => { this.$refs.divErrors.scrollIntoView({ behavior: 'smooth', block: 'start' }) });
            }
        },
        imageToBase64() {
            const fileInput = this.$refs.plantImage;
            const file = fileInput.files[0];
            const reader = new FileReader();
            //Promesa para controlar la asincronia del objeto FileReader
            return new Promise((resolve, reject) => {
                reader.onload = (event) => {
                    const fileContent = event.target.result;
                    resolve(fileContent);
                };
                reader.onerror = (error) => {
                    reject(error);
                };
                if (file) {
                    reader.readAsDataURL(file);
                } else {
                    reject(new Error("No se ha seleccionado ningun archivo"));
                }
            });
        },
        resetForm() {
            Object.assign(this.$data, this.$options.data.call(this));
            this.$refs.plantImage.value = "";
            this.$refs.map.removeMarkers();
            //Obtenemos el elemento de raiz de la aplicacion para poder devolver al usuario a la parte de arriba
            document.getElementById("appInner").scrollTo({ top: 0, left: 0, behavior: "smooth" });
        },
        validateForm() {
            if (!this.scientificName) {
                this.errors.push("El nombre cientifico no puede estar vacio");
                this.cientificCheck = true;
            }

            if (!this.family) {
                this.errors.push("Debe incluir la familia en su contribucion");
                this.familyCheck = true;
            }

            if (!this.genus) {
                this.errors.push("Debe incluir el genero en su contribucion");
                this.genusCheck = true;
            }

            if (this.$refs.plantImage.files.length === 0) {
                this.errors.push("La imagen de la planta no debe estar vacia");
                this.plantImageCheck = true;
            }

            if (this.ubication.length === 0) {
                this.errors.push("Debe seleccionar la ubicacion desde donde tomo la imagen");
                this.ubicationCheck = true;
            }

            return this.errors.length === 0;
        },
        checkPlantImage() {
            if (this.$refs.plantImage.files.length !== 0) {
                this.plantImageCheck = false;
                this.errors = this.errors.filter(error => error !== "La imagen de la planta no debe estar vacia");
            }
        },
        handleIdentifyRedirection() {
            document.getElementById("appInner").scrollTo({ top: 0, left: 0, behavior: "smooth" });
            this.scientificName = this.plantStore.scientificName;
            this.commonName = this.plantStore.commonName;
            this.family = this.plantStore.family;
            this.genus = this.plantStore.genus;
            this.plantStore.resetState();
        },
        showExtraInfo() {
            this.extraInfo = !this.extraInfo;
        }
    }
};
</script>

<style scoped>
.fluid-wrapper {
    height: calc(100vh - 200px);
}

.bg-danger {
    color: white !important;
}

.list-group-item {
    background-color: #dc3a4a !important;
}
</style>
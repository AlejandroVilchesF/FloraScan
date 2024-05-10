<template>
    <div class="card my-2">
        <div class="card-header">
            <h5 class="card-title mb-0">{{ 'Formulario de contribución' }}</h5>
        </div>
        <div class="card-body">
            <p> Con esta contribución nos ayuda a ampliar el conocimiento almacenado en FloraScan.
                <br>
                Por favor introduce los datos de la nueva planta.
            </p>
            <hr />
            <form ref="plantForm">
                <!-- Primera Fila -->
                <div class="row">
                    <div class="col-md-6 col-12">
                        <Input :label="'Nombre Científico'" id="cientificiName" type="text" v-model="cientificName"
                            :required="true" icon="fa-solid fa-flask"></Input>
                    </div>
                    <div class="col-md-6 col-12">
                        <Input :label="'Nombre Común'" id="commonName" type="text" v-model="commonName" :required="true"
                            icon="fa-solid fa-comment"></Input>
                    </div>
                </div>
                <!-- Segunda Fila -->
                <div class="row">
                    <div class="col-md-6 col-12">
                        <Input :label="'Familia'" id="family" type="text" v-model="family" :required="true"
                            icon="fa-solid fa-people-group"></Input>
                    </div>
                    <div class="col-md-6 col-12">
                        <Input :label="'Género'" id="genus" type="text" v-model="genus" :required="true"
                            icon="fa-solid fa-clipboard-list"></Input>
                    </div>
                </div>
                <!-- Tercera Fila -->
                <div class="row">
                    <div class="col-md-6 col-12">
                        <label for="plantImage" class="form-label">Selecciona una imagen</label>
                        <input class="form-control mb-3" type="file" ref="plantImage" id="plantImage">
                    </div>
                    <div class="col-md-6 col-12">
                    </div>
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
                <div class="card-body">
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
                <li class="list-group-item bg-danger" v-for="(item) in errors"> {{ item.message }}</li>
            </ul>
        </div>
    </div>
</template>

<script>
import Input from "@/components/commons/Input.vue";
import Leafletmap from "@/components/maps/Leafletmap.vue";
export default {
    components: {
        Input,
        Leafletmap
    },
    data() {
        return {
            cientificName: "",
            commonName: "",
            family: "",
            genus: "",
            description: "",
            image: null,
            ubication: [],
            errors: []
        };
    },
    mounted() { },
    computed: {},
    watch: {},
    methods: {
        saveInformation() {

        },
        handleMapClick() {
            this.ubication = [this.$refs.map.lat, this.$refs.map.lng]
        },
        async handleForm() {
            if (this.validateForm()) {
                try {
                    let imagen = await this.imageToBase64();
                    let body = {
                        cientificName: this.cientificName,
                        commonName: this.commonName,
                        family: this.family,
                        genus: this.genus,
                        description: this.description,
                        image: imagen,
                        ubication: this.ubication
                    }
                    console.log(body);
                } catch (error) {
                    console.error("Error al convertir la imagen a base 64:", error);
                }
            } else{
                this.$nextTick(()=>{this.$refs.divErrors.scrollIntoView({ behavior: 'smooth', block: 'start' })});
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
        },
        validateForm() {
            if (!this.cientificName) {
                this.errors.push({message:"El nombre cientifico no puede estar vacio",id:1});
            }

            if (!this.family) {
                this.errors.push({message:"Debe incluir la familia en su contribucion",id:2});
            }

            if (!this.genus) {
                this.errors.push({message:"Debe incluir el genero en su contribucion",id:3});
            }

            if (!this.image) {
                this.errors.push({message:"La imagen de la planta no debe estar vacia",id:4});
            }

            if (this.ubication.length === 0) {
                this.errors.push({message:"Debe seleccionar la ubicacion desde donde tomo la imagen",id:5});
            }

            return this.errors.length === 0;
        }
    }
};
</script>

<style scoped>
.fluid-wrapper {
    height: calc(100vh - 200px);
}
.bg-danger{
    color: white !important;
}
.list-group-item{
    background-color: #dc3a4a !important;
}
</style>
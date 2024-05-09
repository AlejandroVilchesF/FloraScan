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
                            icon="fa-solid fa-flask"></Input>
                    </div>
                    <div class="col-md-6 col-12">
                        <Input :label="'Género'" id="genus" type="text" v-model="genus" :required="true"
                            icon="fa-solid fa-comment"></Input>
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
                    <button class="btn btn-success w-100"><i class="fa-solid fa-paper-plane"></i> Enviar</button>
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
                    <button class="btn btn-danger w-100"><i class="fa-solid fa-trash"></i> Reiniciar</button>
                </div>
            </div>
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
            ubication: []
        };
    },
    mounted() { },
    computed: {},
    watch: {},
    methods: {
        saveInformation() {

        },
        handleMapClick(){
            this.ubication=[this.$refs.map.lat,this.$refs.map.lng]
            console.log(this.ubication);
        }
    }
};
</script>

<style scoped>
.fluid-wrapper{
    height: calc(100vh - 200px);
}
</style>
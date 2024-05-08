<template>
    <div class="card my-3">
        <div class="card-header">
            <h5 class="card-title mb-0">{{ 'Contribución' }}</h5>
        </div>
        <div class="card-body">
            <!-- <p>Con esta contribución nos ayuda a ampliar el conocimiento almacenado en FloraScan</p> -->
            <form>
                <!-- Primera Fila -->
                <div class="row">
                    <div class="col-md-6 col-12">
                        <Input :label="'Nombre Científico'" id="cientificiName" type="text" v-model="cientificName"
                            :required="true" icon="fa-solid fa-flask"></Input>
                    </div>
                    <div class="col-md-6 col-12">
                        <Input :label="'Nombre Comun'" id="commonName" type="text" v-model="commonName" :required="true"
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
            <div class="card my-3">
                <div class="card-header">
                    <h5 class="card-title mb-0">{{ 'Descripcion' }}</h5>
                </div>
                <div class="card-body">
                    <label for="description" class="form-label">Introduce una descripcion</label>
                    <br />
                    <textarea v-model="description" id="description" class="form-control mb-3" cols="30"
                        rows="10"></textarea>
                </div>
            </div>
        </div>
        <!-- Ubicacion -->
        <div class="col-md-6 col-12">
            <div class="card my-3">
                <div class="card-header">
                    <h5 class="card-title mb-0">{{ 'Ubicacion' }}</h5>
                </div>
                <div class="card-body">
                    <label for="ubication" class="form-label">Selecciona una ubicación</label>
                    <br />
                    <textarea v-model="ubication" id="ubication" class="form-control mb-3" cols="30"
                        rows="10"></textarea>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Input from "@/components/commons/Input.vue";
export default {
    components: {
        Input,
    },
    data() {
        return {
            cientificName: "",
            commonName: "",
            family: "",
            genus: "",
            description: "",
            ubication:[]
        };
    },
    mounted() { },
    computed: {},
    watch: {},
    methods: {}
};
</script>

<style scoped></style>
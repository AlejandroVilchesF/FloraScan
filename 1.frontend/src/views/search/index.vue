<template>
    <!-- Controles de Pestañas -->
    <div class="mt-2">
        <ul class="nav nav-tabs ms-2 border-bottom-0">
            <li class="nav-item">
                <a class="nav-link active" data-bs-toggle="tab" href="#species" role="tab" aria-controls="species"
                    aria-selected="true" @click="updateSearchField('familia')">Familias
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" id="genus-tab" data-bs-toggle="tab" href="#species" role="tab"
                    aria-controls="species" @click="updateSearchField('genero')" aria-selected="false">Generos
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" id="species-tab" data-bs-toggle="tab" href="#species" role="tab"
                    @click="updateSearchField('nombre_cientifico')" aria-controls="species"
                    aria-selected="false">Especies
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" id="species-tab" data-bs-toggle="tab" href="#labels" role="tab"
                    aria-controls="labels" aria-selected="false" @click="updateSearchField('etiquetas')">Etiquetas
                </a>
            </li>
        </ul>
    </div>
    <!-- Pestañas -->
    <div class="card p-2">
        <div class="tab-pane fade show active" id="species" role="species" aria-labelledby="species-tab"
            :class="searchField != 'etiquetas' ? 'd-block' : 'd-none'">
            <div class="row">
                <div class="col-12 mx-2 mt-1">
                    <p>Selecciona una de las pestañas de busqueda e introduce el nombre de una familia, genero o
                        especie.
                    </p>
                </div>
            </div>
            <!-- Busqueda -->
            <div class="row">
                <div class="m-2 col-md-6 col-12">
                    <div class="input-group">
                        <input ref="searchInput" type="text" v-model="keyWord" class="form-control"
                            placeholder="Búsqueda" aria-label="Búsqueda" aria-describedby="searchButton"
                            @input="clearError">
                        <button class="btn btn-outline-secondary" type="button" id="searchButton"
                            @click="searchPlants"><i class="bi bi-search"></i></button>
                    </div>
                </div>
                <div class="m-2 col-md-5 col-12 text-end">
                    <button class="btn btn-outline-success" type="button" id="searchButton" @click="showOptions"
                        data-bs-toggle="modal" data-bs-target="#optionsModal">
                        <i class="bi bi-binoculars"> Sugerencias</i>
                    </button>
                </div>
                <!-- Modal de sugerencias -->
                <Modal ref="optionsModal" id="optionsModal" :title="userModalTitle" :footer="false" :frameless="true"
                    :clase="'modal-sm'">
                    <template v-slot:modalBody>
                        <table class="table table-hover table-striped">
                            <thead>
                                <th v-if="searchField == 'familia'">Familias</th>
                                <th v-if="searchField == 'genero'">Generos</th>
                                <th v-if="searchField == 'nombre_cientifico'">Especies</th>
                            </thead>
                            <tbody>
                                <tr v-for="item in autocompleteOptions">
                                    <td @click="fillSearch(item)">{{ capitalize(item) }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </template>
                </Modal>
            </div>
            <div v-if="errorMessage != ''" class="bg-danger m-2 p-2 rounded">
                <p>{{ errorMessage }}</p>
            </div>
        </div>
        <!-- Labels Tab -->
        <div class="tab-pane fade m-2" id="labels" role="tabpanel" aria-labelledby="labels-tab"
            :class="searchField == 'etiquetas' ? 'd-block' : 'd-none'">
            <p>Selecciona una etiqueta para buscar todas las plantas que contienen la misma.</p>
            <ul class="list-inline">
                <li class="list-inline-item" v-for="label in labelList">
                    <span class="badge bg-primary" @click="plantsByLabel(label._id)">{{ label.nombre_etiqueta }}</span>
                </li>
            </ul>
        </div>
        <!-- Contenido -->
        <div class="row p-2" v-if="infoList.length > 0">
            <div class="tab-content" id="myTabContent">
                <!--Informacion Consulta-->
                <ul class="list-group mx-2">
                    <li class="list-group-item row" v-for="item in infoList">
                        <div class="row">
                            <div class="col-md-6 col-12 mt-1">
                                <img :src="img" class="img-fluid" style="width: 25%;"
                                    v-for="img in item.imagenes.slice(0, 4)">
                            </div>
                            <div class="col-md-6 col-12 mt-1">
                                <h6 class="plantName" @click="seeDetails(item.nombre_cientifico)">{{
                        capitalize(item.nombre_cientifico) }}</h6>
                                <ul class="list-group list-group-horizontal">
                                    <li class="list-group-item">
                                        <span class="plantInfo">Familia: </span><span class="text-muted">{{
                        capitalize(item.familia) }}</span>
                                    </li>
                                    <li class="list-group-item">
                                        <span class="plantInfo">Genero: </span><span class="text-muted">{{
                        capitalize(item.genero) }}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>



<script>
import Input from "@/components/commons/Input.vue";
import PlantService from "../../services/PlantService";
import Modal from "@/components/commons/Modal.vue";
import { usePlantStore } from "@/stores/PlantVuex";
import { useRouter } from 'vue-router';
import LabelService from "../../services/LabelService";

export default {
    components: {
        Input,
        Modal
    },
    data() {
        return {
            infoList: [],
            keyWord: "",
            searchField: "familia",
            errorMessage: "",
            autocompleteOptions: [],
            plantStore: usePlantStore(),
            router: useRouter(),
            labelList: []
        };
    },
    async mounted() {
        await this.retriveAutocompleteOptions();
        await this.retriveLabels();
    },
    computed: {
    },
    watch: {
        searchField: function (newVal, oldVal) {
            this.retriveAutocompleteOptions();
        }
    },
    methods: {
        updateSearchField(field) {
            this.searchField = field;
            this.keyWord = "";
            this.infoList = [];
        },
        async searchPlants() {
            this.infoList = [];
            if (this.keyWord.trim() != "") {
                try {
                    const response = await PlantService.findPlantByField(this.keyWord, this.searchField);
                    if (response.code == 2001) {
                        this.infoList = response.data;
                    }
                } catch (error) {
                    console.error(error);
                }
            } else {
                this.keyWord = "";
                this.errorMessage = "Debe introducir alguna palabra clave para realizar la busqueda";
            }
        },
        clearError() {
            this.errorMessage = "";
        },
        async retriveAutocompleteOptions() {
            this.autocompleteOptions = [];
            try {
                if (this.searchField != "etiquetas") {
                    let options = await PlantService.getNames(this.searchField);
                    options.data.forEach(el => {
                        this.autocompleteOptions.push(el[this.searchField]);
                    });
                    //Set auxiliar para eliminar los repetidos
                    let setAux = new Set(this.autocompleteOptions);
                    this.autocompleteOptions = Array.from(setAux);
                }
            } catch (error) {
                console.error(error);
            }
        },
        capitalize(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        },
        fillSearch(valor) {
            this.keyWord = valor;
            this.$refs.optionsModal.closeModal();
            this.clearError();
        },
        seeDetails(scientificName) {
            this.plantStore.setDetailSearch(scientificName);
            this.router.push({ name: "detalles" });
        },
        async retriveLabels() {
            try {
                const response = await LabelService.getAll();
                this.labelList = response.data;
            } catch (error) {
                console.error(error);
            }
        },
        async plantsByLabel(id) {
            this.infoList = [];
            try {
                const response = await PlantService.findPlantsByLabel(id);
                if (response.code == 2001) {
                    this.infoList = response.data;
                }
            } catch (error) {
                console.error(error);
            }
        }
    }
};
</script>

<style scoped>
.table-hover td {
    cursor: pointer;
}

.plantName {
    color: #5ec684;
    font-weight: bolder;
    font-size: x-large;
}

.plantName:hover {
    color: #5ec684cb;
    text-decoration: underline;
    cursor: pointer;
    transition: 0.3s;
}

.plantInfo {
    color: #5ec684;
    font-weight: bold;
}

.list-inline-item {
    cursor: pointer;
}

.list-inline-item>span:hover {
    background-color: #46cbc4 !important;
}
</style>
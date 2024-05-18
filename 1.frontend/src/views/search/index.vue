<template>
    <!-- Controles de Pestañas -->
    <div class="mt-2">
        <ul class="nav nav-tabs ms-2 border-bottom-0">
            <li class="nav-item">
                <a class="nav-link active" id="family-tab" data-bs-toggle="tab" href="#family" role="tab"
                    aria-controls="family" @click="updateSearchField('familia')" aria-selected="true">Familias
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" id="genus-tab" data-bs-toggle="tab" href="#genus" role="tab" aria-controls="genus"
                    @click="updateSearchField('genero')" aria-selected="false">Generos
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" id="species-tab" data-bs-toggle="tab" href="#species" role="tab"
                    @click="updateSearchField('nombre_cientifico')" aria-controls="species"
                    aria-selected="false">Especies
                </a>
            </li>
        </ul>
    </div>
    <!-- Pestañas -->
    <div class="card p-2">
        <div class="row">
            <div class="col-12 mx-2 mt-1">
                <p>Selecciona una de las pestañas de busqueda e introduce el nombre de una familia, genero o especie.
                </p>
            </div>
        </div>
        <!-- Busqueda -->
        <div class="row">
            <div class="m-2 col-md-6 col-12">
                <div class="input-group">
                    <input ref="searchInput" type="text" v-model="keyWord" class="form-control" placeholder="Búsqueda"
                        aria-label="Búsqueda" aria-describedby="searchButton" @input="clearError">
                    <button class="btn btn-outline-secondary" type="button" id="searchButton" @click="searchPlants"><i
                            class="bi bi-search"></i></button>
                </div>
            </div>
            <div class="m-2 col-md-5 col-12 text-end">
                <button class="btn btn-outline-success" type="button" id="searchButton" @click="showOptions"
                    data-bs-toggle="modal" data-bs-target="#optionsModal">
                    <i class="bi bi-binoculars"> Sugerencias</i>
                </button>
            </div>
            <!-- Modal de sugerencias -->
            <Modal ref="optionsModal" id="optionsModal" :title="userModalTitle" :footer="false" :frameless="true" :clase="'modal-sm'">
                <template v-slot:modalBody>
                    <table class="table table-striped">
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
        <div class="mx-2" v-if="infoList.length > 0">
            <hr />
        </div>
        <!-- Contenido -->
        <div class="row p-2 mt-3" v-if="infoList.length > 0">
            <div class="tab-content" id="myTabContent">
                <!--Informacion Consulta-->
            </div>
        </div>
        <div v-if="errorMessage != ''" class="bg-danger m-2 p-2 rounded">
            <p>{{ errorMessage }}</p>
        </div>
    </div>
</template>



<script>
import Input from "@/components/commons/Input.vue";
import PlantService from "../../services/PlantService";
import Modal from "@/components/commons/Modal.vue";


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
        };
    },
    mounted() {
        this.retriveAutocompleteOptions();
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
        },
        async searchPlants() {
            if (this.keyWord.trim() != "") {
                try {
                    const response = await PlantService.findPlantByField(this.keyWord, this.searchField);
                    this.infoList = response.data;
                    console.log(this.infoList);
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
            this.autocompleteOptions=[];
            try {
                let options = await PlantService.getNames(this.searchField);
                options.data.forEach(el => {
                    this.autocompleteOptions.push(el[this.searchField]);
                })
                console.log(this.autocompleteOptions);
            } catch (error) {
                console.error(error);
            }
        },
        capitalize(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        },
        fillSearch(valor){
            this.keyWord=valor;
            this.$refs.optionsModal.closeModal();
        }
    }
};
</script>

<style scoped></style>
<template>
    <div class="card my-2">
        <div class="card-header text-center">
            <h3 class="card-title mb-0">Bienvenido a FloraScan</h3>
        </div>
        <div class="card-body">
            <div class="row">
                <div class="col-md-6 col-12">
                    <p>El objetivo de este sitio es ser una enciclopedia de botánica, ofreciendo información detallada y
                        precisa sobre una amplia variedad de plantas.</p>
                    <p>
                        Queremos crear un recurso valioso para
                        estudiantes, investigadores y amantes de la naturaleza. Todas las contribuciones son
                        bienvenidas, ya que creemos que el conocimiento colectivo es la clave para una comprensión más
                        profunda y completa de la flora mundial
                    </p>
                </div>
                <div class="col-md-6 col-12">
                    <img src="@/assets/img/field.jpg" class="img-fluid rounded" alt="Campo de flores" />
                </div>
            </div>
            <hr />
            <div class="row">
                <div class="offset-4 col-4">
                    <router-link :to="{ name: 'login' }" class="routerLink">
                        <button class="btn btn-outline-success w-100">
                            <i class="bi bi-box-arrow-in-right"></i>
                             Iniciar Sesion
                        </button>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>




<script>
export default {
    data() {
        return {};
    },
    mounted() { },
    computed: {},
    watch: {},
    methods: {}
};
</script>

<style scoped></style>
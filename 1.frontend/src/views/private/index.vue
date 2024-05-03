<template>
    <div>
        <h1>RESTRINGIDO</h1>
        <input type="file" ref="fileInput">
        <button @click="getIdentification">Identificar</button>
    </div>
</template>



<script>
import DetectionService from "../../services/DetectionService";
export default {
    data() {
        return {};
    },
    mounted() { },
    computed: {},
    watch: {},
    methods: {
        getIdentification(){
            const fileInput = this.$refs.fileInput;
            const file = fileInput.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                const fileContent = event.target.result;
                const formData = new FormData();
                formData.append('fileName', file.name);
                formData.append('fileContent', fileContent);
                DetectionService.identify(formData);
            }

            reader.readAsDataURL(file);
        }
    }
};
</script>

<style scoped></style>
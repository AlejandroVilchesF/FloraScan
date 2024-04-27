<template>
    <div>
        <div class="d-flex justify-content-center align-items-center border border-2 mt-2 mb-0 text-center" style="width: 100%; min-height: 300px;">
            <div v-if="!content.b64URL">
                <button class="btn btn-primary" type="button" @click="simulateInputClick" v-if="!invalidFile">
                    <i class="fas fa-file"></i>
                    <span>{{ ' Select image' }}</span>
                </button>
                <h4 class="text-danger" v-if="invalidFile">
                    <i class="fas fa-warning"></i>
                    {{ ' IMAGE TOO BIG ' }}
                    <i class="fas fa-warning"></i>
                </h4>
            </div>
            <div v-else>
                <img class="img-fluid" :src="content.b64URL" :alt="id" :width="content.width">
            </div>
        </div>
        <div class="d-flex justify-content-between mb-4">
            <div class="row">
                <div class="col-auto pt-2">
                    <label for="width-input" class="me-2">Width:</label>
                    <input type="number" id="width-input" v-model="content.width" style="max-width: 100px;">
                </div>
                <div class="fw-bold cursor pointer p-2 border border-2 border-top-0 cursor-pointer col-auto" @click="restoreWidth" style="max-height: 43px;">
                    <i class="fas fa-rotate-left"></i>
                </div>
            </div>
            <span class="fw-bold cursor pointer p-2 border border-2 border-top-0 cursor-pointer text-danger" @click="removeImage" style="max-height: 43px;">
                <i class="fas fa-trash"></i>
            </span>
        </div>
        <span 
            class="border border-2 border-bottom-0 mb-0 px-2 rounded-top cursor-pointer pt-1" 
            :class="selectedLang == 'EN'? 'bg-primary text-white':''" 
            style="padding-bottom: 2px;" 
            @click="selectLang('EN')"
        >English</span>
        <span 
            class="border border-2 border-bottom-0 mb-0 px-2 rounded-top cursor-pointer pt-1" 
            :class="selectedLang == 'JP'? 'bg-primary text-white':''" 
            style="padding-bottom: 2px;" 
            @click="selectLang('JP')"
        >日本語</span>
        <div class="p-1 border" contenteditable="true" style="font-size: small;" @input="modifyFooter($event)">{{ content.imgFooter[selectedLang] }}</div>
        <input 
            :id="id" 
            :ref="id" 
            type="file" 
            accept=".jpg, .jpeg, .png" 
            @change="handleImageChange($event)"
            hidden="true"
        />
    </div>
</template>
  
  
<script>
export default {
    name: "Loader",
    props: {
        modelValue: {
            required: true
        },
        id: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            selectedLang: 'EN',
            file: null,
            invalidFile: false,
            originalWidth: null,
            content: {
                b64URL: null,
                width: null,
                imgFooter: {
                    'EN': '',
                    'JP': ''
                }
            }
        };
    },
    async mounted() {
        if(await this.isValidModelValue()){
            // If modelValule is valid
            this.content = this.modelValue
            this.originalWidth = this.content.width;
        }
    },
    computed: {},
    watch: {
        modelValue: async function(newVal, oldVal){
            if(await this.isValidModelValue()){
                // If modelValule is valid
                this.content = newVal
            }
        }
    },
    methods: {
        selectLang(lang){
            this.selectedLang = lang;
        },
        updateModelValue() {
            this.$emit("update:modelValue", this.content);
        },
        handleImageChange(event){
            const file = event.target.files[0];
            const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
            if (file && file.size <= maxSizeInBytes) {
                this.invalidFile = false;
                this.convertImageToBase64(file);
            }else{
                this.$refs[this.id].value = '';
                this.invalidFile = true;
                setTimeout(() => {
                    this.invalidFile = false;
                }, 3000)
            }
        },
        convertImageToBase64(file) {
            const reader = new FileReader();
            reader.onload = async () => {
                const image = new Image();
                image.src = reader.result;
                image.onload = () => {
                    this.content.b64URL = reader.result;
                    this.content.width = image.width;
                    this.originalWidth =  image.width;
                    this.updateModelValue();
                };
            };
            reader.readAsDataURL(file);
        },
        simulateInputClick(){
            this.$refs[this.id].click();
        },
        removeImage(){
            this.content.b64URL = null;
            this.content.width = null;
        },
        restoreWidth(){
            this.content.width = this.originalWidth;
        },
        modifyFooter(event){
            this.content.imgFooter[this.selectedLang] = event.target.textContent;
            this.updateModelValue();
        },
        isValidModelValue(){
            return new Promise(resolve => {
                // Inital assumption: modelValue is valid
                let isValid = true;
                if(this.modelValue === undefined || this.modelValue === null || Object.keys(this.modelValue).length === 0){
                    // modelValue must not be empty
                    isValid = false;
                }else if(!this.modelValue.hasOwnProperty('imgFooter') || !this.modelValue.imgFooter.hasOwnProperty('EN') || !this.modelValue.imgFooter.hasOwnProperty('JP')){
                    // imgFooter must not be empty and must contain two properties named 'EN' and 'JP'
                    isValid = false;
                }else if(!this.modelValue.hasOwnProperty('b64URL') || !this.modelValue.hasOwnProperty('width')){
                    // b64URL must not be empty and width must not be empty
                    isValid = false;
                }
                resolve(isValid);
            });
        }
    }
};
</script>
  
<style scoped>

</style>
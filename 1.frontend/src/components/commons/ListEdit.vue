<template>
    <div>
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
        <span 
            class="border border-2 border-bottom-0 mb-0 px-2 rounded-top cursor-pointer pt-1 ms-2 bg-danger" 
            style="padding-bottom: 2px;" 
            @click="selectColor('danger')"
        ></span>
        <span 
            class="border border-2 border-bottom-0 mb-0 px-2 rounded-top cursor-pointer pt-1 ms-2 bg-success" 
            style="padding-bottom: 2px;" 
            @click="selectColor('success')"
        ></span>
        <span 
            class="border border-2 border-bottom-0 mb-0 px-2 rounded-top cursor-pointer pt-1 ms-2 bg-primary" 
            style="padding-bottom: 2px;" 
            @click="selectColor('primary')"
        ></span>
        <span 
            class="border border-2 border-bottom-0 mb-0 px-2 rounded-top cursor-pointer pt-1 ms-2" 
            style="padding-bottom: 2px;" 
            @click="selectColor('default')"
        ></span>
        <ul class="list-group rounded-0 mb-0" :class="selectedLang == 'EN'? 'd-block':'d-none'">
            <li 
                v-for="(entry, index) in content.entries.EN" 
                v-bind:key="index" 
                class="list-group-item d-flex justify-content-start align-items-center"
                :class="selectedColor == 'default'? '':`list-group-item-${selectedColor}`"
            >
                <span class="badge bg-primary rounded-pill me-4">{{ index + 1 }}</span>
                <div
                    contenteditable="true"
                    class="h-100 w-100"
                    @input="modifyEntry($event, index)"
                >{{ entry }}</div>
            </li>
        </ul>
        <ul class="list-group rounded-0 mb-0" :class="selectedLang == 'JP'? 'd-block':'d-none'">
            <li 
                v-for="(entry, index) in content.entries.JP" 
                v-bind:key="index"  
                class="list-group-item d-flex justify-content-start align-items-center"
                :class="selectedColor == 'default'? '':`list-group-item-${selectedColor}`"
            >
                <span class="badge bg-primary rounded-pill me-4">{{ index + 1 }}</span>
                <div
                    contenteditable="true"
                    class="h-100 w-100"
                    @input="modifyEntry($event, index)"
                >{{ entry }}</div>
            </li>
        </ul>
        <div class="d-flex justify-content-end mb-4">
            <span style="padding-top: 7px;">
                <span class="fw-bold cursor pointer p-2 border border-2 border-top-0 cursor-pointer text-success" @click="addEntry">
                    <i class="fas fa-plus-circle"></i>
                    {{ ' entry' }}
                </span>
                <span class="fw-bold cursor pointer p-2 border border-2 border-top-0 border-start-0 cursor-pointer text-danger" @click="removeEntry">
                    <i class="fas fa-minus-circle"></i>
                    {{ ' entry' }}
                </span>
            </span>
        </div>
    </div>
</template>
  
  
<script>
export default {
    name: "ListEdit",
    props: {
        // modelValue ==> Vue3
        modelValue: {
            required: true,
        },
        id: {
            type: String,
            required: true,
        }
    },
    data() {
        return {
            selectedLang: 'EN',
            selectedColor: 'default',
            content: {
                entries: {
                    'EN': ['','','',''],
                    'JP': ['','','','']
                },
                color: 'default'
            }
        };
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
    async mounted() {
        if(await this.isValidModelValue()){
            // If modelValule is valid
            this.content = this.modelValue;
            this.selectedColor = this.content.color;
        }
    },
    methods: {
        selectLang(lang){
            this.selectedLang = lang;
        },
        selectColor(color){
            this.selectedColor = color;
            this.content.color = color;
            this.updateModelValue();
        },
        updateModelValue() {
            this.$emit("update:modelValue", this.content);
        }, 
        modifyEntry(event, index){
            this.content.entries[this.selectedLang][index] = event.target.textContent;
            this.updateModelValue();
        },
        addEntry(){
            this.content.entries[this.selectedLang].push('');
        },
        removeEntry(){
            if(this.content.entries[this.selectedLang].length == 1){
                return;
            }else{
                this.content.entries[this.selectedLang].pop();
                this.updateModelValue();
            }
        },
        isValidModelValue(){
            return new Promise(resolve => {
                // Inital assumption: modelValue is valid
                let isValid = true;
                if(this.modelValue === undefined || this.modelValue === null || Object.keys(this.modelValue).length === 0){
                    // modelValue must not be empty
                    isValid = false;
                }else if(!this.modelValue.hasOwnProperty('color') || !['danger', 'success', 'primary', 'default'].includes(this.modelValue.color)){
                    // color must not be empty and must be one of the 4 possible values
                    isValid = false;
                }else if(!this.modelValue.hasOwnProperty('entries') || !this.modelValue.entries.hasOwnProperty('EN') || !this.modelValue.entries.hasOwnProperty('JP')){
                    // entries must not be empty and must contain two properties named 'EN' and 'JP'
                    isValid = false;
                }else if(!Object.values(this.modelValue.entries).every(langArray => langArray.length > 0)){
                    // entries must not be empty for both languages
                    isValid = false;
                }
                resolve(isValid);
            });
        }
    }
};
</script>
  
<style scoped></style>
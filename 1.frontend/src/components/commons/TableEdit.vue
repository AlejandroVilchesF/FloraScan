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
        <div class="table-responsive" :class="selectedLang == 'EN'? 'd-block':'d-none'">
            <table class="table table-bordered mb-0" :class="selectedColor == 'default'? '':`table-${selectedColor}`">
                <thead>
                    <tr>
                        <th 
                            scope="col" v-for="(header, columnIndex) in content.columns.EN" 
                            v-bind:key="columnIndex"
                            :class="selectedColor == 'default'? '':`bg-${selectedColor} text-white`"
                        >
                            <div
                                contenteditable="true"
                                @input="modifyHeader($event, columnIndex)"
                            >{{ header }}</div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(row, rowIndex) in content.rows.EN" v-bind:key="rowIndex">
                        <td v-for="(cell, cellIndex) in row" v-bind:key="cellIndex">
                            <div
                                contenteditable="true"
                                @input="modifyCell($event, rowIndex, cellIndex)"
                            >{{ cell }}</div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="table-responsive" :class="selectedLang == 'JP'? 'd-block':'d-none'">
            <table class="table table-bordered mb-0" :class="selectedColor == 'default'? '':`table-${selectedColor}`">
                <thead>
                    <tr>
                        <th 
                            scope="col" 
                            v-for="(header, columnIndex) in content.columns.JP" 
                            v-bind:key="columnIndex"
                            :class="selectedColor == 'default'? '':`bg-${selectedColor} text-white`"
                        >
                            <div
                                contenteditable="true"
                                @input="modifyHeader($event, columnIndex)"
                            >{{ header }}</div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(row, rowIndex) in content.rows.JP" v-bind:key="rowIndex">
                        <td v-for="(cell, cellIndex) in row" v-bind:key="cellIndex">
                            <div
                                contenteditable="true"
                                @input="modifyCell($event, rowIndex, cellIndex)"
                            >{{ cell }}</div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="d-flex justify-content-between mb-4">
            <span style="padding-top: 7px;">
                <span class="fw-bold cursor pointer p-2 border border-2 border-top-0 cursor-pointer text-success" @click="addRow">
                    <i class="fas fa-plus-circle"></i>
                    {{ ' row' }}
                </span>
                <span class="fw-bold cursor pointer p-2 border border-2 border-top-0 border-start-0 cursor-pointer text-danger" @click="removeRow">
                    <i class="fas fa-minus-circle"></i>
                    {{ ' row' }}
                </span>
            </span>
            <span style="padding-top: 7px;">
                <span class="fw-bold cursor pointer p-2 border border-2 border-top-0 cursor-pointer text-success" @click="addCol">
                    <i class="fas fa-plus-circle"></i>
                    {{ ' col' }}
                </span>
                <span class="fw-bold cursor pointer p-2 border border-2 border-top-0 border-start-0 cursor-pointer text-danger" @click="removeCol">
                    <i class="fas fa-minus-circle"></i>
                    {{ ' col' }}
                </span>
            </span>
        </div>
        <div class="p-1 border" contenteditable="true" style="font-size: small;" @input="modifyCaption($event)">{{ content.caption[selectedLang] }}</div>
    </div>
</template>

<script>
export default {
  name: "Text",
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
            // default content
            columns: {
                'EN': ['', '', '', ''],
                'JP': ['', '', '', '']
            },
            rows: {
                'EN': [
                    ['', '', '', ''],
                    ['', '', '', ''],
                    ['', '', '', ''],
                    ['', '', '', '']
                ],
                'JP': [
                    ['', '', '', ''],
                    ['', '', '', ''],
                    ['', '', '', ''],
                    ['', '', '', '']
                ]
            },
            caption: {
                'EN': '',
                'JP': ''
            },
            color: 'default'
        }
    };
  },
  async mounted() {
    if(await this.isValidModelValue()){
        // If modelValule is valid
        this.content = this.modelValue
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
    modifyHeader(event, columnIndex){
        this.content.columns[this.selectedLang][columnIndex] = event.target.textContent;
        this.updateModelValue();
    },
    modifyCell(event, rowIndex, cellIndex){
        this.content.rows[this.selectedLang][rowIndex][cellIndex] = event.target.textContent;
        this.updateModelValue();
    },
    addRow(){
        this.content.rows[this.selectedLang].push(new Array(this.content.columns[this.selectedLang].length).fill(''));
        this.updateModelValue();
    },
    removeRow(){
        if(this.content.rows[this.selectedLang].length == 1){
            return;
        }else{
            this.content.rows[this.selectedLang].pop();
            this.updateModelValue();
        }
    },
    addCol(){
        if(this.content.columns[this.selectedLang].length == 15){
            return;
        }else{
            this.content.columns[this.selectedLang].push('');
            for(const row of this.content.rows[this.selectedLang]){
                row.push('');
            }
            this.updateModelValue();
        }
    },
    removeCol(){
        if(this.content.columns[this.selectedLang].length == 1){
            return;
        }else{
            this.content.columns[this.selectedLang].pop();
            for(const row of this.content.rows[this.selectedLang]){
                row.pop();
            }
            this.updateModelValue();
        }
    },
    selectColor(color){
        this.selectedColor = color;
        this.content.color = color;
        this.updateModelValue();
    },
    modifyCaption(event){
        this.content.caption[this.selectedLang] = event.target.textContent;
        this.updateModelValue();
    },
    loadContent(content){
        this.content = content;
    },
    isValidModelValue(){
        return new Promise(resolve => {
            // Inital assumption: modelValue is valid
            let isValid = true;
            if(this.modelValue === undefined || this.modelValue === null || Object.keys(this.modelValue).length === 0){
                // modelValue must not be empty
                isValid = false;
            }else if(!this.modelValue.hasOwnProperty('caption') || !this.modelValue.caption.hasOwnProperty('EN') || !this.modelValue.caption.hasOwnProperty('JP')){
                // caption must not be empty and must contain two properties named 'EN' and 'JP'
                isValid = false;
            }else if(!this.modelValue.hasOwnProperty('color') || !['danger', 'success', 'primary', 'default'].includes(this.modelValue.color)){
                // color must not be empty and must be one of the 4 possible values
                isValid = false;
            }else if(!this.modelValue.hasOwnProperty('columns') || !this.modelValue.columns.hasOwnProperty('EN') || !this.modelValue.columns.hasOwnProperty('JP')){
                // columns must not be empty and must contain two properties named 'EN' and 'JP'
                isValid = false;
            }else if(!this.modelValue.hasOwnProperty('rows') || !this.modelValue.rows.hasOwnProperty('EN') || !this.modelValue.rows.hasOwnProperty('JP')){
                // rows must not be empty and must contain two properties named 'EN' and 'JP'
                isValid = false;
            }else if(!Object.values(this.modelValue.columns).every(langArray => langArray.length > 0)){
                // columns must not be empty for both languages
                isValid = false;
            }else if(!Object.values(this.modelValue.rows).every(langArray => langArray.length > 0)){
                // rows must not be empty for both languages
                isValid = false
            }else{
                // EN columns length
                let enColumnsLength = this.modelValue.columns['EN'].length;
                // JP columns length
                let jpColumnsLength = this.modelValue.columns['JP'].length;
                if(!Object.values(this.modelValue.rows['EN']).every(row => row.length == enColumnsLength)){
                    // All EN rows length must be equal to EN columns length
                    isValid = false;
                }
                if(!Object.values(this.modelValue.rows['JP']).every(row => row.length == jpColumnsLength)){
                    // All JP rows length must be equal to JP columns length
                    isValid = false;
                }
            }
            resolve(isValid);
        });
    }
  }
};
</script>

<style scoped>

</style>
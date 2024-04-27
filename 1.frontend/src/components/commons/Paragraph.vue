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
        <div 
            v-html="modelValue.enText"
            :id="`p-en-${id}`"
            contenteditable="true"
            :style="`font-size: ${fontSize};`"
            class="p-4 border border-2 mt-0"
            :class="selectedLang == 'EN'? 'd-block':'d-none'"
            ref="editableDivEn"
            @blur="updateModelValue"
            @paste="checkPaste($event)"
        >
        </div>
        <div 
            v-html="modelValue.jpText"
            :id="`p-jp-${id}`"
            contenteditable="true"
            :style="`font-size: ${fontSize};`"
            class="p-4 border border-2 mt-0"
            :class="selectedLang == 'JP'? 'd-block':'d-none'"
            ref="editableDivJp"
            @blur="updateModelValue"
            @paste="checkPaste($event)"
        >
        </div>
        <div class="d-flex justify-content-end">
            <span>
                <i 
                    class="fas fa-font cursor pointer p-2 border border-2 border-end-0 border-top-0 cursor-pointer"
                    :class="selectedColor == 'default'? '':`text-${selectedColor}`"
                    data-bs-toggle="dropdown"
                    data-bs-auto-close="inside"
                    aria-expanded="false"
                    ref="dropdownToggle"
                    focusable="true"
                    @click="triggerClick"
                ></i>
                <ul class="dropdown-menu" ref="dropdownMenu">
                    <li><a class="dropdown-item" href="#" @click="changeColor('default')">Default</a></li>
                    <li><a class="dropdown-item text-danger" href="#" @click="changeColor('danger')">Red</a></li>
                    <li><a class="dropdown-item text-success" href="#" @click="changeColor('success')">Green</a></li>
                    <li><a class="dropdown-item text-warning" href="#" @click="changeColor('warning')">Yellow</a></li>
                    <li><a class="dropdown-item text-primary" href="#" @click="changeColor('primary')">Blue</a></li>
                    <li><a class="dropdown-item text-info" href="#" @click="changeColor('info')">Cyan</a></li>
                    <li><a class="dropdown-item text-secondary" href="#" @click="changeColor('secondary')">Grey</a></li>
                </ul>
                <i class="fas fa-bold fw-bold cursor pointer p-2 border border-2 border-top-0 cursor-pointer" @click="addHtml('b')"></i>
                <i class="fas fa-italic cursor pointer p-2 border border-2 border-start-0 border-top-0 cursor-pointer" @click="addHtml('i')"></i>
                <i class="fas fa-underline cursor pointer p-2 border border-2 border-start-0 border-top-0 cursor-pointer" @click="addHtml('u')"></i>
                <i class="fas fa-link cursor pointer p-2 border border-2 border-start-0 border-top-0 cursor-pointer" @click="linkURLs()"></i>
            </span>
        </div>
    </div>
</template>

<script>
export default {
    name: "Text",
    props: {
        // modelValue ==> Vue3
        modelValue: {
            required: true
        },
        id: {
            type: String,
            required: true,
        },
        fontSize: {
            type: String,
            default: '16px'
        }
    },
    data() {
        return {
            selectedLang: 'EN',
            selectedColor: 'default'
        };
    },
    computed: {},
    watch: {},
    methods: {
        updateModelValue() {
            let emitValue = {
                enText: this.$refs.editableDivEn.innerHTML,
                jpText: this.$refs.editableDivJp.innerHTML
            }
            this.$emit("update:modelValue", emitValue);
        }, 
        selectLang(lang){
            this.selectedLang = lang;
        },
        changeColor(color){
            this.selectedColor = color;
            this.addHtml();
        },
        addHtml(add){
            const editableDiv = this.selectedLang == 'EN'? this.$refs.editableDivEn : this.$refs.editableDivJp;
            if(!add && this.selectedColor != 'default'){
                editableDiv.innerHTML = `${editableDiv.innerHTML}<span class="text-${this.selectedColor}">&nbsp;</span>`;
            }else if(!add && this.selectedColor == 'default'){
                editableDiv.innerHTML = `${editableDiv.innerHTML}<span>&nbsp;</span>`;
            }else{
                editableDiv.innerHTML = `${editableDiv.innerHTML}<${add}>&nbsp;</${add}>`;
            }
            this.updateModelValue();
        },
        linkURLs() {
            const editableDiv = this.selectedLang == 'EN'? this.$refs.editableDivEn : this.$refs.editableDivJp;
            const regexURL = /(^|[^<a>"])(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
            editableDiv.innerHTML = editableDiv.innerHTML.replace(regexURL, function(match, prevChar, url) {
                if (prevChar === '<' || prevChar === '"' || prevChar === "a>") {
                    return match;
                } else {
                    return prevChar + '<a href="' + url + '" target="_blank">' + url + '</a>';
                }
            });
            this.updateModelValue();
        },
        triggerClick(){
            setTimeout(()=>{
                this.$refs.dropdownMenu.addEventListener('click', this.clickHandler);
            },10);
        },
        clickHandler(){
            // Handler executes twice
            this.$refs.dropdownToggle.click();
            this.removeTrigerClick();
        },
        removeTrigerClick(){
            setTimeout(()=>{
                this.$refs.dropdownMenu.removeEventListener('click', this.clickHandler);
            },10);
        },
        /**
         * Prevents from pasting pre-formatted text
         * @param {ClipboardEvent} event Paste event
         */
         checkPaste(event){
            event.preventDefault();
            let plainText = event.clipboardData.getData('text/plain');
            document.execCommand('insertText', false, plainText);
        }
    }
};
</script>

<style scoped>

</style>
<template>
    <div>
      <span 
          class="border border-2 border-bottom-0 mb-0 px-2 rounded-top cursor-pointer pt-1" 
          :class="selectedLang == 'EN'? 'bg-primary text-white':''" 
          style="padding-bottom: 3px;" 
          @click="selectLang('EN')"
      >English</span>
      <span 
          class="border border-2 border-bottom-0 mb-0 px-2 rounded-top cursor-pointer pt-1" 
          :class="selectedLang == 'JP'? 'bg-primary text-white':''" 
          style="padding-bottom: 3px;" 
          @click="selectLang('JP')"
      >日本語</span>
      <textarea
          :value="modelValue.enText"
          :id="`txt-en-${id}`"
          :rows="rows"
          :maxlength="maxlength"
          :placeholder="enPlaceholder"
          :wrap="wrap"
          :style="`font-size: ${fontSize};`"
          class="col-12"
          :class="selectedLang == 'EN'? 'd-block':'d-none'"
          ref="enTextarea"
          @input="updateModelValue"
      ></textarea>
      <textarea
          :value="modelValue.jpText"
          :id="`txt-jp-${id}`"
          :rows="rows"
          :maxlength="maxlength"
          :placeholder="jpPlaceholder"
          :wrap="wrap"
          :style="`font-size: ${fontSize};`"
          class="col-12"
          :class="selectedLang == 'JP'? 'd-block':'d-none'"
          ref="jpTextarea"
          @input="updateModelValue"
      ></textarea>
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
    },
    rows: {
      type: Number,
      default: 1
    },
    maxlength:{
      type: Number
    },
    enPlaceholder: {
      type: String,
      default: 'Insert text'
    },
    jpPlaceholder: {
      type: String,
      default: 'テキストを入れて'
    },
    wrap: {
      type: String,
      default: 'soft'
    },
    fontSize: {
      type: String,
      default: '16px'
    }
  },
  data() {
    return {
      selectedLang: 'EN'
    };
  },
  computed: {},
  watch: {},
  methods: {
    selectLang(lang){
      this.selectedLang = lang;
    },
    updateModelValue() {
      let emitValue = {
        enText: this.$refs.enTextarea.value,
        jpText: this.$refs.jpTextarea.value
      }
      this.$emit("update:modelValue", emitValue);
    }, 
  }
};
</script>

<style scoped>

</style>


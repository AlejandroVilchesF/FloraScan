<template>
  <div class="form-group">
    <label :for="`i-${id}`" class="form-label" v-if="showLabel">{{ label }}</label>
    <div class="input-group input-group-md mb-3">
      <span class="input-group-text" :class="iconReactive ? '' : 'd-none'">
        <i :class="icon"></i><sup class="fw-bold">{{supText}}</sup>
      </span>
      <input
        :value="modelValue"
        :id="`i-${id}`"
        :type="type"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :minlength="minlength"
        :icon="icon"
        :autocomplete="autocomplete"
        :list="list"
        :pattern="pattern"
        :title="title"
        :min="min"
        :max="max"
        :step="step"
        :maxlength="maxlength"
        class="form-control"
        :class="`${additionalClass} ${notRoundedEnd? '':'rounded-end'}`"
        @input="(event) => $emit('update:modelValue', event.target.value)"
        @focus="emitFocus($event)"
        @blur="emitBlur($event)"
      />
      <slot name="message" class="mt-0 pt-0"></slot>
      <div class="invalid-feedback">{{ invalid }}</div>
    </div>
  </div>
</template>


<script>
export default {
  name: "Input",
  props: {
    // modelValue ==> Vue3
    modelValue: {
      required: true,
    },
    id: {
      required: true,
    },
    type: {
      type: String,
      default: "text",
    },
    label: {
      type: String,
      default: "...",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: "...",
    },
    invalid: {
      type: String,
      default: "Invalid field",
    },
    required: {
      type: Boolean,
      default: false,
    },
    minlength: {
      type: Number,
      default: null,
    },
    maxlength: {
      type: Number,
      default: null
    },
    icon: {
      type: String,
      default: "none",
    },
    autocomplete: {
      type: String,
      default: "off",
    },
    list: {
      type: String,
      default: "",
    },
    pattern: {
      type: String,
      default: null,
    },
    title: {
      type: String,
      default: "",
    },
    min: {
      type: Number,
      default: null
    },
    max: {
      type: Number,
      default: null
    },
    step:{
      type: Number,
      default: 1
    },
    supText: {
      type: String,
      default: ""
    },
    additionalClass: {
      type: String,
      default: null
    },
    showLabel: {
      type: Boolean,
      default: true
    },
    notRoundedEnd: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showIcon: false,
    };
  },
  computed: {
    iconReactive: function () {
      return this.icon;
    },
  },
  watch: {
    iconReactive: function (val) {
      if (val == "none") {
        return false;
      } else {
        return true;
      }
    },
  },
  methods: {
    emitFocus(e){
      this.$emit("focus", e);
    },
    emitBlur(e){
      this.$emit("blur", e);
    }
  }
};
</script>

<style scoped>
.form-label {
  font-size: 0.875rem;
  font-weight: 500;
}
</style>

<style lang="scss">
@include color-mode(dark) {
  .form-label  {
    color: var(--bs-primary-text-emphasis);
  }
}
</style>
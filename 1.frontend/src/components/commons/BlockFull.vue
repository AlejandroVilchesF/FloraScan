<template>
  <div class="card">
    <div class="row card-header align-items-center" v-if="title">
      <div :class="`col-${titleCol}`">
        <h5 class="card-title mb-0">{{ title }}<slot name="title-addon"></slot></h5>
      </div>
      <div class="col">
        <slot name="options"></slot>
      </div>
    </div>
    <div class="card-body" :class="claseBody">
      <div class="row" style="padding:0 10px 0 10px;">
        <!-- SLOT -->
        <slot name="content"></slot>
        <!-- SLOT -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "BlockFull",
  props: {
    title: {
      type: String,
      default: null,
    },
    claseBody: {
      type: String
    },
    titleCol: {
      type: Number,
      default: 8
    }
  },
};
</script>

<style scoped>
.card {
  max-width: initial !important;
}
.card-title{
  font-size: .925rem;
  font-weight: 600;
}
</style>
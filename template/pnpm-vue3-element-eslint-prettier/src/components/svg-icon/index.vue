<template>
  <svg class="svg-icon" aria-hidden="true">
    <use :href="symbolId" :fill="color" />
  </svg>
</template>

<script setup>
const props = defineProps({
  dir: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
  },
})
const symbolId = computed(() => `#svg_${props.dir}_${props.name}`)
</script>

<style lang="sass" scoped>
.svg-icon
  width: 1em
  height: 1em
  fill: currentColor
  vertical-align: text-bottom
</style>

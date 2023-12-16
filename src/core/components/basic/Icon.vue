<script setup>
import { computed } from 'vue'

const props = defineProps({
  path: {
    type: String,
    required: true
  },
  w: {
    type: String,
    default: 'w-6'
  },
  h: {
    type: String,
    default: 'h-6'
  },
  size: {
    type: [String, Number],
    default: 16
  },
  color: {
    type: String,
    default: 'white'
  }
})

const spanClass = computed(() => `inline-flex justify-center items-center ${props.w} ${props.h}`)
const iconColor = computed(() => `inline-block text-${props.color}`)
</script>

<template>
  <span :class="spanClass">
    <svg
      viewBox="0 0 24 24"
      :width="size"
      :height="size"
      :class="iconColor"
    >
      <path
        fill="currentColor"
        :d="path"
      />
    </svg>
  </span>
</template>

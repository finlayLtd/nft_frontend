<script setup>
import { computed } from 'vue'

const props = defineProps({
  to: {
    type: String,
    default: null
  }
})

const is = computed(() => {
  if (props.to) {
    return 'router-link'
  }

  return 'div'
})
</script>

<template>
  <component
    :is="is"
    class="flex transition items-center grow-0 shrink-0 relative cursor-pointer text-white py-2 px-2.25"
    :to="to"
  >
    <slot />
  </component>
</template>

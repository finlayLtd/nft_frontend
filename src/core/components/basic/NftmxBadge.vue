<script setup>
import { computed } from "vue";

const props = defineProps({
  value: Number,
  anim: Boolean,
  active: Boolean,
});

const badgeW = computed(() => 10 + props.value.toFixed().length * 5 + "px");
</script>

<template>
  <span
    :class="[
      anim
        ? 'bg-primary-900 text-white font-ibm'
        : active
        ? 'bg-primary-900 text-tertiary-900'
        : 'bg-white text-tertiary-900 font-ibm-bold',
      'relative inline-block py-0.75 px-1.25 leading-none text-center whitespace-nowrap align-top text-11 rounded-full',
    ]"
  >
    {{ value }}
    <span
      v-if="anim"
      class="animate-ping absolute h-4 rounded-full bg-primary-400 top-0 left-0 -z-10"
      :style="{ width: badgeW }"
    />
  </span>
</template>

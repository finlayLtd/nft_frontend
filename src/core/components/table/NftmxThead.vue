<script setup>
defineProps({
  border: {
    type: Boolean,
    default: true,
  },
});
</script>

<template>
  <thead class="text-tertiary-400 font-ibm-light">
    <slot />
  </thead>
</template>

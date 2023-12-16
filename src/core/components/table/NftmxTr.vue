<script setup>
defineProps({
  border: {
    type: Boolean,
    default: true,
  },
});
</script>

<template>
  <tr class="divide-x divide-black">
    <slot />
  </tr>
</template>

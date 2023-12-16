<script setup>
defineProps({
  border: {
    type: Boolean,
    default: true,
  },
});
</script>

<template>
  <td :class="['p-4 whitespace-nowrap']">
    <slot />
  </td>
</template>

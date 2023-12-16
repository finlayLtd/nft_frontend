<script setup>
defineProps({
  border: {
    type: Boolean,
    default: true,
  },
  first: Boolean,
});
</script>

<template>
  <th :class="[first ? 'pl-5.5' : 'pl-4', 'py-2 pr-4 w-max']">
    <slot />
  </th>
</template>

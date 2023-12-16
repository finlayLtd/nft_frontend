<script setup>
defineProps({
  title: String,
  active: Boolean,
  disabled: Boolean,
});
</script>

<template>
  <button
    :disabled="disabled"
    :class="[
      active
        ? 'bg-primary-900 border-primary-900 shadow-default shadow-primary-900'
        : 'border-black',
      disabled
        ? 'cursor-not-allowed text-tertiary-400'
        : 'hover:bg-primary-900 hover:border-primary-900 hover:shadow-default hover:shadow-primary-900 text-white',
      'transition border h-11.25 text-left px-3',
    ]"
  >
    {{ title }}
  </button>
</template>

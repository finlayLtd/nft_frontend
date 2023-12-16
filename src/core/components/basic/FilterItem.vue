<script setup>
defineProps({
  title: String,
  active: Boolean,
});
</script>

<template>
  <div
    :class="[
      active ? 'text-primary-900' : 'text-white',
      'font-ibm text-11 hover:text-primary-900 transition cursor-pointer py-1',
    ]"
  >
    {{ title }}
  </div>
</template>

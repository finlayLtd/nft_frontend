<script setup>
import { ref } from "vue";

defineProps({
  value: String,
});

const close = ref(false);
</script>

<template>
  <div
    @mouseover="close = true"
    @mouseout="close = false"
    class="relative transition cursor-pointer font-ibm-medium tracking-widest text-xs px-3 pt-2 pb-1.75 w-fit text-white bg-tertiary-700 hover:bg-primary-900"
  >
    #{{ value }}
    <div
      :class="[
        close ? 'opacity-100' : 'opacity-0',
        'w-3.5 h-3.5 rounded-full bg-red-900 absolute -right-1.5 -top-1.5 flex justify-center items-center',
      ]"
    >
      <font-awesome-icon :icon="['fas', 'times']" class="text-10" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  limitHeight: { type: Boolean, default: true },
});
</script>

<template>
  <div class="overflow-x-auto">
    <div class="w-full min-w-fit">
      <table class="w-full divide-y divide-black font-ibm text-white">
        <slot />
      </table>
    </div>
  </div>
</template>

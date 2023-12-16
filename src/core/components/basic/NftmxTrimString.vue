<script setup>
defineProps({
  line: {
    type: Number,
    default: 1,
  },
});
</script>

<template>
  <div class="truncated" :style="{ '-webkit-line-clamp': line }">
    <slot />
  </div>
</template>

<style scoped>
.truncated {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-wrap: "break-word";
  word-break: break-all;
}
</style>

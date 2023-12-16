<template>
  <component :is="tag" class="h-full relative">
    <button
      @click="$emit('remove', file)"
      class="text-4xl absolute right-2 transition text-white hover:text-red-900"
    >
      &times;
    </button>
    <img
      :src="file.url"
      :alt="file.file.name"
      :title="file.file.name"
      class="w-full h-full object-cover object-center"
    />
  </component>
</template>

<script setup>
defineProps({
  file: { type: Object, required: true },
  tag: { type: String, default: "div" },
});

defineEmits(["remove"]);
</script>

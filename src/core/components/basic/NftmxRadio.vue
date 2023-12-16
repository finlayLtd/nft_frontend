<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  active: Boolean,
  size: { type: String, default: "base" },
});

const radioSize = {
  base: "w-6.25 h-6.25 border-2",
  sm: "w-4.75 h-4.75 border",
};
const activeSize = {
  base: "w-3.25 h-3.25",
  sm: "w-2.25 h-2.25",
};

const radio = ref(false);
const radioActive = computed(() => (props.active ? true : radio.value));
</script>

<template>
  <div
    :class="[
      radioSize[size],
      ' rounded-full border-black flex justify-center items-center cursor-pointer',
    ]"
    @mouseover="radio = true"
    @mouseout="radio = false"
  >
    <div
      :class="[
        radioActive ? 'bg-primary-900' : '',
        activeSize[size],
        ' rounded-full transition',
      ]"
    />
  </div>
</template>

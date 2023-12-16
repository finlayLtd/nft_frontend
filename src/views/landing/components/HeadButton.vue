<script setup>
import NftmxButton from "@/core/components/basic/NftmxButton.vue";
import { computed } from "vue";
const colors = {
  primary:
    "text-primary-900 border-primary-900 hover:bg-primary-900 shadow-primary-900",
  secondary: "text-secondary-700 border-secondary-700 hover:bg-secondary-700 shadow-secondary-700",
};

const props = defineProps({
  to: String,
  color: String,
  label: String,
});
const is = computed(() => {
  if (props.to) {
    return "router-link";
  }

  return "button";
});
const componentClass = computed(() => {
  const base = [
    "inline-flex",
    "cursor-pointer",
    "justify-center",
    "items-center",
    "transition",
    "w-36 sm:w-full max-w-md",
    "text-sm sm:text-lg",
    "h-12.5 sm:h-15",
    "leading-4",
    "border-4",
    "font-press",
    "hover:text-white",
    "shadow-[0_0px_12px_0px_rgb(0_0_0_/_0.1),_0_0px_0px_0px_rgb(0_0_0_/_0.1);]",
    colors[props.color],
  ];

  return base;
});
</script>

<template>
  <component :is="is" :to="to" :class="componentClass">
    <div
      :class="[
        color === 'primary' ? 'shadow-primary-900' : 'shadow-secondary-900',
        'w-full h-full flex justify-center items-center shadow-[inset_0_0px_12px_0px_rgb(0_0_0_/_0.1),_0_0px_0px_0px_rgb(0_0_0_/_0.1);]',
      ]"
    >
      {{ label }}
    </div>
  </component>
</template>

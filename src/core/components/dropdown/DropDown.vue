<script setup>
import { ref } from "vue";
import BasicAccordion from "@/core/components/accordion/BasicAccordion.vue";

defineProps({
  title: String,
  big: Boolean,
  icon: {
    type: Boolean,
    default: true,
  },
});

const open = ref(false);
const onClickOutside = () => {
  open.value = false;
};
const handleClick = () => {
  open.value = !open.value;
};
</script>

<template>
  <div v-click-outside="onClickOutside">
    <basic-accordion
      :border="false"
      sidebar
      v-model="open"
      @handle-click="handleClick"
      handleEmit
      :icon="icon"
    >
      <template v-slot:caption>
        <slot name="header" />
      </template>
      <div @click="onClickOutside">
        <slot name="body" />
      </div>
    </basic-accordion>
  </div>
</template>

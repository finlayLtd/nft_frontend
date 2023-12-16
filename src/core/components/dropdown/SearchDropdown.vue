<script setup>
import { ref } from "vue";
import Accordion from "@/core/components/accordion/BasicAccordion.vue";

defineProps({
  title: String,
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
  <div
    class="border border-black pr-3 absolute w-full bg-tertiary-800"
    v-click-outside="onClickOutside"
  >
    <accordion
      :border="false"
      :sidebar="true"
      v-model="open"
      @handle-click="handleClick"
      handleEmit
      class="w-full"
    >
      <template v-slot:caption>
        <div class="flex items-center w-full">
          <div class="flex-1 text-xs font-ibm-medium pt-2.25 pb-2 px-3.5">
            {{ title }}
          </div>
        </div>
      </template>
      <div class="grid pt-2 gap-2.5 justify-between text-xs pb-6">
        <slot name="content" />
      </div>
    </accordion>
  </div>
</template>

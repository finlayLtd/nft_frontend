<script setup>
import { ref } from "vue";
import Accordion from "@/core/components/accordion/BasicAccordion.vue";

defineProps({
  title: String,
  small: Boolean,
  big: Boolean,
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
    :class="[big ? 'border-2 pr-5' : 'border pr-3', 'border-black']"
    v-click-outside="onClickOutside"
  >
    <accordion
      :border="false"
      :sidebar="true"
      v-model="open"
      @handle-click="handleClick"
      handleEmit
    >
      <template v-slot:caption>
        <div class="flex items-center">
          <div
            :class="[
              small
                ? 'py-2.25 px-3.5'
                : big
                ? 'py-3.75 px-5'
                : 'pt-3.25 pb-3.75 px-3.5',
              'flex-1 text-sm font-ibm',
            ]"
          >
            {{ title }}
          </div>
        </div>
      </template>
      <div @click="onClickOutside" class="grid gap-2.5 text-xs pb-4">
        <slot name="content" />
      </div>
    </accordion>
  </div>
</template>

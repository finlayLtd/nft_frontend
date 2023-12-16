<script setup>
import { ref } from "vue";
import Accordion from "@/core/components/accordion/BasicAccordion.vue";

defineProps({
  title: String,
});
</script>

<template>
  <accordion :border="false" :sidebar="true" class="w-full">
    <template v-slot:caption>
      <div class="flex items-center w-full">
        <div class="flex-1 text-13 font-ibm-medium pt-4.25 pb-4 mr-4 h-13">
          {{ title }}
        </div>
      </div>
    </template>
    <slot name="content" />
  </accordion>
</template>

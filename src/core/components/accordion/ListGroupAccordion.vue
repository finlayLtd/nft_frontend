<script setup>
import Accordion from "@/core/components/accordion/BasicAccordion.vue";
import { ref } from "@vue/reactivity";
import ListGroupItem from "@/core/components/basic/ListGroupItem.vue";

defineProps({
  title: String,
  active: Boolean,
  open: Boolean,
});
</script>

<template>
  <accordion :border="false" :sidebar="true" :value="open">
    <template v-slot:caption>
      <list-group-item :active="active">{{ title }}</list-group-item>
    </template>
    <div class="flex flex-col">
      <slot />
    </div>
  </accordion>
</template>

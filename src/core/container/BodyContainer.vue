<script setup>
import NavBarSearch from "@/core/components/search/NavBarSearch.vue";
import { ref } from "vue";
import NftmxFooter from "./NftmxFooter.vue";

defineProps({
  searchAble: {
    type: Boolean,
    default: false,
  },
  padding: {
    type: Boolean,
    default: true,
  },
  footerExtended: Boolean,
  top: Boolean,
});

const footerHeight = ref(0);
const handleFooter = (value) => {
  footerHeight.value = value;
};
</script>

<template>
  <nav-bar-search v-if="searchAble"></nav-bar-search>
  <div
    :class="[
      padding ? 'px-5 sm:px-10 md:px-16 xl:px-22 py-4' : '',
      'bg-tertiary-900 font-ibm cursor-default',
    ]"
    :style="{ paddingBottom: footerHeight + 'px' }"
  >
    <div class="max-w-8xl mx-auto">
      <slot />
    </div>
  </div>
  <nftmx-footer
    :extend="footerExtended"
    @handle-footer="handleFooter"
    :top="top"
  />
</template>

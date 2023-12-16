<script setup>
import NftmxImg from "@/core/components/basic/NftmxImg.vue";
import { ref } from "vue";

const props = defineProps({
  collection: Object,
});

const showButton = ref(false);
</script>

<template>
  <div
    class="py-1.5 transition hover:text-primary-900 cursor-pointer flex justify-between items-center"
    @mouseover="showButton = true"
    @mouseout="showButton = false"
  >
    <div class="flex gap-4 items-center">
      <nftmx-img :src="collection.imageUrl" class="w-5 h-5 object-cover" />
      {{ collection.name }}
    </div>
    <div :class="[showButton ? '' : 'hidden']">
      <button class="px-1.5 text-10 text-white bg-primary-900">CHOOSE</button>
    </div>
  </div>
</template>

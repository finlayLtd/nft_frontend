<script setup>
import { onMounted, ref } from "vue";
import BundleImage from "./BundleImage.vue";
import NftmxImg from "./NftmxImg.vue";
import { defaultImg } from "@/core/config/constant";

const props = defineProps({
  images: [String, Array],
  grid: {
    type: String,
    default: "col",
  },
});

const randomCount = Math.round(Math.random() * (props.images.length - 2)) + 1;
</script>

<template>
  <div class="w-full h-full text-6xl">
    <div class="w-full h-full" v-if="typeof images === 'string'">
      <nftmx-img :src="images" class="w-full h-full object-cover" />
    </div>
    <div v-else class="w-full h-full">
      <div
        v-if="images.length > 1"
        :class="[
          'w-full h-full grid divide-tertiary-900',
          grid === 'col' ? 'grid-cols-2 divide-x-2' : 'grid-rows-2 divide-y-2',
        ]"
      >
        <bundle-image
          :grid="grid === 'col' ? 'row' : 'col'"
          :images="images.slice(0, randomCount)"
        />
        <bundle-image
          :grid="grid === 'col' ? 'row' : 'col'"
          :images="images.slice(randomCount, images.length)"
        />
      </div>
      <div
        v-else
        class="w-full h-full"
        :style="{
          background: images[0]
            ? 'url(' + images[0] + ')'
            : 'url(' + defaultImg + ')',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }"
      ></div>
    </div>
  </div>
</template>

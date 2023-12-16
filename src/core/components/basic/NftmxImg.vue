<script setup>
import { computed } from "vue";
import { defaultImg } from "@/core/config/constant";

const props = defineProps({
  src: String,
});

const setAltImg = (event) => {
  event.target.src = defaultImg;
};
</script>

<template>
  <img v-if="src" v-lazy="src" :key="src" @error="setAltImg" />
  <div
    v-else
    class="font-press bg-black text-tertiary-700 flex justify-center items-center"
  >
    ?
  </div>
</template>

<script setup>
import { roundTo } from "@/core/utils/common";

defineProps({
  unique: {
    type: String,
    default: "1:20",
  },
  transferred: {
    type: String,
    default: "12/20",
  },
  roi: {
    type: String,
    default: "+4,780.73%",
  },
  roii: {
    type: String,
    default: "(47.81x)",
  },
  value: {
    type: Number,
    default: 10,
  },
});
</script>

<template>
  <div
    class="flex justify-between gap-x-4 text-11 items-baseline font-ibm-light leading-4.5 text-white"
  >
    <div class>
      <div>Unique</div>
      <div class="text-primary-900">{{ unique }}</div>
      <div class="flex mt-3">
        ROI
        <font-awesome-icon
          :icon="['fas', 'question-circle']"
          class="text-st ml-1"
        />
      </div>
      <div class="text-primary-900">
        {{ roi }}
        <div class="text-tertiary-400 leading-3.5">{{ roii }}</div>
      </div>
    </div>
    <div class>
      <div class="w-max flex">
        Transferred
        <font-awesome-icon
          :icon="['fas', 'question-circle']"
          class="text-st ml-1"
        />
      </div>
      <div class="text-primary-900">{{ transferred }}</div>

      <div class="flex mt-3">
        Value
        <font-awesome-icon
          :icon="['fas', 'question-circle']"
          class="text-st ml-1"
        />
      </div>
      <div class="text-primary-900">${{ roundTo(value) }}</div>
    </div>
  </div>
</template>

<style scoped>
.text-st {
  font-size: 9px;
}
.leading-3\.5 {
  line-height: 14px;
}
</style>

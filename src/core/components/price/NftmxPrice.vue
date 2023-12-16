<script setup>
import NumberBlock from "@/core/components/basic/NumberBlock.vue";

const props = defineProps({
  price: {
    type: Number,
    required: true,
  },
  color: {
    type: String,
    default: "primary",
  },
});
</script>

<template>
  <div class="flex baseline w-fit gap-x-0.5">
    <number-block
      size="medium"
      :color="color === 'primary' ? 'primary-900' : 'secondary-800'"
      >$</number-block
    >
    <div v-for="(l, index) in price.toLocaleString()" :key="index" class="flex">
      <div v-if="parseInt(l) >= 0">
        <number-block
          size="medium"
          :color="color === 'primary' ? 'primary-900' : 'secondary-800'"
          >{{ l }}</number-block
        >
      </div>
      <div v-else>
        <span class="-mx-0.5 text-2xl">{{ l }}</span>
      </div>
    </div>
  </div>
</template>

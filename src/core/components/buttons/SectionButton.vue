<script setup>
import NftmxButton from "@/core/components/basic/NftmxButton.vue";

defineProps({
  to: String,
  label: String,
});
</script>

<template>
  <nftmx-button
    :to="to"
    color="primary"
    :label="label"
    :outline="true"
    class="font-ibm-bold text-lg text-primary-900 h-13.5 w-full sm:w-auto sm:px-22.5"
  />
</template>

<script setup>
import { computed } from "vue";
import { shortenAddress } from "@/core/utils/common";
import { BLOCK_EXPLORER_URL } from "@/core/config/constant";

const props = defineProps({
  address: {
    type: String,
    required: true,
  },
  chain: { type: String, default: "BSC_TESTNET" },
  pop: Boolean,
  tx: Boolean,
  long: Boolean,
});

const is = computed(() => (props.pop ? "a" : "div"));
const target = computed(() => (props.pop ? "_blank" : ""));
const href = computed(
  () =>
    BLOCK_EXPLORER_URL["BSC_TESTNET"] +
    (props.tx ? "tx/" : "address/") +
    props.address
);
</script>

<template>
  <component :is="is" :href="href" :target="target">
    {{ long ? address : shortenAddress(address) }}
  </component>
</template>

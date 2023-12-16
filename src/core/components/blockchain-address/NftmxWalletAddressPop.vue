<script setup>
import { computed } from "vue";
import { BLOCK_EXPLORER_URL } from "@/core/config/constant";
import { shortenAddress } from "@/core/utils/common";

const props = defineProps({
  network: { type: String, default: "ETHEREUM" },
  tx: Boolean,
  address: {
    type: String,
  },
  disable: Boolean,
  name: String,
});
</script>

<template>
  <a
    :href="
      tx
        ? BLOCK_EXPLORER_URL[props.network] + 'tx/' + address
        : BLOCK_EXPLORER_URL[props.network] + 'address/' + address
    "
    target="_blank"
  >
    {{ name || shortenAddress(address) }}
  </a>
</template>

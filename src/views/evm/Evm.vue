<script setup>
import BodyContainer from "@/core/container/BodyContainer.vue";
import { computed, onMounted, ref } from "vue";
import { generateChainData } from "@/core/utils/chains/fetch.js";
import useDebouncedRef from "@/core/utils/hook/useDebouncedRef.js";
import NftmxInput from "@/core/components/basic/NftmxInput.vue";
import Chain from "./Chain.vue";

const search = useDebouncedRef("", 1000);
const sortedChains = ref([]);
const filteredChains = computed(() =>
  !search.value || typeof search.value !== "string" || search.value === ""
    ? sortedChains.value
    : sortedChains.value.filter((chain) => {
        //filter
        return (
          chain.chain.toLowerCase().includes(search.value.toLowerCase()) ||
          chain.chainId
            .toString()
            .toLowerCase()
            .includes(search.value.toLowerCase()) ||
          chain.name.toLowerCase().includes(search.value.toLowerCase()) ||
          (chain.nativeCurrency ? chain.nativeCurrency.symbol : "")
            .toLowerCase()
            .includes(search.value.toLowerCase())
        );
      })
);
const loading = ref(true);

onMounted(async () => {
  const chains = await generateChainData();
  loading.value = false;

  sortedChains.value = chains.filter((item) => {
    const testnet =
      item.name?.toLowerCase().includes("test") ||
      item.title?.toLowerCase().includes("test") ||
      item.network?.toLowerCase().includes("test");
    const devnet =
      item.name?.toLowerCase().includes("devnet") ||
      item.title?.toLowerCase().includes("devnet") ||
      item.network?.toLowerCase().includes("devnet");
    return !testnet && !devnet;
  });
});
</script>

<template>
  <div
    class="relative bg-tertiary-800 py-7 px-4 sm:px-10 lg:px-22 text-white flex items-center border-b border-black"
  >
    <font-awesome-icon
      :icon="['fas', 'search']"
      class="text-white text-lg top-2.5 left-4"
    />
    <nftmx-input
      placeholder="Search blockchain"
      class="pt-2 pb-2.25 pl-4 font-ibm text-sm"
      v-model="search"
      border="none"
    />
  </div>
  <body-container>
    <div class="font-press text-3xl text-white text-center mt-9.5">
      Supporting 300+ Blockchain List
    </div>
    <div class="my-16">
      <div
        v-if="!loading"
        class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 2xl:gap-10"
      >
        <chain
          v-for="(chain, index) in filteredChains"
          :key="index"
          :chain="chain"
        />
      </div>
      <div v-else class="text-center text-white py-20 font-ibm-bold text-lg">
        Loading...
      </div>
    </div>
  </body-container>
</template>

<script setup>
import BodyContainer from "@/core/container/BodyContainer.vue";
import NftmxButton from "@/core/components/basic/NftmxButton.vue";
import CheckboxCell from "@/core/components/basic/CheckboxCell.vue";
import NftmxSaleCard from "@/core/components/cards/NftmxSaleCard.vue";
import NftmxFooter from "@/core/container/NftmxFooter.vue";
import { useStore } from "vuex";
import BrowseSearch from "./BrowseSearch.vue";
import marketService from "@/core/services/market.service";
import { computed, ref, watchEffect } from "vue";
import { CHAIN_ROUTES } from "@/core/config/constant";

const store = useStore();
const walletAddress = computed(() => store.getters["auth/walletAddress"]);
const orders = ref([]);
const loading = ref(true);

watchEffect(() => {
  if (walletAddress.value) {
    marketService
      .getOnSaleOrders(CHAIN_ROUTES.BSC_TESTNET, walletAddress.value)
      .then((res) => {
        orders.value = res.data.map((order) => {
          const nft = order.nft || order.pack;
          nft.order = order;
          return nft;
        });
        loading.value = false;
      });
  }
});
</script>

<template>
  <!-- <browse-search /> -->
  <body-container>
    <!-- <div class="flex flex-col sm:flex-row justify-start items-center mt-3.5">
            <div class="w-full sm:w-auto">
                <span class="text-white font-ibm-semi-bold mr-4 text-lg">1,291,029 results</span>
            </div>
            <div class="flex w-full sm:w-auto">
                <nftmx-button
                    :outline="true"
                    color="primary"
                    label="List Price Available"
                    :small="true"
                    class="hover:bg-transparent hover:text-primary-900 h-9 text-xs"
                />
            </div>
            <span class="text-primary-900 text-11 ml-4">Clear All</span>
        </div> -->
    <div
      class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 mb-11 pb-0.5 mt-10"
    >
      <nftmx-sale-card
        v-for="(token, index) in orders"
        :token="token"
        :key="index"
      />
    </div>
    <div
      v-if="loading"
      class="h-96 flex justify-center items-center font-ibm-bold text-tertiary-500 text-lg"
    >
      Loading...
    </div>
    <div
      v-if="!loading && orders.length === 0"
      class="h-96 flex justify-center items-center font-ibm-bold text-tertiary-500 text-lg"
    >
      No NFTs found
    </div>
  </body-container>
</template>

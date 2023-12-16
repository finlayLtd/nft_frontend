<script setup>
import { computed, onMounted, onUpdated, ref, watch } from "vue";
import marketService from "@/core/services/market.service";
import { MainToken, themeConfig, CHAIN_ROUTES } from "@/core/config/constant";
import { useStore } from "vuex";
import { roundTo } from "@/core/utils/common";
import BodyContainer from "@/core/container/BodyContainer.vue";

const store = useStore();
const soldItems = ref([]);
const canceledItems = ref([]);
const listedItems = ref([]);
const selected = ref("SOLD");
const selectedItems = ref([]);
const bnbPrice = computed(() => store.state.market.coinPrice.BSC_TESTNET);
const windowWidth = computed(() => store.state.app.windowWidth);

const selectLedger = (value) => {
  selected.value = value;
  switch (selected.value) {
    case "SOLD":
      selectedItems.value = soldItems.value;
      break;
    case "CANCELED":
      selectedItems.value = canceledItems.value;
      break;
    case "LISTED":
      selectedItems.value = listedItems.value;
      break;

    default:
      break;
  }
};
onMounted(() => {
  marketService.soldItems(CHAIN_ROUTES.BSC_TESTNET, 0, 20).then((res) => {
    soldItems.value = res.data;
    selectedItems.value = res.data;
  });
  marketService.canceledItems(CHAIN_ROUTES.BSC_TESTNET, 0, 20).then((res) => {
    canceledItems.value = res.data;
  });
  marketService.listedItems(CHAIN_ROUTES.BSC_TESTNET, 0, 20).then((res) => {
    listedItems.value = res.data;
  });
});
</script>

<template>
  <body-container>
    <div class="relative">
      <div
        class="w-full pt-10 cursor-default overflow-hidden h-full flex flex-col"
      >
        <div class="text-center text-white font-press text-2xl">Ledger</div>
        <div class="mt-5.5 w-full flex flex-col">
          <div
            class="grid grid-cols-4 border border-black bg-tertiary-800 font-ibm-medium text-11 text-center"
          >
            <div
              @click="selectLedger('SOLD')"
              :class="[
                selected === 'SOLD' ? 'bg-tertiary-900' : '',
                'text-primary-900 border-r border-black pt-4.75 pb-4.5 hover:bg-tertiary-900 cursor-pointer transition',
              ]"
            >
              SOLD
            </div>
            <div
              @click="selectLedger('CANCELED')"
              :class="[
                selected === 'CANCELED' ? 'bg-tertiary-900' : '',
                'text-red-900 border-r border-black pt-4.75 pb-4.5 hover:bg-tertiary-900 cursor-pointer transition',
              ]"
            >
              CANCELED
            </div>
            <div
              @click="selectLedger('LISTED')"
              :class="[
                selected === 'LISTED' ? 'bg-tertiary-900' : '',
                'text-white border-r border-black pt-4.75 pb-4.5 hover:bg-tertiary-900 cursor-pointer transition',
              ]"
            >
              LISTED
            </div>
            <div
              @click="selectLedger('CREATED')"
              :class="[
                selected === 'CREATED' ? 'bg-tertiary-900' : '',
                'text-tertiary-500 pt-4.75 pb-4.5 hover:bg-tertiary-900 cursor-pointer transition',
              ]"
            >
              CREATED
            </div>
          </div>
          <div
            class="grid grid-cols-2 bg-tertiary-800 border-b border-x border-black font-ibm-medium text-11 text-tertiary-500"
          >
            <div class="border-r border-black pt-3.5 pb-2.75 pl-3">Items</div>
            <div class="pt-3.5 pb-2.75 pl-3">Price (USD)</div>
          </div>
          <div
            class="flex-grow grid grid-cols-2 bg-tertiary-800 border-b border-x border-black text-xs overflow-hidden"
          >
            <div class="border-r border-black">
              <div
                v-for="(item, index) in selectedItems"
                :key="index"
                :class="[
                  index === selectedItems.length - 1 ? 'pb-6.25' : 'pb-1',
                  'text-white pt-5 pl-3',
                ]"
              >
                <router-link
                  :to="{
                    name: 'asset',
                    params: {
                      chain: 'BSC-TESTNET',
                      tokenAddress: item.contract.address,
                      tokenId: item.tokenId,
                    },
                  }"
                  target="_blank"
                  class="cursor-pointer"
                >
                  {{ item.tokenName || "#" + item.tokenId }}
                </router-link>
              </div>
            </div>
            <div>
              <div
                v-for="(item, index) in selectedItems"
                :key="index"
                :class="[
                  item.tokenPrice * bnbPrice > 300
                    ? 'text-red-900'
                    : item.tokenPrice * bnbPrice < 1
                    ? 'text-white'
                    : 'text-primary-900',
                  index === selectedItems.length - 1 ? 'pb-6.25' : 'pb-1',
                  'pt-5 pl-3',
                ]"
              >
                {{ roundTo(item.tokenPrice * bnbPrice) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </body-container>
</template>

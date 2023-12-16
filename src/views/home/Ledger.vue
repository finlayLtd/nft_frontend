<script setup>
import { computed, onMounted, onUpdated, ref, watch } from "vue";
import marketService from "@/core/services/market.service";
import { MainToken, themeConfig, CHAIN_ROUTES } from "@/core/config/constant";
import { useStore } from "vuex";
import { roundTo, getChainKey } from "@/core/utils/common";
import ordersService from "@/core/services/market/orders.service";
import NftmxImg from "@/core/components/basic/NftmxImg.vue";
import LedgerAssetCard from "./LedgerAssetCard.vue";

const props = defineProps({
  ledgerPanelVisible: Boolean,
  tab: String,
  ledgerHeight: Number,
});

const emit = defineEmits(["toggle-ledger-panel"]);

const store = useStore();
const allItems = ref([]);
const soldItems = ref([]);
const canceledItems = ref([]);
const listedItems = ref([]);
const selected = ref("ALL");
const selectedItems = ref([]);
const coinPrice = computed(() => store.state.market.coinPrice);
const ledgerAnim = ref(null);
const aHeight = ref(0);
const windowWidth = computed(() => store.state.app.windowWidth);
const items = computed(() =>
  windowWidth.value >= themeConfig.lg
    ? selectedItems.value.slice(0, Math.floor((props.ledgerHeight - 154) / 42))
    : selectedItems.value.slice(0, 10)
);

const getTimeAgo = (date) => {
  const localTimestamp = new Date(date).toLocaleString();
  const duration = new Date().getTime() - new Date(localTimestamp).getTime();
  const mins = Math.floor(duration / 60000);
  if (mins < 60) return (mins < 0 ? 0 : mins) + "m";
  const hours = Math.floor(duration / 3600000);
  if (hours < 24) return (hours < 0 ? 0 : hours) + "h";
  const days = Math.floor(hours / 24);
  return days + "d";
};
const selectLedger = (value) => {
  selected.value = value;
  getLedgerData();
};
const getLedgerData = () => {
  const status =
    selected.value === "SOLD"
      ? "3"
      : selected.value === "CANCELED"
      ? "4"
      : selected.value === "LISTED"
      ? "1"
      : "";
  ordersService.getLedgerOrders({ limit: 100, status }).then((res) => {
    allItems.value = res.data;
    selectedItems.value = res.data;
  });
};
onMounted(() => {
  aHeight.value = ledgerAnim.value.scrollHeight + "px";
  getLedgerData();
});
onUpdated(() => {
  if (ledgerAnim.value) {
    aHeight.value = ledgerAnim.value.scrollHeight + "px";
  }
});
watch(windowWidth, (val) => {
  aHeight.value = ledgerAnim.value.scrollHeight + "px";
});
</script>

<template>
  <div class="relative">
    <div
      ref="ledgerAnim"
      :class="[
        tab === 'COLLECTIONS'
          ? 'lg:pb-2.5'
          : tab === 'NFTS'
          ? 'lg:pb-11.25'
          : '',
        ledgerPanelVisible ? '' : 'overflow-hidden',
        'w-full lg:w-68 lg:pt-2 cursor-default transition-all',
      ]"
      :style="{
        maxWidth:
          windowWidth >= themeConfig.lg
            ? ledgerPanelVisible
              ? '272px'
              : '0'
            : '',
        maxHeight:
          windowWidth < themeConfig.lg
            ? ledgerPanelVisible
              ? aHeight
              : '0'
            : ledgerHeight + 'px',
      }"
    >
      <div class="flex justify-between items-center text-white">
        <div class="flex font-press">
          <span class="text-base">Ledger</span>
        </div>
        <div
          @click="emit('toggle-ledger-panel')"
          class="-rotate-90 lg:rotate-0 transition hover:fill-primary-900 fill-white pt-1 lg:pt-0 lg:pl-1 cursor-pointer"
        >
          <svg class="w-6 h-6">
            <g>
              <path
                d="M1.69,2.61c-0.28,0-0.5,0.22-0.5,0.5v17.91c0,0.28,0.22,0.5,0.5,0.5s0.5-0.22,0.5-0.5V3.11
		C2.19,2.84,1.96,2.61,1.69,2.61z"
              />
              <path
                d="M21.51,11.57H8.81l5.52-5.52c0.2-0.2,0.2-0.51,0-0.71s-0.51-0.2-0.71,0l-6.37,6.37
		c-0.07,0.07-0.1,0.15-0.12,0.23C7.12,11.96,7.11,11.98,7.11,12c-0.01,0.09-0.01,0.17,0.03,0.26c0,0,0,0,0,0c0,0,0,0,0,0
		c0.02,0.06,0.06,0.11,0.1,0.16l6.11,6.11c0.1,0.1,0.23,0.15,0.35,0.15s0.26-0.05,0.35-0.15c0.2-0.2,0.2-0.51,0-0.71l-5.26-5.26
		h12.71c0.28,0,0.5-0.22,0.5-0.5S21.79,11.57,21.51,11.57z"
              />
            </g>
          </svg>
        </div>
      </div>
      <div class="mt-5.5 w-full lg:w-68">
        <div
          class="grid grid-cols-4 border border-black bg-tertiary-800 font-ibm-medium text-11 text-center"
        >
          <div
            @click="selectLedger('ALL')"
            :class="[
              selected === 'ALL' ? 'bg-tertiary-900' : '',
              'text-white border-r border-black pt-4.75 pb-4.5 hover:bg-tertiary-900 cursor-pointer transition',
            ]"
          >
            ALL
          </div>
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
              'text-red-600 border-r border-black pt-4.75 pb-4.5 hover:bg-tertiary-900 cursor-pointer transition',
            ]"
          >
            CANCELED
          </div>
          <div
            @click="selectLedger('LISTED')"
            :class="[
              selected === 'LISTED' ? 'bg-tertiary-900' : '',
              'text-white pt-4.75 pb-4.5 hover:bg-tertiary-900 cursor-pointer transition',
            ]"
          >
            LISTED
          </div>
        </div>
        <table class="border-x border-b border-black bg-tertiary-800 w-full">
          <thead
            class="font-ibm-medium text-11 text-tertiary-500 border-b border-black"
          >
            <tr class="divide-x divide-black text-left">
              <th class="font-thin px-4 py-2.5">Items</th>
              <th class="font-thin px-4 py-2.5">Time</th>
              <th class="font-thin px-4 py-2.5 whitespace-nowrap">
                Price (USD)
              </th>
            </tr>
          </thead>
          <tbody class="font-ibm text-xs text-white">
            <tr
              v-for="(order, index) in items"
              :key="index"
              class="divide-x divide-black hover:bg-tertiary-900 transition cursor-pointer"
            >
              <td class="flex items-center gap-3 text-xs px-4 py-2">
                <router-link
                  :to="{
                    name: 'asset',
                    params: {
                      chain: order.nft.contract.chain,
                      tokenAddress: order.nft.contract.address,
                      tokenId: order.nft.tokenId,
                    },
                  }"
                  target="_blank"
                  class="relative parent"
                >
                  <nftmx-img
                    :src="order.nft.imageUrl"
                    class="w-6.5 h-6.5 object-cover"
                  />
                  <div
                    @click.stop
                    class="absolute w-68 h-fit transition child left-11 top-4 shadow-default shadow-primary-900"
                  >
                    <ledger-asset-card :asset="order.nft" />
                  </div>
                </router-link>
                <font-awesome-icon
                  v-if="order.orderStatus === '0' || order.orderStatus === '1'"
                  :icon="['fas', 'bars']"
                  class="text-tertiary-500"
                />
                <font-awesome-icon
                  v-else-if="order.orderStatus === '4'"
                  :icon="['fas', 'times']"
                  class="text-tertiary-500"
                />
                <font-awesome-icon
                  v-else-if="order.orderStatus === '3'"
                  :icon="['fas', 'tag']"
                  class="text-tertiary-500"
                />
                <font-awesome-icon
                  v-if="order.protectionRate > 0"
                  :icon="['fas', 'shield-alt']"
                  class="text-tertiary-500"
                />
              </td>
              <td class="text-center">{{ getTimeAgo(order.updatedAt) }}</td>
              <td
                :class="[
                  order.orderStatus === '4'
                    ? 'text-red-600'
                    : order.orderStatus === '0' || order.orderStatus === '1'
                    ? 'text-white'
                    : 'text-primary-900',
                  'pl-4',
                ]"
              >
                ${{
                  roundTo(
                    order.tokenPrice *
                      coinPrice[getChainKey(order.nft.contract.chain)]
                  )
                }}
              </td>
            </tr>
            <tr
              v-if="ledgerHeight - 155 - items.length * 42 > 0"
              class="divide-x divide-black"
              :style="{
                height:
                  windowWidth >= themeConfig.lg
                    ? ledgerHeight - 155 - items.length * 42 + 'px'
                    : '',
              }"
            >
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="h-8">
      <div
        @click="emit('toggle-ledger-panel')"
        :class="[
          ledgerPanelVisible ? 'hidden' : '',
          'absolute -right-1 lg:right-auto lg:top-2.5 lg:-left-10 font-ibm  hover:fill-primary-900 fill-white rotate-90 lg:rotate-180 transition pt-1 lg:pt-0 lg:pl-1 cursor-pointer',
        ]"
      >
        <svg class="w-6 h-6">
          <g>
            <path
              d="M1.69,2.61c-0.28,0-0.5,0.22-0.5,0.5v17.91c0,0.28,0.22,0.5,0.5,0.5s0.5-0.22,0.5-0.5V3.11
		C2.19,2.84,1.96,2.61,1.69,2.61z"
            />
            <path
              d="M21.51,11.57H8.81l5.52-5.52c0.2-0.2,0.2-0.51,0-0.71s-0.51-0.2-0.71,0l-6.37,6.37
		c-0.07,0.07-0.1,0.15-0.12,0.23C7.12,11.96,7.11,11.98,7.11,12c-0.01,0.09-0.01,0.17,0.03,0.26c0,0,0,0,0,0c0,0,0,0,0,0
		c0.02,0.06,0.06,0.11,0.1,0.16l6.11,6.11c0.1,0.1,0.23,0.15,0.35,0.15s0.26-0.05,0.35-0.15c0.2-0.2,0.2-0.51,0-0.71l-5.26-5.26
		h12.71c0.28,0,0.5-0.22,0.5-0.5S21.79,11.57,21.51,11.57z"
            />
          </g>
        </svg>
      </div>
    </div>
  </div>
</template>

<style scoped>
.child {
  opacity: 0;
  z-index: -1;
}
.parent:hover .child {
  opacity: 100;
  height: 573px;
  z-index: 15;
}
</style>

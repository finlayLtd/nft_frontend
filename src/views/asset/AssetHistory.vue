<script setup>
import { useStore } from "vuex";
import NftmxLineChart from "@/core/components/chart/NftmxLineChart.vue";
import Accordion from "@/core/components/accordion/BasicAccordion.vue";
import { computed, onMounted, ref, watch } from "vue";
import NftmxTooltip from "@/core/components/basic/NftmxTooltip.vue";
import { roundTo, getChainKey } from "@/core/utils/common";
import { useRoute } from "vue-router";
import historyService from "@/core/services/market/history.service";

const props = defineProps({
  asset: Object,
  totalTransfers: {
    type: Number,
    default: 0,
  },
});

const store = useStore();
const route = useRoute();
const tokenAddress = route.params.tokenAddress.toLowerCase();
const tokenId = route.params.tokenId.toLowerCase();
const chain = route.params.chain.toUpperCase();
const chainKey = getChainKey(chain);
const coinPrice = computed(() =>
  store.getters["market/getCoinPrice"](chainKey)
);
const history = ref([]);
const series = ref([]);
const roi = ref(0);
const currency = ref("ETH");

const getNftHistory = (page, limit) => {
  historyService
    .getNftHistory({
      chain,
      tokenAddress,
      tokenId,
      event: "3",
      limit,
    })
    .then((res) => {
      const data = [];
      for (let i = res.data.history.length - 1; i >= 0; i--) {
        const element = res.data.history[i];
        data.push([new Date(element.timestamp).getTime(), element.price]);
      }
      console.log("data", data);
      series.value.push({ name: "NFT price", data });
    });
};
onMounted(() => {
  getNftHistory(0, 10);
});
</script>

<template>
  <accordion class="overflow-hidden">
    <template v-slot:caption>
      <div class="flex items-center justify-between mr-8">
        <div class="text-lg font-ibm-bold pt-4 pb-3.5">History</div>
        <div class="flex items-center gap-4 text-lg text-black font-ibm-bold">
          <font-awesome-icon
            v-if="chain === 'ETHEREUM'"
            :icon="['fab', 'ethereum']"
            :class="[
              currency === 'ETH'
                ? 'text-primary-900'
                : 'transition hover:text-primary-900',
              'cursor-pointer',
            ]"
            @click.stop
            @click="currency = 'ETH'"
          />
          <div
            v-if="chain === 'BSC-TESTNET'"
            :class="[
              currency === 'ETH'
                ? 'fill-primary-900'
                : 'transition hover:fill-primary-900',
              'w-4 h-4',
            ]"
            @click.stop
            @click="currency = 'ETH'"
          >
            <svg
              role="img"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Binance</title>
              <path
                d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
              />
            </svg>
          </div>
          <div
            class="h-5 border-l border-l-black border-r border-r-tertiary-700 my-3.5"
          />
          <span
            :class="[
              currency === 'DOLAR'
                ? 'text-primary-900'
                : 'transition hover:text-primary-900',
              'cursor-pointer',
            ]"
            @click.stop
            @click="currency = 'DOLAR'"
          >
            $
          </span>
        </div>
      </div>
    </template>
    <div class="px-4 lg:px-6 lg:py-3.5">
      <div class="flex justify-between pb-2.5">
        <div
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:flex lg:flex-wrap lg:gap-x-4 gap-y-2 mt-6 sm:mt-1 text-white text-11 tracking-wider"
        >
          <div class="py-3">
            <div class="flex">
              <div>Baseline price</div>
              <nftmx-tooltip
                class="-top-0.5"
                text="Initial price or minting price"
              >
                <sup>
                  <font-awesome-icon
                    :icon="['fas', 'question-circle']"
                    class="-mt-1 ml-1 text-10 cursor-pointer"
                  />
                </sup>
              </nftmx-tooltip>
            </div>
            <div
              class="text-primary-900 text-lg leading-none flex items-center gap-2"
            >
              <font-awesome-icon
                v-if="currency === 'ETH' && chain === 'ETHEREUM'"
                :icon="['fab', 'ethereum']"
              />
              <div
                v-if="currency === 'ETH' && chain === 'BSC-TESTNET'"
                class="w-4 h-4"
              >
                <svg
                  role="img"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>Binance</title>
                  <path
                    d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                    fill="#19cb58"
                  ></path>
                </svg>
              </div>
              <span v-if="currency === 'DOLAR'">$</span>
              <span>
                {{
                  currency === "ETH"
                    ? asset.baselinePrice
                    : roundTo(asset.baselinePrice * coinPrice)
                }}
              </span>
            </div>
          </div>
          <div
            class="border-l border-l-black border-r border-r-tertiary-700 my-3.5"
          />
          <div class="py-3">
            <div class="flex">
              <div>Last sale</div>
            </div>
            <div
              class="text-primary-900 text-lg leading-none flex items-center gap-2"
            >
              <font-awesome-icon
                v-if="currency === 'ETH' && chain === 'ETHEREUM'"
                :icon="['fab', 'ethereum']"
                class="text-primary-900 cursor-pointer"
              />
              <div
                v-if="currency === 'ETH' && chain === 'BSC-TESTNET'"
                class="text-xs w-4 h-4 text-primary-900"
              >
                <svg
                  role="img"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>Binance</title>
                  <path
                    d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                    fill="#19cb58"
                  ></path>
                </svg>
              </div>
              <span v-if="currency === 'DOLAR'">$</span>
              <span>
                {{
                  currency === "ETH"
                    ? asset.lastPrice
                    : roundTo(asset.lastPrice * coinPrice)
                }}
              </span>
            </div>
          </div>
          <div
            class="border-l border-l-black border-r border-r-tertiary-700 my-3.5"
          />
          <div class="py-3">
            <div class="flex">
              <div>All time high</div>
            </div>
            <div
              class="text-primary-900 text-lg leading-none flex items-center gap-2"
            >
              <font-awesome-icon
                v-if="currency === 'ETH' && chain === 'ETHEREUM'"
                :icon="['fab', 'ethereum']"
                class="text-primary-900 cursor-pointer"
              />
              <div
                v-if="currency === 'ETH' && chain === 'BSC-TESTNET'"
                class="text-xs w-4 h-4 text-primary-900"
              >
                <svg
                  role="img"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>Binance</title>
                  <path
                    d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                    fill="#19cb58"
                  ></path>
                </svg>
              </div>
              <span v-if="currency === 'DOLAR'">$</span>
              <span>
                {{
                  currency === "ETH"
                    ? asset.athPrice
                    : roundTo(asset.athPrice * coinPrice)
                }}
              </span>
            </div>
          </div>
          <div
            class="border-l border-l-black border-r border-r-tertiary-700 my-3.5"
          />
          <div class="py-3">
            <div class="flex">
              <div>ROI</div>
              <nftmx-tooltip
                class="-top-0.5"
                text="ROI from baseline price to all time high."
              >
                <sup>
                  <font-awesome-icon
                    :icon="['fas', 'question-circle']"
                    class="-mt-1 ml-1 text-10 cursor-pointer"
                  />
                </sup>
              </nftmx-tooltip>
            </div>
            <div class="flex gap-1 items-center">
              <div class="text-primary-900 text-lg leading-none">
                {{
                  roundTo((asset.athPrice / (asset.baselinePrice || 1)) * 100)
                }}%
              </div>
              <div class="text-tertiary-400 font-ibm-semi-bold text-xs">
                [{{ roundTo(asset.athPrice / (asset.baselinePrice || 1)) }}x]
              </div>
            </div>
          </div>
          <div
            class="border-l border-l-black border-r border-r-tertiary-700 my-3.5"
          />
          <div class="py-3">
            <div class="flex">
              <div>Transfers</div>
              <nftmx-tooltip
                class="-top-0.5"
                text="Number of completed transfers"
              >
                <sup>
                  <font-awesome-icon
                    :icon="['fas', 'question-circle']"
                    class="ml-1 text-10 cursor-pointer"
                  />
                </sup>
              </nftmx-tooltip>
            </div>
            <div class="text-primary-900 text-lg leading-none">
              {{ asset.transfers }}
            </div>
          </div>
          <div
            class="border-l border-l-black border-r border-r-tertiary-700 my-3.5"
          />
          <div class="py-3">
            <div class="flex">
              <div>Floor price</div>
            </div>
            <div
              class="text-primary-900 text-lg leading-none flex items-center gap-2"
            >
              <font-awesome-icon
                v-if="currency === 'ETH' && chain === 'ETHEREUM'"
                :icon="['fab', 'ethereum']"
                class="text-primary-900 cursor-pointer"
              />
              <div
                v-if="currency === 'ETH' && chain === 'BSC-TESTNET'"
                class="text-xs w-4 h-4 text-primary-900"
              >
                <svg
                  role="img"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>Binance</title>
                  <path
                    d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                    fill="#19cb58"
                  ></path>
                </svg>
              </div>
              <span v-if="currency === 'DOLAR'">$</span>
              <span>
                {{
                  currency === "ETH"
                    ? asset.floorPrice
                    : roundTo(asset.floorPrice * coinPrice)
                }}
              </span>
            </div>
          </div>
        </div>
        <div class="flex justify-between gap-4">
          <div
            class="border-l border-l-black border-r border-r-tertiary-700 my-3.5"
          />
          <div class="py-3">
            <div class="flex text-white text-11 tracking-wider">
              <div>Income Stream</div>
              <nftmx-tooltip text="Income stream from IP sales and trades">
                <sup>
                  <font-awesome-icon
                    :icon="['fas', 'question-circle']"
                    class="ml-1 text-10 cursor-pointer"
                  />
                </sup>
              </nftmx-tooltip>
            </div>
            <div
              class="text-secondary-900 fill-secondary-900 text-lg leading-none flex items-center gap-2"
            >
              <font-awesome-icon
                v-if="currency === 'ETH' && chain === 'ETHEREUM'"
                :icon="['fab', 'ethereum']"
              />
              <div
                v-if="currency === 'ETH' && chain === 'BSC-TESTNET'"
                class="w-4 h-4"
              >
                <svg
                  role="img"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>Binance</title>
                  <path
                    d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                  ></path>
                </svg>
              </div>
              <span v-if="currency === 'DOLAR'">$</span>
              <span>{{ asset.floorPrice }}</span>
            </div>
          </div>
        </div>
      </div>
      <nftmx-line-chart :series="series"></nftmx-line-chart>
    </div>
  </accordion>
</template>

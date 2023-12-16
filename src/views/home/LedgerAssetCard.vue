<script setup>
import Ribbon from "@/core/components/basic/Ribbon.vue";
import Icon from "@/core/components/basic/Icon.vue";
import SaleInfo from "@/core/components/cards/SaleInfo.vue";
import NftmxButton from "@/core/components/basic/NftmxButton.vue";
import { computed, onMounted, ref, watch, watchEffect } from "vue";
import Timer from "@/core/components/timer/Timer.vue";
import moralisService from "@/core/services/moralis.service";
import { useStore } from "vuex";
import marketService from "@/core/services/market.service";
import { useToast } from "vue-toastification";
import NftmxTrimString from "@/core/components/basic/NftmxTrimString.vue";
import { CHAIN_ROUTES } from "@/core/config/constant";
import BundleImage from "@/core/components/basic/BundleImage.vue";
import AssetCardCarousel from "@/core/components/carousel/AssetCardCarousel.vue";
import { roundTo, getChainKey } from "@/core/utils/common";
import NftmxTooltip from "@/core/components/basic/NftmxTooltip.vue";
import NftmxImg from "@/core/components/basic/NftmxImg.vue";
import Web3 from "web3/dist/web3.min.js";
import nftsService from "@/core/services/market/nfts.service";

const props = defineProps({
  asset: Object,
});

const store = useStore();
const toast = useToast();
const userId = computed(() => store.getters["auth/userId"]);
const chainKey = getChainKey(props.asset.contract.chain);
const vote = computed(
  () =>
    props.asset &&
    props.asset.votes &&
    props.asset.votes.find((item) =>
      item.id === store.getters["auth/userId"] ? true : false
    )
);
const voteCount = computed(() =>
  props.asset && props.asset.votes ? props.asset.votes.length : 0
);
const windowWidth = computed(() => store.state.app.windowWidth);
const card = ref(null);
const transferred = ref("not");
const price = ref(0);
const open = ref(false);
const walletPop = ref(false);
const bundleImage = computed(() =>
  props.asset.nfts && props.asset.nfts.length > 0
    ? props.asset.nfts.map((nft) => nft.imageUrl)
    : []
);
const voteWaiting = ref(false);
const selectedAssetIndex = ref(0);
const coinPrice = computed(() => store.state.market.coinPrice[chainKey] || 1);

const handleVote = async () => {
  if (!userId.value) {
    walletPop.value = true;
    return;
  }
  if (voteWaiting.value) return;
  voteWaiting.value = true;
  await nftsService.vote({
    chain: props.asset.chain,
    userId: userId.value,
    nftId: props.asset.id,
  });
  voteWaiting.value = false;
  const index = props.asset.votes.findIndex((item) => item.id === userId.value);
  if (index > -1) {
    props.asset.votes.splice(index, 1);
  } else {
    props.asset.votes.push(store.state.user);
  }
};
</script>

<template>
  <div ref="card" class="w-full">
    <div
      class="transition hover:shadow-[0_0px_12px_0px_rgb(0_0_0_/_0.1),_0_0px_0px_0px_rgb(0_0_0_/_0.1);] hover:shadow-primary-900"
      @mouseover="open = true"
      @mouseleave="open = false"
    >
      <div class="relative w-full overflow-hidden pt-73per bg-black">
        <router-link
          :to="{
            name: 'asset',
            params: {
              chain: asset.contract.chain,
              tokenAddress: asset.contract.address,
              tokenId: asset.tokenId,
            },
          }"
          target="_blank"
          class="w-full h-full absolute top-0 left-0"
        >
          <div
            v-if="bundleImage.length > 0"
            class="w-full h-full absolute top-0 left-0 object-cover"
          >
            <asset-card-carousel
              :images="bundleImage"
              v-model="selectedAssetIndex"
            />
          </div>
          <div v-else class="w-full h-full absolute top-0 left-0">
            <nftmx-img
              :src="asset.imageUrl"
              class="w-full h-full object-cover text-6xl"
            />

            <div class="absolute top-2 right-3 flex flex-col gap-1 transition">
              <div
                class="child rounded-full w-7 h-7 flex items-center justify-center"
              >
                <font-awesome-icon
                  v-if="asset.contract.chain === 'ETHEREUM'"
                  :icon="['fab', 'ethereum']"
                  class="text-lg"
                />
                <div
                  v-if="asset.contract.chain === 'BSC-TESTNET'"
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
                    />
                  </svg>
                </div>
              </div>
              <div
                class="child rounded-full w-7 h-7 flex items-center justify-center"
              >
                <font-awesome-icon
                  :icon="['fas', 'shield-alt']"
                  class="text-base"
                />
              </div>
              <div
                v-if="asset.mlrContract"
                class="child rounded-full w-7 h-7 flex items-center justify-center"
              >
                <svg viewBox="0 0 28 28" class="w-5.5 h-5.5">
                  <path
                    class="st0"
                    d="M25.42,14.53c0-0.32-0.19-0.61-0.49-0.74l-3.02-1.26l3.02-1.26c0.3-0.12,0.49-0.42,0.49-0.74
	c0-0.32-0.19-0.61-0.49-0.74l-10.7-4.47c-0.2-0.08-0.42-0.08-0.62,0L2.91,9.79c-0.3,0.12-0.49,0.42-0.49,0.74
	c0,0.32,0.19,0.61,0.49,0.74l3.02,1.26l-3.02,1.26c-0.3,0.12-0.49,0.42-0.49,0.74c0,0.32,0.19,0.61,0.49,0.74l3.02,1.26l-3.02,1.26
	c-0.3,0.12-0.49,0.42-0.49,0.74c0,0.32,0.19,0.61,0.49,0.74l10.7,4.47c0.1,0.04,0.2,0.06,0.31,0.06s0.21-0.02,0.31-0.06l10.7-4.47
	c0.3-0.12,0.49-0.42,0.49-0.74c0-0.32-0.19-0.61-0.49-0.74l-3.02-1.26l3.02-1.26C25.23,15.14,25.42,14.85,25.42,14.53z M13.92,6.92
	l8.63,3.61l-3.02,1.26c0,0,0,0,0,0l-5.61,2.34l-5.61-2.34c0,0,0,0,0,0l-3.02-1.26L13.92,6.92z M22.55,18.53l-8.63,3.61l-8.63-3.61
	L8,17.4l5.61,2.34c0.1,0.04,0.2,0.06,0.31,0.06s0.21-0.02,0.31-0.06l5.61-2.34L22.55,18.53z M19.53,15.79
	C19.53,15.79,19.53,15.79,19.53,15.79l-5.61,2.34l-5.61-2.34c0,0,0,0,0,0l-3.02-1.26L8,13.4l5.61,2.34c0.1,0.04,0.2,0.06,0.31,0.06
	s0.21-0.02,0.31-0.06l5.61-2.34l2.71,1.13L19.53,15.79z"
                  />
                </svg>
              </div>
              <div
                v-if="asset.mlrContract"
                class="child rounded-full w-7 h-7 flex items-center justify-center"
              >
                <svg viewBox="0 0 28 28">
                  <g>
                    <path
                      class="st0"
                      d="M14,3.7C8.32,3.7,3.7,8.32,3.7,14S8.32,24.3,14,24.3S24.3,19.68,24.3,14S19.68,3.7,14,3.7z M5.14,14
		c0-4.88,3.97-8.86,8.86-8.86c2.25,0,4.31,0.85,5.87,2.25l-3.75,3.75c-0.15-0.16-0.3-0.31-0.44-0.44c-0.03-0.03-0.07-0.07-0.11-0.1
		c-0.14-0.13-0.27-0.24-0.38-0.33c-0.05-0.04-0.1-0.08-0.14-0.12c-0.05-0.04-0.1-0.07-0.12-0.09c-0.01-0.01-0.02-0.01-0.03-0.01
		l-0.12-0.03V9.02c0-0.16-0.06-0.31-0.17-0.41s-0.25-0.17-0.41-0.17c-0.32,0-0.58,0.26-0.58,0.58v0.67l-0.06-0.02l-0.16-0.05
		l-0.15-0.04c0,0,0,0,0,0h0l-1.12-0.3c-0.05-0.01-0.09,0.04-0.07,0.08l0.18,0.33c0.02,0.04,0.04,0.08,0.06,0.13
		c0.03,0.06,0.06,0.12,0.09,0.18c0.03,0.05,0.05,0.11,0.08,0.17c0.06,0.13,0.12,0.27,0.18,0.42c0.04,0.1,0.08,0.2,0.12,0.3
		c0.1,0.26,0.2,0.54,0.28,0.83c0.03,0.09,0.05,0.18,0.08,0.27l0.01,0.05c0.03,0.13,0.06,0.27,0.08,0.4
		c0.02,0.09,0.03,0.18,0.04,0.27c0.01,0.1,0.03,0.2,0.03,0.3c0.01,0.09,0.01,0.19,0.01,0.28c0,0.23-0.02,0.46-0.07,0.67
		c-0.01,0.03-0.02,0.07-0.03,0.1l-2.15,2.15c-0.01-0.01-0.02-0.02-0.03-0.02H8.06c-0.05,0-0.09,0.04-0.09,0.09v0.06
		c0,0.83,0.3,1.57,0.79,2.16l-1.37,1.37C6,18.31,5.14,16.25,5.14,14z M13.63,16.3v1.15h-1.47c-0.09,0-0.19-0.01-0.28-0.04L13,16.3
		H13.63z M14,22.86c-2.11,0-4.05-0.74-5.57-1.98L9.9,19.4c0.45,0.22,0.95,0.36,1.49,0.36h5.32c1.27,0,1.84-1.49,2.59-2.52
		c0.29-0.41,1-0.73,1.2-0.82c0.03-0.01,0.06-0.05,0.06-0.09v-0.66c0-0.06-0.06-0.1-0.12-0.09l-3.1,0.9c-0.02,0-0.03,0.01-0.04,0.03
		c-0.34,0.38-0.63,0.63-0.69,0.68c-0.19,0.16-0.43,0.25-0.68,0.25h-1.12V16.3h0.89c0.02,0,0.05-0.01,0.06-0.02l0.12-0.11
		c0.05-0.05,0.11-0.1,0.18-0.17c0.04-0.04,0.09-0.09,0.13-0.14c0.05-0.05,0.09-0.1,0.13-0.14c0.07-0.08,0.14-0.15,0.21-0.24
		c0.05-0.05,0.1-0.12,0.14-0.18c0.05-0.06,0.1-0.12,0.15-0.19c0.03-0.05,0.07-0.1,0.11-0.15c0.03-0.05,0.07-0.1,0.1-0.15
		c0.09-0.14,0.16-0.28,0.23-0.43c0.03-0.07,0.06-0.14,0.08-0.22c0.03-0.07,0.05-0.14,0.06-0.22c0.04-0.18,0.05-0.35,0.03-0.52
		c0-0.05-0.01-0.11-0.02-0.16v-0.01c0-0.04-0.01-0.08-0.02-0.11c-0.04-0.17-0.1-0.34-0.17-0.51c-0.03-0.06-0.05-0.12-0.08-0.18
		c-0.03-0.05-0.06-0.11-0.1-0.16l3.87-3.87c1.24,1.52,1.98,3.46,1.98,5.57C22.86,18.88,18.88,22.86,14,22.86z"
                    />
                    <path
                      class="st0"
                      d="M11.53,15.04c0.03,0,0.06-0.01,0.08-0.04c0.04-0.05,0.07-0.11,0.1-0.17c0.24-0.4,0.45-0.82,0.52-1.14
		c0.18-0.77-0.2-2.01-0.65-3c-0.03-0.07-0.12-0.07-0.16-0.01l-2.65,4.15L8.72,14.9c-0.04,0.06,0,0.14,0.08,0.14H11.53z"
                    />
                  </g>
                </svg>
              </div>
              <div
                v-if="
                  asset.currentOrder && asset.currentOrder.orderType === '1'
                "
                class="child rounded-full w-7 h-7 flex items-center justify-center"
              >
                <font-awesome-icon :icon="['fas', 'gavel']" class="text-base" />
              </div>
              <div
                v-if="asset.lastOrder"
                class="child rounded-full w-7 h-7 flex items-center justify-center"
              >
                <font-awesome-icon :icon="['fas', 'tag']" class="text-base" />
              </div>
            </div>
          </div>
        </router-link>
        <ribbon
          v-if="
            asset.currentOrder &&
            asset.currentOrder.protectionRate > 0 &&
            asset.currentOrder.protectionTime > 0
          "
        />
      </div>
      <div class="relative px-4.5 pt-5.5 pb-4 bg-tertiary-700">
        <div class="flex text-white overflow-hidden">
          <div class="flex-1 text-base font-ibm-bold leading-6 pr-2 h-15">
            <router-link
              :to="{
                name: 'asset',
                params: {
                  chain: asset.contract.chain,
                  tokenAddress: asset.contract.address,
                  tokenId: asset.tokenId,
                },
              }"
              target="_blank"
              class="cursor-pointer"
            >
              <nftmx-trim-string :line="2">
                {{ asset.name || "#" + asset.tokenId }}
              </nftmx-trim-string>
            </router-link>
          </div>
          <div class="text-xs flex mt-1.5">
            <span class="pr-1 text-tertiary-400">{{ voteCount }}</span>
            <font-awesome-icon
              :icon="['fas', 'thumbs-up']"
              :class="[
                vote ? 'text-primary-900' : 'text-white',
                voteWaiting ? 'cursor-wait' : 'cursor-pointer',
                'hover:text-primary-900 transition',
              ]"
              @click="handleVote()"
            />
          </div>
        </div>
        <div class="text-11 text-white font-ibm">
          <div class="flex justify-between items-end">
            <div class="flex">
              <span class="font-ibm-medium">ROI</span>
              <nftmx-tooltip text="ROI from baseline price to all time high.">
                <sup>
                  <font-awesome-icon
                    :icon="['fas', 'question-circle']"
                    class="ml-1 text-10 cursor-pointer"
                  />
                </sup>
              </nftmx-tooltip>
            </div>
            <div class="flex items-center">
              <span class="text-primary-900"> +4,780.80 </span>
              <span class="ml-1 text-tertiary-400"> [47.81x] </span>
            </div>
          </div>
          <div class="flex justify-between items-end">
            <div class="flex">
              <span class="font-ibm-medium">Floor Price</span>
            </div>
            <div class="flex items-center">
              <span class="text-primary-900">
                <font-awesome-icon :icon="['fab', 'ethereum']" />
                {{ asset.lastOrder ? asset.lastOrder.tokenPrice : 0 }}
              </span>
              <span class="ml-1 text-tertiary-400">
                <span>[$</span>
                <span>
                  {{
                    asset.lastOrder
                      ? roundTo(asset.lastOrder.tokenPrice * coinPrice)
                      : 0
                  }}
                </span>
                <span>]</span>
              </span>
            </div>
          </div>
        </div>
        <div class="flex gap-2 items-center mt-3 mb-1.5">
          <div
            class="border-t border-t-black border-b border-b-tertiary-600 w-full h-0"
          />
          <div
            class="text-black font-ibm-bold text-11 whitespace-nowrap text-shadow-h1"
          >
            Multilevel Ownership
          </div>
          <div
            class="border-t border-t-black border-b border-b-tertiary-600 w-full h-0"
          />
        </div>
        <div class="text-11 text-white font-ibm">
          <div class="flex justify-between">
            <span class="font-ibm-medium">Owners</span>
            <span
              :class="[
                asset.mlrContract && asset.mlrContract.owners
                  ? 'text-primary-900'
                  : 'text-tertiary-400',
              ]"
            >
              {{
                asset.mlrContract && asset.mlrContract.owners
                  ? asset.mlrContract.owners.length
                  : 0
              }}
            </span>
          </div>
          <div class="flex justify-between">
            <span class="font-ibm-medium">Total Ownership</span>
            <div class="flex items-center">
              <span
                :class="[
                  asset.mlrContract && asset.mlrContract.owners
                    ? 'text-primary-900'
                    : 'text-tertiary-400',
                ]"
              >
                {{
                  asset.mlrContract && asset.mlrContract.owners
                    ? asset.mlrContract.owners.reduce(
                        (ac, owner) => ac + owner.realRoyalty,
                        0
                      )
                    : 0
                }}%
              </span>
            </div>
          </div>
        </div>
        <div class="flex gap-2 items-center mt-4.5 mb-1.5">
          <div
            class="border-t border-t-black border-b border-b-tertiary-600 w-full h-0"
          />
          <div
            class="text-black font-ibm-bold text-11 whitespace-nowrap text-shadow-h1"
          >
            Liquidity Protection
          </div>
          <div
            class="border-t border-t-black border-b border-b-tertiary-600 w-full h-0"
          />
        </div>
        <div class="text-11 text-white font-ibm">
          <div class="flex justify-between">
            <span class="font-ibm-medium">Period</span>
            <span class="text-primary-900">
              {{
                asset.currentOrder
                  ? Math.round(asset.currentOrder.protectionTime / 86400)
                  : 0
              }}
              Days
            </span>
          </div>
          <div class="flex justify-between">
            <span class="font-ibm-medium">Fees</span>
            <div class="flex items-center">
              <span
                :class="[
                  asset.currentOrder && asset.currentOrder.protectionRate < 100
                    ? 'text-primary-900'
                    : 'text-tertiary-400',
                ]"
              >
                Slippage
                {{
                  asset.currentOrder
                    ? 100 - asset.currentOrder.protectionRate
                    : 0
                }}%
              </span>
              <div class="h-2.5 mx-1.5 border-l border-tertiary-400" />
              <span
                :class="[
                  asset.staking ? 'text-primary-900' : 'text-tertiary-400',
                ]"
              >
                Staking
              </span>
            </div>
          </div>
        </div>
        <div class="h-14 text-tertiary-400 text-11 text-center relative mt-5">
          <div
            v-if="asset.currentOrder && asset.currentOrder.orderType === '0'"
          >
            <span> Asking price </span>
            <div class="flex items-end pt-1.75 w-fit mx-auto max-w-full">
              <div
                class="flex items-center text-lg text-primary-900 font-ibm-medium"
              >
                <font-awesome-icon
                  v-if="asset.contract.chain === 'ETHEREUM'"
                  :icon="['fab', 'ethereum']"
                />
                <div
                  v-if="asset.contract.chain === 'BSC-TESTNET'"
                  class="w-4 h-4 fill-primary-900"
                >
                  <svg
                    role="img"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                    />
                  </svg>
                </div>
                {{ roundTo(asset.currentOrder.tokenPrice) }}
              </div>
              <span class="ml-2">[$</span>
              <span>
                {{ roundTo(asset.currentOrder.tokenPrice * coinPrice) }}
              </span>
              <span>]</span>
            </div>
          </div>
          <div
            v-else-if="
              asset.currentOrder && asset.currentOrder.orderType === '1'
            "
          >
            <span> Current auction ends in </span>
            <div class="pt-2.5 w-fit mx-auto max-w-full">
              <timer
                :time="
                  parseInt(
                    asset.currentOrder.endSaleTime -
                      new Date().getTime() / 1000 >
                      0
                      ? asset.currentOrder.endSaleTime -
                          new Date().getTime() / 1000
                      : 0
                  )
                "
              />
            </div>
          </div>
          <div v-else>
            <span> Floor price </span>
            <div class="flex items-end pt-1.75 w-fit mx-auto max-w-full">
              <div
                class="flex items-center text-lg text-primary-900 font-ibm-medium"
              >
                <font-awesome-icon
                  v-if="asset.contract.chain === 'ETHEREUM'"
                  :icon="['fab', 'ethereum']"
                />
                <div
                  v-if="asset.contract.chain === 'BSC-TESTNET'"
                  class="w-4 h-4 fill-primary-900"
                >
                  <svg
                    role="img"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                    />
                  </svg>
                </div>
                {{
                  roundTo(
                    asset.lastOrder
                      ? asset.lastOrder.tokenPrice
                      : asset.baselinePrice
                  )
                }}
              </div>
              <span class="ml-2">[$</span>
              <span>
                {{
                  roundTo(
                    asset.lastOrder
                      ? asset.lastOrder.tokenPrice * coinPrice
                      : asset.baselinePrice * coinPrice
                  )
                }}
              </span>
              <span>]</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="asset.nfts && asset.nfts.length > 0"
      class="px-2 shadow-xl cursor-pointer block"
    >
      <div class="w-full h-1.25 bg-primary-200" />
      <div class="px-2">
        <div class="w-full h-1.25 bg-primary-100" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.child {
  color: rgb(21, 21, 21);
  fill: rgb(21, 21, 21);
}
</style>

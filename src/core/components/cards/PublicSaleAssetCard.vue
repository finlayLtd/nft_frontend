<script setup>
import Ribbon from "@/core/components/basic/Ribbon.vue";
import { computed, ref } from "vue";
import Timer from "@/core/components/timer/Timer.vue";
import { useStore } from "vuex";
import NftmxTrimString from "../basic/NftmxTrimString.vue";
import AssetCardCarousel from "../carousel/AssetCardCarousel.vue";
import { roundTo, getChainKey } from "@/core/utils/common";
import NftmxTooltip from "../basic/NftmxTooltip.vue";
import NftmxImg from "../basic/NftmxImg.vue";
import nftsService from "@/core/services/market/nfts.service";
import NftmxInput from "@/core/components/basic/NftmxInput.vue";

const props = defineProps({
  asset: Object,
  openLeft: { type: Boolean, default: false },
  cardWidth: Number,
});

const store = useStore();
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
const bundleImage = computed(() =>
  props.asset.nfts && props.asset.nfts.length > 0
    ? props.asset.nfts.map((nft) => nft.imageUrl)
    : []
);
const voteWaiting = ref(false);
const selectedAssetIndex = ref(0);
const coinPrice = computed(() => store.state.market.coinPrice[chainKey] || 1);
const parent = ref(null);
const propmtWindow = ref(false);
const handleVote = async () => {
  if (!userId.value) {
    openConnectWalletModal();
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
const openConnectWalletModal = () => {
  store.commit("app/OPEN_CONNECT_WALLET_MODAL");
};
</script>

<template>
  <div ref="parent" class="w-full parent relative">
    <div
      :class="[
        propmtWindow ? 'z-16' : '',
        openLeft && propmtWindow ? 'flex-row-reverse left-cal' : '',
        'relative flex w-fit shadow-default hover:shadow-primary-900',
      ]"
      @mouseenter="propmtWindow = true"
      @mouseleave="propmtWindow = false"
    >
      <div
        :class="[propmtWindow ? 'z-20' : '', 'h-full']"
        :style="{ width: `${cardWidth}px` }"
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
                :src="'/images/landing/ape.png'"
                class="w-full h-full object-cover text-6xl"
              />
              <div class="w-full h-full absolute top-0 left-0 child-bg" />
            </div>
            <div
              class="absolute z-15 top-2 right-3 flex flex-col gap-1 transition"
            >
              <nftmx-tooltip
                :adjust="10"
                :text="
                  'This NFT belongs to the ' +
                  (asset.contract.chain === 'ETHEREUM'
                    ? 'Ethereum'
                    : 'BSC Testnet') +
                  ' blockchain'
                "
              >
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
                    <svg viewBox="0 0 24 24">
                      <path
                        d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                      />
                    </svg>
                  </div>
                </div>
              </nftmx-tooltip>
              <nftmx-tooltip
                :adjust="10"
                text="This NFT is for sale with 100% liquidity protection"
              >
                <div
                  class="child rounded-full w-7 h-7 flex items-center justify-center"
                >
                  <font-awesome-icon
                    :icon="['fas', 'shield-alt']"
                    class="text-base"
                  />
                </div>
              </nftmx-tooltip>
              <nftmx-tooltip
                v-if="asset.mlrContract"
                :adjust="10"
                text="This item has multilevel ownership, meaning that previous owners keep equity in this asset when it is sold forward."
              >
                <div
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
              </nftmx-tooltip>
              <nftmx-tooltip
                v-if="asset.mlrContract"
                :adjust="10"
                text="This item is exclusive to NFT.Protection and cannot be sold on other exchanges."
              >
                <div
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
              </nftmx-tooltip>
              <nftmx-tooltip
                v-if="
                  asset.currentOrder && asset.currentOrder.orderType === '1'
                "
                :adjust="10"
                text="This NFT is for sale via auction"
              >
                <div
                  class="child rounded-full w-7 h-7 flex items-center justify-center"
                >
                  <font-awesome-icon
                    :icon="['fas', 'gavel']"
                    class="text-base"
                  />
                </div>
              </nftmx-tooltip>
              <nftmx-tooltip
                v-if="
                  asset.currentOrder && asset.currentOrder.orderType === '0'
                "
                :adjust="10"
                text="This NFT is for sale at a fixed price"
              >
                <div
                  class="child rounded-full w-7 h-7 flex items-center justify-center"
                >
                  <font-awesome-icon :icon="['fas', 'tag']" class="text-base" />
                </div>
              </nftmx-tooltip>
            </div>
          </router-link>
          <ribbon
            v-if="
              asset.currentOrder &&
              asset.currentOrder.protectionRate > 0 &&
              asset.currentOrder.protectionTime > 0
            "
          />
          <div
            class="absolute bottom-1 right-3.5 w-6 h-6 bg-tertiary-900 rounded-full flex items-center justify-center cursor-pointer"
            @click="propmtWindow = !propmtWindow"
          >
            <img src="/images/components/video.png" />
          </div>
        </div>
        <div class="relative px-4.5 pt-5.5 pb-4 bg-tertiary-700">
          <div class="flex text-white overflow-hidden">
            <div class="flex-1 text-base font-ibm-bold leading-6 pr-2 h-14.5">
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
                  vote ? 'text-primary-900' : 'text-tertiary-400',
                  voteWaiting ? 'cursor-wait' : 'cursor-pointer',
                  'hover:text-primary-900 transition',
                ]"
                @click="handleVote()"
              />
            </div>
          </div>
          <div class="text-11 leading-4.5 text-white font-ibm">
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
                <span class="text-primary-900">
                  +{{
                    roundTo(
                      (asset.athPrice / (asset.baselinePrice || 1)) * 100
                    )
                  }}%
                </span>
                <span class="ml-1 text-tertiary-400">
                  [{{ roundTo(asset.athPrice / (asset.baselinePrice || 1)) }}x]
                </span>
              </div>
            </div>
            <div class="flex justify-between items-end">
              <div class="flex">
                <span class="font-ibm-medium">Floor Price</span>
                <nftmx-tooltip text="Initial price or minting price">
                  <sup>
                    <font-awesome-icon
                      :icon="['fas', 'question-circle']"
                      class="ml-1 text-10 cursor-pointer"
                    />
                  </sup>
                </nftmx-tooltip>
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
          <div class="flex gap-2 items-center mt-4 mb-2.5">
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
          <div class="text-11 leading-4.5 text-white font-ibm">
            <div class="flex justify-between">
              <span class="font-ibm-medium">
                Owners
                <nftmx-tooltip
                  text="The number of owners who have previously owned this NFT and still retain partial ownership for themselves."
                >
                  <sup>
                    <font-awesome-icon
                      :icon="['fas', 'question-circle']"
                      class="text-10 cursor-pointer"
                    />
                  </sup>
                </nftmx-tooltip>
              </span>
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
              <span class="font-ibm-medium">
                Total Ownership
                <nftmx-tooltip
                  text="The total amount of partial ownership that belongs to all previous owners of this NFT."
                >
                  <sup>
                    <font-awesome-icon
                      :icon="['fas', 'question-circle']"
                      class="text-10 cursor-pointer"
                    />
                  </sup>
                </nftmx-tooltip>
              </span>
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
          <div class="flex gap-2 items-center mt-4.75 mb-2">
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
          <div class="text-11 leading-4.5 text-white font-ibm">
            <div class="flex justify-between">
              <span class="font-ibm-medium">
                Period
                <nftmx-tooltip
                  text="The period of time during which a buyer is allowed to return the NFT to the liquidity protection contract and receive a refund."
                >
                  <sup>
                    <font-awesome-icon
                      :icon="['fas', 'question-circle']"
                      class="text-10 cursor-pointer"
                    />
                  </sup>
                </nftmx-tooltip>
              </span>
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
              <span class="font-ibm-medium">
                Fees
                <nftmx-tooltip
                  text="The fees that will be paid to the market maker in case of cancellation and return of the NFT to the liquidity protection contract."
                >
                  <sup>
                    <font-awesome-icon
                      :icon="['fas', 'question-circle']"
                      class="text-10 cursor-pointer"
                    />
                  </sup>
                </nftmx-tooltip>
              </span>
              <div class="flex items-center">
                <span
                  :class="[
                    asset.currentOrder &&
                    asset.currentOrder.protectionRate < 100
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
          <div class="h-14 text-tertiary-400 text-11 text-center relative mt-6">
            <div
              v-if="asset.currentOrder && asset.currentOrder.orderType === '0'"
            >
              <span> Asking price </span>
              <div class="flex items-end pt-1.75 w-fit mx-auto max-w-full">
                <div
                  class="flex items-center gap-2 text-lg text-primary-900 font-ibm-medium"
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
                  class="flex items-center gap-2 text-lg text-primary-900 font-ibm-medium"
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
        v-if="propmtWindow"
        class="bg-tertiary-800 z-16"
        :style="{ width: `${cardWidth + 18}px` }"
      >
        <div class="w-full h-img grid grid-cols-1 gap-0.5 text-4xl">
          <div
            class="bg-tertiary-700 font-press text-xs text-shadow flex items-center justify-center gap-1.5"
          >
            <div class="w-7 h-7 p-0.75 svg-shadow-primary rounded-full">
              <svg viewBox="0 0 32.61 32.61">
                <g>
                  <path
                    class="st0"
                    d="M24.97,13.95c0.41,0,0.76,0.15,1.05,0.45s0.45,0.65,0.45,1.05v1.5c0,0.41-0.15,0.76-0.45,1.05
		s-0.65,0.45-1.05,0.45h-6.75v6.75c0,0.41-0.15,0.76-0.45,1.05s-0.65,0.45-1.05,0.45h-1.5c-0.41,0-0.76-0.15-1.05-0.45
		s-0.45-0.65-0.45-1.05v-6.75H6.97c-0.41,0-0.76-0.15-1.05-0.45s-0.45-0.65-0.45-1.05v-1.5c0-0.41,0.15-0.76,0.45-1.05
		s0.65-0.45,1.05-0.45h6.75V7.2c0-0.41,0.15-0.76,0.45-1.05s0.65-0.45,1.05-0.45h1.5c0.41,0,0.76,0.15,1.05,0.45
		s0.45,0.65,0.45,1.05v6.75H24.97z"
                  />
                </g>
              </svg>
            </div>
            <span> ADD </span>
          </div>
          <div
            class="bg-tertiary-700 font-press text-xs text-shadow flex items-center justify-center gap-1.5"
          >
            <div class="w-7 h-7 p-0.5 svg-shadow-primary rounded-full">
              <svg viewBox="0 0 32.61 32.61">
                <g>
                  <path
                    class="st0"
                    d="M19.66,16.13l4.69,4.69c0.28,0.28,0.42,0.63,0.42,1.03s-0.14,0.77-0.42,1.08l-1.03,1.03
		c-0.31,0.28-0.67,0.42-1.08,0.42s-0.75-0.14-1.03-0.42l-4.69-4.69l-4.69,4.69c-0.28,0.28-0.63,0.42-1.03,0.42s-0.77-0.14-1.08-0.42
		l-1.03-1.03c-0.28-0.31-0.42-0.67-0.42-1.08s0.14-0.75,0.42-1.03l4.69-4.69l-4.69-4.69c-0.28-0.28-0.42-0.63-0.42-1.03
		s0.14-0.77,0.42-1.08L9.72,8.3c0.31-0.28,0.67-0.42,1.08-0.42s0.75,0.14,1.03,0.42l4.69,4.69l4.69-4.69
		c0.28-0.28,0.63-0.42,1.03-0.42s0.77,0.14,1.08,0.42l1.03,1.03c0.28,0.31,0.42,0.67,0.42,1.08s-0.14,0.75-0.42,1.03L19.66,16.13z"
                  />
                </g>
              </svg>
            </div>
            <span> REMOVE </span>
          </div>
          <div
            class="bg-tertiary-700 cursor-pointer transition hover:bg-tertiary-800 font-press text-xs text-shadow-white flex items-center justify-center gap-1.5"
          >
            <div class="w-7 h-7 p-px svg-shadow-white rounded-full">
              <svg viewBox="0 0 32.61 32.61">
                <g>
                  <path
                    class="st0"
                    d="M16.04,22.13c1.45,0,2.74-0.45,3.85-1.34s1.83-2.03,2.16-3.41c0.02-0.09,0.08-0.17,0.16-0.23
		s0.17-0.09,0.26-0.09h1.72c0.14,0,0.25,0.05,0.33,0.16s0.11,0.22,0.09,0.33c-0.26,1.34-0.8,2.54-1.62,3.62s-1.83,1.93-3.04,2.55
		s-2.51,0.93-3.92,0.93c-1.31,0-2.54-0.27-3.69-0.81s-2.13-1.29-2.95-2.25l0.14,2.88c0.02,0.14-0.01,0.25-0.09,0.33
		s-0.19,0.12-0.33,0.12H7.47c-0.12,0-0.22-0.04-0.3-0.12s-0.12-0.18-0.12-0.3v-7.03c0-0.12,0.04-0.22,0.12-0.3s0.18-0.12,0.3-0.12
		h7.03c0.12,0,0.22,0.04,0.3,0.12s0.12,0.18,0.12,0.3v1.65c0,0.12-0.04,0.22-0.12,0.3s-0.18,0.12-0.3,0.12l-3.59-0.18
		c0.56,0.84,1.29,1.51,2.2,2S14.99,22.13,16.04,22.13z M22.55,7.4c0-0.14,0.04-0.25,0.12-0.33s0.18-0.12,0.3-0.12h1.65
		c0.12,0,0.22,0.04,0.3,0.12s0.12,0.18,0.12,0.3v7.03c0,0.12-0.04,0.22-0.12,0.3s-0.18,0.12-0.3,0.12h-7.03
		c-0.12,0-0.22-0.04-0.3-0.12s-0.12-0.18-0.12-0.3v-1.65c0-0.12,0.04-0.22,0.12-0.3s0.19-0.12,0.33-0.12l3.55,0.18
		c-0.56-0.84-1.29-1.51-2.2-2s-1.88-0.74-2.94-0.74c-1.45,0-2.74,0.45-3.85,1.34s-1.83,2.03-2.16,3.41
		c-0.02,0.09-0.08,0.17-0.16,0.23s-0.17,0.09-0.26,0.09H7.89c-0.14,0-0.25-0.05-0.33-0.16s-0.11-0.22-0.09-0.33
		c0.26-1.34,0.8-2.54,1.62-3.62s1.83-1.93,3.04-2.55s2.51-0.93,3.92-0.93c1.31,0,2.54,0.27,3.69,0.81s2.13,1.29,2.95,2.25L22.55,7.4
		z"
                  />
                </g>
              </svg>
            </div>
            <span> CHANGE </span>
          </div>
          <div
            class="bg-tertiary-700 font-press text-xs text-shadow flex items-center justify-center gap-1.5"
          >
            <div class="w-7 h-7 p-px svg-shadow-primary rounded-full">
              <svg viewBox="0 0 32.61 32.61">
                <g>
                  <path
                    class="st0"
                    d="M25.16,10.21c0.21,0.23,0.32,0.5,0.32,0.81s-0.11,0.56-0.32,0.77l-12.8,12.8c-0.21,0.21-0.47,0.32-0.77,0.32
		s-0.57-0.11-0.81-0.32L7.79,21.6c-0.21-0.23-0.32-0.5-0.32-0.81s0.11-0.56,0.32-0.77l12.8-12.8c0.21-0.21,0.47-0.32,0.77-0.32
		s0.57,0.11,0.81,0.32L25.16,10.21z M10.29,12.53l-0.95-1.86L7.48,9.71l1.86-0.95l0.95-1.86l0.95,1.86l1.86,0.95l-1.86,0.95
		L10.29,12.53z M15.35,10.28l-0.56-1.13l-1.13-0.56l1.13-0.56l0.56-1.13l0.56,1.13l1.13,0.56l-1.13,0.56L15.35,10.28z M20.1,14.04
		l3.06-3.02l-1.79-1.79l-3.02,3.06L20.1,14.04z M22.67,17.03l0.95,1.86l1.86,0.95l-1.86,0.95l-0.95,1.86l-0.95-1.86l-1.86-0.95
		l1.86-0.95L22.67,17.03z"
                  />
                </g>
              </svg>
            </div>
            <span> EFFECT </span>
          </div>
        </div>
        <div class="relative">
          <div class="text-xs px-4 py-6.5 flex justify-end gap-2">
            <span class="text-tertiary-400">2</span>
            <font-awesome-icon
              :icon="['fas', 'thumbs-up']"
              class="text-primary-900 text-sm"
            />
          </div>
          <div class="h-52 mt-2.5 text-white text-13 px-8 leading-6">
            Provide prompt instructions to the AI to change the variable NFT's
            appearance
          </div>
          <div class="bg-tertiary-810 text-white h-11.25">
            <div class="px-4 text-sm flex items-center h-full">Change</div>
          </div>
          <div class="bg-tertiary-710 text-11 h-11.25 flex">
            <nftmx-input
              border="none"
              placeholder="Enter your prompt to change the NFT"
              class="h-11.25"
            />
            <div
              class="bg-tertiary-750 w-13 text-primary-900 text-xl flex justify-center items-center cursor-pointer hover:text-white hover:bg-primary-900 transition shadow-default hover:shadow-primary-900"
            >
              <font-awesome-icon :icon="['fab', 'telegram-plane']" />
            </div>
          </div>
          <div
            class="w-4 h-full absolute left-0 top-0 bg-gradient-to-r from-tertiary-800"
          />
        </div>
      </div>
      <div v-else class="bg-tertiary-800 w-2.5">
        <div class="relative w-full h-img grid gap-0.5 text-4xl">
          <div class="bg-black" />
          <div class="bg-black" />
        </div>
        <div class="relative mt-0.5">
          <div class="h-56" />
          <div class="bg-tertiary-810 h-11.25" />
          <div class="bg-tertiary-710 h-11.25" />
          <div class="w-full h-15 bg-tertiary-750" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.child {
  color: rgb(21, 21, 21);
  fill: rgb(21, 21, 21);
}
.parent:hover .child {
  background-color: rgb(21, 21, 21);
  color: rgb(148, 148, 148);
  fill: rgb(148, 148, 148);
}
.parent:hover .child-bg {
  background-color: black;
  opacity: 0.8;
}
.h-img {
  height: calc(100% - 376px);
}
.left-cal {
  left: calc(-100% - 18px);
}
.svg-shadow-primary {
  background-image: radial-gradient(
    circle at center,
    rgb(25 203 88 / 50%) 0%,
    rgb(25 203 88 / 20%) 30%,
    rgb(25 203 88 / 10%) 50%,
    rgb(0 0 0 / 0) 100%
  );
}
.svg-shadow-white {
  background-image: radial-gradient(
    circle at center,
    rgb(255 255 255 / 50%) 0%,
    rgb(255 255 255 / 20%) 30%,
    rgb(255 255 255 / 10%) 50%,
    rgb(0 0 0 / 0) 100%
  );
}
</style>

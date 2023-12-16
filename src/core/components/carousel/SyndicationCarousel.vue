<script setup>
import { computed, onMounted, onUnmounted, ref, watchEffect } from "vue";
import BundleImage from "@/core/components/basic/BundleImage.vue";
import NftmxButton from "@/core/components/basic/NftmxButton.vue";
import NftmxProgressBar from "@/core/components/basic/NftmxProgressBar.vue";
import NftmxPriceCommon from "@/core/components/price/NftmxPriceCommon.vue";
import Timer from "@/core/components/timer/Timer.vue";
import NftmxHelp from "@/core/components/basic/NftmxHelp.vue";
import { themeConfig } from "@/core/config/constant";
import { useStore } from "vuex";
import syndicationsService from "@/core/services/market/syndications.service";
import NftmxTooltip from "@/core/components/basic/NftmxTooltip.vue";
import { roundTo } from "@/core/utils/common";

const props = defineProps({
  carouselPlay: Boolean,
});

const store = useStore();
const syndicationNfts = ref([]);
const inner = ref(null);
const left = ref(0);
const anim = ref(null);
const windowWidth = computed(() => store.state.app.windowWidth);
const walletAddress = computed(() => store.getters["auth/walletAddress"]);
const coinPrice = computed(
  () => store.state.market.coinPrice["BSC_TESTNET"] || 1
);

const joinSyndication = () => {
  if (!walletAddress.value) {
    openConnectWalletModal();
  }
};
const openConnectWalletModal = () => {
  store.commit("app/OPEN_CONNECT_WALLET_MODAL");
};
watchEffect(() => {
  if (!anim.value & props.carouselPlay) {
    anim.value = setInterval(() => {
      left.value = left.value - 1;
      if (left.value < -inner.value.scrollWidth / 2) {
        left.value = 0;
      }
    }, 50);
  } else if (anim.value && !props.carouselPlay) {
    clearInterval(anim.value);
    anim.value = null;
  }
});
onMounted(() => {
  syndicationsService.find().then((res) => {
    syndicationNfts.value = res.data;
  });
});
onUnmounted(() => {
  clearInterval(anim.value);
  anim.value = null;
});
</script>

<template>
  <div class="w-full overflow-hidden">
    <div
      :class="['relative w-full flex inner z-10']"
      :style="{ left: left + 'px' }"
      ref="inner"
    >
      <div
        class="flex"
        v-for="(nft, index) in [...syndicationNfts, ...syndicationNfts]"
        :key="index"
      >
        <div
          class="w-max transition grid sm:grid-cols-2 m-4 cursor-default parent hover:shadow-default hover:shadow-primary-700"
        >
          <div
            class="relative w-70.75 h-70.75 2xl:w-82.5 2xl:h-82.5 overflow-hidden col-span-2 sm:col-span-1"
          >
            <bundle-image :images="nft.imageUrl" />
            <div
              class="absolute z-15 top-3 left-3 flex flex-col gap-1 transition"
            >
              <nftmx-tooltip
                :adjust="10"
                :text="
                  'This NFT belongs to the ' +
                  (nft.contract.chain === 'ETHEREUM'
                    ? 'Ethereum'
                    : 'BSC Testnet') +
                  ' blockchain'
                "
              >
                <div
                  class="child rounded-full w-7 h-7 flex items-center justify-center"
                >
                  <font-awesome-icon
                    v-if="nft.contract.chain === 'ETHEREUM'"
                    :icon="['fab', 'ethereum']"
                    class="text-lg"
                  />
                  <div
                    v-if="nft.contract.chain === 'BSC-TESTNET'"
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
                v-if="nft.mlrContract"
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
                v-if="nft.mlrContract"
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
                v-if="nft.currentOrder && nft.currentOrder.orderType === '1'"
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
                v-if="nft.currentOrder && nft.currentOrder.orderType === '0'"
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
          </div>
          <div
            class="relative w-70.75 h-70.75 2xl:w-82.5 2xl:h-82.5 bg-black text-white pt-11.25"
          >
            <div
              class="absolute top-0 -right-1 w-fill h-10 2xl:h-11.25 bg-primary-900 bg-opacity-70 font-ibm-medium text-white text-11 2xl:text-13 flex items-center justify-center"
            >
              <div>
                <font-awesome-icon
                  :icon="['fas', 'shield-alt']"
                  class="text-sm mt-0.5"
                />
                <span> Liquidity Protection </span>
              </div>
              <div
                class="w-2 h-2 absolute right-0.5 -bottom-1 bg-primary-900 rotate-45 -z-10"
              ></div>
            </div>
            <div class="px-6 pt-1.5 pb-4">
              <div class="2xl:py-2.75 text-left font-ibm-medium">
                <div class="text-11 tracking-wider leading-5">
                  <div class="flex justify-between">
                    <span>
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
                      {{ (nft.currentOrder.protectionTime / 86400).toFixed() }}
                      Days
                    </span>
                  </div>
                  <div class="flex justify-between">
                    <span>
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
                      <span class="text-tertiary-400">
                        Slippage
                        {{ 100 - nft.currentOrder.protectionRate }}%
                      </span>
                      <div class="h-2.5 mx-1.5 border-l border-tertiary-400" />
                      <span class="text-primary-900"> Staking {{ 7.5 }}% </span>
                    </div>
                  </div>
                  <div class="border-t border-tertiary-700 mt-2.75 mb-1.5" />
                  <div class="flex justify-between">
                    <span>
                      Syndication Type
                      <nftmx-tooltip
                        text="Syndication type can be either an auction or fixed sale"
                      >
                        <sup>
                          <font-awesome-icon
                            :icon="['fas', 'question-circle']"
                            class="text-11 cursor-pointer"
                          />
                        </sup>
                      </nftmx-tooltip>
                    </span>
                    <span class="text-primary-900">
                      {{
                        nft.currentOrder.orderType === "1"
                          ? "Auction"
                          : "Fixed sale"
                      }}
                    </span>
                  </div>
                  <div class="flex justify-between">
                    <span>
                      TVL
                      <nftmx-tooltip
                        text="Amount of funds pending in the syndication to purchase the NFT"
                      >
                        <sup>
                          <font-awesome-icon
                            :icon="['fas', 'question-circle']"
                            class="text-11 cursor-pointer"
                          />
                        </sup>
                      </nftmx-tooltip>
                    </span>
                    <div class="flex items-center">
                      <div class="text-primary-900 flex items-center gap-1">
                        <div
                          v-if="nft.contract.chain === 'BSC-TESTNET'"
                          class="text-xs w-3 h-3 text-primary-900"
                        >
                          <svg viewBox="0 0 24 24">
                            <path
                              d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                              fill="#19cb58"
                            />
                          </svg>
                        </div>
                        <font-awesome-icon
                          v-if="nft.contract.chain === 'ETHEREUM'"
                          :icon="['fab', 'ethereum']"
                        />
                        {{ roundTo(nft.syndication.total) }}
                      </div>
                      <span class="ml-1 text-tertiary-400">
                        [${{ roundTo(nft.syndication.total * coinPrice) }}]
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mt-2.25 2xl:mt-1.25 h-1.75">
                <div class="w-full h-1.75 bg-tertiary-700">
                  <div
                    class="bg-primary-900 h-full"
                    :style="{
                      width: `${
                        (nft.syndication.total / nft.currentOrder.tokenPrice) *
                        100
                      }%`,
                    }"
                  />
                </div>
              </div>
              <div class="mt-2 2xl:mt-3.25 text-11 tracking-wider">
                <div v-if="nft.currentOrder.orderType === '0'">
                  <div class="text-center">Asking price</div>
                  <div class="flex items-end pt-1.75 w-fit mx-auto max-w-full">
                    <div
                      class="flex items-center text-lg text-primary-900 font-ibm-medium"
                    >
                      <div
                        v-if="nft.contract.chain === 'BSC-TESTNET'"
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
                      <font-awesome-icon
                        v-if="nft.contract.chain === 'ETHEREUM'"
                        :icon="['fab', 'ethereum']"
                      />
                      <span class="ml-1">
                        {{ nft.currentOrder.tokenPrice }}
                      </span>
                    </div>
                    <div class="text-tertiary-400">
                      <span class="ml-2">[$</span>
                      <span>
                        {{
                          (nft.currentOrder.tokenPrice * coinPrice).toFixed(1)
                        }}
                      </span>
                      <span>]</span>
                    </div>
                  </div>
                </div>
                <div v-else>
                  <div class="font-ibm text-11 tracking-wider text-center">
                    Current auction ends in
                  </div>
                  <div class="flex justify-center mt-2.75 2xl:mt-2.25">
                    <timer
                      :size="windowWidth >= themeConfig.xl2 ? 'head' : 'small'"
                      :time="
                        parseInt(
                          nft.currentOrder.endSaleTime -
                            new Date().getTime() / 1000
                        )
                      "
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="absolute left-0 bottom-0 w-full">
              <component
                :is="walletAddress ? 'router-link' : 'div'"
                :to="{
                  name: 'asset',
                  params: {
                    chain: nft.contract.chain,
                    tokenAddress: nft.contract.address,
                    tokenId: nft.tokenId,
                  },
                }"
                target="_blank"
                @click="joinSyndication"
              >
                <nftmx-button
                  color="secondary"
                  label="JOIN SYNDICATION"
                  class="font-press w-full text-xs 2xl:text-sm h-12.5 2xl:h-15"
                />
              </component>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.inner {
  transition: transform 5s;
  transition-timing-function: linear;
}
/* optional */
button {
  margin-right: 5px;
  margin-top: 10px;
}
.w-fill {
  width: calc(100% + 4px);
}
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
</style>

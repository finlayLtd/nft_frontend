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
import NftmxTrimString from "../basic/NftmxTrimString.vue";
import { CHAIN_ROUTES } from "@/core/config/constant";
import BundleImage from "../basic/BundleImage.vue";
import AssetCardCarousel from "../carousel/AssetCardCarousel.vue";
import { roundTo, getChainKey } from "@/core/utils/common";
import NftmxTooltip from "../basic/NftmxTooltip.vue";
import NftmxImg from "../basic/NftmxImg.vue";
import Web3 from "web3/dist/web3.min.js";
import { cancelOffer } from "@/core/utils/contracts/market.utils";

const props = defineProps({
  offer: Object,
});

const emit = defineEmits(["cancel-offer"]);

const store = useStore();
const toast = useToast();
const userId = computed(() => store.getters["auth/userId"]);
const chainKey = getChainKey(props.offer.nft.contract.chain);
const coinPrice = computed(() => store.state.market.coinPrice[chainKey] || 1);
const vote = computed(
  () =>
    props.offer.nft &&
    props.offer.nft.votes &&
    props.offer.nft.votes.find((item) =>
      item.id === store.getters["auth/userId"] ? true : false
    )
);
const voteCount = computed(() =>
  props.offer.nft && props.offer.nft.votes ? props.offer.nft.votes.length : 0
);
const windowWidth = computed(() => store.state.app.windowWidth);
const card = ref(null);
const transferred = ref("not");
const price = ref(0);
const image = computed(() =>
  props.offer.nft.imageUrl && props.offer.nft.imageUrl.indexOf("ipfs://") === 0
    ? props.offer.nft.imageUrl.replace("ipfs://", "https://ipfs.io:/ipfs/")
    : props.offer.nft.imageUrl
);
const bundleImage = computed(() =>
  props.offer.nft.nfts && props.offer.nft.nfts.length > 0
    ? props.offer.nft.nfts.map((nft) => nft.imageUrl)
    : []
);
const voteWaiting = ref(false);
const selectedofferIndex = ref(0);

const handleVote = async () => {
  if (voteWaiting.value) return;
  voteWaiting.value = true;
  await marketService.vote(
    userId.value,
    CHAIN_ROUTES.BSC_TESTNET,
    props.offer.nft.contract.address,
    props.offer.nft.tokenId
  );
  voteWaiting.value = false;
  const index = props.offer.nft.votes.findIndex(
    (item) => item.id === userId.value
  );
  if (index > -1) {
    props.offer.nft.votes.splice(index, 1);
  } else {
    props.offer.nft.votes.push(store.state.user);
  }
};
const cancelMyOffer = () => {
  cancelOffer(props.offer.orderId)
    .then((res) => {
      emit("cancel-offer", props.offer.id);
    })
    .catch((err) => console.log("err: ", err));
};
</script>

<template>
  <div ref="card" class="w-full">
    <div>
      <div class="relative w-full overflow-hidden pt-73per bg-black">
        <div
          v-if="bundleImage.length > 0"
          class="w-full h-full absolute top-0 left-0 object-cover"
        >
          <asset-card-carousel
            :images="bundleImage"
            v-model="selectedAssetIndex"
          />
        </div>
        <nftmx-img
          v-else
          :src="image"
          class="w-full h-full absolute top-0 left-0 object-cover text-6xl"
        />
        <ribbon
          v-if="offer"
          :percent="offer.protectionRate"
          :period="Math.ceil(offer.protectionTime / 86400)"
        />
        <div
          class="bg-black bg-opacity-80 w-full h-full absolute top-0 left-0 text-white"
        >
          <div
            class="flex flex-col justify-around items-center h-full py-8 text-xs"
          >
            <div>
              <span> Offer price: </span>
              <span> {{ offer.tokenPrice }} </span>
              <span> BNB </span>
            </div>
            <div>
              <span
                class="text-red-700 font-ibm-medium cursor-pointer"
                @click="cancelMyOffer"
              >
                Cancel Offer
              </span>
            </div>
            <div class="text-tertiary-400">
              {{
                offer.orderStatus === "0"
                  ? "Due date left for expiration"
                  : "Due date left for protection"
              }}
            </div>
            <timer
              :time="
                offer.endSaleTime - new Date().getTime() / 1000 > 0
                  ? parseInt(
                      offer.endSaleTime - new Date().getTime() / 1000
                    )
                  : 0
              "
            />
          </div>
        </div>
      </div>
      <div class="relative px-4.5 pt-5 pb-8 bg-tertiary-700">
        <div class="flex text-white overflow-hidden">
          <div class="flex-1 text-base font-ibm-bold leading-6 pr-2 h-16">
            <nftmx-trim-string :line="2">
              {{ offer.nft.name || "#" + offer.nft.tokenId }}
            </nftmx-trim-string>
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
        <div
          class="text-11 items-baseline font-ibm-light leading-4.5 text-white"
        >
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
                    (offer.nft.athPrice / (offer.nft.baselinePrice || 1)) * 100
                  )
                }}%
              </span>
              <span class="ml-1 text-tertiary-400">
                [{{
                  roundTo(offer.nft.athPrice / (offer.nft.baselinePrice || 1))
                }}x]
              </span>
            </div>
          </div>
          <div class="flex justify-between items-end">
            <div class="flex">
              <span class="font-ibm-medium">Last Value</span>
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
              <span class="text-primary-900 flex items-center gap-1">
                <font-awesome-icon
                  v-if="offer.nft.contract.chain === 'ETHEREUM'"
                  :icon="['fab', 'ethereum']"
                />
                <div
                  v-if="offer.nft.contract.chain === 'BSC-TESTNET'"
                  class="w-3 h-3 fill-primary-900"
                >
                  <svg viewBox="0 0 24 24">
                    <path
                      d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                    />
                  </svg>
                </div>
                {{ offer.nft.lastPrice ? offer.nft.lastPrice : 0 }}
              </span>
              <span class="ml-1 text-tertiary-400">
                <span>[$</span>
                <span>
                  {{
                    offer.nft.lastPrice
                      ? roundTo(offer.nft.lastPrice * coinPrice)
                      : 0
                  }}
                </span>
                <span>]</span>
              </span>
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
                {{ offer ? Math.round(offer.protectionTime / 86400) : 0 }}
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
                    offer && offer.protectionRate < 100
                      ? 'text-primary-900'
                      : 'text-tertiary-400',
                  ]"
                >
                  Slippage
                  {{ offer ? 100 - offer.protectionRate : 0 }}%
                </span>
                <div class="h-2.5 mx-1.5 border-l border-tertiary-400" />
                <span
                  :class="[
                    offer.useDepository
                      ? 'text-primary-900'
                      : 'text-tertiary-400',
                  ]"
                >
                  Staking
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Ribbon from "@/core/components/basic/Ribbon.vue";
import NftmxButton from "@/core/components/basic/NftmxButton.vue";
import { computed, ref } from "vue";
import Timer from "@/core/components/timer/Timer.vue";
import { useStore } from "vuex";
import { roundTo, getChainKey } from "@/core/utils/common";
import { MainToken, CHAIN_ROUTES } from "@/core/config/constant";
import Web3 from "web3/dist/web3.min.js";
import NftmxImg from "@/core/components/basic/NftmxImg.vue";
import NftmxTrimString from "@/core/components/basic/NftmxTrimString.vue";
import NftmxTransferModal from "@/core/components/modal/NftmxTransferModal.vue";
import NftmxCancelModal from "@/core/components/modal/NftmxCancelModal.vue";
import { useToast } from "vue-toastification";
import { safeTransferFrom } from "@/core/utils/contracts/erc721.utils";
import marketService from "@/core/services/market.service";
import {
  claimDownsideProtectionAmount,
  cancelOrderBySeller,
} from "@/core/utils/contracts/market.utils";
import BasicCheckbox from "@/core/components/basic/BasicCheckbox.vue";
import NftmxTooltip from "@/core/components/basic/NftmxTooltip.vue";
import BundleImage from "@/core/components/basic/BundleImage.vue";
import AssetCardCarousel from "@/core/components/carousel/AssetCardCarousel.vue";

const props = defineProps({
  token: { type: Object, default: {} },
});

const emit = defineEmits(["select-order", "vote", "unfavorite-token"]);

const store = useStore();
const walletAddress = computed(() => store.getters["auth/walletAddress"]);
const userId = computed(() => store.getters["auth/userId"]);
const coinPrice = computed(() => store.state.market.coinPrice);
const toast = useToast();
const option = ref(false);
const assetLink = computed(
  () =>
    window.location.origin +
    "/asset/" +
    props.token.chain +
    "/" +
    props.token.contract.address +
    "/" +
    props.token.tokenId
);
const tokenImages = computed(() => {
  if (props.token.nfts && props.token.nfts.length > 0) {
    return props.token.nfts.map((nft) => nft.imageUrl);
  } else {
    return null;
  }
});

const onCopy = (e) => {
  toast.success("Link is copied");
};
const makeProfilePicture = (image) => {
  marketService.updateProfilePicture(userId.value, image).then((res) => {
    store.dispatch("auth/updateProfilePicture", res.data.profile_img);
  });
};
const cancelSale = () => {
  cancelOrderBySeller(props.token.currentOrder.contractAddress, [
    props.token.currentOrder.orderId,
  ]).then((res) => {
    props.token.currentOrder = null;
  });
};
const vote = () => {
  emit("vote", props.token);
};
const selectToken = (checked) => {
  emit("select-order", props.token, checked);
};
</script>

<template>
  <div>
    <div class="w-full relative bg-tertiary-700">
      <div class="hover:shadow-primary-900 transition hover:shadow-default">
        <div class="bg-tertiary-400 relative">
          <div class="relative w-full pt-65per overflow-hidden p-6 text-5xl">
            <div
              v-if="tokenImages && tokenImages.length > 3"
              class="absolute top-0 left-0 w-full h-full"
            >
              <asset-card-carousel :images="tokenImages" />
            </div>
            <bundle-image
              v-else-if="tokenImages && tokenImages.length < 4"
              :images="tokenImages"
              class="w-full h-full absolute top-0 left-0 object-cover"
            />
            <nftmx-img
              v-else
              :src="token.imageUrl"
              class="w-full h-full absolute top-0 left-0 object-cover bg-black"
            />
            <ribbon
              v-if="
                token.currentOrder &&
                token.currentOrder.protectionRate > 0 &&
                token.currentOrder.protectionTime > 0
              "
            />
          </div>
        </div>
        <div class="px-4.75 py-5.25">
          <div>
            <div class="relative h-12 mt-1 mb-0.5">
              <div class="flex justify-between gap-4">
                <router-link
                  :to="{
                    name: 'asset',
                    params: {
                      chain: token.contract.chain,
                      tokenAddress: token.contract.address,
                      tokenId: token.tokenId,
                    },
                  }"
                  target="_blank"
                  class="cursor-pointer"
                >
                  <nftmx-trim-string
                    :line="2"
                    class="text-white font-ibm-medium text-15 leading-5.25"
                  >
                    {{ token.name || "#" + token.tokenId }}
                  </nftmx-trim-string>
                </router-link>
                <div
                  v-click-outside="
                    () => {
                      option = false;
                    }
                  "
                  @click="option = !option"
                  class="transition text-white hover:text-primary-900 text-lg cursor-pointer"
                >
                  <font-awesome-icon :icon="['fas', 'ellipsis-v']" />
                </div>
                <div
                  @click.stop
                  @mousedown.stop
                  class="absolute -right-5 bottom-14"
                >
                  <div
                    v-show="option"
                    class="w-52 px-5.5 py-3.25 bg-black text-white hover:text-primary-900 leading-9.5 text-11 cursor-default"
                  >
                    <div
                      v-if="
                        token.owner.walletAddress === walletAddress &&
                        token.currentOrder
                      "
                      @click="cancelSale"
                      class="transition text-red-700 hover:text-red-900 cursor-pointer"
                    >
                      Delist
                    </div>
                    <router-link
                      v-else
                      :to="{
                        name: 'asset',
                        params: {
                          chain: token.contract.chain,
                          tokenAddress: token.contract.address,
                          tokenId: token.tokenId,
                        },
                      }"
                      target="_blank"
                      class="transition text-primary-900 hover:text-primary-900 cursor-pointer"
                    >
                      <div>
                        {{
                          token.owner.walletAddress === walletAddress
                            ? "List for Sale"
                            : token.currentOrder &&
                              token.currentOrder.orderType === "0"
                            ? "Buy now"
                            : token.currentOrder &&
                              token.currentOrder.orderType === "0"
                            ? "Bid now"
                            : "Make an Offer"
                        }}
                      </div>
                    </router-link>
                    <div
                      v-clipboard:copy="assetLink"
                      v-clipboard:success="onCopy"
                      class="transition text-white hover:text-primary-900 cursor-pointer"
                    >
                      Copy link
                    </div>
                    <div
                      v-if="token.imageUrl"
                      @click="makeProfilePicture(token.imageUrl)"
                      class="transition text-white hover:text-primary-900 cursor-pointer"
                    >
                      Make profile picture
                    </div>
                    <div
                      @click="emit('unfavorite-token', token)"
                      class="transition text-red-600 hover:text-red-900 cursor-pointer"
                    >
                      Unfavorite
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="text-11 leading-4.5 text-white font-ibm">
              <div class="flex justify-between items-end">
                <div class="flex">
                  <span class="font-ibm-medium">ROI</span>
                  <nftmx-tooltip
                    text="ROI from baseline price to all time high."
                  >
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
                        (token.athPrice / (token.baselinePrice || 1)) * 100
                      )
                    }}%
                  </span>
                  <span class="ml-1 text-tertiary-400">
                    [{{
                      roundTo(token.athPrice / (token.baselinePrice || 1))
                    }}x]
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
                  <span class="text-primary-900 flex items-center gap-1">
                    <font-awesome-icon
                      v-if="token.contract.chain === 'ETHEREUM'"
                      :icon="['fab', 'ethereum']"
                    />
                    <div
                      v-if="token.contract.chain === 'BSC-TESTNET'"
                      class="w-3 h-3 fill-primary-900"
                    >
                      <svg viewBox="0 0 24 24">
                        <path
                          d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                        />
                      </svg>
                    </div>
                    {{ token.currentOrder ? token.currentOrder.tokenPrice : 0 }}
                  </span>
                  <span class="ml-1 text-tertiary-400">
                    <span>[$</span>
                    <span>
                      {{
                        token.currentOrder
                          ? roundTo(token.currentOrder.tokenPrice * coinPrice)
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
                    token.mlrContract && token.mlrContract.owners
                      ? 'text-primary-900'
                      : 'text-tertiary-400',
                  ]"
                >
                  {{
                    token.mlrContract && token.mlrContract.owners
                      ? token.mlrContract.owners.length
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
                      token.mlrContract && token.mlrContract.owners
                        ? 'text-primary-900'
                        : 'text-tertiary-400',
                    ]"
                  >
                    {{
                      token.mlrContract && token.mlrContract.owners
                        ? token.mlrContract.owners.reduce(
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
                    token.currentOrder
                      ? Math.round(token.currentOrder.protectionTime / 86400)
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
                      token.currentOrder &&
                      token.currentOrder.protectionRate < 100
                        ? 'text-primary-900'
                        : 'text-tertiary-400',
                    ]"
                  >
                    Slippage
                    {{
                      token.currentOrder
                        ? 100 - token.currentOrder.protectionRate
                        : 0
                    }}%
                  </span>
                  <div class="h-2.5 mx-1.5 border-l border-tertiary-400" />
                  <span
                    :class="[
                      token.staking ? 'text-primary-900' : 'text-tertiary-400',
                    ]"
                  >
                    Staking
                  </span>
                </div>
              </div>
            </div>
            <div
              class="flex justify-between items-center font-ibm-medium mt-5.5 h-5"
            >
              <div class="flex-1">
                <div class="text-sm flex items-center">
                  <basic-checkbox
                    @click.stop
                    border="border-black border"
                    small
                    class="w-8.5 h-5"
                    @check="selectToken"
                  >
                    <span class="text-xs relative text-tertiary-500 pl-6">
                      Unfavorite
                    </span>
                  </basic-checkbox>
                </div>
              </div>
              <div class="text-xs text-tertiary-500 flex font-ibm-medium">
                <div class="pr-2 leading-4.5">
                  {{ token.votes.length || 0 }}
                </div>
                <div
                  :class="[
                    token.votes.findIndex(
                      (user) => user.walletAddress === walletAddress
                    ) > -1
                      ? 'text-primary-900'
                      : 'text-white',
                    'hover:text-primary-900 transition cursor-pointer',
                  ]"
                  @click="vote()"
                >
                  <font-awesome-icon :icon="['fas', 'thumbs-up']" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="token.nfts && token.nfts.length > 0" class="px-2 shadow-xl">
      <div class="w-full h-1 bg-primary-200" />
      <div class="px-2">
        <div class="w-full h-1 bg-primary-100" />
      </div>
    </div>
  </div>
</template>

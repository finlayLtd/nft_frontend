<script setup>
import Ribbon from "@/core/components/basic/Ribbon.vue";
import NftmxButton from "@/core/components/basic/NftmxButton.vue";
import { computed, ref } from "vue";
import Timer from "@/core/components/timer/Timer.vue";
import { useStore } from "vuex";
import { roundTo } from "@/core/utils/common";
import { MainToken, CHAIN_ROUTES } from "@/core/config/constant";
import Web3 from "web3/dist/web3.min.js";
import NftmxImg from "@/core/components/basic/NftmxImg.vue";
import NftmxTrimString from "@/core/components/basic/NftmxTrimString.vue";
import NftmxTransferModal from "@/core/components/modal/NftmxTransferModal.vue";
import { useToast } from "vue-toastification";
import marketService from "@/core/services/market.service";
import BundleImage from "@/core/components/basic/BundleImage.vue";
import { useRoute } from "vue-router";
import AssetCardCarousel from "@/core/components/carousel/AssetCardCarousel.vue";

const props = defineProps({
  token: { type: Object, default: {} },
  account: Object,
});

const emit = defineEmits(["unbundle", "vote"]);

const store = useStore();
const route = useRoute();
const walletAddress = computed(() => store.getters["auth/walletAddress"]);
const userId = computed(() => store.getters["auth/userId"]);
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
const openTransferModal = ref(false);
const tokenImage = computed(() => {
  if (props.token.nfts) {
    return props.token.nfts.map((nft) => nft.imageUrl);
  } else {
    return "";
  }
});

const onCopy = (e) => {
  toast.success("Link is copied");
};
const transferNFT = () => {
  openTransferModal.value = false;
};
const unbundleNFT = () => {
  emit("unbundle", props.token);
};
const vote = () => {
  emit("vote", props.token);
};
</script>

<template>
  <div>
    <div class="w-full relative bg-tertiary-800">
      <div class="hover:shadow-primary-900 transition hover:shadow-default">
        <div class="bg-black relative">
          <div class="relative w-full pt-65per overflow-hidden p-6 text-5xl">
            <bundle-image
              v-if="tokenImage.length < 4"
              :images="tokenImage"
              class="w-full h-full absolute top-0 left-0 object-cover"
            />
            <div v-else class="absolute top-0 left-0 w-full h-full">
              <asset-card-carousel :images="tokenImage" />
            </div>
          </div>
        </div>
        <div class="px-4.75 py-5.25">
          <div>
            <div class="relative h-23 mb-0.5">
              <div class="flex justify-between gap-4">
                <div>
                  <div class="text-tertiary-400 text-11 leading-5 -mt-0.75">
                    <nftmx-trim-string :line="1">
                      Bundle of {{ tokenImage.length }}
                    </nftmx-trim-string>
                  </div>
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
                </div>
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
                  class="absolute -right-5 bottom-25"
                >
                  <div
                    v-show="option"
                    class="w-52 px-5.5 py-3.25 bg-black text-white hover:text-primary-900 leading-9.5 text-11 cursor-default"
                  >
                    <router-link
                      :to="{
                        name: 'asset',
                        params: {
                          chain: 'BSC-TESTNET',
                          tokenAddress: token.contract.address,
                          tokenId: token.tokenId,
                        },
                      }"
                      target="_blank"
                      class="transition text-primary-900 hover:text-primary-900 cursor-pointer"
                    >
                      <div>
                        {{
                          account?.walletAddress === walletAddress
                            ? "List for Sale"
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
                      v-if="account?.walletAddress === walletAddress"
                      @click="openTransferModal = true"
                      class="transition text-white hover:text-primary-900 cursor-pointer"
                    >
                      Transfer
                    </div>
                    <div
                      v-if="account?.walletAddress === walletAddress"
                      class="transition text-red-700 hover:text-red-900 cursor-pointer"
                      @click="unbundleNFT()"
                    >
                      Unbundle
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex justify-end items-center font-ibm-medium my-1 h-6">
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
    <div
      v-if="props.token.nfts && props.token.nfts.length > 0"
      class="px-2 shadow-xl"
    >
      <div class="w-full h-1 bg-primary-200" />
      <div class="px-2">
        <div class="w-full h-1 bg-primary-100" />
      </div>
    </div>
    <nftmx-transfer-modal v-model="openTransferModal" :token="token" />
  </div>
</template>

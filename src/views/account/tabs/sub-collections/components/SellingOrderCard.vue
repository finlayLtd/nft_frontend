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
import { safeTransferFrom } from "@/core/utils/contracts/erc721.utils";
import marketService from "@/core/services/market.service";
import { claimDownsideProtectionAmount } from "@/core/utils/contracts/market.utils";
import BasicCheckbox from "@/core/components/basic/BasicCheckbox.vue";

const props = defineProps({
  order: { type: Object, default: {} },
});

const emit = defineEmits(["claim-order"]);

const store = useStore();
const walletAddress = computed(() => store.getters["auth/walletAddress"]);
const userId = computed(() => store.getters["auth/userId"]);
const toast = useToast();
const option = ref(false);
const assetLink = computed(
  () =>
    window.location.origin +
    "/asset/" +
    props.order.chain +
    "/" +
    props.order.tokenAddress +
    "/" +
    props.order.tokenId
);

const onCopy = (e) => {
  toast.success("Link is copied");
};
const makeProfilePicture = (image) => {
  marketService.updateProfilePicture(userId.value, image).then((res) => {
    store.dispatch("auth/updateProfilePicture", res.data.profile_img);
  });
};
const claimOrder = () => {
  emit("claim-order", props.order);
};
</script>

<template>
  <div>
    <div class="w-full relative bg-tertiary-800">
      <div
        :class="[
          order.protectionExpiryTime < new Date().getTime() / 1000
            ? 'hover:shadow-white'
            : 'hover:shadow-red-600',
          ' transition hover:shadow-default text-tertiary-400 hover:text-red-600',
        ]"
      >
        <div class="bg-tertiary-400 relative">
          <div class="relative w-full pt-65per overflow-hidden p-6 text-5xl">
            <nftmx-img
              :src="order.nft.imageUrl"
              class="w-full h-full absolute top-0 left-0 object-cover bg-black"
            />
          </div>
          <div
            class="bg-black w-full h-full absolute top-0 left-0 bg-opacity-80 font-ibm-medium text-11 text-tertiary-400"
          >
            <div
              class="pt-8 pb-7 px-1 flex flex-col justify-around w-full h-full"
            >
              <div>
                <div class="text-center text-white">
                  Sold price:
                  {{ order.tokenPrice }}
                  BNB
                </div>
                <div class="text-center text-white">
                  Slippage:
                  <span>
                    {{ 100 - order.protectionRate }}
                  </span>
                  <span>%</span>
                </div>
                <div class="text-center text-white">
                  Staking leverage:
                  <span>
                    {{ order.useDepository ? "Yes" : "No" }}
                  </span>
                </div>
              </div>
              <div>
                <div class="text-center">Due date left for protection</div>
                <div class="flex justify-center mt-2">
                  <timer
                    :time="
                      parseInt(
                        order.protectionExpiryTime -
                          new Date().getTime() / 1000 >
                          0
                          ? order.protectionExpiryTime -
                              new Date().getTime() / 1000
                          : 0
                      )
                    "
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="px-4.75 py-5.25">
          <div>
            <div class="relative h-21 mb-0.5">
              <div>
                <div class="text-tertiary-400 text-11 leading-5 -mt-0.75">
                  <nftmx-trim-string :line="1">
                    {{
                      order.nft.contract && order.nft.contract.name
                        ? order.nft.contract.name
                        : "No name"
                    }}
                  </nftmx-trim-string>
                </div>
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
                  class="cursor-pointer"
                >
                  <nftmx-trim-string
                    :line="2"
                    class="text-white font-ibm-medium text-15 leading-5.25"
                  >
                    {{ order.nft.name || "#" + order.nft.tokenId }}
                  </nftmx-trim-string>
                </router-link>
              </div>
            </div>
            <div class="w-full h-10 font-ibm-medium text-sm">
              <!-- <nftmx-button
                outline
                color="primary"
                label="Claim APY"
                h="base"
                w="full"
              /> -->
              <nftmx-button
                v-if="order.protectionExpiryTime < new Date().getTime() / 1000"
                outline
                color="white"
                label="Claim sale price and APY"
                h="base"
                w="full"
                customPx
                class="px-1"
                @click="claimOrder"
              />
              <div
                v-else
                class="text-center h-10 flex items-center justify-center"
              >
                <span>Claim Not Yet Available</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="order.nft.nfts && order.nft.nfts.length > 0"
      class="px-2 shadow-xl"
    >
      <div class="w-full h-1 bg-primary-200" />
      <div class="px-2">
        <div class="w-full h-1 bg-primary-100" />
      </div>
    </div>
  </div>
</template>

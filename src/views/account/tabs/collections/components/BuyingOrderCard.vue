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
import NftmxCancelModal from "@/core/components/modal/NftmxCancelModal.vue";
import { useToast } from "vue-toastification";
import { safeTransferFrom } from "@/core/utils/contracts/erc721.utils";
import marketService from "@/core/services/market.service";
import { claimDownsideProtectionAmount } from "@/core/utils/contracts/market.utils";
import BasicCheckbox from "@/core/components/basic/BasicCheckbox.vue";

const props = defineProps({
  order: { type: Object, default: {} },
});

const emit = defineEmits(["select-order", "vote", "cancel-purchase"]);

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
const cancelPurchaseModal = ref(false);

const onCopy = (e) => {
  toast.success("Link is copied");
};
const makeProfilePicture = (image) => {
  marketService.updateProfilePicture(userId.value, image).then((res) => {
    store.dispatch("auth/updateProfilePicture", res.data.profile_img);
  });
};
const cancelPurchase = () => {
  emit("cancel-purchase", props.order);
};
const vote = () => {
  emit("vote", props.order);
};
const selectOrder = (checked) => {
  emit("select-order", props.order, checked);
};
</script>

<template>
  <div>
    <div class="w-full relative bg-tertiary-800">
      <div class="hover:shadow-primary-900 transition hover:shadow-default">
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
              class="absolute top-0 left-0 bg-black w-full h-9.5 flex items-center justify-center font-ibm-medium text-sm text-primary-900"
            >
              {{ order.protectionRate }}%/{{
                parseInt(order.protectionTime) / 86400
              }}
              Liquidity Protection
            </div>
            <div
              class="pt-13 pb-5 px-1 flex flex-col justify-around w-full h-full"
            >
              <div class="text-center text-white">
                Purchase price:
                {{ roundTo(order.tokenPrice, 2) }}
                BNB
              </div>
              <div class="text-center">
                <button
                  class="transition text-red-900 hover:text-red-700 cursor-pointer"
                  @click="cancelPurchaseModal = true"
                >
                  Cancel purchase
                </button>
              </div>
              <div class="text-center">Due date left for protection</div>
              <div class="flex justify-center">
                <timer
                  :time="
                    parseInt(
                      order.protectionExpiryTime - new Date().getTime() / 1000 >
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
        <div class="px-4.75 py-5.25">
          <div>
            <div class="relative h-23 mb-0.5">
              <div class="flex justify-between gap-4">
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
                    <div
                      @click="cancelPurchaseModal = true"
                      class="transition text-red-700 hover:text-red-900 cursor-pointer"
                    >
                      Cancel purchase
                    </div>
                    <div
                      v-clipboard:copy="assetLink"
                      v-clipboard:success="onCopy"
                      class="transition text-white hover:text-primary-900 cursor-pointer"
                    >
                      Copy link
                    </div>
                    <div
                      v-if="order.nft.imageUrl"
                      @click="makeProfilePicture(order.nft.imageUrl)"
                      class="transition text-white hover:text-primary-900 cursor-pointer"
                    >
                      Make profile picture
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="flex justify-between items-center font-ibm-medium my-1 h-6"
            >
              <div class="flex-1">
                <div
                  v-if="order.orderType !== '2'"
                  class="text-sm flex items-center"
                >
                  <basic-checkbox
                    @click.stop
                    border="border-black border"
                    small
                    class="w-8.5 h-5"
                    @check="selectOrder"
                  >
                    <span
                      class="text-xs relative text-tertiary-500 pl-6 pt-0.5 flex w-max"
                    >
                      Cancel purchase
                    </span>
                  </basic-checkbox>
                </div>
              </div>
              <div class="text-xs text-tertiary-500 flex font-ibm-medium">
                <div class="pr-2 leading-4.5">
                  {{ order.nft.votes.length || 0 }}
                </div>
                <div
                  :class="[
                    order.nft.votes.findIndex(
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
      v-if="order.nft.nfts && order.nft.nfts.length > 0"
      class="px-2 shadow-xl"
    >
      <div class="w-full h-1 bg-primary-200" />
      <div class="px-2">
        <div class="w-full h-1 bg-primary-100" />
      </div>
    </div>
    <nftmx-cancel-modal
      v-model="cancelPurchaseModal"
      @confirm="cancelPurchase"
    />
  </div>
</template>

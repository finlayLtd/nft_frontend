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
import marketService from "@/core/services/market.service";
import { useRoute } from "vue-router";
import NftmxTooltip from "@/core/components/basic/NftmxTooltip.vue";
import BasicCheckbox from "@/core/components/basic/BasicCheckbox.vue";

const props = defineProps({
  token: { type: Object, default: {} },
  account: Object,
});

const emit = defineEmits(["transfer", "unhide", "vote", "select-token"]);

const store = useStore();
const route = useRoute();
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
const openTransferModal = ref(false);
const unhideChecked = ref(false);

const onCopy = (e) => {
  toast.success("Link is copied");
};
const transferNFT = () => {
  emit("transfer", props.token.id);
  openTransferModal.value = false;
};
const makeProfilePicture = (image) => {
  marketService.updateProfilePicture(userId.value, image).then((res) => {
    store.dispatch("auth/updateProfilePicture", res.data.profile_img);
  });
};
const unhide = () => {
  emit("unhide", props.token);
};
const vote = () => {
  emit("vote", props.token);
};
const selectToken = (checked) => {
  unhideChecked.value = checked;
  emit("select-token", props.token, checked);
};
</script>

<template>
  <div>
    <div class="w-full relative bg-tertiary-700">
      <div class="hover:shadow-primary-900 transition hover:shadow-default">
        <div class="bg-tertiary-400 relative">
          <div class="relative w-full pt-65per overflow-hidden p-6 text-5xl">
            <nftmx-img
              :src="token.imageUrl"
              class="w-full h-full absolute top-0 left-0 object-cover bg-black"
            />
            <ribbon v-if="token.lastOrder" />
          </div>
        </div>
        <div class="px-4.75 py-5.25">
          <div>
            <div class="relative h-12.5 my-1">
              <div class="flex justify-between items-start gap-4">
                <div>
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
                  class="absolute -right-5 bottom-14"
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
                      v-if="
                        account?.walletAddress === walletAddress &&
                        token.imageUrl
                      "
                      @click="makeProfilePicture(token.imageUrl)"
                      class="transition text-white hover:text-primary-900 cursor-pointer"
                    >
                      Make profile picture
                    </div>
                    <div
                      v-if="account?.walletAddress === walletAddress"
                      class="transition text-white hover:text-primary-900 cursor-pointer"
                      @click="unhide()"
                    >
                      Unhide
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
                    {{ token.lastOrder ? token.lastOrder.tokenPrice : 0 }}
                  </span>
                  <span class="ml-1 text-tertiary-400">
                    <span>[$</span>
                    <span>
                      {{
                        token.lastOrder
                          ? roundTo(token.lastOrder.tokenPrice * coinPrice)
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
            <div
              class="h-14 text-tertiary-400 text-11 text-center relative mt-3"
            >
              <div>
                <span> Last value </span>
                <div
                  v-if="token.lastPrice > 0"
                  class="flex items-end pt-2 w-fit mx-auto max-w-full"
                >
                  <div
                    class="flex items-center gap-2 text-lg text-primary-900 font-ibm-medium"
                  >
                    <font-awesome-icon
                      v-if="token.contract.chain === 'ETHEREUM'"
                      :icon="['fab', 'ethereum']"
                    />
                    <div
                      v-if="token.contract.chain === 'BSC-TESTNET'"
                      class="w-4 h-4 fill-primary-900"
                    >
                      <svg viewBox="0 0 24 24">
                        <path
                          d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                        />
                      </svg>
                    </div>
                    {{ roundTo(token.lastPrice) }}
                  </div>
                  <span class="ml-2">[$</span>
                  <span>
                    {{
                      roundTo(
                        token.lastPrice *
                          coinPrice[getChainKey(token.contract.chain)]
                      )
                    }}
                  </span>
                  <span>]</span>
                </div>
                <div v-else class="font-ibm text-2xl pt-1.75">-</div>
              </div>
            </div>
            <div
              class="flex justify-between items-center font-ibm-medium mt-5 h-6"
            >
              <div class="flex-1">
                <div
                  v-if="account?.walletAddress === walletAddress"
                  :class="[
                    unhideChecked ? 'text-primary-900' : 'text-tertiary-500',
                    'text-sm flex items-center hover:text-primary-900 w-fit cursor-pointer',
                  ]"
                >
                  <basic-checkbox
                    @click.stop
                    border="border-black border"
                    small
                    color="primary"
                    class="w-8.5 h-5"
                    @check="selectToken"
                  >
                    <span class="text-xs relative pl-6"> Unhide </span>
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
    <nftmx-transfer-modal
      v-model="openTransferModal"
      @transfer="transferNFT"
      :token="token"
    />
  </div>
</template>

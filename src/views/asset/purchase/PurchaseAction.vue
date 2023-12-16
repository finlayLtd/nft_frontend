<script setup>
import { computed, ref, watch, watchEffect } from "vue";
import Timer from "@/core/components/timer/Timer.vue";
import { useStore } from "vuex";
import { MainToken } from "@/core/config/constant";
import marketService from "@/core/services/market.service";
import { roundTo, formatAMPM, getChainKey } from "@/core/utils/common";
import OfferModal from "./OfferModal.vue";
import NftmxTooltip from "@/core/components/basic/NftmxTooltip.vue";
import NftmxButton from "@/core/components/basic/NftmxButton.vue";
import BuyModal from "./BuyModal.vue";
import SyndicationModal from "./SyndicationModal.vue";
import NftmxPriceCommon from "@/core/components/price/NftmxPriceCommon.vue";
import NftmxCancelModal from "@/core/components/modal/NftmxCancelModal.vue";
import BidModal from "./BidModal.vue";
import { useRoute } from "vue-router";
import {
  cancelOrderBySeller,
  cancelOffer,
} from "@/core/utils/contracts/market.utils";
import Web3 from "web3/dist/web3.min.js";
import { withdrawMarket } from "@/core/utils/contracts/syndication-market.utils.js";
import { withdrawMlr } from "@/core/utils/contracts/syndication-mlr.utils.js";
import { useToast } from "vue-toastification";
import syndicationsService from "@/core/services/market/syndications.service";

const props = defineProps({
  asset: Object,
  currentSale: Object,
  lastSale: Object,
  myOffer: Object,
});

const emit = defineEmits([
  "open-sale-modal",
  "open-offer-modal",
  "update-asset",
  "offer-created",
  "cancel-offer",
  "remove-backer",
]);

const store = useStore();
const route = useRoute();
const toast = useToast();
const chain = route.params.chain.toUpperCase();
const tokenAddress = route.params.tokenAddress.toLowerCase();
const tokenId = route.params.tokenId.toLowerCase();
const chainKey = getChainKey(chain);
const userId = computed(() => store.getters["auth/userId"]);
const walletAddress = computed(() => store.getters["auth/walletAddress"]);
const coinPrice = computed(() =>
  store.getters["market/getCoinPrice"](chainKey)
);
const syndicationModalActive = ref(false);
const syndicationHistory = ref([]);
const buyModalActive = ref(false);
const bidModalActive = ref(false);
const openCancelModal = ref(false);
const lastSaleDate = computed(() => {
  if (props.lastSale) {
    const date = new Date(props.lastSale.updatedAt);
    return (
      date.toLocaleString("default", { month: "long" }) +
      " " +
      date.getDate() +
      ", " +
      date.getFullYear() +
      " at " +
      formatAMPM(date) +
      " UTC"
    );
  }
  if (props.asset) {
    const date = new Date(props.asset.createdAt);
    return (
      date.toLocaleString("default", { month: "long" }) +
      " " +
      date.getDate() +
      ", " +
      date.getFullYear() +
      " at " +
      formatAMPM(date) +
      " UTC"
    );
  }
  return "No last sale";
});
const myInvestment = computed(() =>
  props.asset.syndication && props.asset.syndication.backers
    ? props.asset.syndication.backers.find(
        (item) => item.user.id === userId.value
      )
    : null
);
const loading = ref(false);

const formatDate = (d) => {
  const date = new Date(d);
  return (
    date.toLocaleString("default", { month: "long" }) +
    " " +
    date.getDate() +
    ", " +
    date.getFullYear() +
    " at " +
    formatAMPM(date) +
    " UTC"
  );
};
const handleBuyModal = (value) => {
  buyModalActive.value = value;
};
const cancelOrder = async () => {
  if (chain === "ETHEREUM") {
    toast.error("Ethereum network is not ready yet.");
    return;
  }
  if (!store.state.wallet.account) {
    toast.error("Please connect wallet.");
    return;
  }

  try {
    loading.value = true;
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x61" }],
    });

    cancelOrderBySeller(props.currentSale.contractAddress, [
      props.currentSale.orderId,
    ])
      .catch((err) => {
        console.log("err: ", err);
        if (err.code === 4001) {
          toast.error("User denied transaction signature.");
        } else {
          toast.error("Something went wrong.");
        }
      })
      .finally(() => {
        loading.value = false;
      });
  } catch (err) {
    if (err.code === 4001) {
      toast.error("User denied transaction signature.");
    } else {
      toast.error("Something went wrong");
    }
    loading.value = false;
  }
};
const cancelPurchase = async (order) => {
  store.state.marketContract.methods
    .claimDownsideProtectionAmount([props.asset.order.orderId])
    .send({ from: walletAddress.value })
    .then((res) => {})
    .catch((err) => {
      console.log("err: ", err);
    });
};
const offerCreated = (offer) => {
  emit("offer-created", offer);
};
const cancelMyOffer = async () => {
  loading.value = true;
  emit("cancel-offer", (res, err) => {
    loading.value = false;
  });
};
const updateSyndication = () => {
  emit("update-asset");
  syndicationModalActive.value = false;
};
const cancelInvestment = () => {
  if (myInvestment.value.lp <= 0) return;
  if (props.asset.mlrContract) {
    withdrawMlr(
      props.asset.syndication.address,
      Web3.utils.toWei(myInvestment.value.lp.toString())
    ).then((res) => {
      toast.success("Canceled your investment successfully");
      emit("update-asset");
    });
  } else {
    withdrawMarket(
      props.asset.syndication.address,
      Web3.utils.toWei(myInvestment.value.lp.toString())
    ).then((res) => {
      toast.success("Canceled your investment successfully");
      emit("update-asset");
    });
  }
};
const openConnectWalletModal = () => {
  store.commit("app/OPEN_CONNECT_WALLET_MODAL");
};
watch(syndicationModalActive, (val) => {
  if (val && props.asset.syndication) {
    syndicationsService
      .getHistory({ chain, id: props.asset.syndication.id })
      .then((res) => {
        syndicationHistory.value = res.data;
      });
  }
});
</script>

<template>
  <div>
    <div
      class="grid grid-cols-1 sm:grid-cols-2 items-center bg-tertiary-800 border border-black font-ibm-bold p-4 sm:p-7 gap-4"
    >
      <div v-if="currentSale && currentSale.orderType === '0'" class="pb-1">
        <div class="text-lg text-black font-ibm text-shadow-white">
          Asking Price
        </div>
        <div class="mt-2">
          <div class="flex flex-wrap items-end gap-2">
            <div
              class="font-ibm text-3xl leading-none 2xl:text-5xl text-primary-900 flex"
            >
              <div
                v-if="chain === 'BSC-TESTNET'"
                class="text-xs w-12 h-12 text-primary-900"
              >
                <svg viewBox="0 0 24 24">
                  <path
                    d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                    fill="#19cb58"
                  ></path>
                </svg>
              </div>
              <font-awesome-icon
                v-if="chain === 'ETHEREUM'"
                :icon="['fab', 'ethereum']"
              />
              <span class="ml-4">
                {{ currentSale ? roundTo(currentSale.tokenPrice) : 0 }}
              </span>
            </div>
            <div class="font-ibm text-sm 2xl:text-lg text-tertiary-400 gap-1">
              <span>[$</span>
              <span>
                {{
                  currentSale ? roundTo(currentSale.tokenPrice * coinPrice) : 0
                }}
              </span>
              <span>]</span>
            </div>
          </div>
        </div>
        <div class="mt-3.5 font-ibm-medium text-sm text-tertiary-400">
          <div class="flex flex-wrap items-end gap-2">
            <span>Floor price:</span>
            <div class="text-tertiary-400 flex items-center gap-2">
              <div
                v-if="chain === 'BSC-TESTNET'"
                class="text-xs w-4 h-4 fill-tertiary-400"
              >
                <svg viewBox="0 0 24 24">
                  <path
                    d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                  />
                </svg>
              </div>
              <font-awesome-icon
                v-if="chain === 'ETHEREUM'"
                :icon="['fab', 'ethereum']"
              />
              <span class="">
                {{ asset.floorPrice ? roundTo(asset.floorPrice) : 0 }}
              </span>
            </div>
            <div class="font-ibm">
              <span>[$</span>
              <span>
                {{
                  asset.floorPrice ? roundTo(asset.floorPrice * coinPrice) : 0
                }}
              </span>
              <span>]</span>
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="currentSale && currentSale.orderType === '1'">
        <div class="flex flex-col items-center sm:items-start pt-2.5">
          <div
            class="font-ibm text-11 text-tertiary-400 flex items-center gap-1.5"
          >
            Highest bid:
            <font-awesome-icon
              v-if="chain === 'ETHEREUM'"
              :icon="['fab', 'ethereum']"
              class="text-white text-xs"
            />
            <div
              v-if="chain === 'BSC-TESTNET'"
              class="text-xs w-3 h-3 fill-white"
            >
              <svg viewBox="0 0 24 24">
                <title>Binance</title>
                <path
                  d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                />
              </svg>
            </div>
            <span class="text-white">
              {{ currentSale.tokenPrice }}
            </span>
            [${{ roundTo(currentSale.tokenPrice * coinPrice, 2) }}]
          </div>
          <div class="mt-3.25 text-lg text-black font-ibm text-shadow-white">
            Current auction ends in
          </div>
          <timer
            size="big"
            color="tertiary-800"
            class="my-3.25"
            :time="
              parseInt(
                currentSale.endSaleTime - new Date().getTime() / 1000 > 0
                  ? currentSale.endSaleTime - new Date().getTime() / 1000
                  : 0
              )
            "
          />
        </div>
      </div>
      <div v-else-if="myOffer">
        <div class="leading-3 text-lg">Offer Value</div>
        <div class="mt-4.25 mb-3">
          <div class="flex flex-wrap items-end gap-2">
            <div
              class="font-ibm text-3xl leading-none 2xl:text-5xl text-primary-900 flex items-center"
            >
              <font-awesome-icon
                v-if="chain === 'ETHEREUM'"
                :icon="['fab', 'ethereum']"
              />
              <div
                v-if="chain === 'BSC-TESTNET'"
                class="text-xs w-7 h-7 2xl:w-9 2xl:h-9 fill-primary-900"
              >
                <svg viewBox="0 0 24 24">
                  <path
                    d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                  />
                </svg>
              </div>
              <span class="ml-4">
                {{ myOffer ? roundTo(myOffer.tokenPrice) : 0 }}
              </span>
            </div>
            <div class="font-ibm text-sm 2xl:text-lg text-tertiary-400 gap-1">
              <span>[$</span>
              <span>
                {{ myOffer ? roundTo(myOffer.tokenPrice * coinPrice) : 0 }}
              </span>
              <span>]</span>
            </div>
          </div>
          <div class="font-ibm-bold text-sm text-tertiary-400 mt-5">
            {{ formatDate(myOffer.updatedAt) }}
          </div>
        </div>
      </div>
      <div v-else>
        <div class="text-lg text-black font-ibm-light text-shadow-white">
          Last value
        </div>
        <div class="flex text-5xl text-primary-900 font-ibm py-2">
          <div class="flex items-center">
            <font-awesome-icon
              v-if="chain === 'ETHEREUM'"
              :icon="['fab', 'ethereum']"
            />
            <div
              v-if="chain === 'BSC-TESTNET'"
              class="w-10 h-10 fill-primary-900"
            >
              <svg viewBox="0 0 24 24">
                <path
                  d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                />
              </svg>
            </div>
            <span class="ml-5">
              {{ roundTo(asset.lastOrder?.tokenPrice || 0) }}
            </span>
          </div>
          <span class="ml-3 mt-5 font-ibm text-lg text-tertiary-500">
            [${{ roundTo((asset.lastOrder?.tokenPrice || 0) * coinPrice) }}]
          </span>
        </div>
        <div class="font-ibm text-lg text-tertiary-500 mt-0.5">
          {{ lastSaleDate }}
        </div>
      </div>
      <div>
        <button
          v-if="!store.state.wallet.account"
          class="font-press w-full text-base lg:text-lg mt-0.75 border-2 border-black text-red-900 shadow-default shadow-black hover:shadow-red-900 hover:bg-black transition h-15"
          @click="openConnectWalletModal"
        >
          CONNECT WALLET
        </button>
        <nftmx-button
          v-else-if="
            currentSale && currentSale.seller?.walletAddress === walletAddress
          "
          color="red"
          label="CANCEL SALE"
          class="font-press w-full text-base lg:text-lg mt-0.75"
          @click="cancelOrder()"
          h="lg"
          outline
          textColor="white"
          :loading="loading"
        />
        <nftmx-button
          v-else-if="currentSale && currentSale.orderType === '0'"
          color="primary"
          label="BUY NOW"
          class="font-press w-full text-base lg:text-lg mt-0.75"
          @click="handleBuyModal(true)"
          h="lg"
          outline
          textColor="white"
        />
        <nftmx-button
          v-else-if="currentSale && currentSale.orderType === '1'"
          color="primary"
          label="BID NOW"
          class="font-press w-full text-base lg:text-lg mt-0.75"
          @click="bidModalActive = true"
          h="lg"
        />
        <nftmx-button
          v-else-if="asset.owner?.id === userId"
          color="primary"
          label="LIST FOR SALE"
          class="font-press w-full text-base lg:text-lg mt-0.75"
          h="lg"
          @click="emit('open-sale-modal')"
        />
        <div v-else-if="myOffer">
          <div class="font-ibm-medium text-sm text-center text-tertiary-400">
            {{
              myOffer.orderStatus === "0"
                ? "Offer Expiration due in"
                : "Liquidity Protection due in"
            }}
          </div>
          <div class="flex justify-center pt-2 pb-4">
            <timer
              :time="
                myOffer.endSaleTime - new Date().getTime() / 1000 > 0
                  ? parseInt(
                      myOffer.endSaleTime - new Date().getTime() / 1000
                    )
                  : 0
              "
            />
          </div>
          <nftmx-button
            color="red"
            class="font-press w-full text-sm lg:text-lg leading-6"
            @click="cancelMyOffer"
            label="CANCEL OFFER"
            outline
            h="lg"
            :loading="loading"
          />
        </div>
        <nftmx-button
          v-else
          color="black"
          class="font-press w-full text-sm lg:text-lg leading-6"
          @click="emit('open-offer-modal')"
          label="MAKE AN OFFER"
          outline
          h="lg"
        />
        <div
          v-if="currentSale && currentSale.protectionRate <= 0"
          class="text-red-900 text-11 font-ibm mt-2 text-center"
        >
          <font-awesome-icon :icon="['fas', 'exclamation-triangle']" />
          <span>
            No liquidity protection available, invest at your own risk!
          </span>
        </div>
      </div>
    </div>
    <div
      v-if="asset?.subcollection && asset.owner?.id === userId"
      class="border border-black px-8 pt-7.25 pb-11 font-ibm text-sm bg-tertiary-800 mt-4"
    >
      <div class="text-lg font-ibm-light text-black text-shadow-white">
        Subcollection status
      </div>
      <div class="flex justify-between mt-6">
        <div>
          <div>Total derivatives minted</div>
          <div class="mt-1 text-primary-900">0</div>
          <div class="mt-2.5">Available derivatives for sale</div>
          <div class="mt-1 text-primary-900">0</div>
          <div class="mt-2.5">Never sold derivatives</div>
          <div class="mt-1 text-primary-900">0</div>
        </div>
        <div class="border-x border-l-black border-r-tertiary-700" />
        <div>
          <div>0 Derivatives sold</div>
          <div class="mt-1 text-primary-900 flex items-center gap-2">
            <font-awesome-icon
              v-if="chain === 'ETHEREUM'"
              :icon="['fab', 'ethereum']"
            />
            <div
              v-if="chain === 'BSC-TESTNET'"
              class="w-3 h-3 fill-primary-900"
            >
              <svg viewBox="0 0 24 24">
                <path
                  d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                />
              </svg>
            </div>
            <span> 0 </span>
            <span class="text-tertiary-400 text-xs"> [$0] </span>
          </div>
          <div class="mt-2.5">Subcollection floor price</div>
          <div class="mt-1 text-primary-900 flex items-center gap-2">
            <font-awesome-icon
              v-if="chain === 'ETHEREUM'"
              :icon="['fab', 'ethereum']"
            />
            <div
              v-if="chain === 'BSC-TESTNET'"
              class="w-3 h-3 fill-primary-900"
            >
              <svg viewBox="0 0 24 24">
                <path
                  d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                />
              </svg>
            </div>
            <span> 0 </span>
            <span class="text-tertiary-400 text-xs"> [$0] </span>
          </div>
          <div class="mt-2.5">0 Value of pending derivatives</div>
          <div class="mt-1 text-primary-900">
            <div class="mt-1 text-primary-900 flex items-center gap-2">
              <font-awesome-icon
                v-if="chain === 'ETHEREUM'"
                :icon="['fab', 'ethereum']"
              />
              <div
                v-if="chain === 'BSC-TESTNET'"
                class="w-3 h-3 fill-primary-900"
              >
                <svg viewBox="0 0 24 24">
                  <path
                    d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                  />
                </svg>
              </div>
              <span> 0 </span>
              <span class="text-tertiary-400 text-xs"> [$0] </span>
            </div>
          </div>
        </div>
        <div class="border-x border-l-black border-r-tertiary-700" />
        <div>
          <div>Slippage locked</div>
          <div class="mt-1 text-primary-900 flex items-center gap-2">
            <font-awesome-icon
              v-if="chain === 'ETHEREUM'"
              :icon="['fab', 'ethereum']"
            />
            <div
              v-if="chain === 'BSC-TESTNET'"
              class="w-3 h-3 fill-primary-900"
            >
              <svg viewBox="0 0 24 24">
                <path
                  d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                />
              </svg>
            </div>
            <span> 0 </span>
            <span class="text-tertiary-400 text-xs"> [$0] </span>
          </div>
          <div class="mt-2.5">Available derivatives for sale</div>
          <div class="mt-1 text-primary-900 flex items-center gap-2">
            <font-awesome-icon
              v-if="chain === 'ETHEREUM'"
              :icon="['fab', 'ethereum']"
            />
            <div
              v-if="chain === 'BSC-TESTNET'"
              class="w-3 h-3 fill-primary-900"
            >
              <svg viewBox="0 0 24 24">
                <path
                  d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                />
              </svg>
            </div>
            <span> 0 </span>
            <span class="text-tertiary-400 text-xs"> [$0] </span>
          </div>
          <div class="mt-2.5">Total value locked</div>
          <div class="mt-1 text-primary-900">
            <div class="mt-1 text-primary-900 flex items-center gap-2">
              <font-awesome-icon
                v-if="chain === 'ETHEREUM'"
                :icon="['fab', 'ethereum']"
              />
              <div
                v-if="chain === 'BSC-TESTNET'"
                class="w-3 h-3 fill-primary-900"
              >
                <svg viewBox="0 0 24 24">
                  <path
                    d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                  />
                </svg>
              </div>
              <span> 0 </span>
              <span class="text-tertiary-400 text-xs"> [$0] </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-else
      class="bg-tertiary-800 border border-black p-4 sm:p-7 gap-4 mt-4.75 text-center"
    >
      <div class="flex justify-center">
        <div class="text-lg py-1 text-black font-ibm text-shadow-white">
          Total syndication fundraising
        </div>
        <nftmx-tooltip
          text="Amount of funds already syndicated to purchase this NFT"
        >
          <sup>
            <font-awesome-icon
              :icon="['fas', 'question-circle']"
              class="ml-1 text-sm cursor-pointer text-black shadow-default shadow-tertiary-400 rounded-full bg-tertiary-400"
            />
          </sup>
        </nftmx-tooltip>
      </div>
      <div class="flex flex-wrap items-end gap-2 justify-center pt-1.5 pb-2">
        <div
          class="font-ibm-bold text-3xl leading-none text-primary-900 flex items-center"
        >
          <div
            v-if="chain === 'BSC-TESTNET'"
            class="text-xs w-7 h-7 text-primary-900"
          >
            <svg viewBox="0 0 24 24">
              <path
                d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                fill="#19cb58"
              ></path>
            </svg>
          </div>
          <font-awesome-icon
            v-if="chain === 'ETHEREUM'"
            :icon="['fab', 'ethereum']"
          />
          <span class="ml-4">
            {{ asset.syndication ? roundTo(asset.syndication.total) : 0 }}
          </span>
        </div>
        <div class="font-ibm text-lg leading-5 text-tertiary-400">
          <span>[$</span>
          <span>
            {{
              asset.syndication
                ? roundTo(asset.syndication.total * coinPrice)
                : 0
            }}
          </span>
          <span>]</span>
        </div>
      </div>
      <div
        v-if="currentSale?.orderType !== '1' && asset.syndication"
        class="flex justify-start w-full h-2.5 bg-tertiary-700 mt-5"
      >
        <div
          class="bg-primary-900 h-full"
          :style="{
            width: `${
              (asset.syndication.total / currentSale.tokenPrice) * 100
            }%`,
          }"
        />
      </div>
      <button
        v-if="!store.state.wallet.account"
        class="font-press w-full text-base lg:text-lg mt-5.75 border-2 border-black text-red-900 shadow-default shadow-black hover:shadow-red-900 hover:bg-black transition h-17.5"
        @click="openConnectWalletModal"
      >
        CONNECT WALLET
      </button>
      <div v-else-if="!asset || !asset.syndication">
        <nftmx-button
          color="black"
          label="CREATE SYNDICATION"
          class="font-press w-full text-base lg:text-lg mt-5.75 mb-0.75"
          @click="syndicationModalActive = true"
          h="xl2"
          outline
          textColor="secondary-900"
        />
      </div>
      <div
        v-else-if="myInvestment && myInvestment.lp > 0"
        class="flex mt-6 mb-px text-start"
      >
        <div class="">
          <div class="text-black font-ibm text-shadow-white">
            Your Investment
          </div>
          <div>
            <span class="font-ibm-bold text-primary-900">
              ${{
                myInvestment ? roundTo(myInvestment.investment * coinPrice) : 0
              }}
            </span>
            <span class="font-ibm text-tertiary-400 text-xs">
              [{{
                myInvestment && myInvestment.investment > 0
                  ? roundTo(
                      (myInvestment.investment / asset.syndication.total) * 100
                    )
                  : 0
              }}%]
            </span>
          </div>
          <div>
            <span
              :class="[
                myInvestment.lp > 0
                  ? 'cursor-pointer text-red-600 hover:text-red-900'
                  : 'cursor-not-allowed text-red-700',
                'font-ibm transition text-xs ',
              ]"
              @click="cancelInvestment"
            >
              Cancel your investment
            </span>
          </div>
        </div>
        <div
          class="border-l border-black border-r border-r-tertiary-700 mx-4 2xl:ml-16 2xl:mr-8"
        />
        <nftmx-button
          color="secondary"
          label="INVEST MORE"
          class="flex-1 font-press w-full text-base lg:text-lg"
          @click="syndicationModalActive = true"
          h="xl2"
          outline
          textColor="white"
        />
      </div>
      <div v-else-if="asset.syndication">
        <nftmx-button
          color="secondary"
          label="JOIN SYNDICATION"
          class="font-press w-full text-base lg:text-lg mt-6 mb-px"
          @click="syndicationModalActive = true"
          h="xl2"
          outline
          textColor="white"
        />
      </div>
      <div
        v-if="
          currentSale &&
          (currentSale.protectionRate <= 0 || currentSale.protectionTime <= 0)
        "
        class="text-red-900 text-11 font-ibm mt-2 text-center h-0"
      >
        <font-awesome-icon :icon="['fas', 'exclamation-triangle']" />
        <span>
          No liquidity protection available, invest at your own risk!
        </span>
      </div>
    </div>
    <buy-modal
      v-if="currentSale"
      v-model="buyModalActive"
      :asset="asset"
      :currentSale="currentSale"
      @update-asset="emit('update-asset')"
    />
    <bid-modal
      v-if="currentSale"
      v-model="bidModalActive"
      :asset="asset"
      :currentSale="currentSale"
      @update-asset="emit('update-asset')"
    />
    <syndication-modal
      v-model="syndicationModalActive"
      @update-syndication="updateSyndication"
      :syndication="asset.syndication"
      :asset="asset"
      :syndicationHistory="syndicationHistory"
    />
    <nftmx-cancel-modal v-model="openCancelModal" @confirm="cancelPurchase" />
  </div>
</template>

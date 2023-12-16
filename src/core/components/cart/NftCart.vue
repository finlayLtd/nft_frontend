<script setup>
import NftmxButton from "@/core/components/basic/NftmxButton.vue";
import { computed, ref, watch } from "vue";
import NftmxImg from "@/core/components/basic/NftmxImg.vue";
import Web3 from "web3/dist/web3.min.js";
import { useStore } from "vuex";
import { buyFixedPayOrder } from "@/core/utils/contracts/market.utils";
import { useToast } from "vue-toastification";
import { getChainKey } from "@/core/utils/common";
import {
  NULL_ADDRESS,
  BSC_TESTNET_MARKET_ORDER_CONTRACT_ADDRESS,
} from "@/core/config/constant";
import NftmxTrimString from "@/core/components/basic/NftmxTrimString.vue";

const props = defineProps({
  nftCart: Boolean,
});

const store = useStore();
const cartItems = computed(() => store.state.market.cartItems);
const userId = computed(() => store.getters["auth/userId"]);
const toast = useToast();
const isAdded = ref(false);
const totalPrice = computed(() => {
  let value = 0;
  for (let i = 0; i < cartItems.value.length; i++) {
    value += cartItems.value[i].currentOrder.tokenPrice;
  }
  return value;
});
const loading = ref(false);
const mask = ref(false);
const coinPrice = computed(() => {
  const chainKey = getChainKey(cartItems.value[0]?.contract?.chain || 1);
  return store.state.market.coinPrice[chainKey] || 1;
});

const onDrop = (evt, list) => {
  const movingItemData = evt.dataTransfer.getData("movingItem");
  if (!movingItemData) return;
  const movingItem = JSON.parse(movingItemData);
  if (
    !movingItem ||
    !movingItem.currentOrder ||
    !(movingItem.currentOrder.orderType === "0") ||
    !(movingItem.currentOrder.orderStatus === "0")
  ) {
    toast.error("Only Fix Sale Orders are available to buy at one transaction");
    return;
  }
  if (movingItem.contract.chain !== "BSC-TESTNET") {
    toast.error("Only BSC Testnet Orders are available to buy");
    return;
  }

  addToCart(movingItem);
};
const addToCart = (addingItem) => {
  store.commit("market/addToCart", addingItem);
};
const removeFromCart = (token) => {
  store.commit("market/removeFromCart", token);
};
const buyMultiOrders = async () => {
  try {
    if (cartItems.value[0]?.contract?.chain === "ETHEREUM") {
      toast.error("Only BSC Testnet Orders are available to buy");
      return;
    }
    const marketOrders = [];
    for (let i = 0; i < cartItems.value.length; i++) {
      if (
        cartItems.value[i].contract.chain === "BSC-TESTNET" &&
        cartItems.value[i].currentOrder.contractAddress ===
          BSC_TESTNET_MARKET_ORDER_CONTRACT_ADDRESS
      ) {
        marketOrders.push(cartItems.value[i]);
      }
    }
    if (marketOrders.length === 0 || loading.value) {
      toast.error(
        "Only marketplace orders are available to buy at one transaction"
      );
      return;
    }
    if (!userId.value) {
      openConnectWalletModal();
      return;
    }

    loading.value = true;
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x61" }],
    });
    const orderIds = cartItems.value.map((item) => item.currentOrder.orderId);
    await buyFixedPayOrder(
      cartItems.value[0].currentOrder.contractAddress,
      orderIds,
      NULL_ADDRESS,
      Web3.utils.toWei(totalPrice.value.toString(), "ether")
    );
    clear();
    loading.value = false;
  } catch (err) {
    if (err.code === 4001) {
      toast.error("User denied transaction signature.");
    } else {
      toast.error("Something went wrong");
    }
    loading.value = false;
  }
};
const clear = () => {
  if (loading.value) {
    return;
  }
  store.commit("market/emptyCart");
};
const removeMask = () => {
  mask.value = false;
};
const openConnectWalletModal = () => {
  store.commit("app/OPEN_CONNECT_WALLET_MODAL");
};
</script>

<template>
  <div
    class="transition-all overflow-hidden px-2.5 py-4 -mx-2.5 -my-4"
    :style="{ maxWidth: nftCart ? '330px' : '0px' }"
  >
    <div class="flex flex-col pl-6 text-white font-ibm-medium w-74.5 h-full">
      <div class="flex-grow relative pb-2.5 h-full">
        <div
          class="border-dashed border-primary-900 border-2 h-full relative"
          @drop="onDrop($event, 1)"
          @dragover.prevent
          @dragenter.prevent
        >
          <p class="text-xs font-ibm m-6">
            Drag and drop to buy more than one at the same transaction
          </p>
          <div class="w-full px-6">
            <div
              v-for="item in cartItems"
              :key="item.id"
              class="flex gap-4 py-3"
            >
              <nftmx-img
                :src="item.imageUrl"
                class="w-8.75 h-8.75 object-cover"
              />
              <div class="flex-1">
                <nftmx-trim-string :line="1" class="text-sm">
                  {{ item.name || "#" + item.tokenId }}
                </nftmx-trim-string>
                <div
                  class="flex items-center gap-1 text-xs font-ibm text-primary-900"
                >
                  <font-awesome-icon
                    v-if="item.contract.chain === 'ETHEREUM'"
                    :icon="['fab', 'ethereum']"
                  />
                  <div
                    v-if="item.contract.chain === 'BSC-TESTNET'"
                    class="w-3 h-3 fill-primary-900"
                  >
                    <svg viewBox="0 0 24 24">
                      <path
                        d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                      />
                    </svg>
                  </div>
                  {{ item.currentOrder.tokenPrice }}
                  <span class="text-tertiary-400">[$</span>
                  <span class="text-tertiary-400">
                    {{ (item.currentOrder.tokenPrice * coinPrice).toFixed(2) }}
                  </span>
                  <span class="text-tertiary-400">]</span>
                </div>
              </div>
              <div class="flex items-center text-sm">
                <font-awesome-icon
                  :icon="['fas', 'times']"
                  class="text-tertiary-400 hover:text-red-900 cursor-pointer transition"
                  @click="removeFromCart(item)"
                />
              </div>
            </div>
          </div>
          <div class="border-t border-t-tertiary-600 bottom-0 absolute w-full">
            <div class="p-4 text-11">
              <div>
                <span>Total NFTs: </span>
                <span class="text-primary-900">
                  {{ cartItems.length }}
                </span>
              </div>
              <div class="flex items-center gap-1">
                <span>Total Price: </span>
                <font-awesome-icon
                  v-if="cartItems[0]?.contract.chain === 'ETHEREUM'"
                  :icon="['fab', 'ethereum']"
                  class="text-primary-900"
                />
                <div
                  v-if="cartItems[0]?.contract.chain === 'BSC-TESTNET'"
                  class="w-3 h-3 fill-primary-900"
                >
                  <svg viewBox="0 0 24 24">
                    <path
                      d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                    />
                  </svg>
                </div>
                <span class="text-primary-900">
                  {{ " " + totalPrice.toFixed(2) }}
                </span>
                <span class="text-tertiary-400">
                  [${{ (totalPrice * coinPrice).toFixed(2) }}]
                </span>
              </div>
            </div>
            <div class="-mx-0.5 -mb-0.5">
              <button
                @click="buyMultiOrders"
                :class="[
                  cartItems.length > 0
                    ? 'transition bg-primary-900 hover:bg-primary-800 text-white shadow-default shadow-primary-900'
                    : 'bg-gray-600 text-tertiary-400',
                  loading ? 'cursor-wait' : '',
                  'font-press text-sm h-15 w-full',
                ]"
                :disabled="loading || cartItems.length === 0"
              >
                BUY NOW
              </button>
            </div>
          </div>
        </div>
        <div
          v-if="cartItems.length > 0"
          class="text-xs text-red-900 text-center py-3"
        >
          <span
            :class="[
              loading ? 'cursor-wait' : 'cursor-pointer',
              'cursor-pointer transition hover:text-red-800',
            ]"
            @click="clear"
          >
            clear
          </span>
        </div>
        <div
          v-if="mask"
          @click="removeMask"
          v-click-outside="removeMask"
          class="absolute w-full h-full top-0 left-0"
        >
          <div
            class="flex items-center justify-center text-center h-full bg-black bg-opacity-80"
          >
            <span class="text-red-900">
              Only Fix Sale Orders are available to buy at one transaction
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

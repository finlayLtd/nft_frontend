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

const props = defineProps({
  nftCart: Boolean,
  chain: String,
  items: Array,
});

const store = useStore();
const userId = computed(() => store.getters["auth/userId"]);
const toast = useToast();
const isAdded = ref(false);
const totalPrice = computed(() => {
  let value = 0;
  for (let i = 0; i < props.items.length; i++) {
    value += props.items[i].currentOrder.tokenPrice;
  }
  return value;
});
const loading = ref(false);
const mask = ref(false);
const cartChain = computed(() => props.chain);
const coinPrice = computed(() => {
  const chainKey = getChainKey(props.chain);
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

  emit("add-to-cart", movingItem);
};
const removeFromCart = (token) => {
  emit("remove-from-cart", token);
};
const buyMultiOrders = () => {
  const marketOrders = [];
  for (let i = 0; i < props.items.length; i++) {
    if (
      props.items[i].contract.chain === "BSC-TESTNET" &&
      props.items[i].currentOrder.contractAddress ===
        BSC_TESTNET_MARKET_ORDER_CONTRACT_ADDRESS
    ) {
      marketOrders.push(props.items[i]);
    }
  }
  if (marketOrders.length === 0 || loading.value) {
    toast.error("");
    return;
  }
  if (!userId.value) {
    openConnectWalletModal();
    return;
  }
  const orderIds = props.items.map((item) => item.currentOrder.orderId);
  loading.value = true;
  buyFixedPayOrder(
    props.items[0].currentOrder.contractAddress,
    orderIds,
    NULL_ADDRESS,
    Web3.utils.toWei(totalPrice.value.toString(), "ether")
  )
    .then((res) => {
      clear();
    })
    .catch((err) => {
      console.log("err: ", err);
    })
    .finally(() => {
      loading.value = false;
    });
};
const clear = () => {
  if (loading.value) {
    return;
  }
  props.items = [];
};
const removeMask = () => {
  mask.value = false;
};
const openConnectWalletModal = () => {
  store.commit("app/OPEN_CONNECT_WALLET_MODAL");
};
watch(cartChain, (val) => {
  props.items = [];
});
</script>

<template>
  <div
    class="transition-all overflow-hidden"
    :style="{ maxWidth: nftCart ? '298px' : '0px' }"
  >
    <div
      class="flex flex-col pl-6 text-white font-ibm-medium w-74.5 h-full py-3"
    >
      <div class="flex-grow mt-11 relative">
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
              v-for="(item, index) in items"
              :key="index"
              class="flex gap-4 py-3"
            >
              <nftmx-img
                :src="item.imageUrl"
                class="w-8.75 h-8.75 object-cover"
              />
              <div class="flex-grow">
                <div class="text-sm">
                  {{ item.name || "#" + item.tokenId }}
                </div>
                <div class="text-xs font-ibm text-primary-900">
                  <font-awesome-icon :icon="['fab', 'ethereum']" />
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
                  {{ items.length }}
                </span>
              </div>
              <div>
                <span>Total Price: </span>
                <font-awesome-icon
                  :icon="['fab', 'ethereum']"
                  class="text-primary-900"
                />
                <span class="text-primary-900">
                  {{ " " + totalPrice.toFixed(2) }}
                </span>
                <span class="text-tertiary-400">
                  [${{ (totalPrice * coinPrice).toFixed(2) }}]
                </span>
              </div>
            </div>
            <div class="-mx-0.5 -mb-0.5">
              <nftmx-button
                color="primary"
                label="BUY"
                w="full"
                class="font-press"
                h="lg"
                @click="buyMultiOrders"
                :loading="loading"
              />
            </div>
          </div>
        </div>
        <div class="text-xs text-red-900 text-center py-3">
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

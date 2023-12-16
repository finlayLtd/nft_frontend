<script setup>
import { computed, onMounted, ref, watch, watchEffect } from "vue";
import NftmxImg from "@/core/components/basic/NftmxImg.vue";
import NftmxTrimString from "@/core/components/basic/NftmxTrimString.vue";
import usersService from "@/core/services/market/users.service";
import {
  themeConfig,
  defaultPagination,
  BSC_TESTNET_PACKABLE_CONTRACT_ADDRESS,
} from "@/core/config/constant";
import { useStore } from "vuex";
import BuyingOrderCard from "../components/BuyingOrderCard.vue";
import SellingOrderCard from "../components/SellingOrderCard.vue";
import NftmxSearchInput from "@/core/components/basic/NftmxSearchInput.vue";
import useDebouncedRef from "@/core/utils/hook/useDebouncedRef";
import marketService from "@/core/services/market.service";
import nftsService from "@/core/services/market/nfts.service";
import OrderSearchOptions from "../components/OrderSearchOptions.vue";
import {
  setApprovalForAll,
  isApprovedForAll,
} from "@/core/utils/contracts/erc721.utils";
import { pack } from "@/core/utils/contracts/packable.utils.js";
import {
  claimDownsideProtectionAmount,
  claimDownsideProtectionAmountInOffer,
} from "@/core/utils/contracts/market.utils";
import NftmxButton from "@/core/components/basic/NftmxButton.vue";
import Accordion from "@/core/components/accordion/Accordion.vue";
import NftmxTable from "@/core/components/table/NftmxTable.vue";
import NftmxThead from "@/core/components/table/NftmxThead.vue";
import NftmxTh from "@/core/components/table/NftmxTh.vue";
import NftmxTbody from "@/core/components/table/NftmxTbody.vue";
import NftmxTd from "@/core/components/table/NftmxTd.vue";
import NftmxTr from "@/core/components/table/NftmxTr.vue";
import Timer from "@/core/components/timer/Timer.vue";
import { roundTo } from "@/core/utils/common";
import BasicCheckbox from "@/core/components/basic/BasicCheckbox.vue";
import { useToast } from "vue-toastification";

const props = defineProps({
  account: Object,
});

const emit = defineEmits(["get-stats"]);

const toast = useToast();
const _account = computed(() => props.account);
const store = useStore();
const windowWidth = computed(() => store.state.app.windowWidth);
const walletAddress = computed(() => store.getters["auth/walletAddress"]);
const userId = computed(() => store.getters["auth/userId"]);
const newPack = ref([]);
const buyOrderLoading = ref(false);
const allBuyOrders = ref({ orders: [], cursor: null });
const buyOrders = ref([]);
const moreBuyOrders = computed(
  () =>
    allBuyOrders.value.cursor ||
    buyOrders.value.length < allBuyOrders.value.orders.length
);
const showBuyOrders = ref(true);
const sellOrderLoading = ref(false);
const allSellOrders = ref({ orders: [], cursor: null });
const sellOrders = ref([]);
const moreSellOrders = computed(
  () =>
    allSellOrders.value.cursor ||
    sellOrders.value.length < allSellOrders.value.orders.length
);
const showSellOrders = ref(true);
const limit = ref(2);
const filterOption = ref({
  chain: "BSC-TESTNET",
  name: "",
  min: null,
  max: null,
  collection: [],
  sortBy: "",
  hashtag: "",
});
const searchText = useDebouncedRef("", 1000);
const filterActive = ref(false);
const selectedOrders = ref([]);
const viewOption = ref("TILE");
const checkedAll = ref(false);

const vote = async (order) => {
  if (!userId.value) {
    toast.error("Please login first");
    return;
  }
  nftsService
    .vote({
      chain: filterOption.value.chain,
      userId: userId.value,
      nftId: order.nft.id,
    })
    .then((res) => {
      const votedOrder = buyOrders.value.find((item) => item.id === order.id);
      if (res.data) {
        votedOrder.nft.votes.push(store.state.user);
      } else {
        const index = votedOrder.nft.votes.findIndex(
          (item) => item.id === userId.value
        );
        votedOrder.nft.votes.splice(index, 1);
      }
    });
};
const clickFilter = () => {
  filterActive.value = !filterActive.value;
};
const filterOrders = (value) => {
  filterOption.value = value;
  initialBuyOrders();
  initialSellOrders();
};
const cancelPurchase = (order) => {
  if (order.orderType === "2") {
    claimDownsideProtectionAmountInOffer(
      order.contractAddress,
      order.orderId
    ).then((res) => {
      const index = allBuyOrders.value.orders.findIndex(
        (asset) => asset.id === order.id
      );
      allBuyOrders.value.orders.splice(index, 1);
      const lines = Math.ceil((buyOrders.value.length - 1) / limit.value);
      buyOrders.value = allBuyOrders.value.orders.slice(0, limit.value * lines);
    });
  } else {
    claimDownsideProtectionAmount(order.contractAddress, [order.orderId]).then(
      (res) => {
        const index = allBuyOrders.value.orders.findIndex(
          (asset) => asset.id === order.id
        );
        allBuyOrders.value.orders.splice(index, 1);
        const lines = Math.ceil((buyOrders.value.length - 1) / limit.value);
        buyOrders.value = allBuyOrders.value.orders.slice(
          0,
          limit.value * lines
        );
      }
    );
  }
};
const claimOrder = (order) => {
  claimDownsideProtectionAmount(order.contractAddress, [order.orderId]).then(
    (res) => {
      const index = allSellOrders.value.orders.findIndex(
        (asset) => asset.id === order.id
      );
      allSellOrders.value.orders.splice(index, 1);
      const lines = Math.ceil((sellOrders.value.length - 1) / limit.value);
      sellOrders.value = allSellOrders.value.orders.slice(
        0,
        limit.value * lines
      );
    }
  );
};
const selectOrder = (order, checked) => {
  const index = selectedOrders.value.findIndex((item) => item.id === order.id);
  if (index > -1 && !checked) {
    selectedOrders.value.splice(index, 1);
  }
  if (index === -1 && checked) {
    selectedOrders.value.push(order);
  }
};
const selectAllOrders = (checked) => {
  checkedAll.value = checked;
  if (checked) selectedOrders.value = buyOrders.value;
  else selectedOrders.value = [];
};
const cancelMultiPurchase = () => {
  const orderIds = selectedOrders.value.map((order) => order.orderId);
  claimDownsideProtectionAmount(
    selectedOrders.value[0].contractAddress,
    orderIds
  ).then((res) => {
    for (let i = 0; i < selectedOrders.value.length; i++) {
      const index = allBuyOrders.value.orders.findIndex(
        (asset) => asset.id === selectedOrders.value[i].id
      );
      allBuyOrders.value.orders.splice(index, 1);
    }
    emit("get-stats");
    const lines = Math.ceil((buyOrders.value.length - 1) / limit.value);
    buyOrders.value = allBuyOrders.value.orders.slice(0, limit.value * lines);
    selectedOrders.value = [];
  });
};
const loadMoreBuyOrders = async () => {
  buyOrderLoading.value = true;
  if (allBuyOrders.value.cursor) await retrieveBuyOrders();
  buyOrderLoading.value = false;
  const sliceLimit = limit.value * 3;
  const nextStartPoint = buyOrders.value.length;
  buyOrders.value = buyOrders.value.concat(
    allBuyOrders.value.orders.slice(nextStartPoint, nextStartPoint + sliceLimit)
  );
};
const initialBuyOrders = async () => {
  allBuyOrders.value = { orders: [], cursor: null };
  buyOrders.value = [];
  buyOrderLoading.value = true;
  await retrieveBuyOrders();
  buyOrderLoading.value = false;
  buyOrders.value = buyOrders.value.concat(
    allBuyOrders.value.orders.slice(0, limit.value * 4)
  );
};
const retrieveBuyOrders = async () => {
  if (!_account.value) return;
  return new Promise((resolve, reject) => {
    usersService
      .buyingOrders({
        ...filterOption.value,
        cursor: allBuyOrders.value.cursor,
        limit: defaultPagination.limit,
        walletAddress: _account.value.walletAddress,
      })
      .then((res) => {
        allBuyOrders.value = {
          orders: [...allBuyOrders.value.orders, ...res.data.orders],
          cursor: res.data.cursor,
        };
        resolve(true);
      })
      .catch((err) => {
        resolve(false);
      });
  });
};
const loadMoreSellOrders = async () => {
  sellOrderLoading.value = true;
  if (allSellOrders.value.cursor) await retrieveSellOrders();
  sellOrderLoading.value = false;
  const sliceLimit = limit.value * 3;
  const nextStartPoint = sellOrders.value.length;
  sellOrders.value = sellOrders.value.concat(
    allSellOrders.value.orders.slice(
      nextStartPoint,
      nextStartPoint + sliceLimit
    )
  );
};
const initialSellOrders = async () => {
  allSellOrders.value = { orders: [], cursor: null };
  sellOrders.value = [];
  sellOrderLoading.value = true;
  await retrieveSellOrders();
  sellOrderLoading.value = false;
  sellOrders.value = sellOrders.value.concat(
    allSellOrders.value.orders.slice(0, limit.value * 4)
  );
};
const retrieveSellOrders = async () => {
  return new Promise((resolve, reject) => {
    usersService
      .sellingOrders({
        ...filterOption.value,
        cursor: allSellOrders.value.cursor,
        limit: defaultPagination.limit,
        walletAddress: walletAddress.value,
      })
      .then((res) => {
        allSellOrders.value = {
          orders: [...allSellOrders.value.orders, ...res.data.orders],
          cursor: res.data.cursor,
        };
        resolve(true);
      })
      .catch((err) => {
        resolve(false);
      });
  });
};
const setLimitValue = (width) => {
  let newLimit = 6;
  if (width >= themeConfig.xl3) {
    newLimit = 6;
  } else if (width >= themeConfig.xl2) {
    newLimit = 5;
  } else if (width >= themeConfig.xl) {
    newLimit = 4;
  } else if (width >= themeConfig.lg) {
    newLimit = 3;
  } else if (width >= themeConfig.sm) {
    newLimit = 2;
  } else {
    newLimit = 1;
  }
  if (limit.value === newLimit) return;
  const lines = Math.ceil(buyOrders.value.length / limit.value);
  buyOrders.value = allBuyOrders.value.orders.slice(0, newLimit * lines);
  limit.value = newLimit;
};
watch(windowWidth, (width) => {
  setLimitValue(width);
});
watch(searchText, (val) => {
  filterOrders({ ...filterOption.value, name: val });
});
watch(_account, (val) => {
  if (val) {
    setLimitValue(windowWidth.value);
    initialBuyOrders();
    initialSellOrders();
  }
});
onMounted(() => {
  if (_account.value) {
    setLimitValue(windowWidth.value);
    initialBuyOrders();
    initialSellOrders();
  }
});
</script>

<template>
  <div class="flex flex-col sm:flex-row mb-22 xl:pt-7.25">
    <div class="flex-1">
      <div class="flex xl:justify-end items-center gap-4">
        <font-awesome-icon
          :icon="['fas', 'square']"
          :class="[
            viewOption === 'TILE' ? 'text-primary-900' : 'text-tertiary-400',
            'transition hover:text-primary-900 cursor-pointer z-10',
          ]"
          @click="viewOption = 'TILE'"
        />
        <font-awesome-icon
          :icon="['fas', 'th-list']"
          :class="[
            viewOption === 'LIST' ? 'text-primary-900' : 'text-tertiary-400',
            'transition hover:text-primary-900 cursor-pointer z-10',
          ]"
          @click="viewOption = 'LIST'"
        />
        <nftmx-search-input
          v-model="searchText"
          @handle-filter="clickFilter"
          :filterActive="filterActive"
          class="bg-tertiary-800 z-10"
        />
      </div>
      <div
        class="-ml-5 sm:-ml-10 md:-ml-16 xl:-ml-22 -mr-5 sm:-mr-10 md:-mr-16 xl:-mr-22 text-white"
      >
        <order-search-options
          :gridExtend="false"
          :filterOption="filterOption"
          @filter-orders="filterOrders"
          :filterActive="filterActive"
        />
      </div>
      <div v-if="viewOption === 'TILE'">
        <div>
          <div class="text-white font-ibm-bold text-lg py-5.5">
            <span>NFTs you are selling</span>
          </div>
          <accordion :open="showSellOrders" class="overflow-hidden p-4 -m-4">
            <div
              v-if="sellOrders.length > 0"
              class="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6"
            >
              <selling-order-card
                v-for="order in sellOrders"
                :key="order.id"
                :order="order"
                @vote="vote"
                @claim-order="claimOrder"
              />
            </div>
            <div
              v-if="sellOrderLoading"
              class="h-96 font-ibm-bold text-tertiary-500 text-lg flex items-center justify-center"
            >
              Loading...
            </div>
            <div
              v-if="!sellOrderLoading && sellOrders.length === 0"
              class="h-96 font-ibm-bold text-tertiary-500 text-lg flex items-center justify-center"
            >
              No Orders found
            </div>
            <div class="text-center w-full mt-8">
              <nftmx-button
                v-if="moreSellOrders"
                color="primary"
                label="SEE MORE"
                :outline="true"
                @click="loadMoreSellOrders"
                class="font-ibm-bold text-lg text-primary-900 w-full sm:w-68"
              />
            </div>
          </accordion>
        </div>
        <div>
          <div class="text-white font-ibm-bold text-lg py-5.5">
            <span>NFTs you are buying</span>
          </div>
          <accordion :open="showBuyOrders" class="overflow-hidden p-4 -m-4">
            <div
              v-if="buyOrders.length > 0"
              class="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6"
            >
              <buying-order-card
                v-for="order in buyOrders"
                :key="order.id"
                :order="order"
                @vote="vote"
                @cancel-purchase="cancelPurchase"
                @select-order="selectOrder"
              />
            </div>
            <div
              v-if="buyOrderLoading"
              class="h-96 font-ibm-bold text-tertiary-500 text-lg flex items-center justify-center"
            >
              Loading...
            </div>
            <div
              v-if="!buyOrderLoading && buyOrders.length === 0"
              class="h-96 font-ibm-bold text-tertiary-500 text-lg flex items-center justify-center"
            >
              No Orders found
            </div>
            <div class="relative">
              <div
                v-if="selectedOrders.length > 0"
                class="text-right text-xs font-ibm-medium mt-2 absolute w-full"
              >
                <span
                  class="text-red-900 cursor-pointer hover:text-red-800 transition"
                  @click="cancelMultiPurchase"
                >
                  Cancel Purchase
                </span>
              </div>
            </div>
            <div class="text-center w-full mt-8">
              <nftmx-button
                v-if="moreBuyOrders"
                color="primary"
                label="SEE MORE"
                :outline="true"
                @click="loadMoreBuyOrders"
                class="font-ibm-bold text-lg text-primary-900 w-full sm:w-68"
              />
            </div>
          </accordion>
        </div>
      </div>
      <div v-if="viewOption === 'LIST'">
        <div class="mt-10">
          <div
            class="text-white font-ibm-bold text-lg px-6 py-3.5 flex justify-between items-center cursor-pointer bg-tertiary-800 border border-black"
            @click="showSellOrders = !showSellOrders"
          >
            <span>NFTs you are selling</span>
            <font-awesome-icon
              v-if="showSellOrders"
              :icon="['fas', 'sort-up']"
            />
            <font-awesome-icon
              v-if="!showSellOrders"
              :icon="['fas', 'sort-down']"
            />
          </div>
          <accordion
            :open="showSellOrders"
            :class="[
              showSellOrders ? 'border-x border-b' : '',
              'overflow-hidden border-black bg-tertiary-800',
            ]"
          >
            <nftmx-table class="text-11 tracking-wider leading-4">
              <nftmx-thead>
                <nftmx-tr>
                  <nftmx-th class="text-left">Item</nftmx-th>
                  <nftmx-th class="text-left">Status</nftmx-th>
                  <nftmx-th class="text-left">Liquidity Protection</nftmx-th>
                  <nftmx-th class="text-left">Days</nftmx-th>
                  <nftmx-th class="text-left">Purchase price</nftmx-th>
                  <nftmx-th class="text-left">Total APY reward</nftmx-th>
                  <nftmx-th class="text-left">
                    Due date left for protection
                  </nftmx-th>
                  <nftmx-th></nftmx-th>
                </nftmx-tr>
              </nftmx-thead>
              <nftmx-tbody>
                <nftmx-tr
                  v-for="order in sellOrders"
                  :key="order.id"
                  class="hover:bg-tertiary-300 transition cursor-pointer"
                >
                  <nftmx-td>
                    <div class="flex gap-4.5 items-center">
                      <div class="w-11 h-11 bg-tertiary-400">
                        <nftmx-img
                          :src="order.nft.imageUrl"
                          class="w-full h-full object-cover"
                        />
                      </div>
                      <span>
                        {{ order.nft.name || "#" + order.nft.tokenId }}
                      </span>
                    </div>
                  </nftmx-td>
                  <nftmx-td class="text-red-900"> Sold </nftmx-td>
                  <nftmx-td> {{ order.protectionRate }}% </nftmx-td>
                  <nftmx-td>
                    {{ parseInt(order.protectionTime) / 86400 }}
                  </nftmx-td>
                  <nftmx-td> - </nftmx-td>
                  <nftmx-td>-</nftmx-td>
                  <nftmx-td>
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
                  </nftmx-td>
                  <nftmx-td
                    class="text-white hover:text-primary-900"
                    @click="claimOrder(order)"
                  >
                    <span
                      v-if="
                        order.protectionExpiryTime < new Date().getTime() / 1000
                      "
                    >
                      Claim sale price and APY
                    </span>
                  </nftmx-td>
                </nftmx-tr>
                <nftmx-tr v-if="sellOrderLoading">
                  <td colspan="9">Loading...</td>
                </nftmx-tr>
                <nftmx-tr v-if="!sellOrderLoading && sellOrders.length === 0">
                  <td colspan="9">
                    <div
                      class="h-96 font-ibm-bold text-tertiary-500 text-lg flex items-center justify-center"
                    >
                      No Orders found
                    </div>
                  </td>
                </nftmx-tr>
                <nftmx-tr v-if="moreSellOrders">
                  <td colspan="9">
                    <div class="w-full flex justify-center">
                      <nftmx-button
                        color="primary"
                        label="SEE MORE"
                        :outline="true"
                        @click="loadMoreSellOrders"
                        class="font-ibm-bold text-lg text-primary-900 w-full sm:w-68"
                      />
                    </div>
                  </td>
                </nftmx-tr>
              </nftmx-tbody>
            </nftmx-table>
          </accordion>
        </div>
        <div class="mt-10">
          <div
            class="text-white font-ibm-bold text-lg px-6 py-3.5 flex justify-between items-center cursor-pointer bg-tertiary-800 border border-black"
            @click="showBuyOrders = !showBuyOrders"
          >
            <span>NFTs you are buying</span>
            <font-awesome-icon
              v-if="showBuyOrders"
              :icon="['fas', 'sort-up']"
            />
            <font-awesome-icon
              v-if="!showBuyOrders"
              :icon="['fas', 'sort-down']"
            />
          </div>
          <accordion
            :open="showBuyOrders"
            :class="[
              showBuyOrders ? 'border-x border-b' : '',
              'overflow-hidden border-black bg-tertiary-800',
            ]"
          >
            <nftmx-table class="text-11 tracking-wider leading-4">
              <nftmx-thead>
                <nftmx-tr>
                  <nftmx-th>
                    <basic-checkbox
                      :checked="checkedAll"
                      small
                      bgColor="bg-tertiary-700"
                      @check="selectAllOrders"
                    />
                  </nftmx-th>
                  <nftmx-th class="text-left">Item</nftmx-th>
                  <nftmx-th class="text-left">Status</nftmx-th>
                  <nftmx-th class="text-left">Liquidity Protection</nftmx-th>
                  <nftmx-th class="text-left">Days</nftmx-th>
                  <nftmx-th class="text-left">Purchase price</nftmx-th>
                  <nftmx-th class="text-left">Total APY reward</nftmx-th>
                  <nftmx-th class="text-left">
                    Due date left for protection
                  </nftmx-th>
                  <nftmx-th></nftmx-th>
                </nftmx-tr>
              </nftmx-thead>
              <nftmx-tbody>
                <nftmx-tr
                  v-for="order in buyOrders"
                  :key="order.id"
                  class="hover:bg-tertiary-300 transition cursor-pointer"
                >
                  <nftmx-td class="w-0 text-center">
                    <basic-checkbox
                      :checked="
                        selectedOrders.findIndex(
                          (item) => item.id === order.id
                        ) > -1
                      "
                      small
                      bgColor="bg-tertiary-700"
                      @check="(checked) => selectOrder(order, checked)"
                    />
                  </nftmx-td>
                  <nftmx-td>
                    <div class="flex gap-4.5 items-center">
                      <div class="w-11 h-11 bg-tertiary-400">
                        <nftmx-img
                          :src="order.nft.imageUrl"
                          class="w-full h-full object-cover"
                        />
                      </div>
                      <span>
                        {{ order.nft.name || "#" + order.nft.tokenId }}
                      </span>
                    </div>
                  </nftmx-td>
                  <nftmx-td class="text-primary-900"> Purchase </nftmx-td>
                  <nftmx-td> {{ order.protectionRate }}% </nftmx-td>
                  <nftmx-td>
                    {{ parseInt(order.protectionTime) / 86400 }}
                  </nftmx-td>
                  <nftmx-td> - </nftmx-td>
                  <nftmx-td>-</nftmx-td>
                  <nftmx-td>
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
                  </nftmx-td>
                  <nftmx-td
                    class="text-tertiary-400 hover:text-red-900"
                    @click="cancelPurchase(order)"
                  >
                    <span> Cancel purchase </span>
                  </nftmx-td>
                </nftmx-tr>
                <nftmx-tr v-if="buyOrderLoading">
                  <td colspan="9">Loading...</td>
                </nftmx-tr>
                <nftmx-tr v-if="!buyOrderLoading && buyOrders.length === 0">
                  <td colspan="9">
                    <div
                      class="h-96 font-ibm-bold text-tertiary-500 text-lg flex items-center justify-center"
                    >
                      No Orders found
                    </div>
                  </td>
                </nftmx-tr>
                <nftmx-tr v-if="moreBuyOrders">
                  <td colspan="9">
                    <div class="w-full flex justify-center">
                      <nftmx-button
                        color="primary"
                        label="SEE MORE"
                        :outline="true"
                        @click="loadMoreBuyOrders"
                        class="font-ibm-bold text-lg text-primary-900 w-full sm:w-68"
                      />
                    </div>
                  </td>
                </nftmx-tr>
              </nftmx-tbody>
            </nftmx-table>
          </accordion>
          <div v-if="showBuyOrders" class="relative">
            <div
              v-if="selectedOrders.length > 0"
              class="text-right text-xs font-ibm-medium mt-2 absolute w-full"
            >
              <span
                class="text-red-900 cursor-pointer hover:text-red-800 transition"
                @click="cancelMultiPurchase"
              >
                Cancel Purchase
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

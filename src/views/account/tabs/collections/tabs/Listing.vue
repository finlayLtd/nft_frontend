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
import ListingOrderCard from "../components/ListingOrderCard.vue";
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
import { cancelOrderBySeller } from "@/core/utils/contracts/market.utils";
import NftmxButton from "@/core/components/basic/NftmxButton.vue";
import { useToast } from "vue-toastification";

const props = defineProps({
  account: Object,
});

const emit = defineEmits(["cancel-sale"]);

const toast = useToast();
const _account = computed(() => props.account);
const store = useStore();
const windowWidth = computed(() => store.state.app.windowWidth);
const walletAddress = computed(() => store.getters["auth/walletAddress"]);
const userId = computed(() => store.getters["auth/userId"]);
const newPack = ref([]);
const loading = ref(false);
const allOrders = ref({ orders: [], cursor: null });
const orders = ref([]);
const more = computed(
  () =>
    allOrders.value.cursor ||
    orders.value.length < allOrders.value.orders.length
);
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
      const votedOrder = orders.value.find((item) => item.id === order.id);
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
  initialOrders();
};
const cancelSale = (id) => {
  const index = allOrders.value.orders.findIndex((asset) => asset.id === id);
  allOrders.value.orders.splice(index, 1);
  const lines = Math.ceil((orders.value.length - 1) / limit.value);
  orders.value = allOrders.value.orders.slice(0, limit.value * lines);
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
const cancelMultiOrders = () => {
  const orderIds = selectedOrders.value.map((order) => order.orderId);
  cancelOrderBySeller(selectedOrders.value[0].contractAddress, orderIds).then(
    (res) => {
      for (let i = 0; i < selectedOrders.value.length; i++) {
        const index = allOrders.value.orders.findIndex(
          (asset) => asset.id === selectedOrders.value[i].id
        );
        allOrders.value.orders.splice(index, 1);
      }
      const lines = Math.ceil((orders.value.length - 1) / limit.value);
      orders.value = allOrders.value.orders.slice(0, limit.value * lines);
      selectedOrders.value = [];
    }
  );
};
const loadMoreOrders = async () => {
  loading.value = true;
  if (allOrders.value.cursor) await retrieveOrders();
  loading.value = false;
  const sliceLimit = limit.value * 3;
  const nextStartPoint = orders.value.length;
  orders.value = orders.value.concat(
    allOrders.value.orders.slice(nextStartPoint, nextStartPoint + sliceLimit)
  );
};
const initialOrders = async () => {
  allOrders.value = { orders: [], cursor: null };
  orders.value = [];
  loading.value = true;
  await retrieveOrders();
  loading.value = false;
  orders.value = orders.value.concat(
    allOrders.value.orders.slice(0, limit.value * 4)
  );
};
const retrieveOrders = async () => {
  if (!_account.value) return;
  return new Promise((resolve, reject) => {
    usersService
      .listingOrders({
        ...filterOption.value,
        cursor: allOrders.value.cursor,
        limit: defaultPagination.limit,
        walletAddress: _account.value.walletAddress,
      })
      .then((res) => {
        allOrders.value = {
          orders: [...allOrders.value.orders, ...res.data.orders],
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
  const lines = Math.ceil(orders.value.length / limit.value);
  orders.value = allOrders.value.orders.slice(0, newLimit * lines);
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
    initialOrders();
  }
});
onMounted(() => {
  if (_account.value) {
    setLimitValue(windowWidth.value);
    initialOrders();
  }
});
</script>

<template>
  <div class="flex flex-col sm:flex-row mb-22 xl:pt-7.25">
    <div class="flex-1">
      <div class="flex xl:justify-end">
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
      <div
        v-if="orders.length > 0"
        class="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 mt-10"
      >
        <listing-order-card
          v-for="order in orders"
          :key="order.id"
          :order="order"
          :account="_account"
          @vote="vote"
          @cancel-sale="cancelSale"
          @select-order="selectOrder"
        />
      </div>
      <div
        v-if="loading"
        class="h-96 font-ibm-bold text-tertiary-500 text-lg flex items-center justify-center"
      >
        Loading...
      </div>
      <div
        v-if="!loading && orders.length === 0"
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
            @click="cancelMultiOrders"
          >
            Delist
          </span>
        </div>
      </div>
      <div class="text-center w-full mt-8">
        <nftmx-button
          v-if="more"
          color="primary"
          label="SEE MORE"
          :outline="true"
          @click="loadMoreOrders"
          class="font-ibm-bold text-lg text-primary-900 w-full sm:w-68"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import NftmxInput from "@/core/components/basic/NftmxInput.vue";
import BasicDropdown from "@/core/components/dropdown/BasicDropdown.vue";
import { computed, onMounted, ref, watch, watchEffect } from "vue";
import { useStore } from "vuex";
import marketService from "@/core/services/market.service";
import collectionsService from "@/core/services/market/collections.service";
import { themeConfig, defaultPagination } from "@/core/config/constant";
import OpenseaAssetCard from "@/core/components/cards/OpenseaAssetCard.vue";
import useDebouncedRef from "@/core/utils/hook/useDebouncedRef";
import BasicDropdownItem from "@/core/components/dropdown/BasicDropdownItem.vue";
import { useRoute } from "vue-router";
import SearchOption from "./SearchOption.vue";
import VueSlider from "vue-3-slider-component";
import NftmxScatterChart from "@/core/components/chart/NftmxScatterChart.vue";
import NftmxBarChart from "@/core/components/chart/NftmxBarChart.vue";
import NftCart from "@/core/components/cart/NftCart.vue";
import NftmxButton from "@/core/components/basic/NftmxButton.vue";
import { roundTo, getChainKey } from "@/core/utils/common";
import NftmxThead from "@/core/components/table/NftmxThead.vue";
import NftmxTh from "@/core/components/table/NftmxTh.vue";
import NftmxTbody from "@/core/components/table/NftmxTbody.vue";
import NftmxTd from "@/core/components/table/NftmxTd.vue";
import NftmxTr from "@/core/components/table/NftmxTr.vue";
import Timer from "@/core/components/timer/Timer.vue";
import NftmxImg from "@/core/components/basic/NftmxImg.vue";

const props = defineProps({
  collection: Object,
});

const store = useStore();
const windowWidth = computed(() => store.state.app.windowWidth);
const userId = computed(() => store.getters["auth/userId"]);
const coinPrice = computed(() => store.state.market.coinPrice);
const route = useRoute();
const chain = route.params.chain;
const contractAddress = route.params.contractAddress.toLocaleLowerCase();
const name = useDebouncedRef("", 1000);
const loading = ref(true);
const allAssets = ref({ assets: [], cursor: null });
const assets = ref([]);
const limit = ref(2);
const more = computed(
  () =>
    allAssets.value.cursor ||
    assets.value.length < allAssets.value.assets.length
);
const openFilter = ref(false);
const filterOption = ref({
  chain: chain,
  name: "",
  protection: false,
  buyNow: false,
  onAuction: false,
  hasOffer: false,
  hasNoOffer: false,
  recentSold: false,
  recentCancel: false,
  endingSoon: false,
  min: null,
  max: null,
  minSlippage: null,
  maxSlippage: null,
  staking: "",
  sortBy: "",
  hashtag: "",
});
const amount = ref(0);
const viewOption = ref("TILE");
const isCartOpened = ref(false);
const saleType = ref("All");
const broomItems = ref([]);
const listingCount = ref(0);

const retrieveAssets = async () => {
  return new Promise((resolve, reject) => {
    marketService
      .searchNfts({
        ...filterOption.value,
        collection: [contractAddress],
        cursor: allAssets.value.cursor,
        limit: 24,
      })
      .then((res) => {
        allAssets.value = {
          assets: [...allAssets.value.assets, ...res.data.nfts],
          cursor: res.data.cursor,
        };
        resolve(true);
      })
      .catch((err) => {
        resolve(false);
      });
  });
};
const loadMoreAssets = async () => {
  loading.value = true;
  if (allAssets.value.cursor) await retrieveAssets();
  loading.value = false;
  const sliceLimit = limit.value * 4;
  const nextStartPoint = assets.value.length;
  assets.value = assets.value.concat(
    allAssets.value.assets.slice(nextStartPoint, nextStartPoint + sliceLimit)
  );
};
const initialAssets = async () => {
  allAssets.value = { assets: [], cursor: null };
  assets.value = [];
  loading.value = true;
  await retrieveAssets();
  loading.value = false;
  assets.value = assets.value.concat(
    allAssets.value.assets.slice(0, limit.value * 4)
  );
};
const setLimit = () => {
  let rowCount = 6;
  if (windowWidth.value >= themeConfig.xl3) {
    rowCount = 6;
  } else if (windowWidth.value >= themeConfig.xl2) {
    rowCount = 5;
  } else if (windowWidth.value >= themeConfig.xl) {
    rowCount = 4;
  } else if (windowWidth.value >= themeConfig.lg) {
    rowCount = 3;
  } else if (windowWidth.value >= themeConfig.sm) {
    rowCount = 2;
  }
  if (isCartOpened.value) {
    rowCount--;
  }
  if (windowWidth.value < themeConfig.sm) {
    rowCount = 1;
  }

  limit.value = rowCount;
};
watch(windowWidth, () => {
  setLimit();
});
watch(isCartOpened, () => {
  setLimit();
});
watch(limit, (newVal, oldVal) => {
  const rows = Math.ceil(assets.value.length / oldVal);
  assets.value = allAssets.value.assets.slice(0, rows * newVal);
});
const startDrag = (evt, item) => {
  evt.dataTransfer.dropEffect = "move";
  evt.dataTransfer.effectAllowed = "move";
  evt.dataTransfer.setData("movingItem", JSON.stringify(item));
};
const addRandomNfts = () => {
  const items = broomItems.value.slice(0, amount.value);
  for (let i = 0; i < items.length; i++) {
    store.commit("market/addToCart", items[i]);
  }
};
onMounted(() => {
  setLimit();
  initialAssets();
  marketService
    .searchNfts({
      sortBy: "HIGH_TO_LOW",
      orderBy: "ASC",
      collection: [contractAddress],
      limit: 10,
    })
    .then((res) => {
      for (let i = 0; i < res.data.nfts.length; i++) {
        const element = res.data.nfts[i];
        if (element.currentOrder) {
          broomItems.value.push(element);
        }
      }
    });
  collectionsService.listingStats(contractAddress).then((res) => {
    listingCount.value = res.data;
  });
});
watch(name, (val) => {
  filterOption.value = { ...filterOption.value, name: val };
  initialAssets();
});
const applyNftFiltering = (option) => {
  filterOption.value = option;
  initialAssets();
};
watch(saleType, (val) => {
  if (val === "All") {
    filterOption.value.buyNow = false;
    filterOption.value.onAuction = false;
  } else if (val === "Auction") {
    filterOption.value.buyNow = false;
    filterOption.value.onAuction = true;
  } else if (val === "Asking price") {
    filterOption.value.buyNow = true;
    filterOption.value.onAuction = false;
  }
  initialAssets();
});
</script>

<template>
  <div class="pb-15">
    <div class="pt-4 pb-2 lg:flex gap-4.75 justify-end items-center">
      <div class="flex relative cursor-pointer border border-black">
        <font-awesome-icon
          :icon="['fas', 'search']"
          class="text-white text-lg absolute top-4 left-5 pointer-events-none"
        />
        <div class="bg-tertiary-800 w-full lg:w-68.25 text-sm px-10">
          <nftmx-input
            v-model="name"
            class="h-12.5"
            placeholder="Search"
            border="none"
          />
        </div>
        <font-awesome-icon
          :icon="['fas', 'filter']"
          :class="[
            openFilter ? 'text-primary-900' : 'text-white',
            'text-sm absolute top-4.5 right-5 hover:text-primary-900 cursor-pointer transition',
          ]"
          @click="openFilter = !openFilter"
        />
      </div>
      <font-awesome-icon
        :icon="['fas', 'square']"
        :class="[
          viewOption === 'TILE' ? 'text-primary-900' : 'text-white',
          'transition hover:text-primary-900 cursor-pointer text-lg',
        ]"
        @click="viewOption = 'TILE'"
      />
      <font-awesome-icon
        :icon="['fas', 'th-list']"
        :class="[
          viewOption === 'LIST' ? 'text-primary-900' : 'text-white',
          'transition hover:text-primary-900 cursor-pointer text-lg',
        ]"
        @click="viewOption = 'LIST'"
      />
      <div class="h-5 border-l border-l-black border-r border-r-tertiary-700" />
      <div
        @click="isCartOpened = !isCartOpened"
        :class="[
          isCartOpened
            ? 'fill-primary-900'
            : 'fill-white hover:fill-primary-900',
          'flex transition cursor-pointer',
        ]"
      >
        <div class="w-5.5 h-5.5">
          <svg viewBox="0 0 64 64">
            <g>
              <path
                class="st0"
                d="M62.95,13.89c0.27-1.27-0.53-2.51-1.8-2.79c-1.27-0.27-2.51,0.53-2.79,1.8l-4.81,22.34H20.72L13.64,5.71H2.41
		c-1.3,0-2.35,1.05-2.35,2.35s1.05,2.35,2.35,2.35h7.53l9.12,38.05h36.51c1.3,0,2.35-1.05,2.35-2.35s-1.05-2.35-2.35-2.35H22.76
		l-0.92-3.83h35.49L62.95,13.89z"
              />
              <circle class="st0" cx="26" cy="54.57" r="4.04" />
              <circle class="st0" cx="48.41" cy="54.57" r="4.04" />
              <polygon
                class="st0"
                points="50.1,18.37 41.24,18.37 41.24,5.71 37.07,5.71 32.9,5.71 32.9,18.37 24.04,18.37 37.07,30.46 	"
              />
            </g>
          </svg>
        </div>
        <div class="relative text-white">
          <div
            class="absolute inline-flex items-center justify-center px-2 h-5.5 text-11 rounded-full -top-2 -left-2 shadow-default shadow-white bg-tertiary-900"
          >
            {{ store.state.market.cartItems.length }}
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-between items-center">
      <div class="flex items-center gap-4 text-white font-ibm text-sm">
        <div
          class="flex w-68 h-11.25 border border-black divide-x divide-black bg-tertiary-800"
        >
          <div
            :class="[
              viewOption === 'SALES' ||
              viewOption === 'DEPTH' ||
              broomItems.length === 0
                ? 'fill-tertiary-400'
                : 'fill-white',
              'bg-black w-11 flex items-center justify-center p-1.5',
            ]"
          >
            <svg viewBox="0 0 32.6 32.6">
              <g>
                <path
                  class="st0"
                  d="M7.7,16l8.6-3.4l3.8,3.8l-3.4,8.6c-0.1,0.2-0.2,0.3-0.5,0.4s-0.4,0-0.5-0.2l-4.5-4.5l0.8-2.6l-2.6,0.8L7.5,17
      c-0.2-0.1-0.2-0.3-0.2-0.5S7.5,16.1,7.7,16z M25.1,8.2c0.1,0.1,0.2,0.3,0.2,0.4s-0.1,0.3-0.2,0.4l-3.6,3.6l1.4,1.4
      c0.1,0.1,0.1,0.2,0.1,0.3s-0.1,0.2-0.2,0.2l-2.1,1l-3.7-3.7l1-2.1c0-0.1,0.1-0.2,0.2-0.2s0.2,0,0.3,0.1l1.4,1.4l3.6-3.6
      c0.1-0.1,0.3-0.2,0.4-0.2s0.3,0.1,0.4,0.2L25.1,8.2z"
                />
              </g>
            </svg>
          </div>
          <div
            :class="[
              viewOption === 'SALES' ||
              viewOption === 'DEPTH' ||
              broomItems.length === 0
                ? 'text-tertiary-400'
                : 'white',
              'w-11 flex items-center justify-center  text-sm',
            ]"
          >
            {{ amount }}
          </div>
          <div class="flex-1 px-4 py-3.75">
            <vue-slider
              v-model="amount"
              :min="0"
              :max="broomItems.length"
              :disabled="
                viewOption === 'SALES' ||
                viewOption === 'DEPTH' ||
                broomItems.length === 0
                  ? true
                  : false
              "
              :interval="1"
              :dotSize="12"
              :dotOptions="[
                {
                  style: {
                    backgroundColor: 'rgb(25 203 88)',
                  },
                },
              ]"
              :height="2"
              :processStyle="{ backgroundColor: 'rgb(25 203 88)' }"
              :railStyle="{ backgroundColor: 'rgb(148 148 148)' }"
              tooltip="none"
              @drag-end="addRandomNfts"
            >
            </vue-slider>
          </div>
        </div>
        <span
          :class="[
            viewOption === 'SALES'
              ? 'text-primary-900'
              : 'hover:text-primary-900',
            'ml-6 transition cursor-pointer',
          ]"
          @click="viewOption = 'SALES'"
        >
          Sales
        </span>
        <div
          class="border-l border-l-black border-r border-r-tertiary-700 h-4"
        />
        <span
          :class="[
            viewOption === 'DEPTH'
              ? 'text-primary-900'
              : 'hover:text-primary-900',
            'transition cursor-pointer',
          ]"
          @click="viewOption = 'DEPTH'"
        >
          Depth
        </span>
      </div>
      <div class="flex gap-4.5 text-white text-sm">
        <div>
          <span> Listed: </span>
          <span>
            {{ listingCount.toLocaleString() }}/{{
              (collection?.items || 0).toLocaleString()
            }}
          </span>
          <span class="text-11 text-tertiary-400">
            [{{
              collection?.items
                ? roundTo((listingCount / collection.items) * 100, 2)
                : 0
            }}%]
          </span>
        </div>
        <div class="ml-12">
          <span
            :class="[
              saleType === 'All'
                ? 'text-primary-900'
                : 'hover:text-primary-900',
              'cursor-pointer transition',
            ]"
            @click="saleType = 'All'"
          >
            All
          </span>
        </div>
        <div
          class="h-5 border-l border-l-black border-r border-r-tertiary-700"
        />
        <div>
          <span
            :class="[
              saleType === 'Auction'
                ? 'text-primary-900'
                : 'hover:text-primary-900',
              'cursor-pointer transition',
            ]"
            @click="saleType = 'Auction'"
          >
            Auction
          </span>
        </div>
        <div
          class="h-5 border-l border-l-black border-r border-r-tertiary-700"
        />
        <div>
          <span
            :class="[
              saleType === 'Asking price'
                ? 'text-primary-900'
                : 'hover:text-primary-900',
              'cursor-pointer transition',
            ]"
            @click="saleType = 'Asking price'"
          >
            Asking price
          </span>
        </div>
      </div>
    </div>
    <search-option
      :filterOption="filterOption"
      @apply-filter="applyNftFiltering"
      :openFilter="openFilter"
    />
    <div v-if="viewOption === 'SALES'" class="mt-5">
      <nftmx-scatter-chart :collection="collection" />
    </div>
    <div
      v-else-if="viewOption === 'DEPTH'"
      class="border border-black bg-tertiary-800 mt-5"
    >
      <nftmx-bar-chart :collection="collection" />
    </div>
    <div v-else>
      <div class="pt-10.5 pb-7.5">
        <div class="flex">
          <div v-if="loading || allAssets.assets.length > 0" class="flex-1">
            <div
              v-if="viewOption === 'TILE'"
              :class="[
                'grid gap-4.5',
                isCartOpened
                  ? 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5'
                  : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6',
              ]"
            >
              <opensea-asset-card
                v-for="asset in assets"
                :key="asset.id"
                :asset="asset"
                :draggable="true"
                @dragstart="startDrag($event, asset)"
                class="cursor-grab active:cursor-grabbing"
              />
            </div>
            <div
              v-if="viewOption === 'LIST'"
              class="overflow-x-auto text-11 tracking-wider leading-4 -mt-4 -mx-4 -mb-1.5 p-4"
            >
              <div class="w-full min-w-fit relative">
                <table
                  class="w-full divide-y divide-black font-ibm text-white z-1 relative"
                >
                  <nftmx-thead>
                    <tr>
                      <th v-for="i in 9" :key="i" />
                      <th
                        class="border border-black py-4 text-primary-900 bg-tertiary-800 shadow-default shadow-primary-900"
                        colspan="3"
                        style="width: 291px"
                      >
                        <div>Liquidity Protection</div>
                      </th>
                    </tr>
                    <nftmx-tr class="border border-black bg-tertiary-800">
                      <nftmx-th class="text-left">#</nftmx-th>
                      <nftmx-th class="text-left">Item</nftmx-th>
                      <nftmx-th class="text-left">Liked</nftmx-th>
                      <nftmx-th class="text-left">Rarity</nftmx-th>
                      <nftmx-th class="text-left">Transfers</nftmx-th>
                      <nftmx-th class="text-left">Floor price</nftmx-th>
                      <nftmx-th class="text-left">Last value</nftmx-th>
                      <nftmx-th class="text-left">ROI</nftmx-th>
                      <nftmx-th class="text-left"
                        >Multilevel ownership</nftmx-th
                      >
                      <th style="width: 99px" class="relative">
                        <div class="w-24">Period</div>
                        <div
                          class="absolute w-2 h-full -left-2.25 top-0 bg-gradient-to-r opacity-30 from-transparent to-primary-900"
                        />
                      </th>
                      <th style="width: 100px">
                        <div class="w-24.5">Slippage</div>
                      </th>
                      <th style="width: 99px" class="relative">
                        <div class="w-24">Staking</div>
                        <div
                          class="absolute w-2 h-full1 -right-2.25 top-0 bg-gradient-to-r opacity-30 from-primary-900"
                        />
                      </th>
                    </nftmx-tr>
                  </nftmx-thead>
                  <nftmx-tbody
                    :style="{
                      border: '1px solid black',
                    }"
                    class="bg-tertiary-800"
                  >
                    <nftmx-tr
                      v-for="(asset, index) in assets"
                      :key="asset.id"
                      class="hover:bg-tertiary-300 cursor-pointer shadow-default hover:shadow-primary-900"
                    >
                      <nftmx-td>
                        <span>
                          {{ index + 1 }}
                        </span>
                        <font-awesome-icon
                          :icon="['fas', 'star']"
                          :class="[
                            asset.starUsers?.findIndex(
                              (item) => item.id === userId
                            ) > -1
                              ? 'text-primary-900'
                              : 'text-tertiary-600',
                            ' ml-2 hover:text-primary-900 transition',
                          ]"
                          @click="starNft(index)"
                        />
                      </nftmx-td>
                      <td class="td-info px-4 py-3">
                        <div class="flex gap-4.5 items-center w-50">
                          <div class="w-11 h-11">
                            <nftmx-img
                              :src="asset.imageUrl"
                              class="h-full w-full object-cover bg-black"
                            />
                          </div>
                          <div class="flex-1">
                            <span>
                              {{ asset.name }}
                            </span>
                          </div>
                        </div>
                      </td>
                      <nftmx-td class="td-info">
                        <div class="flex items-center">
                          <span class="text-tertiary-400">
                            {{ asset.votes.length }}
                          </span>
                          <font-awesome-icon
                            :icon="['fas', 'thumbs-up']"
                            class="text-tertiary-600 hover:text-primary-900 ml-2"
                          />
                        </div>
                      </nftmx-td>
                      <nftmx-td class="td-info text-primary-900">
                        1:{{ asset.contract.items }}
                      </nftmx-td>
                      <nftmx-td class="td-info text-primary-900">
                        {{ asset.transfers }}
                      </nftmx-td>
                      <nftmx-td class="td-info text-primary-900">
                        {{ asset.floorPrice }}
                      </nftmx-td>
                      <nftmx-td class="td-info text-primary-900">
                        <div class="flex items-center">
                          <font-awesome-icon
                            v-if="asset.chain === 'ETHEREUM'"
                            :icon="['fab', 'ethereum']"
                          />
                          <div
                            v-if="asset.chain === 'BSC-TESTNET'"
                            class="w-3 h-3 fill-primary-900"
                          >
                            <svg viewBox="0 0 24 24">
                              <title>Binance</title>
                              <path
                                d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                              />
                            </svg>
                          </div>
                          <span class="ml-1">
                            {{ roundTo(0.1) }}
                          </span>
                        </div>
                        <div class="text-tertiary-400">
                          [${{ roundTo(0.4781, 4) }}]
                        </div>
                      </nftmx-td>
                      <nftmx-td class="td-info text-primary-900">
                        <div class="text-primary-900">+4,780.80</div>
                        <div class="text-tertiary-400">[47.81x]</div>
                      </nftmx-td>
                      <nftmx-td class="td-info text-tertiary-400">
                        <div>Total owners: 1</div>
                        <div>Total ownership: 20%</div>
                      </nftmx-td>
                      <td
                        class="text-center td-info bg-tertiary-800 relative"
                        style="width: 99px"
                      >
                        <div class="w-24">
                          {{
                            asset.currentOrder
                              ? Math.round(
                                  asset.currentOrder.protectionTime / 86400
                                )
                              : 0
                          }}
                          Days
                        </div>
                        <div
                          class="absolute w-2 h-full -left-2.25 top-0 bg-gradient-to-r opacity-30 from-transparent to-primary-900"
                        />
                      </td>
                      <td
                        class="text-center td-info bg-tertiary-800 relative"
                        style="width: 100px"
                      >
                        <div class="w-24.5">
                          {{
                            asset.currentOrder
                              ? 100 - asset.currentOrder.protectionRate
                              : 0
                          }}%
                        </div>
                      </td>
                      <td
                        class="text-center td-info relative bg-tertiary-800"
                        style="width: 99px"
                      >
                        <div class="w-24">
                          <div>Yes</div>
                        </div>
                        <div
                          class="absolute w-2 h-full1 -right-2.25 top-0 bg-gradient-to-r opacity-30 from-primary-900"
                        />
                      </td>
                      <td class="td-action" colspan="8">
                        <router-link
                          :to="{
                            name: 'asset',
                            params: {
                              chain: asset.contract.chain,
                              tokenAddress: asset.contract.address,
                              tokenId: asset.tokenId,
                            },
                          }"
                          target="_blank"
                        >
                          <div
                            v-if="
                              asset.currentOrder &&
                              asset.currentOrder.orderType === '1'
                            "
                            class="text-center"
                          >
                            <span> Current auction ends in </span>
                            <div class="pt-2.5 w-fit mx-auto max-w-full">
                              <timer
                                :time="
                                  parseInt(
                                    asset.currentOrder.endSaleTime -
                                      new Date().getTime() / 1000 >
                                      0
                                      ? asset.currentOrder.endSaleTime -
                                          new Date().getTime() / 1000
                                      : 0
                                  )
                                "
                              />
                            </div>
                          </div>
                          <div v-else class="grid grid-cols-2 items-center">
                            <div
                              class="text-center text-tertiary-400 border-r border-r-black"
                            >
                              <span> Floor price </span>
                              <div
                                class="flex items-end w-fit mx-auto max-w-full"
                              >
                                <div
                                  class="flex items-center gap-2 text-lg text-primary-900 font-ibm-medium"
                                >
                                  <font-awesome-icon
                                    v-if="asset.contract.chain === 'ETHEREUM'"
                                    :icon="['fab', 'ethereum']"
                                  />
                                  <div
                                    v-if="
                                      asset.contract.chain === 'BSC-TESTNET'
                                    "
                                    class="w-4 h-4 fill-primary-900"
                                  >
                                    <svg viewBox="0 0 24 24">
                                      <path
                                        d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                                      />
                                    </svg>
                                  </div>
                                  {{ roundTo(asset.baselinePrice) }}
                                </div>
                                <div class="pb-1">
                                  <span class="ml-2">[$</span>
                                  <span>
                                    {{
                                      roundTo(
                                        asset.baselinePrice *
                                          coinPrice[
                                            getChainKey(asset.contract.chain)
                                          ]
                                      )
                                    }}
                                  </span>
                                  <span>]</span>
                                </div>
                              </div>
                            </div>
                            <div
                              v-if="
                                asset.currentOrder &&
                                asset.currentOrder.orderType === '0'
                              "
                              class="text-center text-tertiary-400 border-l border-l-tertiary-700"
                            >
                              <span> Asking price </span>
                              <div
                                class="flex items-end w-fit mx-auto max-w-full"
                              >
                                <div
                                  class="flex items-center gap-2 text-lg text-primary-900 font-ibm-medium"
                                >
                                  <font-awesome-icon
                                    v-if="asset.contract.chain === 'ETHEREUM'"
                                    :icon="['fab', 'ethereum']"
                                  />
                                  <div
                                    v-if="
                                      asset.contract.chain === 'BSC-TESTNET'
                                    "
                                    class="w-4 h-4 fill-primary-900"
                                  >
                                    <svg viewBox="0 0 24 24">
                                      <path
                                        d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                                      />
                                    </svg>
                                  </div>
                                  {{ roundTo(asset.currentOrder.tokenPrice) }}
                                </div>
                                <div class="pb-1">
                                  <span class="ml-2">[$</span>
                                  <span>
                                    {{
                                      roundTo(
                                        asset.currentOrder.tokenPrice *
                                          coinPrice[
                                            getChainKey(asset.contract.chain)
                                          ]
                                      )
                                    }}
                                  </span>
                                  <span>]</span>
                                </div>
                              </div>
                            </div>
                            <div
                              v-else
                              class="text-center text-tertiary-400 border-l border-l-tertiary-700"
                            >
                              <span> Last value </span>
                              <div
                                class="flex items-end w-fit mx-auto max-w-full"
                              >
                                <div
                                  class="flex items-center gap-2 text-lg text-primary-900 font-ibm-medium"
                                >
                                  <font-awesome-icon
                                    v-if="asset.contract.chain === 'ETHEREUM'"
                                    :icon="['fab', 'ethereum']"
                                  />
                                  <div
                                    v-if="
                                      asset.contract.chain === 'BSC-TESTNET'
                                    "
                                    class="w-4 h-4 fill-primary-900"
                                  >
                                    <svg viewBox="0 0 24 24">
                                      <path
                                        d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                                      />
                                    </svg>
                                  </div>
                                  {{
                                    roundTo(
                                      asset.lastOrder
                                        ? asset.lastOrder.tokenPrice
                                        : 0
                                    )
                                  }}
                                </div>
                                <div class="pb-1">
                                  <span class="ml-2">[$</span>
                                  <span>
                                    {{
                                      asset.lastOrder
                                        ? roundTo(
                                            asset.lastOrder.tokenPrice *
                                              coinPrice[
                                                getChainKey(
                                                  asset.contract.chain
                                                )
                                              ]
                                          )
                                        : 0
                                    }}
                                  </span>
                                  <span>]</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </router-link>
                      </td>
                      <td
                        class="td-action p-0 relative"
                        colspan="3"
                        style="width: 291px; height: 69px"
                      >
                        <router-link
                          :to="{
                            name: 'asset',
                            params: {
                              chain: asset.contract.chain,
                              tokenAddress: asset.contract.address,
                              tokenId: asset.tokenId,
                            },
                          }"
                          target="_blank"
                          class="absolute left-0 top-0 h-full"
                        >
                          <nftmx-button
                            v-if="
                              asset.currentOrder &&
                              asset.currentOrder.orderStatus === '0' &&
                              asset.currentOrder.orderType === '0'
                            "
                            color="primary"
                            :label="'BUY NOW'"
                            class="w-76.25 font-press text-sm z-1"
                            h="xl1"
                          />
                          <nftmx-button
                            v-else-if="
                              asset.currentOrder &&
                              asset.currentOrder.orderType === '1' &&
                              (asset.currentOrder.orderStatus === '0' ||
                                asset.currentOrder.orderStatus === '1')
                            "
                            color="primary"
                            label="BID NOW"
                            class="w-76.25 font-press text-sm z-1"
                            h="xl1"
                          />
                          <div
                            v-else
                            class="flex items-center justify-center transition-all w-76.25 font-press text-sm h-17 bg-black text-primary-900 z-1"
                          >
                            MAKE AN OFFER
                          </div>
                          <div
                            :class="[
                              asset.currentOrder
                                ? 'bg-primary-100'
                                : 'bg-black',
                              'absolute w-3 h-3 rotate-45 right-0.5 -bottom-1.5',
                            ]"
                          />
                        </router-link>
                      </td>
                    </nftmx-tr>
                  </nftmx-tbody>
                </table>
                <div
                  class="absolute bottom-0 right-0 w-75 h-2 shadow-default shadow-primary-900 z-0"
                />
              </div>
            </div>
            <div
              v-if="loading"
              class="h-96 flex justify-center items-center font-ibm-bold text-tertiary-500 text-lg"
            >
              Loading...
            </div>
          </div>
          <div
            v-if="!loading && allAssets.assets.length === 0"
            class="flex-1 h-96 flex justify-center items-center font-ibm-bold text-tertiary-500 text-lg"
          >
            No NFTs found
          </div>
          <nft-cart :nftCart="isCartOpened" />
        </div>
      </div>
      <div v-if="more" class="text-sm px-6 font-ibm-medium flex justify-center">
        <nftmx-button
          color="primary"
          label="SEE MORE"
          :outline="true"
          @click="loadMoreAssets"
          class="font-ibm-bold text-lg text-primary-900 h-13.5 w-full md:w-auto md:px-22.5"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
tr:hover .td-info {
  display: none;
}
.td-action {
  display: none;
}
tr:hover .td-action {
  display: table-cell;
}
.h-full1 {
  height: calc(100% + 1px);
}
</style>

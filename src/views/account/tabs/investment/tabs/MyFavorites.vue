<script setup>
import { computed, onMounted, ref, watch, watchEffect } from "vue";
import NftmxImg from "@/core/components/basic/NftmxImg.vue";
import NftmxTrimString from "@/core/components/basic/NftmxTrimString.vue";
import usersService from "@/core/services/market/users.service";
import { themeConfig, defaultPagination } from "@/core/config/constant";
import { useStore } from "vuex";
import FavoriteAssetCard from "../components/FavoriteAssetCard.vue";
import NftmxSearchInput from "@/core/components/basic/NftmxSearchInput.vue";
import useDebouncedRef from "@/core/utils/hook/useDebouncedRef";
import marketService from "@/core/services/market.service";
import nftsService from "@/core/services/market/nfts.service";
import OrderSearchOptions from "../../collections/components/OrderSearchOptions.vue";
import {
  setApprovalForAll,
  isApprovedForAll,
} from "@/core/utils/contracts/erc721.utils";
import { claimDownsideProtectionAmount } from "@/core/utils/contracts/market.utils";
import NftmxButton from "@/core/components/basic/NftmxButton.vue";
import Accordion from "@/core/components/accordion/Accordion.vue";
import NftmxTable from "@/core/components/table/NftmxTable.vue";
import NftmxThead from "@/core/components/table/NftmxThead.vue";
import NftmxTh from "@/core/components/table/NftmxTh.vue";
import NftmxTbody from "@/core/components/table/NftmxTbody.vue";
import NftmxTd from "@/core/components/table/NftmxTd.vue";
import NftmxTr from "@/core/components/table/NftmxTr.vue";
import Timer from "@/core/components/timer/Timer.vue";
import { roundTo, getChainKey } from "@/core/utils/common";
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
const coinPrice = computed(() => store.state.market.coinPrice);
const userId = computed(() => store.getters["auth/userId"]);
const loading = ref(false);
const allFavoriteTokens = ref({ nfts: [], cursor: null });
const favoriteTokens = ref([]);
const moreTokens = computed(
  () =>
    allFavoriteTokens.value.cursor ||
    favoriteTokens.value.length < allFavoriteTokens.value.nfts.length
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
const selectedTokens = ref([]);
const viewOption = ref("TILE");
const checkedAll = ref(false);

const vote = async (token) => {
  if (!userId.value) {
    toast.error("Please login first");
    return;
  }
  nftsService
    .vote({
      chain: filterOption.value.chain,
      userId: userId.value,
      nftId: token.id,
    })
    .then((res) => {
      const votedToken = favoriteTokens.value.find(
        (item) => item.id === token.id
      );
      if (res.data) {
        votedToken.votes.push(store.state.user);
      } else {
        const index = votedToken.votes.findIndex(
          (item) => item.id === userId.value
        );
        votedToken.votes.splice(index, 1);
      }
    });
};
const clickFilter = () => {
  filterActive.value = !filterActive.value;
};
const filterOrders = (value) => {
  filterOption.value = value;
  initialTokens();
};
const selectToken = (order, checked) => {
  const index = selectedTokens.value.findIndex((item) => item.id === order.id);
  if (index > -1 && !checked) {
    selectedTokens.value.splice(index, 1);
  }
  if (index === -1 && checked) {
    selectedTokens.value.push(order);
  }
};
const selectAllTokens = (checked) => {
  checkedAll.value = checked;
  if (checked) selectedTokens.value = favoriteTokens.value;
  else selectedTokens.value = [];
};
const unfavoriteToken = (token) => {
  usersService.unfavoriteTokens(walletAddress.value, [token.id]).then((res) => {
    const index = allFavoriteTokens.value.nfts.findIndex(
      (asset) => asset.id === token.id
    );
    allFavoriteTokens.value.nfts.splice(index, 1);
    const lines = Math.ceil((favoriteTokens.value.length - 1) / limit.value);
    favoriteTokens.value = allFavoriteTokens.value.nfts.slice(
      0,
      limit.value * lines
    );
  });
};
const unfavoriteMultiTokens = () => {
  const tokenIds = selectedTokens.value.map((token) => token.id);
  usersService.unfavoriteTokens(walletAddress.value, tokenIds).then((res) => {
    for (let i = 0; i < selectedTokens.value.length; i++) {
      const index = allFavoriteTokens.value.nfts.findIndex(
        (asset) => asset.id === selectedTokens.value[i].id
      );
      allFavoriteTokens.value.nfts.splice(index, 1);
    }
    const lines = Math.ceil((favoriteTokens.value.length - 1) / limit.value);
    favoriteTokens.value = allFavoriteTokens.value.nfts.slice(
      0,
      limit.value * lines
    );
    selectedTokens.value = [];
  });
};
const starNft = async (index) => {
  if (!userId.value) {
    store.commit("app/OPEN_CONNECT_WALLET_MODAL");
    return;
  }
  nftsService
    .starNft({
      nftId: favoriteTokens.value[index].id,
      userId: userId.value,
    })
    .then((res) => {
      if (res.data) {
        favoriteTokens.value[index].starUsers
          ? favoriteTokens.value[index].starUsers.push(store.state.user)
          : (favoriteTokens.value[index].starUsers = [store.state.user]);
      } else {
        const i = favoriteTokens.value[index].starUsers?.findIndex(
          (item) => item.id === userId.value
        );
        i > -1 && favoriteTokens.value[index].starUsers.splice(i, 1);
      }
    });
};
const loadMoreBuyOrders = async () => {
  loading.value = true;
  if (allFavoriteTokens.value.cursor) await retrieveFavoriteTokens();
  loading.value = false;
  const sliceLimit = limit.value * 3;
  const nextStartPoint = favoriteTokens.value.length;
  favoriteTokens.value = favoriteTokens.value.concat(
    allFavoriteTokens.value.nfts.slice(
      nextStartPoint,
      nextStartPoint + sliceLimit
    )
  );
};
const initialTokens = async () => {
  allFavoriteTokens.value = { nfts: [], cursor: null };
  favoriteTokens.value = [];
  loading.value = true;
  await retrieveFavoriteTokens();
  loading.value = false;
  favoriteTokens.value = favoriteTokens.value.concat(
    allFavoriteTokens.value.nfts.slice(0, limit.value * 4)
  );
  console.log("favoriteTokens.value=====", favoriteTokens.value);
};
const retrieveFavoriteTokens = async () => {
  if (!_account.value) return;
  return new Promise((resolve, reject) => {
    usersService
      .favoriteTokens({
        ...filterOption.value,
        cursor: allFavoriteTokens.value.cursor,
        limit: defaultPagination.limit,
        walletAddress: _account.value.walletAddress,
      })
      .then((res) => {
        allFavoriteTokens.value = {
          nfts: [...allFavoriteTokens.value.nfts, ...res.data.nfts],
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
  const lines = Math.ceil(favoriteTokens.value.length / limit.value);
  favoriteTokens.value = allFavoriteTokens.value.nfts.slice(
    0,
    newLimit * lines
  );
  limit.value = newLimit;
  console.log("ssssssssssss.value=====", favoriteTokens.value);
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
    initialTokens();
  }
});
onMounted(() => {
  if (_account.value) {
    setLimitValue(windowWidth.value);
    initialTokens();
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
      <div v-if="viewOption === 'TILE' && favoriteTokens.length > 0">
        <div class="mt-11">
          <div class="overflow-hidden p-4 -m-4">
            <div
              v-if="favoriteTokens.length > 0"
              class="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6"
            >
              <favorite-asset-card
                v-for="token in favoriteTokens"
                :key="token.id"
                :token="token"
                @vote="vote"
                @select-order="selectToken"
                @unfavorite-token="unfavoriteToken"
              />
            </div>
            <div
              v-if="loading"
              class="h-96 font-ibm-bold text-tertiary-500 text-lg flex items-center justify-center"
            >
              Loading...
            </div>
            <div
              v-if="!loading && favoriteTokens.length === 0"
              class="h-96 font-ibm-bold text-tertiary-500 text-lg flex items-center justify-center"
            >
              No Orders found
            </div>
            <div class="relative">
              <div
                v-if="selectedTokens.length > 0"
                class="text-right text-xs font-ibm-medium mt-2 absolute w-full"
              >
                <span
                  class="text-red-700 cursor-pointer"
                  @click="unfavoriteMultiTokens"
                >
                  Unfavorite
                </span>
              </div>
            </div>
            <div class="text-center w-full mt-8">
              <nftmx-button
                v-if="moreTokens"
                color="primary"
                label="SEE MORE"
                :outline="true"
                @click="loadMoreBuyOrders"
                class="font-ibm-bold text-lg text-primary-900 w-full sm:w-68"
              />
            </div>
          </div>
        </div>
      </div>
      <div v-if="viewOption === 'LIST' && favoriteTokens.length > 0">
        <div class="mt-10">
          <div
            class="overflow-x-auto text-11 tracking-wider leading-4 mt-2 p-4 -mx-4"
          >
            <div class="w-full min-w-fit relative">
              <table
                class="w-full divide-y divide-black font-ibm text-white z-1 relative"
              >
                <nftmx-thead>
                  <tr>
                    <th v-for="i in 10" :key="i" />
                    <th
                      class="border border-black py-4 text-primary-900 bg-tertiary-800 shadow-default shadow-primary-900"
                      colspan="3"
                      style="width: 291px"
                    >
                      <div>Liquidity Protection</div>
                    </th>
                  </tr>
                  <nftmx-tr class="border border-black bg-tertiary-800">
                    <nftmx-th>
                      <basic-checkbox
                        :checked="checkedAll"
                        small
                        bgColor="bg-tertiary-700"
                        @check="selectAllTokens"
                      />
                    </nftmx-th>
                    <nftmx-th class="text-left">#</nftmx-th>
                    <nftmx-th class="text-left">Item</nftmx-th>
                    <nftmx-th class="text-left">Liked</nftmx-th>
                    <nftmx-th class="text-left">
                      <div class="w-14">Rarity</div>
                    </nftmx-th>
                    <nftmx-th class="text-left">Transfers</nftmx-th>
                    <nftmx-th class="text-left">Floor price</nftmx-th>
                    <nftmx-th class="text-left">Last value</nftmx-th>
                    <nftmx-th class="text-left">ROI</nftmx-th>
                    <nftmx-th class="text-left">Multilevel ownership</nftmx-th>
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
                    v-for="(asset, index) in favoriteTokens"
                    :key="asset.id"
                    class="hover:bg-tertiary-300 cursor-pointer shadow-default hover:shadow-primary-900"
                  >
                    <nftmx-td class="w-0 text-center">
                      <basic-checkbox
                        :checked="
                          selectedTokens.findIndex(
                            (item) => item.id === asset.id
                          ) > -1
                        "
                        small
                        bgColor="bg-tertiary-700"
                        @check="(checked) => selectToken(asset, checked)"
                      />
                    </nftmx-td>
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
                                  v-if="asset.contract.chain === 'BSC-TESTNET'"
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
                                  v-if="asset.contract.chain === 'BSC-TESTNET'"
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
                                  v-if="asset.contract.chain === 'BSC-TESTNET'"
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
                                              getChainKey(asset.contract.chain)
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
                            asset.currentOrder ? 'bg-primary-100' : 'bg-black',
                            'absolute w-3 h-3 rotate-45 right-0.5 -bottom-2',
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
          <div class="relative">
            <div
              v-if="selectedTokens.length > 0"
              class="text-right text-xs font-ibm-medium mt-2 absolute w-full"
            >
              <span
                class="text-red-900 cursor-pointer hover:text-red-800 transition"
                @click="unfavoriteMultiTokens"
              >
                Unfavorite
              </span>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="!loading && favoriteTokens.length === 0"
        class="h-96 font-ibm-bold text-tertiary-500 text-lg flex items-center justify-center"
      >
        No Offers found
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

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import Accordion from "@/core/components/accordion/BasicAccordion.vue";
import Derivatives from "./Derivatives.vue";
import NftmxButton from "@/core/components/basic/NftmxButton.vue";
import NftCart from "@/core/components/cart/NftCart.vue";
import { roundTo, getChainKey } from "@/core/utils/common";
import NftmxTable from "@/core/components/table/NftmxTable.vue";
import NftmxThead from "@/core/components/table/NftmxThead.vue";
import NftmxTh from "@/core/components/table/NftmxTh.vue";
import NftmxTbody from "@/core/components/table/NftmxTbody.vue";
import NftmxTd from "@/core/components/table/NftmxTd.vue";
import NftmxTr from "@/core/components/table/NftmxTr.vue";
import NftmxImg from "@/core/components/basic/NftmxImg.vue";
import marketService from "@/core/services/market.service";
import InitialOfferingCard from "@/core/components/cards/InitialOfferingCard.vue";
import Timer from "@/core/components/timer/Timer.vue";
import { useStore } from "vuex";
import NftmxTrimString from "@/core/components/basic/NftmxTrimString.vue";
import nftsService from "@/core/services/market/nfts.service";

const props = defineProps({
  ledgerPanelVisible: Boolean,
  filterOption: Object,
  isCartOpened: Boolean,
  viewOption: String,
});

const store = useStore();
const userId = computed(() => store.getters["auth/userId"]);
const assetFilterOption = computed(() => props.filterOption);
const allAssets = ref({ assets: [], cursor: null });
const assets = ref([]);
const offerings = ref([]);
const moreAssets = computed(
  () =>
    allAssets.value.cursor ||
    assets.value.length < allAssets.value.assets.length
);
const loading = ref(true);
const sortBy = ref("HIGH_TO_LOW");
const filterByValue = ref({ ...props.filterOption, sortBy: "HIGH_TO_LOW" });
const filterByNew = ref({ ...props.filterOption, sortBy: "NEW" });
const filterByActivity = ref({ ...props.filterOption, sortBy: "ACTIVITY" });
const filterByView = ref({ ...props.filterOption, sortBy: "VIEW" });
const filterByLiked = ref({ ...props.filterOption, sortBy: "LIKED" });
const coinPrice = computed(() => store.state.market.coinPrice);

const loadMoreAssets = async () => {
  loading.value = true;
  if (allAssets.value.cursor) await retrieveAssets();
  loading.value = false;
  assets.value = allAssets.value.assets;
};
const initialAssets = async () => {
  allAssets.value = { assets: [], cursor: null };
  assets.value = [];
  loading.value = true;
  await retrieveAssets();
  loading.value = false;
  assets.value = allAssets.value.assets;
};
const retrieveAssets = async () => {
  return new Promise((resolve, reject) => {
    marketService
      .searchNfts({
        ...props.filterOption,
        cursor: allAssets.value.cursor,
        limit: 30,
        sortBy: sortBy.value,
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
const starNft = async (index) => {
  if (!userId.value) {
    store.commit("app/OPEN_CONNECT_WALLET_MODAL");
    return;
  }
  nftsService
    .starNft({
      nftId: assets.value[index].id,
      userId: userId.value,
    })
    .then((res) => {
      if (res.data) {
        assets.value[index].starUsers
          ? assets.value[index].starUsers.push(store.state.user)
          : (assets.value[index].starUsers = [store.state.user]);
      } else {
        const i = assets.value[index].starUsers?.findIndex(
          (item) => item.id === userId.value
        );
        i > -1 && assets.value[index].starUsers.splice(i, 1);
      }
    });
};
onMounted(() => {
  initialAssets();
  nftsService.searchOfferings({ limit: 1 }).then((res) => {
    offerings.value = res.data;
  });
});
const filter = (sort) => {
  sortBy.value = sort;
  initialAssets();
};
watch(assetFilterOption, (filterOption) => {
  if (props.viewOption === "LIST") {
    initialAssets();
  }
  filterByValue.value = { ...filterOption, sortBy: "HIGH_TO_LOW" };
  filterByNew.value = { ...filterOption, sortBy: "NEW" };
  filterByActivity.value = { ...filterOption, sortBy: "ACTIVITY" };
  filterByView.value = { ...filterOption, sortBy: "VIEW" };
  filterByLiked.value = { ...filterOption, sortBy: "LIKED" };
});
</script>

<template>
  <div class="flex-1 flex">
    <div
      v-if="viewOption === 'TILE'"
      class="flex-1 lg:pl-1.5 -mr-4 -ml-4 lg:-ml-0 -mb-6"
    >
      <derivatives
        v-if="filterOption.sortBy"
        title="Explore"
        :filterOption="filterOption"
        :ledgerPanelVisible="ledgerPanelVisible"
        first
        :isCartOpened="isCartOpened"
        :viewOption="viewOption"
      />
      <derivatives
        v-if="!filterOption.sortBy"
        first
        title="Most Value"
        :filterOption="filterByValue"
        :ledgerPanelVisible="ledgerPanelVisible"
        :isCartOpened="isCartOpened"
        :viewOption="viewOption"
      />
      <derivatives
        v-if="!filterOption.sortBy"
        title="Most New"
        :filterOption="filterByNew"
        :ledgerPanelVisible="ledgerPanelVisible"
        :isCartOpened="isCartOpened"
        :viewOption="viewOption"
      />
      <div v-if="!filterOption.sortBy" class="px-4 text-white">
        <div class="border-t border-black mt-10 mb-4" />
        <div class="font-press text-sm py-2.75">
          Initial Offering
          <router-link to="/initial-offering" target="_blank">
            <font-awesome-icon
              :icon="['fas', 'external-link-alt']"
              class="relative -top-2 text-xs cursor-pointer hover:text-primary-900"
            />
          </router-link>
        </div>
        <initial-offering-card
          v-for="item in offerings"
          :key="item.id"
          :offering="item"
          class="mt-3.25"
        />
      </div>
      <derivatives
        v-if="!filterOption.sortBy"
        title="Most Activity"
        :filterOption="filterByActivity"
        :ledgerPanelVisible="ledgerPanelVisible"
        :isCartOpened="isCartOpened"
        :viewOption="viewOption"
      />
      <derivatives
        v-if="!filterOption.sortBy"
        title="Most View"
        :filterOption="filterByView"
        :ledgerPanelVisible="ledgerPanelVisible"
        :isCartOpened="isCartOpened"
        :viewOption="viewOption"
      />
      <derivatives
        v-if="!filterOption.sortBy"
        title="Most Liked"
        :filterOption="filterByLiked"
        :ledgerPanelVisible="ledgerPanelVisible"
        :isCartOpened="isCartOpened"
        :viewOption="viewOption"
      />
    </div>
    <div
      v-if="viewOption === 'LIST'"
      :class="[
        ledgerPanelVisible && 'pl-4.5',
        'flex-1 overflow-auto -mx-4 -mb-2',
      ]"
    >
      <div>
        <div
          class="font-press text-sm flex items-center gap-4 text-white mt-2.5 pl-4"
        >
          <span
            :class="[
              sortBy === 'HIGH_TO_LOW' ? 'text-primary-900' : 'text-white',
              'cursor-pointer hover:text-primary-900 transition',
            ]"
            @click="filter('HIGH_TO_LOW')"
          >
            Most Value
          </span>
          <div
            class="h-6 border-l border-l-black border-r border-r-tertiary-700"
          />
          <span
            :class="[
              sortBy === 'NEW' ? 'text-primary-900' : 'text-white',
              'cursor-pointer hover:text-primary-900 transition',
            ]"
            @click="filter('NEW')"
          >
            Most New
          </span>
          <div
            class="h-6 border-l border-l-black border-r border-r-tertiary-700"
          />
          <span
            :class="[
              sortBy === 'ACTIVITY' ? 'text-primary-900' : 'text-white',
              'cursor-pointer hover:text-primary-900 transition',
            ]"
            @click="filter('ACTIVITY')"
          >
            Most Activity
          </span>
          <div
            class="h-6 border-l border-l-black border-r border-r-tertiary-700"
          />
          <span
            :class="[
              sortBy === 'VIEW' ? 'text-primary-900' : 'text-white',
              'cursor-pointer hover:text-primary-900 transition',
            ]"
            @click="filter('VIEW')"
          >
            Most View
          </span>
          <div
            class="h-6 border-l border-l-black border-r border-r-tertiary-700"
          />
          <span
            :class="[
              sortBy === 'LIKED' ? 'text-primary-900' : 'text-white',
              'cursor-pointer hover:text-primary-900 transition',
            ]"
            @click="filter('LIKED')"
          >
            Most Liked
          </span>
        </div>
        <div class="overflow-x-auto text-11 tracking-wider leading-4 mt-2 p-4">
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
                  v-for="(asset, index) in assets"
                  :key="index"
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
                    <div class="flex gap-4.5 items-center w-60">
                      <div class="w-11 h-11">
                        <nftmx-img
                          :src="asset.imageUrl"
                          class="h-full w-full object-cover bg-black"
                        />
                      </div>
                      <div class="flex-1">
                        <nftmx-trim-string :line="2">
                          {{ asset.name }}
                        </nftmx-trim-string>
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
                          <div class="flex items-end w-fit mx-auto max-w-full">
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
                          <div class="flex items-end w-fit mx-auto max-w-full">
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
                          <div class="flex items-end w-fit mx-auto max-w-full">
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
      </div>
    </div>
    <div
      v-if="viewOption === 'LIST' && moreAssets"
      class="absolute bottom-0 left-0 flex justify-center w-full h-26"
    >
      <div class="text-center w-full px-4 sm:px-10">
        <nftmx-button
          color="primary"
          label="SEE MORE"
          :outline="true"
          @click="loadMoreAssets"
          class="font-ibm-bold text-lg text-primary-900 h-13.5 w-full md:w-auto md:px-22.5"
        />
      </div>
    </div>
    <nft-cart
      :nftCart="isCartOpened"
      :class="['mt-10', viewOption === 'TILE' ? '-mb-6' : '']"
    />
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

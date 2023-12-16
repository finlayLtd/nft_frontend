<script setup>
import NftmxTrimString from "@/core/components/basic/NftmxTrimString.vue";
import Timer from "@/core/components/timer/Timer.vue";
import NftmxInput from "@/core/components/basic/NftmxInput.vue";
import InitialOfferingCarousel from "@/core/components/carousel/InitialOfferingCarousel.vue";
import VueSlider from "vue-3-slider-component";
import { computed, onMounted, ref, watch } from "vue";
import Accordion from "@/core/components/accordion/BasicAccordion.vue";
import NftCart from "@/core/components/cart/NftCart.vue";
import marketService from "@/core/services/market.service";
import DerivativeOfferingCard from "@/core/components/cards/DerivativeOfferingCard.vue";
import NftmxTable from "@/core/components/table/NftmxTable.vue";
import NftmxThead from "@/core/components/table/NftmxThead.vue";
import NftmxTh from "@/core/components/table/NftmxTh.vue";
import NftmxTbody from "@/core/components/table/NftmxTbody.vue";
import NftmxTd from "@/core/components/table/NftmxTd.vue";
import NftmxTr from "@/core/components/table/NftmxTr.vue";
import NftmxImg from "@/core/components/basic/NftmxImg.vue";
import { roundTo, getChainKey } from "@/core/utils/common";
import NftmxButton from "@/core/components/basic/NftmxButton.vue";
import { useStore } from "vuex";
import nftsService from "@/core/services/market/nfts.service";

const props = defineProps({
  ledgerPanelVisible: Boolean,
  filterOption: Object,
  isCartOpened: Boolean,
  viewOption: String,
});

const store = useStore();
const userId = computed(() => store.getters["auth/userId"]);
const open = ref(false);
const amount = ref(2);
const limit = ref(2);
const loading = ref(true);
const filterOption = computed(() => props.filterOption);
const coinPrice = computed(() => store.state.market.coinPrice);
const offeringNfts = ref([]);
const offerings = ref([]);
const saleType = ref("All");

const getOfferings = (data) => {
  nftsService
    .searchOfferings({
      derivative: true,
    })
    .then((res) => {
      console.log(res);
      offerings.value = res.data;
    });
};
const starNft = async (index) => {
  if (!userId.value) {
    store.commit("app/OPEN_CONNECT_WALLET_MODAL");
    return;
  }
  nftsService
    .starNft({
      nftId: offeringNfts.value[index].id,
      userId: userId.value,
    })
    .then((res) => {
      if (res.data) {
        offeringNfts.value[index].starUsers
          ? offeringNfts.value[index].starUsers.push(store.state.user)
          : (offeringNfts.value[index].starUsers = [store.state.user]);
      } else {
        const i = offeringNfts.value[index].starUsers?.findIndex(
          (item) => item.id === userId.value
        );
        i > -1 && offeringNfts.value[index].starUsers.splice(i, 1);
        console.log(offeringNfts.value[index].starUsers, i);
      }
    });
};

onMounted(() => {
  getOfferings();
  marketService
    .searchNfts({
      initial: true,
      type: "DERIVATIVE",
      // ...filterOption.value,
      // cursor: allAssets.value.cursor,
      // limit: 24,
    })
    .then((res) => {
      console.log(res);
      loading.value = false;
      offeringNfts.value = res.data.nfts;
    });
});
const onClickOutside = () => {
  open.value = false;
};
const handleClick = () => {
  open.value = !open.value;
};
watch(filterOption, (value) => {
  getOfferings();
});
</script>

<template>
  <div
    :class="[
      ledgerPanelVisible ? 'lg:pl-5' : 'pl-0',
      'flex-1 text-white -mt-2.5',
    ]"
  >
    <div>
      <div class="flex justify-between">
        <div class="flex gap-4 font-press text-base text-white items-center">
          <span> Derivatives Offering </span>
        </div>
        <div class="flex gap-8 items-center pb-2.5">
          <div
            class="flex w-68 h-12.5 border border-black divide-x divide-black bg-tertiary-800"
          >
            <div class="bg-black w-12.5 flex items-center justify-center">
              <img src="/images/components/dice_white.png" />
            </div>
            <div class="w-12.5 flex items-center justify-center">
              {{ amount }}
            </div>
            <div class="flex-1 p-4">
              <vue-slider
                v-model="amount"
                :min="0"
                :max="10"
                :interval="1"
                :dotSize="12"
                :dotOptions="[
                  {
                    style: {
                      backgroundColor: '#19cb58',
                    },
                  },
                ]"
                :height="2"
                :processStyle="{ backgroundColor: 'rgb(25 203 88)' }"
                :railStyle="{ backgroundColor: 'rgb(148 148 148)' }"
                tooltip="none"
              >
              </vue-slider>
            </div>
          </div>
          <div class="relative w-60 z-10 h-13.5 pt-1.5">
            <div
              class="absolute w-full z-10 px-5 overflow-hidden bg-tertiary-800"
              v-click-outside="onClickOutside"
            >
              <accordion
                mIcon
                :border="false"
                :sidebar="true"
                v-model="open"
                @handle-click="handleClick"
                handleEmit
                class="w-full"
              >
                <template v-slot:caption>
                  <div class="text-13 font-ibm-medium py-3 mr-4 h-10">
                    2 projects
                  </div>
                </template>
                <div class="pb-2">
                  <div class="text-sm py-2">Bored Ape Yatch Club</div>
                  <div class="text-sm py-2">ABC</div>
                </div>
              </accordion>
            </div>
          </div>
          <div class="flex gap-4 items-center text-sm font-ibm-medium">
            <span class="text-primary-900"> All </span>
            <div
              class="h-6 border-l border-l-black border-r border-r-tertiary-700"
            />
            <span class="text-white"> Auction </span>
            <div
              class="h-6 border-l border-l-black border-r border-r-tertiary-700"
            />
            <span class="text-white"> Asking price </span>
          </div>
        </div>
      </div>
      <div class="flex">
        <div v-if="viewOption === 'TILE'" class="flex-1">
          <div v-if="offerings.length > 0" class="grid grid-cols-2 gap-5">
            <derivative-offering-card
              v-for="item in offerings"
              :key="item.id"
              :offering="item"
            />
          </div>
          <div
            v-else-if="!loading"
            class="flex flex-col items-center h-104 justify-center"
          >
            <div class="text-red-600 font-ibm-bold text-lg">
              No offers available
            </div>
            <div class="text-tertiary-400 text-sm mt-3.5">
              <span class="text-primary-900"> Launch </span>
              <span>
                your own Derivatives Offering | Sign up to receive an alert when
                a new offering becomes available
              </span>
            </div>
            <div class="text-2xl text-tertiary-400 mt-5 flex gap-6">
              <font-awesome-icon :icon="['fab', 'telegram-plane']" />
              <font-awesome-icon :icon="['fab', 'discord']" />
              <font-awesome-icon :icon="['fab', 'twitter']" />
            </div>
          </div>
          <div
            v-if="loading"
            class="h-104 font-ibm-bold text-tertiary-500 text-lg flex items-center justify-center"
          >
            Loading...
          </div>
        </div>
        <div v-if="viewOption === 'LIST'" class="flex-1 overflow-auto -m-4">
          <div
            v-if="offeringNfts.length > 0"
            class="overflow-x-auto text-11 tracking-wider leading-4 p-4"
          >
            <div class="w-full min-w-fit relative">
              <table
                class="w-full divide-y divide-black font-ibm text-white z-1 relative"
              >
                <nftmx-thead>
                  <tr>
                    <th v-for="i in 6" :key="i" />
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
                    <nftmx-th class="text-left">Total supply</nftmx-th>
                    <nftmx-th class="text-left">Type supply</nftmx-th>
                    <nftmx-th class="text-left">Floor price</nftmx-th>
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
                    v-for="(asset, index) in offeringNfts"
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
                      1:{{ asset.contract.items }}
                    </nftmx-td>
                    <nftmx-td class="td-info"> Individual </nftmx-td>
                    <nftmx-td class="td-info text-primary-900">
                      <div class="flex items-center gap-1">
                        <font-awesome-icon
                          v-if="asset.contract.chain === 'ETHEREUM'"
                          :icon="['fab', 'ethereum']"
                        />
                        <div
                          v-if="asset.contract.chain === 'BSC-TESTNET'"
                          class="w-3 h-3 fill-primary-900"
                        >
                          <svg viewBox="0 0 24 24">
                            <path
                              d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                            />
                          </svg>
                        </div>
                        <span>
                          {{ roundTo(0.1) }}
                        </span>
                      </div>
                      <div class="text-tertiary-400">
                        [${{ roundTo(0.4781, 4) }}]
                      </div>
                    </nftmx-td>
                    <nftmx-td class="td-info">
                      {{
                        asset.mlrContract && asset.mlrContract.owners
                          ? asset.mlrContract.owners.reduce(
                              (ac, owner) => ac + owner.realRoyalty,
                              0
                            )
                          : 0
                      }}%
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
                      <div class="w-24">{{ asset.staking ? "Yes" : "No" }}</div>
                      <div
                        class="absolute w-2 h-full1 -right-2.25 top-0 bg-gradient-to-r opacity-30 from-primary-900"
                      />
                    </td>
                    <td class="td-action" colspan="5">
                      <div class="text-center">
                        <span> Current auction ends in </span>
                        <div class="pt-2.5 w-fit mx-auto max-w-full">
                          <timer :time="1000000" />
                        </div>
                      </div>
                    </td>
                    <td
                      class="td-action p-0 relative"
                      colspan="3"
                      style="width: 291px; height: 69px"
                    >
                      <!-- <router-link
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
                      > -->
                      <div class="absolute left-0 top-0 h-full">
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
                          v-else
                          color="primary"
                          label="BID NOW"
                          class="w-76.25 font-press text-sm z-1"
                          h="xl1"
                        />
                        <div
                          :class="[
                            asset.currentOrder
                              ? 'bg-primary-100'
                              : 'bg-primary-100',
                            'absolute w-3 h-3 rotate-45 right-0.5 -bottom-2',
                          ]"
                        />
                      </div>
                      <!-- </router-link> -->
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
            v-else-if="!loading"
            class="flex flex-col items-center h-104 justify-center"
          >
            <div class="text-red-600 font-ibm-bold text-lg">
              No offers available
            </div>
            <div class="text-tertiary-400 text-sm mt-3.5">
              <span class="text-primary-900"> Launch </span>
              <span>
                your own Derivatives Offering | Sign up to receive an alert when
                a new offering becomes available
              </span>
            </div>
            <div class="text-2xl text-tertiary-400 mt-5 flex gap-6">
              <font-awesome-icon :icon="['fab', 'telegram-plane']" />
              <font-awesome-icon :icon="['fab', 'discord']" />
              <font-awesome-icon :icon="['fab', 'twitter']" />
            </div>
          </div>
          <div
            v-if="loading"
            class="h-104 font-ibm-bold text-tertiary-500 text-lg flex items-center justify-center"
          >
            Loading...
          </div>
        </div>
        <nft-cart
          v-if="saleType !== 'Auction'"
          class="-mb-6"
          :nftCart="isCartOpened"
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

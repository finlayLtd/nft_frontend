<script setup>
import NftmxTrimString from "@/core/components/basic/NftmxTrimString.vue";
import Timer from "@/core/components/timer/Timer.vue";
import NftmxInput from "@/core/components/basic/NftmxInput.vue";
import InitialOfferingCarousel from "@/core/components/carousel/InitialOfferingCarousel.vue";
import VueSlider from "vue-3-slider-component";
import { computed, onMounted, ref, watch } from "vue";
import Accordion from "@/core/components/accordion/BasicAccordion.vue";
import NftCart from "@/core/components/cart/NftCart.vue";
import PublicSaleCard from "@/core/components/cards/PublicSaleCard.vue";
import InitialOfferingCard from "@/core/components/cards/InitialOfferingCard.vue";
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
import marketService from "@/core/services/market.service";

const props = defineProps({
  ledgerPanelVisible: Boolean,
  filterOption: Object,
  isCartOpened: Boolean,
  viewOption: String,
});

const assetFilterOption = computed(() => props.filterOption);
const store = useStore();
const userId = computed(() => store.getters["auth/userId"]);
const tab = ref("Live Now");
const subTab = ref("AI-based NFT");
const saleType = ref("All");
const open = ref(false);
const amount = ref(0);
const offerings = ref([]);
const allAssets = ref({ assets: [], cursor: null });
const assets = ref([]);
const moreAssets = computed(
  () =>
    allAssets.value.cursor ||
    assets.value.length < allAssets.value.assets.length
);
const floorNfts = ref([]);
const coinPrice = computed(() => store.state.market.coinPrice);
const sortBy = ref("");
const orderBy = ref("DESC");
const loading = ref(true);

const onClickOutside = () => {
  open.value = false;
};
const handleClick = () => {
  open.value = !open.value;
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
        console.log(assets.value[index].starUsers, i);
      }
    });
};
const getOfferings = (data) => {
  nftsService.searchOfferings(data).then((res) => {
    console.log(res);
    offerings.value = res.data;
  });
};
const addRandomNfts = () => {
  const items = floorNfts.value.slice(0, amount.value);
  for (let i = 0; i < items.length; i++) {
    store.commit("market/addToCart", items[i]);
  }
};
const sortTable = (val) => {
  if (sortBy.value === val) {
    orderBy.value = orderBy.value === "ASC" ? "DESC" : "ASC";
  } else {
    sortBy.value = val;
  }
  initialAssets();
};
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
        initial: true,
        cursor: allAssets.value.cursor,
        limit: 30,
        sortBy: sortBy.value || props.filterOption?.sortBy,
        orderBy: sortBy.value ? orderBy.value : "",
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
onMounted(() => {
  getOfferings();
  initialAssets();
  marketService
    .searchNfts({
      initial: true,
      buyNow: true,
      sortBy: "HIGH_TO_LOW",
      orderBy: "ASC",
    })
    .then((res) => {
      floorNfts.value = res.data.nfts;
    });
});
watch(saleType, (val) => {
  const data = { buyNow: false, onAuction: false };
  if (val === "Auction") {
    data.onAuction = true;
  } else if (val === "Asking price") {
    data.buyNow = true;
  }
  getOfferings(data);
});
watch(assetFilterOption, (val) => {
  if (props.viewOption === "LIST") {
    initialAssets();
  } else {
    getOfferings(val);
  }
});
</script>

<template>
  <div :class="[ledgerPanelVisible ? 'lg:pl-5' : 'pl-0', 'flex-1 text-white']">
    <div>
      <div class="flex justify-between">
        <div class="flex gap-4 font-press text-base py-3">
          <span
            :class="[
              tab === 'Live Now' ? 'text-primary-900' : 'text-white',
              'cursor-pointer hover:text-primary-900 transition',
            ]"
            @click="tab = 'Live Now'"
          >
            Live Now
          </span>
          <div
            class="h-full border-l border-l-black border-r border-r-tertiary-700"
          />
          <span
            :class="[
              tab === 'Coming Soon' ? 'text-primary-900' : 'text-white',
              'cursor-pointer hover:text-primary-900 transition',
            ]"
            @click="tab = 'Coming Soon'"
          >
            Coming Soon
          </span>
          <div
            class="h-full border-l border-l-black border-r border-r-tertiary-700"
          />
          <span
            :class="[
              tab === 'Past' ? 'text-primary-900' : 'text-white',
              'cursor-pointer hover:text-primary-900 transition',
            ]"
            @click="tab = 'Past'"
          >
            Past
          </span>
        </div>
        <div class="relative w-60 z-10 h-13.5">
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
      </div>
      <div class="flex justify-between">
        <div class="flex gap-4 font-ibm-medium text-sm text-white py-3">
          <span
            :class="[
              subTab === 'AI-based NFT' ? 'text-white' : 'text-tertiary-400',
              'cursor-pointer hover:text-white transition',
            ]"
            @click="subTab = 'AI-based NFT'"
          >
            <font-awesome-icon :icon="['fas', 'info-circle']" />
            <span> AI-based NFT </span>
          </span>
          <div
            class="h-full border-l border-l-black border-r border-r-tertiary-700"
          />
          <span
            :class="[
              subTab === '100% Liquidity Protection'
                ? 'text-white'
                : 'text-tertiary-400',
              'cursor-pointer hover:text-white transition',
            ]"
            @click="subTab = '100% Liquidity Protection'"
          >
            <font-awesome-icon :icon="['fas', 'info-circle']" />
            <span> 100% Liquidity Protection </span>
          </span>
          <div
            class="h-full border-l border-l-black border-r border-r-tertiary-700"
          />
          <span
            :class="[
              subTab === 'Multilevel Ownership'
                ? 'text-white'
                : 'text-tertiary-400',
              'cursor-pointer hover:text-white transition',
            ]"
            @click="subTab = 'Multilevel Ownership'"
          >
            <font-awesome-icon :icon="['fas', 'info-circle']" />
            <span> Multilevel Ownership </span>
          </span>
          <div
            class="h-full border-l border-l-black border-r border-r-tertiary-700"
          />
          <span
            :class="[
              subTab === 'Individual Supply'
                ? 'text-white'
                : 'text-tertiary-400',
              'cursor-pointer hover:text-white transition',
            ]"
            @click="subTab = 'Individual Supply'"
          >
            Individual Supply
          </span>
          <div
            class="h-full border-l border-l-black border-r border-r-tertiary-700"
          />
          <span
            :class="[
              subTab === 'Fractional Supply'
                ? 'text-white'
                : 'text-tertiary-400',
              'cursor-pointer hover:text-white transition',
            ]"
            @click="subTab = 'Fractional Supply'"
          >
            Fractional Supply
          </span>
        </div>
        <div class="flex gap-8">
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
                v-if="floorNfts.length > 0"
                v-model="amount"
                :min="0"
                :max="floorNfts.length > 10 ? 10 : floorNfts.length"
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
                @drag-end="addRandomNfts"
              >
              </vue-slider>
              <vue-slider
                v-else
                v-model="amount"
                :min="0"
                :max="10"
                :interval="1"
                :dotSize="12"
                :dotOptions="[
                  {
                    style: {
                      backgroundColor: 'rgb(148 148 148)',
                    },
                  },
                ]"
                :height="2"
                :processStyle="{ backgroundColor: 'rgb(148 148 148)' }"
                :railStyle="{ backgroundColor: 'rgb(148 148 148)' }"
                tooltip="none"
                disabled
              >
              </vue-slider>
            </div>
          </div>
          <div class="flex gap-4 items-center text-sm font-ibm-medium">
            <span
              :class="[
                saleType === 'All' ? 'text-primary-900' : 'text-white',
                'cursor-pointer hover:text-primary-900 transition',
              ]"
              @click="saleType = 'All'"
            >
              All
            </span>
            <div
              class="h-6 border-l border-l-black border-r border-r-tertiary-700"
            />
            <span
              :class="[
                saleType === 'Auction' ? 'text-primary-900' : 'text-white',
                'cursor-pointer hover:text-primary-900 transition',
              ]"
              @click="saleType = 'Auction'"
            >
              Auction
            </span>
            <div
              class="h-6 border-l border-l-black border-r border-r-tertiary-700"
            />
            <span
              :class="[
                saleType === 'Asking price' ? 'text-primary-900' : 'text-white',
                'cursor-pointer hover:text-primary-900 transition',
              ]"
              @click="saleType = 'Asking price'"
            >
              Asking price
            </span>
          </div>
        </div>
      </div>
      <div
        v-if="subTab === 'AI-based NFT'"
        class="relative border border-black pt-6.5 pl-6.5 pb-10 pr-10 bg-tertiary-800 mt-8 text-tertiary-400 text-sm leading-6"
      >
        Reverse Market Making (RMM) is a liquidity solution for NFTs that
        provides instant liquidity through a smart contract without the need for
        a counterparty buyer. RMM is designed to provide 100% liquidity
        protection for buyers and allows sellers to act as market makers, which
        reduces the barried to entry for NFT trading. <br /><br />
        Example: <br />
        <div class="flex gap-4 mt-2">
          <div class="bg-tertiary-400 w-2.25 h-2.25 rounded-full mt-1.5" />
          <p class="flex-1">
            Bob seeks to sell his NFT for $1,000 while simultaneously earning a
            reward for acting as a market maker for future buyers. He employs
            Reverse Market Making (RMM) to provide the future buyer with
            complete liquidity protection fo 90 days, in exchange for a 5%
            slippage fee in case of cancellation. This ensures that even in the
            event of a canceled sale, Bob still earns a 5% profit over 90 days,
            equating to a 20% annual percentage yield (APY).
          </p>
        </div>
        <br />
        <div class="flex gap-4">
          <div class="bg-tertiary-400 w-2.25 h-2.25 rounded-full mt-1.5" />
          <p class="flex-1">
            Lisa decided to purchase Bob's NFT for $1,000 and transfers her
            funds to a Liquidity Protection smart contract acting as a
            safeguard. If Lisa finalizes the transaction, she will only have to
            pay the base price of $1,000 to Bos. However, if market conditions
            deteriorate or if Lisa is unable to resell the NFT, she has the
            option to reverse the transaction and receive a full refund of her
            funds, minus any applicable fees and slippage.
          </p>
        </div>
        <div
          @click="subTab = ''"
          class="absolute top-0 right-0 bg-black px-2.25 py-0.75 text-white hover:text-red-900 cursor-pointer transition"
        >
          <font-awesome-icon :icon="['fas', 'times']" />
        </div>
      </div>
      <div
        v-if="subTab === '100% Liquidity Protection'"
        class="relative border border-black pt-6.5 pl-6.5 pb-10 pr-10 bg-tertiary-800 mt-8 text-tertiary-400 text-sm leading-6"
      >
        Reverse Market Making (RMM) is a liquidity solution for NFTs that
        provides instant liquidity through a smart contract without the need for
        a counterparty buyer. RMM is designed to provide 100% liquidity
        protection for buyers and allows sellers to act as market makers, which
        reduces the barried to entry for NFT trading. <br /><br />
        Example: <br />
        <div class="flex gap-4 mt-2">
          <div class="bg-tertiary-400 w-2.25 h-2.25 rounded-full mt-1.5" />
          <p class="flex-1">
            Bob seeks to sell his NFT for $1,000 while simultaneously earning a
            reward for acting as a market maker for future buyers. He employs
            Reverse Market Making (RMM) to provide the future buyer with
            complete liquidity protection fo 90 days, in exchange for a 5%
            slippage fee in case of cancellation. This ensures that even in the
            event of a canceled sale, Bob still earns a 5% profit over 90 days,
            equating to a 20% annual percentage yield (APY).
          </p>
        </div>
        <br />
        <div class="flex gap-4">
          <div class="bg-tertiary-400 w-2.25 h-2.25 rounded-full mt-1.5" />
          <p class="flex-1">
            Lisa decided to purchase Bob's NFT for $1,000 and transfers her
            funds to a Liquidity Protection smart contract acting as a
            safeguard. If Lisa finalizes the transaction, she will only have to
            pay the base price of $1,000 to Bos. However, if market conditions
            deteriorate or if Lisa is unable to resell the NFT, she has the
            option to reverse the transaction and receive a full refund of her
            funds, minus any applicable fees and slippage.
          </p>
        </div>
        <div
          @click="subTab = ''"
          class="absolute top-0 right-0 bg-black px-2.25 py-0.75 text-white hover:text-red-900 cursor-pointer transition"
        >
          <font-awesome-icon :icon="['fas', 'times']" />
        </div>
      </div>
      <div
        v-if="subTab === 'Multilevel Ownership'"
        class="relative border border-black pt-6.5 pl-6.5 pb-10 pr-10 bg-tertiary-800 mt-8 text-tertiary-400 text-sm leading-6"
      >
        Reverse Market Making (RMM) is a liquidity solution for NFTs that
        provides instant liquidity through a smart contract without the need for
        a counterparty buyer. RMM is designed to provide 100% liquidity
        protection for buyers and allows sellers to act as market makers, which
        reduces the barried to entry for NFT trading. <br /><br />
        Example: <br />
        <div class="flex gap-4 mt-2">
          <div class="bg-tertiary-400 w-2.25 h-2.25 rounded-full mt-1.5" />
          <p class="flex-1">
            Bob seeks to sell his NFT for $1,000 while simultaneously earning a
            reward for acting as a market maker for future buyers. He employs
            Reverse Market Making (RMM) to provide the future buyer with
            complete liquidity protection fo 90 days, in exchange for a 5%
            slippage fee in case of cancellation. This ensures that even in the
            event of a canceled sale, Bob still earns a 5% profit over 90 days,
            equating to a 20% annual percentage yield (APY).
          </p>
        </div>
        <br />
        <div class="flex gap-4">
          <div class="bg-tertiary-400 w-2.25 h-2.25 rounded-full mt-1.5" />
          <p class="flex-1">
            Lisa decided to purchase Bob's NFT for $1,000 and transfers her
            funds to a Liquidity Protection smart contract acting as a
            safeguard. If Lisa finalizes the transaction, she will only have to
            pay the base price of $1,000 to Bos. However, if market conditions
            deteriorate or if Lisa is unable to resell the NFT, she has the
            option to reverse the transaction and receive a full refund of her
            funds, minus any applicable fees and slippage.
          </p>
        </div>
        <div
          @click="subTab = ''"
          class="absolute top-0 right-0 bg-black px-2.25 py-0.75 text-white hover:text-red-900 cursor-pointer transition"
        >
          <font-awesome-icon :icon="['fas', 'times']" />
        </div>
      </div>
      <div
        v-if="subTab === 'Individual Supply'"
        class="relative border border-black pt-6.5 pl-6.5 pb-10 pr-10 bg-tertiary-800 mt-8 text-tertiary-400 text-sm leading-6"
      >
        Reverse Market Making (RMM) is a liquidity solution for NFTs that
        provides instant liquidity through a smart contract without the need for
        a counterparty buyer. RMM is designed to provide 100% liquidity
        protection for buyers and allows sellers to act as market makers, which
        reduces the barried to entry for NFT trading. <br /><br />
        Example: <br />
        <div class="flex gap-4 mt-2">
          <div class="bg-tertiary-400 w-2.25 h-2.25 rounded-full mt-1.5" />
          <p class="flex-1">
            Bob seeks to sell his NFT for $1,000 while simultaneously earning a
            reward for acting as a market maker for future buyers. He employs
            Reverse Market Making (RMM) to provide the future buyer with
            complete liquidity protection fo 90 days, in exchange for a 5%
            slippage fee in case of cancellation. This ensures that even in the
            event of a canceled sale, Bob still earns a 5% profit over 90 days,
            equating to a 20% annual percentage yield (APY).
          </p>
        </div>
        <br />
        <div class="flex gap-4">
          <div class="bg-tertiary-400 w-2.25 h-2.25 rounded-full mt-1.5" />
          <p class="flex-1">
            Lisa decided to purchase Bob's NFT for $1,000 and transfers her
            funds to a Liquidity Protection smart contract acting as a
            safeguard. If Lisa finalizes the transaction, she will only have to
            pay the base price of $1,000 to Bos. However, if market conditions
            deteriorate or if Lisa is unable to resell the NFT, she has the
            option to reverse the transaction and receive a full refund of her
            funds, minus any applicable fees and slippage.
          </p>
        </div>
        <div
          @click="subTab = ''"
          class="absolute top-0 right-0 bg-black px-2.25 py-0.75 text-white hover:text-red-900 cursor-pointer transition"
        >
          <font-awesome-icon :icon="['fas', 'times']" />
        </div>
      </div>
      <div
        v-if="subTab === 'Fractional Supply'"
        class="relative border border-black pt-6.5 pl-6.5 pb-10 pr-10 bg-tertiary-800 mt-8 text-tertiary-400 text-sm leading-6"
      >
        Reverse Market Making (RMM) is a liquidity solution for NFTs that
        provides instant liquidity through a smart contract without the need for
        a counterparty buyer. RMM is designed to provide 100% liquidity
        protection for buyers and allows sellers to act as market makers, which
        reduces the barried to entry for NFT trading. <br /><br />
        Example: <br />
        <div class="flex gap-4 mt-2">
          <div class="bg-tertiary-400 w-2.25 h-2.25 rounded-full mt-1.5" />
          <p class="flex-1">
            Bob seeks to sell his NFT for $1,000 while simultaneously earning a
            reward for acting as a market maker for future buyers. He employs
            Reverse Market Making (RMM) to provide the future buyer with
            complete liquidity protection fo 90 days, in exchange for a 5%
            slippage fee in case of cancellation. This ensures that even in the
            event of a canceled sale, Bob still earns a 5% profit over 90 days,
            equating to a 20% annual percentage yield (APY).
          </p>
        </div>
        <br />
        <div class="flex gap-4">
          <div class="bg-tertiary-400 w-2.25 h-2.25 rounded-full mt-1.5" />
          <p class="flex-1">
            Lisa decided to purchase Bob's NFT for $1,000 and transfers her
            funds to a Liquidity Protection smart contract acting as a
            safeguard. If Lisa finalizes the transaction, she will only have to
            pay the base price of $1,000 to Bos. However, if market conditions
            deteriorate or if Lisa is unable to resell the NFT, she has the
            option to reverse the transaction and receive a full refund of her
            funds, minus any applicable fees and slippage.
          </p>
        </div>
        <div
          @click="subTab = ''"
          class="absolute top-0 right-0 bg-black px-2.25 py-0.75 text-white hover:text-red-900 cursor-pointer transition"
        >
          <font-awesome-icon :icon="['fas', 'times']" />
        </div>
      </div>
      <div class="flex mt-10 relative">
        <div v-if="viewOption === 'TILE'" class="flex-1">
          <div v-if="offerings.length > 0">
            <public-sale-card v-for="(item, index) in 1" :key="index" />
            <initial-offering-card
              v-for="item in offerings"
              :key="item.id"
              :offering="item"
              class="mt-10"
            />
          </div>
          <div v-else class="flex flex-col items-center h-104 justify-center">
            <div class="text-red-600 font-ibm-bold text-lg">
              No offers available
            </div>
            <div class="text-tertiary-400 text-sm mt-3.5">
              <span class="text-primary-900"> Launch </span>
              <span>
                your own Initial Offering | Sign up to receive an alert when a
                new offering becomes available
              </span>
            </div>
            <div class="text-2xl text-tertiary-400 mt-5 flex gap-6">
              <font-awesome-icon :icon="['fab', 'telegram-plane']" />
              <font-awesome-icon :icon="['fab', 'discord']" />
              <font-awesome-icon :icon="['fab', 'twitter']" />
            </div>
          </div>
        </div>
        <div
          v-if="viewOption === 'LIST'"
          class="flex-1 overflow-auto -mx-4 -mb-4 mt-2.5 relative"
        >
          <div class="overflow-x-auto text-11 tracking-wider leading-4 p-4">
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
                    <th
                      class="px-3 py-2 cursor-pointer"
                      @click="sortTable('RARITY')"
                    >
                      <div class="flex justify-between items-center">
                        <span> Total supply </span>
                        <font-awesome-icon
                          :icon="['fas', 'sort']"
                          class="text-sm"
                        />
                      </div>
                    </th>
                    <th
                      class="px-3 py-2 cursor-pointer"
                      @click="sortTable('RARITY')"
                    >
                      <div class="flex justify-between items-center">
                        <span> Type supply </span>
                        <font-awesome-icon
                          :icon="['fas', 'sort']"
                          class="text-sm"
                        />
                      </div>
                    </th>
                    <th
                      class="px-3 py-2 cursor-pointer"
                      @click="sortTable('FLOOR')"
                    >
                      <div class="flex justify-between items-center">
                        <span> Floor price </span>
                        <font-awesome-icon
                          :icon="['fas', 'sort']"
                          class="text-sm"
                        />
                      </div>
                    </th>
                    <th
                      class="px-3 py-2 cursor-pointer"
                      @click="sortTable('ROI')"
                    >
                      <div class="flex justify-between items-center">
                        <span> Multilevel ownership </span>
                        <font-awesome-icon
                          :icon="['fas', 'sort']"
                          class="text-sm"
                        />
                      </div>
                    </th>
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
                        <div v-else class="grid items-center">
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
        </div>
        <nft-cart
          v-if="saleType !== 'Auction'"
          class="-mb-6"
          :nftCart="isCartOpened"
        />
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

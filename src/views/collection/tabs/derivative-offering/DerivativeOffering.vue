<script setup>
import NftmxTrimString from "@/core/components/basic/NftmxTrimString.vue";
import Timer from "@/core/components/timer/Timer.vue";
import NftmxInput from "@/core/components/basic/NftmxInput.vue";
import InitialOfferingCarousel from "@/core/components/carousel/InitialOfferingCarousel.vue";
import VueSlider from "vue-3-slider-component";
import { onMounted, ref } from "vue";
import Accordion from "@/core/components/accordion/BasicAccordion.vue";
import useDebouncedRef from "@/core/utils/hook/useDebouncedRef";
import nftsService from "@/core/services/market/nfts.service";
import DerivativeOfferingCard from "@/core/components/cards/DerivativeOfferingCard.vue";

const props = defineProps({
  collection: Object,
});

const tab = ref("Live Now");
const subTab = ref("100% Liquidity Protection");
const saleType = ref("All");
const openFilter = ref(false);
const amount = ref(0);
const openDescription = ref(true);
const offerings = ref([]);
const comingOfferings = ref([]);
const pastOfferings = ref([]);
const isCartOpened = ref(false);
const filterOption = ref({
  chain: "",
  name: "",
  min: null,
  max: null,
  sortBy: "",
});
const name = useDebouncedRef("", 1000);

const getOfferings = (data) => {
  const addresses = props.collection?.address ? [props.collection.address] : [];
  nftsService
    .searchOfferings({
      derivative: true,
      collection: addresses,
    })
    .then((res) => {
      console.log(res);
      offerings.value = res.data;
    });
};
onMounted(() => {
  getOfferings();
});
</script>

<template>
  <div class="pb-10">
    <div class="py-4 lg:flex gap-4.75 justify-end">
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
    </div>
    <div v-if="true">
      <div class="flex justify-between">
        <div class="flex gap-4 font-ibm-medium text-sm text-white py-3">
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
                v-if="offerings.length > 0"
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
        The multilevel ownership contract allows sellers to continue earning
        passive income from the sale of their assets even after the asset has
        been resold multiple times. This means that the asset will continue to
        generate profits for its previous owners. The income from each new sale
        is split proportionally among all current owners in real-time.
        <br /><br />
        Example: <br />
        <p class="mt-2">
          Let's consider an example where three people, Bob, Lisa and Tom, own a
          NFT. The original price of the NFT is $100.
        </p>
        <div class="flex gap-4">
          <div class="bg-tertiary-400 w-2.25 h-2.25 rounded-full mt-1.5" />
          <p class="flex-1">
            The NFT is resold for $200. The $100 of the previous sale price is
            reduced, leaving a remaining $100. <br />
            Bob receives 10% of the remaining $100, which is $10. <br />
            Lisa receives 10% of the remaining $90 (after Bob's share is taken),
            which is $9. <br />
            Tom receives 10% of the remaining $81 (after Bob and Lisa's share is
            taken), which is $8.10.
          </p>
        </div>
        <br />
        <div class="flex gap-4">
          <div class="bg-tertiary-400 w-2.25 h-2.25 rounded-full mt-1.5" />
          <p class="flex-1">
            The NFT is resold for $400. The $200 of the previous sale price is
            reduced, leaving a remaining $200. <br />
            Bob receives 10% of the remaining $200, which is $20. <br />
            Lisa receives 10% of the remaining $180 (after Bob's share is
            taken), which is $18.
          </p>
        </div>
        <div class="flex gap-4">
          <div class="bg-tertiary-400 w-2.25 h-2.25 rounded-full mt-1.5" />
          <p class="flex-1">
            Tom receives 10% of the remaining $162 (after Bob and Lisa's share
            is taken), which is $16.20.
          </p>
        </div>
        <div class="flex gap-4 mt-6">
          <div class="bg-tertiary-400 w-2.25 h-2.25 rounded-full mt-1.5" />
          <p class="flex-1">
            The NFT is resold for $800. The $400 of the previous sale price is
            reduced, leaving a remaining $400. <br />
            Bob receives 10% of the remaining $400, which is $40. <br />
            Lisa receives 10% of the remaining $360 (after Bob's share is
            taken), which is $36. <br />
            Tom receives 10% of the remaining $324 (after Bob and Lisa's share
            is taken), which is $32.40.
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
      <accordion bIcon :border="false" :sidebar="true" class="text-white mt-9">
        <template v-slot:caption>
          <div
            class="flex items-center w-full font-ibm-bold text-lg gap-4 py-4"
          >
            <div class="w-3 h-3 rounded-full bg-primary-900" />
            <span>Live Now</span>
          </div>
        </template>
        <div class="mt-6">
          <div v-if="offerings.length > 0" class="grid grid-cols-2 gap-5">
            <derivative-offering-card
              v-for="item in offerings"
              :key="item.id"
              :offering="item"
            />
          </div>
          <div v-else class="w-full h-64 flex items-center justify-center">
            No offerings found
          </div>
        </div>
      </accordion>
      <accordion bIcon :border="false" :sidebar="true" class="text-white mt-3">
        <template v-slot:caption>
          <div
            class="flex items-center w-full font-ibm-bold text-lg gap-4 py-4"
          >
            <span>Coming Soon</span>
          </div>
        </template>
        <div class="mt-6">
          <div v-if="comingOfferings.length > 0" class="grid grid-cols-2 gap-5">
            <derivative-offering-card
              v-for="item in comingOfferings"
              :key="item.id"
              :offering="item"
            />
          </div>
          <div v-else class="w-full h-64 flex items-center justify-center">
            No offerings found
          </div>
        </div>
      </accordion>
      <accordion bIcon :border="false" :sidebar="true" class="text-white mt-3">
        <template v-slot:caption>
          <div
            class="flex items-center w-full font-ibm-bold text-lg gap-4 py-4"
          >
            <span>Past Offerings</span>
          </div>
        </template>
        <div class="mt-6">
          <div v-if="pastOfferings.length > 0" class="grid grid-cols-2 gap-5">
            <derivative-offering-card
              v-for="item in pastOfferings"
              :key="item.id"
              :offering="item"
            />
          </div>
          <div v-else class="w-full h-64 flex items-center justify-center">
            No offerings found
          </div>
        </div>
      </accordion>
    </div>
    <div v-else class="flex flex-col items-center h-104 justify-center">
      <div class="text-red-600 font-ibm-bold text-lg">No offers available</div>
      <div class="text-tertiary-400 text-sm mt-3.5">
        <span class="text-primary-900"> </span>
        <span>
          Sign up to receive an alert when a new offering becomes available
        </span>
      </div>
      <div class="text-2xl text-tertiary-400 mt-5 flex gap-6">
        <font-awesome-icon :icon="['fab', 'telegram-plane']" />
        <font-awesome-icon :icon="['fab', 'discord']" />
        <font-awesome-icon :icon="['fab', 'twitter']" />
      </div>
    </div>
  </div>
</template>

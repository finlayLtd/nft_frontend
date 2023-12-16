<script setup>
import NftmxHelp from "@/core/components/basic/NftmxHelp.vue";
import NftmxPrice from "@/core/components/price/NftmxPrice.vue";
import AnalyzerCardContainer from "./container/AnalyzerCardContainer.vue";
import NftmxTooltip from "@/core/components/basic/NftmxTooltip.vue";
import { onMounted, ref } from "vue";
import marketService from "@/core/services/market.service";
import { MainToken } from "@/core/config/constant";
import { roundTo } from "@/core/utils/common";

const downsideFunds = ref(0);
const totalSalesFunds = ref(0);
const dvcFunds = ref(0);
const apyFunds = ref(0);

onMounted(() => {
  // marketService.getDownsideProtectionFunds().then((res) => {
  //   const initialDownsideFunds = (res.data / Math.pow(10, 18)) * ethPrice;
  //   const downsideFundsInterval = setInterval(() => {
  //     downsideFunds.value += roundTo(initialDownsideFunds / 123, 0);
  //     if (downsideFunds.value >= initialDownsideFunds) {
  //       clearInterval(downsideFundsInterval);
  //     }
  //   }, 10);
  // });
  // marketService.getTotalSalesFunds().then((res) => {
  //   totalSalesFunds.value = (res.data / Math.pow(10, 18)) * ethPrice;
  // });
});
</script>

<template>
  <div
    class="grid lg:grid-cols-2 3xl:flex justify-center 3xl:justify-between pt-12 px-22 text-11"
  >
    <analyzer-card-container>
      <div class="h-9.75 text-center">Total sales to Date</div>
      <div
        class="font-ibm-semi-bold text-lg sm:text-xl text-center flex justify-center"
      >
        <nftmx-price :price="1256859.6559"></nftmx-price>
      </div>
    </analyzer-card-container>
    <analyzer-card-container>
      <div class="h-9.75 text-center">
        <span>
          Market Making Rewards to Date
          <nftmx-tooltip
            text="Total amount of market making rewards payout to sellers"
          >
            <sup>
              <font-awesome-icon
                :icon="['fas', 'question-circle']"
                class="text-xs cursor-pointer"
              />
            </sup>
          </nftmx-tooltip>
        </span>
      </div>
      <div
        class="font-ibm-semi-bold text-lg sm:text-xl text-center flex justify-center"
      >
        <nftmx-price :price="25689963.3289"></nftmx-price>
      </div>
    </analyzer-card-container>
    <analyzer-card-container>
      <div class="h-9.75 text-center">Multilevel Ownership Reward to Date</div>
      <div
        class="flex items-center flex-col font-ibm-semi-bold text-lg sm:text-xl w-full"
      >
        <div class="w-fit">
          <nftmx-price :price="6452653.3248"></nftmx-price>
          <div class="text-11 font-ibm-medium pt-2 pb-3 text-right">
            <router-link
              to="multilevel"
              class="cursor-pointer text-primary-900 hover:text-primary-700 transition"
            >
              Create New Ownership Level
            </router-link>
          </div>
        </div>
      </div>
    </analyzer-card-container>
    <analyzer-card-container>
      <div class="h-9.75 flex justify-center">
        <span>
          <span>Decentralized Venture Capital</span>
          <nftmx-tooltip
            text="Total DVC funds ready to be deployed if the investment terms are triggered"
          >
            <sup>
              <font-awesome-icon
                :icon="['fas', 'question-circle']"
                class="text-xs cursor-pointer"
              />
            </sup>
          </nftmx-tooltip>
        </span>
      </div>
      <div
        class="font-ibm-semi-bold text-lg sm:text-xl leading-none text-center flex justify-center"
      >
        <div class="flex gap-0.5 items-end">
          <div
            class="h-8.5 w-6.5 border border-black shadow-default shadow-white relative"
          >
            <div class="h-1/2 border-b border-black"></div>
            <div class="h-1/2 border-t border-tertiary-700"></div>
            <div class="absolute left-0 top-0 w-full h-full">$</div>
          </div>
          <div v-for="(l, index) in (1548985.53).toLocaleString()" :key="index">
            <div
              v-if="parseInt(l) >= 0"
              class="h-8.5 w-6.5 border border-black shadow-default shadow-white relative"
            >
              <div class="h-1/2 border-b border-black"></div>
              <div class="h-1/2 border-t border-tertiary-700"></div>
              <div class="absolute left-0 top-0 w-full h-full">{{ l }}</div>
            </div>
            <div v-else class="-mx-px">
              {{ l }}
            </div>
          </div>
        </div>
      </div>
      <div class="text-11 font-ibm text-tertiary-400 pt-2 pb-3">
        <span class="mr-3">Avg ROI 125.52%</span>
        <router-link to="/dvc" class="font-ibm text-white cursor-pointer">
          Become A Baker
        </router-link>
        <span> | </span>
        <router-link
          to="/dvc/launch"
          class="font-ibm text-white cursor-pointer"
        >
          Launch DVC
        </router-link>
      </div>
    </analyzer-card-container>
  </div>
</template>

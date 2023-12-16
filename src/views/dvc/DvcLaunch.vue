<script setup>
import BodyContainer from "@/core/container/BodyContainer.vue";
import NftmxInput from "@/core/components/basic/NftmxInput.vue";
import NftmxTextarea from "@/core/components/basic/NftmxTextarea.vue";
import NftmxRadio from "@/core/components/basic/NftmxRadio.vue";
import NftmxDivider from "@/core/components/basic/NftmxDivider.vue";
import NftmxButton from "@/core/components/basic/NftmxButton.vue";
import BuyCritertia from "./launch/BuyCritertia.vue";
import SellCriteria from "./launch/SellCriteria.vue";
import { onMounted, ref } from "vue";
import { createDvc } from "../../core/utils/contracts/dvc-factory.utils";
import Web3 from "web3/dist/web3.min.js";
import DvcInfo from "./launch/DvcInfo.vue";
import DvcFees from "./launch/DvcFees.vue";
import Lauch from "./launch/Lauch.vue";

const step = ref(0);
const dvcInfo = ref({});
const dvcFee = ref({});
const buyCriteria = ref({});
const sellCriteria = ref({});

const setDvcInfo = (data) => {
  dvcInfo.value = data;
  step.value++;
};
const setDvcFee = (data) => {
  dvcFee.value = data;
  step.value++;
};
const setBuyCriteria = (data) => {
  buyCriteria.value = data;
  step.value++;
};
const setSellCriteria = (data) => {
  sellCriteria.value = data;
  step.value++;
};
const moveStep = (page) => {
  step.value = page;
};
const launchDvc = () => {
  const dvcHeader = new FormData();
  dvcHeader.append("name", header.value.name);
  dvcHeader.append("logo", header.value.logo);
  dvcHeader.append("description", header.value.description);
  dvcHeader.append("carryOption", header.value.carryOption);
  dvcHeader.append("carryPercentage", header.value.carryPercentage);
  dvcHeader.append("maxBackerAllowed", header.value.maxBackerAllowed);
  dvcHeader.append("minInvestment", header.value.minInvestment);
  dvcHeader.append("maxInvestment", header.value.maxInvestment);
  dvcHeader.append("dvcLimit", header.value.dvcLimit);
  dvcHeader.append("kyc", header.value.kyc);
  dvcHeader.append("website", header.value.website);
  dvcHeader.append("twitter", header.value.twitter);
  dvcHeader.append("medium", header.value.medium);
  dvcHeader.append("telegram", header.value.telegram);
  dvcHeader.append("discord", header.value.discord);
  dvcHeader.append("instagram", header.value.instagram);

  const buyArgs = [
    [],
    false,
    false,
    Web3.utils.toWei(buyCriteria.value.maxPrice.toString(), "ether"),
    Web3.utils.toWei(buyCriteria.value.minPrice.toString(), "ether"),
    500,
    buyCriteria.value.maxProtection * 100,
    buyCriteria.value.maxPeriod * 86400,
    false,
  ];

  const sellArgs = [
    header.value.carryPercentage,
    sellCriteria.value.saleModel === "AUCTION",
    sellCriteria.value.type === "PACK",
    1000000000000000,
    sellCriteria.value.downsideProtection * 100,
    false,
    sellCriteria.value.royaltyPercentage * 100,
    1000000000000000,
  ];

  createDvc(buyArgs, sellArgs)
    .then((res) => {})
    .catch((err) => {
      console.log("err", err);
    });

  // buyArgs = [
  //   collections,
  //   isAuction,
  //   isPack,
  //   maxPrice,
  //   minPrice,
  //   auctionRate,
  //   protectionRate,
  //   protectionPeriod,
  //   useMLR,
  // ];

  // sellArgs = [
  //   abovePriceRate,
  //   isAuction,
  //   isPack,
  //   amountNFT,
  //   protectionRate,
  //   useMLR,
  //   royalty,
  //   buyoutPrice,
  // ];
};
</script>

<template>
  <body-container>
    <div class="text-white text-center py-9">
      <span class="font-press text-3xl">Launch Your DVC</span>
      <p class="text-left font-ibm text-base mt-5.5">
        Decentralized Venture Capital (DVC) is a fund that utilizes
        contract-tocontract (C2C) interactions and targets investment
        opportunities based on specific criteria, such as liquidity protection
        and specific collections. <br /><br />
        The DVC can be created by deploying funds or by acting as a General
        Partner (GP) and inviting Limited Partners (LPs) to contribute funds.
        The investment criteria for the DVC is set by the creator and
        automatically triggers the buying and selling of NFTs based on these
        criteria. <br /><br />
        The DVC creator, similar to a GP, has the option to charge a carry or
        success fee from the profits of their LPs. DVCs are incentivized to add
        value to their portfolio through marketing, promotion, or by adding IP
        to the NFT, rather than waiting for market forces to increase the value
        of the NFT.
      </p>
      <div class="text-left mt-6">
        <span class="text-primary-900 cursor-pointer">
          Read more about DVC
        </span>
      </div>
    </div>
    <div class="grid grid-cols-5 text-tertiary-400 font-ibm-bold text-lg mt-4">
      <div
        :class="[
          step >= 0
            ? 'border-secondary-800 text-secondary-800'
            : 'border-tertiary-400',
          'flex items-center justify-center border-b-3 h-16',
        ]"
      >
        <span>DVC Info</span>
      </div>
      <div
        :class="[
          step >= 1
            ? 'border-secondary-800 text-secondary-800'
            : 'border-tertiary-400',
          'flex items-center justify-center border-b-3 h-16',
        ]"
      >
        <span>DVC fees</span>
      </div>
      <div
        :class="[
          step >= 2
            ? 'border-secondary-800 text-secondary-800'
            : 'border-tertiary-400',
          'flex items-center justify-center border-b-3 h-16',
        ]"
      >
        <span>Buy criteria</span>
      </div>
      <div
        :class="[
          step >= 3
            ? 'border-secondary-800 text-secondary-800'
            : 'border-tertiary-400',
          'flex items-center justify-center border-b-3 h-16',
        ]"
      >
        <span>Sell criteria</span>
      </div>
      <div
        :class="[
          step >= 4
            ? 'border-secondary-800 text-secondary-800'
            : 'border-tertiary-400',
          'flex items-center justify-center border-b-3 h-16',
        ]"
      >
        <span>Launch your DVC</span>
      </div>
    </div>
    <dvc-info v-if="step === 0" @set-dvc-info="setDvcInfo" :dvcInfo="dvcInfo" />
    <dvc-fees
      v-if="step === 1"
      @set-dvc-fee="setDvcFee"
      :dvcFee="dvcFee"
      @move-back="moveStep"
    />
    <buy-critertia
      v-if="step === 2"
      @set-buy-criteria="setBuyCriteria"
      :buyCriteria="buyCriteria"
      @move-back="moveStep"
    />
    <sell-criteria
      v-if="step === 3"
      @set-sell-criteria="setSellCriteria"
      :sellCriteria="sellCriteria"
      @move-back="moveStep"
    />
    <lauch
      v-if="step === 4"
      :dvcInfo="dvcInfo"
      :dvcFee="dvcFee"
      :buyCriteria="buyCriteria"
      :sellCriteria="sellCriteria"
      @edit-dvc="moveStep"
    />
  </body-container>
</template>

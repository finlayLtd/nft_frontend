<script setup>
import LandingSection from "./containers/LandingSection.vue";
import NftmxButton from "@/core/components/basic/NftmxButton.vue";
</script>

<template>
  <landing-section>
    <div class="grid grid-cols-1 md:grid-cols-2 items-center 2xl:px-20">
      <div class="flex mt-6 md:mt-0">
        <img v-lazy="'/images/landing/decentralized-vcs.png'" />
      </div>
      <div>
        <div class="font-press text-white text-xl lg:text-2xl 2xl:text-3xl">
          Decentralized Venture Capital
        </div>
        <p
          class="font-ibm text-sm lg:text-base 2xl:text-lg text-tertiary-400 mt-8.75 2xl:leading-7.5 2xl:pr-22"
        >
          Decentralized Venture Capital (DVC) is a fund that utilizes
          contract-to-contract (C2C) interactions and targets investment
          opportunities based on specific criteria, such as liquidity protection
          and specific collections.
        </p>
        <div class="mt-14 font-ibm-bold text-lg leading-5">
          <nftmx-button
            color="primary"
            label="INVEST OR LAUNCH A DVC"
            outline
            customPx
            class="px-13"
            to="dvc"
          />
        </div>
      </div>
    </div>
  </landing-section>
</template>

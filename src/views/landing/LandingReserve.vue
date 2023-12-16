<script setup>
import LandingSection from "./containers/LandingSection.vue";
import NftmxButton from "@/core/components/basic/NftmxButton.vue";
</script>

<template>
  <landing-section>
    <div class="grid grid-cols-1 md:grid-cols-2 items-center 2xl:px-20">
      <div class="2xl:mr-22">
        <div class="font-press text-white text-xl lg:text-2xl 2xl:text-3xl">
          Instant Liquidity Via Reserve Market Making
        </div>
        <p
          class="font-ibm text-sm lg:text-base 2xl:text-lg text-tertiary-400 mt-6.25 2xl:leading-relaxed"
        >
          Similar to the AMM on DEXs, RMM (reserve market making) creates
          instant liquidity for any NFT without the need for a counterparty buyer.
        </p>
      </div>
      <div class="flex justify-center mt-6 md:mt-0">
        <img v-lazy="'/images/landing/instant-liquidity.png'" />
      </div>
    </div>
  </landing-section>
</template>

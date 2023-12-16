<script setup>
import LandingSection from "./containers/LandingSection.vue";
</script>

<template>
  <landing-section black>
    <div class="grid md:grid-cols-2 items-center 2xl:px-20 pt-6 pb-3">
      <div class="flex justify-center">
        <img v-lazy="'/images/landing/p2p-sales.png'" />
      </div>
      <div class="sm:px-12">
        <div class="font-press text-white text-xl lg:text-2xl 2xl:text-3xl">
          P2P Sales Are FREE
        </div>
        <p
          class="font-ibm text-sm lg:text-base 2xl:text-lg text-tertiary-400 mt-6.25 leading-7.5"
        >
          Users can perform standard peer-to-peer NFT transactions (without
          liquidity protection), similar to those offered on marketplaces like
          OpenSea and Uniswap, at no charge and with 0% fees.
        </p>
      </div>
    </div>
  </landing-section>
  <div
    class="border-y border-tertiary-900 bg-black text-tertiary-400 text-shadow-gray 2xl:text-lg text-center py-6.5 px-4 sm:px-20 xl:px-40 2xl:px-68"
  >
    Unlike current centralized NFT marketplaces that are built as P2P
    (peer-to-peer), NFTPX is the world's first decentralized NFT exchange to
    support P2C (peer-to-contract) and C2C (contract-to-contract) transactions.
  </div>
</template>

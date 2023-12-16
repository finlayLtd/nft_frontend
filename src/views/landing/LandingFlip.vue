<script setup>
import LandingSection from "./containers/LandingSection.vue";
import NftmxButton from "../../core/components/basic/NftmxButton.vue";
</script>

<template>
  <landing-section>
    <div
      class="flex flex-col-reverse md:grid md:grid-cols-2 gap-10 items-center 2xl:px-20"
    >
      <div class="flex justify-center">
        <img v-lazy="'/images/landing/zero-risk.png'" />
      </div>
      <div class="2xl:pr-16">
        <div class="font-press text-white text-xl lg:text-2xl 2xl:text-3xl">
          Zero Risk NFT Flipping
        </div>
        <p
          class="font-ibm text-sm lg:text-base 2xl:text-lg text-tertiary-400 mt-5.75 leading-7.5"
        >
          Flip NFTs with liquidity protection by selling the NFT forward to
          another buyer, even without finalizing the sale. If the NFT ultimately
          fails to be purchased, you can return the NFT back to the smart
          contract and get up to 100% of your money back.
        </p>
        <div class="font-ibm-bold text-lg leading-5 mt-13.5">
          <nftmx-button
            color="primary"
            label="BUY 100% LIQUIDITY PROTECTION NFTS"
            outline
            customPx
            class="px-9"
            to="home?tab=NFTS"
          />
        </div>
      </div>
    </div>
  </landing-section>
</template>

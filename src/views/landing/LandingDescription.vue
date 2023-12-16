<script setup>
import LandingSection from "./containers/LandingSection.vue";
import NftmxTooltip from "@/core/components/basic/NftmxTooltip.vue";
</script>

<template>
  <landing-section black>
    <div
      class="grid md:grid-cols-2 text-center lg:py-4 2xl:divide-x divide-tertiary-800"
    >
      <div class="md:pr-20 2xl:pr-40 pb-10 md:pb-0">
        <div class="flex justify-center">
          <img v-lazy="'/images/landing/for-buyers.png'" />
        </div>
        <div class="text-xl lg:text-2xl font-ibm-bold mt-5.5">For Buyers</div>
        <div class="font-press text-primary-900 text-2xl mt-5.25">
          100% Liquidity Protection
        </div>
        <p class="text-tertiary-500 text-sm sm:text-base font-ibm mt-7">
          Flip NFTs at any market condition, knowing that you can always reverse
          the sale back to the smart contract for 100% refund.
          <nftmx-tooltip
            text="NFT must returned to the smart contract before the liquidity protection period ends. slippage or transaction may apply."
          >
            <sup>
              <font-awesome-icon
                :icon="['fas', 'question-circle']"
                class="text-xs cursor-pointer"
              />
            </sup>
          </nftmx-tooltip>
        </p>
      </div>
      <div class="mt-6 sm:mt-0 md:pl-20 2xl:pl-40 pt-10 md:pt-0">
        <div class="flex justify-center">
          <img v-lazy="'/images/landing/for-sellers.png'" />
        </div>
        <div class="text-xl lg:text-2xl font-ibm-bold mt-5.5">For Sellers</div>
        <div class="font-press text-primary-900 text-2xl mt-5.25">
          New Ways to Generate Income
        </div>
        <p
          class="text-tertiary-500 text-sm sm:text-base font-ibm mt-7 2xl:px-2"
        >
          Offer liquidity protection to generate market making rewards and even
          set terms to retain an ownership percentage.
          <nftmx-tooltip
            text="Sellers can act as market makers and generate rewards from slippage or from leveraging other people's money on 3rd party decentralized staking protocols like Venus, Curve, Yearn Finance, etc."
          >
            <sup>
              <font-awesome-icon
                :icon="['fas', 'question-circle']"
                class="text-xs cursor-pointer"
              />
            </sup>
          </nftmx-tooltip>
        </p>
      </div>
    </div>
  </landing-section>
</template>

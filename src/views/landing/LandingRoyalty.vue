<script setup>
import LandingSection from "./containers/LandingSection.vue";
import NftmxButton from "@/core/components/basic/NftmxButton.vue";
</script>

<template>
  <landing-section black>
    <div class="grid md:grid-cols-2 items-center 2xl:px-20 pt-6 pb-3">
      <div class="flex justify-center">
        <img v-lazy="'/images/landing/multilevel-royalty.png'" />
      </div>
      <div class="sm:px-12">
        <div class="font-press text-white text-xl lg:text-2xl 2xl:text-3xl">
          Multilevel Ownership
        </div>
        <p
          class="font-ibm text-sm lg:text-base 2xl:text-lg text-tertiary-400 mt-6.25 leading-7.5"
        >
          The multilevel ownership contract allows sellers to earn compound
          income from future sales of the same assets, allowing them to continue
          generating profits even after an asset is sold multiple times.
        </p>
        <div class="mt-14 font-ibm-bold text-lg leading-5">
          <nftmx-button
            color="primary"
            label="CHECK MULTILEVEL OWNERSHIP OTC"
            outline
            to="multilevel"
            customPx
            class="px-13"
          />
        </div>
      </div>
    </div>
  </landing-section>
</template>

<script setup>
import LandingSection from "./containers/LandingSection.vue";
</script>

<template>
  <landing-section black>
    <div
      class="grid grid-cols-1 lg:grid-cols-2 gap-20 text-center 2xl:px-20 3xl:px-28"
    >
      <div class="px-1">
        <img
          v-lazy="'/images/landing/create-collections.png'"
          class="h-26 mx-auto"
        />
        <div class="text-white font-ibm-bold text-2xl mt-7">
          Decentralized collection
        </div>
        <p class="text-tertiary-400 font-ibm text-15 tracking-wider mt-3.25">
          All NFTs are automaticity organized as a collection and subcollections
          based on the same smart contract factory. Only verified smart contract
          owners can edit collection information.
        </p>
      </div>
      <div class="px-1">
        <img
          v-lazy="'/images/landing/decentralized-authentications.png'"
          class="h-26 mx-auto"
        />
        <div class="text-white font-ibm-bold text-2xl mt-7">
          Decentralized authentications
        </div>
        <p class="text-tertiary-400 font-ibm text-15 tracking-wider mt-3.25">
          Real time decentralized check to verify if an NFT is authentic or fake
          and which NFT collection it belongs to.
        </p>
      </div>
    </div>
  </landing-section>
</template>

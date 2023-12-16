<script setup>
import LandingSection from "./containers/LandingSection.vue";
</script>

<template>
  <landing-section class="py-8 lg:pt-15 lg:pb-15">
    <div
      class="flex flex-col-reverse md:grid md:grid-cols-2 gap-10 items-center 2xl:px-20"
    >
      <div class="sm:px-8">
        <div class="font-press text-white text-xl lg:text-2xl 2xl:text-3xl">
          Automated Decentralized Syndication
        </div>
        <div
          class="font-ibm text-base 2xl:text-lg text-tertiary-400 mt-8.75 2xl:leading-relaxed"
        >
          Decentralized syndication is a compliant, efficient, and scalable NFT
          group purchasing solution. Unlike DAOs or tokenization, it does not
          lead to security issues and is not a time-consuming process. It also
          avoids the potential deadlock of tokenized tokens, which can cause a
          loss in profits.
        </div>
      </div>
      <div class="flex justify-center">
        <img v-lazy="'/images/landing/automated-decentralized.png'" />
      </div>
    </div>
  </landing-section>
</template>

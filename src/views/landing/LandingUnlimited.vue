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
          Make Unlimited Offers
        </div>
        <div
          class="font-ibm text-base 2xl:text-lg text-tertiary-400 mt-8.75 2xl:leading-relaxed"
        >
          By funding your self-custody vault and using it as collateral, you can
          submit as many offers as you want without paying any gas fees until
          your offers are accepted.
        </div>
      </div>
      <div class="flex justify-center">
        <img v-lazy="'/images/landing/unlimited-offers.png'" />
      </div>
    </div>
  </landing-section>
</template>

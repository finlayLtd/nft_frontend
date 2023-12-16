<script setup>
import BodyContainer from "@/core/container/BodyContainer.vue";
import LandingHead from "./LandingHead.vue";
import LandingExplore from "./LandingExplore.vue";
import LandingDescription from "./LandingDescription.vue";
import LandingGuide from "./LandingGuide.vue";
import LandingSyndications from "./LandingSyndications.vue";
import LandingFlip from "./LandingFlip.vue";
import LandingVcs from "./LandingVcs.vue";
import LandingRoyalty from "./LandingRoyalty.vue";
import LandingDerivatives from "./LandingDerivatives.vue";
import LandingReserve from "./LandingReserve.vue";
import LandingP2p from "./LandingP2p.vue";
import LandingUnlimited from "./LandingUnlimited.vue";
</script>

<template>
  <landing-head />
  <div class="relative h-px w-full bg-white shadow-lg shadow-white" />
  <body-container :padding="false" footerExtended top>
    <landing-reserve id="learn" />
    <landing-description />
    <landing-flip />
    <landing-derivatives />
    <landing-vcs />
    <landing-guide />
    <landing-syndications />
    <landing-royalty />
    <landing-unlimited />
    <landing-p2p />
    <landing-explore />
  </body-container>
</template>

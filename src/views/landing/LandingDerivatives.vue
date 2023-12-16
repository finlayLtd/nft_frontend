<script setup>
import LandingSection from "./containers/LandingSection.vue";
import NftmxButton from "@/core/components/basic/NftmxButton.vue";
import { computed, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const router = useRouter();
const store = useStore();
const walletAddress = computed(() => store.getters["auth/walletAddress"]);
const buttonName = ref("CREATE A DERIVATIVE");
const openCreateDerivative = () => {
  if (walletAddress.value) {
    router.push("/account");
  } else {
    openConnectWalletModal();
  }
};
const openConnectWalletModal = () => {
  store.commit("app/OPEN_CONNECT_WALLET_MODAL");
};
</script>

<template>
  <landing-section black>
    <div class="grid grid-cols-1 md:grid-cols-2 items-center 2xl:px-20">
      <div class="2xl:mr-22">
        <div class="font-press text-white text-xl lg:text-2xl 2xl:text-3xl">
          Create NFT Derivatives
        </div>
        <p
          class="font-ibm text-sm lg:text-base 2xl:text-lg text-tertiary-400 mt-6.25 2xl:leading-relaxed"
        >
          Use AI technology to leverage NFT IP rights to generate derivatives
          sold as new NFTs through an initial offering. Set unique terms,
          including value, liquidity protection, and more, on purchases.
        </p>
        <div class="mt-14 font-ibm-bold text-lg">
          <nftmx-button
            color="primary"
            :label="buttonName"
            outline
            class="w-80"
            @mouseover="!walletAddress && (buttonName = 'CONNECT WALLET')"
            @mouseout="buttonName = 'CREATE A DERIVATIVE'"
            @click="openCreateDerivative"
          />
        </div>
      </div>
      <div class="flex justify-end mt-6 md:mt-0">
        <img v-lazy="'/images/landing/create-derivatives.png'" />
      </div>
    </div>
  </landing-section>
</template>

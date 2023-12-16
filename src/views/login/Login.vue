<script setup>
import { computed, ref } from "vue";
import BodyContainer from "@/core/container/BodyContainer.vue";
import ConnectWallet from "./ConnectWallet.vue";
import NftmxWalletCard from "@/core/components/cards/NftmxWalletCard.vue";
import { walletList } from "@/core/config/constant";

const selectedWallet = ref(walletList[0]);
</script>

<template>
  <body-container>
    <div class="sm:mt-8">
      <connect-wallet :wallet="selectedWallet" />
    </div>
    <div
      class="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-5 3xl:grid-cols-6 justify-items-center gap-4 mt-7.5 mb-20"
    >
      <nftmx-wallet-card
        v-for="(wallet, index) in walletList"
        :key="index"
        :wallet="wallet"
        @click="selectedWallet = wallet"
        :active="selectedWallet.id === wallet.id"
      />
    </div>
  </body-container>
</template>

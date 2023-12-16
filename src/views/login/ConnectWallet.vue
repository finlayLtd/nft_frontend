<script setup>
import { useStore } from "vuex";
import NftmxButton from "@/core/components/basic/NftmxButton.vue";
import { useToast } from "vue-toastification";

defineProps({
  wallet: {
    type: Object,
    required: true,
  },
});

const store = useStore();
const toast = useToast();

const connect = async (connectorId) => {
  if (connectorId === 0) {
    if (typeof window.ethereum !== "undefined") {
      try {
        await ethereum.request({ method: "eth_requestAccounts" });
        if (store.state.wallet.chainId !== "0x61") {
          await ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x61" }],
          });
        }
      } catch (err) {
        if (err.code === 4001) {
          toast.error("User denied transaction signature.");
        } else {
          toast.error(err.message);
        }
      }
    } else {
      window.open("https://metamask.io/download/", "_blank");
    }
  } else {
    toast.error(`Not implemented yet.`);
  }
};
</script>

<template>
  <div class="flex flex-col text-center justify-center items-center">
    <div class="w-fit font-press text-sm sm:pt-4 sm:pb-6">
      <img v-lazy="wallet.imgUrl" />
      <nftmx-button
        color="primary"
        label="CONNECT YOUR WALLET"
        class="font-press w-full text-sm h-13.5"
        @click="connect(wallet.connectorId)"
      />
    </div>
    <div class="text-white text-sm py-1.25">Use a different wallet</div>
  </div>
</template>

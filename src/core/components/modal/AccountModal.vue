<script setup>
import { computed, ref, watchEffect } from "vue";
import Overlay from "./Overlay.vue";
import Icon from "@/core/components/basic/Icon.vue";
import { $vfm } from "vue-final-modal";
import WalletDropdown from "@/core/components/dropdown/WalletDropdown.vue";
import { useToast } from "vue-toastification";
import { MARKET_CHAIN } from "@/core/config/constant";
import { useStore } from "vuex";
import NftmxWalletAddress from "@/core/components/blockchain-address/NftmxWalletAddress.vue";
import { BLOCK_EXPLORER_URL } from "@/core/config/constant";
import Jazzicon from "@/core/components/jazzicon/Jazzicon.vue";

const props = defineProps({});

const store = useStore();
const toast = useToast();
const walletAddress = computed(() => store.getters["auth/walletAddress"]);
const currentChainId = ref("");

if (typeof window.ethereum !== "undefined") {
  ethereum
    .request({ method: "eth_chainId" })
    .then((chain) => {
      currentChainId.value = chain;
    })
    .catch((err) => {
      consolr.log("err ", err);
    });
  ethereum.on("chainChanged", (chain) => {
    currentChainId.value = chain;
  });
}
const switchNetwork = async () => {
  if (typeof window.ethereum !== "undefined") {
    ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: MARKET_CHAIN }],
    });
  }
};
const cancel = () => {
  $vfm.hide("connectWalletModal");
};
watchEffect(() => {
  if (walletAddress.value) {
    cancel();
  }
});
const onCopy = (e) => {
  toast.success("Wallet Address is copied");
};
</script>

<template>
  <vue-final-modal
    classes="w-full flex items-center justify-center"
    name="connectWalletModal"
    esc-to-close
    fit-parent
  >
    <div
      class="h-fit bg-tertiary-900 text-white overflow-auto p-5.25 w-full max-w-modal"
    >
      <div class="flex justify-between font-ibm-bold text-lg">
        <div>Account</div>
        <div class="text-right text-xl">
          <font-awesome-icon
            :icon="['fas', 'times']"
            class="cursor-pointer hover:text-tertiary-400 transition"
            @click="cancel"
          />
        </div>
      </div>
      <div class="border border-black px-5 pt-4.25 pb-6 mt-5.5">
        <div class="grid grid-cols-3 items-center">
          <div class="font-ibm-medium text-sm leading-4.5">
            Connected with Metamask
          </div>
          <div
            v-if="currentChainId !== MARKET_CHAIN"
            class="font-ibm text-sm text-red-900 text-right"
          >
            Wrong Network
          </div>
          <div
            v-if="currentChainId !== MARKET_CHAIN"
            class="font-ibm-bold text-sm text-right"
          >
            <button
              @click="switchNetwork"
              class="bg-primary-900 px-4 pt-1.5 pb-2.25"
            >
              Change
            </button>
          </div>
        </div>
        <div class="flex font-ibm-bold text-2xl my-6.5 gap-4">
          <jazzicon :address="walletAddress" :diameter="16" />
          <nftmx-wallet-address :address="walletAddress" />
        </div>
        <div class="grid grid-cols-2 py-1">
          <div
            v-clipboard:copy="walletAddress"
            v-clipboard:success="onCopy"
            class="flex font-ibm-medium text-primary-900 text-xs items-center gap-2 w-fit cursor-pointer transition hover:text-primary-800"
          >
            <div class>
              <font-awesome-icon :icon="['fas', 'copy']" />
            </div>
            <div>Copy Address</div>
          </div>
          <a
            :href="BLOCK_EXPLORER_URL['ETHEREUM'] + 'address/' + walletAddress"
            target="_blank"
            class="flex font-ibm-medium text-primary-900 text-xs items-center gap-2 w-fit cursor-pointer transition hover:text-primary-800"
          >
            <div class>
              <font-awesome-icon :icon="['fas', 'external-link-alt']" />
            </div>
            <div>View on Explorer</div>
          </a>
        </div>
      </div>
    </div>
  </vue-final-modal>
</template>

<style scoped>
.max-w-modal {
  width: 550px;
}
</style>

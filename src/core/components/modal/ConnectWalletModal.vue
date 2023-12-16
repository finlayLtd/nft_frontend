<script setup>
import { computed, watchEffect } from "vue";
import { $vfm } from "vue-final-modal";
import WalletDropdown from "@/core/components/dropdown/WalletDropdown.vue";
import { useToast } from "vue-toastification";
import { useStore } from "vuex";
import NftmxImg from "@/core/components/basic/NftmxImg.vue";
import { detectMobile } from "@/core/utils/common/window";

const store = useStore();
const toast = useToast();
const walletAddress = computed(() => store.getters["auth/walletAddress"]);
const isMobile = detectMobile();

const connect = async () => {
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
};
const cancel = () => {
  $vfm.hide("connectWalletModal");
};
watchEffect(() => {
  if (walletAddress.value) {
    cancel();
  }
});
</script>

<template>
  <vue-final-modal
    classes="w-full flex justify-center overflow-y-auto"
    content-class="my-4 lg:my-auto mx-4 h-fit"
    :overlay-style="{ backgroundColor: 'black', opacity: '0.9' }"
    name="connectWalletModal"
    esc-to-close
    fit-parent
  >
    <div class="bg-tertiary-900 text-white p-5 w-full sm:w-[550px]">
      <div class="flex justify-between font-ibm-bold text-lg">
        <div>Connect Wallet</div>
        <div class="text-right text-xl">
          <font-awesome-icon
            :icon="['fas', 'times']"
            class="cursor-pointer hover:text-tertiary-400 transition"
            @click="cancel"
          />
        </div>
      </div>
      <div class="relative h-15 mt-5.5">
        <wallet-dropdown
          title="BSC"
          class="border border-white"
        ></wallet-dropdown>
      </div>
      <div
        @click="connect()"
        class="flex items-center justify-between border border-black hover:border-primary-900 pl-6 pr-2 pb-1.25 pt-0.5 font-ibm-bold text-lg mt-2.5 transition cursor-pointer"
      >
        <div>Metamask</div>
        <nftmx-img src="/images/wallet_logo/metamask.png" class="w-17 h-17" />
      </div>
      <!-- <div
        @click="connect()"
        class="flex items-center justify-between border border-black hover:border-primary-900 pl-6 pr-2 pb-1.25 pt-0.5 font-ibm-bold text-lg mt-2.25 transition cursor-pointer"
      >
        <div>Wallet Connect</div>
        <nftmx-img
          src="/images/wallet_logo/connect-wallet.png"
          class="w-17 h-17"
        />
      </div> -->
      <div class="text-center font-ibm-medium text-xs mt-4.25">
        <div>New to Binance Smart Chain?</div>
        <div class="transition text-primary-900 hover:text-primary-800 mt-0.5">
          <a href="https://ethereum.org/en/wallets/" target="_blank"
            >Learn more about wallets</a
          >
        </div>
      </div>
    </div>
  </vue-final-modal>
</template>

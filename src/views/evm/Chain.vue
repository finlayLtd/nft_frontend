<script setup>
import { computed } from "vue";
import { useStore } from "vuex";

const props = defineProps({
  chain: Object,
});

const store = useStore();
const icon = computed(() =>
  props.chain && props.chain.chainSlug
    ? `https://icons.llamao.fi/icons/chains/rsz_${props.chain.chainSlug}.jpg`
    : "/images/logo/unknown-logo.png"
);

const connectWallet = async () => {
  try {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      return {
        address: accounts && accounts.length > 0 ? accounts[0] : null,
      };
    } else {
      throw new Error("No Ethereum Wallet");
    }
  } catch (error) {
    console.log(error);
    return { address: null };
  }
};
const toHex = (num) => {
  return "0x" + num.toString(16);
};
const addToNetwork = async () => {
  try {
    if (window.ethereum) {
      if (!store.state.wallet.account) {
        await connectWallet();
      }
      console.log(props.chain);

      const params = {
        chainId: toHex(props.chain.chainId), // A 0x-prefixed hexadecimal string
        chainName: props.chain.name,
        nativeCurrency: {
          name: props.chain.nativeCurrency.name,
          symbol: props.chain.nativeCurrency.symbol, // 2-6 characters long
          decimals: props.chain.nativeCurrency.decimals,
        },
        rpcUrls: props.chain.rpc.map((r) => r?.url ?? r),
        blockExplorerUrls: [
          props.chain.explorers &&
          props.chain.explorers.length > 0 &&
          props.chain.explorers[0].url
            ? props.chain.explorers[0].url
            : props.chain.infoURL,
        ],
      };

      const result = await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [params, store.state.wallet.account],
      });

      return result;
    } else {
      throw new Error("No Ethereum Wallet");
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};
</script>

<template>
  <div
    class="bg-tertiary-700 cursor-pointer transition hover:shadow-default hover:shadow-primary-900 p-10"
    @click="addToNetwork"
  >
    <div class="flex gap-4">
      <img
        :src="icon"
        width="26"
        height="26"
        class="rounded-full flex-shrink-0 flex relative"
        :alt="chain.name + ' logo'"
      />
      <span
        class="flex-1 text-lg font-ibm-semi-bold whitespace-nowrap overflow-hidden text-ellipsis relative top-[1px] dark:text-white"
      >
        {{ chain.name }}
      </span>
    </div>
    <div class="grid grid-cols-2 mt-8">
      <div class="flex flex-col items-center">
        <div class="font-ibm text-xs text-tertiary-400">Chain ID</div>
        <div class="text-white font-ibm-semi-bold">
          {{ chain.chainId }}
        </div>
      </div>
      <div class="flex flex-col items-center">
        <div class="font-ibm text-xs text-tertiary-400">Currency</div>
        <div class="text-white font-ibm-semi-bold">
          {{ chain.nativeCurrency ? chain.nativeCurrency.symbol : "none" }}
        </div>
      </div>
    </div>
  </div>
</template>

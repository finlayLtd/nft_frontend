<script setup>
import { useWindowSize } from "@vueuse/core";
import { onMounted, watch } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import NftmxLayout from "./layouts/NftmxLayout.vue";
import { detectMobile } from "./core/utils/common/window";
import Web3 from "web3/dist/web3.min.js";

const store = useStore();
const router = useRouter();

const login = async (accounts) => {
  if (accounts.length > 0) {
    store.commit("wallet/UPDATE_ACCOUNT", accounts[0]);
    updateBalance();
    store.dispatch("auth/login", accounts[0]).then(async (res) => {
      await router.isReady();
      if (router.currentRoute.value.path === "/login") {
        router.push("/account");
      }
    });
  } else {
    store.commit("wallet/UPDATE_ACCOUNT", "");
    store.dispatch("auth/login", null).then((res) => {
      if (router.currentRoute.value.meta.requiresAuth) {
        router.push("/login");
      }
    });
  }
};
const updateBalance = async () => {
  const web3 = store.state.web3;
  const balance = await web3.eth.getBalance(store.state.wallet.account);
  store.commit("wallet/UPDATE_BALANCE", balance);
};

onMounted(async () => {
  try {
    const isMobile = detectMobile();
    console.log("isMobile: ", isMobile);
    if (typeof window.ethereum !== "undefined") {
      ethereum.request({ method: "eth_accounts" }).then((accounts) => {
        console.log("eth_accounts: ", accounts);
        login(accounts);
      });
      ethereum.request({ method: "eth_chainId" }).then((chainId) => {
        console.log("eth_chainId: ", chainId);
        store.commit("wallet/UPDATE_CHAIN_ID", chainId);
      });
      ethereum.on("accountsChanged", function (accounts) {
        console.log("accountsChanged: ", accounts);
        login(accounts);
      });
      ethereum.on("chainChanged", async (chainId) => {
        console.log("chainChanged: ", chainId);
        store.commit("wallet/UPDATE_CHAIN_ID", chainId);
        updateBalance();
      });

      store.commit("SET_WEB3", new Web3(window.ethereum));
    }

    store.commit("app/UPDATE_WINDOW_WIDTH", window.innerWidth);
    store.commit("market/setCoinPrice");
  } catch (err) {
    console.error(err);
  }
});

setInterval(async () => {
  store.commit("market/setCoinPrice");
}, 60000);

setInterval(async () => {
  if (typeof window.ethereum !== "undefined" && store.state.wallet.account) {
    try {
      updateBalance();
    } catch (err) {
      console.log("err: ", err);
    }
  }
}, 10000);

const { width: windowWidth } = useWindowSize();
watch(windowWidth, (val) => {
  store.commit("app/UPDATE_WINDOW_WIDTH", val);
});
</script>

<template>
  <nftmx-layout />
</template>

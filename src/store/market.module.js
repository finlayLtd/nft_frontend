import Web3 from "web3/dist/web3.min.js";
import marketABI from "@/core/config/abi/market";
import { MainToken } from "@/core/config/constant";
import marketService from "@/core/services/market.service";
import ordersService from "@/core/services/market/orders.service";

export const market = {
  namespaced: true,
  state: {
    ethPrice: 0,
    coinPrice: {
      // Need to be matched with chain config
      ETHEREUM: 0,
      BSC_TESTNET: 0,
    },
    cartItems: [],
  },
  actions: {},
  getters: {
    etherFromWei: (state, getters, rootState) => (wei) => {
      if (typeof wei === "number") {
        wei = wei.toFixed();
      }
      return parseFloat(Web3.utils.fromWei(wei));
    },
    getEthPrice: (state, getters, rootState) => {
      return state.ethPrice;
    },
    getCoinPrice: (state, getters, rootState) => (chainKey) => {
      return state.coinPrice[chainKey];
    },
  },
  mutations: {
    setCoinPrice(state) {
      ordersService.getCoinPrice().then((res) => {
        state.coinPrice = res.data;
      });
    },
    addToCart(state, addingItem) {
      const index = state.cartItems.findIndex(
        (item) => item.id === addingItem.id
      );
      if (index < 0) {
        state.cartItems.push(addingItem);
      }
    },
    removeFromCart(state, removingItem) {
      const index = state.cartItems.findIndex(
        (item) => item.id === removingItem.id
      );
      if (index > -1) {
        state.cartItems.splice(index, 1);
      }
    },
    emptyCart(state) {
      state.cartItems = [];
    },
  },
};

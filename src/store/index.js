import { createStore } from "vuex";
import { auth } from "./auth.module";
import { market } from "./market.module";
import { wallet } from "./wallet.module";
import { app } from "./app.module";
import Web3 from "web3/dist/web3.min.js";

export default createStore({
  state: {
    web3: null,
    marketContract: null,
    user: {},
  },
  modules: {
    auth,
    market,
    app,
    wallet,
  },
  actions: {},
  mutations: {
    SET_WEB3(state, val) {
      state.web3 = val;
    },
  },
});

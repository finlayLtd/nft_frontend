export const wallet = {
  namespaced: true,
  state: {
    account: "",
    chainId: "",
    balance: "",
  },
  actions: {},
  getters: {},
  mutations: {
    UPDATE_ACCOUNT(state, val) {
      state.account = val;
    },
    UPDATE_CHAIN_ID(state, val) {
      state.chainId = val;
    },
    UPDATE_BALANCE(state, val) {
      state.balance = val;
    },
  },
};

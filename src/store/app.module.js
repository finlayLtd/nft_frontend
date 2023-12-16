export const app = {
  namespaced: true,
  state: {
    windowWidth: 0,
    menuOpened: false,
    logBarOpened: false,
    connectWalletPop: false,
  },
  getters: {},
  mutations: {
    UPDATE_WINDOW_WIDTH(state, val) {
      state.windowWidth = val;
    },
    TOGGLE_MENU(state, val) {
      state.menuOpened = val;
    },
    TOGGLE_NOTIFICATION_BAR(state, val) {
      state.logBarOpened = val;
    },
    OPEN_CONNECT_WALLET_MODAL(state) {
      state.connectWalletPop = true;
    },
  },
};

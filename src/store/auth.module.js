import authService from "@/core/services/auth.service";

export const auth = {
  namespaced: true,
  state: {
    isLoggedIn: false,
  },
  actions: {
    async login({ commit, dispatch, rootState }, walletAddress) {
      if (walletAddress) {
        walletAddress = walletAddress.toLowerCase();
        return new Promise((resolve, reject) => {
          authService.connectWallet(walletAddress).then(
            (user) => {
              rootState.user = user;
              commit("loginSuccess", user);

              resolve(user);
            },
            (error) => {
              commit("loginFailure");
              rootState.user = null;
              reject(error);
            }
          );
        });
      } else {
        rootState.user = {};
        commit("loginFailure");
        return false;
      }
    },
    async saveProfile({ commit, rootState }, data) {
      const savedUser = await authService.saveProfile(rootState.user.id, data);
      rootState.user = savedUser.data;
    },
    updateProfilePicture({ commit, rootState }, profile_img) {
      rootState.user.profile_img = profile_img;
    },
  },
  getters: {
    walletAddress: (state, getters, rootState) => {
      return rootState.user && rootState.user.walletAddress
        ? rootState.user.walletAddress
        : "";
    },
    userId: (state, getters, rootState) => {
      return rootState.user && rootState.user.id ? rootState.user.id : "";
    },
    user: (state, getters, rootState) => {
      return rootState.user;
    },
  },
  mutations: {
    async loginSuccess() {
      localStorage.setItem("isLoggedIn", true);
    },
    loginFailure() {
      localStorage.removeItem("isLoggedIn");
    },
  },
};

import { createRouter, createWebHistory } from "vue-router";
import _private from "./routes/private";
import _public from "./routes/public";
import store from "@/store";

const routes = [..._private, ..._public];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: "smooth",
      };
    }
    if (to.name !== from.name) return savedPosition || { top: 0 };
  },
});

const getAccounts = async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve([]);
    }, 1000);
    ethereum.request({ method: "eth_accounts" }).then((accounts) => {
      resolve(accounts);
    });
  });
};

router.beforeEach(async (to, from, next) => {
  // trying to access a restricted page + not logged in
  // redirect to login page
  let accounts = [];
  if (!store.state.wallet.account && typeof window.ethereum !== "undefined") {
    accounts = await getAccounts();
  }
  if (
    to.meta.requiresAuth &&
    !store.state.wallet.account &&
    accounts.length === 0
  ) {
    next("/login");
  } else {
    next();
  }
});

export default router;

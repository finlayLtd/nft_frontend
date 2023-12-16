export default [
  {
    meta: {
      title: "Landing",
    },
    path: "/",
    name: "landing",
    component: () => import("@/views/landing/Landing.vue"),
  },
  {
    meta: {
      title: "Home",
    },
    path: "/home",
    name: "home",
    component: () => import("@/views/home/Home.vue"),
  },
  {
    meta: {
      title: "PublicSale",
    },
    path: "/public-sale",
    name: "public_sale",
    component: () => import("@/views/home/initial-offering/PublicSalePage.vue"),
  },
  {
    meta: {
      title: "InitialOffering",
    },
    path: "/initial-offering",
    name: "initial_offering",
    component: () =>
      import("@/views/home/initial-offering/InitialOfferingPage.vue"),
  },
  {
    meta: {
      title: "DerivativesOffering",
    },
    path: "/derivatives-offering",
    name: "derivatives_offering",
    component: () =>
      import("@/views/home/derivatives-offering/DerivativesOfferingPage.vue"),
  },
  {
    meta: {
      title: "Ledger",
    },
    path: "/ledger",
    name: "ledger",
    component: () => import("@/views/home/LedgerPage.vue"),
  },
  {
    meta: {
      title: "Browse",
    },
    path: "/browse",
    name: "browse",
    component: () => import("@/views/browse/Browse.vue"),
  },
  {
    meta: {
      title: "Activity",
    },
    path: "/activity",
    name: "activity",
    component: () => import("@/views/activity/Activity.vue"),
  },
  {
    meta: {
      title: "Collection",
    },
    path: "/collection/:chain/:contractAddress",
    name: "collection",
    component: () => import("@/views/collection/Collection.vue"),
  },
  {
    meta: {
      title: "Asset",
    },
    path: "/asset/:chain/:tokenAddress/:tokenId",
    name: "asset",
    component: () => import("@/views/asset/Asset.vue"),
  },
  {
    meta: {
      title: "AssetLedger",
    },
    path: "/asset-ledger/:chain/:tokenAddress/:tokenId",
    name: "asset_ledger",
    component: () => import("@/views/asset/AssetLedgerPage.vue"),
  },
  {
    meta: {
      title: "MultiLevelOwnership",
    },
    path: "/multilevel",
    name: "multilevel",
    component: () => import("@/views/multilevel/MultiLevelOwnership.vue"),
  },
  {
    meta: {
      title: "Dvc",
    },
    path: "/dvc",
    name: "dvc",
    component: () => import("@/views/dvc/Dvc.vue"),
  },
  {
    meta: {
      title: "DvcLaunch",
    },
    path: "/dvc/launch",
    name: "dvc_launch",
    component: () => import("@/views/dvc/DvcLaunch.vue"),
  },
  {
    meta: {
      title: "Account",
    },
    path: "/account/:address?",
    name: "account",
    component: () => import("@/views/account/Account.vue"),
  },
  {
    meta: {
      title: "AccountSetting",
    },
    path: "/account-setting",
    name: "account_setting",
    component: () => import("@/views/account/AccountSetting.vue"),
  },
  {
    meta: {
      title: "Login",
    },
    path: "/login",
    name: "login",
    component: () => import("@/views/login/Login.vue"),
  },
  {
    meta: {
      title: "Airdrop",
    },
    path: "/airdrop",
    name: "airdrop",
    component: () => import("@/views/airdrop/Airdrop.vue"),
  },
  {
    meta: {
      title: "Evm",
    },
    path: "/evm",
    name: "evm",
    component: () => import("@/views/evm/Evm.vue"),
  },
  {
    path: "/:catchAll(.*)",
    component: () => import("@/views/error/404/NotFound.vue"),
  },
];

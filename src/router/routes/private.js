export default [
  {
    meta: {
      title: "Create",
      requiresAuth: true,
    },
    path: "/create",
    name: "create",
    component: () => import("@/views/asset/create/Create.vue"),
  },
  {
    meta: {
      title: "CollectionSetting",
      requiresAuth: true,
    },
    path: "/collection/:chain/:contractAddress/edit",
    name: "collection_setting",
    component: () => import("@/views/collection/CollectionSetting.vue"),
  },
];

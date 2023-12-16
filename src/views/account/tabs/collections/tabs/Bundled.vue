<script setup>
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  watchEffect,
} from "vue";
import NftmxImg from "@/core/components/basic/NftmxImg.vue";
import NftmxTrimString from "@/core/components/basic/NftmxTrimString.vue";
import usersService from "@/core/services/market/users.service";
import { themeConfig, defaultPagination } from "@/core/config/constant";
import { useStore } from "vuex";
import BundledAssetCard from "../components/BundledAssetCard.vue";
import NftmxSearchInput from "@/core/components/basic/NftmxSearchInput.vue";
import useDebouncedRef from "@/core/utils/hook/useDebouncedRef";
import marketService from "@/core/services/market.service";
import nftsService from "@/core/services/market/nfts.service";
import AssetSearchOptions from "../components/AssetSearchOptions.vue";
import { unpack } from "@/core/utils/contracts/packable.utils.js";
import NftmxButton from "@/core/components/basic/NftmxButton.vue";
import { useToast } from "vue-toastification";
import { io } from "socket.io-client";
const socket = io(import.meta.env.VITE_APP_SERVER_URL);

const props = defineProps({
  account: Object,
});

const toast = useToast();
const _account = computed(() => props.account);
const store = useStore();
const accountAddress = computed(() => props.account?.walletAddress);
const windowWidth = computed(() => store.state.app.windowWidth);
const walletAddress = computed(() => store.getters["auth/walletAddress"]);
const userId = computed(() => store.getters["auth/userId"]);
const newPack = ref([]);
const loading = ref(false);
const allAssets = ref({ assets: [], cursor: null });
const assets = ref([]);
const more = computed(
  () =>
    allAssets.value.cursor ||
    assets.value.length < allAssets.value.assets.length
);
const limit = ref(2);
const filterOption = ref({
  chain: "BSC-TESTNET",
  model: "BUNDLE",
  name: "",
  collection: [],
  sortBy: "",
  hashtag: "",
});
const searchText = useDebouncedRef("", 1000);
const filterActive = ref(false);

const removeFromList = (id) => {
  const index = allAssets.value.assets.findIndex((asset) => asset.id === id);
  allAssets.value.assets.splice(index, 1);
  const lines = Math.ceil((assets.value.length - 1) / limit.value);
  assets.value = allAssets.value.assets.slice(0, limit.value * lines);
};
const unbundleNFT = (bundle) => {
  unpack(bundle.tokenId).then((res) => {
    removeFromList(bundle.id);
  });
};
const vote = async (token) => {
  if (!userId.value) {
    toast.error("Please login first");
    return;
  }
  nftsService
    .vote({
      chain: filterOption.value.chain,
      userId: userId.value,
      nftId: token.id,
    })
    .then((res) => {
      const votedToken = assets.value.find((item) => item.id === token.id);
      if (res.data) {
        votedToken.votes.push(store.state.user);
      } else {
        const index = votedToken.votes.findIndex(
          (item) => item.id === userId.value
        );
        votedToken.votes.splice(index, 1);
      }
    });
};
const clickFilter = () => {
  filterActive.value = !filterActive.value;
};
const filterAssets = (value) => {
  filterOption.value = value;
  initialAssets();
};
const loadMoreAssets = async () => {
  loading.value = true;
  if (allAssets.value.cursor) await retrieveAssets();
  loading.value = false;
  const sliceLimit = limit.value * 3;
  const nextStartPoint = assets.value.length;
  assets.value = assets.value.concat(
    allAssets.value.assets.slice(nextStartPoint, nextStartPoint + sliceLimit)
  );
};
const initialAssets = async () => {
  allAssets.value = { assets: [], cursor: null };
  assets.value = [];
  loading.value = true;
  await retrieveAssets();
  loading.value = false;
  assets.value = assets.value.concat(
    allAssets.value.assets.slice(0, limit.value * 4)
  );
};
const retrieveAssets = async () => {
  if (!_account.value) return;
  return new Promise((resolve, reject) => {
    usersService
      .collectedNfts({
        ...filterOption.value,
        cursor: allAssets.value.cursor,
        limit: defaultPagination.limit,
        walletAddress: _account.value.walletAddress,
      })
      .then((res) => {
        allAssets.value = {
          assets: [...allAssets.value.assets, ...res.data.nfts],
          cursor: res.data.cursor,
        };
        resolve(true);
      })
      .catch((err) => {
        resolve(false);
      });
  });
};
const setLimitValue = (width) => {
  let newLimit = 6;
  if (width >= themeConfig.xl3) {
    newLimit = 6;
  } else if (width >= themeConfig.xl2) {
    newLimit = 5;
  } else if (width >= themeConfig.xl) {
    newLimit = 4;
  } else if (width >= themeConfig.lg) {
    newLimit = 3;
  } else if (width >= themeConfig.sm) {
    newLimit = 2;
  } else {
    newLimit = 1;
  }
  if (limit.value === newLimit) return;
  const lines = Math.ceil(assets.value.length / limit.value);
  assets.value = allAssets.value.assets.slice(0, newLimit * lines);
  limit.value = newLimit;
};
watch(windowWidth, (width) => {
  setLimitValue(width);
});
watch(searchText, (val) => {
  filterAssets({ ...filterOption.value, name: val });
});
watch(_account, (val) => {
  if (val) {
    setLimitValue(windowWidth.value);
    initialAssets();
  }
});
onMounted(() => {
  if (_account.value) {
    setLimitValue(windowWidth.value);
    initialAssets();
  }
  if (accountAddress.value) {
    socket.on(`nft-transferred/${accountAddress.value}`, (data) => {
      if (
        !data.nft ||
        data.nft.isDerivative ||
        !data.nft.nfts ||
        data.nft.nfts.length === 0
      )
        return;

      if (data.action === "ADDED") {
        allAssets.value.assets.push(data.nft);
        const lines = Math.ceil(assets.value.length / limit.value);
        assets.value = allAssets.value.assets.slice(0, limit.value * lines);
      } else if (data.action === "REMOVED") {
        const index = allAssets.value.assets.findIndex(
          (token) => token.id === data.nft.id
        );
        if (index > -1) {
          allAssets.value.assets.splice(index, 1);
          const lines = Math.ceil(assets.value.length / limit.value);
          assets.value = allAssets.value.assets.slice(0, limit.value * lines);
        }
      }
    });
  }
});
watch(accountAddress, (val, oldVal) => {
  if (oldVal) {
    socket.removeListener(`nft-transferred/${oldVal}`);
  }
  if (val) {
    socket.on(`nft-transferred/${val}`, (data) => {
      if (
        !data.nft ||
        data.nft.isDerivative ||
        !data.nft.nfts ||
        data.nft.nfts.length === 0
      )
        return;

      if (data.action === "ADDED") {
        allAssets.value.assets.push(data.nft);
        const lines = Math.ceil(assets.value.length / limit.value);
        assets.value = allAssets.value.assets.slice(0, limit.value * lines);
      } else if (data.action === "REMOVED") {
        const index = allAssets.value.assets.findIndex(
          (token) => token.id === data.nft.id
        );
        if (index > -1) {
          allAssets.value.assets.splice(index, 1);
          const lines = Math.ceil(assets.value.length / limit.value);
          assets.value = allAssets.value.assets.slice(0, limit.value * lines);
        }
      }
    });
  }
});
onBeforeUnmount(() => {
  console.log("bundled unmount");
  socket.removeAllListeners();
});
</script>

<template>
  <div class="mb-22 xl:pt-7.25">
    <div class="flex xl:justify-end">
      <nftmx-search-input
        v-model="searchText"
        @handle-filter="clickFilter"
        :filterActive="filterActive"
        class="bg-tertiary-800 z-10"
      />
    </div>
    <div
      class="-ml-5 sm:-ml-10 md:-ml-16 xl:-ml-22 -mr-5 sm:-mr-10 md:-mr-16 xl:-mr-22 text-white"
    >
      <asset-search-options
        :gridExtend="false"
        :filterOption="filterOption"
        @filter-assets="filterAssets"
        :filterActive="filterActive"
      />
    </div>
    <div
      v-if="assets.length > 0"
      class="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 mt-10"
    >
      <bundled-asset-card
        v-for="token in assets"
        :key="token.id"
        :token="token"
        :account="_account"
        @vote="vote"
        @unbundle="unbundleNFT"
      />
    </div>
    <div
      v-if="loading"
      class="h-96 font-ibm-bold text-tertiary-500 text-lg flex items-center justify-center"
    >
      Loading...
    </div>
    <div
      v-if="!loading && assets.length === 0"
      class="h-96 font-ibm-bold text-tertiary-500 text-lg flex items-center justify-center"
    >
      No NFTs found
    </div>
    <div class="text-center w-full mt-8">
      <nftmx-button
        v-if="more"
        color="primary"
        label="SEE MORE"
        :outline="true"
        @click="loadMoreAssets"
        class="font-ibm-bold text-lg text-primary-900 w-full sm:w-68"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import NftmxImg from "@/core/components/basic/NftmxImg.vue";
import NftmxTrimString from "@/core/components/basic/NftmxTrimString.vue";
import usersService from "@/core/services/market/users.service";
import {
  themeConfig,
  defaultPagination,
  BSC_TESTNET_PACKABLE_CONTRACT_ADDRESS,
} from "@/core/config/constant";
import { useStore } from "vuex";
import CollectedAssetCard from "../components/CollectedAssetCard.vue";
import NftmxSearchInput from "@/core/components/basic/NftmxSearchInput.vue";
import useDebouncedRef from "@/core/utils/hook/useDebouncedRef";
import marketService from "@/core/services/market.service";
import nftsService from "@/core/services/market/nfts.service";
import CollectedAssetSearchOptions from "../components/CollectedAssetSearchOptions.vue";
import {
  setApprovalForAll,
  isApprovedForAll,
} from "@/core/utils/contracts/erc721.utils";
import { pack } from "@/core/utils/contracts/packable.utils.js";
import NftmxButton from "@/core/components/basic/NftmxButton.vue";
import { useToast } from "vue-toastification";
import { io } from "socket.io-client";
const socket = io(import.meta.env.VITE_APP_SERVER_URL);

const props = defineProps({
  account: Object,
});

const emit = defineEmits(["hide", "pack"]);

const _account = computed(() => props.account);
const store = useStore();
const toast = useToast();
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
const _allAssets = ref({ assets: [], cursor: null });
const _assets = ref([]);
const _more = computed(
  () =>
    _allAssets.value.cursor ||
    _assets.value.length < _allAssets.value.assets.length
);
const _loading = ref(false);
const limit = ref(2);
const filterOption = ref({
  chain: "BSC-TESTNET",
  model: "SINGLE",
  name: "",
  collection: [],
  sortBy: "",
  hashtag: "",
});
const searchText = useDebouncedRef("", 1000);
const filterActive = ref(false);
const packLoading = ref(false);
const approvedAddressesToPack = ref([]);
const addressesToApprove = ref([]);
const needApproved = ref(false);
const isCartOpened = computed(
  () =>
    walletAddress.value &&
    _account.value &&
    walletAddress.value === _account.value.walletAddress
);

const startDrag = (evt, item) => {
  evt.dataTransfer.dropEffect = "move";
  evt.dataTransfer.effectAllowed = "move";
  evt.dataTransfer.setData("itemId", item.id);
};
const removeAsset = (asset) => {
  const index = allAssets.value.assets.findIndex(
    (token) => token.id === asset.id
  );
  if (index < 0) return;
  allAssets.value.assets.splice(index, 1);
  const lines = Math.ceil(assets.value.length / limit.value);
  assets.value = allAssets.value.assets.slice(0, limit.value * lines);
};
const onDrop = async (evt) => {
  const itemId = evt.dataTransfer.getData("itemId");
  if (!itemId) return;
  const index = allAssets.value.assets.findIndex(
    (token) => token.id === itemId
  );
  if (index > -1) {
    const addedItem = allAssets.value.assets.splice(index, 1);
    const lines = Math.ceil(assets.value.length / limit.value);
    assets.value = allAssets.value.assets.slice(0, limit.value * lines);
    newPack.value.push(addedItem[0]);
  }
  const _index = _allAssets.value.assets.findIndex(
    (token) => token.id === itemId
  );
  if (_index > -1) {
    const addedItem = _allAssets.value.assets.splice(_index, 1);
    const lines = Math.ceil(_assets.value.length / limit.value);
    _assets.value = _allAssets.value.assets.slice(0, limit.value * lines);
    newPack.value.push(addedItem[0]);
  }
};
const cancelBundle = (id) => {
  const index = newPack.value.findIndex((item) => item.id === id);
  const canceledItem = newPack.value.splice(index, 1);
  allAssets.value.assets.push(canceledItem[0]);
  const lines = Math.ceil(assets.value.length / limit.value);
  assets.value = allAssets.value.assets.slice(0, limit.value * lines);
};
const packBundle = async () => {
  try {
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x61" }],
    });
    if (newPack.value.length < 2) return;
    packLoading.value = true;
    const tokenAddresses = newPack.value.map((item) => item.contract.address);
    const tokenIds = newPack.value.map((item) => item.tokenId);
    const uniqueAddresses = tokenAddresses.filter(
      (item, index, inputArray) => inputArray.indexOf(item) == index
    );
    for (let i = 0; i < uniqueAddresses.length; i++) {
      const approved = await isApprovedForAll(
        uniqueAddresses[i],
        walletAddress.value,
        BSC_TESTNET_PACKABLE_CONTRACT_ADDRESS
      );
      if (!approved) {
        await setApprovalForAll(
          uniqueAddresses[i],
          BSC_TESTNET_PACKABLE_CONTRACT_ADDRESS,
          true
        );
      }
    }
    pack(
      newPack.value[0].name,
      newPack.value[0].description,
      tokenAddresses,
      tokenIds,
      [],
      []
    )
      .then((res) => {
        emit("pack", newPack.value.length);
        newPack.value = [];
        toast.success("Bundle has been created successfully");
      })
      .catch((err) => {
        if (err.code === 4001) {
          toast.error("User denied transaction signature.");
        } else {
          toast.error("Something went wrong");
        }
      })
      .finally(() => {
        packLoading.value = false;
      });
  } catch (err) {
    if (err.code === 4001) {
      toast.error("User denied transaction signature.");
    } else {
      toast.error("Something went wrong");
    }
    packLoading.value = false;
  }
};
const transferNFT = (id) => {
  const index = allAssets.value.assets.findIndex((asset) => asset.id === id);
  allAssets.value.assets.splice(index, 1);
  const lines = Math.ceil((assets.value.length - 1) / limit.value);
  assets.value = allAssets.value.assets.slice(0, limit.value * lines);
};
const hideNFT = (token) => {
  marketService
    .hideToken(
      userId.value,
      filterOption.value.chain,
      token.contract.address,
      token.tokenId
    )
    .then((res) => {
      if (res) {
        const index = allAssets.value.assets.findIndex(
          (asset) => asset.id === token.id
        );
        allAssets.value.assets.splice(index, 1);
        const lines = Math.ceil((assets.value.length - 1) / limit.value);
        assets.value = allAssets.value.assets.slice(0, limit.value * lines);
        emit("hide");
      } else {
        toast.error("Cannot hide the token");
      }
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
  _initialAssets();
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
    allAssets.value.assets.slice(0, limit.value * 1)
  );
};
const retrieveAssets = async () => {
  if (!_account.value) return;
  return new Promise((resolve, reject) => {
    usersService
      .collectedNfts({
        ...filterOption.value,
        type: "DERIVATIVE",
        createdBy: "OTHER",
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
const _loadMoreAssets = async () => {
  _loading.value = true;
  if (_allAssets.value.cursor) await _retrieveAssets();
  _loading.value = false;
  const sliceLimit = limit.value * 3;
  const nextStartPoint = _assets.value.length;
  _assets.value = _assets.value.concat(
    _allAssets.value.assets.slice(nextStartPoint, nextStartPoint + sliceLimit)
  );
};
const _initialAssets = async () => {
  _allAssets.value = { assets: [], cursor: null };
  _assets.value = [];
  _loading.value = true;
  await _retrieveAssets();
  _loading.value = false;
  _assets.value = _assets.value.concat(
    _allAssets.value.assets.slice(0, limit.value * 1)
  );
};
const _retrieveAssets = async () => {
  if (!_account.value) return;
  return new Promise((resolve, reject) => {
    usersService
      .collectedNfts({
        ...filterOption.value,
        type: "DERIVATIVE",
        createdBy: "ME",
        cursor: _allAssets.value.cursor,
        limit: defaultPagination.limit,
        walletAddress: _account.value.walletAddress,
      })
      .then((res) => {
        _allAssets.value = {
          assets: [..._allAssets.value.assets, ...res.data.nfts],
          cursor: res.data.cursor,
        };
        resolve(true);
      })
      .catch((err) => {
        resolve(false);
      });
  });
};
const approve = async () => {
  try {
    packLoading.value = true;
    for (let i = 0; i < addressesToApprove.value.length; i++) {
      await setApprovalForAll(
        addressesToApprove.value[i],
        BSC_TESTNET_PACKABLE_CONTRACT_ADDRESS,
        true
      );
    }
    packLoading.value = false;
    needApproved.value = false;
  } catch (err) {
    if (err.code === 4001) {
      toast.error("User denied transaction signature.");
    } else {
      toast.error("Something went wrong");
    }
    packLoading.value = false;
  }
};
const setLimit = () => {
  let rowCount = 6;
  if (windowWidth.value >= themeConfig.xl3) {
    rowCount = 6;
  } else if (windowWidth.value >= themeConfig.xl2) {
    rowCount = 5;
  } else if (windowWidth.value >= themeConfig.xl) {
    rowCount = 4;
  } else if (windowWidth.value >= themeConfig.lg) {
    rowCount = 3;
  } else if (windowWidth.value >= themeConfig.sm) {
    rowCount = 2;
  }
  if (isCartOpened.value) {
    rowCount--;
  }
  if (windowWidth.value < themeConfig.sm) {
    rowCount = 1;
  }

  limit.value = rowCount;
};
watch(windowWidth, () => {
  setLimit();
});
watch(isCartOpened, () => {
  setLimit();
});
watch(limit, (newVal, oldVal) => {
  const rows = Math.ceil(assets.value.length / oldVal);
  const _rows = Math.ceil(_assets.value.length / oldVal);
  assets.value = allAssets.value.assets.slice(0, rows * newVal);
  _assets.value = _allAssets.value.assets.slice(0, _rows * newVal);
});
watch(searchText, (val) => {
  filterAssets({ ...filterOption.value, name: val });
});
watch(_account, (val) => {
  newPack.value = [];
  addressesToApprove.value = [];
  approvedAddressesToPack.value = [];
  if (val) {
    setLimit();
    initialAssets();
    _initialAssets();
  }
});
watch(
  newPack,
  async (val) => {
    const tokenAddresses = newPack.value.map((item) => item.contract.address);
    const uniqueAddresses = tokenAddresses.filter(
      (item, index, inputArray) => inputArray.indexOf(item) == index
    );
    addressesToApprove.value = addressesToApprove.value.filter((element) =>
      uniqueAddresses.includes(element)
    );
    needApproved.value = addressesToApprove.value.length;
    const _addressesToApprove = uniqueAddresses.filter(
      (element) =>
        !approvedAddressesToPack.value.includes(element) &&
        !addressesToApprove.value.includes(element)
    );
    let _needApprove = needApproved.value;

    if (store.state.wallet.chainId !== "0x61") {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x61" }],
      });
    }
    for (let i = 0; i < _addressesToApprove.length; i++) {
      const approved = await isApprovedForAll(
        _addressesToApprove[i],
        walletAddress.value,
        BSC_TESTNET_PACKABLE_CONTRACT_ADDRESS
      );
      if (approved) {
        approvedAddressesToPack.value.push(_addressesToApprove[i]);
      } else {
        addressesToApprove.value.push(_addressesToApprove[i]);
        _needApprove = true;
      }
    }
    needApproved.value = _needApprove;
  },
  { deep: true }
);
onMounted(() => {
  if (_account.value) {
    setLimit();
    initialAssets();
    _initialAssets();
  }
  if (accountAddress.value) {
    socket.on(`nft-transferred/${accountAddress.value}`, (data) => {
      if (
        !data.nft ||
        !data.nft.isDerivative ||
        (data.nft.nfts && data.nft.nfts.length > 0)
      )
        return;

      if (data.action === "ADDED") {
        if (data.nft.creator?.walletAddress === accountAddress.value) {
          _allAssets.value.assets.push(data.nft);
          const lines = Math.ceil(_assets.value.length / limit.value);
          _assets.value = _allAssets.value.assets.slice(0, limit.value * lines);
        } else {
          allAssets.value.assets.push(data.nft);
          const lines = Math.ceil(assets.value.length / limit.value);
          assets.value = allAssets.value.assets.slice(0, limit.value * lines);
        }
      } else if (data.action === "REMOVED") {
        const index = allAssets.value.assets.findIndex(
          (token) => token.id === data.nft.id
        );
        if (index > -1) {
          allAssets.value.assets.splice(index, 1);
          const lines = Math.ceil(assets.value.length / limit.value);
          assets.value = allAssets.value.assets.slice(0, limit.value * lines);
        }
        const index1 = _allAssets.value.assets.findIndex(
          (token) => token.id === data.nft.id
        );
        if (index1 > -1) {
          _allAssets.value.assets.splice(index1, 1);
          const lines = Math.ceil(_assets.value.length / limit.value);
          _assets.value = _allAssets.value.assets.slice(0, limit.value * lines);
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
        !data.nft.isDerivative ||
        (data.nft.nfts && data.nft.nfts.length > 0)
      )
        return;

      if (data.action === "ADDED") {
        if (data.nft.creator?.walletAddress === accountAddress.value) {
          _allAssets.value.assets.push(data.nft);
          const lines = Math.ceil(_assets.value.length / limit.value);
          _assets.value = _allAssets.value.assets.slice(0, limit.value * lines);
        } else {
          allAssets.value.assets.push(data.nft);
          const lines = Math.ceil(assets.value.length / limit.value);
          assets.value = allAssets.value.assets.slice(0, limit.value * lines);
        }
      } else if (data.action === "REMOVED") {
        const index = allAssets.value.assets.findIndex(
          (token) => token.id === data.nft.id
        );
        if (index > -1) {
          allAssets.value.assets.splice(index, 1);
          const lines = Math.ceil(assets.value.length / limit.value);
          assets.value = allAssets.value.assets.slice(0, limit.value * lines);
        }
        const index1 = _allAssets.value.assets.findIndex(
          (token) => token.id === data.nft.id
        );
        if (index1 > -1) {
          _allAssets.value.assets.splice(index1, 1);
          const lines = Math.ceil(_assets.value.length / limit.value);
          _assets.value = _allAssets.value.assets.slice(0, limit.value * lines);
        }
      }
    });
  }
});
onBeforeUnmount(() => {
  socket.removeAllListeners();
});
</script>

<template>
  <div class="mb-22">
    <div class="flex flex-col sm:flex-row xl:pt-7.25">
      <div class="flex-1">
        <div class="flex 2xl:justify-end xl:pt-15 2xl:pt-0">
          <nftmx-search-input
            v-model="searchText"
            @handle-filter="clickFilter"
            :filterActive="filterActive"
            class="bg-tertiary-800 z-10"
          />
        </div>
        <div class="-ml-5 sm:-ml-10 md:-ml-16 xl:-ml-22 -mr-2 text-white">
          <collected-asset-search-options
            :gridExtend="false"
            :filterOption="filterOption"
            @filter-assets="filterAssets"
            :filterActive="filterActive"
          />
        </div>
        <div class="font-ibm-bold text-lg text-white mt-9">
          Created by others
        </div>
        <div
          v-if="assets.length > 0"
          :class="[
            'grid gap-5 mt-8',
            walletAddress &&
            _account &&
            walletAddress === _account.walletAddress
              ? 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5'
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6',
          ]"
        >
          <collected-asset-card
            v-for="token in assets"
            :key="token.id"
            :account="_account"
            :token="token"
            :draggable="true"
            @dragstart="startDrag($event, token)"
            class="cursor-grab active:cursor-grabbing"
            @transfer="transferNFT"
            @vote="vote"
            @hide="hideNFT"
            @remove-asset="removeAsset"
          />
        </div>
        <div
          v-if="loading"
          class="h-60 font-ibm-bold text-tertiary-500 text-lg flex items-center justify-center"
        >
          Loading...
        </div>
        <div
          v-if="!loading && assets.length === 0"
          class="h-60 font-ibm-bold text-tertiary-500 text-lg flex items-center justify-center"
        >
          No NFTs found
        </div>
        <div class="text-right w-full mt-2">
          <span
            v-if="more"
            @click="loadMoreAssets"
            class="font-ibm-bold text-sm text-primary-900 w-full cursor-pointer"
          >
            SEE MORE
          </span>
        </div>
        <div class="mt-14 relative">
          <div class="font-ibm-bold text-lg text-white">Created by you</div>
          <div
            v-if="_assets.length > 0"
            :class="[
              'grid gap-5 mt-8',
              walletAddress &&
              _account &&
              walletAddress === _account.walletAddress
                ? 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5'
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6',
            ]"
          >
            <collected-asset-card
              v-for="token in _assets"
              :key="token.id"
              :account="_account"
              :token="token"
              :draggable="true"
              @dragstart="startDrag($event, token)"
              class="cursor-grab active:cursor-grabbing"
              @transfer="transferNFT"
              @vote="vote"
              @hide="hideNFT"
              @remove-asset="removeAsset"
            />
          </div>
          <div
            v-if="_loading"
            class="h-60 font-ibm-bold text-tertiary-500 text-lg flex items-center justify-center"
          >
            Loading...
          </div>
          <div
            v-if="!_loading && _assets.length === 0"
            class="h-60 font-ibm-bold text-tertiary-500 text-lg flex items-center justify-center"
          >
            No NFTs found
          </div>
          <div class="text-right w-full mt-2 absolute">
            <span
              v-if="_more"
              @click="_loadMoreAssets"
              class="font-ibm-bold text-sm text-primary-900 w-full cursor-pointer"
            >
              SEE MORE
            </span>
          </div>
        </div>
      </div>
      <div
        v-if="
          walletAddress && _account && walletAddress === _account.walletAddress
        "
        class="mt-2.25 mb-2.75 sm:mt-0 sm:mb-0 sm:ml-2.25 sm:mr-2.75 border-t sm:border-r border-black"
      />
      <div
        v-if="
          walletAddress && _account && walletAddress === _account.walletAddress
        "
        class="flex flex-col sm:w-68.5 font-ibm z-10"
      >
        <div
          class="flex flex-col flex-grow border-dashed border-primary-900 border-2 border-b-0"
          @drop="onDrop($event)"
          @dragover.prevent
          @dragenter.prevent
        >
          <div
            v-if="newPack.length === 0"
            class="flex flex-col flex-grow text-center"
          >
            <div class="text-white p-5.25 text-11 tracking-wider">
              Drag and drop to create bundle
            </div>
            <div
              class="flex-grow flex items-center justify-center text-red-800 px-12 text-center text-base leading-5 py-10"
            >
              Your bundle pack is empty
            </div>
          </div>
          <div
            v-if="newPack.length > 0"
            class="flex flex-col flex-grow px-6 py-7.25 gap-7.5"
          >
            <div
              v-for="item in newPack"
              :key="item.id"
              class="flex text-white font-ibm-bold items-center gap-3.5"
            >
              <nftmx-img :src="item.imageUrl" class="w-8.75 h-8.75 bg-black" />
              <nftmx-trim-string class="flex-grow text-sm" :line="1">
                {{ item.name || "#" + item.tokenId }}
              </nftmx-trim-string>
              <font-awesome-icon
                :icon="['fas', 'times']"
                class="text-sm cursor-pointer hover:text-red-900 transition"
                @click="cancelBundle(item.id)"
              />
            </div>
          </div>
          <div
            class="text-white p-5 text-11 font-ibm-medium border-t border-gray-800"
          >
            Total NFT:
            <span class="text-primary-900">{{ newPack.length }}</span>
          </div>
        </div>
        <button
          v-if="needApproved"
          @click="approve"
          :class="[
            'transition bg-black text-primary-900',
            packLoading ? 'cursor-wait' : '',
            'font-press text-sm h-15',
          ]"
          :disabled="packLoading"
        >
          APPROVE
        </button>
        <button
          v-else
          @click="packBundle"
          :class="[
            newPack.length > 1
              ? 'transition bg-primary-900 hover:bg-primary-800 shadow-default shadow-primary-900 text-white'
              : 'bg-gray-600 text-tertiary-400 cursor-not-allowed',
            packLoading ? 'cursor-wait' : '',
            'font-press text-sm h-15',
          ]"
          :disabled="packLoading || newPack.length < 2"
        >
          PACK AS A BUNDLE
        </button>
      </div>
    </div>
  </div>
</template>

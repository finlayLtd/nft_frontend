<script setup>
import {
  computed,
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import marketService from "@/core/services/market.service";
import ordersService from "@/core/services/market/orders.service";
import BodyContainer from "@/core/container/BodyContainer.vue";
import {
  MainToken,
  themeConfig,
  BSC_TESTNET_MARKET_CONTRACT_ADDRESS,
} from "@/core/config/constant";
import AssetHead from "./AssetHead.vue";
import AssetDetail from "./AssetDetail.vue";
import AssetHistory from "./AssetHistory.vue";
import AssetOffers from "./AssetOffers.vue";
import AssetLedger from "./AssetLedger.vue";
import AssetMlr from "./AssetMlr.vue";
import OfferModal from "./purchase/OfferModal.vue";
import NftmxButton from "@/core/components/basic/NftmxButton.vue";
import AssetSellModal from "./sell/AssetSellModal.vue";
import PurchaseAction from "./purchase/PurchaseAction.vue";
import { cancelOffer } from "@/core/utils/contracts/market.utils";
import NftmxCancelModal from "@/core/components/modal/NftmxCancelModal.vue";
import { roundTo, formatAMPM, getChainKey } from "@/core/utils/common";
import OpenseaAssetCard from "@/core/components/cards/OpenseaAssetCard.vue";
import { createSyndicationMlr } from "@/core/utils/contracts/syndication-mlr-factory.utils.js";
import { createSyndicationMarket } from "@/core/utils/contracts/syndication-market-factory.utils.js";
import { useToast } from "vue-toastification";
import Web3 from "web3/dist/web3.min.js";
import { NULL_ADDRESS } from "../../core/config/constant";
import { io } from "socket.io-client";
import MoreDerivatives from "./MoreDerivatives.vue";
import MoreAssets from "./MoreAssets.vue";

const socket = io(import.meta.env.VITE_APP_SERVER_URL);
const store = useStore();
const route = useRoute();
const toast = useToast();
const chainId = computed(() => store.state.wallet.chainId);
const walletAddress = computed(() => store.getters["auth/walletAddress"]);
const userId = computed(() => store.getters["auth/userId"]);
const chain = route.params.chain.toUpperCase();
const chainKey = getChainKey(chain);
const coinPrice = computed(() =>
  store.getters["market/getCoinPrice"](chainKey)
);
const tokenAddress = route.params.tokenAddress.toLowerCase();
const tokenId = route.params.tokenId.toLowerCase();
const windowWidth = computed(() => store.state.app.windowWidth);
const asset = ref({});
const myOffer = ref();
const history = ref([
  {
    block_timestamp: "2022-10-02T01:33:23.000Z",
    transaction_hash:
      "0x8875918fe809e4cb7ebdf46a7c016e9a0964c04bbd1e53e984fd8e95612be553",
    transaction_index: 30,
    value: 0,
    token_address: "0xd3e3912cb7df9482d0e4eabdbafe843a35d9fee0",
    token_id: "730",
    from_address: "0x3c6575d71c02991dbe974703d0895622729a0450",
    to_address: "0xf532920bb32122d6475ad4cc7634dc3a69631902",
    amount: "1",
  },
  {
    block_timestamp: "2022-05-01T17:10:47.000Z",
    transaction_hash:
      "0x9918b3747f73b1c9bb27f009487f83d37b753d0f2cc2c2a30baaa08b5c7e0d8c",
    transaction_index: 69,
    value: 0.14,
    token_address: "0xd3e3912cb7df9482d0e4eabdbafe843a35d9fee0",
    token_id: "730",
    from_address: "0xe1bcbe7133c53ed46218908f2e419ae082889b40",
    to_address: "0x3c6575d71c02991dbe974703d0895622729a0450",
    amount: "1",
  },
  {
    block_timestamp: "2021-11-01T17:05:23.000Z",
    transaction_hash:
      "0xb26a9ee5d51d9d4c4a48ae73c3e9bc4af6471b81a7e410e45945c6cd6cc0584d",
    transaction_index: 100,
    value: 0,
    token_address: "0xd3e3912cb7df9482d0e4eabdbafe843a35d9fee0",
    token_id: "730",
    from_address: "0x0000000000000000000000000000000000000000",
    to_address: "0xe1bcbe7133c53ed46218908f2e419ae082889b40",
    amount: "1",
  },
]);
const totalTransfers = ref(0);
const offerModal = ref(false);
const saleModal = ref(false);
const waiting = ref(false);
const currentSale = computed(() =>
  asset.value ? asset.value.currentOrder : null
);
const lastSale = computed(() => (asset.value ? asset.value.lastOrder : null));
const moreAssets = ref([]);
const syndicationable = ref(false);
const assetOffers = ref(null);

const getAsset = () => {
  marketService
    .getAsset(chain, tokenAddress, tokenId, userId.value)
    .then((res) => {
      asset.value = res.data;
    });
};
const cancelMyOffer = (callback) => {
  cancelOffer(myOffer.value.orderId)
    .then((res) => {
      toast.success("Canceled your offer successfully");
      callback(res);
    })
    .catch((err) => {
      if (err.code === 4001) {
        toast.error("User denied transaction signature.");
      } else {
        toast.error("Something went wrong.");
      }
      callback(false, err);
    });
};
const openOfferModal = () => {
  offerModal.value = true;
};
const openSaleModal = async () => {
  saleModal.value = true;
};
const updateAsset = (deploySyndication) => {
  syndicationable.value = deploySyndication;
};
const offerCreated = (offer) => {
  asset.value["offer"] = offer;
};
const removeBacker = (backerId) => {
  const index = asset.value.syndication.backers.findIndex(
    (item) => item.id === backerId
  );
  asset.value.syndication.backers.splice(index, 1);
};
const createNewSyndication = async () => {
  if (chain === "ETHEREUM") {
    toast.error("Ethereum network is not ready yet.");
    return;
  }

  try {
    if (asset.value.mlrContract) {
      await createSyndicationMlr(
        [
          [
            tokenAddress,
            tokenId,
            true,
            !asset.value.currentOrder
              ? 2
              : asset.value.currentOrder.orderType === "0"
              ? 0
              : 1,
            !asset.value.currentOrder ? 0 : asset.value.currentOrder.orderId,
            asset.value.mlrContract.address,
            0,
          ],
        ],
        NULL_ADDRESS,
        Web3.utils.toWei("0")
      );
    } else {
      await createSyndicationMarket(
        [
          [
            tokenAddress,
            tokenId,
            true,
            !asset.value.currentOrder
              ? 2
              : asset.value.currentOrder.orderType === "0"
              ? 0
              : 1,
            !asset.value.currentOrder ? 0 : asset.value.currentOrder.orderId,
            BSC_TESTNET_MARKET_CONTRACT_ADDRESS,
            0,
          ],
        ],
        NULL_ADDRESS,
        Web3.utils.toWei("0")
      );
    }
    toast.success("Syndication is created successfully");
  } catch (err) {
    if (err.code === 4001) {
      toast.error("User denied transaction signature.");
    } else {
      toast.error("Something went wrong");
    }
  }
};
const getMyOffer = () => {
  ordersService
    .getMyOffer({
      tokenAddress,
      tokenId,
      walletAddress: walletAddress.value,
    })
    .then((res) => {
      myOffer.value = res.data || null;
    });
};
const addToNetwork = async (chainKey) => {
  try {
    if (chainKey === "ETHEREUM" && chainId.value !== "0x1") {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x1" }],
      });
    } else if (chainKey === "BSC_TESTNET" && chainId.value !== "0x61") {
      const params = {
        BSC_TESTNET: {
          chainId: "0x61", // A 0x-prefixed hexadecimal string
          chainName: "BNB Testnet",
          nativeCurrency: {
            name: "Binance Chain Native Token",
            symbol: "BNB", // 2-6 characters long
            decimals: 18,
          },
          rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
          blockExplorerUrls: ["https://testnet.bscscan.com/"],
        },
      };

      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [params[chainKey], store.state.wallet.account],
      });
    }

    return;
  } catch (error) {
    console.log(error);
    return false;
  }
};
onBeforeMount(() => {
  socket.on(`update-asset/${tokenAddress}/${tokenId}`, (res) => {
    asset.value = res;
    if (syndicationable.value && asset.value.currentOrder) {
      createNewSyndication();
      syndicationable.value = false;
    }
  });
  socket.on(`update-offer/${tokenAddress}/${tokenId}`, (buyerAddress) => {
    if (walletAddress.value === buyerAddress) {
      getMyOffer();
    }
    if (assetOffers.value) {
      assetOffers.value.updateOffers();
    }
  });
});
onMounted(() => {
  getAsset();
  getMyOffer();
  if (chainKey && chainId.value) {
    addToNetwork(chainKey);
  }
});
watch(walletAddress, () => {
  getMyOffer();
});

onBeforeUnmount(() => {
  socket.removeAllListeners();
});
</script>

<template>
  <body-container>
    <div class="py-4">
      <div class="lg:grid grid-cols-7 text-white gap-8 lg:my-7">
        <div class="col-span-3">
          <asset-head
            v-if="windowWidth < themeConfig.lg"
            :asset="asset"
            :currentSale="currentSale"
          />
          <asset-detail :asset="asset" :currentSale="currentSale" />
        </div>
        <div class="col-span-4 relative flex flex-col justify-between">
          <asset-head
            v-if="windowWidth >= themeConfig.lg"
            :asset="asset"
            :currentSale="currentSale"
          />
          <div class="mt-7">
            <purchase-action
              :asset="asset"
              :currentSale="currentSale"
              :lastSale="lastSale"
              :myOffer="myOffer"
              @open-offer-modal="openOfferModal"
              @update-asset="updateAsset"
              @offer-created="offerCreated"
              @cancel-offer="cancelMyOffer"
              @remove-backer="removeBacker"
              @open-sale-modal="openSaleModal"
            />
          </div>
        </div>
      </div>
      <div class="mb-19 text-white">
        <div>
          <asset-history
            :asset="asset"
            :history="history"
            :totalTransfers="totalTransfers"
          />
        </div>
        <div class="mt-5">
          <asset-offers
            ref="assetOffers"
            @open-offer-modal="openOfferModal"
            @cancel-offer="cancelMyOffer"
            :asset="asset"
            :myOffer="myOffer"
          />
        </div>
        <div class="mt-5">
          <asset-ledger
            :tokenAddress="asset.contract?.address"
            :tokenId="asset.tokenId"
          />
        </div>
        <div class="mt-5">
          <asset-mlr :asset="asset" />
        </div>
        <more-derivatives class="mt-12" :asset="asset" />
        <more-assets class="mt-12" :asset="asset" />
      </div>
    </div>
    <asset-sell-modal
      v-if="asset.owner?.id === userId"
      :asset="asset"
      v-model="saleModal"
      @update-asset="updateAsset"
    />
    <offer-modal
      :asset="asset"
      v-model="offerModal"
      @offer-created="offerCreated"
      @update-asset="updateAsset"
    />
  </body-container>
</template>

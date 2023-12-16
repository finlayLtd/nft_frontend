<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRoute } from "vue-router";
import NftmxButton from "@/core/components/basic/NftmxButton.vue";
import { useStore } from "vuex";
import {
  keyCodeNumberRange,
  formatAMPM,
  getChainKey,
  shortenAddress,
} from "@/core/utils/common";
import NftmxHashtag from "@/core/components/basic/NftmxHashtag.vue";
import NftmxDivider from "@/core/components/basic/NftmxDivider.vue";
import marketService from "@/core/services/market.service";
import { useToast } from "vue-toastification";
import { $vfm } from "vue-final-modal";
import NftmxTooltip from "@/core/components/basic/NftmxTooltip.vue";
import {
  BSC_TESTNET_MARKET_ORDER_CONTRACT_ADDRESS,
  BSC_TESTNET_PACKABLE_CONTRACT_ADDRESS,
  BSC_TESTNET_MLR_ORDER_FACTORY_CONTRACT_ADDRESS,
  ChainIcons,
  MainToken,
  saleType,
} from "@/core/config/constant";
import NftmxImg from "@/core/components/basic/NftmxImg.vue";
import CardCarousel from "@/core/components/carousel/CardCarousel.vue";
import NftmxRadio from "@/core/components/basic/NftmxRadio.vue";
import {
  isApprovedForAll,
  setApprovalForAll,
} from "@/core/utils/contracts/erc721.utils.js";
import { createMLR } from "@/core/utils/contracts/mlr-factory.utils.js";
import { createMlrOrder } from "@/core/utils/contracts/mlr.utils.js";
import { createOrder } from "@/core/utils/contracts/market.utils.js";
import DatePicker from "@/core/components/v-calendar/src/components/DatePicker/DatePicker.vue";
import BasicCheckbox from "@/core/components/basic/BasicCheckbox.vue";
import useDebouncedRef from "@/core/utils/hook/useDebouncedRef.js";
import NftmxInput from "@/core/components/basic/NftmxInput.vue";
import Web3 from "web3/dist/web3.min.js";

const props = defineProps({
  asset: {
    type: Object,
    default: {},
  },
});

const emit = defineEmits(["update-asset"]);

const store = useStore();
const account = computed(() => store.state.wallet.account);
const chainId = computed(() => store.state.wallet.chainId);
const computedAsset = computed(() => props.asset);
const route = useRoute();
const chain = route.params.chain;
const chainKey = getChainKey(chain);
const tokenAddress = route.params.tokenAddress.toLowerCase();
const tokenId = route.params.tokenId;
const askingPrice = ref();
const slippage = ref();
const sale = ref(saleType.FIX_SALE);
const openEndSaleTimePicker = ref(false);
const openStartSaleTimePicker = ref(false);
const startTimePicker = ref(new Date());
const endTimePicker = ref(
  new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    new Date().getDate(),
    new Date().getHours(),
    new Date().getMinutes()
  )
);
const startTime = computed(() => {
  if (startTimePicker.value) {
    return (
      startTimePicker.value.toLocaleString("default", { month: "long" }) +
      " " +
      startTimePicker.value.getDate() +
      ", " +
      startTimePicker.value.getFullYear() +
      " " +
      formatAMPM(startTimePicker.value) +
      " UTC"
    );
  } else {
    return "Choose date and time";
  }
});
const endTime = computed(() => {
  if (endTimePicker.value) {
    return (
      endTimePicker.value.toLocaleString("default", { month: "long" }) +
      " " +
      endTimePicker.value.getDate() +
      ", " +
      endTimePicker.value.getFullYear() +
      " " +
      formatAMPM(endTimePicker.value) +
      " UTC"
    );
  } else {
    return "Choose date and time";
  }
});
const toast = useToast();
const waiting = ref(false);
const warn = ref(false);
const period = ref();
const tokenImage = computed(() => {
  if (props.asset.nfts) {
    return props.asset.nfts.map((nft) => nft.imageUrl);
  } else {
    return [];
  }
});
const royalty = ref(false);
const ownershipToKeep = ref();
const buyoutPrice = ref();
const maxRoyaltyOwners = ref(100);
const approvedStatusToMarket = ref(false);
const approvedStatusToMlr = ref(false);
const loading = ref(false);
const staking = ref(false);
const deploySyndication = ref(false);
const hashtag = useDebouncedRef("", 1000);
const hashtags = ref([]);
const selectedHashtags = ref([]);
const hashtagSection = ref(false);

const createNewMarketOrder = async () => {
  if (
    !askingPrice.value ||
    isNaN(slippage.value) ||
    isNaN(period.value) ||
    (sale.value === saleType.AUCTION && !endTimePicker.value)
  ) {
    warn.value = true;
    toast.error("Please fill out the fields");
    loading.value = false;
    return;
  }
  createHashTags();

  if (props.asset.mlrContract) {
    const data = [
      Web3.utils.toWei("0", "ether"),
      1,
      Web3.utils.toWei(askingPrice.value.toString()),
      (100 - slippage.value) * 100,
      false,
      period.value * 86400, // convert day into sec
      slippage.value * 100,
      sale.value === saleType.AUCTION,
      startTimePicker.value
        ? (startTimePicker.value.getTime() / 1000).toFixed()
        : "0",
      endTimePicker.value
        ? (endTimePicker.value.getTime() / 1000).toFixed()
        : "0",
    ];
    emit("update-asset", deploySyndication.value);
    createMlrOrder(props.asset.mlrContract.address, data)
      .then((res) => {
        toast.success("Your item has been listed!");
        cancel();
      })
      .catch((err) => {
        if (err.code === 4001) {
          toast.error("User denied transaction signature.");
        } else {
          toast.error("Something went wrong.");
        }
      })
      .finally(() => {
        loading.value = false;
      });
  } else {
    const data = [
      tokenAddress,
      tokenId,
      Web3.utils.toWei(askingPrice.value.toString()),
      staking.value,
      (100 - slippage.value) * 100,
      false,
      period.value * 86400, // convert day into sec
      slippage.value * 100,
      sale.value === saleType.AUCTION,
      startTimePicker.value
        ? (startTimePicker.value.getTime() / 1000).toFixed()
        : "0",
      endTimePicker.value
        ? (endTimePicker.value.getTime() / 1000).toFixed()
        : "0",
    ];
    emit("update-asset", deploySyndication.value);
    createOrder([data])
      .then((res) => {
        toast.success("Your item has been listed!");
        cancel();
      })
      .catch((err) => {
        console.log("=============should be====err=======", err);
        if (err.code === 4001) {
          toast.error("User denied transaction signature.");
        } else {
          toast.error("Something went wrong.");
        }
      })
      .finally(() => {
        loading.value = false;
      });
  }
};
const createNewMlrOrder = async () => {
  if (
    !askingPrice.value ||
    isNaN(slippage.value) ||
    isNaN(period.value) ||
    !ownershipToKeep.value ||
    !buyoutPrice.value ||
    (sale.value === saleType.AUCTION && !endTimePicker.value)
  ) {
    warn.value = true;
    toast.error("Please fill out the fields");
    loading.value = false;
    return;
  }
  if (props.asset.mlrContract) {
    const data = [
      Web3.utils.toWei(buyoutPrice.value.toString()),
      ownershipToKeep.value,
      Web3.utils.toWei(askingPrice.value.toString()),
      (100 - slippage.value) * 100,
      false,
      period.value * 86400, // convert day into sec
      slippage.value * 100,
      sale.value === saleType.AUCTION,
      startTimePicker.value
        ? (startTimePicker.value.getTime() / 1000).toFixed()
        : "0",
      endTimePicker.value
        ? (endTimePicker.value.getTime() / 1000).toFixed()
        : "0",
    ];
    emit("update-asset", deploySyndication.value);
    createMlrOrder(props.asset.mlrContract.address, data)
      .then((res) => {
        toast.success("Your item has been listed!");
        cancel();
      })
      .catch((err) => {
        if (err.code === 4001) {
          toast.error("User denied transaction signature.");
        } else {
          toast.error("Something went wrong.");
        }
      })
      .finally(() => {
        loading.value = false;
      });
  } else {
    emit("update-asset", deploySyndication.value);
    createMLR([
      [
        [
          tokenAddress,
          tokenId,
          maxRoyaltyOwners.value,
          props.asset.contract.name,
          props.asset.name,
          props.asset.contract.symbol,
          false,
        ],
        [
          Web3.utils.toWei(buyoutPrice.value.toString()),
          ownershipToKeep.value,
          Web3.utils.toWei(askingPrice.value.toString()),
          (100 - slippage.value) * 100,
          false,
          period.value * 86400, // convert day into sec
          slippage.value * 100,
          sale.value === saleType.AUCTION,
          startTimePicker.value
            ? (startTimePicker.value.getTime() / 1000).toFixed()
            : "0",
          endTimePicker.value
            ? (endTimePicker.value.getTime() / 1000).toFixed()
            : "0",
        ],
      ],
    ])
      .then((res) => {
        toast.success("Your item has been listed!");
        cancel();
      })
      .catch((err) => {
        console.log("err11111111111", err);
        if (err.code === 4001) {
          toast.error("User denied transaction signature.");
        } else {
          toast.error("Something went wrong.");
        }
      })
      .finally(() => {
        loading.value = false;
      });
  }
};
const createNewOrder = async () => {
  if (chain === "ETHEREUM") {
    toast.error("Ethereum network is not ready yet.");
    return;
  }
  try {
    loading.value = true;
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x61" }],
    });
    if (royalty.value) {
      createNewMlrOrder();
    } else {
      createNewMarketOrder();
    }
  } catch (err) {
    if (err.code === 4001) {
      toast.error("User denied transaction signature.");
    } else {
      toast.error("Something went wrong");
    }
    loading.value = false;
  }
};
const createHashTags = () => {
  if (selectedHashtags.value.length > 0) {
    marketService.createHashTags(
      chain,
      selectedHashtags.value,
      tokenAddress,
      tokenId
    );
  }
};
const deselectHashtag = (value) => {
  selectedHashtags.value = selectedHashtags.value.filter(
    (name) => name !== value
  );
  hashtags.value.push(value);
};
const cancel = () => {
  $vfm.hide("sellModal");
};
const clickOutsideStartTimePicker = () => {
  openStartSaleTimePicker.value = false;
};
const clickOutsideEndTimePicker = () => {
  openEndSaleTimePicker.value = false;
};
const approve = async () => {
  if (chain === "ETHEREUM") {
    toast.error("Ethereum network is not ready yet.");
    return;
  }

  try {
    loading.value = true;
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x61" }],
    });

    if (royalty.value) {
      setApprovalForAll(
        tokenAddress,
        BSC_TESTNET_MLR_ORDER_FACTORY_CONTRACT_ADDRESS,
        true
      )
        .then((res) => {
          approvedStatusToMlr.value = true;
          toast.success("NFT is approved successfully.");
        })
        .catch((err) => {
          if (err.code === 4001) {
            toast.error("User denied transaction signature.");
          } else {
            toast.error("Something went wrong");
          }
        })
        .finally(() => {
          loading.value = false;
        });
    } else {
      setApprovalForAll(
        tokenAddress,
        BSC_TESTNET_MARKET_ORDER_CONTRACT_ADDRESS,
        true
      )
        .then((res) => {
          approvedStatusToMarket.value = true;
          toast.success("NFT is approved successfully.");
        })
        .catch((err) => {
          if (err.code === 4001) {
            toast.error("User denied transaction signature.");
          } else {
            toast.error("Something went wrong");
          }
        })
        .finally(() => {
          loading.value = false;
        });
    }
    getApprovedStatus();
  } catch (err) {
    if (err.code === 4001) {
      toast.error("User denied transaction signature.");
    } else {
      toast.error("Something went wrong");
    }
    loading.value = false;
  }
};
const getApprovedStatus = async () => {
  if (chainId.value !== "0x61") return;
  approvedStatusToMlr.value = await isApprovedForAll(
    tokenAddress,
    account.value,
    BSC_TESTNET_MLR_ORDER_FACTORY_CONTRACT_ADDRESS
  );
  approvedStatusToMarket.value = await isApprovedForAll(
    tokenAddress,
    account.value,
    BSC_TESTNET_MARKET_ORDER_CONTRACT_ADDRESS
  );
};
const getHashtags = () => {
  marketService
    .getHashtagNames(hashtag.value, 20, tokenAddress, tokenId)
    .then((res) => {
      hashtags.value = res.data
        .filter((item) => selectedHashtags.value.indexOf(item.name) === -1)
        .map((item) => item.name);
    });
};
const selectHashtag = (item) => {
  const index = hashtags.value.findIndex((i) => i === item);
  hashtags.value.splice(index, 1);
  if (selectedHashtags.value.indexOf(item) === -1) {
    selectedHashtags.value.push(item);
  }
};
const enterKeyDown = (evt) => {
  if (hashtag.value) {
    selectHashtag(hashtag.value);
  }
};
watch(hashtag, () => {
  getHashtags();
});
onMounted(() => {
  getHashtags();
  getApprovedStatus();
});
watch(chainId, (val) => {
  getApprovedStatus();
});
watch(account, (val) => {
  getApprovedStatus();
});
watch(computedAsset, (data) => {
  selectedHashtags.value = data.hashtags ? [...data.hashtags] : [];
  hashtags.value = hashtags.value.filter(
    (item) => selectedHashtags.value.indexOf(item) === -1
  );
});
</script>

<template>
  <vue-final-modal
    classes="w-full flex justify-center overflow-y-auto"
    content-class="my-4 lg:my-auto mx-4 h-fit"
    :overlay-style="{ backgroundColor: 'black', opacity: '0.9' }"
    name="sellModal"
    esc-to-close
    fit-parent
  >
    <div class="bg-tertiary-900 text-white xl:w-modal-md 3xl:w-modal-big">
      <div class="text-right text-xl p-5">
        <font-awesome-icon
          :icon="['fas', 'times']"
          class="cursor-pointer hover:text-tertiary-400 transition"
          @click="cancel"
        />
      </div>
      <div class="text-center relative mt-1.75 pb-2.5">
        <div class="font-press text-2xl mx-6">List Item for Sale</div>
      </div>
      <div class="grid grid-cols-8 text-white py-9 px-4 lg:pl-17.5 lg:pr-17">
        <div class="col-span-full lg:col-span-3 lg:-mr-3.5 3xl:pr-2.25">
          <div
            v-if="
              asset.contract.address !== BSC_TESTNET_PACKABLE_CONTRACT_ADDRESS
            "
            class="relative overflow-hidden p-6 border border-black w-full pt-70per"
          >
            <nftmx-img
              :src="asset.imageUrl"
              class="w-full h-full absolute object-cover left-0 top-0 bg-black text-6xl"
            />
          </div>
          <div
            v-if="
              asset.contract.address === BSC_TESTNET_PACKABLE_CONTRACT_ADDRESS
            "
            class="relative overflow-hidden border border-black w-full pt-70per"
          >
            <div class="absolute top-0 left-0 w-full h-full bg-black text-6xl">
              <card-carousel small :images="tokenImage" />
            </div>
          </div>
          <div class="flex w-full text-sm font-ibm-bold mt-7">
            <div class="pt-0.75">
              <div class="text-primary-900">
                {{ asset?.contract?.name || "No name" }}
              </div>
              <div class="text-2xl mt-1.5">
                {{ asset.name || "#" + asset.tokenId }}
              </div>
            </div>
            <div class="grow"></div>
            <div class="py-0.5">
              <div>Last Value</div>
              <div
                class="text-sm font-ibm-light flex items-center justify-end mt-3"
              >
                <img v-lazy="ChainIcons[chainKey]" class="w-4 h-4 mr-2.5" />
                0
              </div>
            </div>
          </div>
          <div class="text-11 mt-10.25">
            <div class="flex justify-between">
              <span>Creator:</span>
              <nftmx-img
                :src="asset?.creator?.profile_img"
                class="w-12 h-12 bg-black"
              />
            </div>
            <div class="flex justify-between mt-6.5">
              <span>Creator name:</span>
              <span>
                <span class="text-tertiary-400">
                  {{ asset?.creator?.name || "Unnamed" }}
                </span>
                <span class="text-tertiary-600"> | </span>
                <a
                  v-if="asset?.creator"
                  target="_blank"
                  :href="'/account/' + asset?.creator.walletAddress"
                  class="text-primary-900"
                >
                  {{ shortenAddress(asset?.creator.walletAddress) }}
                </a>
              </span>
            </div>
            <div class="flex justify-between mt-2.5">
              <span>Collection name:</span>
              <a
                v-if="asset?.contract"
                target="_blank"
                :href="`/collection/${chain}/${asset?.contract.address}`"
                class="text-primary-900"
              >
                {{
                  asset?.contract.name ||
                  shortenAddress(asset?.contract.address)
                }}
              </a>
            </div>
            <div class="flex justify-between mt-2.5">
              <span>Contract Address:</span>
              <a
                v-if="asset?.contract"
                target="_blank"
                :href="`/collection/${chain}/${asset?.contract.address}`"
                class="text-primary-900"
              >
                {{ shortenAddress(asset?.contract.address) }}
              </a>
            </div>
            <div class="flex justify-between mt-2.5">
              <span>Token ID:</span>
              <span class="text-tertiary-400">
                {{ asset?.tokenId }}
              </span>
            </div>
            <div class="flex justify-between mt-2.5">
              <span>Token Standard:</span>
              <span class="text-tertiary-400">
                {{ asset?.contract?.schema === "ERC721" ? "ERC-721" : "" }}
              </span>
            </div>
            <div class="flex justify-between mt-2.5">
              <span>Chain:</span>
              <span class="text-tertiary-400">
                {{
                  asset?.contract?.chain === "EHTEREUM"
                    ? "Ethereum"
                    : "BSC-Testnet"
                }}
              </span>
            </div>
            <div class="flex justify-between mt-2.5">
              <span>Rarity:</span>
              <span class="text-tertiary-400">
                1:{{ asset?.contract?.items }}
              </span>
            </div>
            <div class="mt-2.5">About the collection:</div>
            <div class="text-tertiary-500 mt-3">
              {{ asset?.description }}
            </div>
            <div class="mt-4">Hashtags #</div>
            <div
              v-if="asset?.hashtags"
              class="text-tertiary-500 mt-3.5 w-full flex flex-wrap gap-2.5"
            >
              <div
                v-for="(item, index) in asset?.hashtags"
                :key="index"
                class="px-2 pt-0.5 pb-px bg-tertiary-700"
              >
                #{{ item }}
              </div>
            </div>
          </div>
        </div>
        <div
          class="col-span-full lg:col-span-5 relative text-lg font-ibm-medium mr-0.5 lg:pl-10.25 3xl:pl-9 ml-px mt-5 lg:mt-0"
        >
          <div
            class="grid grid-cols-2 gap-4 items-center w-full justify-between font-ibm text-13"
          >
            <div
              @click="royalty = false"
              class="flex gap-3 items-center w-fit cursor-pointer"
            >
              <nftmx-radio :active="!royalty" />
              <div class="flex flex-1">
                <span>Sell 100% of your ownership</span>
                <nftmx-tooltip text="Sell 100% of your ownership">
                  <sup>
                    <font-awesome-icon
                      :icon="['fas', 'question-circle']"
                      class="ml-1 text-10"
                    />
                  </sup>
                </nftmx-tooltip>
              </div>
            </div>
            <div
              @click="royalty = true"
              class="flex gap-3 items-center w-fit cursor-pointer"
            >
              <nftmx-radio :active="royalty" />
              <div class="flex flex-1">
                <span>Retain a percentage of ownership</span>
                <nftmx-tooltip text="Retain a percentage of ownership">
                  <sup>
                    <font-awesome-icon
                      :icon="['fas', 'question-circle']"
                      class="ml-1 text-10 cursor-pointer"
                    />
                  </sup>
                </nftmx-tooltip>
              </div>
            </div>
          </div>
          <div class="border-t border-primary-900 mt-6 mb-6" />
          <div class="flex">
            Type of sale
            <nftmx-tooltip
              text="The NFT.Protection marketplace supports fixed sale and auction capabilities. Both options have the ability to add liquidity protection and DAO syndication."
            >
              <sup>
                <font-awesome-icon
                  :icon="['fas', 'question-circle']"
                  class="ml-1 text-10 cursor-pointer"
                />
              </sup>
            </nftmx-tooltip>
          </div>
          <div class="flex my-3">
            <nftmx-button
              outline
              color="primary-900"
              label="FIXED SALE"
              :class="[
                sale === saleType.FIX_SALE ? 'bg-tertiary-700' : '',
                'font-ibm-medium text-sm pt-3.5 pb-4 border-2 border-black w-1/2 hover:bg-tertiary-700 text-primary-900 tracking-wide',
              ]"
              @click="sale = saleType.FIX_SALE"
            />
            <nftmx-button
              outline
              color="primary-900"
              label="AUCTION"
              :class="[
                sale === saleType.AUCTION ? 'bg-tertiary-700' : '',
                'font-ibm-medium text-sm pt-3.5 pb-4 border-2 border-black border-l-0 w-1/2 text-primary-900 hover:bg-tertiary-700 tracking-wide',
              ]"
              @click="sale = saleType.AUCTION"
            />
          </div>
          <div>
            <div class="grid sm:grid-cols-2 gap-6 mt-8 relative">
              <div>
                <div v-if="sale === saleType.FIX_SALE">Asking price</div>
                <div v-if="sale === saleType.AUCTION" class="flex">
                  Soft cap
                  <nftmx-tooltip
                    text="Soft cap is the minimum amount the Auction must reach in order for the sale to take place"
                  >
                    <sup>
                      <font-awesome-icon
                        :icon="['fas', 'question-circle']"
                        class="ml-1 text-10 cursor-pointer"
                      />
                    </sup>
                  </nftmx-tooltip>
                </div>
                <div
                  :class="[
                    warn && !askingPrice ? 'border-red-800' : 'border-black',
                    'flex mt-3.5 font-ibm text-sm border-2 bg-tertiary-700',
                  ]"
                >
                  <div
                    class="w-12.5 h-12.5 flex items-center justify-center text-lg gap-4 bg-black"
                  >
                    <div
                      v-if="chain === 'BSC-TESTNET'"
                      class="text-xs w-4 h-4 text-primary-900"
                    >
                      <svg viewBox="0 0 24 24">
                        <path
                          class="fill-white"
                          d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                        />
                      </svg>
                    </div>
                    <font-awesome-icon
                      v-if="chain === 'ETHEREUM'"
                      :icon="['fab', 'ethereum']"
                    />
                  </div>
                  <nftmx-input
                    v-model="askingPrice"
                    number
                    border="none"
                    :min="0"
                    placeholder="Type Amount"
                    class="flex-1"
                  />
                </div>
              </div>
              <div v-if="sale === saleType.FIX_SALE" class="relative">
                <div>
                  <div>Payment method</div>
                  <div
                    class="flex items-center justify-center h-12.5 mt-3.5 font-ibm text-sm gap-5"
                  >
                    <div v-if="chain === 'BSC-TESTNET'" class="w-8 h-8">
                      <svg
                        role="img"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <title>Binance</title>
                        <path
                          class="fill-tertiary-400"
                          d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                        />
                      </svg>
                    </div>
                    <font-awesome-icon
                      v-if="chain === 'ETHEREUM'"
                      :icon="['fab', 'ethereum']"
                      class="text-4xl text-tertiary-400"
                    />
                    {{ MainToken[chainKey] }}
                  </div>
                </div>
              </div>
              <div v-if="sale === saleType.FIX_SALE" class="relative">
                <div>
                  <div>Start sale</div>
                  <div
                    @click="openStartSaleTimePicker = !openStartSaleTimePicker"
                    class="flex mt-3.5 font-ibm text-sm cursor-pointer"
                  >
                    <div
                      :class="[
                        warn && !startTimePicker
                          ? 'border-red-800'
                          : 'border-black',
                        'flex items-center gap-5 border-2 h-13.5 text-white bg-tertiary-700 w-full pl-5 font-ibm-light text-sm',
                      ]"
                    >
                      <font-awesome-icon
                        :icon="['fas', 'calendar-alt']"
                        class="text-lg ml-0.75 mr-0.5"
                      />
                      {{ startTime }}
                    </div>
                  </div>
                </div>
                <div class="absolute w-full z-30">
                  <date-picker
                    v-if="openStartSaleTimePicker"
                    v-click-outside="clickOutsideStartTimePicker"
                    mode="dateTime"
                    v-model="startTimePicker"
                    :min-date="
                      new Date(
                        new Date().getFullYear(),
                        new Date().getMonth(),
                        new Date().getDate()
                      )
                    "
                    color="red"
                    is-dark
                    is-expanded
                  />
                </div>
              </div>
              <div class="relative">
                <div>
                  <div>
                    {{
                      sale === saleType.AUCTION ? "End auction in" : "End sale"
                    }}
                  </div>
                  <div
                    @click="openEndSaleTimePicker = !openEndSaleTimePicker"
                    class="flex mt-3.5 font-ibm text-sm cursor-pointer"
                  >
                    <div
                      :class="[
                        warn && !endTimePicker
                          ? 'border-red-800'
                          : 'border-black',
                        'flex items-center gap-5 border-2 h-13.5 text-white bg-tertiary-700 w-full pl-5 font-ibm-light text-sm',
                      ]"
                    >
                      <font-awesome-icon
                        :icon="['fas', 'calendar-alt']"
                        class="text-lg ml-0.75 mr-0.5"
                      />
                      {{ endTime }}
                    </div>
                  </div>
                </div>
                <div class="absolute w-full z-30">
                  <date-picker
                    v-if="openEndSaleTimePicker"
                    v-click-outside="clickOutsideEndTimePicker"
                    mode="dateTime"
                    v-model="endTimePicker"
                    :min-date="
                      new Date(
                        new Date().getFullYear(),
                        new Date().getMonth(),
                        new Date().getDate() + 1
                      )
                    "
                    color="red"
                    is-dark
                    is-expanded
                  />
                </div>
              </div>
            </div>
          </div>
          <div v-if="royalty" class="border-t border-primary-900 mt-6 mb-6" />
          <div v-if="royalty" class="grid 3xl:grid-cols-2 gap-5.75">
            <div>
              <div class="flex">
                My ownership to keep
                <nftmx-tooltip
                  text="Benefit from APY returns when utilizing Liquidity Protection to sell a NFT property. You earn APY on the amount of purchase price once the buyer purchases the NFT for the entire protection period."
                >
                  <sup>
                    <font-awesome-icon
                      :icon="['fas', 'question-circle']"
                      class="ml-1 text-10 cursor-pointer"
                    />
                  </sup>
                </nftmx-tooltip>
              </div>
              <div
                :class="[
                  warn && !ownershipToKeep ? 'border-red-800' : 'border-black',
                  'flex mt-3.5 mb-4 font-ibm text-sm border-2 bg-tertiary-700',
                ]"
              >
                <nftmx-input
                  v-model="ownershipToKeep"
                  number
                  border="none"
                  :min="0"
                  :max="100"
                  placeholder="0"
                />
                <div
                  class="w-14 h-12.5 px-4 bg-black flex items-center justify-center"
                >
                  %
                </div>
              </div>
            </div>
            <div>
              <div class="flex">
                Buyout asking price
                <nftmx-tooltip
                  text="Selecting this option allows DAOs to join the syndication contract and purchase the NFT."
                >
                  <sup>
                    <font-awesome-icon
                      :icon="['fas', 'question-circle']"
                      class="ml-1 text-10 cursor-pointer"
                    />
                  </sup>
                </nftmx-tooltip>
              </div>
              <div
                :class="[
                  warn && !buyoutPrice ? 'border-red-800' : 'border-black',
                  'flex mt-3.5 mb-4 font-ibm text-sm border-2 bg-tertiary-700',
                ]"
              >
                <div
                  class="w-14 h-12.5 px-4 bg-black flex items-center justify-center"
                >
                  <nftmx-img :src="ChainIcons[chainKey]" />
                </div>
                <nftmx-input
                  v-model="buyoutPrice"
                  number
                  border="none"
                  :min="0"
                  placeholder="0"
                />
              </div>
            </div>
          </div>
          <div class="border-t border-primary-900 mt-6 mb-6" />
          <div class="grid 3xl:grid-cols-3 gap-5.75">
            <div>
              <div class="flex">
                Protection period
                <nftmx-tooltip
                  text="Choosing this option will allow you to act as a seller and a market maker. By adhering to the buyer protection period, such as a refund policy, you can increase your sales conversion rate and generate extra income from slippage fees"
                >
                  <sup>
                    <font-awesome-icon
                      :icon="['fas', 'question-circle']"
                      class="ml-1 text-10 cursor-pointer"
                    />
                  </sup>
                </nftmx-tooltip>
              </div>
              <div
                :class="[
                  warn && isNaN(period) ? 'border-red-800' : 'border-black',
                  'flex mt-3.5 mb-4 font-ibm text-sm border-2 bg-tertiary-700',
                ]"
              >
                <nftmx-input
                  v-model="period"
                  number
                  border="none"
                  :min="0"
                  placeholder="0"
                />
                <div
                  class="w-30 h-12.5 px-4 bg-black flex items-center justify-center"
                >
                  DAYS
                </div>
              </div>
            </div>
            <div>
              <div>
                Slippage fee
                <nftmx-tooltip
                  text="As a market maker, you can choose your own slippage fee in case the buyer cancels the purchase during the protection period"
                >
                  <sup>
                    <font-awesome-icon
                      :icon="['fas', 'question-circle']"
                      class="text-10 cursor-pointer"
                    />
                  </sup>
                </nftmx-tooltip>
              </div>
              <div
                :class="[
                  warn && isNaN(slippage) ? 'border-red-800' : 'border-black',
                  'flex mt-3.5 mb-4 font-ibm text-sm border-2 bg-tertiary-700',
                ]"
              >
                <nftmx-input
                  v-model="slippage"
                  number
                  border="none"
                  :min="0"
                  :max="100"
                  placeholder="0"
                />
                <div
                  class="w-14 h-12.5 px-4 bg-black flex items-center justify-center"
                >
                  %
                </div>
              </div>
            </div>
            <div>
              <div class="flex">
                Leveraging staking
                <nftmx-tooltip
                  text="Choosing this option will allow you to generate extra APY by leveraging the purchasing funds during the liquidity protection period via a 3rd party staking protocol, such as Compound, Earnest Finance, Venus, etc. You can use this option instead of slippage or combine it with slippage"
                >
                  <sup>
                    <font-awesome-icon
                      :icon="['fas', 'question-circle']"
                      class="ml-1 text-10 cursor-pointer"
                    />
                  </sup>
                </nftmx-tooltip>
              </div>
              <div
                class="grid grid-cols-2 items-center h-12.5 mt-3.5 mb-4 font-ibm text-sm"
              >
                <div
                  @click="staking = true"
                  class="flex items-center gap-2 w-fit cursor-pointer"
                >
                  <nftmx-radio :active="staking" />
                  <span class="px-2">Yes</span>
                </div>
                <div
                  @click="staking = false"
                  class="flex items-center gap-2 w-fit cursor-pointer"
                >
                  <nftmx-radio :active="!staking" />
                  <span class="px-2">No</span>
                </div>
              </div>
            </div>
          </div>
          <div class="border-t border-primary-900 mt-3 mb-6" />
          <div class="flex">Add hashtags</div>
          <div class="relative h-12.5 mt-3.5 mb-4 z-20">
            <div
              v-click-outside="
                () => {
                  hashtagSection = false;
                }
              "
              class="font-ibm text-13 border-2 border-black absolute w-full"
            >
              <div class="flex">
                <div class="absolute p-4 text-tertiary-400">#</div>
                <input
                  v-model="hashtag"
                  class="focus:outline-none h-12.5 text-white placeholder-tertiary-500 bg-tertiary-700 w-full pl-8 pr-6 font-ibm text-sm"
                  @focus="hashtagSection = true"
                  @keydown.enter="enterKeyDown"
                />
              </div>
              <div
                v-if="hashtagSection"
                class="bg-tertiary-700 px-4 max-h-40 overflow-auto"
              >
                <div
                  v-for="(item, index) in hashtags"
                  :key="index"
                  @click="selectHashtag(item)"
                  class="py-2 parent cursor-pointer"
                >
                  <span class="text-tertiary-400 child"> # </span>
                  <span class="child"> {{ item }} </span>
                </div>
              </div>
            </div>
          </div>
          <div class="flex flex-wrap gap-3">
            <nftmx-hashtag
              v-for="(name, index) in selectedHashtags"
              :key="index"
              :value="name"
              @click="deselectHashtag(name)"
            />
          </div>
          <nftmx-divider class="mt-6 mb-6" />
          <div class="flex pt-0.75">Fees</div>
          <div class="mt-4">
            <div class="flex py-1 text-xs font-ibm-medium text-tertiary-500">
              <div>Service Fee</div>
              <div class="grow"></div>
              <div>2.5%</div>
            </div>
            <div class="text-11 font-ibm text-primary-900">
              * 100% gas and fee reinbursement with NFTPX tokens <br />
              ** Buyer will pay this fee if transaction canceled during the
              protection period
            </div>
          </div>
          <nftmx-divider class="mt-4 mb-6" />
          <div class="text-sm flex items-center">
            <basic-checkbox
              small
              color="primary"
              bgColor="bg-tertiary-700"
              class="w-8.5 h-5"
              @check="deploySyndication = true"
            >
              <span
                class="flex pt-0.5 text-tertiary-400 text-11 tracking-wider relative pl-8.25 w-max"
              >
                Deploy syndication contract to boost your sale
                <nftmx-tooltip
                  text="Selecting this option allows group of investors to join together to the syndication contract and purchase the NFT."
                >
                  <sup>
                    <font-awesome-icon
                      :icon="['fas', 'question-circle']"
                      class="ml-1 text-10 cursor-pointer"
                    />
                  </sup>
                </nftmx-tooltip>
              </span>
            </basic-checkbox>
          </div>
          <div class="w-full mt-9 pt-0.5 pb-2.5 mb-17">
            <nftmx-button
              v-if="
                (royalty && !approvedStatusToMlr) ||
                (!royalty && !approvedStatusToMarket)
              "
              color="black"
              :label="loading ? 'APPROVING' : 'APPROVE'"
              outline
              :class="[
                waiting ? 'cursor-wait' : '',
                'w-full font-press text-base lg:text-lg',
              ]"
              h="xl2"
              @click="approve()"
              :loading="loading"
            />
            <nftmx-button
              v-else
              color="primary"
              outline
              label="COMPLETE LISTING"
              :class="[
                waiting ? 'cursor-wait' : '',
                'w-full font-press text-base lg:text-lg',
              ]"
              h="xl2"
              @click="createNewOrder()"
              :loading="loading"
            />
          </div>
        </div>
      </div>
    </div>
  </vue-final-modal>
</template>

<style scoped>
.parent:hover .child {
  color: #19cb58;
}
</style>

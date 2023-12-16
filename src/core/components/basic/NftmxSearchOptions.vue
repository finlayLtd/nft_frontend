<script setup>
import { computed, onMounted, ref, watch } from "vue";
import SearchAccordion from "@/core/components/accordion/SearchAccordion.vue";
import StatusButton from "@/core/components/basic/StatusButton.vue";
import SearchDropdown from "@/core/components/dropdown/SearchDropdown.vue";
import NftmxInput from "@/core/components/basic/NftmxInput.vue";
import FilterItem from "@/core/components/basic/FilterItem.vue";
import useDebouncedRef from "@/core/utils/hook/useDebouncedRef.js";
import marketService from "@/core/services/market.service";
import {
  ChainNames,
  sortBy,
  CHAIN_ROUTES,
  themeConfig,
} from "@/core/config/constant";
import NftmxImg from "@/core/components/basic/NftmxImg.vue";
import { useStore } from "vuex";
import Accordion from "@/core/components/accordion/Accordion.vue";
import NftmxRadio from "@/core/components/basic/NftmxRadio.vue";
import BasicAccordion from "@/core/components/accordion/BasicAccordion.vue";
import { getChainKey } from "../../utils/common";

const props = defineProps({
  type: { type: String, default: "" },
  filterOption: Object,
  viewOption: String,
  isCartOpened: Boolean,
});

const emit = defineEmits(["apply-filter", "show-cart", "change-view"]);

const store = useStore();
const chainId = computed(() => store.state.wallet.chainId);
const windowWidth = computed(() => store.state.app.windowWidth);
const searchText = useDebouncedRef("", 1000);
const collectionName = useDebouncedRef("", 1000);
const collections = ref([]);
const filteredCollections = ref([]);
const minPrice = useDebouncedRef("", 1000);
const maxPrice = useDebouncedRef("", 1000);
const minSlippage = useDebouncedRef("", 1000);
const maxSlippage = useDebouncedRef("", 1000);
const hashtagName = useDebouncedRef("", 1000);
const hashtags = ref([]);
const filteredHashtags = ref([]);
const openFilter = ref(false);
const chainDropdown = ref(false);
const searchResult = ref({ items: [], collections: [], accounts: [] });
const focusSearch = ref(false);

const addToNetwork = async (chainKey) => {
  try {
    if (window.ethereum) {
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
    } else {
      throw new Error("No Ethereum Wallet");
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};
const onClickOutside = () => {
  chainDropdown.value = false;
};
const filterByStatus = (status) => {
  const option = JSON.parse(JSON.stringify(props.filterOption));
  option[status] = !option[status];
  emit("apply-filter", option);
};
const filterByExclusive = (val) => {
  const option = { ...props.filterOption, exclusive: val };
  emit("apply-filter", option);
};
const addFilterByCollections = (index, collection) => {
  const option = JSON.parse(JSON.stringify(props.filterOption));
  collections.value.splice(index, 1);
  filteredCollections.value.push(collection);
  option.collection.push(collection.address);
  emit("apply-filter", option);
};
const removeFilterByCollections = (index, collection) => {
  const option = JSON.parse(JSON.stringify(props.filterOption));
  filteredCollections.value.splice(index, 1);
  collections.value.push(collection);
  const filterIndex = option.collection.indexOf(collection.address);
  option.collection.splice(filterIndex, 1);
  emit("apply-filter", option);
};
const addHashtag = (hashtag) => {
  const index = hashtags.value.findIndex((item) => item.id === hashtag.id);
  hashtags.value.splice(index, 1);
  hashtags.value = hashtags.value.concat(filteredHashtags.value);
  filteredHashtags.value = [hashtag];

  const tempOption = props.filterOption;
  const option = JSON.parse(JSON.stringify(tempOption));
  option.hashtag = hashtag.name;
  emit("apply-filter", option);
};
const removeHashtag = (hashtag) => {
  const index = filteredHashtags.value.findIndex(
    (item) => item.id === hashtag.id
  );
  filteredHashtags.value.splice(index, 1);
  hashtags.value.push(hashtag);

  const tempOption = props.filterOption;
  const option = JSON.parse(JSON.stringify(tempOption));
  option.hashtag = "";
  emit("apply-filter", option);
};
const filterByChain = (chain) => {
  if (props.filterOption.chain !== chain) {
    addToNetwork(getChainKey(chain));
    const option = JSON.parse(JSON.stringify(props.filterOption));
    option.chain = chain;
    collections.value = [];
    filteredCollections.value = [];
    option.collection = [];
    emit("apply-filter", option);
    getContracts(chain);
  }
};
const filterBySort = (sort) => {
  const option = JSON.parse(JSON.stringify(props.filterOption));
  option.sortBy === sort ? (option.sortBy = "") : (option.sortBy = sort);
  emit("apply-filter", option);
};
const getContracts = (chain, name) => {
  marketService
    .getContracts({
      chain,
      name,
      type: props.type === "DERIVATIVES" ? "DERIVATIVE" : "",
    })
    .then((res) => {
      collections.value = res.data.contracts;
    });
};
const getHashtags = () => {
  marketService.getHashtagNames(hashtagName.value, 20).then((res) => {
    hashtags.value = res.data;
  });
};
const onKeyDown = (evt) => {
  if (evt.keyCode === 13) {
    evt.preventDefault();
    return;
  }
};
const leverageStaking = (val) => {
  const tempOption = props.filterOption;
  const option = JSON.parse(JSON.stringify(tempOption));
  option.staking = val;
  emit("apply-filter", option);
};
watch(hashtagName, (value) => {
  getHashtags();
});
watch(collectionName, (value) => {
  getContracts(props.filterOption.chain, value);
});
watch(searchText, (value) => {
  const tempOption = props.filterOption;
  const option = JSON.parse(JSON.stringify(tempOption));
  option.name = value;
  emit("apply-filter", option);
});
watch(minPrice, (value) => {
  const tempOption = props.filterOption;
  const option = JSON.parse(JSON.stringify(tempOption));
  option.min = parseFloat(value);
  emit("apply-filter", option);
});
watch(maxPrice, (value) => {
  const tempOption = props.filterOption;
  const option = JSON.parse(JSON.stringify(tempOption));
  option.min = parseFloat(value);
  emit("apply-filter", option);
});
watch(minSlippage, (value) => {
  const tempOption = props.filterOption;
  const option = JSON.parse(JSON.stringify(tempOption));
  option.minSlippage = parseFloat(value);
  emit("apply-filter", option);
});
watch(maxSlippage, (value) => {
  const tempOption = props.filterOption;
  const option = JSON.parse(JSON.stringify(tempOption));
  option.maxSlippage = parseFloat(value);
  emit("apply-filter", option);
});
onMounted(() => {
  getHashtags();
  getContracts(props.filterOption.chain);
});
</script>

<template>
  <div class="bg-tertiary-800 py-5.25 px-4 sm:px-10 lg:px-22 text-white">
    <div
      class="flex flex-wrap flex-col xl:flex-row justify-between items-center"
    >
      <div class="flex flex-1 w-full min-w-max items-center">
        <div class="w-full flex justify-between items-center h-13">
          <div class="flex items-center w-full pr-4 relative">
            <div class="flex items-center w-full">
              <font-awesome-icon
                :icon="['fas', 'search']"
                class="text-white text-lg pointer-events-none"
              />
              <input
                v-if="windowWidth >= themeConfig.sm"
                class="text-sm text-white pl-6 py-2 font-ibm placeholder-tertiary-500 w-full border-0 focus:outline-none bg-tertiary-800"
                placeholder="Search items, collections, and accounts"
                v-model="searchText"
              />
              <textarea
                v-if="windowWidth < themeConfig.sm"
                @keydown="onKeyDown($event)"
                rows="2"
                class="text-sm leading-snug text-white pl-6 py-2 font-ibm-medium placeholder-tertiary-500 w-full border-0 outline-none focus:outline-none bg-tertiary-800 resize-none"
                placeholder="Search items, collections, and accounts"
                v-model="searchText"
              />
            </div>
            <font-awesome-icon
              @click="openFilter = !openFilter"
              :icon="['fas', 'filter']"
              :class="[
                openFilter ? 'text-primary-900' : 'text-white',
                'transition hover:text-primary-900 cursor-pointer text-lg',
              ]"
            />
            <div
              v-if="focusSearch"
              class="absolute top-16 w-full bg-tertiary-800 px-4 pb-10 z-30 text-sm"
            >
              <div class="flex justify-between py-3">
                <div>Trending collections 🔥</div>
                <div class="text-xs text-tertiary-400">24H change %</div>
              </div>
              <div class="border-t border-black mt-1 mb-2" />
              <div
                v-for="(collection, index) in collections"
                :key="index"
                @click="addFilterByCollections(index, collection)"
              >
                <div
                  v-if="
                    filteredCollections.findIndex(
                      (item) => item.address === collection.address
                    ) < 0
                  "
                  class="flex items-center gap-3.5 font-ibm text-11 py-1.75 cursor-pointer transition text-white hover:text-primary-900"
                >
                  <div class="w-6 h-6 flex-none">
                    <nftmx-img
                      :src="collection.imageUrl"
                      class="object-cover w-full h-full bg-black"
                    />
                  </div>
                  <div class="leading-3">
                    {{ collection.name }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            class="h-7.5 border-l border-l-black border-r border-r-tertiary-700"
          />
          <div class="relative h-8 w-64 z-10">
            <div class="absolute w-full" v-click-outside="onClickOutside">
              <basic-accordion
                mIcon
                :border="false"
                v-model="chainDropdown"
                @handle-click="
                  () => {
                    chainDropdown = !chainDropdown;
                  }
                "
                handleEmit
              >
                <template v-slot:caption>
                  <div class="flex items-center font-ibm text-sm h-full">
                    {{
                      filterOption.chain === "ETHEREUM"
                        ? "Ethereum"
                        : filterOption.chain === "BSC-TESTNET"
                        ? "BSC Testnet"
                        : "Select Chain"
                    }}
                  </div>
                </template>
                <div class="text-sm bg-tertiary-800">
                  <div
                    @click="
                      () => {
                        chainDropdown = false;
                        filterByChain('ETHEREUM');
                      }
                    "
                    class="font-ibm px-5 py-1 text-white transition hover:text-primary-900 cursor-pointer"
                  >
                    <font-awesome-icon :icon="['fab', 'ethereum']" />
                    Ethereum
                  </div>
                  <div
                    @click="
                      () => {
                        chainDropdown = false;
                        filterByChain('BSC-TESTNET');
                      }
                    "
                    class="flex gap-1 items-center font-ibm px-5 pt-1 pb-2 text-white transition hover:text-primary-900 cursor-pointer"
                  >
                    <div class="text-xs w-3.5 h-3.5 text-primary-900">
                      <svg viewBox="0 0 24 24">
                        <path
                          class="fill-white"
                          d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                        />
                      </svg>
                    </div>
                    BSC Testnet
                  </div>
                </div>
              </basic-accordion>
            </div>
          </div>
          <div
            class="h-7.5 border-l border-l-black border-r border-r-tertiary-700"
          />
          <font-awesome-icon
            v-if="type"
            :icon="['fas', 'square']"
            :class="[
              viewOption === 'TILE' ? 'text-primary-900' : 'text-white',
              'transition hover:text-primary-900 cursor-pointer text-lg ml-4',
            ]"
            @click="emit('change-view', 'TILE')"
          />
          <font-awesome-icon
            v-if="type"
            :icon="['fas', 'th-list']"
            :class="[
              viewOption === 'LIST' ? 'text-primary-900' : 'text-white',
              'transition hover:text-primary-900 cursor-pointer text-lg ml-4',
            ]"
            @click="emit('change-view', 'LIST')"
          />
          <div
            v-if="type"
            class="h-7.5 border-l border-l-black border-r border-r-tertiary-700 ml-4"
          />
          <div
            @click="emit('show-cart')"
            :class="[
              isCartOpened
                ? 'fill-primary-900'
                : 'fill-white hover:fill-primary-900',
              'flex transition cursor-pointer ml-4',
            ]"
          >
            <div class="w-5.5 h-5.5">
              <svg viewBox="0 0 64 64">
                <g>
                  <path
                    class="st0"
                    d="M62.95,13.89c0.27-1.27-0.53-2.51-1.8-2.79c-1.27-0.27-2.51,0.53-2.79,1.8l-4.81,22.34H20.72L13.64,5.71H2.41
		c-1.3,0-2.35,1.05-2.35,2.35s1.05,2.35,2.35,2.35h7.53l9.12,38.05h36.51c1.3,0,2.35-1.05,2.35-2.35s-1.05-2.35-2.35-2.35H22.76
		l-0.92-3.83h35.49L62.95,13.89z"
                  />
                  <circle class="st0" cx="26" cy="54.57" r="4.04" />
                  <circle class="st0" cx="48.41" cy="54.57" r="4.04" />
                  <polygon
                    class="st0"
                    points="50.1,18.37 41.24,18.37 41.24,5.71 37.07,5.71 32.9,5.71 32.9,18.37 24.04,18.37 37.07,30.46 	"
                  />
                </g>
              </svg>
            </div>
            <div class="relative text-white">
              <div
                class="absolute inline-flex items-center justify-center px-2 h-5.5 text-11 rounded-full -top-2 -left-2 shadow-default shadow-white bg-tertiary-900"
              >
                {{ store.state.market.cartItems.length }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <accordion :open="openFilter" class="overflow-hidden">
      <div
        class="grid sm:grid-cols-2 xl:grid-cols-4 3xl:grid-cols-6 gap-4 mt-5"
      >
        <div v-if="type !== 'COLLECTIONS' && type !== 'SUB_COLLECTIONS'">
          <div class="border border-black px-5 overflow-hidden">
            <search-accordion title="New Offering">
              <template v-slot:content>
                <div
                  class="grid grid-cols-2 pt-0.75 gap-2.5 text-11 leading-4 pb-6 h-17"
                >
                  <status-button
                    title="Initial Offering"
                    :active="filterOption.initial"
                    @click="filterByStatus('initial')"
                  />
                  <status-button
                    :disabled="type !== 'DERIVATIVES'"
                    title="Derivatives Offering"
                    :active="filterOption.derivative"
                    @click="filterByStatus('derivative')"
                  />
                </div>
              </template>
            </search-accordion>
          </div>
          <div class="border border-black px-5 overflow-hidden mt-4.25">
            <search-accordion title="Status">
              <template v-slot:content>
                <div
                  class="grid grid-cols-2 pt-0.75 gap-2.5 text-11 leading-4 pb-6 h-[233px]"
                >
                  <status-button
                    title="Liquidity Protection"
                    :active="filterOption.protection"
                    @click="filterByStatus('protection')"
                  />
                  <status-button
                    title="Buy Now"
                    :active="filterOption.buyNow"
                    @click="filterByStatus('buyNow')"
                  />
                  <status-button
                    title="Has Offers"
                    :active="filterOption.hasOffer"
                    @click="filterByStatus('hasOffer')"
                  />
                  <status-button
                    title="On Auction"
                    :active="filterOption.onAuction"
                    @click="filterByStatus('onAuction')"
                  />
                  <status-button
                    title="Recently Sold"
                    :active="filterOption.recentSold"
                    @click="filterByStatus('recentSold')"
                  />
                  <status-button
                    title="Has No Offers"
                    :active="filterOption.hasNoOffer"
                    @click="filterByStatus('hasNoOffer')"
                  />
                  <status-button
                    title="Ending Soon"
                    :active="filterOption.sortBy === 'ENDING_SOON'"
                    @click="filterBySort('ENDING_SOON')"
                  />
                  <status-button
                    title="Recently Canceled"
                    :active="filterOption.recentCancel"
                    @click="filterByStatus('recentCancel')"
                  />
                </div>
              </template>
            </search-accordion>
          </div>
        </div>
        <div>
          <div class="border border-black px-5 overflow-hidden">
            <search-accordion
              :title="
                type !== 'COLLECTIONS' && type !== 'SUB_COLLECTIONS'
                  ? 'Price'
                  : 'Floor price'
              "
            >
              <template v-slot:content>
                <div
                  class="pt-0.75 gap-2.5 justify-between text-xs pb-6 mr-1 relative h-28"
                >
                  <search-dropdown
                    :title="
                      filterOption.chain === CHAIN_ROUTES['ETHEREUM']
                        ? '(ETH)'
                        : filterOption.chain === CHAIN_ROUTES['BSC_TESTNET']
                        ? '(BNB)'
                        : ''
                    "
                  >
                    <template v-slot:content>
                      <div
                        :class="[
                          filterOption.chain === CHAIN_ROUTES['ETHEREUM']
                            ? 'text-primary-900'
                            : 'text-white',
                          'px-3.5 cursor-pointer',
                        ]"
                        @click="filterByChain(CHAIN_ROUTES['ETHEREUM'])"
                      >
                        (ETH)
                      </div>
                      <div
                        :class="[
                          filterOption.chain === CHAIN_ROUTES['BSC_TESTNET']
                            ? 'text-primary-900'
                            : 'text-white',
                          'px-3.5 cursor-pointer',
                        ]"
                        @click="filterByChain(CHAIN_ROUTES['BSC_TESTNET'])"
                      >
                        (BNB)
                      </div>
                    </template>
                  </search-dropdown>
                  <div class="flex mt-11.25 items-center">
                    <nftmx-input
                      v-model="minPrice"
                      number
                      class="h-8.75"
                      placeholder="Min"
                    />
                    <span class="font-ibm-medium text-white mx-1">To</span>
                    <nftmx-input
                      v-model="maxPrice"
                      number
                      class="h-8.75"
                      placeholder="Max"
                    />
                  </div>
                </div>
              </template>
            </search-accordion>
          </div>
          <div
            class="border border-black p-5 overflow-hidden text-13 font-ibm-medium text-white h-[241px] mt-4.75"
          >
            <div>
              {{
                type !== "COLLECTIONS" && type !== "SUB_COLLECTIONS"
                  ? "Slippage"
                  : "Minimum slippage"
              }}
            </div>
            <div class="mt-3.25 flex items-center text-xs">
              <div class="flex">
                <nftmx-input
                  v-model="minSlippage"
                  number
                  class="h-8.75"
                  placeholder="Min"
                />
                <div class="bg-black flex items-center w-10 justify-center">
                  %
                </div>
              </div>
              <span class="mx-1">To</span>
              <div class="flex">
                <nftmx-input
                  v-model="maxSlippage"
                  number
                  class="h-8.75"
                  placeholder="Max"
                />
                <div class="bg-black flex items-center w-10 justify-center">
                  %
                </div>
              </div>
            </div>
            <div v-if="type !== 'COLLECTIONS' && type !== 'SUB_COLLECTIONS'">
              <div class="mt-6.5">Leverage staking</div>
              <div class="mt-3.5 grid grid-cols-2 text-xs">
                <div
                  @click="
                    leverageStaking(filterOption.staking === 'YES' ? '' : 'YES')
                  "
                  class="flex items-center w-fit cursor-pointer gap-2"
                >
                  <nftmx-radio
                    size="sm"
                    :active="filterOption.staking === 'YES'"
                  />
                  <span> Yes </span>
                </div>
                <div
                  @click="
                    leverageStaking(filterOption.staking === 'NO' ? '' : 'NO')
                  "
                  class="flex items-center w-fit cursor-pointer gap-2"
                >
                  <nftmx-radio
                    size="sm"
                    :active="filterOption.staking === 'NO'"
                  />
                  <span> No </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="type !== 'COLLECTIONS' && type !== 'SUB_COLLECTIONS'">
          <div class="border border-black px-5 overflow-hidden">
            <search-accordion title="Hashtags #">
              <template v-slot:content>
                <div class="h-93 pt-0.75 pb-6 text-xs">
                  <div class="relative">
                    <font-awesome-icon
                      :icon="['fas', 'search']"
                      class="text-white text-sm absolute top-2.5 left-4"
                    />
                    <nftmx-input
                      placeholder="Filter"
                      class="pt-2 pb-2.25 pl-11"
                      v-model="hashtagName"
                    />
                  </div>
                  <div class="h-full pt-2 pb-5">
                    <div class="overflow-auto flex flex-col h-full">
                      <div
                        v-for="(item, index) in filteredHashtags"
                        :key="index"
                        :class="[
                          'font-ibm text-11 text-primary-900 transition cursor-pointer py-2',
                        ]"
                        @click="removeHashtag(item)"
                      >
                        #{{ item.name }}
                      </div>
                      <div
                        v-for="(item, index) in hashtags"
                        :key="index"
                        :class="[
                          'font-ibm text-11 text-whtie hover:text-primary-900 transition cursor-pointer py-2',
                        ]"
                        @click="addHashtag(item)"
                      >
                        #{{ item.name }}
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </search-accordion>
          </div>
        </div>
        <div v-if="type !== 'COLLECTIONS' && type !== 'SUB_COLLECTIONS'">
          <div class="border border-black px-5 overflow-hidden">
            <search-accordion title="Collections name">
              <template v-slot:content>
                <div
                  class="pt-2 gap-2.5 justify-between text-xs pb-6 mr-1 relative h-93"
                >
                  <div class="relative">
                    <font-awesome-icon
                      :icon="['fas', 'search']"
                      class="text-white text-sm absolute top-2.5 left-4"
                    />
                    <nftmx-input
                      placeholder="Filter"
                      class="pt-2 pb-2.25 pl-11"
                      v-model="collectionName"
                    />
                  </div>
                  <div class="overflow-auto height my-4">
                    <div
                      v-for="(collection, index) in filteredCollections"
                      :key="index"
                      class="flex items-center gap-3.5 font-ibm text-11 py-1.75 cursor-pointer transition text-primary-900"
                      @click="removeFilterByCollections(index, collection)"
                    >
                      <div class="w-6 h-6 flex-none">
                        <nftmx-img
                          :src="
                            type === 'DERIVATIVES'
                              ? collection.originNft.imageUrl
                              : collection.imageUrl
                          "
                          class="object-cover w-full h-full bg-black"
                        />
                      </div>
                      <div class="leading-3">
                        {{
                          type === "DERIVATIVES"
                            ? collection.originNft.name
                            : collection.name
                        }}
                      </div>
                    </div>
                    <div
                      v-for="(collection, index) in collections"
                      :key="index"
                      @click="addFilterByCollections(index, collection)"
                    >
                      <div
                        v-if="
                          filteredCollections.findIndex(
                            (item) => item.address === collection.address
                          ) < 0
                        "
                        class="flex items-center gap-3.5 font-ibm text-11 py-1.75 cursor-pointer transition text-white hover:text-primary-900"
                      >
                        <div class="w-6 h-6 flex-none">
                          <nftmx-img
                            :src="
                              type === 'DERIVATIVES'
                                ? collection.originNft.imageUrl
                                : collection.imageUrl
                            "
                            class="object-cover w-full h-full bg-black"
                          />
                        </div>
                        <div class="leading-3">
                          {{
                            type === "DERIVATIVES"
                              ? collection.originNft.name
                              : collection.name
                          }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </search-accordion>
          </div>
        </div>
        <div>
          <div class="border border-black px-5 overflow-hidden">
            <search-accordion title="Chain">
              <template v-slot:content>
                <div class="h-93 py-4">
                  <div class="flex flex-col h-full gap-3.5 overflow-auto">
                    <filter-item
                      v-for="(value, key) in ChainNames"
                      :key="key"
                      :active="filterOption.chain === CHAIN_ROUTES[key]"
                      :title="value"
                      @click="filterByChain(CHAIN_ROUTES[key])"
                    />
                  </div>
                </div>
              </template>
            </search-accordion>
          </div>
        </div>
        <div>
          <div class="border border-black px-5 overflow-hidden">
            <search-accordion title="Sort by">
              <template v-slot:content>
                <div class="h-93 py-4">
                  <div class="flex flex-col h-full gap-3.5 overflow-auto">
                    <filter-item
                      v-for="(value, key) in sortBy"
                      :key="key"
                      :active="filterOption.sortBy === key"
                      :title="value"
                      @click="filterBySort(key)"
                    />
                    <div class="border-t border-black" />
                    <div
                      :class="[
                        filterOption.exclusive
                          ? 'text-primary-900'
                          : 'text-white',
                        'text-xs hover:text-primary-900 transition cursor-pointer mt-2',
                      ]"
                      @click="filterByExclusive(!filterOption.exclusive)"
                    >
                      <font-awesome-icon
                        :icon="['fas', 'check-circle']"
                        class="text-sm"
                      />
                      <span class="ml-2"> Exclusive to NFT.Protection </span>
                    </div>
                  </div>
                </div>
              </template>
            </search-accordion>
          </div>
        </div>
      </div>
    </accordion>
  </div>
</template>

<style scoped>
.text-center {
  text-align: -webkit-center;
}
.height {
  height: calc(100% - theme("spacing[8]"));
}
</style>

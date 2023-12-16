<script setup>
import { computed, onMounted, ref, watch, watchEffect } from "vue";
import NftmxButton from "@/core/components/basic/NftmxButton.vue";
import NftmxDivider from "@/core/components/basic/NftmxDivider.vue";
import CheckboxCell from "@/core/components/basic/CheckboxCell.vue";
import NftmxSearchInput from "@/core/components/basic/NftmxSearchInput.vue";
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
import { findAndRemove } from "@/core/utils/common";
import NftmxImg from "@/core/components/basic/NftmxImg.vue";
import { useStore } from "vuex";
import Accordion from "@/core/components/accordion/Accordion.vue";
import BasicAccordion from "@/core/components/accordion/BasicAccordion.vue";
import NftmxRadio from "@/core/components/basic/NftmxRadio.vue";

const props = defineProps({
  filterOption: Object,
  viewOption: String,
  isCartOpened: Boolean,
});

const emit = defineEmits(["apply-filter", "show-cart", "change-view"]);

const store = useStore();
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

const onClickOutside = () => {
  chainDropdown.value = false;
};
const filterByStatus = (status) => {
  const option = JSON.parse(JSON.stringify(props.filterOption));
  option[status] = !option[status];
  emit("apply-filter", option);
};
const addFilterByCollections = (index, collection) => {
  const option = JSON.parse(JSON.stringify(props.filterOption));
  collections.value.splice(index, 1);
  filteredCollections.value.push(collection);
  option.collection.push(collection.id);
  emit("apply-filter", option);
};
const removeFilterByCollections = (index, collection) => {
  const option = JSON.parse(JSON.stringify(props.filterOption));
  filteredCollections.value.splice(index, 1);
  collections.value.push(collection);
  const filterIndex = option.collection.indexOf(collection.id);
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
  marketService.getContracts({ chain, name }).then((res) => {
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
</script>

<template>
  <div
    class="bg-tertiary-800 border-t border-b border-black py-5.25 px-4 sm:px-10 lg:px-22 text-white"
  >
    <div
      class="flex flex-wrap flex-col xl:flex-row justify-between items-center"
    >
      <div class="flex flex-1 w-full min-w-max items-center">
        <div class="w-full flex justify-between items-center gap-4 h-13">
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
          <div class="relative h-8 w-64 border-r border-tertiary-700 z-1">
            <div
              :class="[
                chainDropdown && 'border-b',
                'absolute w-full  border-x border-black',
              ]"
              v-click-outside="onClickOutside"
            >
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
          <font-awesome-icon
            :icon="['fas', 'square']"
            :class="[
              viewOption === 'TILE' ? 'text-primary-900' : 'text-white',
              'transition hover:text-primary-900 cursor-pointer text-lg',
            ]"
            @click="emit('change-view', 'TILE')"
          />
          <font-awesome-icon
            :icon="['fas', 'th-list']"
            :class="[
              viewOption === 'LIST' ? 'text-primary-900' : 'text-white',
              'transition hover:text-primary-900 cursor-pointer text-lg',
            ]"
            @click="emit('change-view', 'LIST')"
          />
          <div
            class="h-8 border-l border-l-black border-r border-r-tertiary-700"
          />
          <div
            @click="emit('show-cart')"
            :class="[
              isCartOpened
                ? 'fill-primary-900'
                : 'fill-white hover:fill-primary-900',
              'flex transition cursor-pointer',
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
        class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 mt-5"
      >
        <div>
          <div class="border border-black px-5 overflow-hidden">
            <search-accordion title="Floor Price">
              <template v-slot:content>
                <div
                  class="pt-2 gap-2.5 justify-between text-xs pb-6 mr-1 relative h-64"
                >
                  <search-dropdown title="(ETH)">
                    <template v-slot:content></template>
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
        </div>
        <div>
          <div class="border border-black px-5 overflow-hidden">
            <search-accordion title="Chain">
              <template v-slot:content>
                <div class="h-64 py-4">
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
                <div class="h-64 py-4">
                  <div class="flex flex-col h-full gap-3.5 overflow-auto">
                    <filter-item
                      v-for="(value, key) in sortBy"
                      :key="key"
                      :active="filterOption.sortBy === key"
                      :title="value"
                      @click="filterBySort(key)"
                    />
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

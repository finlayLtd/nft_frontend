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
import NftmxRadio from "@/core/components/basic/NftmxRadio.vue";

const props = defineProps({
  filterOption: Object,
  openFilter: Boolean,
});

const emit = defineEmits(["apply-filter"]);

const store = useStore();
const windowWidth = computed(() => store.state.app.windowWidth);
const searchText = useDebouncedRef("", 1000);
const minPrice = useDebouncedRef("", 1000);
const maxPrice = useDebouncedRef("", 1000);
const minSlippage = useDebouncedRef("", 1000);
const maxSlippage = useDebouncedRef("", 1000);
const hashtagName = useDebouncedRef("", 1000);
const hashtags = ref([]);
const filteredHashtags = ref([]);

const filterByStatus = (status) => {
  const option = JSON.parse(JSON.stringify(props.filterOption));
  option[status] = !option[status];
  emit("apply-filter", option);
};
const filterByChain = (chain) => {
  if (props.filterOption.chain !== chain) {
    const option = JSON.parse(JSON.stringify(props.filterOption));
    option.chain = chain;
    emit("apply-filter", option);
  }
};
const filterBySort = (sort) => {
  const option = JSON.parse(JSON.stringify(props.filterOption));
  option.sortBy === sort ? (option.sortBy = "") : (option.sortBy = sort);
  emit("apply-filter", option);
};
const onKeyDown = (evt) => {
  if (evt.keyCode === 13) {
    evt.preventDefault();
    return;
  }
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
const getHashtags = () => {
  marketService.getHashtagNames(hashtagName.value, 20).then((res) => {
    hashtags.value = res.data;
  });
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
onMounted(() => {
  getHashtags();
});
</script>

<template>
  <div
    :class="[
      openFilter ? 'border-y' : '',
      'bg-tertiary-800  border-black px-5 sm:px-10 md:px-16 xl:px-22 -mx-5 sm:-mx-10 md:-mx-16 xl:-mx-22',
    ]"
  >
    <accordion :open="openFilter" class="overflow-hidden">
      <div
        class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 py-5.25 text-white"
      >
        <div>
          <div class="border border-black px-5 overflow-hidden">
            <search-accordion title="Status">
              <template v-slot:content>
                <div
                  class="grid grid-cols-2 pt-2 gap-x-2.5 justify-between text-11 leading-4 pb-1 h-76.5"
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
                    :active="filterOption.endingSoon"
                    @click="filterByStatus('endingSoon')"
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
            <search-accordion title="Price">
              <template v-slot:content>
                <div
                  class="pt-2 gap-2.5 justify-between text-xs pb-6 mr-1 relative h-28"
                >
                  <search-dropdown title="(USD)">
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
          <div
            class="border border-black p-5 overflow-hidden text-13 font-ibm-medium text-white mt-4.5"
          >
            <div>Slippage</div>
            <div class="mt-3 flex items-center text-xs">
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
            <div class="mt-3.5">Leverage staking</div>
            <div class="mt-3.5 grid grid-cols-2 text-xs">
              <div
                @click="
                  leverageStaking(filterOption.staking === 'YES' ? '' : 'YES')
                "
                class="flex items-center gap-2 w-fit cursor-pointer"
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
                class="flex items-center gap-2 w-fit cursor-pointer"
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
        <div>
          <div class="border border-black px-5 overflow-hidden">
            <search-accordion title="Hashtags #">
              <template v-slot:content>
                <div class="h-76.5 pt-2 pb-6 text-xs">
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
        <div>
          <div class="border border-black px-5 overflow-hidden">
            <search-accordion title="Sort by">
              <template v-slot:content>
                <div class="h-76.5 py-4">
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

<style scoped>
.text-center {
  text-align: -webkit-center;
}
.height {
  height: calc(100% - theme("spacing[8]"));
}
</style>

<script setup>
import { computed, onMounted, ref, watch, watchEffect } from "vue";
import CheckboxCell from "@/core/components/basic/CheckboxCell.vue";
import SearchAccordion from "@/core/components/accordion/SearchAccordion.vue";
import StatusButton from "@/core/components/basic/StatusButton.vue";
import SearchDropdown from "@/core/components/dropdown/SearchDropdown.vue";
import NftmxInput from "@/core/components/basic/NftmxInput.vue";
import FilterItem from "@/core/components/basic/FilterItem.vue";
import useDebouncedRef from "@/core/utils/hook/useDebouncedRef.js";
import marketService from "@/core/services/market.service";
import {
  filterStatus,
  ChainNames,
  sortBy,
  CHAIN_ROUTES,
} from "@/core/config/constant";
import { findAndRemove } from "@/core/utils/common";
import Accordion from "@/core/components/accordion/Accordion.vue";
import { useStore } from "vuex";
import NftmxImg from "@/core/components/basic/NftmxImg.vue";

const props = defineProps({
  filterOption: Object,
  filterActive: Boolean,
});
const emit = defineEmits(["filter-assets"]);

const store = useStore();
const collectionName = useDebouncedRef("", 1000);
const collections = ref([]);
const filteredCollections = ref([]);
const hashtagName = useDebouncedRef("", 1000);
const hashtags = ref([]);
const filteredHashtags = ref([]);
const walletAddress = computed(() => store.getters["auth/walletAddress"]);

const filterByChain = (chain) => {
  if (props.filterOption.chain !== chain) {
    const option = JSON.parse(JSON.stringify(props.filterOption));
    option.chain = chain;
    collections.value = [];
    filteredCollections.value = [];
    option.collection = [];
    emit("filter-assets", option);
    retrieveContracts(chain, option.name);
  }
};
const filterBySort = (option) => {
  const tempOption = props.filterOption;
  let options = JSON.parse(JSON.stringify(tempOption));
  if (options.sortBy === option) {
    options.sortBy = "";
  } else {
    options.sortBy = option;
  }
  emit("filter-assets", options);
};
const filterByCollections = (option) => {
  const tempOption = props.filterOption;
  let options = JSON.parse(JSON.stringify(tempOption));
  const index = options.collections.indexOf(option);
  if (index > -1) {
    options.collections.splice(index, 1);
  } else {
    options.collections.push(option);
  }
  emit("filter-assets", options);
};
const retrieveContracts = async (chain, name) => {
  return new Promise((resolve, reject) => {
    marketService
      .getContracts({
        chain,
        walletAddress: walletAddress.value,
        name,
      })
      .then((res) => {
        collections.value = res.data.contracts;
        resolve(true);
      })
      .catch((err) => {
        resolve(false);
      });
  });
};
const addFilterByCollections = (index, collection) => {
  const option = JSON.parse(JSON.stringify(props.filterOption));
  collections.value.splice(index, 1);
  filteredCollections.value.push(collection);
  option.collection = filteredCollections.value.map((item) => item.id);
  emit("filter-assets", option);
};
const removeFilterByCollections = (index, collection) => {
  const option = JSON.parse(JSON.stringify(props.filterOption));
  filteredCollections.value.splice(index, 1);
  collections.value.push(collection);
  option.collection = filteredCollections.value.map((item) => item.id);
  emit("filter-assets", option);
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
watch(hashtagName, (value) => {
  getHashtags();
});
watch(collectionName, (val) => {
  retrieveContracts(props.filterOption.chain, val);
});
onMounted(() => {
  getHashtags();
  retrieveContracts(props.filterOption.chain);
});
</script>

<template>
  <accordion :open="filterActive" class="overflow-hidden">
    <div
      class="bg-tertiary-800 border-t border-b border-black py-5 px-4 sm:px-10 lg:px-22"
    >
      <div
        class="grid gap-4 my-4.75 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
      >
        <div>
          <div class="border border-black px-5 overflow-hidden">
            <search-accordion title="Hashtags #">
              <template v-slot:content>
                <div class="h-64 pt-2 pb-6 text-xs">
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
            <search-accordion title="Collections name">
              <template v-slot:content>
                <div
                  class="pt-2 gap-2.5 justify-between text-xs pb-6 mr-1 relative h-64"
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
                          :src="collection.imageUrl"
                          class="object-cover w-full h-full bg-black"
                        />
                      </div>
                      <div class="leading-3">
                        {{ collection.name }}
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
                            (item) => item.id === collection.id
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
    </div>
  </accordion>
</template>

<style scoped>
.text-center {
  text-align: -webkit-center;
}
@media (min-width: 1280px) {
  .xl\:max-w-search {
    max-width: 17.25rem;
  }
}
.w-68 {
  width: 17rem /* 260px */;
}
.leading-7\.5 {
  line-height: 30px;
}
.leading-4\.5 {
  line-height: 18px;
}
.height {
  height: calc(100% - theme("spacing[8]"));
}
</style>

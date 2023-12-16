<script setup>
import { computed, onMounted, ref, watch, watchEffect } from "vue";
import NftmxImg from "@/core/components/basic/NftmxImg.vue";
import NftmxTrimString from "@/core/components/basic/NftmxTrimString.vue";
import usersService from "@/core/services/market/users.service";
import { themeConfig, defaultPagination } from "@/core/config/constant";
import { useStore } from "vuex";
import OfferCard from "@/core/components/cards/OfferCard.vue";
import NftmxSearchInput from "@/core/components/basic/NftmxSearchInput.vue";
import useDebouncedRef from "@/core/utils/hook/useDebouncedRef";
import marketService from "@/core/services/market.service";
import nftsService from "@/core/services/market/nfts.service";
import OfferSearchOptions from "../components/OfferSearchOptions.vue";
import NftmxButton from "@/core/components/basic/NftmxButton.vue";

const store = useStore();
const windowWidth = computed(() => store.state.app.windowWidth);
const walletAddress = computed(() => store.getters["auth/walletAddress"]);
const userId = computed(() => store.getters["auth/userId"]);
const loading = ref(false);
const allOffers = ref({ offers: [], cursor: null });
const offers = ref([]);
const more = computed(
  () =>
    allOffers.value.cursor ||
    offers.value.length < allOffers.value.offers.length
);
const limit = ref(2);
const filterOption = ref({
  chain: "BSC-TESTNET",
  name: "",
  min: null,
  max: null,
  collection: [],
  sortBy: "",
});
const searchText = useDebouncedRef("", 1000);
const filterActive = ref(false);

const clickFilter = () => {
  filterActive.value = !filterActive.value;
};
const filterOffers = (value) => {
  filterOption.value = value;
  initialOffers();
};
const cancelOffer = (id) => {
  const index = allOffers.value.offers.findIndex((asset) => asset.id === id);
  allOffers.value.offers.splice(index, 1);
  const lines = Math.ceil((offers.value.length - 1) / limit.value);
  offers.value = allOffers.value.offers.slice(0, limit.value * lines);
};
const loadMoreOffers = async () => {
  loading.value = true;
  if (allOffers.value.cursor) await retrieveOffers();
  loading.value = false;
  const sliceLimit = limit.value * 3;
  const nextStartPoint = offers.value.length;
  offers.value = offers.value.concat(
    allOffers.value.offers.slice(nextStartPoint, nextStartPoint + sliceLimit)
  );
};
const initialOffers = async () => {
  allOffers.value = { offers: [], cursor: null };
  offers.value = [];
  loading.value = true;
  await retrieveOffers();
  loading.value = false;
  offers.value = offers.value.concat(
    allOffers.value.offers.slice(0, limit.value * 4)
  );
};
const retrieveOffers = async () => {
  return new Promise((resolve, reject) => {
    usersService
      .myOffers({
        ...filterOption.value,
        cursor: allOffers.value.cursor,
        limit: defaultPagination.limit,
        walletAddress: walletAddress.value,
      })
      .then((res) => {
        allOffers.value = {
          offers: [...allOffers.value.offers, ...res.data.offers],
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
  const lines = Math.ceil(offers.value.length / limit.value);
  offers.value = allOffers.value.offers.slice(0, newLimit * lines);
  limit.value = newLimit;
};
watch(windowWidth, (width) => {
  setLimitValue(width);
});
watch(walletAddress, (val) => {
  initialOffers();
});
onMounted(() => {
  setLimitValue(windowWidth.value);
  initialOffers();
});
watch(searchText, (val) => {
  filterOffers({ ...filterOption.value, name: val });
});
</script>

<template>
  <div class="flex flex-col sm:flex-row mb-22 xl:pt-7.25">
    <div class="flex-1">
      <div class="flex xl:justify-end">
        <nftmx-search-input
          v-model="searchText"
          @handle-filter="clickFilter"
          :filterActive="filterActive"
          class="bg-tertiary-800 z-10"
        />
      </div>
      <div
        class="-ml-5 sm:-ml-10 md:-ml-16 xl:-ml-22 -mr-5 sm:-mr-10 md:-mr-16 xl:-mr-22"
      >
        <offer-search-options
          :gridExtend="false"
          :filterOption="filterOption"
          @filter-offers="filterOffers"
          :filterActive="filterActive"
        />
      </div>
      <div
        v-if="offers.length > 0"
        class="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 mt-10"
      >
        <offer-card
          v-for="(offer, index) in offers"
          :key="index"
          :offer="offer"
          @cancel-offer="cancelOffer"
        />
      </div>
      <div
        v-if="loading"
        class="h-96 font-ibm-bold text-tertiary-500 text-lg flex items-center justify-center"
      >
        Loading...
      </div>
      <div
        v-if="!loading && offers.length === 0"
        class="h-96 font-ibm-bold text-tertiary-500 text-lg flex items-center justify-center"
      >
        No Offers found
      </div>
      <div class="text-center w-full mt-8">
        <nftmx-button
          v-if="more"
          color="primary"
          label="SEE MORE"
          :outline="true"
          @click="loadMoreOffers"
          class="font-ibm-bold text-lg text-primary-900 w-full sm:w-68"
        />
      </div>
    </div>
  </div>
</template>

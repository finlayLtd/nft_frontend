<script setup>
import NftmxTrimString from "@/core/components/basic/NftmxTrimString.vue";
import Timer from "@/core/components/timer/Timer.vue";
import NftmxInput from "@/core/components/basic/NftmxInput.vue";
import InitialOfferingCarousel from "@/core/components/carousel/InitialOfferingCarousel.vue";
import FilterAssets from "../nfts/FilterAssets.vue";
import Accordion from "@/core/components/accordion/BasicAccordion.vue";
import Derivatives from "../derivatives/Derivatives.vue";
import SubCollectionCard from "@/core/components/cards/SubCollectionCard.vue";
import { computed, onMounted, ref, watch, watchEffect } from "vue";
import marketService from "@/core/services/market.service";
import { themeConfig } from "@/core/config/constant";
import { useStore } from "vuex";
import InitialOfferingCard from "@/core/components/cards/InitialOfferingCard.vue";
import Collections from "../Collections.vue";
import SubCollections from "../sub-collections/SubCollections.vue";
import NftmxThead from "@/core/components/table/NftmxThead.vue";
import NftmxTbody from "@/core/components/table/NftmxTbody.vue";
import NftmxTd from "@/core/components/table/NftmxTd.vue";
import NftmxTr from "@/core/components/table/NftmxTr.vue";
import NftmxImg from "@/core/components/basic/NftmxImg.vue";
import { roundTo, getChainKey } from "@/core/utils/common";
import DerivativeOfferingCard from "@/core/components/cards/DerivativeOfferingCard.vue";
import nftsService from "@/core/services/market/nfts.service";
import Cart from "./Cart.vue";
import PublicSale from "../nfts/PublicSale.vue";

const props = defineProps({
  ledgerPanelVisible: Boolean,
  filterOption: Object,
  isCartOpened: Boolean,
});

const contracts = ref([]);
const subContracts = ref([]);
const loadingContract = ref(true);
const displaySubCollectionLimit = ref(1);
const assetFilterOption = computed(() => props.filterOption);
const store = useStore();
const coinPrice = computed(() => store.state.market.coinPrice);
const windowWidth = computed(() => store.state.app.windowWidth);
const period = ref("1H");
const favorite = ref("All");
const offerings = ref([]);
const derivativeOfferings = ref([]);
const cartItems = ref([]);

const initialContracts = async () => {
  loadingContract.value = true;
  marketService
    .getContracts({
      ...props.filterOption,
      stats: true,
      limit: 10,
    })
    .then((res) => {
      contracts.value = res.data.contracts;
    })
    .catch((err) => {})
    .finally(() => {
      loadingContract.value = false;
    });
};

const setLimitValue = (value) => {
  displaySubCollectionLimit.value = value;
};
watchEffect(() => {
  if (windowWidth.value >= themeConfig.xl3) {
    props.ledgerPanelVisible ? setLimitValue(4) : setLimitValue(5);
  } else if (windowWidth.value >= themeConfig.xl) {
    props.ledgerPanelVisible ? setLimitValue(3) : setLimitValue(4);
  } else if (windowWidth.value >= themeConfig.lg) {
    props.ledgerPanelVisible ? setLimitValue(2) : setLimitValue(3);
  } else if (windowWidth.value >= themeConfig.sm && !props.ledgerPanelVisible) {
    setLimitValue(2);
  } else {
    setLimitValue(1);
  }
});
const retrieveContracts = async () => {
  return new Promise((resolve, reject) => {
    marketService
      .getContracts({
        ...props.filterOption,
        type: "DERIVATIVE",
        limit: 2,
      })
      .then((res) => {
        subContracts.value = res.data.contracts;
        resolve(true);
      })
      .catch((err) => {
        resolve(false);
      });
  });
};
const addToCart = (addingItem) => {
  const index = cartItems.value.findIndex((item) => item.id === addingItem.id);
  if (index < 0) {
    cartItems.value.push(addingItem);
  }
};
const removeFromCart = (token) => {
  const index = cartItems.value.findIndex((item) => item.id === token.id);
  if (index > -1) {
    cartItems.value.splice(index, 1);
  }
};
const getOffering = () => {
  nftsService
    .searchOfferings({ ...props.filterOption, limit: 1 })
    .then((res) => {
      offerings.value = res.data;
    });
  nftsService
    .searchOfferings({ ...props.filterOption, derivative: true, limit: 2 })
    .then((res) => {
      derivativeOfferings.value = res.data;
    });
};
onMounted(() => {
  initialContracts();
  retrieveContracts();
  getOffering();
});
watch(assetFilterOption, (val) => {
  getOffering();
});
</script>

<template>
  <div :class="['flex-1 text-white pl-1']">
    <div class="flex">
      <div class="flex-1 overflow-hidden px-4">
        <div class="font-press text-sm py-2.75">
          Initial Offering
          <router-link to="/initial-offering" target="_blank">
            <font-awesome-icon
              :icon="['fas', 'external-link-alt']"
              class="relative -top-2 text-xs cursor-pointer hover:text-primary-900"
            />
          </router-link>
        </div>
        <div v-if="offerings.length > 0">
          <initial-offering-card
            v-for="item in offerings"
            :key="item.id"
            :offering="item"
            class="mt-3.25"
          />
        </div>
        <div v-else class="flex flex-col items-center h-104 justify-center">
          <div class="text-red-600 font-ibm-bold text-lg">
            No offers available
          </div>
          <div class="text-tertiary-400 text-sm mt-3.5">
            <span class="text-primary-900"> Launch </span>
            <span>
              your own Initial Offering | Sign up to receive an alert when a new
              offering becomes available
            </span>
          </div>
          <div class="text-2xl text-tertiary-400 mt-5 flex gap-6">
            <font-awesome-icon :icon="['fab', 'telegram-plane']" />
            <font-awesome-icon :icon="['fab', 'discord']" />
            <font-awesome-icon :icon="['fab', 'twitter']" />
          </div>
        </div>
        <div class="border-t border-black mt-10" />
        <div class="-mx-4 mt-10">
          <public-sale
            v-if="!filterOption.sortBy"
            :ledgerPanelVisible="ledgerPanelVisible"
            :isCartOpened="isCartOpened"
          />
        </div>
        <div class="-mx-4">
          <filter-assets
            title="NFTs"
            :filterOption="filterOption"
            :ledgerPanelVisible="ledgerPanelVisible"
            :isCartOpened="isCartOpened"
            viewOption="TILE"
            :initRows="2"
          />
        </div>
        <div class="border-t border-black mt-10" />
        <div class="-mx-2 mt-10">
          <collections
            :ledgerPanelVisible="ledgerPanelVisible"
            :collectionFilterOption="filterOption"
            viewOption="LIST"
            :displayLimit="10"
          />
        </div>
        <div class="border-t border-black mt-10" />
        <div class="font-press text-sm py-2.75 mt-6">
          Derivatives Offering
          <router-link to="/derivatives-offering" target="_blank">
            <font-awesome-icon
              :icon="['fas', 'external-link-alt']"
              class="relative -top-2 text-xs cursor-pointer hover:text-primary-900"
            />
          </router-link>
        </div>
        <div
          v-if="derivativeOfferings.length > 0"
          class="grid grid-cols-2 gap-6 mt-2"
        >
          <derivative-offering-card
            v-for="item in derivativeOfferings"
            :key="item.id"
            :offering="item"
          />
        </div>
        <div v-else class="flex flex-col items-center h-104 justify-center">
          <div class="text-red-600 font-ibm-bold text-lg">
            No offers available
          </div>
          <div class="text-tertiary-400 text-sm mt-3.5">
            <span class="text-primary-900"> Launch </span>
            <span>
              your own Initial Offering | Sign up to receive an alert when a new
              offering becomes available
            </span>
          </div>
          <div class="text-2xl text-tertiary-400 mt-5 flex gap-6">
            <font-awesome-icon :icon="['fab', 'telegram-plane']" />
            <font-awesome-icon :icon="['fab', 'discord']" />
            <font-awesome-icon :icon="['fab', 'twitter']" />
          </div>
        </div>
        <div class="-mx-4">
          <derivatives
            title="Derivatives NFTs"
            :filterOption="filterOption"
            :ledgerPanelVisible="ledgerPanelVisible"
            :isCartOpened="isCartOpened"
            viewOption="TILE"
          />
        </div>
        <div class="border-t border-black mt-8" />
        <div class="-mx-4 mt-10">
          <sub-collections
            :ledgerPanelVisible="ledgerPanelVisible"
            :collectionFilterOption="filterOption"
            :isCartOpened="isCartOpened"
            viewOption="TILE"
          />
        </div>
      </div>
      <cart
        :nftCart="isCartOpened"
        :chain="filterOption.chain"
        :items="cartItems"
        @add-to-cart="addToCart"
        @remove-from-cart="removeFromCart"
      />
    </div>
  </div>
</template>

<style scoped>
.w-fill {
  width: calc(100% + 4px);
}
</style>

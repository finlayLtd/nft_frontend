<script setup>
import { computed, onMounted, ref, watch, watchEffect } from "vue";
import { useStore } from "vuex";
import BodyContainer from "@/core/container/BodyContainer.vue";
import Assets from "./nfts/Assets.vue";
import SyndicationCarousel from "@/core/components/carousel/SyndicationCarousel.vue";
import Analyzer from "./Analyzer.vue";
import BackerCarousel from "@/core/components/carousel/BackerCarousel.vue";
import Collections from "./Collections.vue";
import Ledger from "./Ledger.vue";
import MemoryGame from "@/core/components/memory-game/MemoryGame.vue";
import NftmxImg from "@/core/components/basic/NftmxImg.vue";
import NftmxSearchOptions from "@/core/components/basic/NftmxSearchOptions.vue";
import CheckLiquidity from "./CheckLiquidity.vue";
import { useRoute, useRouter } from "vue-router";
import AllTabs from "./all-tabs/AllTabs.vue";
import InitialOffering from "./initial-offering/InitialOffering.vue";
import DerivativesOffering from "./derivatives-offering/DerivativesOffering.vue";
import SubCollections from "./sub-collections/SubCollections.vue";
import DerivativesCollection from "./derivatives/DerivativesCollection.vue";
import nftsService from "@/core/services/market/nfts.service";
import useDebouncedRef from "@/core/utils/hook/useDebouncedRef.js";

const route = useRoute();
const router = useRouter();
const store = useStore();
const tab = computed(() => route.query.tab);
const stats = ref({
  initialOffering: 0,
  collections: 0,
  nfts: 0,
  derivativeOffering: 0,
  subCollections: 0,
  derivatives: 0,
});
const isCartOpened = ref(false);
const mainContent = ref(null);
const ledgerHeight = useDebouncedRef(0, 500);

const filterActive = ref(false);
const ledgerPanelVisible = ref(false);
const initialOfferingFilterOption = ref({
  chain: "",
  name: "",
  min: null,
  max: null,
  sortBy: "",
});
const nftFilterOption = ref({
  chain: "",
  name: "",
  initial: false,
  derivative: false,
  protection: false,
  buyNow: false,
  onAuction: false,
  hasOffer: false,
  hasNoOffer: false,
  recentSold: false,
  recentCancel: false,
  endingSoon: false,
  min: null,
  max: null,
  minSlippage: null,
  maxSlippage: null,
  staking: "",
  collection: [],
  sortBy: "",
  exclusive: false,
  hashtag: "",
});
const collectionFilterOption = ref({
  chain: "",
  name: "",
  min: null,
  max: null,
  sortBy: "",
});
const derivativesOfferingFilterOption = ref({
  chain: "",
  name: "",
  min: null,
  max: null,
  sortBy: "",
});
const subCollectionFilterOption = ref({
  chain: "",
  name: "",
  min: null,
  max: null,
  sortBy: "",
});
const derivativesFilterOption = ref({
  chain: "",
  name: "",
  initial: false,
  derivative: false,
  protection: false,
  buyNow: false,
  onAuction: false,
  hasOffer: false,
  hasNoOffer: false,
  recentSold: false,
  recentCancel: false,
  endingSoon: false,
  min: null,
  max: null,
  minSlippage: null,
  maxSlippage: null,
  staking: "",
  collection: [],
  sortBy: "",
  exclusive: false,
  hashtag: "",
  type: "DERIVATIVE",
});
const viewOption = ref("TILE");
const nftCartChain = ref("ETHEREUM");

const carouselPlay = ref(true);
const collections = ref([]);

const codeLine1 = "   Buy NFTs with 100% Liquidity Protection";
const codeLine2 = "   Make Unlimited Offers with Your Vault";
const codeLine3 = "   Sell NFTs and Keep Multilevel Ownership";
const codeLine4 = "   Fork NFTs Into Derivatives Subcollection";
const codeLine5 = "   Conduct Initial or Derivatives Offering";
const codeLine6 = "   Instantly Borrow Funds Against Any NFT";
const codeLine7 = "   Invest Via Automated Decentralized VC";
const codeLine8 = "   Forever Sell NFT P2P with 0% Fee";

const typeLine1 = ref("");
const typeLine2 = ref("");
const typeLine3 = ref("");
const typeLine4 = ref("");
const typeLine5 = ref("");
const typeLine6 = ref("");
const typeLine7 = ref("");
const typeLine8 = ref("");

const typeEffect = () => {
  if (typeLine1.value.length < codeLine1.length) {
    typeLine1.value += codeLine1.charAt(typeLine1.value.length);
    setTimeout(typeEffect, 30);
  } else if (typeLine2.value.length < codeLine2.length) {
    typeLine2.value += codeLine2.charAt(typeLine2.value.length);
    setTimeout(typeEffect, 30);
  } else if (typeLine3.value.length < codeLine3.length) {
    typeLine3.value += codeLine3.charAt(typeLine3.value.length);
    setTimeout(typeEffect, 30);
  } else if (typeLine4.value.length < codeLine4.length) {
    typeLine4.value += codeLine4.charAt(typeLine4.value.length);
    setTimeout(typeEffect, 30);
  } else if (typeLine5.value.length < codeLine5.length) {
    typeLine5.value += codeLine5.charAt(typeLine5.value.length);
    setTimeout(typeEffect, 30);
  } else if (typeLine6.value.length < codeLine6.length) {
    typeLine6.value += codeLine6.charAt(typeLine6.value.length);
    setTimeout(typeEffect, 30);
  } else if (typeLine7.value.length < codeLine7.length) {
    typeLine7.value += codeLine7.charAt(typeLine7.value.length);
    setTimeout(typeEffect, 30);
  } else if (typeLine8.value.length < codeLine8.length) {
    typeLine8.value += codeLine8.charAt(typeLine8.value.length);
    setTimeout(typeEffect, 30);
  }
};

const selectTab = (value) => {
  router.replace(`/home?tab=${value}`);
  if (value === "NFTS") {
    ledgerPanelVisible.value = true;
  } else {
    ledgerPanelVisible.value = false;
    isCartOpened.value = false;
  }
};
const filterInitialOffering = (option) => {
  initialOfferingFilterOption.value = option;
};
const applyNftFiltering = (option) => {
  nftFilterOption.value = option;
  if (option.chain !== nftCartChain.value) {
    nftCartChain.value = option.chain;
  }
};
const applyCollectionFiltering = (option) => {
  collectionFilterOption.value = option;
};
const filterDerivativesOffering = (option) => {
  derivativesOfferingFilterOption.value = option;
};
const filterSubCollections = (option) => {
  subCollectionFilterOption.value = option;
};
const filterDerivatives = (option) => {
  console.log(option);
  derivativesFilterOption.value = option;
};
const toggleCart = () => {
  isCartOpened.value = !isCartOpened.value;
};
const clickFilter = () => {
  filterActive.value = !filterActive.value;
};
const toggleLedgerPanel = () => {
  ledgerPanelVisible.value = !ledgerPanelVisible.value;
};
const changeView = (val) => {
  viewOption.value = val;
};
const setAnimHeight = () => {
  if (mainContent.value) {
    if (
      (tab.value !== "INITIAL_OFFERING" && viewOption.value === "LIST") ||
      !tab.value ||
      tab.value == "DERIVATIVES_OFFERING"
    ) {
      ledgerHeight.value = mainContent.value.clientHeight - 8;
    } else {
      ledgerHeight.value = mainContent.value.clientHeight;
    }
  }
};
onMounted(() => {
  ledgerHeight.value = mainContent.value.scrollHeight;

  const observer = new ResizeObserver(setAnimHeight);
  observer.observe(mainContent.value, { box: "border-box" });
  nftsService.stats().then((res) => {
    stats.value = res.data;
  });
  typeEffect();
});
</script>

<template>
  <div
    class="bg-black md:bg-[url('/images/landing/hero-background.png')] bg-no-repeat bg-cover bg-right font-press text-white w-full"
  >
    <div
      class="flex flex-col xl:flex-row h-full items-center justify-center xl:justify-between px-4 xl:px-20"
    >
      <div class="text-xl 2xl:text-2xl text-shadow py-10">
        <div class="flex items-center min-h-[36px] gap-3.5 font-press">
          <nftmx-img src="/images/landing/nftmx.png" class="w-9.5 h-9" />
          <p>{{ typeLine1 }}</p>
        </div>
        <div class="flex items-center min-h-[36px] gap-3.5 mt-1.5">
          <nftmx-img
            v-if="typeLine2"
            src="/images/landing/nftmx.png"
            class="w-9.5 h-9"
          />
          <p>{{ typeLine2 }}</p>
        </div>
        <div class="flex items-center min-h-[36px] gap-3.5 mt-1.5">
          <nftmx-img
            v-if="typeLine3"
            src="/images/landing/nftmx.png"
            class="w-9.5 h-9"
          />
          <p>{{ typeLine3 }}</p>
        </div>
        <div class="flex items-center min-h-[36px] gap-3.5 mt-1.5">
          <nftmx-img
            v-if="typeLine4"
            src="/images/landing/nftmx.png"
            class="w-9.5 h-9"
          />
          <p>{{ typeLine4 }}</p>
        </div>
        <div class="flex items-center min-h-[36px] gap-3.5 mt-1.5">
          <nftmx-img
            v-if="typeLine5"
            src="/images/landing/nftmx.png"
            class="w-9.5 h-9"
          />
          <p>{{ typeLine5 }}</p>
        </div>
        <div class="flex items-center min-h-[36px] gap-3.5 mt-1.5">
          <nftmx-img
            v-if="typeLine6"
            src="/images/landing/nftmx.png"
            class="w-9.5 h-9"
          />
          <p>{{ typeLine6 }}</p>
        </div>
        <div class="flex items-center min-h-[36px] gap-3.5 mt-1.5">
          <nftmx-img
            v-if="typeLine7"
            src="/images/landing/nftmx.png"
            class="w-9.5 h-9"
          />
          <p>{{ typeLine7 }}</p>
        </div>
        <div
          class="flex items-center min-h-[36px] gap-3.5 mt-1.5 text-primary-900"
        >
          <nftmx-img
            v-if="typeLine8"
            src="/images/landing/nftmx.png"
            class="w-9.5 h-9"
          />
          <p>{{ typeLine8 }}</p>
        </div>
      </div>
      <memory-game class="2xl:ml-40" />
    </div>
  </div>
  <body-container :padding="false" footerExtended>
    <div class="pt-6 pb-5 sm:py-4.25 sm:pb-3.25">
      <syndication-carousel :carouselPlay="carouselPlay" />
    </div>
    <div class="bg-tertiary-800 border border-black pt-3.5">
      <backer-carousel :carouselPlay="carouselPlay" />
      <div
        class="w-full flex gap-6 justify-center text-tertiary-600 text-sm pt-1 pb-6"
      >
        <font-awesome-icon
          v-if="!carouselPlay"
          :icon="['fas', 'play']"
          class="text-primary-900 cursor-pointer transition hover:text-primary-900"
          @click="carouselPlay = true"
        />
        <font-awesome-icon
          v-if="carouselPlay"
          :icon="['fas', 'pause']"
          class="cursor-pointer transition hover:text-primary-900"
          @click="carouselPlay = false"
        />
      </div>
    </div>
    <analyzer />
    <div id="home_content">
      <div
        class="grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 text-center text-sm font-press mt-2"
      >
        <div
          @click="selectTab('INITIAL_OFFERING')"
          :class="[
            tab === 'INITIAL_OFFERING'
              ? 'text-primary-900 border-primary-900'
              : 'text-white border-white hover:text-primary-900 hover:border-primary-900',
            'transition pt-7.25 pb-3 cursor-pointer border-b-3',
          ]"
        >
          <div>Initial Offering</div>
          <div>
            {{ stats.initialOffering.toLocaleString() }}
          </div>
        </div>
        <div
          @click="selectTab('COLLECTIONS')"
          :class="[
            tab === 'COLLECTIONS'
              ? 'text-primary-900 border-primary-900'
              : 'text-white border-white hover:text-primary-900 hover:border-primary-900',
            'transition pt-7.25 pb-3 cursor-pointer border-b-3',
          ]"
        >
          <div>Collections</div>
          <div>
            {{ stats.collections.toLocaleString() }}
          </div>
        </div>
        <div
          @click="selectTab('NFTS')"
          :class="[
            tab === 'NFTS'
              ? 'text-primary-900 border-primary-900'
              : 'text-white border-white hover:text-primary-900 hover:border-primary-900',
            'transition pt-7.25 pb-3 cursor-pointer border-b-3',
          ]"
        >
          <div>NFTs</div>
          <div>
            {{ stats.nfts.toLocaleString() }}
          </div>
        </div>
        <div
          @click="selectTab('DERIVATIVES_OFFERING')"
          :class="[
            tab === 'DERIVATIVES_OFFERING'
              ? 'text-secondary-900 border-secondary-900'
              : 'text-white border-white hover:text-secondary-900 hover:border-secondary-900',
            'transition pt-7.25 pb-3 cursor-pointer border-b-3',
          ]"
        >
          <div>Derivatives Offering</div>
          <div>
            {{ stats.derivativeOffering.toLocaleString() }}
          </div>
        </div>
        <div
          @click="selectTab('SUB_COLLECTIONS')"
          :class="[
            tab === 'SUB_COLLECTIONS'
              ? 'text-secondary-900 border-secondary-900'
              : 'text-white border-white hover:text-secondary-900 hover:border-secondary-900',
            'transition pt-7.25 pb-3 cursor-pointer border-b-3',
          ]"
        >
          <div>Subcollections</div>
          <div>
            {{ stats.subCollections.toLocaleString() }}
          </div>
        </div>
        <div
          @click="selectTab('DERIVATIVES')"
          :class="[
            tab === 'DERIVATIVES'
              ? 'text-secondary-900 border-secondary-900'
              : 'text-white border-white hover:text-secondary-900 hover:border-secondary-900',
            'transition pt-7.25 pb-3 cursor-pointer border-b-3',
          ]"
        >
          <div>Derivatives</div>
          <div>
            {{ stats.derivatives.toLocaleString() }}
          </div>
        </div>
      </div>
      <nftmx-search-options
        v-if="tab === 'INITIAL_OFFERING'"
        type="INITIAL_OFFERING"
        :filterOption="initialOfferingFilterOption"
        :viewOption="viewOption"
        @change-view="changeView"
        @apply-filter="filterInitialOffering"
        @show-cart="toggleCart"
        :isCartOpened="isCartOpened"
      />
      <nftmx-search-options
        v-else-if="tab === 'COLLECTIONS'"
        type="COLLECTIONS"
        :filterOption="collectionFilterOption"
        :viewOption="viewOption"
        @apply-filter="applyCollectionFiltering"
        @change-view="changeView"
      />
      <nftmx-search-options
        v-else-if="tab === 'NFTS'"
        type="NFTS"
        :filterOption="nftFilterOption"
        :viewOption="viewOption"
        @change-view="changeView"
        @apply-filter="applyNftFiltering"
        @show-cart="toggleCart"
        :isCartOpened="isCartOpened"
      />
      <nftmx-search-options
        v-else-if="tab === 'DERIVATIVES_OFFERING'"
        type="DERIVATIVES_OFFERING"
        :filterOption="derivativesOfferingFilterOption"
        :viewOption="viewOption"
        @change-view="changeView"
        @apply-filter="filterDerivativesOffering"
        @show-cart="toggleCart"
        :isCartOpened="isCartOpened"
      />
      <nftmx-search-options
        v-else-if="tab === 'SUB_COLLECTIONS'"
        type="SUB_COLLECTIONS"
        :filterOption="subCollectionFilterOption"
        :viewOption="viewOption"
        @change-view="changeView"
        @apply-filter="filterSubCollections"
        @show-cart="toggleCart"
        :isCartOpened="isCartOpened"
      />
      <nftmx-search-options
        v-else-if="tab === 'DERIVATIVES'"
        type="DERIVATIVES"
        :filterOption="derivativesFilterOption"
        :viewOption="viewOption"
        @change-view="changeView"
        @apply-filter="filterDerivatives"
        @show-cart="toggleCart"
        :isCartOpened="isCartOpened"
      />
      <nftmx-search-options
        v-else
        :filterOption="nftFilterOption"
        :viewOption="viewOption"
        @change-view="changeView"
        @apply-filter="applyNftFiltering"
        @show-cart="toggleCart"
        :isCartOpened="isCartOpened"
      />
    </div>
    <div
      :class="[
        tab === 'COLLECTIONS' ? 'pb-38.5' : 'pb-4 lg:pb-41',
        'relative lg:flex justify-center px-4 sm:px-10 pt-8  lg:px-22',
      ]"
    >
      <ledger
        :ledgerPanelVisible="ledgerPanelVisible"
        :tab="tab"
        :ledgerHeight="ledgerHeight"
        @toggle-ledger-panel="toggleLedgerPanel"
        :class="
          (tab === 'DERIVATIVES' || tab === 'NFTS') && viewOption === 'TILE'
            ? 'mb-3'
            : ''
        "
      />
      <div class="flex-1 overflow-x-clip -mx-4 px-4">
        <div ref="mainContent">
          <initial-offering
            :ledgerPanelVisible="ledgerPanelVisible"
            v-if="tab === 'INITIAL_OFFERING'"
            :filterOption="initialOfferingFilterOption"
            :isCartOpened="isCartOpened"
            :viewOption="viewOption"
          />
          <collections
            v-else-if="tab === 'COLLECTIONS'"
            :ledgerPanelVisible="ledgerPanelVisible"
            :collectionFilterOption="collectionFilterOption"
            :viewOption="viewOption"
          />
          <assets
            :ledgerPanelVisible="ledgerPanelVisible"
            v-else-if="tab === 'NFTS'"
            :filterOption="nftFilterOption"
            :isCartOpened="isCartOpened"
            :viewOption="viewOption"
          />
          <derivatives-offering
            :ledgerPanelVisible="ledgerPanelVisible"
            v-else-if="tab === 'DERIVATIVES_OFFERING'"
            :filterOption="derivativesOfferingFilterOption"
            :isCartOpened="isCartOpened"
            :viewOption="viewOption"
          />
          <sub-collections
            :ledgerPanelVisible="ledgerPanelVisible"
            v-else-if="tab === 'SUB_COLLECTIONS'"
            :collectionFilterOption="subCollectionFilterOption"
            :isCartOpened="isCartOpened"
            :viewOption="viewOption"
          />
          <derivatives-collection
            :ledgerPanelVisible="ledgerPanelVisible"
            v-else-if="tab === 'DERIVATIVES'"
            :filterOption="derivativesFilterOption"
            :isCartOpened="isCartOpened"
            :viewOption="viewOption"
          />
          <all-tabs
            v-else
            :ledgerPanelVisible="ledgerPanelVisible"
            :filterOption="nftFilterOption"
            :isCartOpened="isCartOpened"
          />
        </div>
      </div>
    </div>
    <check-liquidity />
  </body-container>
</template>

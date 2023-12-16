<script setup>
import Accordion from "../container/AssetsAccordion.vue";
import { useStore } from "vuex";
import { computed, onMounted, ref, watch, watchEffect } from "vue";
import marketService from "@/core/services/market.service";
import PublicSaleAssetCard from "@/core/components/cards/PublicSaleAssetCard.vue";
import { themeConfig } from "@/core/config/constant";

const props = defineProps({
  title: String,
  ledgerPanelVisible: Boolean,
  filterOption: Object,
  first: Boolean,
  isCartOpened: Boolean,
  viewOption: String,
  initRows: { type: Number, default: 1 },
});

const store = useStore();
const windowWidth = computed(() => store.state.app.windowWidth);
const orders = ref([]);
const loading = ref(true);
const allAssets = ref({ assets: [], cursor: null });
const assets = ref([]);
const limit = ref(2);
const assetFilterOption = computed(() => props.filterOption);
const assetsAccordion = ref(null);
const open = computed(() =>
  assetsAccordion.value ? assetsAccordion.value.open : true
);
const more = computed(
  () =>
    allAssets.value.cursor ||
    assets.value.length < allAssets.value.assets.length
);
const publicSaleCardContainer = ref(null);
const containerWidth = ref(0);
const cardWidth = ref(265);
const rowCount = ref(6);

const loadMoreAssets = async () => {
  loading.value = true;
  if (allAssets.value.cursor) await retrieveAssets();
  loading.value = false;
  const sliceLimit = limit.value * 5;
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
    allAssets.value.assets.slice(
      0,
      props.title === "Explore" ? limit.value * 5 : limit.value * props.initRows
    )
  );
};
const retrieveAssets = async () => {
  return new Promise((resolve, reject) => {
    marketService
      .searchNfts({
        ...props.filterOption,
        cursor: allAssets.value.cursor,
        limit: 30,
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
const setLimitValue = (value) => {
  const lines = Math.ceil(assets.value.length / limit.value);
  assets.value = allAssets.value.assets.slice(0, value * lines);
  limit.value = value;
};
watchEffect(() => {
  let limit = 6;
  if (windowWidth.value >= themeConfig.xl3) {
    limit = 6;
  } else if (windowWidth.value >= themeConfig.xl2) {
    limit = 5;
  } else if (windowWidth.value >= themeConfig.xl) {
    limit = 4;
  } else if (windowWidth.value >= themeConfig.lg) {
    limit = 3;
  }
  if (props.ledgerPanelVisible) {
    limit--;
  }
  if (props.isCartOpened) {
    limit--;
  }
  if (windowWidth.value < themeConfig.lg) {
    if (windowWidth.value >= themeConfig.sm) {
      limit = 2;
    } else {
      limit = 1;
    }
  }
  setLimitValue(limit);
});
const setCardWidth = () => {
  if (publicSaleCardContainer.value) {
    containerWidth.value = publicSaleCardContainer.value.clientWidth;
    cardWidth.value = publicSaleCardContainer.value.children[0]
      ? publicSaleCardContainer.value.children[0].clientWidth
      : 0;
    rowCount.value = Math.round(containerWidth.value / (cardWidth.value + 20));
  }
};
onMounted(() => {
  initialAssets();
  const observer = new ResizeObserver(setCardWidth);
  observer.observe(publicSaleCardContainer.value, { box: "border-box" });
});
watch(assetFilterOption, (value) => {
  initialAssets();
});
</script>

<template>
  <div class="relative">
    <accordion ref="assetsAccordion">
      <template v-slot:caption>
        <div class="flex items-center w-full">
          <div class="flex-1 text-sm font-press pt-2.75 pb-1 text-primary-900">
            AI-based NFT
          </div>
        </div>
      </template>
      <div class="p-4">
        <div
          ref="publicSaleCardContainer"
          :class="[
            ledgerPanelVisible && isCartOpened
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4'
              : ledgerPanelVisible || isCartOpened
              ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5'
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6',
            'grid gap-5',
          ]"
        >
          <div v-for="(asset, index) in assets" :key="index">
            <public-sale-asset-card
              :asset="asset"
              :openLeft="
                containerWidth > cardWidth * ((index % rowCount) + 2) + 20
                  ? false
                  : true
              "
              :cardWidth="cardWidth"
            />
          </div>
        </div>
        <div
          v-if="loading"
          class="h-96 flex justify-center items-center font-ibm-bold text-tertiary-500 text-lg"
        >
          Loading...
        </div>
        <div
          v-if="!loading && allAssets.assets.length === 0"
          class="h-96 flex justify-center items-center font-ibm-bold text-tertiary-500 text-lg"
        >
          No NFTs found
        </div>
      </div>
    </accordion>
    <div
      v-if="more && open"
      class="absolute w-full text-13 text-right text-primary-900 font-ibm-medium px-4"
    >
      <span @click="loadMoreAssets()" class="cursor-pointer">See More</span>
    </div>
  </div>
</template>

<script setup>
import Accordion from "../container/AssetsAccordion.vue";
import NftmxSaleCard from "@/core/components/cards/NftmxSaleCard.vue";
import { useStore } from "vuex";
import { computed, onMounted, ref, watch, watchEffect } from "vue";
import marketService from "@/core/services/market.service";
import DerivativeAssetCard from "@/core/components/cards/DerivativeAssetCard.vue";
import { themeConfig, defaultPagination } from "@/core/config/constant";
import NftmxDivider from "@/core/components/basic/NftmxDivider.vue";
import { roundTo } from "@/core/utils/common";
import NftmxTable from "@/core/components/table/NftmxTable.vue";
import NftmxThead from "@/core/components/table/NftmxThead.vue";
import NftmxTh from "@/core/components/table/NftmxTh.vue";
import NftmxTbody from "@/core/components/table/NftmxTbody.vue";
import NftmxTd from "@/core/components/table/NftmxTd.vue";
import NftmxTr from "@/core/components/table/NftmxTr.vue";
import NftmxImg from "@/core/components/basic/NftmxImg.vue";
import Timer from "@/core/components/timer/Timer.vue";
import NftmxButton from "@/core/components/basic/NftmxButton.vue";

const props = defineProps({
  title: String,
  ledgerPanelVisible: Boolean,
  filterOption: Object,
  first: Boolean,
  isCartOpened: Boolean,
  viewOption: String,
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
      props.title === "Explore" ? limit.value * 5 : limit.value
    )
  );
};
const retrieveAssets = async () => {
  return new Promise((resolve, reject) => {
    marketService
      .searchNfts({
        ...props.filterOption,
        type: "DERIVATIVE",
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
onMounted(() => {
  initialAssets();
});
watch(assetFilterOption, (value) => {
  initialAssets();
});
const startDrag = (evt, item) => {
  evt.dataTransfer.dropEffect = "move";
  evt.dataTransfer.effectAllowed = "move";
  evt.dataTransfer.setData("movingItem", JSON.stringify(item));
};
</script>

<template>
  <div class="relative">
    <nftmx-divider v-if="!first" class="mt-11.5 mb-6.5 mx-4" />
    <accordion ref="assetsAccordion">
      <template v-slot:caption>
        <div class="flex items-center w-full">
          <div class="flex-1 text-base font-press pt-2 pb-1">
            {{ title }}
          </div>
        </div>
      </template>
      <div class="p-4">
        <div
          :class="[
            ledgerPanelVisible && isCartOpened
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4'
              : ledgerPanelVisible || isCartOpened
              ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5'
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6',
            'grid gap-4.5',
          ]"
        >
          <div v-for="(asset, index) in assets" :key="index">
            <derivative-asset-card
              :asset="asset"
              :draggable="true"
              @dragstart="startDrag($event, asset)"
              class="cursor-grab active:cursor-grabbing"
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

<style scoped>
tr:hover .td-info {
  display: none;
}
.td-action {
  display: none;
}
tr:hover .td-action {
  display: table-cell;
}
</style>

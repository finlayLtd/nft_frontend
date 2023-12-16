<script setup>
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
import { roundTo, getChainKey } from "@/core/utils/common";
import { useRoute } from "vue-router";
import marketService from "@/core/services/market.service";
import OpenseaAssetCard from "@/core/components/cards/OpenseaAssetCard.vue";

const props = defineProps({
  asset: Object,
});

const store = useStore();
const route = useRoute();
const tokenAddress = route.params.tokenAddress.toLowerCase();
const tokenId = route.params.tokenId.toLowerCase();
const chain = route.params.chain.toUpperCase();
const moreAssets = ref([]);
const open = ref(true);
const aHeight = ref(0);
const anim = ref(null);

const handleClick = () => {
  aHeight.value = anim.value.scrollHeight + "px";
  open.value = !open.value;
};
const getNfts = () => {
  marketService
    .searchNfts({
      chain: chain,
      collection: [tokenAddress],
      type: "DERIVATIVE",
      limit: 6,
    })
    .then((res) => {
      moreAssets.value = res.data.nfts;
      open.value = res.data.nfts && res.data.nfts.length > 0;
    });
};
const setAnimHeight = () => {
  if (anim.value) {
    aHeight.value = anim.value.scrollHeight + "px";
  }
};
onMounted(() => {
  aHeight.value = anim.value.scrollHeight + "px";
  getNfts();
  const observer = new MutationObserver(setAnimHeight);
  observer.observe(anim.value, {
    childList: true,
    subtree: true,
  });
});
</script>

<template>
  <div class="mt-12 font-ibm-bold text-2xl text-white -mx-4">
    <div @click="handleClick" class="flex justify-between cursor-pointer px-4">
      <div>Subcollection Derivatives</div>
      <div class="cursor-pointer pt-2">
        <font-awesome-icon
          v-if="!open"
          :icon="['fas', 'sort-down']"
          class="text-lg -translate-y-1/3"
        />
        <font-awesome-icon
          v-if="open"
          :icon="['fas', 'sort-up']"
          class="text-lg"
        />
      </div>
    </div>
    <div
      :style="{ maxHeight: open ? aHeight : '0' }"
      class="transition-all overflow-hidden px-4"
    >
      <div ref="anim">
        <div>
          <div
            v-if="moreAssets.length > 0"
            class="pt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-4.5"
          >
            <div v-for="(asset, index) in moreAssets" :key="index">
              <opensea-asset-card :asset="asset" />
            </div>
          </div>
          <div
            v-else
            class="font-ibm text-2xl text-white h-60 flex items-center justify-center"
          >
            No derivatives
          </div>
          <div class="text-right font-ibm-medium text-sm text-primary-900 mt-4">
            <router-link
              :to="{
                name: 'collection',
                params: {
                  chain: chain,
                  contractAddress: tokenAddress,
                },
              }"
              class="w-full relative font-ibm-medium"
            >
              <span>View full subcollection</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

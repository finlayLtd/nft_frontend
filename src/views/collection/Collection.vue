<script setup>
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import BodyContainer from "@/core/container/BodyContainer.vue";
import NftmxDivider from "@/core/components/basic/NftmxDivider.vue";
import { onMounted, ref } from "vue";
import Items from "./Items.vue";
import History from "./History.vue";
import marketService from "@/core/services/market.service";
import CollectionHeader from "./CollectionHeader.vue";
import { getChainKey } from "@/core/utils/common";
import { owner } from "../../core/utils/contracts/erc721.utils";
import ListGroupAccordion from "@/core/components/accordion/ListGroupAccordion.vue";
import ListGroupSubItem from "@/core/components/basic/ListGroupSubItem.vue";
import InitialOffering from "./tabs/initial-offering/InitialOffering.vue";
import DerivativeOffering from "./tabs/derivative-offering/DerivativeOffering.vue";
import SubCollection from "./tabs/subcollection/SubCollection.vue";

const store = useStore();
const route = useRoute();
const chain = route.params.chain;
const chainKey = getChainKey(chain);
const contractAddress = route.params.contractAddress.toLowerCase();
const collection = ref({});
const tab = ref("Collections For Sale");
onMounted(() => {
  marketService.getContract(chain, contractAddress, true).then((res) => {
    collection.value = res.data;

    if (!collection.value.bannerUrl) {
      collection.value.bannerUrl =
        "/images/components/default_collection_banner.png";
    }
  });
});
</script>

<template>
  <div
    class="w-full h-62.5 bg-black"
    :style="{
      background: 'url(' + collection.bannerUrl + ')',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundColor: '#222222',
    }"
  />
  <body-container>
    <collection-header
      :collection="collection"
      :contractAddress="contractAddress"
    />
    <div class="border-t border-t-black border-b border-b-tertiary-800" />
    <div class="relative">
      <div
        class="xl:absolute top-3 lg:flex gap-4 font-ibm-medium text-sm my-6 hidden"
      >
        <div
          @click="tab = 'Initial Offering'"
          :class="[
            tab === 'Initial Offering' ? 'text-primary-900' : 'text-white',
            'transition hover:text-primary-900 cursor-pointer ',
          ]"
        >
          Initial Offering
        </div>
        <div class="border-l border-l-black border-r border-r-tertiary-800" />
        <div
          @click="tab = 'Derivatives Offering'"
          :class="[
            tab === 'Derivatives Offering' ? 'text-primary-900' : 'text-white',
            'transition hover:text-primary-900 cursor-pointer ',
          ]"
        >
          Derivatives Offering
        </div>
        <div class="border-l border-l-black border-r border-r-tertiary-800" />
        <div
          @click="tab = 'Collections For Sale'"
          :class="[
            tab === 'Collections For Sale' ? 'text-primary-900' : 'text-white',
            'transition hover:text-primary-900 cursor-pointer ',
          ]"
        >
          Collections For Sale
        </div>
        <div class="border-l border-l-black border-r border-r-tertiary-800" />
        <div
          @click="tab = 'Subcollections For Sale'"
          :class="[
            tab === 'Subcollections For Sale'
              ? 'text-primary-900'
              : 'text-white',
            'transition  hover:text-primary-900 cursor-pointer ',
          ]"
        >
          Subcollections For Sale
        </div>
        <div class="border-l border-l-black border-r border-r-tertiary-800" />
        <div
          @click="tab = 'Trading History'"
          :class="[
            tab === 'Trading History' ? 'text-primary-900' : 'text-white',
            'transition  hover:text-primary-900 cursor-pointer ',
          ]"
        >
          Trading History
        </div>
      </div>
      <list-group-accordion
        :title="tab"
        class="my-3.25 overflow-hidden lg:hidden"
      >
        <list-group-sub-item @click="tab = 'Collections For Sale'">
          Collections For Sale
        </list-group-sub-item>
        <list-group-sub-item @click="tab = 'Trading History'">
          Trading History
        </list-group-sub-item>
      </list-group-accordion>
    </div>
    <div
      class="xl:hidden border-t border-t-black border-b border-b-tertiary-800"
    />
    <initial-offering v-if="tab === 'Initial Offering'" />
    <derivative-offering
      v-if="tab === 'Derivatives Offering'"
      :collection="collection"
    />
    <items v-if="tab === 'Collections For Sale'" :collection="collection" />
    <sub-collection
      v-if="tab === 'Subcollections For Sale'"
      :collection="collection"
    />
    <history v-if="tab === 'Trading History'" />
  </body-container>
</template>

<script setup>
import { useStore } from "vuex";
import { themeConfig } from "@/core/config/constant";
import ListGroupAccordion from "@/core/components/accordion/ListGroupAccordion.vue";
import ListGroupItem from "@/core/components/basic/ListGroupItem.vue";
import ListGroupSubItem from "@/core/components/basic/ListGroupSubItem.vue";
import { computed, onMounted, ref, watch, watchEffect } from "vue";
import usersService from "@/core/services/market/users.service";
import UnderContract from "./tabs/UnderContract.vue";
import MyOffers from "./tabs/MyOffers.vue";
import MyFavorites from "./tabs/MyFavorites.vue";
import { useRoute } from "vue-router";

const props = defineProps({
  account: Object,
});

const store = useStore();
const route = useRoute();
const walletAddress = computed(() => store.getters["auth/walletAddress"]);
const tab = ref("My Offers");

const selectTab = (value) => {
  tab.value = value;
};
</script>

<template>
  <div class="relative">
    <div class="xl:absolute w-full pt-7.5 pb-4.25">
      <div
        v-if="store.state.app.windowWidth >= themeConfig.lg"
        class="overflow-auto text-13 tracking-wider"
      >
        <div class="flex gap-5 py-2 w-max">
          <list-group-item
            :active="tab === 'My Offers'"
            @click="selectTab('My Offers')"
          >
            My Offers
          </list-group-item>
          <div
            class="border-l border-black border-r border-r-tertiary-700 my-1.5"
          />
          <list-group-item
            :active="tab === 'Under Contract'"
            @click="selectTab('Under Contract')"
          >
            Under Contract
          </list-group-item>
          <div
            class="border-l border-black border-r border-r-tertiary-700 my-1.5"
          />
          <list-group-item
            :active="tab === 'My Favorites'"
            @click="selectTab('My Favorites')"
          >
            My Favorites
          </list-group-item>
        </div>
      </div>
      <list-group-accordion
        :title="tab"
        active
        v-if="store.state.app.windowWidth < themeConfig.lg"
      >
        <list-group-sub-item
          :active="tab === 'My Offers'"
          @click="selectTab('My Offers')"
        >
          My Offers
        </list-group-sub-item>
        <list-group-sub-item
          :active="tab === 'Under Contract'"
          @click="selectTab('Under Contract')"
        >
          Under Contract
        </list-group-sub-item>
        <list-group-sub-item
          :active="tab === 'My Favorites'"
          @click="selectTab('My Favorites')"
        >
          My Favorites
        </list-group-sub-item>
      </list-group-accordion>
    </div>
    <under-contract v-if="tab === 'Under Contract'" :account="account" />
    <my-offers v-if="tab === 'My Offers'" />
    <my-favorites v-if="tab === 'My Favorites'" :account="account" />
  </div>
</template>

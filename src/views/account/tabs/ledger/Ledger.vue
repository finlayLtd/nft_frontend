<script setup>
import { useStore } from "vuex";
import { themeConfig } from "@/core/config/constant";
import ListGroupAccordion from "@/core/components/accordion/ListGroupAccordion.vue";
import ListGroupItem from "@/core/components/basic/ListGroupItem.vue";
import ListGroupSubItem from "@/core/components/basic/ListGroupSubItem.vue";
import { computed, onMounted, ref, watch, watchEffect } from "vue";
import usersService from "@/core/services/market/users.service";
import TradingHistory from "./tabs/TradingHistory.vue";
import MyOffers from "./tabs/MyOffers.vue";
import OffersReceived from "./tabs/OffersReceived.vue";
import { useRoute } from "vue-router";

const props = defineProps({
  account: Object,
});

const store = useStore();
const route = useRoute();
const walletAddress = computed(() => store.getters["auth/walletAddress"]);
const tab = ref(
  route.query.tab === "offers-received"
    ? "Offers Received"
    : route.query.tab === "my-offers"
    ? "My Offers"
    : "Transaction History"
);

const selectTab = (value) => {
  tab.value = value;
};
watchEffect(() => {
  if (route.query.tab === "offers-received") {
    tab.value = "Offers Received";
  }
});
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
            :active="tab === 'Transaction History'"
            @click="selectTab('Transaction History')"
          >
            Transaction History
          </list-group-item>
          <div
            class="border-l border-black border-r border-r-tertiary-700 my-1.5"
          />
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
            :active="tab === 'Offers Received'"
            @click="selectTab('Offers Received')"
          >
            Offers Received
          </list-group-item>
        </div>
      </div>
      <list-group-accordion
        :title="tab"
        active
        v-if="store.state.app.windowWidth < themeConfig.lg"
      >
        <list-group-sub-item
          :active="tab === 'Transaction History'"
          @click="selectTab('Transaction History')"
        >
          Transaction History
        </list-group-sub-item>
        <list-group-sub-item
          :active="tab === 'My Offers'"
          @click="selectTab('My Offers')"
        >
          My Offers
        </list-group-sub-item>
        <list-group-sub-item
          :active="tab === 'Offers Received'"
          @click="selectTab('Offers Received')"
        >
          Offers Received
        </list-group-sub-item>
      </list-group-accordion>
    </div>
    <trading-history v-if="tab === 'Transaction History'" :account="account" />
    <my-offers v-if="tab === 'My Offers'" />
    <offers-received v-if="tab === 'Offers Received'" />
  </div>
</template>

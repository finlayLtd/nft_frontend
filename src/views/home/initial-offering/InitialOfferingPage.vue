<script setup>
import { computed, onMounted, ref, watch, watchEffect } from "vue";
import { useStore } from "vuex";
import BodyContainer from "@/core/container/BodyContainer.vue";
import Ledger from "../Ledger.vue";
import InitialOfferingSearchOption from "../initial-offering/InitialOfferingSearchOption.vue";
import { useRoute, useRouter } from "vue-router";
import InitialOffering from "../initial-offering/InitialOffering.vue";
import useDebouncedRef from "@/core/utils/hook/useDebouncedRef.js";

const route = useRoute();
const tab = computed(() => route.query.tab);
const isCartOpened = ref(false);
const mainContent = ref(null);
const ledgerHeight = useDebouncedRef(0, 500);

const ledgerPanelVisible = ref(false);
const initialOfferingFilterOption = ref({
  chain: "",
  name: "",
  min: null,
  max: null,
  sortBy: "",
});
const viewOption = ref("TILE");

const filterInitialOffering = (option) => {
  initialOfferingFilterOption.value = option;
};
const toggleCart = () => {
  isCartOpened.value = !isCartOpened.value;
};
const toggleLedgerPanel = () => {
  ledgerPanelVisible.value = !ledgerPanelVisible.value;
};
const changeView = (val) => {
  viewOption.value = val;
};
const setAnimHeight = () => {
  if (mainContent.value) {
    ledgerHeight.value = mainContent.value.clientHeight;
  }
};
onMounted(() => {
  ledgerHeight.value = mainContent.value.scrollHeight;

  const observer = new ResizeObserver(setAnimHeight);
  observer.observe(mainContent.value, { box: "border-box" });
});
</script>

<template>
  <body-container :padding="false">
    <div>
      <initial-offering-search-option
        :filterOption="initialOfferingFilterOption"
        :viewOption="viewOption"
        @change-view="changeView"
        @apply-filter="filterInitialOffering"
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
      />
      <div class="flex-1 overflow-hidden -mx-4 px-4">
        <div ref="mainContent">
          <initial-offering
            :ledgerPanelVisible="ledgerPanelVisible"
            :filterOption="initialOfferingFilterOption"
            :isCartOpened="isCartOpened"
            :viewOption="viewOption"
          />
        </div>
      </div>
    </div>
  </body-container>
</template>

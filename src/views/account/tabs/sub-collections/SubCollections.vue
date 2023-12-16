<script setup>
import { useStore } from "vuex";
import { themeConfig } from "@/core/config/constant";
import ListGroupAccordion from "@/core/components/accordion/ListGroupAccordion.vue";
import ListGroupItem from "@/core/components/basic/ListGroupItem.vue";
import ListGroupSubItem from "@/core/components/basic/ListGroupSubItem.vue";
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  watchEffect,
} from "vue";
import usersService from "@/core/services/market/users.service";
import Collected from "./tabs/Collected.vue";
import Bundled from "./tabs/Bundled.vue";
import Hidden from "./tabs/Hidden.vue";
import Listing from "./tabs/Listing.vue";
import Downside from "./tabs/Downside.vue";
import Multilevel from "./tabs/Multilevel.vue";
import { io } from "socket.io-client";
const socket = io(import.meta.env.VITE_APP_SERVER_URL);

const props = defineProps({
  account: Object,
});

const store = useStore();
const accountAddress = computed(() => props.account?.walletAddress);
const walletAddress = computed(() => store.getters["auth/walletAddress"]);
const tab = ref("Collected");
const itemCounts = ref({
  collected: 0,
  bundled: 0,
  listed: 0,
  downside: 0,
  multilevel: 0,
  hidden: 0,
});
const selectedCount = computed(() => {
  switch (tab.value) {
    case "Collected":
      return itemCounts.value.collected;
    case "Bundles":
      return itemCounts.value.bundled;
    case "Listing":
      return itemCounts.value.listed;
    case "Under Contract":
      return itemCounts.value.downside;
    case "Multilevel Ownership":
      return itemCounts.value.multilevel;
    case "Hidden":
      return itemCounts.value.hidden;
  }
});

const selectTab = (value) => {
  tab.value = value;
};
const hide = () => {
  itemCounts.value = {
    ...itemCounts.value,
    collected: itemCounts.value.collected - 1,
    hidden: itemCounts.value.hidden + 1,
  };
};
const transfer = (bundle) => {
  if (bundle) {
    itemCounts.value = {
      ...itemCounts.value,
      bundled: itemCounts.value.bundled - 1,
    };
  } else {
    itemCounts.value = {
      ...itemCounts.value,
      collected: itemCounts.value.collected - 1,
    };
  }
};
const unhide = (num) => {
  itemCounts.value = {
    ...itemCounts.value,
    collected: itemCounts.value.collected + (num || 1),
    hidden: itemCounts.value.hidden - (num || 1),
  };
};
const cancelSale = (bundle) => {
  if (bundle) {
    itemCounts.value = {
      ...itemCounts.value,
      bundled: itemCounts.value.bundled + 1,
      listed: itemCounts.value.listed - 1,
    };
  } else {
    itemCounts.value = {
      ...itemCounts.value,
      collected: itemCounts.value.collected + 1,
      listed: itemCounts.value.listed - 1,
    };
  }
};
const getStats = () => {
  usersService
    .stats({
      chain: "BSC-TESTNET",
      type: "DERIVATIVE",
      walletAddress: props.account.walletAddress,
    })
    .then((res) => {
      itemCounts.value = res.data;
    });
};
watchEffect(() => {
  if (props.account) getStats();
});
onMounted(() => {
  if (accountAddress.value) {
    socket.on(`update-derivative-stats/${accountAddress.value}`, (res) => {
      itemCounts.value = res;
    });
  }
});
watch(accountAddress, (val, oldVal) => {
  if (oldVal) {
    socket.removeListener(`update-derivative-stats/${oldVal}`);
  }
  if (val) {
    socket.on(`update-derivative-stats/${val}`, (res) => {
      itemCounts.value = res;
    });
  }
});
onBeforeUnmount(() => {
  socket.removeAllListeners();
});
</script>

<template>
  <div class="relative">
    <div class="xl:absolute w-full pt-7.5 pb-4.25">
      <div
        v-if="store.state.app.windowWidth >= themeConfig.lg"
        class="overflow-auto text-13 tracking-wider"
      >
        <div class="flex gap-2.5 py-2 w-max">
          <list-group-item
            :badge="itemCounts.collected > 0"
            :badgeCount="itemCounts.collected"
            :active="tab === 'Collected'"
            @click="selectTab('Collected')"
          >
            Collected
          </list-group-item>
          <div
            class="border-l border-black border-r border-r-tertiary-700 my-1.5"
          />
          <list-group-item
            :badge="itemCounts.bundled > 0"
            :badgeCount="itemCounts.bundled"
            :active="tab === 'Bundles'"
            @click="selectTab('Bundles')"
          >
            Bundles
          </list-group-item>
          <div
            class="border-l border-black border-r border-r-tertiary-700 my-1.5"
          />
          <list-group-item
            :badge="itemCounts.listed > 0"
            :badgeCount="itemCounts.listed"
            :active="tab === 'Listing'"
            @click="selectTab('Listing')"
          >
            Listing
          </list-group-item>
          <div
            class="border-l border-black border-r border-r-tertiary-700 my-1.5"
          />
          <list-group-item
            :badge="itemCounts.downside > 0"
            :badgeCount="itemCounts.downside"
            :active="tab === 'Under Contract'"
            @click="selectTab('Under Contract')"
          >
            Under Contract
          </list-group-item>
          <div
            class="border-l border-black border-r border-r-tertiary-700 my-1.5"
          />
          <list-group-item
            :badge="itemCounts.multilevel > 0"
            :badgeCount="itemCounts.multilevel"
            :active="tab === 'Multilevel Ownership'"
            @click="selectTab('Multilevel Ownership')"
          >
            Multilevel Ownership
          </list-group-item>
          <div
            class="border-l border-black border-r border-r-tertiary-700 my-1.5"
          />
          <list-group-item
            :badge="itemCounts.hidden > 0"
            :badgeCount="itemCounts.hidden"
            :active="tab === 'Hidden'"
            @click="selectTab('Hidden')"
          >
            Hidden
          </list-group-item>
        </div>
      </div>
      <list-group-accordion
        :title="tab + ' ' + selectedCount"
        active
        v-if="store.state.app.windowWidth < themeConfig.lg"
      >
        <list-group-sub-item
          :active="tab === 'Collected'"
          @click="selectTab('Collected')"
        >
          Collected
          <span class="font-ibm-light">{{ itemCounts.collected }}</span>
        </list-group-sub-item>
        <list-group-sub-item
          :active="tab === 'Bundles'"
          @click="selectTab('Bundles')"
        >
          Bundles
          <span class="font-ibm-light">{{ itemCounts.bundled }}</span>
        </list-group-sub-item>
        <list-group-sub-item
          :active="tab === 'Listing'"
          @click="selectTab('Listing')"
        >
          Listing
          <span class="font-ibm-light">{{ itemCounts.onSale }}</span>
        </list-group-sub-item>
        <list-group-sub-item
          :active="tab === 'Under Contract'"
          @click="selectTab('Under Contract')"
        >
          Under Contract
          <span class="font-ibm-light">{{ itemCounts.downside }}</span>
        </list-group-sub-item>
        <list-group-sub-item
          :active="tab === 'Multilevel Ownership'"
          @click="selectTab('Multilevel Ownership')"
        >
          Multilevel Ownership
          <span class="font-ibm-light">{{ itemCounts.multilevel }}</span>
        </list-group-sub-item>
        <list-group-sub-item
          :active="tab === 'Hidden'"
          @click="selectTab('Hidden')"
        >
          Hidden
          <span class="font-ibm-light">{{ itemCounts.hidden }}</span>
        </list-group-sub-item>
      </list-group-accordion>
    </div>
    <collected v-if="tab === 'Collected'" @hide="hide" :account="account" />
    <bundled v-if="tab === 'Bundles'" @transfer="transfer" :account="account" />
    <listing
      v-if="tab === 'Listing'"
      @cancel-sale="cancelSale"
      :account="account"
    />
    <downside
      v-if="tab === 'Under Contract'"
      @get-stats="getStats"
      :account="account"
    />
    <multilevel v-if="tab === 'Multilevel Ownership'" :account="account" />
    <hidden v-if="tab === 'Hidden'" @unhide="unhide" :account="account" />
  </div>
</template>

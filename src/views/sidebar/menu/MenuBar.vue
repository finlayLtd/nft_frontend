<script setup>
import NftmxDivider from "@/core/components/basic/NftmxDivider.vue";
import ListGroupAccordion from "@/core/components/accordion/ListGroupAccordion.vue";
import MenuFooter from "./MenuFooter.vue";
import SidebarContainer from "@/core/container/SidebarContainer.vue";
import { useStore } from "vuex";
import { computed, ref } from "vue";
import ListGroupItem from "@/core/components/basic/ListGroupItem.vue";
import ListGroupSubItem from "@/core/components/basic/ListGroupSubItem.vue";
import NftmxWalletAddress from "@/core/components/blockchain-address/NftmxWalletAddress.vue";
import { toggleDarkMode } from "@/core/utils/common/window.js";

const emit = defineEmits(["open-modal"]);
const store = useStore();
const walletAddress = computed(() => store.getters["auth/walletAddress"]);
const themeMode = ref(localStorage.getItem("theme"));

const toggleSidebar = () => {
  store.commit("app/TOGGLE_MENU", !store.state.app.menuOpened);
  store.commit("app/TOGGLE_NOTIFICATION_BAR", false);
};
const openAccountModal = () => {
  emit("open-modal");
};
const setThemeMode = (mode) => {
  themeMode.value = mode;
  localStorage.setItem("theme", mode);
  toggleDarkMode();
};
const openConnectWalletModal = () => {
  store.commit("app/OPEN_CONNECT_WALLET_MODAL");
};
</script>

<template>
  <sidebar-container>
    <div
      class="mt-5 mb-7 flex items-center cursor-pointer justify-between"
      @click="toggleSidebar"
    >
      <div>
        <nftmx-wallet-address
          v-if="walletAddress"
          class="pt-1 text-base hover:text-primary-900 transition"
          :address="walletAddress"
          @click="openAccountModal"
        />
      </div>
      <div class="ml-6 flex flex-col gap-1 items-center">
        <div class="w-2 h-2 bg-primary-900 rounded" />
        <div class="w-1.5 h-1.5 bg-primary-900 rounded" />
        <div class="w-1 h-1 bg-primary-900 rounded" />
      </div>
    </div>
    <list-group-accordion open title="Offers">
      <div
        class="py-1.25 cursor-pointer font-ibm text-11 tracking-wider text-primary-900"
        to="/public-sale"
      >
        Public sale
      </div>
      <list-group-sub-item sidebar to="/initial-offering">
        Initial offering
      </list-group-sub-item>
      <list-group-sub-item sidebar to="/derivatives-offering">
        Derivatived offering
      </list-group-sub-item>
      <list-group-sub-item sidebar to="/multilevel">
        Multilevel ownership
      </list-group-sub-item>
    </list-group-accordion>
    <list-group-accordion open title="Rewards" class="mt-5">
      <list-group-sub-item sidebar> Self custody APY </list-group-sub-item>
      <list-group-sub-item sidebar> Airdrops </list-group-sub-item>
      <list-group-sub-item sidebar> Reward program </list-group-sub-item>
      <list-group-sub-item sidebar> 100% reimbursable </list-group-sub-item>
    </list-group-accordion>
    <list-group-accordion
      v-if="walletAddress"
      open
      title="Profile"
      class="mt-5"
    >
      <div
        class="py-1.25 cursor-pointer font-ibm text-11 tracking-wider text-primary-900"
        :to="`/account/${walletAddress}`"
      >
        List an NFT
      </div>
      <list-group-sub-item sidebar :to="`/account/${walletAddress}`">
        My collections
      </list-group-sub-item>
      <list-group-sub-item
        sidebar
        :to="`/account/${walletAddress}?category=subcollections`"
      >
        My subcollections
      </list-group-sub-item>
      <list-group-sub-item
        sidebar
        :to="`/account/${walletAddress}?category=ledger`"
      >
        My ledger
      </list-group-sub-item>
      <list-group-sub-item
        sidebar
        :to="`/account/${walletAddress}?category=ledger&tab=my-offers`"
      >
        My offers
      </list-group-sub-item>
    </list-group-accordion>
    <list-group-accordion v-else open title="Profile" class="mt-5">
      <div
        class="py-1.25 cursor-pointer font-ibm text-11 tracking-wider text-primary-900"
        @click="openConnectWalletModal"
      >
        List an NFT
      </div>
      <list-group-sub-item sidebar @click="openConnectWalletModal">
        My collections
      </list-group-sub-item>
      <list-group-sub-item sidebar @click="openConnectWalletModal">
        My subcollections
      </list-group-sub-item>
      <list-group-sub-item sidebar @click="openConnectWalletModal">
        My ledger
      </list-group-sub-item>
      <list-group-sub-item sidebar @click="openConnectWalletModal">
        My offers
      </list-group-sub-item>
    </list-group-accordion>
    <list-group-accordion open title="Become a partner" class="mt-5">
      <list-group-sub-item sidebar> Display us </list-group-sub-item>
      <list-group-sub-item sidebar> Affiliate program </list-group-sub-item>
      <list-group-sub-item sidebar> Spinoff collection </list-group-sub-item>
      <list-group-sub-item sidebar> Launch your DVC </list-group-sub-item>
      <list-group-sub-item sidebar> Apply for license </list-group-sub-item>
    </list-group-accordion>
    <list-group-accordion open title="Community" class="mt-5">
      <list-group-sub-item sidebar>Help center</list-group-sub-item>
      <list-group-sub-item sidebar>Suggestions</list-group-sub-item>
      <list-group-sub-item sidebar>FAQ</list-group-sub-item>
      <list-group-sub-item sidebar>Blog</list-group-sub-item>
    </list-group-accordion>
    <list-group-accordion open title="Company" class="mt-5">
      <list-group-sub-item sidebar>About</list-group-sub-item>
      <list-group-sub-item sidebar>Whitepaper</list-group-sub-item>
    </list-group-accordion>
    <list-group-accordion open title="Social media" class="mt-5">
      <list-group-sub-item sidebar>
        <div class="flex">
          <div class="w-3 mr-4 text-center">
            <font-awesome-icon :icon="['fab', 'instagram']" />
          </div>
          Instagram
        </div>
      </list-group-sub-item>
      <list-group-sub-item sidebar>
        <div class="flex">
          <div class="w-3 mr-4 text-center">
            <font-awesome-icon :icon="['fab', 'telegram-plane']" />
          </div>
          Telegram
        </div>
      </list-group-sub-item>
      <list-group-sub-item sidebar>
        <div class="flex">
          <div class="w-3 mr-4 text-center">
            <font-awesome-icon :icon="['fab', 'discord']" />
          </div>
          Discord
        </div>
      </list-group-sub-item>
      <list-group-sub-item sidebar>
        <div class="flex">
          <div class="w-3 mr-4 text-center">
            <font-awesome-icon :icon="['fab', 'twitter']" />
          </div>
          Twitter
        </div>
      </list-group-sub-item>
      <list-group-sub-item sidebar>
        <div class="flex">
          <div class="w-3 mr-4 text-center">
            <font-awesome-icon :icon="['fab', 'medium-m']" />
          </div>
          Medium
        </div>
      </list-group-sub-item>
    </list-group-accordion>
    <router-link
      to="/"
      class="mt-6 py-1.25 transition cursor-pointer font-ibm-medium text-13 tracking-wider text-tertiary-400"
    >
      Privacy of policy
    </router-link>
    <router-link
      to="/"
      class="py-1.25 transition cursor-pointer font-ibm-medium text-13 tracking-wider text-tertiary-400"
    >
      Terms of service
    </router-link>
    <div class="py-7 flex gap-6">
      <font-awesome-icon
        :icon="['fas', 'moon']"
        :class="[
          themeMode === 'dark' ? 'text-primary-900' : 'text-tertiary-400',
          'text-lg transition hover:text-primary-900 cursor-pointer',
        ]"
        @click="setThemeMode('dark')"
      />
      <font-awesome-icon
        :icon="['fas', 'sun']"
        :class="[
          themeMode === 'light' ? 'text-primary-900' : 'text-tertiary-400',
          'text-lg transition hover:text-primary-900 cursor-pointer',
        ]"
        @click="setThemeMode('light')"
      />
    </div>
    <nftmx-divider class="border-tertiary-900 mt-3 mb-9"></nftmx-divider>
    <menu-footer />
  </sidebar-container>
</template>

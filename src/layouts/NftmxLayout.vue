<script setup>
import NavBar from "@/views/navbar/NavBar.vue";
import { computed } from "vue";
import { useRouter } from "vue-router";
import ConnectWalletModal from "@/core/components/modal/ConnectWalletModal.vue";
import { useStore } from "vuex";

const store = useStore();
const router = useRouter();
const path = computed(() => router.currentRoute.value.path);
</script>

<template>
  <nav-bar v-if="path !== '/'" />
  <router-view />
  <connect-wallet-modal v-model="store.state.app.connectWalletPop" />
</template>

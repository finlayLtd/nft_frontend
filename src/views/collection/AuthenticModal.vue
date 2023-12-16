<script setup>
import { ref, onMounted, computed, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import NftmxButton from "@/core/components/basic/NftmxButton.vue";
import { useStore } from "vuex";
import { useToast } from "vue-toastification";
import { $vfm } from "vue-final-modal";
import NftmxInput from "@/core/components/basic/NftmxInput.vue";
import Web3 from "web3/dist/web3.min.js";
import erc721ABI from "@/core/config/abi/erc721";
import collectionsService from "@/core/services/market/collections.service";

const store = useStore();
const route = useRoute();
const chain = route.params.chain;
const router = useRouter();
const tokenAddress = route.params.contractAddress;
const toast = useToast();
const authenticStatus = ref(null);
const showRecheck = ref(false);
const loading = ref(false);
const address = ref();
const tokenId = ref();

const checkAuthentic = async () => {
  if (!address.value) return;
  collectionsService
    .checkAuthentic({
      contractAddress: tokenAddress,
      address: address.value,
      tokenId: tokenId.value,
    })
    .then((res) => {
      showRecheck.value = true;
      if (res.data === true) {
        authenticStatus.value = "AUTHORIZED";
      } else {
        authenticStatus.value = "UNAUTHORIZED";
      }
    })
    .catch(() => {
      showRecheck.value = true;
      authenticStatus.value = "UNAUTHORIZED";
    });
};
const recheckAuthentic = () => {
  showRecheck.value = false;
  authenticStatus.value = null;
};
const cancel = () => {
  $vfm.hide("authenticModal");
};
</script>

<template>
  <vue-final-modal
    classes="w-full flex justify-center overflow-y-auto"
    content-class="my-4 lg:my-auto mx-4 h-fit"
    :overlay-style="{ backgroundColor: 'black', opacity: '0.9' }"
    name="authenticModal"
    esc-to-close
    fit-parent
    @before-close="recheckAuthentic"
  >
    <div class="bg-tertiary-900 text-white xl:w-home-lg">
      <div class="text-right text-xl p-5">
        <font-awesome-icon
          :icon="['fas', 'times']"
          class="cursor-pointer hover:text-tertiary-400 transition"
          @click="cancel"
        />
      </div>
      <div class="text-center relative mt-1.75">
        <div class="font-press text-xl sm:text-2xl">Check NFT Authenticity</div>
      </div>
      <div class="text-white pt-10.5 pb-17.5 px-4 lg:px-17.25">
        <div class="font-ibm-bold text-sm sm:text-lg py-2 sm:leading-6">
          Check if your NFT and this collection are connected
        </div>
        <div class="bg-tertiary-700 border border-black text-sm mt-3">
          <nftmx-input
            v-model="address"
            class="h-13"
            placeholder="Contract address"
          />
        </div>
        <div class="bg-tertiary-700 border border-black text-sm mt-4">
          <nftmx-input v-model="tokenId" class="h-13" placeholder="Token ID" />
        </div>
        <div v-if="!authenticStatus" class="mt-12 font-press text-lg">
          <nftmx-button
            @click="checkAuthentic"
            label="CHECK AUTHENTIC"
            color="primary"
            :class="[loading ? 'cursor-wait' : 'cursor-pointer', 'w-full']"
            h="xl"
          />
        </div>
        <div
          v-if="authenticStatus === 'AUTHORIZED'"
          class="mt-12.5 h-16.5 bg-black text-primary-900 leading-6 flex items-center justify-center gap-5"
        >
          <font-awesome-icon :icon="['fas', 'check-circle']" class="text-4xl" />
          <div class="font-press text-sm leading-6">
            Your NFT is collection authentic
          </div>
        </div>
        <div
          v-if="authenticStatus === 'UNAUTHORIZED'"
          class="mt-12.5 h-16.5 bg-black text-red-600 leading-6 flex items-center justify-center gap-5"
        >
          <font-awesome-icon :icon="['fas', 'times-circle']" class="text-4xl" />
          <div class="font-press text-sm leading-6">
            The NFT is not authentic to this collection
          </div>
        </div>
        <div class="relative">
          <div class="absolute text-center mt-2.5 w-full">
            <span
              v-if="showRecheck"
              @click="recheckAuthentic"
              class="text-primary-900 transition hover:text-primary-700 font-ibm text-11 tracking-wider cursor-pointer"
            >
              Recheck Authenticity
            </span>
          </div>
        </div>
      </div>
    </div>
  </vue-final-modal>
</template>

<style scoped>
.text-1\.5xl {
  font-size: 1.3125rem;
}
</style>

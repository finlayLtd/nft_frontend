<script setup>
import BasicAccordion from "@/core/components/accordion/BasicAccordion.vue";
import {
  filterStatus,
  ChainNames,
  sortBy,
  CHAIN_ROUTES,
  themeConfig,
  MainToken,
} from "@/core/config/constant";
import NftmxInput from "@/core/components/basic/NftmxInput.vue";
import NftmxButton from "@/core/components/basic/NftmxButton.vue";
import { ref } from "vue";
import Web3 from "web3/dist/web3.min.js";
import nftsService from "@/core/services/market/nfts.service";
import { useToast } from "vue-toastification";

const toast = useToast();
const open = ref(false);
const networkDisplay = ref("Choose network");
const network = ref("");
const chainKey = ref("");
const tokenAddress = ref("");
const tokenId = ref("");
const liquidity = ref(0);
const loading = ref(false);
const checked = ref(false);

const handleClick = () => {
  open.value = !open.value;
};
const onClickOutside = () => {
  open.value = false;
};
const check = () => {
  if (!tokenAddress.value || !tokenId.value) {
    toast.error("Please add NFT info");
    return;
  }
  loading.value = true;
  nftsService
    .checkLiquidity(network.value, tokenAddress.value, tokenId.value)
    .then((res) => {
      liquidity.value = res.data;
      checked.value = true;
    })
    .finally(() => {
      loading.value = false;
    });
};
</script>

<template>
  <div
    class="bg-black text-tertiary-400 text-center font-ibm-medium pt-14 pb-15 px-5 sm:px-10 md:px-16 lg:px-22"
  >
    <div v-if="!checked">
      <div class="text-white font-press text-lg">
        Liquidity Protection Verification
      </div>
      <div class="mt-2.75">Check if a NFT is under liquidity protection</div>
      <div
        class="flex flex-col xl:flex-row justify-center items-center gap-7 mt-8.5 text-sm"
      >
        <div class="h-13 relative w-full xl:w-72">
          <div
            class="absolute z-10 border-2 border-tertiary-700 w-full shadow-default shadow-tertiary-700 bg-tertiary-900"
            v-click-outside="onClickOutside"
          >
            <basic-accordion
              :border="false"
              v-model="open"
              @handle-click="handleClick"
              handleEmit
              class="w-full"
            >
              <template v-slot:caption>
                <div
                  class="text-sm font-ibm-medium text-left w-full py-3.5 h-12.5"
                >
                  {{ networkDisplay }}
                </div>
              </template>
              <div class="text-left px-5 text-sm cursor-pointer">
                <div
                  class="py-1.5 hover:text-white transition"
                  v-for="(value, key) in ChainNames"
                  :key="key"
                  @click="
                    () => {
                      networkDisplay = value;
                      network = CHAIN_ROUTES[key];
                      chainKey = key;
                      open = false;
                    }
                  "
                >
                  {{ value }}
                </div>
              </div>
            </basic-accordion>
          </div>
        </div>
        <div class="h-13 relative w-full xl:w-72 z-0">
          <div
            class="absolute z-10 border-2 border-tertiary-700 w-full shadow-default shadow-tertiary-700 bg-tertiary-900"
          >
            <div class="bg-tertiary-900">
              <nftmx-input
                class="h-12.5"
                border="none"
                placeholder="Contract address"
                v-model="tokenAddress"
              />
            </div>
          </div>
        </div>
        <div class="h-13 relative w-full xl:w-72 z-0">
          <div
            class="absolute border-2 border-tertiary-700 w-full shadow-default shadow-tertiary-700 bg-tertiary-900"
          >
            <div class="bg-tertiary-900">
              <nftmx-input
                class="h-12.5"
                border="none"
                placeholder="Token ID"
                v-model="tokenId"
              />
            </div>
          </div>
        </div>
        <div class="w-full xl:w-40">
          <nftmx-button
            color="primary"
            label="CHECK"
            outline
            h="md"
            textColor="primary-900"
            w="full"
            class="font-press text-sm"
            @click="check"
            :loading="loading"
          />
        </div>
      </div>
    </div>
    <div v-else class="font-ibm-bold">
      <div
        v-if="liquidity > 0"
        class="flex items-center justify-center text-primary-900 mt-1.5"
      >
        <font-awesome-icon :icon="['fas', 'check-circle']" class="text-4xl" />
        <span class="text-2xl ml-8">
          This NFT is protected with {{ liquidity }}
          {{ MainToken[chainKey] }} liquidity
        </span>
      </div>
      <div v-else class="flex items-center justify-center text-red-600 mt-1.5">
        <font-awesome-icon :icon="['fas', 'times-circle']" class="text-4xl" />
        <span class="text-2xl ml-8">
          This NFT is not protected with liquidity
        </span>
      </div>
      <div class="text-sm mt-4.5">
        <span
          class="hover:text-white transition cursor-pointer"
          @click="
            () => {
              checked = false;
            }
          "
        >
          Run Another Check
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import BundleImage from "@/core/components/basic/BundleImage.vue";
import NftmxTrimString from "@/core/components/basic/NftmxTrimString.vue";
import NftmxImg from "@/core/components/basic/NftmxImg.vue";
import { computed } from "vue";
import Web3 from "web3/dist/web3.min.js";
import NftmxTooltip from "../basic/NftmxTooltip.vue";
import { roundTo, getChainKey } from "@/core/utils/common";
import { useStore } from "vuex";

const props = defineProps({
  collection: Object,
});

const store = useStore();
const coinPrice = computed(() => store.state.market.coinPrice);
</script>

<template>
  <router-link
    :to="{
      name: 'collection',
      params: { chain: collection.chain, contractAddress: collection.address },
    }"
    class="w-full relative font-ibm-medium p-3"
  >
    <div
      class="hover:shadow-default hover:shadow-primary-900 transition grid grid-cols-5 h-75 parent"
    >
      <div class="bg-black relative col-span-2">
        <bundle-image
          class="absolute top-0 left-0"
          :images="
            collection.nftImages && collection.nftImages.length > 0
              ? collection.nftImages
              : ''
          "
        />
        <div
          class="child transition absolute top-0 left-0 w-full h-full bg-black flex items-center justify-center text-xs"
        >
          <div class="w-4/5">
            <div class="flex justify-between">
              <span class="text-primary-700">Offers</span>
              <span class="text-red-400">Lists</span>
            </div>
            <div
              class="relative w-full progress-bar mt-1"
              :style="{
                '--p':
                  collection.listings + collection.offers > 0
                    ? roundTo(
                        (collection.offers /
                          (collection.listings + collection.offers)) *
                          100,
                        1
                      )
                    : 50,
              }"
            >
              <div class="flex justify-between px-2 text-white">
                <span>
                  {{
                    roundTo((collection.offers / collection.items) * 100, 1)
                  }}%
                </span>
                <span>
                  {{
                    roundTo((collection.listings / collection.items) * 100, 1)
                  }}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="relative col-span-3">
        <div
          class="w-2 h-2 absolute -right-0.5 top-9.5 bg-primary-900 bg-opacity-60 rotate-45"
        />
        <div class="relative bg-tertiary-700 px-5 pt-17.25 h-full">
          <div class="flex gap-4 w-full overflow-hidden">
            <div class="w-11 h-11 bg-black">
              <nftmx-img
                :src="collection.logoUrl"
                class="w-full h-full object-cover object-center"
              />
            </div>
            <div class="flex-1">
              <div class="text-tertiary-400 text-xs">Created by</div>
              <nftmx-trim-string
                :line="1"
                class="text-white text-lg mt-2.25 leading-5"
              >
                {{ collection.name }}
              </nftmx-trim-string>
            </div>
            <div>
              <span class="text-11 text-tertiary-400"> 55 </span>
              <font-awesome-icon
                :icon="['fas', 'thumbs-up']"
                class="text-sm text-primary-900"
              />
            </div>
          </div>
          <div class="flex gap-2 items-center mt-4.5 mb-1">
            <div
              class="border-t border-t-black border-b border-b-tertiary-600 w-full h-0"
            />
            <div
              class="text-black font-ibm-bold text-shadow-h1 text-11 whitespace-nowrap"
            >
              Liquidity Protection
            </div>
            <div
              class="border-t border-t-black border-b border-b-tertiary-600 w-full h-0"
            />
          </div>
          <div class="flex justify-between text-11 text-white">
            <div>
              <span class="font-ibm-medium">Maximum Period</span>
              <nftmx-tooltip
                text="Maximum protection period in this collection"
              >
                <sup>
                  <font-awesome-icon
                    :icon="['fas', 'question-circle']"
                    class="ml-1 text-10 cursor-pointer"
                  />
                </sup>
              </nftmx-tooltip>
            </div>
            <div class="text-primary-900 font-ibm">365 Days</div>
          </div>
          <div class="flex justify-between text-11 text-white">
            <div>
              <span class="font-ibm-medium">Minimum Fees</span>
              <nftmx-tooltip text="Minimum slippage fees in this collection">
                <sup>
                  <font-awesome-icon
                    :icon="['fas', 'question-circle']"
                    class="ml-1 text-10 cursor-pointer"
                  />
                </sup>
              </nftmx-tooltip>
            </div>
            <div class="text-primary-900 font-ibm">
              <span> Slippage 0% </span>
              <span class="text-tertiary-400"> | </span>
              <span> Staking leverage </span>
            </div>
          </div>
          <div
            class="border-t border-t-black border-b border-b-tertiary-600 w-full h-0 mt-3.5"
          />
          <div class="grid grid-cols-2 gap-6 mt-3.5 text-11 text-white">
            <div class="flex justify-between">
              <div>
                <span class="font-ibm-medium">Items/Listing</span>
              </div>
              <div class="text-primary-900 font-ibm">
                <span>
                  {{
                    collection.items.toLocaleString("en-US", {
                      notation: "compact",
                      compactDisplay: "short",
                    })
                  }}
                </span>
                <span class="text-tertiary-400"> [1.23%] </span>
              </div>
            </div>
            <div class="flex justify-between">
              <div>
                <span class="font-ibm-medium">Bottom Bid</span>
              </div>
              <div class="text-primary-900 font-ibm flex items-center gap-1">
                <font-awesome-icon
                  v-if="collection.chain === 'ETHEREUM'"
                  :icon="['fab', 'ethereum']"
                />
                <div
                  v-if="collection.chain === 'BSC-TESTNET'"
                  class="w-2.75 h-2.75 fill-primary-900"
                >
                  <svg viewBox="0 0 24 24">
                    <path
                      d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                    />
                  </svg>
                </div>
                <span>
                  {{
                    collection.stats
                      ? collection.stats.bottomBid.toLocaleString("en-US", {
                          notation: "compact",
                          compactDisplay: "short",
                          maximumFractionDigits: 2,
                        })
                      : 0
                  }}
                </span>
                <span class="text-tertiary-400">
                  [${{
                    collection.stats
                      ? (
                          collection.stats.bottomBid *
                          coinPrice[getChainKey(collection.chain)]
                        ).toLocaleString("en-US", {
                          notation: "compact",
                          compactDisplay: "short",
                          maximumFractionDigits: 2,
                        })
                      : 0
                  }}]
                </span>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-6 text-11 text-white">
            <div class="flex justify-between">
              <div>
                <span class="font-ibm-medium">Owners/Unique</span>
              </div>
              <div class="text-primary-900 font-ibm">
                <span>
                  {{
                    collection.owners.toLocaleString("en-US", {
                      notation: "compact",
                      compactDisplay: "short",
                    })
                  }}
                </span>
                <span class="text-tertiary-400"> [32.23%] </span>
              </div>
            </div>
            <div class="flex justify-between">
              <div>
                <span class="font-ibm-medium">Floor Price</span>
              </div>
              <div class="text-primary-900 font-ibm flex items-center gap-1">
                <font-awesome-icon
                  v-if="collection.chain === 'ETHEREUM'"
                  :icon="['fab', 'ethereum']"
                />
                <div
                  v-if="collection.chain === 'BSC-TESTNET'"
                  class="w-2.75 h-2.75 fill-primary-900"
                >
                  <svg viewBox="0 0 24 24">
                    <path
                      d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                    />
                  </svg>
                </div>
                <span>
                  {{
                    collection.stats
                      ? collection.stats.floor.toLocaleString("en-US", {
                          notation: "compact",
                          compactDisplay: "short",
                          maximumFractionDigits: 2,
                        })
                      : 0
                  }}
                </span>
                <span class="text-tertiary-400">
                  [${{
                    collection.stats
                      ? (
                          collection.stats.floor *
                          coinPrice[getChainKey(collection.chain)]
                        ).toLocaleString("en-US", {
                          notation: "compact",
                          compactDisplay: "short",
                          maximumFractionDigits: 2,
                        })
                      : 0
                  }}]
                </span>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-6 text-11 text-white">
            <div class="flex justify-between">
              <div>
                <span class="font-ibm-medium">7D Volume</span>
              </div>
              <div class="text-primary-900 font-ibm flex items-center gap-1">
                <font-awesome-icon
                  v-if="collection.chain === 'ETHEREUM'"
                  :icon="['fab', 'ethereum']"
                />
                <div
                  v-if="collection.chain === 'BSC-TESTNET'"
                  class="w-2.75 h-2.75 fill-primary-900"
                >
                  <svg viewBox="0 0 24 24">
                    <path
                      d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                    />
                  </svg>
                </div>
                <span> 35.5634 </span>
                <span class="text-tertiary-400"> [$256.52k] </span>
              </div>
            </div>
            <div class="flex justify-between">
              <div>
                <span class="font-ibm-medium">Floor Change</span>
              </div>
              <div class="text-primary-900 font-ibm">
                <span> +5% </span>
              </div>
            </div>
          </div>
        </div>
        <div
          class="absolute top-0 -right-1 w-fill h-10.5 bg-primary-900 bg-opacity-60 px-4 flex gap-2 items-center text-sm text-white leading-4 justify-center"
        >
          <font-awesome-icon :icon="['fas', 'shield-alt']" />
          <span> 100% Liquidity Protection </span>
        </div>
      </div>
    </div>
  </router-link>
</template>

<style scoped>
.w-fill {
  width: calc(100% + 4px);
}
.child {
  opacity: 0;
}
.parent:hover .child {
  opacity: 0.8;
}
.progress-bar {
  --p: 50; /* percentage of the progress without unit */

  height: 24px;
  line-height: 24px;
  background: linear-gradient(
    120deg,
    rgb(44, 233, 112) calc(1% * var(--p)),
    rgb(248, 113, 113) calc(1% * var(--p)),
    rgb(248, 113, 113)
  );
  background-repeat: no-repeat;
  text-align: center;
}
</style>

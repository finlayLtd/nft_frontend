<script setup>
import BundleImage from "@/core/components/basic/BundleImage.vue";
import NftmxTrimString from "@/core/components/basic/NftmxTrimString.vue";
import NftmxImg from "@/core/components/basic/NftmxImg.vue";
import { computed } from "vue";
import Web3 from "web3/dist/web3.min.js";
import NftmxTooltip from "../basic/NftmxTooltip.vue";

const props = defineProps({
  collection: Object,
});
</script>

<template>
  <router-link
    :to="{
      name: 'collection',
      params: { chain: collection.chain, contractAddress: collection.address },
    }"
    class="w-full relative font-ibm-medium p-2.5 subcollection-card"
  >
    <div class="hover:shadow-default hover:shadow-primary-900 transition">
      <div class="relative bg-tertiary-700 px-5 pt-6 pb-8.25 h-full">
        <div
          class="relative flex items-center gap-4 after:absolute after:top-13 after:h-9.5 after:border-l after:border-l-black after:left-5.5"
        >
          <img
            :src="collection.originNft.contract.imageUrl"
            class="w-11 h-11"
          />
          <div>
            <div class="text-xs text-tertiary-400">Collection</div>
            <nftmx-trim-string
              class="text-white font-ibm-bold text-lg leading-none mt-2"
            >
              {{ collection.originNft.contract.name }}
            </nftmx-trim-string>
          </div>
        </div>
        <div
          class="relative mt-5.5 pl-16 before:absolute before:left-0 before:top-1/2 before:border-t before:border-b before:border-t-black before:border-b-tertiary-600 before:w-8 before:ml-5.5 after:absolute after:top-13 after:h-9.5 after:border-l after:border-l-tertiary-400 after:left-21.75"
        >
          <div class="flex items-center gap-4">
            <img :src="collection.originNft.imageUrl" class="w-11.25 h-11.25" />
            <div class="text-11">
              <div class="text-tertiary-400">Locked NFT</div>
              <nftmx-trim-string class="text-white font-ibm-medium">
                {{ collection.originNft.name }}
              </nftmx-trim-string>
            </div>
          </div>
        </div>
        <div
          class="absolute w-full h-8 left-0 bottom-0 bg-gradient-to-t from-tertiary-200"
        />
      </div>
      <div class="relative z-10 transition subcollection-img">
        <div class="bg-black relative w-full pt-[80%] p-6">
          <bundle-image
            class="absolute top-0 left-0"
            :images="
              collection.nfts && collection.nfts.length > 0
                ? collection.nfts.map((item) => item.imageUrl)
                : ''
            "
          />
          <!-- <bundle-image
            class="absolute top-0 left-0"
            :images="
              collection.nftImages && collection.nftImages.length > 0
                ? collection.nftImages
                : ''
            "
          /> -->
        </div>
        <div
          class="absolute top-0 -right-1 w-fill h-11 bg-primary-900 bg-opacity-60 px-4 flex items-center"
        >
          <div
            class="flex w-full justify-center items-center gap-2 text-sm text-white leading-4"
          >
            <font-awesome-icon :icon="['fas', 'shield-alt']" />
            100% Liquidity Protection
          </div>
          <div
            class="w-2 h-2 absolute right-0.5 -bottom-1 bg-primary-900 rotate-45 -z-10"
          />
        </div>
        <div
          class="absolute top-0 -right-1 w-fill bg-tertiary-900 px-4 h-11 -z-10"
        />
        <div
          class="absolute z-15 bottom-2 left-3 flex flex-col gap-1 transition fill-tertiary-900 text-tertiary-900"
        >
          <nftmx-tooltip
            :adjust="10"
            :text="
              'This Collection belongs to the ' +
              (collection.chain === 'ETHEREUM' ? 'Ethereum' : 'BSC Testnet') +
              ' blockchain'
            "
          >
            <div
              class="child rounded-full w-7 h-7 flex items-center justify-center"
            >
              <font-awesome-icon
                v-if="collection.chain === 'ETHEREUM'"
                :icon="['fab', 'ethereum']"
                class="text-lg"
              />
              <div v-if="collection.chain === 'BSC-TESTNET'" class="w-4 h-4">
                <svg viewBox="0 0 24 24">
                  <path
                    d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                  />
                </svg>
              </div>
            </div>
          </nftmx-tooltip>
          <nftmx-tooltip
            :adjust="10"
            text="This Collection is for sale with 100% liquidity protection"
          >
            <div
              class="child rounded-full w-7 h-7 flex items-center justify-center"
            >
              <font-awesome-icon
                :icon="['fas', 'shield-alt']"
                class="text-base"
              />
            </div>
          </nftmx-tooltip>
        </div>
      </div>
      <div class="relative bg-tertiary-700 px-5 pt-6 pb-6.5 h-full">
        <div class="flex gap-2 items-center">
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
        <div
          class="flex justify-between text-11 leading-4.5 text-white mt-2.25"
        >
          <div>
            <span class="font-ibm-medium">Maximum Period</span>
            <nftmx-tooltip text="Maximum protection period in this collection">
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
        <div class="flex justify-between text-11 leading-4.5 text-white">
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
            <span> Staking </span>
          </div>
        </div>
        <div
          class="border-t border-t-black border-b border-b-tertiary-600 w-full h-0 mt-4.5"
        />
        <div
          class="flex justify-between text-11 leading-4.5 mt-3.75 text-white"
        >
          <div>
            <span class="font-ibm-medium">Items/Listing</span>
          </div>
          <div class="text-primary-900 font-ibm">
            <span> 103.4k </span>
            <span class="text-tertiary-400"> [1.23%] </span>
          </div>
        </div>
        <div class="flex justify-between text-11 leading-4.5 text-white">
          <div>
            <span class="font-ibm-medium">Owners/Unique</span>
          </div>
          <div class="text-primary-900 font-ibm">
            <span> 18.5k </span>
            <span class="text-tertiary-400"> [32.23%] </span>
          </div>
        </div>
        <div class="flex justify-between text-11 leading-4.5 text-white">
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
            <span> 3.6 </span>
            <span class="text-tertiary-400"> [$3.6k] </span>
          </div>
        </div>
        <div class="flex justify-between text-11 leading-4.5 text-white">
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
            <span> 0.25 </span>
            <span class="text-tertiary-400"> [$785,63] </span>
          </div>
        </div>
      </div>
    </div>
  </router-link>
</template>

<style scoped>
.w-fill {
  width: calc(100% + 4px);
}
.subcollection-card:hover .subcollection-img {
  --tw-shadow-color: #19cb58;
  --tw-shadow: var(--tw-shadow-colored);
  --tw-shadow-colored: 0 0px 12px 0px var(--tw-shadow-color),
    0 0px 0px 0px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
    var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}
.subcollection-card:hover .child {
  background-color: rgb(21, 21, 21);
  color: rgb(148, 148, 148);
  fill: rgb(148, 148, 148);
}
</style>

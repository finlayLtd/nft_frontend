<script setup>
import { computed, onMounted, ref } from "vue";
import AuthenticModal from "./AuthenticModal.vue";
import NftmxTrimString from "@/core/components/basic/NftmxTrimString.vue";
import Web3 from "web3/dist/web3.min.js";
import NftmxImg from "@/core/components/basic/NftmxImg.vue";
import { useStore } from "vuex";
import { themeConfig } from "@/core/config/constant";
import { useRoute } from "vue-router";
import CollectionReportModal from "@/core/components/modal/CollectionReportModal.vue";
import { roundTo, getChainKey } from "@/core/utils/common";

const props = defineProps({
  collection: Object,
  contractAddress: String,
});

const store = useStore();
const userId = computed(() => store.getters["auth/userId"]);
const route = useRoute();
const chain = route.params.chain;
const chainKey = getChainKey(chain);
const coinPrice = computed(() => store.state.market.coinPrice[chainKey] || 1);
const windowWidth = computed(() => store.state.app.windowWidth);
const authenticModal = ref(false);
const reportModal = ref(false);
const items = computed(() =>
  props.collection.items
    ? props.collection.items.toLocaleString("en-US", {
        notation: "compact",
        compactDisplay: "short",
      })
    : 0
);
const subItems = computed(() =>
  props.collection.subItems
    ? props.collection.subItems.toLocaleString("en-US", {
        notation: "compact",
        compactDisplay: "short",
      })
    : 0
);
const owners = computed(() =>
  props.collection.owners
    ? props.collection.owners.toLocaleString("en-US", {
        notation: "compact",
        compactDisplay: "short",
      })
    : 0
);
</script>

<template>
  <div class="lg:flex gap-8 mt-8.75">
    <div class="flex gap-6 lg:block">
      <div>
        <div
          class="w-23 h-23 md:w-30 md:h-30 lg:w-50 lg:h-50 shadow-default shadow-primary-900 text-6xl"
        >
          <nftmx-img
            :src="collection.imageUrl"
            class="w-full h-full object-cover object-center"
          />
        </div>
        <div
          class="flex gap-2 py-2 mt-3 justify-center cursor-pointer text-primary-900 border-2 border-black shadow-default shadow-black transition hover:bg-black"
          @click="authenticModal = true"
        >
          <div class="w-4 h-4 text-white relative">
            <nftmx-img src="/images/components/shield.png" />
          </div>
          <span class="text-11">Check NFT Authenticity</span>
        </div>
      </div>
      <div v-if="windowWidth < themeConfig.lg">
        <div class="font-press text-white text-xl md:text-2xl">
          <nftmx-trim-string :line="windowWidth > themeConfig.xl2 ? 1 : 2">
            {{ collection.name }}
          </nftmx-trim-string>
        </div>
        <div class="flex justify-between">
          <div class="font-ibm text-xs mt-2.25">
            <span class="text-tertiary-400"> Created by </span>
            <span class="text-primary-900">{{ collection.name }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="flex-1 py-3.5">
      <div class="2xl:flex gap-6 items-start justify-between">
        <div v-if="windowWidth >= themeConfig.lg">
          <div class="font-press text-white text-2xl xl:text-3xl">
            <nftmx-trim-string :line="windowWidth > themeConfig.xl2 ? 1 : 2">
              {{ collection.name }}
            </nftmx-trim-string>
          </div>
          <div class="flex justify-between">
            <div class="flex gap-2 font-ibm text-xs mt-2.25">
              <div class="text-tertiary-400">Created by</div>
              <div class="text-primary-900">{{ collection.name }}</div>
            </div>
          </div>
        </div>
        <div
          class="flex justify-center sm:justify-start text-white text-sm mt-2"
        >
          <div
            class="flex justify-center sm:justify-start border border-black divide-x divide-black cursor-pointer"
          >
            <a
              :href="collection.website"
              target="_blank"
              class="transition w-8 h-8 px-2 pt-1.25 hover:bg-primary-900 bg-tertiary-800"
            >
              <font-awesome-icon :icon="['fas', 'globe']" />
            </a>
            <a
              :href="collection.twitter"
              target="_blank"
              class="transition w-7.75 h-8 px-2.25 pt-1.25 hover:bg-primary-900 bg-tertiary-800"
            >
              <font-awesome-icon :icon="['fab', 'twitter']" />
            </a>
            <a
              :href="collection.instagram"
              target="_blank"
              class="transition w-7.75 h-8 px-1.5 pt-1.25 hover:bg-primary-900 bg-tertiary-800"
            >
              <font-awesome-icon :icon="['fab', 'medium-m']" />
            </a>
            <a
              :href="collection.instagram"
              target="_blank"
              class="transition w-7.75 h-8 px-2 pt-1.25 hover:bg-primary-900 bg-tertiary-800"
            >
              <font-awesome-icon :icon="['fab', 'telegram-plane']" />
            </a>
            <a
              :href="collection.instagram"
              target="_blank"
              class="transition w-7.75 h-8 px-2 pt-1.25 hover:bg-primary-900 bg-tertiary-800"
            >
              <font-awesome-icon :icon="['fab', 'discord']" />
            </a>
            <a
              :href="collection.instagram"
              target="_blank"
              class="transition w-7.5 h-8 px-2 pt-1.25 hover:bg-primary-900 bg-tertiary-800"
            >
              <font-awesome-icon :icon="['fab', 'instagram']" />
            </a>
            <router-link
              v-if="
                userId && collection.owner && collection.owner.id === userId
              "
              :to="{
                name: 'collection_setting',
                params: { chain: chain, contractAddress: contractAddress },
              }"
              class="w-8 transition h-8 px-2 pt-1.25 hover:bg-primary-900 bg-tertiary-800"
            >
              <font-awesome-icon :icon="['fas', 'edit']" />
            </router-link>
            <div
              v-else
              class="w-8 transition h-8 px-2 pt-1.25 hover:bg-primary-900 bg-tertiary-800"
              @click="reportModal = true"
            >
              <font-awesome-icon :icon="['fas', 'flag']" />
            </div>
          </div>
        </div>
        <div
          v-if="windowWidth < themeConfig.lg"
          class="text-primary-900 flex justify-center sm:justify-start gap-2 text-11 mt-2.75"
        >
          <div class="w-4 h-4 text-white relative">
            <nftmx-img src="/images/components/shield.png" />
          </div>
          <span>Check NFT Authenticity</span>
        </div>
      </div>
      <div class="flex justify-between items-end mt-4.25 xl:mt-6.25 flex-wrap">
        <div>
          <div
            class="flex flex-wrap xl:grid xl:grid-cols-7 gap-8 xl:gap-0 w-full font-ibm-medium"
          >
            <div
              :class="[
                windowWidth > themeConfig.xl2
                  ? 'border-r border-r-black pr-4.75'
                  : '',
                ' my-3',
              ]"
            >
              <div class="text-11 sm:text-sm text-tertiary-400">Collection</div>
              <div class="text-base sm:text-lg text-white -mt-px">
                {{ items }}
              </div>
            </div>
            <div
              :class="[
                windowWidth > themeConfig.xl2
                  ? 'border-l border-l-tertiary-800 border-r border-r-black px-4.75'
                  : '',
                'my-3',
              ]"
            >
              <div class="text-11 sm:text-sm text-tertiary-400">
                Subcollection
              </div>
              <div class="text-base sm:text-lg text-white -mt-px">
                {{ subItems }}
              </div>
            </div>
            <div
              :class="[
                windowWidth > themeConfig.xl2
                  ? 'border-l border-l-tertiary-800 border-r border-r-black px-4.75'
                  : '',
                'my-3',
              ]"
            >
              <div class="text-11 sm:text-sm text-tertiary-400">Owners</div>
              <div class="text-base sm:text-lg text-white -mt-px">
                {{ owners }}
              </div>
            </div>
            <div
              :class="[
                windowWidth > themeConfig.xl2
                  ? 'border-l border-l-tertiary-800 border-r border-r-black px-4.75'
                  : '',
                'my-3',
              ]"
            >
              <div class="text-11 sm:text-sm text-tertiary-400">
                Unique Owners
              </div>
              <div class="text-base sm:text-lg text-white -mt-px">
                {{
                  collection.uniqueOwners
                    ? roundTo(collection.uniqueOwners, 2)
                    : 0
                }}%
              </div>
            </div>
            <div
              :class="[
                windowWidth > themeConfig.xl2
                  ? 'border-l border-l-tertiary-800 border-r border-r-black px-4.75'
                  : '',
                'my-3',
              ]"
            >
              <div class="text-11 sm:text-sm text-tertiary-400">1H Change</div>
              <div
                :class="[
                  collection.stats && collection.stats.volume1h >= 0
                    ? 'text-primary-900'
                    : 'text-red-900',
                  'text-base sm:text-lg -mt-px',
                ]"
              >
                {{
                  collection.stats ? roundTo(collection.stats.volume1h, 2) : 0
                }}%
              </div>
            </div>
            <div
              :class="[
                windowWidth > themeConfig.xl2
                  ? 'border-l border-l-tertiary-800 border-r border-r-black px-4.75'
                  : '',
                'my-3',
              ]"
            >
              <div class="text-11 sm:text-sm text-tertiary-400">24H Change</div>
              <div
                :class="[
                  collection.stats && collection.stats.volume1d >= 0
                    ? 'text-primary-900'
                    : 'text-red-900',
                  'text-base sm:text-lg -mt-px',
                ]"
              >
                {{
                  collection.stats ? roundTo(collection.stats.volume1d, 2) : 0
                }}%
              </div>
            </div>
            <div
              :class="[
                windowWidth > themeConfig.xl2
                  ? 'border-l border-l-tertiary-800  px-4.75'
                  : '',
                'my-3',
              ]"
            >
              <div class="text-11 sm:text-sm text-tertiary-400">7D Change</div>
              <div
                :class="[
                  collection.stats && collection.stats.volume1w >= 0
                    ? 'text-primary-900'
                    : 'text-red-900',
                  'text-base sm:text-lg -mt-px',
                ]"
              >
                {{
                  collection.stats ? roundTo(collection.stats.volume1w, 2) : 0
                }}%
              </div>
            </div>
          </div>
          <div
            class="flex flex-wrap xl:grid xl:grid-cols-7 gap-8 xl:gap-0 w-full font-ibm-medium"
          >
            <div
              :class="[
                windowWidth > themeConfig.xl2
                  ? 'border-r border-r-black pr-4.75'
                  : '',
                ' my-3',
              ]"
            >
              <div class="text-11 sm:text-sm text-tertiary-400">Top Bid</div>
              <div
                class="text-base sm:text-lg text-white -mt-px flex items-center gap-2"
              >
                <div v-if="collection.chain === 'BSC-TESTNET'" class="w-4 h-4">
                  <svg viewBox="0 0 24 24">
                    <path
                      class="fill-white"
                      d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                    />
                  </svg>
                </div>
                <font-awesome-icon
                  v-if="collection.chain === 'ETHEREUM'"
                  :icon="['fab', 'ethereum']"
                  class="text-sm"
                />
                {{
                  collection.stats
                    ? collection.stats.topBid.toLocaleString("en-US", {
                        notation: "compact",
                        compactDisplay: "short",
                        maximumFractionDigits: 2,
                      })
                    : 0
                }}
              </div>
              <div class="text-11 sm:text-sm text-tertiary-400">
                [${{
                  collection.stats
                    ? roundTo(
                        (collection.stats.topBid * coinPrice) / 100,
                        2
                      ).toLocaleString("en-US", {
                        notation: "compact",
                        compactDisplay: "short",
                        maximumFractionDigits: 2,
                      })
                    : 0
                }}]
              </div>
            </div>
            <div
              :class="[
                windowWidth > themeConfig.xl2
                  ? 'border-l border-l-tertiary-800 border-r border-r-black px-4.75'
                  : '',
                'my-3',
              ]"
            >
              <div class="text-11 sm:text-sm text-tertiary-400">Bottom Bid</div>
              <div
                class="text-base sm:text-lg text-white -mt-px flex items-center gap-2"
              >
                <div v-if="collection.chain === 'BSC-TESTNET'" class="w-4 h-4">
                  <svg viewBox="0 0 24 24">
                    <path
                      class="fill-white"
                      d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                    />
                  </svg>
                </div>
                <font-awesome-icon
                  v-if="collection.chain === 'ETHEREUM'"
                  :icon="['fab', 'ethereum']"
                  class="text-sm"
                />
                {{
                  collection.stats
                    ? collection.stats.bottomBid.toLocaleString("en-US", {
                        notation: "compact",
                        compactDisplay: "short",
                        maximumFractionDigits: 2,
                      })
                    : 0
                }}
              </div>
              <div class="text-11 sm:text-sm text-tertiary-400">
                [${{
                  collection.stats
                    ? roundTo(
                        (collection.stats.bottomBid * coinPrice) / 100,
                        2
                      ).toLocaleString("en-US", {
                        notation: "compact",
                        compactDisplay: "short",
                        maximumFractionDigits: 2,
                      })
                    : 0
                }}]
              </div>
            </div>
            <div
              :class="[
                windowWidth > themeConfig.xl2
                  ? 'border-l border-l-tertiary-800 border-r border-r-black px-4.75'
                  : '',
                'my-3',
              ]"
            >
              <div class="text-11 sm:text-sm text-tertiary-400">
                Offers Pending
              </div>
              <div
                class="text-base sm:text-lg text-white -mt-px flex items-center gap-2"
              >
                <div v-if="collection.chain === 'BSC-TESTNET'" class="w-4 h-4">
                  <svg viewBox="0 0 24 24">
                    <path
                      class="fill-white"
                      d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                    />
                  </svg>
                </div>
                <font-awesome-icon
                  v-if="collection.chain === 'ETHEREUM'"
                  :icon="['fab', 'ethereum']"
                  class="text-sm"
                />
                {{ 0.1253 }}
              </div>
              <div class="text-11 sm:text-sm text-tertiary-400">[$0.33k]</div>
            </div>
            <div
              :class="[
                windowWidth > themeConfig.xl2
                  ? 'border-l border-l-tertiary-800 border-r border-r-black px-4.75'
                  : '',
                'my-3',
              ]"
            >
              <div class="text-11 sm:text-sm text-tertiary-400">
                Floor Price
              </div>
              <div
                class="text-base sm:text-lg text-white -mt-px flex items-center gap-2"
              >
                <div v-if="collection.chain === 'BSC-TESTNET'" class="w-4 h-4">
                  <svg viewBox="0 0 24 24">
                    <path
                      class="fill-white"
                      d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                    />
                  </svg>
                </div>
                <font-awesome-icon
                  v-if="collection.chain === 'ETHEREUM'"
                  :icon="['fab', 'ethereum']"
                  class="text-sm"
                />
                {{
                  collection.stats
                    ? collection.stats.floor.toLocaleString("en-US", {
                        notation: "compact",
                        compactDisplay: "short",
                        maximumFractionDigits: 2,
                      })
                    : 0
                }}
              </div>
              <div class="text-11 sm:text-sm text-tertiary-400">
                [${{
                  collection.stats
                    ? roundTo(
                        (collection.stats.floor * coinPrice) / 100,
                        2
                      ).toLocaleString("en-US", {
                        notation: "compact",
                        compactDisplay: "short",
                        maximumFractionDigits: 2,
                      })
                    : 0
                }}]
              </div>
            </div>
            <div
              :class="[
                windowWidth > themeConfig.xl2
                  ? 'border-l border-l-tertiary-800 border-r border-r-black px-4.75'
                  : '',
                'my-3',
              ]"
            >
              <div class="text-11 sm:text-sm text-tertiary-400">ATH Price</div>
              <div
                class="text-base sm:text-lg text-white -mt-px flex items-center gap-2"
              >
                <div v-if="collection.chain === 'BSC-TESTNET'" class="w-4 h-4">
                  <svg viewBox="0 0 24 24">
                    <path
                      class="fill-white"
                      d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                    />
                  </svg>
                </div>
                <font-awesome-icon
                  v-if="collection.chain === 'ETHEREUM'"
                  :icon="['fab', 'ethereum']"
                  class="text-sm"
                />
                {{
                  collection.athPrice
                    ? collection.athPrice.toLocaleString("en-US", {
                        notation: "compact",
                        compactDisplay: "short",
                        maximumFractionDigits: 2,
                      })
                    : 0
                }}
              </div>
              <div class="text-11 sm:text-sm text-tertiary-400">
                [${{
                  collection.athPrice
                    ? roundTo(
                        (collection.athPrice * coinPrice) / 100,
                        2
                      ).toLocaleString("en-US", {
                        notation: "compact",
                        compactDisplay: "short",
                        maximumFractionDigits: 2,
                      })
                    : 0
                }}]
              </div>
            </div>
            <div
              :class="[
                windowWidth > themeConfig.xl2
                  ? 'border-l border-l-tertiary-800 border-r border-r-black px-4.75'
                  : '',
                'my-3',
              ]"
            >
              <div class="text-11 sm:text-sm text-tertiary-400">24H Volume</div>
              <div
                class="text-base sm:text-lg text-white -mt-px flex items-center gap-2"
              >
                <div v-if="collection.chain === 'BSC-TESTNET'" class="w-4 h-4">
                  <svg viewBox="0 0 24 24">
                    <path
                      class="fill-white"
                      d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                    />
                  </svg>
                </div>
                <font-awesome-icon
                  v-if="collection.chain === 'ETHEREUM'"
                  :icon="['fab', 'ethereum']"
                  class="text-sm"
                />
                {{
                  collection.stats
                    ? roundTo(
                        (collection.stats.volume * collection.stats.volume1d) /
                          100,
                        2
                      )
                    : 0
                }}
              </div>
              <div class="text-11 sm:text-sm text-tertiary-400">
                [${{
                  collection.stats
                    ? roundTo(
                        (collection.stats.volume *
                          collection.stats.volume1d *
                          coinPrice) /
                          100,
                        2
                      ).toLocaleString("en-US", {
                        notation: "compact",
                        compactDisplay: "short",
                        maximumFractionDigits: 2,
                      })
                    : 0
                }}]
              </div>
            </div>
            <div
              :class="[
                windowWidth > themeConfig.xl2
                  ? 'border-l border-l-tertiary-800  px-4.75'
                  : '',
                'my-3',
              ]"
            >
              <div class="text-11 sm:text-sm text-tertiary-400">7D Volume</div>
              <div
                class="text-base sm:text-lg text-white -mt-px flex items-center gap-2"
              >
                <div v-if="collection.chain === 'BSC-TESTNET'" class="w-4 h-4">
                  <svg viewBox="0 0 24 24">
                    <path
                      class="fill-white"
                      d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                    />
                  </svg>
                </div>
                <font-awesome-icon
                  v-if="collection.chain === 'ETHEREUM'"
                  :icon="['fab', 'ethereum']"
                  class="text-sm"
                />
                {{
                  collection.stats
                    ? roundTo(
                        (collection.stats.volume * collection.stats.volume1w) /
                          100,
                        2
                      )
                    : 0
                }}
              </div>
              <div class="text-11 sm:text-sm text-tertiary-400">
                [${{
                  collection.stats
                    ? roundTo(
                        (collection.stats.volume *
                          collection.stats.volume1w *
                          coinPrice) /
                          100,
                        2
                      ).toLocaleString("en-US", {
                        notation: "compact",
                        compactDisplay: "short",
                        maximumFractionDigits: 2,
                      })
                    : 0
                }}]
              </div>
            </div>
          </div>
        </div>
        <div
          class="flex flex-row 3xl:flex-col gap-10.5 text-xs text-primary-900 mb-1 order-2 2xl:order-1 mt-4 3xl:mt-0"
        >
          <button
            class="font-press border-2 text-tertiary-700 border-tertiary-700 flex justify-center items-center gap-3 h-13.5 pl-6 pr-5 shadow-default shadow-tertiary-700 transition cursor-not-allowed"
          >
            <span>Initial Offering</span>
          </button>
          <button
            class="font-press border-2 text-tertiary-700 border-tertiary-700 flex justify-center items-center gap-3 h-13.5 pl-6 pr-5 shadow-default shadow-tertiary-700 transition cursor-not-allowed"
          >
            <span>Derivatives Offering</span>
          </button>
          <!-- <button
            class="font-press border-2 border-primary-900 flex justify-center items-center gap-3 h-13.5 pl-6 pr-5 shadow-default shadow-primary-900 transition hover:bg-black"
          >
            <span>Initial Offering</span>
          </button>
          <button
            class="font-press border-2 text-secondary-900 border-secondary-900 flex justify-center items-center gap-3 h-13.5 pl-6 pr-5 shadow-default shadow-secondary-900 transition hover:bg-black"
          >
            <span>Derivatives Offering</span>
          </button> -->
        </div>
        <div
          class="text-white text-sm leading-6 my-5.5 xl:mt-6.5 xl:mb-9 w-full order-1"
        >
          {{ collection.description }}
        </div>
      </div>
    </div>
    <authentic-modal v-model="authenticModal" />
    <collection-report-modal v-model="reportModal" />
  </div>
</template>

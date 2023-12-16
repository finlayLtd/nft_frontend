<script setup>
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
import Accordion from "@/core/components/accordion/BasicAccordion.vue";
import NftmxWalletAddressPop from "@/core/components/blockchain-address/NftmxWalletAddressPop.vue";
import { capitalize } from "lodash";
import {
  themeConfig,
  BSC_TESTNET_PACKABLE_CONTRACT_ADDRESS,
} from "@/core/config/constant";
import InsideModal from "@/core/components/modal/InsideModal.vue";
import ListGroupItem from "@/core/components/basic/ListGroupItem.vue";
import ListGroupSubItem from "@/core/components/basic/ListGroupSubItem.vue";
import NftmxImg from "@/core/components/basic/NftmxImg.vue";
import { useToast } from "vue-toastification";
import ItemReportModal from "@/core/components/modal/ItemReportModal.vue";
import Ribbon from "@/core/components/basic/Ribbon.vue";
import CardCarousel from "@/core/components/carousel/CardCarousel.vue";
import Jazzicon from "@/core/components/jazzicon/Jazzicon.vue";
import { useRoute } from "vue-router";
import { getChainKey, shortenAddress } from "@/core/utils/common";
import NftmxTooltip from "@/core/components/basic/NftmxTooltip.vue";

const props = defineProps({
  asset: Object,
  currentSale: Object,
});

const store = useStore();
const walletAddress = computed(() => store.getters["auth/walletAddress"]);
const toast = useToast();
const open = ref(false);
const tab = ref("Please select");
const currentHref = ref(null);
const openShare = ref(false);
const previewShare = ref(false);
const assetDetailTabs = [
  "NFT details",
  "Subcollection",
  "Liquidity Protection",
];
const route = useRoute();
const chain = route.params.chain.toUpperCase();
const chainKey = getChainKey(chain);
const openItemReportModal = ref(false);
const tokenImage = computed(() => {
  if (props.asset.nfts) {
    return props.asset.nfts.map((nft) => nft.imageUrl);
  } else {
    return [];
  }
});

const handleClick = () => {
  open.value = !open.value;
};
const selectTab = (value) => {
  tab.value = value || "Please select";
  open.value = false;
};
const cancelNFT = () => {};
onMounted(() => {
  currentHref.value = window.location.href;
});
const onCopy = (e) => {
  toast.success("Link is copied");
};
const refresh = () => {
  toast.success(
    "We've queued this item for an update! Check back in a minute..."
  );
};
</script>

<template>
  <div class="h-full flex flex-col lg:pr-2">
    <div
      class="relative overflow-hidden w-full min-h-[315px] lg:min-h-[500px] max-h-[520px] flex-grow border border-black text-11 tracking-wider font-ibm bg-black"
    >
      <ribbon
        v-if="
          asset.currentOrder &&
          asset.currentOrder.protectionRate > 0 &&
          asset.currentOrder.protectionTime > 0
        "
        big
        class="z-10"
      />
      <div
        v-if="tokenImage && tokenImage.length > 0"
        class="w-full h-full absolute text-8xl"
      >
        <card-carousel :images="tokenImage" />
      </div>
      <nftmx-img
        v-else
        :src="asset.imageUrl"
        class="w-full h-full absolute object-cover text-8xl"
      />
      <inside-modal
        :title="tab"
        v-if="tab === assetDetailTabs[0]"
        @select-tab="selectTab"
      >
        <div>
          <div class="flex justify-between">
            <span>Creator:</span>
            <nftmx-img :src="asset.creator.profile_img" class="w-13 h-13" />
          </div>
          <div class="flex justify-between mt-5">
            <span>Creator name:</span>
            <span>
              <span class="text-tertiary-400">
                {{ asset.creator.name || "Unnamed" }}
              </span>
              <span class="text-tertiary-600"> | </span>
              <a
                v-if="asset.creator"
                target="_blank"
                :href="'/account/' + asset.creator.walletAddress"
                class="text-primary-900"
              >
                {{ shortenAddress(asset.creator.walletAddress) }}
              </a>
            </span>
          </div>
          <div class="flex justify-between mt-2.5">
            <span>Collection name:</span>
            <a
              v-if="asset.contract"
              target="_blank"
              :href="`/collection/${chain}/${asset.contract.address}`"
              class="text-primary-900"
            >
              {{ asset.contract.name || "Unnamed" }}
            </a>
          </div>
          <div class="flex justify-between mt-2.5">
            <span>Contract Address:</span>
            <a
              v-if="asset.contract"
              target="_blank"
              :href="`/collection/${chain}/${asset.contract.address}`"
              class="text-primary-900"
            >
              {{ shortenAddress(asset.contract.address) }}
            </a>
          </div>
          <div class="flex justify-between mt-2.5">
            <span>Rarity</span>
            <span class="text-tertiary-400">
              1:{{ asset.contract.items }}
            </span>
          </div>
          <div class="mt-2.5">About the collection:</div>
          <div class="text-tertiary-500 mt-3">
            {{ asset.description }}
          </div>
          <div class="mt-4.5">Hashtags #</div>
          <div
            v-if="asset.hashtags"
            class="text-tertiary-500 mt-4 w-full flex flex-wrap gap-2.5"
          >
            <div
              v-for="(item, index) in asset.hashtags"
              :key="index"
              class="px-2 bg-tertiary-700"
            >
              #{{ item }}
            </div>
          </div>
        </div>
      </inside-modal>
      <inside-modal
        :title="tab"
        v-if="tab === assetDetailTabs[1]"
        @select-tab="selectTab"
      >
        <div v-if="false">
          <div class="flex justify-between">
            <span>Total derivatives minted:</span>
            <span class="text-tertiary-400">100</span>
          </div>
          <div class="flex justify-between mt-2.5">
            <span>Derivatives ever sold:</span>
            <span class="text-tertiary-400">26 / 26%</span>
          </div>
          <div class="flex justify-between mt-2.5">
            <span>Derivatives under contract:</span>
            <span class="text-tertiary-400">10 / 10%</span>
          </div>
          <div class="flex justify-between mt-2.5">
            <span>Available derivatives for sale:</span>
            <span class="text-tertiary-400">74 / 74%</span>
          </div>
          <div class="flex justify-between mt-2.5">
            <span>Listing:</span>
            <span class="text-tertiary-400">20</span>
          </div>
          <div class="border-t border-t-black mt-4" />
          <div class="flex justify-between mt-4">
            <span>Derivatives sold:</span>
            <div class="text-tertiary-400 flex items-center gap-1">
              <font-awesome-icon
                v-if="asset.contract.chain === 'ETHEREUM'"
                :icon="['fab', 'ethereum']"
              />
              <div
                v-if="asset.contract.chain === 'BSC-TESTNET'"
                class="w-3 h-3 fill-tertiary-400"
              >
                <svg
                  role="img"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>Binance</title>
                  <path
                    d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                  />
                </svg>
              </div>
              <span> 1 [$1,000] </span>
            </div>
          </div>
          <div class="flex justify-between mt-2.5">
            <span>Subcollection floor price:</span>
            <div class="text-tertiary-400 flex items-center gap-1">
              <font-awesome-icon
                v-if="asset.contract.chain === 'ETHEREUM'"
                :icon="['fab', 'ethereum']"
              />
              <div
                v-if="asset.contract.chain === 'BSC-TESTNET'"
                class="w-3 h-3 fill-tertiary-400"
              >
                <svg
                  role="img"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>Binance</title>
                  <path
                    d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                  />
                </svg>
              </div>
              <span> 1 [$1,000] </span>
            </div>
          </div>
          <div class="flex justify-between mt-2.5">
            <span>Derivatives pending value:</span>
            <div class="text-tertiary-400 flex items-center gap-1">
              <font-awesome-icon
                v-if="asset.contract.chain === 'ETHEREUM'"
                :icon="['fab', 'ethereum']"
              />
              <div
                v-if="asset.contract.chain === 'BSC-TESTNET'"
                class="w-3 h-3 fill-tertiary-400"
              >
                <svg
                  role="img"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>Binance</title>
                  <path
                    d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                  />
                </svg>
              </div>
              <span> 1 [$1,000] </span>
            </div>
          </div>
          <div class="border-t border-t-black mt-4" />
          <div class="flex justify-between mt-4">
            <span>Slippage locked:</span>
            <div class="text-tertiary-400 flex items-center gap-1">
              <font-awesome-icon
                v-if="asset.contract.chain === 'ETHEREUM'"
                :icon="['fab', 'ethereum']"
              />
              <div
                v-if="asset.contract.chain === 'BSC-TESTNET'"
                class="w-3 h-3 fill-tertiary-400"
              >
                <svg
                  role="img"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>Binance</title>
                  <path
                    d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                  />
                </svg>
              </div>
              <span> 1 [$1,000] </span>
            </div>
          </div>
          <div class="flex justify-between mt-2.5">
            <span>APY locked:</span>
            <div class="text-tertiary-400 flex items-center gap-1">
              <font-awesome-icon
                v-if="asset.contract.chain === 'ETHEREUM'"
                :icon="['fab', 'ethereum']"
              />
              <div
                v-if="asset.contract.chain === 'BSC-TESTNET'"
                class="w-3 h-3 fill-tertiary-400"
              >
                <svg
                  role="img"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>Binance</title>
                  <path
                    d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                  />
                </svg>
              </div>
              <span> 1 [$1,000] </span>
            </div>
          </div>
          <div class="flex justify-between mt-2.5">
            <span>Total value locked:</span>
            <div class="text-tertiary-400 flex items-center gap-1">
              <font-awesome-icon
                v-if="asset.contract.chain === 'ETHEREUM'"
                :icon="['fab', 'ethereum']"
              />
              <div
                v-if="asset.contract.chain === 'BSC-TESTNET'"
                class="w-3 h-3 fill-tertiary-400"
              >
                <svg
                  role="img"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>Binance</title>
                  <path
                    d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                  />
                </svg>
              </div>
              <span> 1 [$1,000] </span>
            </div>
          </div>
        </div>
        <div
          v-else
          class="flex flex-col text-center justify-center items-center h-full"
        >
          <div class="text-red-600 font-ibm-medium text-lg">
            No derivatives exist
          </div>
          <div class="font-ibm text-sm text-tertiary-400 mt-4">
            Buy this NFT and be the first to create derivatives and launch an
            derivatives offering
          </div>
        </div>
      </inside-modal>
      <inside-modal
        :title="capitalize(tab)"
        v-if="tab === assetDetailTabs[2]"
        @select-tab="selectTab"
        class="text-center"
      >
        <div
          v-if="
            asset.currentOrder &&
            asset.currentOrder.protectionRate > 0 &&
            asset.currentOrder.protectionTime > 0
          "
          class="text-lg 3xl:text-2xl font-ibm-bold 3xl:leading-9 text-primary-900 px-2"
        >
          Your Investment is 100% protected by Reverse Market Making liquidity
          protection smart contract
        </div>
        <div
          v-else-if="asset.currentOrder"
          class="text-lg 3xl:text-2xl font-ibm-bold 3xl:leading-9 text-red-700 px-4"
        >
          Your Investment is NOT protected by Reverse Market Making liquidity
          protection smart contract
        </div>
        <div
          v-else
          class="text-lg 3xl:text-2xl font-ibm-bold 3xl:leading-9 text-white"
        >
          Your investment can be protected 100% by liquidity protection
        </div>
        <div class="text-tertiary-500 text-sm 3xl:leading-6 mt-4">
          Similar to how issuers of tokens act as market makers and provide
          liquidity to crypto buyers via Automated Market Making (AMM), sellers
          of NFTs do the same trade-off with Liquidity Protection via Reverse
          Market Making (RMM) smart contract.
        </div>
        <div
          v-if="asset.currentOrder"
          class="flex justify-around text-center mt-8"
        >
          <div>
            <div class="font-ibm text-13">
              <span> Protection Period </span>
              <nftmx-tooltip
                text="The period of time during which a buyer is allowed to return the NFT to the liquidity protection contract and receive a refund."
              >
                <sup>
                  <font-awesome-icon
                    :icon="['fas', 'question-circle']"
                    class="text-10 cursor-pointer"
                  />
                </sup>
              </nftmx-tooltip>
            </div>
            <div class="font-ibm-bold text-primary-800 text-base">
              {{ Math.ceil(asset.currentOrder.protectionTime / 86400) }}
              Days
            </div>
          </div>
          <div>
            <div class="font-ibm text-13">
              Slippage Fee
              <nftmx-tooltip
                text="The fees that will be paid to the market maker in case of cancellation and return of the NFT to the liquidity protection contract."
              >
                <sup>
                  <font-awesome-icon
                    :icon="['fas', 'question-circle']"
                    class="text-10 cursor-pointer"
                  />
                </sup>
              </nftmx-tooltip>
            </div>
            <div class="font-ibm-bold text-primary-800 text-base">
              <span>
                {{ 100 - asset.currentOrder.protectionRate }}
              </span>
              <span>%</span>
            </div>
          </div>
          <div>
            <div class="font-ibm text-13">
              Leverage staking
              <nftmx-tooltip
                text="Generate extra APY by leveraging the purchasing funds during the liquidity protection period via a 3rd party staking protocol, such as Compound, Earnest Finance, Venus, etc."
              >
                <sup>
                  <font-awesome-icon
                    :icon="['fas', 'question-circle']"
                    class="text-10 cursor-pointer"
                  />
                </sup>
              </nftmx-tooltip>
            </div>
            <div class="font-ibm-bold text-primary-800 text-base">
              <span>
                {{ asset.currentOrder.useDepository ? "Yes" : "No" }}
              </span>
            </div>
          </div>
        </div>
        <div
          v-else
          class="text-tertiary-500 text-sm 3xl:leading-6 lg:px-4 mt-8"
        >
          As a buyer you can make a purchasing offer that includes protection
          period and reward the seller as a market maker.
        </div>
      </inside-modal>
    </div>
    <div class="mt-6.5">
      <div
        class="relative sm:flex gap-4 w-full text-sm font-ibm items-baseline"
      >
        <div
          v-if="store.state.app.windowWidth >= themeConfig.xl3"
          class="flex-1 flex pr-5 gap-5"
        >
          <list-group-item
            @click="selectTab(tab === 'NFT details' ? '' : 'NFT details')"
            :active="tab === 'NFT details'"
            class="min-w-max"
          >
            NFT details
          </list-group-item>
          <div
            class="border-l border-l-black border-r border-r-tertiary-700 my-2"
          />
          <list-group-item
            @click="selectTab(tab === 'Subcollection' ? '' : 'Subcollection')"
            :active="tab === 'Subcollection'"
            class="min-w-max"
          >
            Subcollection
          </list-group-item>
          <div
            class="border-l border-l-black border-r border-r-tertiary-700 my-2"
          />
          <list-group-item
            @click="
              selectTab(
                tab === 'Liquidity Protection' ? '' : 'Liquidity Protection'
              )
            "
            active
            class="min-w-max"
          >
            Liquidity Protection
          </list-group-item>
        </div>
        <accordion
          v-if="store.state.app.windowWidth < themeConfig.xl3"
          :border="false"
          :sidebar="true"
          v-model="open"
          @handle-click="handleClick"
          :handleEmit="true"
          class="flex-grow w-full"
        >
          <template v-slot:caption>
            <list-group-item class="text-sm pt-1.5">{{ tab }}</list-group-item>
          </template>
          <div v-for="(name, i) in assetDetailTabs" :key="i">
            <list-group-sub-item
              @click="selectTab(name === tab ? '' : name)"
              :active="name === tab"
            >
              {{ name }}
            </list-group-sub-item>
          </div>
        </accordion>
        <div
          class="flex object-right border border-black divide-x divide-black"
        >
          <div
            class="transition w-7.5 h-7.5 px-2.25 pt-1.25 hover:bg-primary-900 bg-tertiary-800 cursor-pointer"
            @click="refresh"
          >
            <font-awesome-icon :icon="['fas', 'undo']" />
          </div>
          <a
            :href="asset && asset.externalLink ? asset.externalLink : ''"
            target="_blank"
          >
            <div
              class="transition w-7.5 h-7.5 px-2.25 pt-1.25 hover:bg-primary-900 bg-tertiary-800 cursor-pointer"
            >
              <font-awesome-icon :icon="['fas', 'external-link-alt']" />
            </div>
          </a>
          <div class="relative">
            <div
              @mouseover="openShare = true"
              @mouseout="openShare = false"
              class="transition w-7.5 h-7.5 px-2.25 pt-1.25 hover:bg-primary-900 bg-tertiary-800 cursor-pointer"
            >
              <font-awesome-icon :icon="['fas', 'share-alt']" />
            </div>
            <div
              @mouseover="previewShare = true"
              @mouseout="previewShare = false"
              :class="[
                openShare || previewShare ? 'block' : 'hidden',
                'absolute left-0 top-7.75 border border-black bg-tertiary-800 px-4.25 py-3 z-10 w-48 transition',
              ]"
            >
              <div
                v-clipboard:copy="currentHref"
                v-clipboard:success="onCopy"
                class="flex gap-4 py-1.25 cursor-pointer text-white hover:text-primary-900 transition"
              >
                <div class="w-4 flex justify-center items-center">
                  <font-awesome-icon :icon="['fas', 'link']" />
                </div>
                <div class="font-ibm text-11 tracking-wider">Copy link</div>
              </div>
              <a
                :href="
                  'https://www.facebook.com/sharer/sharer.php?u=' + currentHref
                "
                target="_blank"
              >
                <div
                  class="flex gap-4 py-1.25 cursor-pointer text-white hover:text-primary-900 transition"
                >
                  <div class="w-4 flex justify-center items-center">
                    <font-awesome-icon :icon="['fab', 'facebook-f']" />
                  </div>
                  <div class="font-ibm text-11 tracking-wider">
                    Share on Facebook
                  </div>
                </div>
              </a>

              <a
                :href="
                  'https://twitter.com/intent/tweet?text=Check out this item on NFT Protection&url=' +
                  currentHref +
                  '&via=NFT Protection'
                "
                target="_blank"
              >
                <div
                  class="flex gap-4 py-1.25 cursor-pointer text-white hover:text-primary-900 transition"
                >
                  <font-awesome-icon :icon="['fab', 'twitter']" />
                  <div class="font-ibm text-11 tracking-wider">
                    Share on twitter
                  </div>
                </div>
              </a>
              <div
                class="flex gap-4 py-1.25 cursor-pointer text-white hover:text-primary-900 transition"
              >
                <font-awesome-icon :icon="['fas', 'code']" />
                <div class="font-ibm text-11 tracking-wider">Embed Item</div>
              </div>
            </div>
          </div>
          <!-- <div
            class="transition w-7.5 h-7.5 px-2.25 pt-1.25 hover:bg-primary-900 bg-tertiary-800 cursor-pointer"
            @click="openItemReportModal = true"
          >
            <font-awesome-icon :icon="['fas', 'flag']" />
          </div> -->
        </div>
      </div>
    </div>
    <item-report-modal v-model="openItemReportModal" />
  </div>
</template>

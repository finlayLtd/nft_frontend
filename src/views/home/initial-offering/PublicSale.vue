<script setup>
import NftmxTrimString from "@/core/components/basic/NftmxTrimString.vue";
import Timer from "@/core/components/timer/Timer.vue";
import NftmxInput from "@/core/components/basic/NftmxInput.vue";
import InitialOfferingCarousel from "@/core/components/carousel/InitialOfferingCarousel.vue";
import VueSlider from "vue-3-slider-component";
import { computed, ref } from "vue";
import Accordion from "@/core/components/accordion/BasicAccordion.vue";
import Cart from "@/core/components/cart/NftCart.vue";
import PublicSaleCard from "@/core/components/cards/PublicSaleCard.vue";
import InitialOfferingCard from "@/core/components/cards/InitialOfferingCard.vue";
import NftmxTable from "@/core/components/table/NftmxTable.vue";
import NftmxThead from "@/core/components/table/NftmxThead.vue";
import NftmxTh from "@/core/components/table/NftmxTh.vue";
import NftmxTbody from "@/core/components/table/NftmxTbody.vue";
import NftmxTd from "@/core/components/table/NftmxTd.vue";
import NftmxTr from "@/core/components/table/NftmxTr.vue";
import NftmxImg from "@/core/components/basic/NftmxImg.vue";
import { roundTo, getChainKey } from "@/core/utils/common";
import NftmxButton from "@/core/components/basic/NftmxButton.vue";
import { useStore } from "vuex";

const props = defineProps({
  ledgerPanelVisible: Boolean,
  filterOption: Object,
  isCartOpened: Boolean,
  viewOption: String,
});

const store = useStore();
const tab = ref("Live Now");
const subTab = ref("AI-based NFT");
const saleType = ref("All");
const open = ref(false);
const amount = ref(0);
const openDescription = ref(true);
const offerings = ref([1, 2, 3, 4]);
const coinPrice = computed(() => store.state.market.coinPrice);

const onClickOutside = () => {
  open.value = false;
};
const handleClick = () => {
  open.value = !open.value;
};
</script>

<template>
  <div :class="[ledgerPanelVisible ? 'lg:pl-5' : 'pl-0', 'flex-1 text-white']">
    <div>
      <div class="flex justify-between">
        <div class="flex gap-4 font-press text-base py-3">
          <span
            :class="[
              tab === 'Live Now' ? 'text-primary-900' : 'text-white',
              'cursor-pointer hover:text-primary-900 transition',
            ]"
            @click="tab = 'Live Now'"
          >
            Live Now
          </span>
          <div
            class="h-full border-l border-l-black border-r border-r-tertiary-700"
          />
          <span
            :class="[
              tab === 'Coming Soon' ? 'text-primary-900' : 'text-white',
              'cursor-pointer hover:text-primary-900 transition',
            ]"
            @click="tab = 'Coming Soon'"
          >
            Coming Soon
          </span>
          <div
            class="h-full border-l border-l-black border-r border-r-tertiary-700"
          />
          <span
            :class="[
              tab === 'Past' ? 'text-primary-900' : 'text-white',
              'cursor-pointer hover:text-primary-900 transition',
            ]"
            @click="tab = 'Past'"
          >
            Past
          </span>
        </div>
        <div class="relative w-60 z-10 h-13.5">
          <div
            class="absolute w-full z-10 px-5 overflow-hidden bg-tertiary-800"
            v-click-outside="onClickOutside"
          >
            <accordion
              mIcon
              :border="false"
              :sidebar="true"
              v-model="open"
              @handle-click="handleClick"
              handleEmit
              class="w-full"
            >
              <template v-slot:caption>
                <div class="text-13 font-ibm-medium py-3 mr-4 h-10">
                  2 projects
                </div>
              </template>
              <div class="pb-2">
                <div class="text-sm py-2">Bored Ape Yatch Club</div>
                <div class="text-sm py-2">ABC</div>
              </div>
            </accordion>
          </div>
        </div>
      </div>
      <div class="flex justify-between">
        <div class="flex gap-4 font-ibm-medium text-sm text-white py-3">
          <span
            :class="[
              subTab === 'AI-based NFT' ? 'text-white' : 'text-tertiary-400',
              'cursor-pointer hover:text-white transition',
            ]"
            @click="subTab = 'AI-based NFT'"
          >
            <font-awesome-icon :icon="['fas', 'info-circle']" />
            <span> AI-based NFT </span>
          </span>
          <div
            class="h-full border-l border-l-black border-r border-r-tertiary-700"
          />
          <span
            :class="[
              subTab === '100% Liquidity Protection'
                ? 'text-white'
                : 'text-tertiary-400',
              'cursor-pointer hover:text-white transition',
            ]"
            @click="subTab = '100% Liquidity Protection'"
          >
            <font-awesome-icon :icon="['fas', 'info-circle']" />
            <span> 100% Liquidity Protection </span>
          </span>
          <div
            class="h-full border-l border-l-black border-r border-r-tertiary-700"
          />
          <span
            :class="[
              subTab === 'Multilevel Ownership'
                ? 'text-white'
                : 'text-tertiary-400',
              'cursor-pointer hover:text-white transition',
            ]"
            @click="subTab = 'Multilevel Ownership'"
          >
            <font-awesome-icon :icon="['fas', 'info-circle']" />
            <span> Multilevel Ownership </span>
          </span>
          <div
            class="h-full border-l border-l-black border-r border-r-tertiary-700"
          />
          <span
            :class="[
              subTab === 'Individual Supply'
                ? 'text-white'
                : 'text-tertiary-400',
              'cursor-pointer hover:text-white transition',
            ]"
            @click="subTab = 'Individual Supply'"
          >
            Individual Supply
          </span>
          <div
            class="h-full border-l border-l-black border-r border-r-tertiary-700"
          />
          <span
            :class="[
              subTab === 'Fractional Supply'
                ? 'text-white'
                : 'text-tertiary-400',
              'cursor-pointer hover:text-white transition',
            ]"
            @click="subTab = 'Fractional Supply'"
          >
            Fractional Supply
          </span>
        </div>
        <div class="flex gap-8">
          <div
            class="flex w-68 h-12.5 border border-black divide-x divide-black bg-tertiary-800"
          >
            <div class="bg-black w-12.5 flex items-center justify-center">
              <img src="/images/components/dice_white.png" />
            </div>
            <div class="w-12.5 flex items-center justify-center">
              {{ amount }}
            </div>
            <div class="flex-1 p-4">
              <vue-slider
                v-if="offerings.length > 0"
                v-model="amount"
                :min="0"
                :max="10"
                :interval="1"
                :dotSize="12"
                :dotOptions="[
                  {
                    style: {
                      backgroundColor: '#19cb58',
                    },
                  },
                ]"
                :height="2"
                :processStyle="{ backgroundColor: 'rgb(25 203 88)' }"
                :railStyle="{ backgroundColor: 'rgb(148 148 148)' }"
                tooltip="none"
              >
              </vue-slider>
              <vue-slider
                v-else
                v-model="amount"
                :min="0"
                :max="10"
                :interval="1"
                :dotSize="12"
                :dotOptions="[
                  {
                    style: {
                      backgroundColor: 'rgb(148 148 148)',
                    },
                  },
                ]"
                :height="2"
                :processStyle="{ backgroundColor: 'rgb(148 148 148)' }"
                :railStyle="{ backgroundColor: 'rgb(148 148 148)' }"
                tooltip="none"
                disabled
              >
              </vue-slider>
            </div>
          </div>
          <div class="flex gap-4 items-center text-sm font-ibm-medium">
            <span
              :class="[
                saleType === 'All' ? 'text-primary-900' : 'text-white',
                'cursor-pointer hover:text-primary-900 transition',
              ]"
              @click="saleType = 'All'"
            >
              All
            </span>
            <div
              class="h-6 border-l border-l-black border-r border-r-tertiary-700"
            />
            <span
              :class="[
                saleType === 'Auction' ? 'text-primary-900' : 'text-white',
                'cursor-pointer hover:text-primary-900 transition',
              ]"
              @click="saleType = 'Auction'"
            >
              Auction
            </span>
            <div
              class="h-6 border-l border-l-black border-r border-r-tertiary-700"
            />
            <span
              :class="[
                saleType === 'Asking price' ? 'text-primary-900' : 'text-white',
                'cursor-pointer hover:text-primary-900 transition',
              ]"
              @click="saleType = 'Asking price'"
            >
              Asking price
            </span>
          </div>
        </div>
      </div>
      <div
        v-if="openDescription"
        class="relative shadow-default shadow-primary-900 pt-6.5 pl-6.5 pb-10 pr-10 bg-gradient-to-r from-primary-200 to-primary-700 mt-8 text-black text-13 tracking-[0.045em] leading-6"
      >
        NFTPX is offering its own public sale through a new variable NFT model,
        which changes the value and appearance with each transaction. Each
        variable NFT represents the right to mint a specific amount of NFTPX.
        The current owner can decide whether to claim the NFT and mint the
        underline represented amount of NFTPX tokens or to pass it over and sell
        it to the next buyer. <br /><br />
        <span class="font-ibm-medium"> Vairable value: </span>
        <br />
        After a new buyer purchases an NFT, or even if they cancel the purchase,
        the current amount is removed and replaced with a new random value. This
        new value can be either below or above the previous value, but it must
        fall within the range that the variable NFT is designed for.
        <br /><br />
        There are 3 types of variable NFT amount available to choose from:
        <div class="flex gap-4 mt-3">
          <div class="bg-black w-2.25 h-2.25 rounded-full mt-1.5" />
          <p class="flex-1">
            NFTs valued between 100,000 and 1,000,000 NFTmx tokens (valued at
            $1,000 to $10,000)
          </p>
        </div>
        <div class="flex gap-4">
          <div class="bg-black w-2.25 h-2.25 rounded-full mt-1.5" />
          <p class="flex-1">
            NFTs valued between 1,000,000 and 10,000,000 NFTmx tokens (valued at
            $10,000 to $100,000)
          </p>
        </div>
        <div class="flex gap-4">
          <div class="bg-black w-2.25 h-2.25 rounded-full mt-1.5" />
          <p class="flex-1">
            NFTs valued between 10,000,000 and 25,000,000 NFTmx tokens (valued
            at $100,000 to $250,000)
          </p>
        </div>
        <br />
        <span class="font-ibm-medium"> Variable look: </span>
        <br />
        A new buyer can modify the appearance of the variable NFT by providing
        prompt instructions to the AI to add, remove, or change new details in
        the next frame. Each transaction creates a new frame that will be played
        as a video from start to end and repeat.
        <br /><br />
        <span class="font-ibm-medium"> Claim it or pass it over! </span>
        <br />When a new buyer completes a purchase of a variable NFT, they may
        not know for certain what they're getting until they receive it. If the
        buyer is not satisfied with the NFT's appearance or value, they have the
        option to either claim a refund using the 100% liquidity protection and
        reverse the sale back to the smart contract, or pass it over and sell
        the NFT to the next buyer. Reselling the variable NFT P2P can be done
        with or without special terms, such as slippage for the seller to act as
        a market maker for 100% liquidity protection or multi-level ownership
        reward. <br /><br />
        Example:
        <div class="flex gap-4 mt-3">
          <div class="bg-black w-2.25 h-2.25 rounded-full mt-1.5" />
          <p class="flex-1">
            Bob participated in a public sale and purchased an NFT. The current
            value was removed and replaced with a new random value within the
            range of the variable NFT model, which was valued at $2,000. Since
            Bob purchased the variable NFT for $1,000, he made a 200% ROI. Bob
            decided to sell the variable NFT to the next buyer for $3,000.
          </p>
        </div>
        <div class="flex gap-4">
          <div class="bg-black w-2.25 h-2.25 rounded-full mt-1.5" />
          <p class="flex-1">
            Alice purchased the same NFT from Bob, and the current value was
            replaced with a new random value within the range of the variable
            NFT model, which was valued at $4,500. Since Alice purchased the
            variable NFT for $3,000, she made a 150% ROI. Alice decided to sell
            the variable NFT to the next buyer for $5,000.
          </p>
        </div>
        <div class="flex gap-4">
          <div class="bg-black w-2.25 h-2.25 rounded-full mt-1.5" />
          <p class="flex-1">
            Peter purchased the same NFT from Alice, and the current value was
            replaced with a new random value within the range of the variable
            NFT model, which was valued at $1,500.
          </p>
        </div>
        <div class="flex gap-4">
          <div class="bg-black w-2.25 h-2.25 rounded-full mt-1.5" />
          <p class="flex-1">
            Peter was not satisfied with the NFT's value and decided to reverse
            the sale back to the smart contract to receive 100% liquidity
            protection (minus any spillage that Alice may set as a market
            maker).
          </p>
        </div>
        <div class="flex gap-4">
          <div class="bg-black w-2.25 h-2.25 rounded-full mt-1.5" />
          <p class="flex-1">
            Alice received back the variable NFT, but its value changed again
            and became $9,000.
          </p>
        </div>
        <div class="flex gap-4">
          <div class="bg-black w-2.25 h-2.25 rounded-full mt-1.5" />
          <p class="flex-1">
            Alice decided to claim the NFT and mint the corresponding amount of
            NFTmx tokens behind it, which created a start value of 300% of her
            initial $3,000 purchase price.
          </p>
        </div>
        <br />
        This example only shows a scenario of a purchase with a value change
        without including the potential of multilevel ownership that can add
        value to each buyer.
        <div
          @click="openDescription = false"
          class="absolute top-0 right-0 bg-black px-2.25 py-0.75 text-white hover:text-red-900 cursor-pointer transition"
        >
          <font-awesome-icon :icon="['fas', 'times']" />
        </div>
      </div>
      <div class="flex">
        <div v-if="viewOption === 'TILE'" class="flex-1">
          <div v-if="offerings.length > 0">
            <public-sale-card v-for="(item, index) in 4" :key="index" />
          </div>
          <div v-else class="flex flex-col items-center h-104 justify-center">
            <div class="text-red-600 font-ibm-bold text-lg">
              No offers available
            </div>
            <div class="text-tertiary-400 text-sm mt-3.5">
              <span class="text-primary-900"> Launch </span>
              <span>
                your own Initial Offering | Sign up to receive an alert when a
                new offering becomes available
              </span>
            </div>
            <div class="text-2xl text-tertiary-400 mt-5 flex gap-6">
              <font-awesome-icon :icon="['fab', 'telegram-plane']" />
              <font-awesome-icon :icon="['fab', 'discord']" />
              <font-awesome-icon :icon="['fab', 'twitter']" />
            </div>
          </div>
        </div>
        <div v-if="viewOption === 'LIST'" class="flex-1 overflow-auto -m-4">
          <div
            class="overflow-x-auto text-11 tracking-wider leading-4 mt-3.5 p-4"
          >
            <div class="w-full min-w-fit relative">
              <table
                class="w-full divide-y divide-black font-ibm text-white z-1 relative"
              >
                <nftmx-thead>
                  <tr>
                    <th v-for="i in 6" :key="i" />
                    <th
                      class="border border-black py-4 text-primary-900 bg-tertiary-800 shadow-default shadow-primary-900"
                      colspan="3"
                      style="width: 291px"
                    >
                      <div>Liquidity Protection</div>
                    </th>
                  </tr>
                  <nftmx-tr class="border border-black bg-tertiary-800">
                    <nftmx-th class="text-left">#</nftmx-th>
                    <nftmx-th class="text-left">Item</nftmx-th>
                    <nftmx-th class="text-left">Total supply</nftmx-th>
                    <nftmx-th class="text-left">Floor price</nftmx-th>
                    <nftmx-th class="text-left">Last value</nftmx-th>
                    <nftmx-th class="text-left">Multilevel ownership</nftmx-th>
                    <th style="width: 99px" class="relative">
                      <div class="w-24">Period</div>
                      <div
                        class="absolute w-2 h-full -left-2.25 top-0 bg-gradient-to-r opacity-30 from-transparent to-primary-900"
                      />
                    </th>
                    <th style="width: 100px">
                      <div class="w-24.5">Slippage</div>
                    </th>
                    <th style="width: 99px" class="relative">
                      <div class="w-24">Staking</div>
                      <div
                        class="absolute w-2 h-8.25 -right-2.25 top-0 bg-gradient-to-r opacity-30 from-primary-900"
                      />
                    </th>
                  </nftmx-tr>
                </nftmx-thead>
                <nftmx-tbody
                  :style="{
                    border: '1px solid black',
                  }"
                  class="bg-tertiary-800"
                >
                  <nftmx-tr
                    v-for="(asset, index) in 10"
                    :key="index"
                    class="hover:bg-tertiary-300 transition cursor-pointer shadow-default hover:shadow-primary-900"
                  >
                    <nftmx-td class="td-info">
                      <span>
                        {{ index + 1 }}
                      </span>
                      <font-awesome-icon
                        :icon="['fas', 'star']"
                        class="text-tertiary-600 hover:text-primary-900 ml-2"
                      />
                    </nftmx-td>
                    <td class="td-info px-4 py-3">
                      <div class="flex gap-4.5 items-center">
                        <div class="w-11 h-11">
                          <nftmx-img
                            :src="'/images/nfts/cryptopunks.png'"
                            class="h-full w-full object-cover bg-black"
                          />
                        </div>
                        <div class="flex-grow">
                          <span>
                            <!-- {{ asset.name }} -->
                            Bored Ape Yatch Club
                          </span>
                        </div>
                      </div>
                    </td>
                    <nftmx-td class="td-info">
                      <!-- 1:{{ asset.contract.items }} -->
                      1:20
                    </nftmx-td>
                    <nftmx-td class="td-info"> Individual </nftmx-td>
                    <nftmx-td class="td-info text-primary-900">
                      <div class="flex items-center">
                        <font-awesome-icon :icon="['fab', 'ethereum']" />
                        <!-- <font-awesome-icon
                          v-if="asset.chain === 'ETHEREUM'"
                          :icon="['fab', 'ethereum']"
                        />
                        <div
                          v-if="asset.chain === 'BSC-TESTNET'"
                          class="w-3 h-3 fill-primary-900"
                        >
                          <svg viewBox="0 0 24 24">
                            <title>Binance</title>
                            <path
                              d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                            />
                          </svg>
                        </div> -->
                        <span class="ml-1">
                          {{ roundTo(0.1) }}
                        </span>
                      </div>
                      <div class="text-tertiary-400">
                        [${{ roundTo(0.4781, 4) }}]
                      </div>
                    </nftmx-td>
                    <nftmx-td class="td-info"> 23.53% </nftmx-td>
                    <td
                      class="text-center td-info bg-tertiary-800 relative"
                      style="width: 99px"
                    >
                      <div class="w-24">
                        <!-- {{
                          asset.currentOrder
                            ? Math.round(
                                asset.currentOrder.protectionTime / 86400
                              )
                            : 0
                        }} -->
                        365 Days
                      </div>
                      <div
                        class="absolute w-2 h-full -left-2.25 top-0 bg-gradient-to-r opacity-30 from-transparent to-primary-900"
                      />
                    </td>
                    <td
                      class="text-center td-info bg-tertiary-800 relative"
                      style="width: 100px"
                    >
                      <div class="w-24.5">
                        <!-- {{
                          asset.currentOrder
                            ? 100 - asset.currentOrder.protectionRate
                            : 0
                        }}% -->
                        0%
                      </div>
                    </td>
                    <td
                      class="text-center td-info relative bg-tertiary-800"
                      style="width: 99px"
                    >
                      <div class="w-24">
                        <div>Yes</div>
                      </div>
                      <div
                        class="absolute w-2 h-17.25 -right-2.25 top-0 bg-gradient-to-r opacity-30 from-primary-900"
                      />
                    </td>
                    <td class="td-action" colspan="6">
                      <div class="text-center">
                        <span> Current auction ends in </span>
                        <div class="pt-2.5 w-fit mx-auto max-w-full">
                          <timer :time="1000000" />
                        </div>
                      </div>
                    </td>
                    <td
                      class="td-action p-0 relative"
                      colspan="3"
                      style="width: 291px; height: 69px"
                    >
                      <!-- <router-link
                        :to="{
                          name: 'asset',
                          params: {
                            chain: asset.contract.chain,
                            tokenAddress: asset.contract.address,
                            tokenId: asset.tokenId,
                          },
                        }"
                        target="_blank"
                        class="absolute left-0 top-0 h-full"
                      > -->
                      <div class="absolute left-0 top-0 h-full">
                        <nftmx-button
                          v-if="
                            asset.currentOrder &&
                            asset.currentOrder.orderStatus === '0' &&
                            asset.currentOrder.orderType === '0'
                          "
                          color="primary"
                          :label="'BUY NOW'"
                          class="w-76.25 font-press text-sm z-1"
                          h="xl1"
                        />
                        <nftmx-button
                          v-else
                          color="primary"
                          label="BID NOW"
                          class="w-76.25 font-press text-sm z-1"
                          h="xl1"
                        />
                        <div
                          :class="[
                            asset.currentOrder
                              ? 'bg-primary-100'
                              : 'bg-primary-100',
                            'absolute w-3 h-3 rotate-45 right-0.5 -bottom-2',
                          ]"
                        />
                      </div>
                      <!-- </router-link> -->
                    </td>
                  </nftmx-tr>
                </nftmx-tbody>
              </table>
              <div
                class="absolute bottom-0 right-0 w-75 h-2 shadow-default shadow-primary-900 z-0"
              />
            </div>
          </div>
        </div>
        <cart :nftCart="isCartOpened" :chain="filterOption.chain" />
      </div>
    </div>
  </div>
</template>

<style scoped>
tr:hover .td-info {
  display: none;
}
.td-action {
  display: none;
}
tr:hover .td-action {
  display: table-cell;
}
</style>

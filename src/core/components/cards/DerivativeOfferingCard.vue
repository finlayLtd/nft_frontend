<script setup>
import NftmxTrimString from "@/core/components/basic/NftmxTrimString.vue";
import Timer from "@/core/components/timer/Timer.vue";
import NftmxInput from "@/core/components/basic/NftmxInput.vue";
import Accordion from "@/core/components/accordion/BasicAccordion.vue";
import NftmxTooltip from "../basic/NftmxTooltip.vue";
import DerivativeOfferingCarousel from "@/core/components/carousel/DerivativeOfferingCarousel.vue";
import { shortenAddress, roundTo, getChainKey } from "@/core/utils/common";
import { useStore } from "vuex";
import { computed, ref, watch } from "vue";

const props = defineProps({
  offering: Object,
});

const store = useStore();
const amount = ref();
const total = ref(0);
const coinPrice = computed(
  () => store.state.market.coinPrice[getChainKey(props.offering.chain)]
);

const addToCart = (addingItem) => {
  store.commit("market/addToCart", addingItem);
};
const addManyToCart = () => {
  if (!amount.value) return;
  for (let i = 0; i < amount.value; i++) {
    addToCart({
      ...props.offering.nfts[i],
      contract: { chain: props.offering.chain },
    });
  }
};
watch(amount, (val) => {
  total.value = 0;
  for (let i = 0; i < val; i++) {
    total.value += props.offering.nfts[i].currentOrder.tokenPrice;
  }
});
</script>

<template>
  <div
    class="relative text-white offering-card hover:shadow-default hover:shadow-primary-900 border border-black bg-tertiary-800"
  >
    <div
      class="w-2 h-2 absolute -right-0.5 top-10 bg-primary-900 bg-opacity-60 rotate-45"
    />
    <div class="w-full h-165 absolute">
      <img
        src="/images/landing/hero-image-background-1920.png"
        class="object-center object-cover h-full"
      />
      <div
        class="absolute top-0 w-full h-full bg-gradient-to-t from-tertiary-800"
      />
    </div>
    <div class="relative text-white pt-3.5 px-9 pb-7 h-full">
      <div
        class="flex items-center justify-end gap-1 text-tertiary-400 mt-14.5 z-10"
      >
        <nftmx-tooltip
          :adjust="10"
          text="This NFT is for sale at a fixed price"
        >
          <div
            class="cursor-pointer child fill-tertiary-400 rounded-full w-7 h-7 flex items-center justify-center"
          >
            <font-awesome-icon :icon="['fas', 'tag']" class="text-base" />
          </div>
        </nftmx-tooltip>
        <nftmx-tooltip :adjust="10" text="This NFT is for sale via auction">
          <div
            class="cursor-pointer child fill-tertiary-400 rounded-full w-7 h-7 flex items-center justify-center"
          >
            <font-awesome-icon :icon="['fas', 'gavel']" class="text-base" />
          </div>
        </nftmx-tooltip>
        <nftmx-tooltip
          :adjust="10"
          text="This NFT is for sale with 100% liquidity protection"
        >
          <div
            class="cursor-pointer child fill-tertiary-400 rounded-full w-7 h-7 flex items-center justify-center"
          >
            <font-awesome-icon
              :icon="['fas', 'shield-alt']"
              class="text-base"
            />
          </div>
        </nftmx-tooltip>
        <nftmx-tooltip
          :adjust="10"
          text="This item is exclusive to NFT.Protection and cannot be sold on other exchanges."
        >
          <div
            class="cursor-pointer child fill-tertiary-400 rounded-full w-7 h-7 flex items-center justify-center"
          >
            <svg viewBox="0 0 28 28" class="w-6 h-6">
              <g>
                <path
                  class="st0"
                  d="M14,3.7C8.32,3.7,3.7,8.32,3.7,14S8.32,24.3,14,24.3S24.3,19.68,24.3,14S19.68,3.7,14,3.7z M5.14,14
      c0-4.88,3.97-8.86,8.86-8.86c2.25,0,4.31,0.85,5.87,2.25l-3.75,3.75c-0.15-0.16-0.3-0.31-0.44-0.44c-0.03-0.03-0.07-0.07-0.11-0.1
      c-0.14-0.13-0.27-0.24-0.38-0.33c-0.05-0.04-0.1-0.08-0.14-0.12c-0.05-0.04-0.1-0.07-0.12-0.09c-0.01-0.01-0.02-0.01-0.03-0.01
      l-0.12-0.03V9.02c0-0.16-0.06-0.31-0.17-0.41s-0.25-0.17-0.41-0.17c-0.32,0-0.58,0.26-0.58,0.58v0.67l-0.06-0.02l-0.16-0.05
      l-0.15-0.04c0,0,0,0,0,0h0l-1.12-0.3c-0.05-0.01-0.09,0.04-0.07,0.08l0.18,0.33c0.02,0.04,0.04,0.08,0.06,0.13
      c0.03,0.06,0.06,0.12,0.09,0.18c0.03,0.05,0.05,0.11,0.08,0.17c0.06,0.13,0.12,0.27,0.18,0.42c0.04,0.1,0.08,0.2,0.12,0.3
      c0.1,0.26,0.2,0.54,0.28,0.83c0.03,0.09,0.05,0.18,0.08,0.27l0.01,0.05c0.03,0.13,0.06,0.27,0.08,0.4
      c0.02,0.09,0.03,0.18,0.04,0.27c0.01,0.1,0.03,0.2,0.03,0.3c0.01,0.09,0.01,0.19,0.01,0.28c0,0.23-0.02,0.46-0.07,0.67
      c-0.01,0.03-0.02,0.07-0.03,0.1l-2.15,2.15c-0.01-0.01-0.02-0.02-0.03-0.02H8.06c-0.05,0-0.09,0.04-0.09,0.09v0.06
      c0,0.83,0.3,1.57,0.79,2.16l-1.37,1.37C6,18.31,5.14,16.25,5.14,14z M13.63,16.3v1.15h-1.47c-0.09,0-0.19-0.01-0.28-0.04L13,16.3
      H13.63z M14,22.86c-2.11,0-4.05-0.74-5.57-1.98L9.9,19.4c0.45,0.22,0.95,0.36,1.49,0.36h5.32c1.27,0,1.84-1.49,2.59-2.52
      c0.29-0.41,1-0.73,1.2-0.82c0.03-0.01,0.06-0.05,0.06-0.09v-0.66c0-0.06-0.06-0.1-0.12-0.09l-3.1,0.9c-0.02,0-0.03,0.01-0.04,0.03
      c-0.34,0.38-0.63,0.63-0.69,0.68c-0.19,0.16-0.43,0.25-0.68,0.25h-1.12V16.3h0.89c0.02,0,0.05-0.01,0.06-0.02l0.12-0.11
      c0.05-0.05,0.11-0.1,0.18-0.17c0.04-0.04,0.09-0.09,0.13-0.14c0.05-0.05,0.09-0.1,0.13-0.14c0.07-0.08,0.14-0.15,0.21-0.24
      c0.05-0.05,0.1-0.12,0.14-0.18c0.05-0.06,0.1-0.12,0.15-0.19c0.03-0.05,0.07-0.1,0.11-0.15c0.03-0.05,0.07-0.1,0.1-0.15
      c0.09-0.14,0.16-0.28,0.23-0.43c0.03-0.07,0.06-0.14,0.08-0.22c0.03-0.07,0.05-0.14,0.06-0.22c0.04-0.18,0.05-0.35,0.03-0.52
      c0-0.05-0.01-0.11-0.02-0.16v-0.01c0-0.04-0.01-0.08-0.02-0.11c-0.04-0.17-0.1-0.34-0.17-0.51c-0.03-0.06-0.05-0.12-0.08-0.18
      c-0.03-0.05-0.06-0.11-0.1-0.16l3.87-3.87c1.24,1.52,1.98,3.46,1.98,5.57C22.86,18.88,18.88,22.86,14,22.86z"
                />
                <path
                  class="st0"
                  d="M11.53,15.04c0.03,0,0.06-0.01,0.08-0.04c0.04-0.05,0.07-0.11,0.1-0.17c0.24-0.4,0.45-0.82,0.52-1.14
      c0.18-0.77-0.2-2.01-0.65-3c-0.03-0.07-0.12-0.07-0.16-0.01l-2.65,4.15L8.72,14.9c-0.04,0.06,0,0.14,0.08,0.14H11.53z"
                />
              </g>
            </svg>
          </div>
        </nftmx-tooltip>
        <nftmx-tooltip
          :adjust="10"
          text="This item has multilevel ownership, meaning that previous owners keep equity in this asset when it is sold forward."
        >
          <div
            class="child cursor-pointer fill-tertiary-400 rounded-full w-7 h-7 flex items-center justify-center"
          >
            <svg viewBox="0 0 28 28" class="w-5.5 h-5.5">
              <path
                class="st0"
                d="M25.42,14.53c0-0.32-0.19-0.61-0.49-0.74l-3.02-1.26l3.02-1.26c0.3-0.12,0.49-0.42,0.49-0.74
	c0-0.32-0.19-0.61-0.49-0.74l-10.7-4.47c-0.2-0.08-0.42-0.08-0.62,0L2.91,9.79c-0.3,0.12-0.49,0.42-0.49,0.74
	c0,0.32,0.19,0.61,0.49,0.74l3.02,1.26l-3.02,1.26c-0.3,0.12-0.49,0.42-0.49,0.74c0,0.32,0.19,0.61,0.49,0.74l3.02,1.26l-3.02,1.26
	c-0.3,0.12-0.49,0.42-0.49,0.74c0,0.32,0.19,0.61,0.49,0.74l10.7,4.47c0.1,0.04,0.2,0.06,0.31,0.06s0.21-0.02,0.31-0.06l10.7-4.47
	c0.3-0.12,0.49-0.42,0.49-0.74c0-0.32-0.19-0.61-0.49-0.74l-3.02-1.26l3.02-1.26C25.23,15.14,25.42,14.85,25.42,14.53z M13.92,6.92
	l8.63,3.61l-3.02,1.26c0,0,0,0,0,0l-5.61,2.34l-5.61-2.34c0,0,0,0,0,0l-3.02-1.26L13.92,6.92z M22.55,18.53l-8.63,3.61l-8.63-3.61
	L8,17.4l5.61,2.34c0.1,0.04,0.2,0.06,0.31,0.06s0.21-0.02,0.31-0.06l5.61-2.34L22.55,18.53z M19.53,15.79
	C19.53,15.79,19.53,15.79,19.53,15.79l-5.61,2.34l-5.61-2.34c0,0,0,0,0,0l-3.02-1.26L8,13.4l5.61,2.34c0.1,0.04,0.2,0.06,0.31,0.06
	s0.21-0.02,0.31-0.06l5.61-2.34l2.71,1.13L19.53,15.79z"
              />
            </svg>
          </div>
        </nftmx-tooltip>
        <nftmx-tooltip
          :adjust="10"
          :text="
            'This NFT belongs to the ' +
            (offering.chain === 'ETHEREUM' ? 'Ethereum' : 'BSC Testnet') +
            ' blockchain'
          "
        >
          <div
            class="cursor-pointer child fill-tertiary-400 rounded-full w-7 h-7 flex items-center justify-center"
          >
            <font-awesome-icon
              v-if="offering.chain === 'ETHEREUM'"
              :icon="['fab', 'ethereum']"
              class="text-lg"
            />
            <div v-if="offering.chain === 'BSC-TESTNET'" class="w-4 h-4">
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
          </div>
        </nftmx-tooltip>
      </div>
      <div
        class="relative mt-4 flex items-center gap-4 after:absolute after:top-14 after:h-9.5 after:border-l after:border-l-black after:left-5.5"
      >
        <img
          :src="offering.originNft.contract.imageUrl"
          class="w-11 h-11 bg-tertiary-900"
        />
        <div>
          <div class="text-xs text-tertiary-400">Collection</div>
          <nftmx-trim-string
            class="text-white font-ibm-bold text-lg leading-none mt-2"
          >
            {{ offering.originNft.contract.name }}
          </nftmx-trim-string>
        </div>
      </div>
      <div
        class="relative mt-6.5 pl-16 before:absolute before:left-0 before:top-1/2 before:border-t before:border-b before:border-t-black before:border-b-tertiary-700 before:w-8 before:ml-5.5 after:absolute after:top-13.5 after:h-4 after:border-l after:border-l-black after:left-21"
      >
        <div class="flex items-center gap-4">
          <img
            :src="offering.originNft.imageUrl"
            class="w-11.25 h-11.25 bg-tertiary-900"
          />
          <div class="text-11">
            <div class="text-tertiary-400">Locked NFT</div>
            <nftmx-trim-string class="text-white font-ibm-medium">
              {{ offering.originNft.name }}
            </nftmx-trim-string>
          </div>
        </div>
      </div>
      <div class="h-28 mt-9 -mx-9">
        <derivative-offering-carousel
          :nfts="offering?.nfts || []"
          :chain="offering.chain"
          @add-to-cart="addToCart"
        />
      </div>
      <div class="mt-10.25">
        <div class="relative bg-tertiary-700 h-6 mt-9">
          <div
            class="h-full bg-primary-900 shadow-default shadow-primary-900"
            :style="{ width: '70%' }"
          />
          <div
            class="absolute text-xs w-full h-full top-0 left-0 flex justify-center items-center"
          >
            <span> Total Sales: </span>
            <font-awesome-icon :icon="['fab', 'ethereum']" class="mx-1" />
            <span> 53.6353 [$253.56k] </span>
          </div>
        </div>
        <div class="relative bg-tertiary-700 h-6 mt-2.5">
          <div
            class="h-full bg-primary-900 shadow-default shadow-primary-900"
            :style="{ width: '70%' }"
          />
          <div
            class="absolute text-xs w-full h-full top-0 left-0 flex justify-center items-center"
          >
            <span> Supply Available: </span>
            <span> 146 NFTS [34.56%] </span>
          </div>
        </div>
      </div>
      <div class="flex justify-between font-ibm-bold mt-7.75">
        <span> Offering ends in </span>
        <timer :time="999999" size="head" />
      </div>
      <div class="flex justify-between mt-10 text-sm">
        <div class="font-ibm-bold mt-3">Amount of Derivatives</div>
        <div>
          <div class="flex items-center w-full">
            <div
              class="bg-tertiary-700 w-40 flex-1 shadow-default shadow-tertiary-700"
            >
              <nftmx-input
                v-model="amount"
                class="h-13"
                number
                border="none"
                placeholder="Type amount"
                :max="offering.nfts?.length"
              />
            </div>
            <div
              class="bg-primary-900 shadow-default shadow-primary-900 h-13 flex items-center justify-center w-24"
              @click="addManyToCart()"
            >
              <div class="w-5.5 h-5.5 fill-white">
                <svg viewBox="0 0 64 64">
                  <g>
                    <path
                      class="st0"
                      d="M62.95,13.89c0.27-1.27-0.53-2.51-1.8-2.79c-1.27-0.27-2.51,0.53-2.79,1.8l-4.81,22.34H20.72L13.64,5.71H2.41
		c-1.3,0-2.35,1.05-2.35,2.35s1.05,2.35,2.35,2.35h7.53l9.12,38.05h36.51c1.3,0,2.35-1.05,2.35-2.35s-1.05-2.35-2.35-2.35H22.76
		l-0.92-3.83h35.49L62.95,13.89z"
                    />
                    <circle class="st0" cx="26" cy="54.57" r="4.04" />
                    <circle class="st0" cx="48.41" cy="54.57" r="4.04" />
                    <polygon
                      class="st0"
                      points="50.1,18.37 41.24,18.37 41.24,5.71 37.07,5.71 32.9,5.71 32.9,18.37 24.04,18.37 37.07,30.46 	"
                    />
                  </g>
                </svg>
              </div>
            </div>
          </div>
          <div class="text-11 flex items-center gap-1">
            <font-awesome-icon
              v-if="offering.chain === 'ETHEREUM'"
              :icon="['fab', 'ethereum']"
            />
            <div
              v-if="offering.chain === 'BSC-TESTNET'"
              class="w-3 h-3 fill-white"
            >
              <svg viewBox="0 0 24 24">
                <path
                  d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                />
              </svg>
            </div>
            <span> {{ roundTo(total) }} </span>
            <span class="text-tertiary-400">
              [${{ roundTo(total * coinPrice) }}]
            </span>
          </div>
        </div>
      </div>
      <div
        class="border-t border-t-black border-b border-b-tertiary-700 mt-3.5"
      />
      <div class="mt-3">
        <accordion
          mIcon
          :border="false"
          :sidebar="true"
          class="w-full overflow-hidden"
        >
          <template #caption="{ open }">
            <div
              class="flex justify-between items-center text-15 font-ibm-medium py-3 mr-4 h-10"
            >
              <div class="flex items-center gap-4">
                <div class="w-3 h-3 rounded-full bg-primary-900" />
                <span> Live #1 </span>
              </div>
              <span> {{ open ? "Hide" : "Show" }} </span>
            </div>
          </template>
          <div class="mt-1">
            <div class="flex justify-between text-sm py-1.25">
              <span class="text-tertiary-400 font-ibm-medium">
                Blockchain:
              </span>
              <span> Ethereum </span>
            </div>
            <div class="flex justify-between text-sm py-1.25">
              <span class="text-tertiary-400 font-ibm-medium">
                Amount of derivatives:
              </span>
              <span> 10,000 </span>
            </div>
            <div class="flex justify-between text-sm py-1.25">
              <span class="text-tertiary-400 font-ibm-medium">
                Type of supply:
              </span>
              <span> Fractional </span>
            </div>
            <div class="flex justify-between text-sm py-1.25">
              <span class="text-tertiary-400 font-ibm-medium">
                Type of sale:
              </span>
              <span> Auction </span>
            </div>
            <div class="flex justify-between text-sm py-1.25">
              <span class="text-tertiary-400 font-ibm-medium">
                Fundrasing soft cap:
              </span>
              <span>
                <font-awesome-icon :icon="['fab', 'ethereum']" />
                <span> 100[$160,000] </span>
              </span>
            </div>
          </div>
          <div
            class="border-t border-t-black border-b border-b-tertiary-700 mt-10"
          />
          <div class="mt-3">
            <div
              class="text-sm py-1.25 text-tertiary-400 font-ibm-medium underline decoration-2"
            >
              Multilevel Ownership
            </div>
            <div class="flex justify-between text-sm py-1.25 mt-1">
              <span class="text-tertiary-400 font-ibm-medium"> Owners: </span>
              <span> 1 </span>
            </div>
            <div class="flex justify-between text-sm py-1.25">
              <span class="text-tertiary-400 font-ibm-medium">
                Total ownership:
              </span>
              <span> 20% </span>
            </div>
          </div>
          <div
            class="border-t border-t-black border-b border-b-tertiary-700 mt-4"
          />
          <div class="mt-2">
            <div
              class="text-sm py-1.25 text-tertiary-400 font-ibm-medium underline decoration-2"
            >
              100% Liquidity Protection
            </div>
            <div class="flex justify-between text-sm py-1.25 mt-1">
              <span class="text-tertiary-400 font-ibm-medium">
                Maximum Period:
              </span>
              <span> 365 days </span>
            </div>
            <div class="flex justify-between text-sm py-1.25">
              <span class="text-tertiary-400 font-ibm-medium">
                Minimum Fees:
              </span>
              <span> slippage 10% | staking leverage </span>
            </div>
          </div>
        </accordion>
      </div>
    </div>
    <div
      class="absolute top-0 -right-1 h-11 w-fill items-center text-sm text-white leading-4"
    >
      <div
        class="px-6 bg-primary-900 bg-opacity-60 h-full flex items-center gap-2 justify-center"
      >
        <font-awesome-icon :icon="['fas', 'shield-alt']" />
        <span>
          100% Liquidity Protection | 365 Days | 10% Slippage | 20% Ownership
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.w-fill {
  width: calc(100% + 4px);
}
.offering-card:hover .child {
  background-color: rgb(21, 21, 21);
  color: rgb(148, 148, 148);
  fill: rgb(148, 148, 148);
}
</style>

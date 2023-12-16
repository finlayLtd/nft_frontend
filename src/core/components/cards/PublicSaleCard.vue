<script setup>
import Accordion from "@/core/components/accordion/BasicAccordion.vue";
import { ref } from "vue";
import Timer from "@/core/components/timer/Timer.vue";
import NftmxInput from "@/core/components/basic/NftmxInput.vue";
import NftmxTooltip from "../basic/NftmxTooltip.vue";

const open = ref(false);
const option = ref("Change");

const onClickOutside = () => {
  open.value = false;
};
const handleClick = () => {
  open.value = !open.value;
};
</script>

<template>
  <div
    class="relative bg-black text-white hover:shadow-default hover:shadow-primary-900 pb-12"
  >
    <div
      class="w-2 h-2 absolute -left-0.5 top-10 bg-primary-900 bg-opacity-60 rotate-45"
    />
    <img
      src="/images/landing/hero-image-background-1920.png"
      class="w-full h-full object-center object-cover absolute"
    />
    <div
      class="absolute top-0 -left-1 h-11 w-full flex gap-2 items-center text-sm text-white leading-4 justify-between"
    >
      <div
        class="px-6 bg-primary-900 bg-opacity-60 h-full flex items-center justify-center gap-2 shadow-default shadow-primary-900"
      >
        <font-awesome-icon :icon="['fas', 'shield-alt']" />
        <span>
          100% Liquidity Protection | 365 Days | 10% Slippage | 20% Ownership
        </span>
      </div>
      <div class="flex items-center gap-2 text-tertiary-400 mr-10 mt-2 z-10">
        <nftmx-tooltip
          :adjust="10"
          text="This NFT is for sale at a fixed price"
        >
          <font-awesome-icon
            :icon="['fas', 'tag']"
            class="text-xl cursor-pointer"
          />
        </nftmx-tooltip>
        <nftmx-tooltip :adjust="10" text="This NFT is for sale via auction">
          <font-awesome-icon
            :icon="['fas', 'gavel']"
            class="text-xl cursor-pointer ml-1"
          />
        </nftmx-tooltip>
        <nftmx-tooltip
          :adjust="10"
          text="This NFT is for sale with 100% liquidity protection"
        >
          <font-awesome-icon
            :icon="['fas', 'shield-alt']"
            class="text-xl cursor-pointer ml-1"
          />
        </nftmx-tooltip>
        <nftmx-tooltip
          :adjust="10"
          text="This item is exclusive to NFT.Protection and cannot be sold on other exchanges."
        >
          <svg
            viewBox="0 0 28 28"
            class="w-7.5 h-7.5 cursor-pointer fill-tertiary-400"
          >
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
        </nftmx-tooltip>
        <nftmx-tooltip
          :adjust="10"
          text="This item has multilevel ownership, meaning that previous owners keep equity in this asset when it is sold forward."
        >
          <svg
            viewBox="0 0 28 28"
            class="w-7 h-7 cursor-pointer fill-tertiary-400"
          >
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
        </nftmx-tooltip>
        <nftmx-tooltip
          :adjust="10"
          :text="'This NFT belongs to the Ethereum blockchain'"
        >
          <font-awesome-icon
            :icon="['fab', 'ethereum']"
            class="text-2xl cursor-pointer"
          />
        </nftmx-tooltip>
      </div>
    </div>
    <div class="relative grid grid-cols-12 text-white pt-19">
      <div class="px-13 border-r border-r-black col-span-7">
        <p class="text-base font-ibm-bold">
          This variable NFT is backed by
          <span class="text-primary-900">100,000</span>-<span> 1,000,000 </span>
          NFTPX tokens with a variable value that changes randomly with each
          transaction
        </p>
        <div class="grid grid-cols-2 mt-4.5">
          <div>
            <video controls class="w-full h-full object-cover">
              <source
                src="https://www.w3schools.com/html/mov_bbb.mp4"
                type="video/mp4"
              />
            </video>
          </div>
          <div class="relative text-sm bg-tertiary-700 px-6 pt-6 pb-21">
            <div class="flex justify-between">
              <span> NFTPX amount </span>
              <span class="text-primary-900"> 100,000 </span>
            </div>
            <div class="flex gap-2 items-center mt-4.5 mb-0.5">
              <div
                class="border-t border-t-black border-b border-b-tertiary-600 w-full h-0"
              />
              <div
                class="text-black font-ibm-bold text-11 whitespace-nowrap text-shadow-h1"
              >
                Multilevel Ownership
              </div>
              <div
                class="border-t border-t-black border-b border-b-tertiary-600 w-full h-0"
              />
            </div>
            <div class="text-11 text-white font-ibm">
              <div class="flex justify-between">
                <span class="font-ibm-medium">Owners</span>
                <span class="text-primary-900"> 1 </span>
              </div>
              <div class="flex justify-between">
                <span class="font-ibm-medium">Total Ownership</span>
                <span class="text-primary-900"> 20% </span>
              </div>
            </div>
            <div class="flex gap-2 items-center mt-1.75 mb-0.5">
              <div
                class="border-t border-t-black border-b border-b-tertiary-600 w-full h-0"
              />
              <div
                class="text-black font-ibm-bold text-11 whitespace-nowrap text-shadow-h1"
              >
                Liquidity Protection
              </div>
              <div
                class="border-t border-t-black border-b border-b-tertiary-600 w-full h-0"
              />
            </div>
            <div class="text-11 text-white font-ibm">
              <div class="flex justify-between">
                <span class="font-ibm-medium">Period</span>
                <span class="text-primary-900"> 365 Days </span>
              </div>
              <div class="flex justify-between">
                <span class="font-ibm-medium">Fees</span>
                <div class="flex items-center">
                  <span class="text-primary-900"> Slippage 10% </span>
                  <div class="h-2.5 mx-1.5 border-l border-tertiary-400" />
                  <span class="text-tertiary-400"> Staking </span>
                </div>
              </div>
            </div>
            <div class="relative bg-tertiary-800 h-6 mt-3.5">
              <div class="h-full bg-primary-900" :style="{ width: '10%' }" />
              <div
                class="absolute text-xs w-full h-full top-0 left-0 flex justify-center items-center"
              >
                <span> Available Supply </span>
              </div>
            </div>
            <div class="flex flex-col items-center mt-3.5 gap-2">
              <span class="text-11"> Current Offer ends in </span>
              <timer :time="999999" size="head" class="font-ibm-bold" />
            </div>
            <div
              class="absolute left-0 bottom-0 h-15 w-full bg-primary-900 font-press flex items-center justify-center shadow-default shadow-primary-900"
            >
              BUY NOW
            </div>
          </div>
        </div>
      </div>
      <div class="px-13 border-l border-l-tertiary-700 col-span-5">
        <p class="text-base font-ibm-bold">
          Provide prompt instructions to the AI to change the variable NFT's
          appearance
        </p>
        <div class="grid grid-cols-2 gap-7 mt-4.5">
          <img src="/images/nfts/img1.png" class="h-32.5 w-full object-cover" />
          <img src="/images/nfts/img1.png" class="h-32.5 w-full object-cover" />
          <img src="/images/nfts/img1.png" class="h-32.5 w-full object-cover" />
          <img src="/images/nfts/img1.png" class="h-32.5 w-full object-cover" />
        </div>
        <div class="flex justify-between items-center w-full mt-12 text-sm">
          <div
            class="bg-tertiary-700 w-40 flex-1 shadow-default shadow-tertiary-700 flex"
          >
            <div
              v-click-outside="onClickOutside"
              class="bg-tertiary-800 h-11.5 relative z-10"
            >
              <accordion
                class="overflow-hidden px-4 bg-tertiary-800"
                :border="false"
                sidebar
                v-model="open"
                @handle-click="handleClick"
                handleEmit
              >
                <template v-slot:caption>
                  <div class="text-sm py-3.5 font-ibm-medium w-20">
                    {{ option }}
                  </div>
                </template>
                <div class="font-ibm-medium">
                  <div
                    @click="
                      option = 'Add';
                      open = false;
                    "
                    class="py-2 cursor-pointer hover:text-primary-900 transition"
                  >
                    Add
                  </div>
                  <div
                    @click="
                      option = 'Remove';
                      open = false;
                    "
                    class="py-2 cursor-pointer hover:text-primary-900 transition"
                  >
                    Remove
                  </div>
                  <div
                    @click="
                      option = 'Change';
                      open = false;
                    "
                    class="py-2 cursor-pointer hover:text-primary-900 transition"
                  >
                    Change
                  </div>
                </div>
              </accordion>
            </div>
            <nftmx-input
              class="h-11.5"
              number
              border="none"
              placeholder="Enter your prompt to change the NFT"
            />
          </div>
          <div
            class="cursor-pointer bg-tertiary-600 shadow-default shadow-tertiary-600 h-11.5 flex items-center justify-center w-24 text-primary-900 font-ibm-medium"
          >
            CREATE
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
figure {
  max-width: 64rem;
  width: 100%;
  max-height: 30.875rem;
  height: 100%;
  margin: 1.25rem auto;
  padding: 1.051%;
  background-color: #666;
}
</style>

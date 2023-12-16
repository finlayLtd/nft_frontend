<script setup>
import NftmxInput from "@/core/components/basic/NftmxInput.vue";
import NftmxTextarea from "@/core/components/basic/NftmxTextarea.vue";
import NftmxRadio from "@/core/components/basic/NftmxRadio.vue";
import NftmxDivider from "@/core/components/basic/NftmxDivider.vue";
import NftmxButton from "@/core/components/basic/NftmxButton.vue";
import BasicDropdown from "@/core/components/dropdown/BasicDropdown.vue";
import BasicDropdownItem from "@/core/components/dropdown/BasicDropdownItem.vue";
import { computed, ref } from "vue";
import NftmxTooltip from "@/core/components/basic/NftmxTooltip.vue";
import { useToast } from "vue-toastification";
import DatePicker from "@/core/components/v-calendar/src/components/DatePicker/DatePicker.vue";

const props = defineProps({
  sellCriteria: Object,
});
const emit = defineEmits(["set-sell-criteria", "move-back"]);

const toast = useToast();
const saleType = ref(props.sellCriteria.saleType ?? "INDIVIDUAL");
const triggerSaleByOption = ref(
  props.sellCriteria.triggerSaleByOption ?? "VALUE_OF"
);
const nftAmountOfPack = ref(props.sellCriteria.nftAmountOfPack);
const triggerSaleByValue = ref(props.sellCriteria.triggerSaleByValue);
const triggerSaleByDate = ref(props.sellCriteria.triggerSaleByDate);
const triggerSaleByDateDisplay = computed(() => {
  if (!triggerSaleByDate.value) return "";
  const date = new Date(triggerSaleByDate.value);
  return (
    date.toLocaleString("default", { month: "long" }) +
    " " +
    date.getDate() +
    ", " +
    date.getFullYear()
  );
});
const triggerSaleByDatePicker = ref(false);
const saleModel = ref(props.sellCriteria.saleModel ?? "AUCTION");
const softCapOption = ref(props.sellCriteria.softCapOption ?? "PRICE");
const softCapPrice = ref(props.sellCriteria.softCapPrice);
const liquidity = ref(props.sellCriteria.liquidity ?? true);
const downsideProtection = ref(props.sellCriteria.downsideProtection);
const protectionPeriod = ref(props.sellCriteria.protectionPeriod);
const applySlippageReward = ref(
  props.sellCriteria.applySlippageReward ?? false
);
const slippageRewardOption = ref(
  props.sellCriteria.slippageRewardOption ?? "PURCHASED"
);
const slippageRewardValue = ref(props.sellCriteria.slippageRewardValue);
const stakingReward = ref(props.sellCriteria.stakingReward ?? false);
const useRoyalty = ref(props.sellCriteria.useRoyalty ?? false);
const maxOwners = ref(props.sellCriteria.maxOwners);
const royaltyOption = ref(props.sellCriteria.royaltyOption ?? "FOREVER");
const royaltyPercentage = ref(props.sellCriteria.royaltyPercentage);
const buyoutPrice = ref(props.sellCriteria.buyoutPrice);
const triggerRefundBy = ref(
  props.sellCriteria.triggerRefundBy ?? "BEFORE_ENDS"
);
const warn = ref(false);

const nextStep = () => {
  if (
    (saleType.value === "PACK" && isNaN(nftAmountOfPack.value)) ||
    (triggerSaleByOption.value === "VALUE_OF" &&
      isNaN(triggerSaleByValue.value)) ||
    isNaN(softCapPrice.value) ||
    isNaN(downsideProtection.value) ||
    isNaN(protectionPeriod.value) ||
    (useRoyalty.value &&
      (isNaN(royaltyPercentage.value) ||
        isNaN(buyoutPrice.value) ||
        (royaltyOption.value === "LIMIT" && isNaN(maxOwners.value))))
  ) {
    warn.value = true;
    toast.error("Please fill out the fields");
    return;
  }

  const sellCriteria = {
    saleType: saleType.value,
    nftAmountOfPack: nftAmountOfPack.value,
    triggerSaleByOption: triggerSaleByOption.value,
    triggerSaleByValue: triggerSaleByValue.value,
    saleModel: saleModel.value,
    softCapOption: softCapOption.value,
    softCapPrice: softCapPrice.value,
    downsideProtection: downsideProtection.value,
    protectionPeriod: protectionPeriod.value,
    useRoyalty: useRoyalty.value,
    maxOwners: maxOwners.value,
    royaltyOption: royaltyOption.value,
    royaltyPercentage: royaltyPercentage.value,
    buyoutPrice: buyoutPrice.value,
    triggerRefundBy: triggerRefundBy.value,
  };
  emit("set-sell-criteria", sellCriteria);
};
const closeDatePicker = () => {
  triggerSaleByDatePicker.value = false;
};
</script>

<template>
  <div>
    <div
      class="text-tertiary-400 cursor-pointer transition hover:text-secondary-700 h-fit mt-3"
      @click="emit('move-back', 2)"
    >
      <font-awesome-icon :icon="['fas', 'angle-left']" />
      <span class="text-sm"> Back </span>
    </div>
    <div class="mt-7">
      <span class="font-ibm-bold text-3xl text-white">Sell criteria</span>
    </div>
    <div class="font-ibm-medium text-white text-lg mt-11">
      <div class="grid 2xl:grid-cols-2 items-center 2xl:gap-24">
        <div class="grid sm:grid-cols-2 2xl:grid-cols-12 items-center">
          <div class="col-span-1 2xl:col-span-5">Sale type</div>
          <div
            class="col-span-1 2xl:col-span-7 flex items-center text-sm font-ibm mt-3.25 sm:mt-0"
          >
            <div class="grid grid-cols-2 items-center w-full justify-between">
              <div
                class="flex gap-3 items-center w-fit cursor-pointer"
                @click="saleType = 'INDIVIDUAL'"
              >
                <nftmx-radio :active="saleType === 'INDIVIDUAL'" />
                <span class="flex-1">
                  <span>Sell as individual</span>
                  <nftmx-tooltip
                    text="The NFT Protection marketplace supports fixed sale and auction capabilities. Both options have the ability to add Liquidity Protection and DAO"
                  >
                    <sup>
                      <font-awesome-icon
                        :icon="['fas', 'question-circle']"
                        class="text-10 cursor-pointer ml-1"
                      />
                    </sup>
                  </nftmx-tooltip>
                </span>
              </div>
              <div
                class="flex gap-3 items-center w-fit cursor-pointer"
                @click="saleType = 'PACK'"
              >
                <nftmx-radio :active="saleType === 'PACK'" />
                <span class="flex-1">
                  <span>Sell within a pack</span>
                  <nftmx-tooltip
                    text="Packs allow you to sell multiple NFTs at one time"
                  >
                    <sup>
                      <font-awesome-icon
                        :icon="['fas', 'question-circle']"
                        class="text-10 cursor-pointer ml-1"
                      />
                    </sup>
                  </nftmx-tooltip>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="saleType === 'PACK'"
          class="grid sm:grid-cols-2 2xl:grid-cols-12 items-center text-sm font-ibm"
        >
          <div class="col-span-1 2xl:col-span-5">Amount of NFT pack</div>
          <div
            class="col-span-1 2xl:col-span-7 flex items-center mt-3.25 sm:mt-0 bg-tertiary-700"
          >
            <nftmx-input
              :error="warn && saleType === 'PACK' && isNaN(nftAmountOfPack)"
              class="h-12.5"
              number
              v-model="nftAmountOfPack"
              border="thick"
            />
          </div>
        </div>
      </div>
      <div class="grid 2xl:grid-cols-2 items-center mt-7 2xl:gap-24">
        <div class="grid sm:grid-cols-2 2xl:grid-cols-12 items-center">
          <div class="col-span-1 2xl:col-span-5">
            <span>
              Trigger to sale by
              <nftmx-tooltip
                text="Once the time period ends, your NFT is sent back to your wallet automatically."
              >
                <sup>
                  <font-awesome-icon
                    :icon="['fas', 'question-circle']"
                    class="text-xs cursor-pointer"
                  />
                </sup>
              </nftmx-tooltip>
            </span>
          </div>
          <div
            class="col-span-1 2xl:col-span-7 flex items-center text-sm font-ibm mt-3.25 sm:mt-0"
          >
            <div class="grid grid-cols-2 items-center w-full justify-between">
              <div
                class="flex gap-3 items-center w-fit cursor-pointer"
                @click="triggerSaleByOption = 'DATE'"
              >
                <nftmx-radio :active="triggerSaleByOption === 'DATE'" />
                <span>Date</span>
              </div>
              <div
                class="flex gap-3 items-center w-fit cursor-pointer"
                @click="triggerSaleByOption = 'VALUE_OF'"
              >
                <nftmx-radio :active="triggerSaleByOption === 'VALUE_OF'" />
                <span>Value of</span>
              </div>
            </div>
          </div>
        </div>
        <div class="font-ibm text-sm mt-7 2xl:mt-0">
          <div
            v-if="triggerSaleByOption === 'DATE'"
            class="flex items-center w-full h-14 gap-6 relative"
          >
            <font-awesome-icon
              :icon="['fas', 'calendar-alt']"
              :class="[
                warn && !triggerSaleByDateDisplay ? 'text-red-800' : '',
                'text-lg cursor-pointer',
              ]"
              @click="triggerSaleByDatePicker = true"
            />
            <span>{{ triggerSaleByDateDisplay }}</span>
            <div
              v-if="triggerSaleByDatePicker"
              class="absolute top-10 w-full z-10 max-w-lg"
              v-click-outside="closeDatePicker"
            >
              <date-picker
                v-model="triggerSaleByDate"
                is-dark
                is-expanded
                mode="dateTime"
              />
            </div>
          </div>
          <div
            v-if="triggerSaleByOption === 'VALUE_OF'"
            :class="[
              warn && isNaN(triggerSaleByValue)
                ? 'border-red-800'
                : 'border-black',
              'flex items-center w-full border-2 ',
            ]"
          >
            <div class="bg-tertiary-700 w-full flex-1">
              <nftmx-input
                class="h-12.5"
                number
                v-model="triggerSaleByValue"
                border="none"
              />
            </div>
            <div class="bg-black h-12.5 flex items-center justify-center w-24">
              ETH
            </div>
          </div>
        </div>
      </div>
      <div class="grid 2xl:grid-cols-2 items-center mt-7 2xl:gap-24">
        <div class="grid sm:grid-cols-2 2xl:grid-cols-12 items-center">
          <div class="col-span-1 2xl:col-span-5">Sale model</div>
          <div
            class="col-span-1 2xl:col-span-7 flex items-center text-sm font-ibm mt-3.25 sm:mt-0"
          >
            <div class="grid grid-cols-2 items-center w-full justify-between">
              <div
                class="flex gap-3 items-center w-fit cursor-pointer"
                @click="saleModel = 'AUCTION'"
              >
                <nftmx-radio :active="saleModel === 'AUCTION'" />
                <span>Auction</span>
              </div>
              <div
                class="flex gap-3 items-center w-fit cursor-pointer"
                @click="saleModel = 'FIX_SALE'"
              >
                <nftmx-radio :active="saleModel === 'FIX_SALE'" />
                <span>Fix sale</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="grid 2xl:grid-cols-2 items-center mt-7 2xl:gap-24">
        <div class="grid sm:grid-cols-2 2xl:grid-cols-12 items-center">
          <div class="col-span-1 2xl:col-span-5">Minimum sell price</div>
          <div
            class="col-span-1 2xl:col-span-7 flex items-center text-sm font-ibm mt-3.25 sm:mt-0"
          >
            <div class="grid grid-cols-2 items-center w-full justify-between">
              <div
                class="flex gap-3 items-center w-fit cursor-pointer"
                @click="softCapOption = 'ROI'"
              >
                <nftmx-radio :active="softCapOption === 'ROI'" />
                <span>
                  ROI
                  <nftmx-tooltip
                    text="ROI is based on crypto percentage return"
                  >
                    <sup>
                      <font-awesome-icon
                        :icon="['fas', 'question-circle']"
                        class="text-10 cursor-pointer"
                      />
                    </sup>
                  </nftmx-tooltip>
                </span>
              </div>
              <div
                class="flex gap-3 items-center w-fit cursor-pointer"
                @click="softCapOption = 'PRICE'"
              >
                <nftmx-radio :active="softCapOption === 'PRICE'" />
                <span>
                  Above Purchased Price
                  <nftmx-tooltip text="Purchase price is based on USD return">
                    <sup>
                      <font-awesome-icon
                        :icon="['fas', 'question-circle']"
                        class="text-10 cursor-pointer"
                      />
                    </sup>
                  </nftmx-tooltip>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="font-ibm-medium text-sm mt-7 2xl:mt-0">
          <div class="sm:grid grid-cols-2 2xl:grid-cols-1">
            <div></div>
            <div
              :class="[
                warn && isNaN(softCapPrice) ? 'border-red-900' : 'border-black',
                'flex items-center w-full border-2',
              ]"
            >
              <div
                class="bg-black h-12.5 flex items-center justify-center w-12"
              >
                <span v-if="softCapOption === 'ROI'"> % </span>
                <font-awesome-icon v-else :icon="['fab', 'ethereum']" />
              </div>
              <div class="bg-tertiary-700 w-full flex-1">
                <nftmx-input
                  class="h-12.5"
                  number
                  v-model="softCapPrice"
                  border="none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="border-t border-black border-b border-b-tertiary-800 mt-7" />
      <div class="grid 2xl:grid-cols-2 items-center mt-7 2xl:gap-24">
        <div class="grid sm:grid-cols-2 2xl:grid-cols-12 items-center">
          <div class="col-span-1 2xl:col-span-5">
            <span>
              Liquidity protection
              <nftmx-tooltip
                text="The higher the liquidity protection, the more the buyer is protected and the greater your APY rewards. Higher Liquidity Protection may encourage buyers to spend above the floor price since they are peotected."
              >
                <sup>
                  <font-awesome-icon
                    :icon="['fas', 'question-circle']"
                    class="text-xs cursor-pointer"
                  />
                </sup>
              </nftmx-tooltip>
            </span>
          </div>
          <div
            class="col-span-1 2xl:col-span-7 flex items-center text-sm font-ibm mt-3.25 sm:mt-0"
          >
            <div class="grid grid-cols-2 items-center w-full justify-between">
              <div
                class="flex gap-3 items-center w-fit cursor-pointer"
                @click="liquidity = false"
              >
                <nftmx-radio :active="liquidity === false" />
                <span>No</span>
              </div>
              <div
                class="flex gap-3 items-center w-fit cursor-pointer"
                @click="liquidity = true"
              >
                <nftmx-radio :active="liquidity === true" />
                <span>Yes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="grid 2xl:grid-cols-2 items-center mt-7 2xl:gap-24">
        <div class="grid sm:grid-cols-2 2xl:grid-cols-12 items-center">
          <div class="col-span-1 2xl:col-span-5">
            <span>
              Slippage
              <nftmx-tooltip
                text="The higher the liquidity protection, the more the buyer is protected and the greater your APY rewards. Higher Liquidity Protection may encourage buyers to spend above the floor price since they are peotected."
              >
                <sup>
                  <font-awesome-icon
                    :icon="['fas', 'question-circle']"
                    class="text-xs cursor-pointer"
                  />
                </sup>
              </nftmx-tooltip>
            </span>
          </div>
          <div
            class="col-span-1 2xl:col-span-7 flex items-center text-sm font-ibm mt-3.25 sm:mt-0"
          >
            <div
              :class="[
                warn && isNaN(downsideProtection)
                  ? 'border-red-800'
                  : 'border-black',
                'flex items-center w-full border-2',
              ]"
            >
              <div class="bg-tertiary-700 w-full flex-1">
                <nftmx-input
                  class="h-12.5"
                  number
                  v-model="downsideProtection"
                  border="none"
                  :max="100"
                />
              </div>
              <div
                class="bg-black h-12.5 flex items-center justify-center w-12"
              >
                %
              </div>
            </div>
          </div>
        </div>
        <div
          class="grid sm:grid-cols-2 2xl:grid-cols-12 items-center mt-7 2xl:mt-0"
        >
          <div class="col-span-1 2xl:col-span-5">
            <span>
              Protection period
              <nftmx-tooltip
                text="Benefit from APY returns when utilizing Liquidity Protection to sell a NFT. You earn APY on the amount of purchase price once the buyer puchases the NFT for the entire protection period."
              >
                <sup>
                  <font-awesome-icon
                    :icon="['fas', 'question-circle']"
                    class="text-10 cursor-pointer"
                  />
                </sup>
              </nftmx-tooltip>
            </span>
          </div>
          <div class="col-span-1 2xl:col-span-7 w-full mt-3.25 sm:mt-0">
            <div class="flex justify-between gap-6">
              <div class="text-sm flex items-center font-ibm">
                Due date minus
              </div>
              <div
                :class="[
                  warn && isNaN(protectionPeriod)
                    ? 'border-red-800'
                    : 'border-black',
                  'flex items-center w-full text-sm font-ibm bg-tertiary-700 border-2 flex-1',
                ]"
              >
                <div class="bg-tertiary-700 w-full flex-1">
                  <nftmx-input
                    class="h-12.5"
                    number
                    v-model="protectionPeriod"
                    border="none"
                  />
                </div>
                <div
                  class="bg-black h-12.5 flex items-center justify-center w-24"
                >
                  DAYS
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="grid 2xl:grid-cols-2 items-center mt-7 2xl:gap-24">
        <div class="grid sm:grid-cols-2 2xl:grid-cols-12 items-center">
          <div class="col-span-1 2xl:col-span-5">
            <span>
              Apply slippage reward
              <nftmx-tooltip
                text="The higher the liquidity protection, the more the buyer is protected and the greater your APY rewards. Higher Liquidity Protection may encourage buyers to spend above the floor price since they are peotected."
              >
                <sup>
                  <font-awesome-icon
                    :icon="['fas', 'question-circle']"
                    class="text-xs cursor-pointer"
                  />
                </sup>
              </nftmx-tooltip>
            </span>
          </div>
          <div
            class="col-span-1 2xl:col-span-7 flex items-center text-sm font-ibm mt-3.25 sm:mt-0"
          >
            <div class="grid grid-cols-2 items-center w-full justify-between">
              <div
                class="flex gap-3 items-center w-fit cursor-pointer"
                @click="applySlippageReward = false"
              >
                <nftmx-radio :active="applySlippageReward === false" />
                <span>No</span>
              </div>
              <div
                class="flex gap-3 items-center w-fit cursor-pointer"
                @click="applySlippageReward = true"
              >
                <nftmx-radio :active="applySlippageReward === true" />
                <span>Yes</span>
              </div>
            </div>
          </div>
        </div>
        <div
          class="grid sm:grid-cols-2 2xl:grid-cols-12 items-center mt-7 2xl:mt-0"
        >
          <div class="col-span-1 2xl:col-span-5">
            <span>
              Slippage reward
              <nftmx-tooltip
                text="The higher the liquidity protection, the more the buyer is protected and the greater your APY rewards. Higher Liquidity Protection may encourage buyers to spend above the floor price since they are peotected."
              >
                <sup>
                  <font-awesome-icon
                    :icon="['fas', 'question-circle']"
                    class="text-xs cursor-pointer"
                  />
                </sup>
              </nftmx-tooltip>
            </span>
          </div>
          <div
            class="col-span-1 2xl:col-span-7 flex items-center text-sm font-ibm mt-3.25 sm:mt-0"
          >
            <div class="grid grid-cols-3 items-center w-full justify-between">
              <div
                class="flex gap-3 items-center w-fit cursor-pointer"
                @click="slippageRewardOption = 'PURCHASED'"
              >
                <nftmx-radio :active="slippageRewardOption === 'PURCHASED'" />
                <span class="flex-1">Same as purchased</span>
              </div>
              <div
                class="flex gap-3 items-center w-fit cursor-pointer"
                @click="slippageRewardOption = 'FIXED'"
              >
                <nftmx-radio :active="slippageRewardOption === 'FIXED'" />
                <span>Fixed</span>
              </div>
              <div class="flex items-center text-sm font-ibm mt-3.25 sm:mt-0">
                <div
                  :class="[
                    warn && isNaN(slippageRewardValue)
                      ? 'border-red-800'
                      : 'border-black',
                    'flex items-center w-full border-2',
                  ]"
                >
                  <div class="bg-tertiary-700 w-full flex-1">
                    <nftmx-input
                      class="h-12.5"
                      number
                      v-model="slippageRewardValue"
                      border="none"
                      :max="100"
                    />
                  </div>
                  <div
                    class="bg-black h-12.5 flex items-center justify-center w-12"
                  >
                    %
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="grid 2xl:grid-cols-2 items-center mt-7 2xl:gap-24">
        <div class="grid sm:grid-cols-2 2xl:grid-cols-12 items-center">
          <div class="col-span-1 2xl:col-span-5">
            <span>
              Apply staking reward
              <nftmx-tooltip
                text="The higher the liquidity protection, the more the buyer is protected and the greater your APY rewards. Higher Liquidity Protection may encourage buyers to spend above the floor price since they are peotected."
              >
                <sup>
                  <font-awesome-icon
                    :icon="['fas', 'question-circle']"
                    class="text-xs cursor-pointer"
                  />
                </sup>
              </nftmx-tooltip>
            </span>
          </div>
          <div
            class="col-span-1 2xl:col-span-7 flex items-center text-sm font-ibm mt-3.25 sm:mt-0"
          >
            <div class="grid grid-cols-2 items-center w-full justify-between">
              <div
                class="flex gap-3 items-center w-fit cursor-pointer"
                @click="stakingReward = false"
              >
                <nftmx-radio :active="stakingReward === false" />
                <span>No</span>
              </div>
              <div
                class="flex gap-3 items-center w-fit cursor-pointer"
                @click="stakingReward = true"
              >
                <nftmx-radio :active="stakingReward === true" />
                <span>Yes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="border-t border-black border-b border-b-tertiary-800 mt-7" />
      <div class="grid 2xl:grid-cols-2 items-center mt-7 2xl:gap-24">
        <div
          class="grid sm:grid-cols-2 2xl:grid-cols-12 items-start lg:items-center"
        >
          <div class="col-span-1 2xl:col-span-5">
            <span>
              Apply ongoing multilevel ownership
              <nftmx-tooltip
                text="Add a royalty that follows your purchases throughout it's lifecycle on NFTPX"
              >
                <sup>
                  <font-awesome-icon
                    :icon="['fas', 'question-circle']"
                    class="text-xs cursor-pointer"
                  />
                </sup>
              </nftmx-tooltip>
            </span>
          </div>
          <div
            class="col-span-1 2xl:col-span-7 text-sm font-ibm mt-3.25 sm:mt-0 grid grid-cols-2"
          >
            <div
              class="flex gap-3 items-center w-fit cursor-pointer"
              @click="useRoyalty = false"
            >
              <nftmx-radio :active="!useRoyalty" />
              <span>No</span>
            </div>
            <div
              class="flex gap-3 items-center w-fit cursor-pointer"
              @click="useRoyalty = true"
            >
              <nftmx-radio :active="useRoyalty" />
              <span>Yes</span>
            </div>
          </div>
        </div>
        <div
          v-if="useRoyalty === true"
          class="mt-7 2xl:mt-0 font-ibm text-sm sm:grid grid-cols-2 2xl:grid-cols-1"
        >
          <div></div>
          <div class="grid grid-cols-2 2xl:flex justify-between items-center">
            <div
              class="flex gap-3 items-center w-fit cursor-pointer"
              @click="royaltyOption = 'FOREVER'"
            >
              <nftmx-radio :active="royaltyOption === 'FOREVER'" />
              <span>
                Forever
                <nftmx-tooltip text="Set ownership interest in perpetuity">
                  <sup>
                    <font-awesome-icon
                      :icon="['fas', 'question-circle']"
                      class="text-10 cursor-pointer"
                    />
                  </sup>
                </nftmx-tooltip>
              </span>
            </div>
            <div
              class="flex gap-3 items-center w-fit cursor-pointer"
              @click="royaltyOption = 'LIMIT'"
            >
              <nftmx-radio :active="royaltyOption === 'LIMIT'" />
              <span class="flex-1">
                For limited transfers
                <nftmx-tooltip
                  text="Limit the amount of transfers you will continue earning a royalty"
                >
                  <sup>
                    <font-awesome-icon
                      :icon="['fas', 'question-circle']"
                      class="text-10 cursor-pointer"
                    />
                  </sup>
                </nftmx-tooltip>
              </span>
            </div>
            <div
              :class="[
                warn && royaltyOption === 'LIMIT' && isNaN(maxOwners)
                  ? 'border-red-800'
                  : 'border-black',
                'flex items-center border-2 w-full 2xl:w-fit mt-4 2xl:mt-0 col-span-2',
              ]"
            >
              <div class="bg-tertiary-700 w-full flex-1">
                <nftmx-input
                  class="h-12.5 w-full 2xl:w-30"
                  number
                  v-model="maxOwners"
                  border="none"
                />
              </div>
              <div
                class="bg-black h-12.5 flex items-center justify-center w-36"
              >
                TRANSFERS
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="useRoyalty === true"
        class="grid 2xl:grid-cols-2 items-center mt-7 2xl:gap-24"
      >
        <div class="grid sm:grid-cols-2 2xl:grid-cols-12 items-center">
          <div class="col-span-1 2xl:col-span-5 2xl:pr-8">
            <span>
              Baseline multilevel ownership
              <nftmx-tooltip
                text="The higher the liquidity protection, the more the buyer is protected and the greater your APY rewards. Higher Liquidity Protection may encourage buyers to spend above the floor price since they are peotected."
              >
                <sup>
                  <font-awesome-icon
                    :icon="['fas', 'question-circle']"
                    class="text-xs cursor-pointer"
                  />
                </sup>
              </nftmx-tooltip>
            </span>
          </div>
          <div
            class="col-span-1 2xl:col-span-7 flex items-center text-sm font-ibm mt-3.25 sm:mt-0"
          >
            <div
              :class="[
                warn && isNaN(royaltyPercentage)
                  ? 'border-red-800'
                  : 'border-black',
                'flex items-center w-full border-2',
              ]"
            >
              <div class="bg-tertiary-700 w-full flex-1">
                <nftmx-input
                  class="h-12.5"
                  number
                  v-model="royaltyPercentage"
                  border="none"
                />
              </div>
              <div
                class="bg-black h-12.5 flex items-center justify-center w-12"
              >
                %
              </div>
            </div>
          </div>
        </div>
        <div
          class="grid sm:grid-cols-2 2xl:grid-cols-12 items-center mt-7 2xl:mt-0"
        >
          <div class="col-span-1 2xl:col-span-5">
            <div>
              <span> Buyout multiplier price </span>
            </div>
            <div class="text-11 text-red-800">Above last purchasing price</div>
          </div>
          <div class="col-span-1 2xl:col-span-7 w-full mt-3.25 sm:mt-0">
            <div
              :class="[
                warn && isNaN(buyoutPrice) ? 'border-red-800' : 'border-black',
                'flex items-center w-full text-sm font-ibm border-2',
              ]"
            >
              <div class="bg-tertiary-700 w-full flex-1">
                <nftmx-input
                  class="h-12.5"
                  number
                  v-model="buyoutPrice"
                  border="none"
                />
              </div>
              <div
                class="bg-black h-12.5 flex items-center justify-center w-12"
              >
                %
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="border-t border-black border-b border-b-tertiary-800 mt-7" />
      <div class="grid 2xl:grid-cols-2 items-center mt-7 2xl:gap-24">
        <div class="grid sm:grid-cols-2 2xl:grid-cols-12 items-center">
          <div class="col-span-1 2xl:col-span-5">
            <span>
              Trigger liquidity protection by
              <nftmx-tooltip
                text="Once Liquidity Protection is trigger, the DVC funds recycle to complete the process over again with a new NFT"
              >
                <sup>
                  <font-awesome-icon
                    :icon="['fas', 'question-circle']"
                    class="text-xs cursor-pointer"
                  />
                </sup>
              </nftmx-tooltip>
            </span>
          </div>
          <div
            class="col-span-1 2xl:col-span-7 flex items-center text-sm font-ibm mt-3.25 sm:mt-0"
          >
            <div class="grid grid-cols-2 items-center w-full justify-between">
              <div
                class="flex gap-3 items-center w-fit cursor-pointer"
                @click="triggerRefundBy = 'DATE'"
              >
                <nftmx-radio :active="triggerRefundBy === 'DATE'" />
                <span>Date</span>
              </div>
              <div
                class="flex gap-3 items-center w-fit cursor-pointer"
                @click="triggerRefundBy = 'BEFORE_ENDS'"
              >
                <nftmx-radio :active="triggerRefundBy === 'BEFORE_ENDS'" />
                <span class="flex-1"> Before liquidity protection ends </span>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="triggerRefundBy === 'DATE'"
          class="flex items-center w-full h-13.5 gap-6 font-ibm text-sm"
        >
          <font-awesome-icon
            :icon="['fas', 'calendar-alt']"
            class="text-lg cursor-pointer"
          />
          <span>May3, 2021</span>
        </div>
      </div>
    </div>
    <div class="flex justify-between items-center mt-17 mb-20">
      <div
        class="text-tertiary-400 cursor-pointer transition hover:text-secondary-700 h-fit"
        @click="emit('move-back', 2)"
      >
        <font-awesome-icon :icon="['fas', 'angle-left']" />
        <span class="text-sm"> Back </span>
      </div>
      <nftmx-button
        outline
        color="secondary"
        textColor="white"
        label="NEXT STEP"
        class="font-press px-38 text-lg"
        h="xl2"
        customPx
        @click="nextStep"
      />
    </div>
  </div>
</template>

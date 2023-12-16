<script setup>
import { computed, ref } from "vue";
import NftmxSearchInput from "@/core/components/basic/NftmxSearchInput.vue";
import SearchAccordion from "@/core/components/accordion/SearchAccordion.vue";
import useDebouncedRef from "@/core/utils/hook/useDebouncedRef";
import NftmxInput from "@/core/components/basic/NftmxInput.vue";
import FilterItem from "@/core/components/basic/FilterItem.vue";
import SearchDropdown from "@/core/components/dropdown/SearchDropdown.vue";
import NftmxButton from "@/core/components/basic/NftmxButton.vue";
import { useStore } from "vuex";
import { themeConfig } from "@/core/config/constant";
import NftmxImg from "@/core/components/basic/NftmxImg.vue";
import NftmxRadio from "@/core/components/basic/NftmxRadio.vue";
import NftmxTooltip from "@/core/components/basic/NftmxTooltip.vue";
import BasicCheckbox from "@/core/components/basic/BasicCheckbox.vue";
import Accordion from "@/core/components/accordion/Accordion.vue";

const emit = defineEmits(["search-dvcs"]);

const store = useStore();
const userId = computed(() => store.getters["auth/userId"]);
const filterActive = ref(false);
const dvcName = useDebouncedRef("", 1000);
const fundStruct = ref();
const filteredDvcs = ref([]);
const investmentTypes = ref([
  "Art",
  "Collectibles",
  "Music",
  "Sport",
  "Photography",
]);
const investmentTypeIndex = ref();
const minInvestment = ref();
const maxInvestment = ref();
const feeStruct = ref();
const minCarry = ref();
const maxCarry = ref();
const kyc = ref();
const minRoi = ref();
const maxRoi = ref();
const minFunds = ref();
const maxFunds = ref();
const backersAllowedOptions = ref([
  "1 to 10",
  "10 to 100",
  "100 to 1,000",
  "1,000 to 10,000",
  "10,000 to max",
]);
const backersAllowedIndex = ref();
const buyType = ref();
const buyModel = ref();
const maxToInvest = ref();
const cancelInvest = ref();
const minBuyPrice = ref();
const maxBuyPrice = ref();
const minTrans = ref();
const maxTrans = ref();
const minUnique = ref();
const maxUnique = ref();
const minBuyProtection = ref();
const maxBuyProtection = ref();
const buyMlr = ref();
const collectionLimit = ref();
const sellType = ref();
const triggerOption = ref();
const sellModel = ref();
const softCapOption = ref();
const sellProtection = ref();
const sellPeriod = ref();
const useSellMlr = ref();
const myInvest = ref();
const buyCriteria = ref(true);
const sellCriteria = ref(true);

const handleFilter = () => {
  filterActive.value = !filterActive.value;
};
const onKeyDown = (evt) => {
  if (evt.keyCode === 13) {
    evt.preventDefault();
    return;
  }
};
const checkMyInvest = (checked) => {
  myInvest.value = checked;
};
const search = () => {
  const searchOption = {
    name: dvcName.value,
    fundStruct: fundStruct.value,
    feeStruct: feeStruct.value,
    minCarry: minCarry.value,
    maxCarry: maxCarry.value,
    minBackers: isNaN(backersAllowedIndex.value)
      ? 0
      : Math.pow(10, backersAllowedIndex.value),
    maxBackers: isNaN(backersAllowedIndex.value)
      ? 0
      : Math.pow(10, backersAllowedIndex.value + 1),
    minInvest: minInvestment.value,
    maxInvest: maxInvestment.value,
    minRoi: minRoi.value,
    maxRoi: maxRoi.value,
    kyc: kyc.value,
    minFunds: minFunds.value,
    maxFunds: maxFunds.value,
    buyType: buyType.value,
    buyModel: buyModel.value,
    maxToInvest: maxToInvest.value,
    cancelInvest: cancelInvest.value,
    minBuyPrice: minBuyPrice.value,
    maxBuyPrice: maxBuyPrice.value,
    minTrans: minTrans.value,
    maxTrans: maxTrans.value,
    minUnique: minUnique.value,
    maxUnique: maxUnique.value,
    minBuyProtection: minBuyProtection.value,
    maxBuyProtection: maxBuyProtection.value,
    buyMlr: buyMlr.value,
    collectionLimit: collectionLimit.value,
    sellType: sellType.value,
    triggerOption: triggerOption.value,
    sellModel: sellModel.value,
    softCapOption: softCapOption.value,
    sellProtection: sellProtection.value,
    sellPeriod: sellPeriod.value,
    useSellMlr: useSellMlr.value,
    userId: myInvest.value ? userId.value : "",
  };

  emit("search-dvcs", searchOption);
};
</script>

<template>
  <div class="bg-tertiary-800 px-4 sm:px-10 lg:px-22 border-b border-black">
    <div class="py-5 flex gap-5">
      <div class="w-full flex justify-between items-center gap-4 h-13">
        <div class="flex items-center w-full">
          <font-awesome-icon
            :icon="['fas', 'search']"
            class="text-white text-lg pointer-events-none"
          />
          <input
            v-if="store.state.app.windowWidth >= themeConfig.sm"
            class="text-sm text-white pl-6 py-2 font-ibm placeholder-tertiary-500 w-full border-0 focus:outline-none bg-tertiary-800"
            placeholder="Search by DVC fund name"
            v-model="dvcName"
          />
          <textarea
            v-if="store.state.app.windowWidth < themeConfig.sm"
            @keydown="onKeyDown($event)"
            rows="2"
            class="text-sm leading-snug text-white pl-6 py-2 font-ibm-medium placeholder-tertiary-500 w-full border-0 outline-none focus:outline-none bg-tertiary-800 resize-none"
            placeholder="Search by DVC fund name"
            v-model="dvcName"
          />
        </div>
        <font-awesome-icon
          @click="handleFilter"
          :icon="['fas', 'filter']"
          :class="[
            filterActive ? 'text-secondary-800' : 'text-white',
            'transition text-white hover:text-secondary-800 cursor-pointer text-lg',
          ]"
        />
      </div>
      <nftmx-button
        outline
        textColor="white"
        to="/dvc/launch"
        color="secondary"
        label="LAUNCH YOUR DVC"
        class="font-press text-xs whitespace-nowrap px-11.5"
        customPx
      />
    </div>
    <accordion
      :open="filterActive"
      :delay="0"
      class="overflow-hidden text-white font-ibm text-11"
    >
      <div
        class="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4"
      >
        <div class="border border-black px-5 py-4">
          <div class="text-sm font-ibm-medium">Investment type</div>
          <div class="overflow-auto mt-5 h-[245px]">
            <div
              v-for="(item, index) in investmentTypes"
              :key="index"
              :class="[
                investmentTypeIndex === index ? 'text-primary-900' : '',
                'flex items-center gap-4 py-1.25 cursor-pointer hover:text-primary-900',
              ]"
              @click="investmentTypeIndex = index"
            >
              <span>{{ item }}</span>
            </div>
          </div>
        </div>
        <div>
          <div class="border border-black px-5 pt-4 pb-5.75">
            <div class="text-sm font-ibm-medium">Investment allowed</div>
            <div class="overflow-auto mt-4.75">
              <div class="relative pr-px">
                <div class="relative h-10">
                  <search-dropdown title="(USD)">
                    <template v-slot:content></template>
                  </search-dropdown>
                </div>
              </div>
              <div class="flex mt-3.75 items-center">
                <nftmx-input
                  v-model="minInvestment"
                  number
                  class="h-8.75"
                  placeholder="Min"
                />
                <span class="font-ibm-medium text-white mx-1">To</span>
                <nftmx-input
                  v-model="maxInvestment"
                  number
                  class="h-8.75"
                  placeholder="Max"
                />
              </div>
            </div>
          </div>
          <div class="border border-black px-5 mt-4.75 py-3.5">
            <div class="text-sm font-ibm-medium">Fund structure</div>
            <div class="mt-4">
              <div
                @click="fundStruct = 'OPEN'"
                class="flex items-center gap-2 cursor-pointer w-fit"
              >
                <nftmx-radio size="sm" :active="fundStruct === 'OPEN'" />
                <span>
                  Open ended fund
                  <nftmx-tooltip
                    text="open ended funds allow investors to join and leave the fund at any time"
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
                @click="fundStruct = 'CLOSE'"
                class="flex items-center gap-2 mt-2 mb-4 cursor-pointer w-fit"
              >
                <nftmx-radio size="sm" :active="fundStruct === 'CLOSE'" />
                <span>
                  Close ended fund
                  <nftmx-tooltip
                    text="close ended the funds close fundraising on a due date"
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
            </div>
          </div>
        </div>
        <div>
          <div class="border border-black px-5 py-4 h-42.5">
            <div class="">
              <div
                @click="feeStruct = 'CARRY'"
                class="flex items-center cursor-pointer w-fit gap-2"
              >
                <nftmx-radio size="sm" :active="feeStruct === 'CARRY'" />
                <span class="text-sm"> Carry % </span>
              </div>
              <div
                @click="feeStruct = 'FEE'"
                class="flex items-center cursor-pointer w-fit gap-2 mt-2.5 mb-4"
              >
                <nftmx-radio size="sm" :active="feeStruct === 'FEE'" />
                <span class="text-sm"> Fix fees $ </span>
              </div>
            </div>
            <div class="flex mt-5.75 items-center">
              <nftmx-input
                v-model="minCarry"
                number
                class="h-8.75"
                placeholder="Min"
              />
              <span class="font-ibm-medium text-white mx-1">To</span>
              <nftmx-input
                v-model="maxCarry"
                number
                class="h-8.75"
                placeholder="Max"
              />
            </div>
          </div>
          <div class="border border-black px-5 mt-4.75 py-3.5">
            <div class="text-sm font-ibm-medium">KYC</div>
            <div class="mt-4">
              <div
                @click="kyc = true"
                class="flex items-center w-fit cursor-pointer gap-2"
              >
                <nftmx-radio size="sm" :active="kyc" />
                <span> Yes </span>
              </div>
              <div
                @click="kyc = false"
                class="flex items-center w-fit cursor-pointer gap-2 mt-2 mb-4"
              >
                <nftmx-radio size="sm" :active="!kyc" />
                <span> No </span>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div class="border border-black px-5 py-4 h-42.5">
            <div class="text-sm font-ibm-medium">ROI %</div>
            <div class="flex mt-5 items-center">
              <nftmx-input
                v-model="minRoi"
                number
                class="h-8.75"
                placeholder="Min"
              />
              <span class="font-ibm-medium text-white mx-1">To</span>
              <nftmx-input
                v-model="maxRoi"
                number
                class="h-8.75"
                placeholder="Max"
              />
            </div>
          </div>
          <div class="border border-black px-5 mt-4.75 py-4 h-32.5">
            <div class="text-sm font-ibm-medium">Total funds $</div>
            <div class="flex mt-6.25 items-center">
              <nftmx-input
                v-model="minFunds"
                number
                class="h-8.75"
                placeholder="Min"
              />
              <span class="font-ibm-medium text-white mx-1">To</span>
              <nftmx-input
                v-model="maxFunds"
                number
                class="h-8.75"
                placeholder="Max"
              />
            </div>
          </div>
        </div>
        <div class="border border-black px-5 py-4">
          <div class="text-sm font-ibm-medium">Backers allowed</div>
          <div class="overflow-auto mt-5 h-[245px]">
            <div
              v-for="(item, index) in backersAllowedOptions"
              :key="index"
              :class="[
                backersAllowedIndex === index ? 'text-primary-900' : '',
                'flex items-center gap-4 py-1.25 cursor-pointer hover:text-primary-900',
              ]"
              @click="backersAllowedIndex = index"
            >
              <span>{{ item }}</span>
            </div>
          </div>
        </div>
      </div>
      <div
        class="border-t border-black border-b border-b-tertiary-700 mt-7.75 mb-3.25"
      />
      <div
        class="font-ibm-medium text-lg flex justify-between cursor-pointer"
        @click="buyCriteria = !buyCriteria"
      >
        <span> Buy Criteria </span>
        <font-awesome-icon v-if="buyCriteria" :icon="['fas', 'angle-up']" />
        <font-awesome-icon v-if="!buyCriteria" :icon="['fas', 'angle-down']" />
      </div>
      <div
        v-if="buyCriteria"
        class="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 mt-4"
      >
        <div>
          <div class="border border-black px-5 py-4 h-35">
            <div class="text-sm font-ibm-medium">Buy type</div>
            <div class="mt-5">
              <div
                @click="buyType = 'INDIVIDUAL'"
                class="flex items-center w-fit cursor-pointer gap-2 py-1.25"
              >
                <nftmx-radio size="sm" :active="buyType === 'INDIVIDUAL'" />
                <span> Individual NFT </span>
              </div>
              <div
                @click="buyType = 'PACK'"
                class="flex items-center w-fit cursor-pointer gap-2 py-1.25"
              >
                <nftmx-radio size="sm" :active="buyType === 'PACK'" />
                <span> Pack of NFTs </span>
              </div>
            </div>
          </div>
          <div class="border border-black px-5 py-4 h-35 mt-4.75">
            <div class="text-sm font-ibm-medium">Downside protection</div>
            <div class="flex mt-5 items-center">
              <div class="flex">
                <nftmx-input
                  v-model="minBuyProtection"
                  number
                  class="h-8.75 flex-1"
                  placeholder="Min"
                />
                <div class="bg-black flex items-center justify-center w-8">
                  %
                </div>
              </div>
              <span class="font-ibm-medium text-white mx-1"> To </span>
              <div class="flex">
                <nftmx-input
                  v-model="maxBuyProtection"
                  number
                  class="h-8.75 flex-1"
                  placeholder="Max"
                />
                <div class="bg-black flex items-center justify-center w-8">
                  %
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div class="border border-black px-5 py-4 h-35">
            <div class="text-sm font-ibm-medium">Buy model</div>
            <div class="mt-5">
              <div
                @click="buyModel = 'AUCTION'"
                class="flex items-center w-fit cursor-pointer gap-2 py-1.25"
              >
                <nftmx-radio size="sm" :active="buyModel === 'AUCTION'" />
                <span> Auction </span>
              </div>
              <div
                @click="buyModel = 'FIX_SALE'"
                class="flex items-center w-fit cursor-pointer gap-2 py-1.25"
              >
                <nftmx-radio size="sm" :active="buyModel === 'FIX_SALE'" />
                <span> Fix sale </span>
              </div>
            </div>
          </div>
          <div class="border border-black px-5 py-4 h-35 mt-4.75">
            <div class="text-sm font-ibm-medium">Unique</div>
            <div class="flex mt-5 items-center">
              <span>1/</span>
              <nftmx-input
                v-model="minUnique"
                number
                class="h-8.75"
                placeholder="Min"
              />
              <span class="font-ibm-medium text-white mx-1 whitespace-nowrap">
                To 1/
              </span>
              <nftmx-input
                v-model="maxUnique"
                number
                class="h-8.75"
                placeholder="Max"
              />
            </div>
          </div>
        </div>
        <div>
          <div class="border border-black px-5 py-4 h-35">
            <div class="text-sm font-ibm-medium">NFT value</div>
            <div class="flex mt-5 items-center">
              <div class="flex">
                <div class="bg-black flex items-center justify-center w-8">
                  $
                </div>
                <nftmx-input
                  v-model="minBuyPrice"
                  number
                  class="h-8.75 flex-1"
                />
              </div>
              <span class="font-ibm-medium text-white mx-1"> To </span>
              <div class="flex">
                <div class="bg-black flex items-center justify-center w-8">
                  $
                </div>
                <nftmx-input
                  v-model="maxBuyPrice"
                  number
                  class="h-8.75 flex-1"
                />
              </div>
            </div>
          </div>
          <div class="border border-black px-5 py-4 h-35 mt-4.75">
            <div class="text-sm font-ibm-medium">
              Allow multilevel ownership
            </div>
            <div class="mt-5">
              <div
                @click="buyMlr = true"
                class="flex items-center cursor-pointer w-fit gap-2 py-1.25"
              >
                <nftmx-radio size="sm" :active="buyMlr" />
                <span> Yes </span>
              </div>
              <div
                @click="buyMlr = false"
                class="flex items-center cursor-pointer w-fit gap-2 py-1.25"
              >
                <nftmx-radio size="sm" :active="!buyMlr" />
                <span> No </span>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div class="border border-black px-5 py-4 h-35">
            <div class="text-sm font-ibm-medium">NFT transferred</div>
            <div class="flex mt-5 items-center">
              <nftmx-input
                v-model="minTrans"
                number
                class="h-8.75 flex-1"
                placeholder="Min"
              />
              <span class="font-ibm-medium text-white mx-1"> To </span>
              <nftmx-input
                v-model="maxTrans"
                number
                class="h-8.75 flex-1"
                placeholder="Max"
              />
            </div>
          </div>
          <div class="border border-black px-5 py-4 h-35 mt-4.75">
            <div class="text-sm font-ibm-medium">
              Limited to specific collection
            </div>
            <div class="mt-5">
              <div
                @click="collectionLimit = true"
                class="flex items-center cursor-pointer w-fit gap-2 py-1.25"
              >
                <nftmx-radio size="sm" :active="collectionLimit" />
                <span> Yes </span>
              </div>
              <div
                @click="collectionLimit = false"
                class="flex items-center cursor-pointer w-fit gap-2 py-1.25"
              >
                <nftmx-radio size="sm" :active="!collectionLimit" />
                <span> No </span>
              </div>
            </div>
          </div>
        </div>
        <div class="border border-black px-5 py-4 h-[299px]">
          <div class="text-sm font-ibm-medium">Syndication cap</div>
          <div class="mt-4.75">Investment max per NFT</div>
          <div class="flex mt-2.25 items-center w-full">
            <div class="flex w-full">
              <nftmx-input v-model="maxToInvest" number class="h-8.75 flex-1" />
              <div class="bg-black flex items-center justify-center w-8">%</div>
            </div>
          </div>
          <div class="mt-1.25 text-red-800">Above last transaction</div>
          <div class="mt-5">Withdraw trigger</div>
          <div class="flex mt-2.5 items-center w-full">
            <div class="flex w-full">
              <nftmx-input
                v-model="cancelInvest"
                number
                class="h-8.75 flex-1"
              />
              <div class="bg-black flex items-center justify-center w-8">%</div>
            </div>
          </div>
          <div class="mt-1.75 text-red-800">Above last transaction</div>
        </div>
      </div>
      <div
        class="border-t border-black border-b border-b-tertiary-700 mt-7.25 mb-3"
      />
      <div
        class="font-ibm-medium text-lg flex justify-between cursor-pointer"
        @click="sellCriteria = !sellCriteria"
      >
        <span> Sell Criteria </span>
        <font-awesome-icon v-if="sellCriteria" :icon="['fas', 'angle-up']" />
        <font-awesome-icon v-if="!sellCriteria" :icon="['fas', 'angle-down']" />
      </div>
      <div
        v-if="sellCriteria"
        class="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-7 gap-4 mt-4"
      >
        <div class="border border-black px-5 py-4 h-[155px]">
          <div class="text-sm font-ibm-medium">Sale type</div>
          <div class="mt-2.5">
            <div
              @click="sellType = 'INDIVIDUAL'"
              class="flex items-center w-fit cursor-pointer gap-2 py-1.25"
            >
              <nftmx-radio size="sm" :active="sellType === 'INDIVIDUAL'" />
              <span> Sell as individual </span>
            </div>
            <div
              @click="sellType = 'PACK'"
              class="flex items-center w-fit cursor-pointer gap-2 py-1.25"
            >
              <nftmx-radio size="sm" :active="sellType === 'PACK'" />
              <span> Sell as part a pack </span>
            </div>
          </div>
        </div>
        <div class="border border-black px-5 py-4 h-[155px]">
          <div class="text-sm font-ibm-medium">Trigger to sale by</div>
          <div class="mt-2.5">
            <div
              @click="triggerOption = 'DATE'"
              class="flex items-center w-fit cursor-pointer gap-2 py-1.25"
            >
              <nftmx-radio size="sm" :active="triggerOption === 'DATE'" />
              <span> Date </span>
            </div>
            <div
              @click="triggerOption = 'VALUE_OF'"
              class="flex items-center w-fit cursor-pointer gap-2 py-1.25"
            >
              <nftmx-radio size="sm" :active="triggerOption === 'VALUE_OF'" />
              <span> value </span>
            </div>
          </div>
        </div>
        <div class="border border-black px-5 py-4 h-[155px]">
          <div class="text-sm font-ibm-medium">Sale model</div>
          <div class="mt-2.5">
            <div
              @click="sellModel = 'AUCTION'"
              class="flex items-center w-fit cursor-pointer gap-2 py-1.25"
            >
              <nftmx-radio size="sm" :active="sellModel === 'AUCTION'" />
              <span> Auction </span>
            </div>
            <div
              @click="sellModel = 'FIX_SALE'"
              class="flex items-center w-fit cursor-pointer gap-2 py-1.25"
            >
              <nftmx-radio size="sm" :active="sellModel === 'FIX_SALE'" />
              <span> Fix sale </span>
            </div>
          </div>
        </div>
        <div class="border border-black px-5 py-4 h-[155px]">
          <div class="text-sm font-ibm-medium">Minimum sell price</div>
          <div class="mt-2.5">
            <div
              @click="softCapOption = 'ROI'"
              class="flex items-center w-fit cursor-pointer gap-2 py-1.25"
            >
              <nftmx-radio size="sm" :active="softCapOption === 'ROI'" />
              <span> ROI based </span>
            </div>
            <div
              @click="softCapOption = 'PRICE'"
              class="flex items-center w-fit cursor-pointer gap-2 py-1.25"
            >
              <nftmx-radio size="sm" :active="softCapOption === 'PRICE'" />
              <span> Purchase price based </span>
            </div>
          </div>
        </div>
        <div class="border border-black px-5 py-4 h-[155px]">
          <div class="text-sm font-ibm-medium">Downside protection</div>
          <div class="mt-2.5">
            <div
              @click="sellProtection = '0'"
              class="flex items-center w-fit cursor-pointer gap-2 py-1.25"
            >
              <nftmx-radio size="sm" :active="sellProtection === '0'" />
              <span> Same as buy criteria </span>
            </div>
            <div
              @click="sellProtection = '1'"
              class="flex items-center w-fit cursor-pointer gap-2 py-1.25"
            >
              <nftmx-radio size="sm" :active="sellProtection === '1'" />
              <span> Below buy criteria </span>
            </div>
            <div
              @click="sellProtection = '2'"
              class="flex items-center w-fit cursor-pointer gap-2 py-1.25"
            >
              <nftmx-radio size="sm" :active="sellProtection === '2'" />
              <span> Above buy criteria </span>
            </div>
          </div>
        </div>
        <div class="border border-black px-5 py-4 h-[155px]">
          <div class="text-sm font-ibm-medium">Period protection</div>
          <div class="mt-2.5">
            <div
              @click="sellPeriod = '0'"
              class="flex items-center w-fit cursor-pointer gap-2 py-1.25"
            >
              <nftmx-radio size="sm" :active="sellPeriod === '0'" />
              <span> Same as buy criteria </span>
            </div>
            <div
              @click="sellPeriod = '1'"
              class="flex items-center w-fit cursor-pointer gap-2 py-1.25"
            >
              <nftmx-radio size="sm" :active="sellPeriod === '1'" />
              <span> Below buy criteria </span>
            </div>
            <div
              @click="sellPeriod = '2'"
              class="flex items-center w-fit cursor-pointer gap-2 py-1.25"
            >
              <nftmx-radio size="sm" :active="sellPeriod === '2'" />
              <span> Above buy criteria </span>
            </div>
          </div>
        </div>
        <div class="border border-black px-5 py-4 h-[155px]">
          <div class="text-sm font-ibm-medium">Multiple ownership</div>
          <div class="mt-2.5">
            <div
              @click="useSellMlr = true"
              class="flex items-center w-fit cursor-pointer gap-2 py-1.25"
            >
              <nftmx-radio size="sm" :active="useSellMlr" />
              <span> Apply </span>
            </div>
            <div
              @click="useSellMlr = false"
              class="flex items-center w-fit cursor-pointer gap-2 py-1.25"
            >
              <nftmx-radio size="sm" :active="!useSellMlr" />
              <span> Don't apply </span>
            </div>
          </div>
        </div>
      </div>
    </accordion>
    <div v-if="filterActive" class="flex justify-between py-5 items-center">
      <div class="font-ibm text-xs text-tertiary-400 flex gap-3">
        <span>Your investments</span>
        <basic-checkbox
          border="border-black border"
          small
          class="w-8.5 h-5"
          @check="checkMyInvest"
        />
      </div>
      <div class="font-press text-xs">
        <nftmx-button
          outline
          color="primary"
          textColor="white"
          label="SEARCH"
          class="px-25"
          customPx
          @click="search"
        />
      </div>
    </div>
  </div>
</template>

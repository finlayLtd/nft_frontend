<script setup>
import NftmxInput from "@/core/components/basic/NftmxInput.vue";
import NftmxTextarea from "@/core/components/basic/NftmxTextarea.vue";
import NftmxRadio from "@/core/components/basic/NftmxRadio.vue";
import NftmxDivider from "@/core/components/basic/NftmxDivider.vue";
import NftmxButton from "@/core/components/basic/NftmxButton.vue";
import BasicDropdown from "@/core/components/dropdown/BasicDropdown.vue";
import BasicDropdownItem from "@/core/components/dropdown/BasicDropdownItem.vue";
import { onMounted, ref, watch } from "vue";
import marketService from "@/core/services/market.service";
import CollectionItem from "./CollectionItem.vue";
import { CHAIN_ROUTES } from "@/core/config/constant";
import NftmxTooltip from "@/core/components/basic/NftmxTooltip.vue";
import NftmxImg from "@/core/components/basic/NftmxImg.vue";
import NftmxTrimString from "@/core/components/basic/NftmxTrimString.vue";
import { useToast } from "vue-toastification";

const props = defineProps({
  buyCriteria: Object,
});
const emit = defineEmits(["set-buy-criteria", "move-back"]);

const toast = useToast();
const buyType = ref(props.buyCriteria.buyType ?? "INDIVIDUAL");
const priority = ref(props.buyCriteria.priority ?? "LIKE");
const buyModel = ref(props.buyCriteria.buyModel ?? "FIX_SALE");
const maxToInvest = ref(props.buyCriteria.maxToInvest);
const cancelInvest = ref(props.buyCriteria.cancelInvest);
const minPrice = ref(props.buyCriteria.minPrice);
const maxPrice = ref(props.buyCriteria.maxPrice);
const sweep = ref(props.buyCriteria.sweep ?? false);
const minTransferred = ref(props.buyCriteria.minTransferred);
const maxTransferred = ref(props.buyCriteria.maxTransferred);
const minUnique = ref(props.buyCriteria.minUnique);
const maxUnique = ref(props.buyCriteria.maxUnique);
const minProtection = ref(props.buyCriteria.minProtection);
const maxProtection = ref(props.buyCriteria.maxProtection);
const minPeriod = ref(props.buyCriteria.minPeriod);
const maxPeriod = ref(props.buyCriteria.maxPeriod);
const useRoyalty = ref(props.buyCriteria.useRoyalty ?? false);
const collectionLimit = ref(props.buyCriteria.collectionLimit ?? false);
const collections = ref(props.buyCriteria.collections);
const limitedCollections = ref(props.buyCriteria.limitedCollections ?? []);
const warn = ref(false);

onMounted(() => {
  marketService.getContracts({ chain: CHAIN_ROUTES.ETHEREUM }).then((res) => {
    collections.value = res.data.contracts;
  });
});
const nextStep = () => {
  if (
    isNaN(maxToInvest.value) ||
    isNaN(cancelInvest.value) ||
    maxPrice.value < minPrice.value ||
    maxTransferred.value < minTransferred.value ||
    maxUnique.value < minUnique.value ||
    isNaN(minProtection.value) ||
    isNaN(maxProtection.value) ||
    maxProtection.value < minProtection.value ||
    isNaN(minPeriod.value) ||
    isNaN(maxPeriod.value) ||
    maxPeriod.value < minPeriod.value
  ) {
    warn.value = true;
    toast.error("Please fill out the fields");
    return;
  }
  const buyCriteria = {
    buyType: buyType.value,
    priority: priority.value,
    buyModel: buyModel.value,
    maxToInvest: maxToInvest.value,
    cancelInvest: cancelInvest.value,
    minPrice: minPrice.value,
    maxPrice: maxPrice.value,
    sweep: sweep.value,
    minTransferred: minTransferred.value,
    maxTransferred: maxTransferred.value,
    minUnique: minUnique.value,
    maxUnique: maxUnique.value,
    minProtection: minProtection.value,
    maxProtection: maxProtection.value,
    minPeriod: minPeriod.value,
    maxPeriod: maxPeriod.value,
    useRoyalty: useRoyalty.value,
    collectionLimit: collectionLimit.value,
    limitedCollections: limitedCollections.value,
  };
  emit("set-buy-criteria", buyCriteria);
};
const chooseCollection = (collection) => {
  limitedCollections.value.push(collection);
  const index = collections.value.findIndex(
    (item) => item.address === collection.address
  );
  collections.value.splice(index, 1);
};
const removeCollection = (collection) => {
  collections.value.push(collection);
  const index = limitedCollections.value.findIndex(
    (item) => item.address === collection.address
  );
  limitedCollections.value.splice(index, 1);
};
watch(minProtection, (val) => {
  if (val === 100) {
    maxProtection.value = 100;
  }
});
</script>

<template>
  <div>
    <div
      class="text-tertiary-400 cursor-pointer transition hover:text-secondary-700 h-fit mt-3"
      @click="emit('move-back', 1)"
    >
      <font-awesome-icon :icon="['fas', 'angle-left']" />
      <span class="text-sm"> Back </span>
    </div>
    <div class="mt-7">
      <span class="font-ibm-bold text-3xl text-white">Buy criteria</span>
    </div>
    <div class="font-ibm-medium text-white text-lg mt-12">
      <div class="grid 2xl:grid-cols-2 items-center 2xl:gap-x-24">
        <div class="grid sm:grid-cols-2 2xl:grid-cols-12 gap-4 items-center">
          <div class="col-span-1 2xl:col-span-5 flex">
            <span> Buy type </span>
          </div>
          <div
            class="col-span-1 2xl:col-span-7 flex items-center text-sm font-ibm mt-3.25 sm:mt-0"
          >
            <div class="grid grid-cols-2 items-center w-full justify-between">
              <div
                class="flex gap-3 items-center w-fit cursor-pointer"
                @click="buyType = 'INDIVIDUAL'"
              >
                <nftmx-radio :active="buyType === 'INDIVIDUAL'" />
                <span>Individual NFT</span>
              </div>
              <div
                class="flex gap-3 items-center w-fit cursor-pointer"
                @click="buyType = 'PACK'"
              >
                <nftmx-radio :active="buyType === 'PACK'" />
                <span>Pack of NFTs</span>
              </div>
            </div>
          </div>
        </div>
        <div
          class="grid sm:grid-cols-2 2xl:grid-cols-12 gap-4 items-center mt-7 2xl:mt-0"
        >
          <div class="col-span-1 2xl:col-span-5 flex">
            <span>
              Priority based on
              <nftmx-tooltip
                text="Set the preference for your automatic buy criteria. Likes will prioritize collections with more likes while first come first serve will take the next available NFT."
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
                @click="priority = 'LIKE'"
              >
                <nftmx-radio :active="priority === 'LIKE'" />
                <span>Likes</span>
              </div>
              <div
                class="flex gap-3 items-center w-fit cursor-pointer"
                @click="priority = 'FIRST_COME'"
              >
                <nftmx-radio :active="priority === 'FIRST_COME'" />
                <span class="flex-1">First come first serve</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="grid 2xl:grid-cols-2 items-center mt-13 2xl:gap-x-24">
        <div class="grid sm:grid-cols-2 2xl:grid-cols-12 gap-4 items-center">
          <div class="col-span-1 2xl:col-span-5 flex">
            <span> Buy model </span>
          </div>
          <div
            class="col-span-1 2xl:col-span-7 flex items-center text-sm font-ibm mt-3.25 sm:mt-0"
          >
            <div class="grid grid-cols-2 items-center w-full justify-between">
              <div
                class="flex gap-3 items-center w-fit cursor-pointer"
                @click="buyModel = 'FIX_SALE'"
              >
                <nftmx-radio :active="buyModel === 'FIX_SALE'" />
                <span>Fixed Sale</span>
              </div>
              <div
                class="flex gap-3 items-center w-fit cursor-pointer"
                @click="buyModel = 'AUCTION'"
              >
                <nftmx-radio :active="buyModel === 'AUCTION'" />
                <span>Syndication Auction</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="grid 2xl:grid-cols-2 items-center mt-10 2xl:gap-x-24">
        <div class="grid sm:grid-cols-2 2xl:grid-cols-12 gap-4">
          <div class="col-span-1 2xl:col-span-5 mt-4">Max to invest</div>
          <div
            class="col-span-1 2xl:col-span-7 text-sm font-ibm mt-3.25 sm:mt-0"
          >
            <div
              :class="[
                warn && isNaN(maxToInvest) ? 'border-red-800' : 'border-black',
                'flex items-center w-full border-2',
              ]"
            >
              <div class="bg-tertiary-700 w-full flex-1">
                <nftmx-input
                  class="h-12.5"
                  number
                  v-model="maxToInvest"
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
            <div class="text-11 text-red-800 mt-2">
              <span>Above last transaction</span>
            </div>
          </div>
        </div>
        <div class="grid sm:grid-cols-2 2xl:grid-cols-12 gap-4 mt-7 2xl:mt-0">
          <div class="col-span-1 2xl:col-span-5 pr-2 mt-2">
            Cancel investment trigger
          </div>
          <div
            class="col-span-1 2xl:col-span-7 w-full mt-3.25 sm:mt-0 text-sm font-ibm"
          >
            <div
              :class="[
                warn && isNaN(cancelInvest) ? 'border-red-800' : 'border-black',
                'flex items-center w-full border-2',
              ]"
            >
              <div class="bg-tertiary-700 w-full flex-1">
                <nftmx-input
                  class="h-12.5"
                  number
                  v-model="cancelInvest"
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
            <div class="text-11 text-red-800 mt-2">Above last transaction</div>
          </div>
        </div>
      </div>
      <div class="border-t border-black border-b border-b-tertiary-800 mt-7" />
      <div class="grid 2xl:grid-cols-2 items-center mt-7 2xl:gap-x-24">
        <div class="grid sm:grid-cols-2 2xl:grid-cols-12 gap-4 items-center">
          <div class="col-span-1 2xl:col-span-5">Minimum NFT value</div>
          <div
            class="col-span-1 2xl:col-span-7 flex items-center text-sm font-ibm mt-3.25 sm:mt-0"
          >
            <div class="flex items-center w-full border-2 border-black">
              <div
                class="bg-black h-12.5 flex items-center justify-center w-12"
              >
                <font-awesome-icon :icon="['fab', 'ethereum']" />
              </div>
              <div class="bg-tertiary-700 w-full flex-1">
                <nftmx-input
                  placeholder="Type Amount"
                  class="h-12.5"
                  number
                  v-model="minPrice"
                  border="none"
                />
              </div>
            </div>
          </div>
        </div>
        <div
          class="grid sm:grid-cols-2 2xl:grid-cols-12 gap-4 items-center mt-7 2xl:mt-0"
        >
          <div class="col-span-1 2xl:col-span-5">Maximum NFT value</div>
          <div class="col-span-1 2xl:col-span-7 w-full mt-3.25 sm:mt-0">
            <div
              :class="[
                warn && maxPrice < minPrice
                  ? 'border-red-800'
                  : ' border-black',
                'flex items-center w-full text-sm font-ibm border-2',
              ]"
            >
              <div
                class="bg-black h-12.5 flex items-center justify-center w-12"
              >
                <font-awesome-icon :icon="['fab', 'ethereum']" />
              </div>
              <div class="bg-tertiary-700 w-full flex-1">
                <nftmx-input
                  placeholder="Type Amount"
                  class="h-12.5"
                  number
                  v-model="maxPrice"
                  border="none"
                />
              </div>
            </div>
            <p
              v-if="warn && maxPrice < minPrice"
              class="font-ibm text-11 text-red-900 h-0"
            >
              Should be greater than the minimum NFT value
            </p>
          </div>
        </div>
      </div>
      <div class="grid 2xl:grid-cols-2 items-center mt-7 2xl:gap-x-24">
        <div class="grid sm:grid-cols-2 2xl:grid-cols-12 gap-4 items-center">
          <div class="col-span-1 2xl:col-span-5 flex">
            <span>
              Sweep the floor
              <nftmx-tooltip
                text="Sweeping the floor means the DVC puchases NFTs that are at or below the collection floor price."
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
                @click="sweep = true"
              >
                <nftmx-radio :active="sweep" />
                <span>No</span>
              </div>
              <div
                class="flex gap-3 items-center w-fit cursor-pointer"
                @click="sweep = false"
              >
                <nftmx-radio :active="!sweep" />
                <span>Yes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="grid 2xl:grid-cols-2 items-center mt-7 2xl:gap-x-24">
        <div class="grid sm:grid-cols-2 2xl:grid-cols-12 gap-4 items-center">
          <div class="col-span-1 2xl:col-span-5">Minimum NFT transferred</div>
          <div
            class="col-span-1 2xl:col-span-7 flex items-center text-sm font-ibm mt-3.25 sm:mt-0"
          >
            <div class="flex items-center w-full">
              <div class="bg-tertiary-700 w-full flex-1">
                <nftmx-input
                  class="h-13"
                  number
                  v-model="minTransferred"
                  border="thick"
                />
              </div>
            </div>
          </div>
        </div>
        <div
          class="grid sm:grid-cols-2 2xl:grid-cols-12 gap-4 items-center mt-7 2xl:mt-0"
        >
          <div class="col-span-1 2xl:col-span-5">Maximum NFT transferred</div>
          <div class="col-span-1 2xl:col-span-7 w-full mt-3.25 sm:mt-0">
            <div class="flex items-center w-full text-sm font-ibm">
              <div class="bg-tertiary-700 w-full flex-1">
                <nftmx-input
                  class="h-13"
                  number
                  v-model="maxTransferred"
                  border="thick"
                  :error="warn && maxTransferred < minTransferred"
                />
              </div>
            </div>
            <p
              v-if="warn && maxTransferred < minTransferred"
              class="font-ibm text-11 text-red-900 h-0"
            >
              Should be greater than the minimum NFT transferred
            </p>
          </div>
        </div>
      </div>
      <div class="grid 2xl:grid-cols-2 items-center mt-7 2xl:gap-x-24">
        <div class="grid sm:grid-cols-2 2xl:grid-cols-12 gap-4 items-center">
          <div class="col-span-1 2xl:col-span-5">Minimum unique</div>
          <div
            class="col-span-1 2xl:col-span-7 flex items-center text-sm font-ibm mt-3.25 sm:mt-0"
          >
            <div class="flex items-center w-full text-xs justify-between">
              <div class="bg-tertiary-800 h-13">
                <nftmx-input
                  class="h-13"
                  border="thick"
                  number
                  readonly
                  placeholder="1"
                />
              </div>
              <div class="w-max whitespace-nowrap">out of</div>
              <div class="bg-tertiary-700">
                <nftmx-input
                  class="h-13"
                  border="thick"
                  number
                  v-model="minUnique"
                />
              </div>
            </div>
          </div>
        </div>
        <div
          class="grid sm:grid-cols-2 2xl:grid-cols-12 gap-4 items-center mt-7 2xl:mt-0"
        >
          <div class="col-span-1 2xl:col-span-5">Maximum unique</div>
          <div
            class="col-span-1 2xl:col-span-7 w-full font-ibm mt-3.25 sm:mt-0"
          >
            <div class="flex items-center w-full text-xs justify-between">
              <div class="bg-tertiary-800">
                <nftmx-input
                  class="h-13"
                  border="thick"
                  number
                  readonly
                  placeholder="1"
                />
              </div>
              <div class="w-max whitespace-nowrap">out of</div>
              <div class="bg-tertiary-700">
                <nftmx-input
                  class="h-13"
                  border="thick"
                  number
                  v-model="maxUnique"
                  :error="warn && maxUnique < minUnique"
                />
              </div>
            </div>
            <p
              v-if="warn && maxUnique < minUnique"
              class="font-ibm text-11 text-red-900 h-0"
            >
              Should be greater than the minimum unique
            </p>
          </div>
        </div>
      </div>
      <div class="border-t border-black border-b border-b-tertiary-800 mt-7" />
      <div class="grid 2xl:grid-cols-2 items-center mt-7 2xl:gap-x-24">
        <div class="grid sm:grid-cols-2 2xl:grid-cols-12 gap-4 items-center">
          <div class="col-span-1 2xl:col-span-5">Minimum protection period</div>
          <div
            class="col-span-1 2xl:col-span-7 flex items-center text-sm font-ibm mt-3.25 sm:mt-0"
          >
            <div
              :class="[
                warn && isNaN(minPeriod) ? 'border-red-800' : 'border-black',
                'flex items-center w-full border-2 ',
              ]"
            >
              <div class="bg-tertiary-700 w-full flex-1">
                <nftmx-input
                  class="h-12.5"
                  number
                  v-model="minPeriod"
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
        <div
          class="grid sm:grid-cols-2 2xl:grid-cols-12 gap-4 items-center mt-7 2xl:mt-0"
        >
          <div class="col-span-1 2xl:col-span-5">Maximum protection period</div>
          <div class="col-span-1 2xl:col-span-7 w-full mt-3.25 sm:mt-0">
            <div
              :class="[
                warn && (isNaN(maxPeriod) || maxPeriod < minPeriod)
                  ? 'border-red-800'
                  : 'border-black',
                'flex items-center w-full text-sm font-ibm border-2',
              ]"
            >
              <div class="bg-tertiary-700 w-full flex-1">
                <nftmx-input
                  class="h-12.5"
                  number
                  v-model="maxPeriod"
                  border="none"
                />
              </div>
              <div
                class="bg-black h-12.5 flex items-center justify-center w-24"
              >
                DAYS
              </div>
            </div>
            <p
              v-if="warn && maxPeriod < minPeriod"
              class="font-ibm text-11 text-red-900 h-0"
            >
              Should be greater than the minimum period protections
            </p>
          </div>
        </div>
      </div>
      <div class="grid 2xl:grid-cols-2 items-center mt-7 2xl:gap-x-24">
        <div class="grid sm:grid-cols-2 2xl:grid-cols-12 gap-4 items-center">
          <div class="col-span-1 2xl:col-span-5">Minimum slippage</div>
          <div
            class="col-span-1 2xl:col-span-7 flex items-center text-sm font-ibm mt-3.25 sm:mt-0"
          >
            <div
              :class="[
                warn && isNaN(minProtection)
                  ? 'border-red-800'
                  : 'border-black',
                'flex items-center w-full border-2 ',
              ]"
            >
              <div class="bg-tertiary-700 w-full flex-1">
                <nftmx-input
                  class="h-12.5"
                  number
                  v-model="minProtection"
                  :max="100"
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
          class="grid sm:grid-cols-2 2xl:grid-cols-12 gap-4 items-center mt-7 2xl:mt-0"
        >
          <div class="col-span-1 2xl:col-span-5">Maximum slipage</div>
          <div class="col-span-1 2xl:col-span-7 w-full mt-3.25 sm:mt-0">
            <div
              :class="[
                warn && (isNaN(maxProtection) || maxProtection < minProtection)
                  ? 'border-red-800'
                  : 'border-black',
                'flex items-center w-full text-sm font-ibm border-2',
              ]"
            >
              <div class="bg-tertiary-700 w-full flex-1">
                <nftmx-input
                  class="h-12.5"
                  number
                  v-model="maxProtection"
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
            <p
              v-if="warn && maxProtection < minProtection"
              class="font-ibm text-11 text-red-900 h-0"
            >
              Should be greater than the minimum liquidity protection
            </p>
          </div>
        </div>
      </div>
      <div class="border-t border-black border-b border-b-tertiary-800 mt-7" />
      <div class="grid 2xl:grid-cols-2 mt-7 2xl:gap-x-24">
        <div class="grid sm:grid-cols-2 2xl:grid-cols-12 gap-4 h-fit">
          <div class="col-span-1 2xl:col-span-5 flex">
            <span>
              <span>Buy with multilevel ownership program</span>
              <nftmx-tooltip
                text="Selecting this option allows DAOs to join the syndication contract and purchase the NFT."
              >
                <sup>
                  <font-awesome-icon
                    :icon="['fas', 'question-circle']"
                    class="text-xs cursor-pointer ml-1"
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
        </div>
        <div>
          <div class="grid sm:grid-cols-2 2xl:grid-cols-12 gap-4">
            <div class="col-span-1 2xl:col-span-5">
              Limited to specific collection
            </div>
            <div
              class="col-span-1 2xl:col-span-7 flex text-sm font-ibm mt-3.25 sm:mt-0"
            >
              <div class="grid grid-cols-2 w-full justify-between">
                <div
                  class="flex gap-3 w-fit cursor-pointer"
                  @click="collectionLimit = false"
                >
                  <nftmx-radio :active="!collectionLimit" />
                  <span>No</span>
                </div>
                <div
                  class="flex gap-3 w-fit cursor-pointer"
                  @click="collectionLimit = true"
                >
                  <nftmx-radio :active="collectionLimit" />
                  <span>Yes</span>
                </div>
              </div>
            </div>
          </div>
          <div
            v-if="collectionLimit"
            class="grid sm:grid-cols-2 2xl:grid-cols-12 gap-4 mt-10"
          >
            <div class="col-span-1 2xl:col-span-5">
              Choose from a collection list
            </div>
            <div
              class="relative col-span-1 2xl:col-span-7 w-full flex text-sm font-ibm mt-3.25 sm:mt-0 z-10"
            >
              <div class="w-full absolute h-12">
                <basic-dropdown title="Collections" class="bg-tertiary-700">
                  <template v-slot:content>
                    <div
                      class="font-ibm text-white px-3.5 w-full max-h-80 overflow-y-auto"
                    >
                      <div
                        v-for="(collection, index) in collections"
                        :key="index"
                      >
                        <collection-item
                          :collection="collection"
                          @click="chooseCollection(collection)"
                        />
                      </div>
                    </div>
                  </template>
                </basic-dropdown>
              </div>
              <div class="mt-20 w-full">
                <div
                  v-for="(collection, index) in limitedCollections"
                  :key="index"
                  class="border-b border-black py-2"
                >
                  <div
                    class="py-1.5 transition flex justify-between items-center"
                  >
                    <div class="flex gap-4 w-calc-42">
                      <nftmx-img
                        :src="collection.imageUrl"
                        class="w-5 h-5 object-cover"
                      />
                      <div class="w-[inherit]">
                        <div>
                          {{ collection.name }}
                        </div>
                        <div class="text-11 text-tertiary-400 mt-1.75">
                          <nftmx-trim-string :line="1">
                            {{ collection.address }}
                          </nftmx-trim-string>
                        </div>
                      </div>
                    </div>
                    <div>
                      <font-awesome-icon
                        :icon="['fas', 'trash-alt']"
                        class="transition text-tertiary-400 hover:text-red-900 cursor-pointer"
                        @click="removeCollection(collection)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-between items-center my-20">
      <div
        class="text-tertiary-400 cursor-pointer transition hover:text-secondary-700 h-fit"
        @click="emit('move-back', 1)"
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

<style scoped>
.w-calc-42 {
  width: calc(100% - 42px);
}
</style>

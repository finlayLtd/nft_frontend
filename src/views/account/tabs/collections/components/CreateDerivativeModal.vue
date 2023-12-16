<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { $vfm } from "vue-final-modal";
import NftmxImg from "@/core/components/basic/NftmxImg.vue";
import NftmxInput from "@/core/components/basic/NftmxInput.vue";
import NftmxButton from "@/core/components/basic/NftmxButton.vue";
import derivativesService from "@/core/services/market/derivatives.service";
import { useToast } from "vue-toastification";
import NftmxTooltip from "@/core/components/basic/NftmxTooltip.vue";
import { createDerivative } from "@/core/utils/contracts/derivative-factory.utils";
import { mint } from "@/core/utils/contracts/derivative.utils";
import {
  isApprovedForAll,
  setApprovalForAll,
} from "@/core/utils/contracts/erc721.utils.js";
import {
  BSC_TESTNET_DERIVATIVE_FACTORY_CONTRACT_ADDRESS,
  BSC_TESTNET_MARKET_ORDER_CONTRACT_ADDRESS,
  BSC_TESTNET_MLR_FACTORY_CONTRACT_ADDRESS,
  COMPANY_ADDRESS,
  MainToken,
  ChainIcons,
} from "@/core/config/constant";
import BasicCheckbox from "@/core/components/basic/BasicCheckbox.vue";
import { getChainKey, formatAMPM } from "@/core/utils/common";
import NftmxRadio from "@/core/components/basic/NftmxRadio.vue";
import useDebouncedRef from "@/core/utils/hook/useDebouncedRef.js";
import DatePicker from "@/core/components/v-calendar/src/components/DatePicker/DatePicker.vue";
import NftmxHashtag from "@/core/components/basic/NftmxHashtag.vue";
import marketService from "@/core/services/market.service";
import NftmxDivider from "@/core/components/basic/NftmxDivider.vue";
import { createOrder } from "@/core/utils/contracts/market.utils.js";
import { createMLR } from "@/core/utils/contracts/mlr-factory.utils.js";
import Web3 from "web3/dist/web3.min.js";
import { useStore } from "vuex";

const props = defineProps({
  asset: Object,
});

const emit = defineEmits(["derivative-created"]);

const store = useStore();
const walletAddress = computed(() => store.getters["auth/walletAddress"]);
const chainId = computed(() => store.state.wallet.chainId);
const originNft = computed(() => props.asset);
const toast = useToast();
const step = ref(0);
const amount = ref();
const images = ref([]);
const loading = ref(false);
const derivativeContractAddress = ref("");
const tokenUris = ref([]);
const approvedStatus = ref(false);
const derivativesCreated = ref(false);
const hashtag = useDebouncedRef("", 1000);
const hashtags = ref([]);
const selectedHashtags = ref([]);
const hashtagSection = ref(false);
const askingPrice = ref();
const slippage = ref();
const sale = ref("FIX-SALE");
const supply = ref("INDIVIDUAL");
const displayPic = ref(true);
const openEndSaleTimePicker = ref(false);
const endTimePicker = ref();
const endTime = computed(() => {
  if (endTimePicker.value) {
    return (
      endTimePicker.value.toLocaleString("default", { month: "long" }) +
      " " +
      endTimePicker.value.getDate() +
      ", " +
      endTimePicker.value.getFullYear() +
      " " +
      formatAMPM(endTimePicker.value) +
      " UTC"
    );
  } else {
    return "Choose date and time";
  }
});
const waiting = ref(false);
const warn = ref(false);
const period = ref();
const staking = ref(true);
const royalty = ref(false);
const ownershipToKeep = ref();
const buyoutPrice = ref();
const deploySyndication = ref(false);
const offerings = ref([]);

const moveStep = (page) => {
  step.value = page;
};
function convertBlobToFile(blob, fileName) {
  blob.lastModifiedDate = new Date();
  blob.name = fileName;
  return blob;
}
const createDerivativeContract = async () => {
  try {
    amount.value = parseInt(amount.value);
    if (!amount.value) {
      toast.error("Please enter the amount");
      warn.value = true;
      return;
    }
    loading.value = true;
    await store.state.web3.eth.sendTransaction({
      from: walletAddress.value,
      to: COMPANY_ADDRESS,
      value: Web3.utils.toWei((0.001 * amount.value).toString()),
    });
    toast.success("Generating AI images...");
    derivativesService
      .createImages({
        url: props.asset.imageUrl,
        amount: amount.value,
      })
      .then((res) => {
        images.value = res.data;
        step.value++;
        toast.success("Generated AI images successfully");
      })
      .catch((err) => {
        toast.error("Failed to generate Images");
      })
      .finally(() => {
        loading.value = false;
        warn.value = false;
      });
  } catch (err) {
    if (err.code === 4001) {
      toast.error("User denied transaction signature.");
    } else {
      toast.error("Something went wrong");
    }
    loading.value = false;
  }
};
const removeImg = (index) => {
  images.value.splice(index, 1);
};
const createDerivatives = async () => {
  try {
    loading.value = true;
    if (!derivativeContractAddress.value) {
      toast.success("Creating derivative contract...");
      derivativeContractAddress.value = (
        await createDerivative(
          props.asset.contract.address,
          props.asset.tokenId,
          0
        )
      ).events.DerivativeCreated.returnValues.derivative;
    }
    if (tokenUris.value.length === 0) {
      toast.success("Creating token uris...");
      tokenUris.value = await createTokenUris();
    }
    const addresses = [];
    for (let i = 0; i < tokenUris.value.length; i++) {
      addresses.push(store.state.wallet.account);
    }
    toast.success("Mint derivatives...");
    await mint(derivativeContractAddress.value, addresses, tokenUris.value);
    toast.success("Derivatives are minted successfully");

    derivativesCreated.value = true;
    loading.value = false;
  } catch (err) {
    if (err.code === 4001) {
      toast.error("User denied transaction signature.");
    } else {
      toast.error("Something went wrong");
    }
    loading.value = false;
  }
};
const createTokenUris = async () => {
  const metadatas = [];
  for (let i = 0; i < images.value.length; i++) {
    metadatas.push({
      name: props.asset.name + " #" + (i + 1),
      description: props.asset.description,
      image: images.value[i],
      animation_url: props.asset.animationUrl,
      external_url: props.asset.externalLink,
    });
  }
  return new Promise((resolve, reject) => {
    derivativesService
      .createTokenUris(metadatas)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
const clickOutsideEndTimePicker = () => {
  openEndSaleTimePicker.value = false;
};
const skip = () => {
  cancel();
  emit("derivative-created");
};
const setOffering = () => {
  if (
    !askingPrice.value ||
    isNaN(slippage.value) ||
    isNaN(period.value) ||
    (sale.value === "AUCTION" && !endTimePicker.value)
  ) {
    warn.value = true;
    toast.error("Please fill out the fields");
    loading.value = false;
    return;
  }
  step.value++;
};
const launchOffering = async () => {
  try {
    loading.value = true;
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x61" }],
    });

    if (royalty.value) {
      const approved = await isApprovedForAll(
        derivativeContractAddress.value,
        store.state.wallet.account,
        BSC_TESTNET_MLR_FACTORY_CONTRACT_ADDRESS
      );
      if (!approved) {
        await setApprovalForAll(
          derivativeContractAddress.value,
          BSC_TESTNET_MLR_FACTORY_CONTRACT_ADDRESS,
          true
        );
      }
      if (offerings.value.length === 0) {
        for (let i = 0; i < tokenUris.value.length; i++) {
          createHashTags(i);
          const buyout = Web3.utils.toWei(buyoutPrice.value.toString());
          const price = Web3.utils.toWei(askingPrice.value.toString());
          const protectionRate = (100 - slippage.value) * 100;
          const protectionPeriod = period.value * 86400; // convert day into sec
          const isAuction = sale.value === "AUCTION";
          const offerEndDate = endTimePicker.value
            ? (endTimePicker.value.getTime() / 1000).toFixed()
            : "0";
          const data = [
            derivativeContractAddress.value,
            i,
            100,
            props.asset.name,
            props.asset.name + " #" + i,
            props.asset.contract.symbol + " #" + i,
            buyout,
            ownershipToKeep.value,
            price,
            protectionRate,
            false,
            protectionPeriod,
            isAuction,
            offerEndDate,
          ];
          offerings.value.push(data);
        }
      }
      createMLR(offerings.value)
        .then((res) => {
          toast.success("Your derivative offerings has been launched!");
          initialize();
          cancel();
          emit("derivative-created");
        })
        .catch((err) => {
          if (err.code === 4001) {
            toast.error("User denied transaction signature.");
          } else {
            toast.error("Something went wrong.");
          }
        })
        .finally(() => {
          loading.value = false;
        });
    } else {
      const approved = await isApprovedForAll(
        derivativeContractAddress.value,
        store.state.wallet.account,
        BSC_TESTNET_MARKET_ORDER_CONTRACT_ADDRESS
      );
      if (!approved) {
        await setApprovalForAll(
          derivativeContractAddress.value,
          BSC_TESTNET_MARKET_ORDER_CONTRACT_ADDRESS,
          true
        );
      }
      if (offerings.value.length === 0) {
        for (let i = 0; i < tokenUris.value.length; i++) {
          createHashTags(i);
          const price = Web3.utils.toWei(askingPrice.value.toString());
          const protectionRate = (100 - slippage.value) * 100;
          const protectionPeriod = period.value * 86400; // convert day into sec
          const isAuction = sale.value === "AUCTION";
          const offerEndDate = endTimePicker.value
            ? (endTimePicker.value.getTime() / 1000).toFixed()
            : "0";
          const data = [
            derivativeContractAddress.value,
            i,
            price,
            staking.value,
            protectionRate,
            false,
            protectionPeriod,
            slippage.value * 100,
            isAuction,
            offerEndDate,
          ];
          offerings.value.push(data);
        }
      }
      createOrder(offerings.value)
        .then((res) => {
          toast.success("Your derivative offerings has been launched!");
          initialize();
          cancel();
          emit("derivative-created");
        })
        .catch((err) => {
          if (err.code === 4001) {
            toast.error("User denied transaction signature.");
          } else {
            toast.error("Something went wrong.");
          }
        })
        .finally(() => {
          loading.value = false;
        });
    }
  } catch (err) {
    if (err.code === 4001) {
      toast.error("User denied transaction signature.");
    } else {
      toast.error("Something went wrong");
    }
    loading.value = false;
  }
};
const initialize = () => {
  step.value = 0;
  amount.value = 0;
  images.value = [];
  loading.value = false;
  derivativeContractAddress.value = "";
  tokenUris.value = [];
  approvedStatus.value = false;
  derivativesCreated.value = false;
  endTimePicker.value = null;
  ownershipToKeep.value = null;
  buyoutPrice.value = null;
  offerings.value = [];
  askingPrice.value = null;
  slippage.value = null;
  deploySyndication.value = false;
};
const cancel = () => {
  $vfm.hide("derivativeModal");
};
const approve = async () => {
  if (props.asset.contract.chain === "ETHEREUM") {
    toast.error("Ethereum network is not ready yet.");
    return;
  }

  if (props.asset.mlrContract) {
    toast.error("This NFT can't be locked to create derivatives.");
    return;
  }

  try {
    loading.value = true;
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x61" }],
    });

    await setApprovalForAll(
      props.asset.contract.address,
      BSC_TESTNET_DERIVATIVE_FACTORY_CONTRACT_ADDRESS,
      true
    );
    approvedStatus.value = true;
    loading.value = false;
    toast.success("NFT is approved successfully.");
  } catch (err) {
    if (err.code === 4001) {
      toast.error("User denied transaction signature.");
    } else {
      toast.error("Something went wrong");
    }
    loading.value = false;
  }
};
const getApprovedStatus = async () => {
  if (
    store.state.wallet.chainId !== "0x61" ||
    !props.asset ||
    !props.asset.contract.address
  )
    return;
  approvedStatus.value = await isApprovedForAll(
    props.asset.contract.address,
    store.state.wallet.account,
    BSC_TESTNET_DERIVATIVE_FACTORY_CONTRACT_ADDRESS
  );
};
const selectHashtag = (item) => {
  const index = hashtags.value.findIndex((i) => i === item);
  hashtags.value.splice(index, 1);
  if (selectedHashtags.value.indexOf(item) === -1) {
    selectedHashtags.value.push(item);
  }
};
const deselectHashtag = (value) => {
  selectedHashtags.value = selectedHashtags.value.filter(
    (name) => name !== value
  );
  hashtags.value.push(value);
};
const getHashtags = () => {
  marketService.getHashtagNames(hashtag.value, 20).then((res) => {
    hashtags.value = res.data
      .filter((item) => selectedHashtags.value.indexOf(item.name) === -1)
      .map((item) => item.name);
  });
};
const createHashTags = (tokenId) => {
  if (selectedHashtags.value.length > 0) {
    marketService.createHashTags(
      props.asset.contract.chain,
      selectedHashtags.value,
      derivativeContractAddress.value,
      tokenId
    );
  }
};
const enterKeyDown = (evt) => {
  console.log(evt);
  if (hashtag.value) {
    selectHashtag(hashtag.value);
  }
};
watch(hashtag, () => {
  getHashtags();
});
watch(chainId, (val) => {
  getApprovedStatus();
});
watch(originNft, (val) => {
  getApprovedStatus();
  initialize();
});
onMounted(() => {
  getHashtags();
});
</script>

<template>
  <vue-final-modal
    classes="w-full flex justify-center overflow-y-auto cursor-default"
    content-class="my-4 lg:my-auto mx-4 h-fit"
    :overlay-style="{ backgroundColor: 'black', opacity: '0.9' }"
    name="derivativeModal"
    esc-to-close
    fit-parent
  >
    <div
      class="relative text-center bg-tertiary-900 text-white xl:w-modal-md 3xl:w-modal-big"
    >
      <div class="text-right text-[22px] leading-none p-5 w-full">
        <span
          class="cursor-pointer hover:text-red-900 transition"
          @click="cancel"
        >
          &#10005;
        </span>
      </div>
      <div class="font-press text-lg lg:text-2xl py-3.5">
        Create Derivatives
      </div>
      <div class="text-lg py-1 px-4 lg:px-18 font-ibm-light">
        Use our AI to create derivatives from your NFT into a sub collection of
        NFTs and launch an initial NFT offering
      </div>

      <div v-if="asset && asset.contract" class="px-4 lg:px-18 pb-18 pt-7.5">
        <div class="grid grid-cols-5 text-tertiary-400 font-ibm-bold text-15">
          <div
            :class="[
              step >= 0
                ? 'border-primary-900 text-primary-900'
                : 'border-tertiary-400',
              'flex items-center justify-center border-b-3 h-17',
            ]"
          >
            <span>Create derivatives</span>
          </div>
          <div
            :class="[
              step >= 1
                ? 'border-primary-900 text-primary-900'
                : 'border-tertiary-400',
              'flex items-center justify-center border-b-3 h-17',
            ]"
          >
            <span>Approve derivatives</span>
          </div>
          <div
            :class="[
              step >= 2
                ? 'border-primary-900 text-primary-900'
                : 'border-tertiary-400',
              'flex items-center justify-center border-b-3 h-17',
            ]"
          >
            <span>Offering terms</span>
          </div>
          <div
            :class="[
              step >= 3
                ? 'border-primary-900 text-primary-900'
                : 'border-tertiary-400',
              'flex items-center justify-center border-b-3 h-17',
            ]"
          >
            <span>Multilevel ownership</span>
          </div>
          <div
            :class="[
              step >= 4
                ? 'border-primary-900 text-primary-900'
                : 'border-tertiary-400',
              'flex items-center justify-center border-b-3 h-17',
            ]"
          >
            <span>Launch derivatives Offering</span>
          </div>
        </div>
        <div v-if="step === 0" class="flex flex-col items-center">
          <p class="text-red-600 text-sm mt-8 px-4 lg:px-16">
            <font-awesome-icon
              :icon="['fas', 'exclamation-triangle']"
              class="text-base"
            />
            Once derivatives are created, this NFT will be locked in the smart
            contract as an underlying asset. To release this NFT, you must
            surrender all of the derivatives.
          </p>
          <div class="w-fit">
            <nftmx-img
              :src="asset.imageUrl"
              class="w-[480px] h-90.75 border border-black mt-12.75 object-center object-cover bg-black text-6xl"
            />
            <div class="flex justify-between text-sm mt-7.75">
              <span class="text-primary-900">
                {{ asset.contract ? asset.contract.name : "" }}
              </span>
              <span>Last Value</span>
            </div>
            <div class="flex justify-between text-2xl mt-1.5">
              <span class="font-ibm-bold">
                {{ asset.name }}
              </span>
              <div class="flex items-center justify-center text-sm gap-3">
                <div
                  v-if="asset.contract.chain === 'BSC-TESTNET'"
                  class="w-4 h-4"
                >
                  <svg
                    role="img"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <title>Binance</title>
                    <path
                      class="fill-tertiary-400"
                      d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                    />
                  </svg>
                </div>
                <font-awesome-icon
                  v-if="asset.contract.chain === 'ETHEREUM'"
                  :icon="['fab', 'ethereum']"
                  class="text-tertiary-400"
                />
                <span>
                  {{ asset.lastOrder ? asset.lastOrder.tokenPrice : 0 }}
                </span>
              </div>
            </div>
            <div class="mt-11.25">
              <p class="text-left font-ibm-medium text-lg">
                Choose number of derivatives to create
                <nftmx-tooltip
                  text="You can create additional derivatives for this NFT at any time in the future"
                >
                  <sup>
                    <font-awesome-icon
                      :icon="['fas', 'question-circle']"
                      class="text-xs cursor-pointer"
                    />
                  </sup>
                </nftmx-tooltip>
              </p>
              <div class="bg-tertiary-700 text-sm mt-3.25">
                <nftmx-input
                  number
                  v-model="amount"
                  :class="[
                    warn && !amount ? 'border-red-900' : 'border-black',
                    'h-13.5',
                  ]"
                  :min="0"
                  :max="50"
                  border="thick"
                />
              </div>
            </div>
          </div>
          <div class="mt-16 w-full lg:w-3/5">
            <nftmx-button
              v-if="approvedStatus"
              color="primary"
              textColor="white"
              outline
              h="xl2"
              label="PAY AND MOVE TO THE NEXT STEP"
              class="font-press text-base lg:text-lg w-full"
              customPx
              @click="createDerivativeContract"
              :loading="loading"
            />
            <nftmx-button
              v-else
              color="black"
              textColor="white"
              outline
              h="xl2"
              :label="loading ? 'APPROVING' : 'APPROVE'"
              class="font-press text-base lg:text-lg w-full"
              customPx
              @click="approve"
              :loading="loading"
            />
          </div>
        </div>
        <div v-if="step === 1">
          <div class="text-left font-ibm-bold text-2xl pt-11.5 pb-9.5">
            Approve your new derivatives
          </div>
          <div
            class="max-h-[100vh] overflow-auto grid grid-cols-3 gap-8 pr-4 text-left font-ibm-bold"
          >
            <div v-for="(image, index) in images" :key="index">
              <div class="relative w-full pt-70per">
                <nftmx-img
                  :src="image"
                  class="absolute w-full h-full top-0 left-0 object-cover bg-black"
                />
                <font-awesome-icon
                  :icon="['fas', 'times']"
                  class="absolute top-2 right-2.5 hover:text-red-900 transition cursor-pointer"
                  @click="removeImg(index)"
                />
                <div
                  v-if="derivativesCreated"
                  class="absolute left-0 top-0 w-full h-full p-20 flex flex-col items-center justify-center bg-black bg-opacity-50 text-primary-900"
                >
                  <div class="text-5xl">
                    <font-awesome-icon :icon="['fas', 'check-circle']" />
                  </div>
                  <div class="text-lg text-center mt-6">The Derivative has</div>
                  <div class="text-lg text-center">been approved</div>
                </div>
              </div>
              <div class="mt-6.5">
                {{ props.asset.name + " #" + (index + 1) }}
              </div>
            </div>
          </div>
          <div class="mt-19 relative">
            <div
              v-if="!derivativesCreated"
              class="absolute mt-5 text-tertiary-400 cursor-pointer transition hover:text-primary-900 h-fit"
              @click="moveStep(0)"
            >
              <font-awesome-icon :icon="['fas', 'angle-left']" />
              <span class="text-sm"> Back </span>
            </div>
            <div class="relative w-full lg:w-3/5 mx-auto">
              <nftmx-button
                v-if="!derivativesCreated"
                color="primary"
                textColor="white"
                outline
                h="xl2"
                label="APPROVE DERIVATIVES"
                class="font-press text-lg w-full"
                customPx
                @click="createDerivatives"
                :loading="loading"
              />
              <nftmx-button
                v-else
                color="primary"
                textColor="white"
                outline
                h="xl2"
                label="SET YOUR OFFERING TERMS"
                class="font-press text-lg w-full"
                customPx
                @click="step++"
                :loading="loading"
              />
              <div
                v-if="derivativesCreated"
                @click="skip()"
                class="text-red-600 text-xs absolute right-0 top-20 cursor-pointer"
              >
                Skip this step and list those derivatives later on
              </div>
            </div>
          </div>
        </div>
        <div v-if="step === 2" class="relative text-lg font-ibm-medium">
          <div class="text-left text-2xl font-ibm-bold pt-11.5 pb-7">
            Choose your initial offering terms
          </div>
          <div class="flex">
            Type of supply
            <nftmx-tooltip custom>
              <sup>
                <font-awesome-icon
                  :icon="['fas', 'question-circle']"
                  class="ml-1 text-10 cursor-pointer"
                />
              </sup>
              <template v-slot:custom>
                <div class="font-ibm-medium">Individual Supply</div>
                <div>
                  When selling NFTs individually, the buyer is able to maintain
                  control over the cost of each specific NFT.
                </div>
                <div class="font-ibm-medium mt-4">Fractional supply</div>
                <div>
                  The total supply of NFTs will be distributed proportionally to
                  each buyer as fractional supply. The final value of each NFT
                  will be determined by the total amount of contributed funds
                </div>
              </template>
            </nftmx-tooltip>
          </div>
          <div class="flex mt-3.75">
            <nftmx-button
              outline
              color="primary-900"
              label="INDIVIDUAL SUPPLY"
              :class="[
                supply === 'INDIVIDUAL' ? 'bg-tertiary-700' : '',
                'font-ibm-medium text-sm pt-3.5 pb-4 border-2 border-black w-1/2 hover:bg-tertiary-700 text-primary-900 tracking-wide',
              ]"
              @click="supply = 'INDIVIDUAL'"
            />
            <nftmx-button
              outline
              color="primary-900"
              label="FRACTIONAL SUPPLY"
              :class="[
                supply === 'FRACTIONAL' ? 'bg-tertiary-700' : '',
                'font-ibm-medium text-sm pt-3.5 pb-4 border-2 border-black border-l-0 w-1/2 text-primary-900 hover:bg-tertiary-700 tracking-wide',
              ]"
              @click="supply = 'FRACTIONAL'"
            />
          </div>
          <div class="flex mt-6.5">
            Type of sale
            <nftmx-tooltip
              text="The NFT Protection marketplace supports fixed sale and auction capabilities. Both options have the ability to add Liquidity Protection and DAO syndication."
            >
              <sup>
                <font-awesome-icon
                  :icon="['fas', 'question-circle']"
                  class="ml-1 text-10 cursor-pointer"
                />
              </sup>
            </nftmx-tooltip>
          </div>
          <div class="flex mt-3">
            <nftmx-button
              outline
              color="primary-900"
              label="FIXED SALE"
              :class="[
                sale === 'FIX-SALE' ? 'bg-tertiary-700' : '',
                'font-ibm-medium text-sm pt-3.5 pb-4 border-2 border-black w-1/2 hover:bg-tertiary-700 text-primary-900 tracking-wide',
              ]"
              @click="sale = 'FIX-SALE'"
            />
            <nftmx-button
              outline
              color="primary-900"
              label="AUCTION"
              :class="[
                sale === 'AUCTION' ? 'bg-tertiary-700' : '',
                'font-ibm-medium text-sm pt-3.5 pb-4 border-2 border-black border-l-0 w-1/2 text-primary-900 hover:bg-tertiary-700 tracking-wide',
              ]"
              @click="sale = 'AUCTION'"
            />
          </div>
          <div class="flex mt-5.5">
            Display derivative pics
            <nftmx-tooltip custom>
              <sup>
                <font-awesome-icon
                  :icon="['fas', 'question-circle']"
                  class="ml-1 text-10 cursor-pointer"
                />
              </sup>
              <template v-slot:custom>
                <div class="font-ibm-medium">Display</div>
                <div>
                  The picture of the NFT will be visible to the buyers so they
                  can see what they are purchasing
                </div>
                <div class="font-ibm-medium mt-4">Hide</div>
                <div>
                  The picture of the NFT will be invisible and hidden from the
                  buyers so that they cannot see what they are purchasing
                </div>
              </template>
            </nftmx-tooltip>
          </div>
          <div class="flex mt-4">
            <nftmx-button
              outline
              color="primary-900"
              label="DISPLAY DERIVATIVE PICS DURING THE OFFERING"
              :class="[
                displayPic === true ? 'bg-tertiary-700' : '',
                'font-ibm-medium text-sm pt-3.5 pb-4 border-2 border-black w-1/2 hover:bg-tertiary-700 text-primary-900 tracking-wide',
              ]"
              @click="displayPic = true"
            />
            <nftmx-button
              outline
              color="primary-900"
              label="HIDE DERIVATIVE PICS UNTIL PURCHASING"
              :class="[
                displayPic === false ? 'bg-tertiary-700' : '',
                'font-ibm-medium text-sm pt-3.5 pb-4 border-2 border-black border-l-0 w-1/2 text-primary-900 hover:bg-tertiary-700 tracking-wide',
              ]"
              @click="displayPic = false"
            />
          </div>
          <div class="text-left">
            <div class="grid sm:grid-cols-2 gap-6 mt-8 relative">
              <div>
                <div v-if="sale === 'FIX-SALE'">Asking price</div>
                <div v-if="sale === 'AUCTION'" class="flex">
                  Soft cap
                  <nftmx-tooltip
                    text="Soft cap is the minimum amount the Auction must reach in order for the sale to take place."
                  >
                    <sup>
                      <font-awesome-icon
                        :icon="['fas', 'question-circle']"
                        class="ml-1 text-10 cursor-pointer"
                      />
                    </sup>
                  </nftmx-tooltip>
                </div>
                <div
                  :class="[
                    warn && !askingPrice ? 'border-red-800' : 'border-black',
                    'flex mt-3.5 font-ibm text-sm border-2 bg-tertiary-700',
                  ]"
                >
                  <div
                    class="w-12.5 h-12.5 flex items-center justify-center text-lg gap-4 bg-black"
                  >
                    <div
                      v-if="asset.contract.chain === 'BSC-TESTNET'"
                      class="text-xs w-4 h-4 text-primary-900"
                    >
                      <svg
                        role="img"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <title>Binance</title>
                        <path
                          class="fill-white"
                          d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                        />
                      </svg>
                    </div>
                    <font-awesome-icon
                      v-if="asset.contract.chain === 'ETHEREUM'"
                      :icon="['fab', 'ethereum']"
                    />
                  </div>
                  <nftmx-input
                    v-model="askingPrice"
                    number
                    border="none"
                    :min="0"
                    placeholder="Type Amount"
                    class="flex-1"
                  />
                </div>
              </div>
              <div v-if="sale === 'AUCTION'" class="relative">
                <div>
                  <div>End auction in</div>
                  <div
                    @click="openEndSaleTimePicker = !openEndSaleTimePicker"
                    class="flex mt-3.5 font-ibm text-sm cursor-pointer"
                  >
                    <div
                      :class="[
                        warn && !endTimePicker
                          ? 'border-red-800'
                          : 'border-black',
                        'flex items-center gap-5 border-2 h-13.5 text-white bg-tertiary-700 w-full pl-5 font-ibm-light text-sm',
                      ]"
                    >
                      <font-awesome-icon
                        :icon="['fas', 'calendar-alt']"
                        class="text-lg ml-0.75 mr-0.5"
                      />
                      {{ endTime }}
                    </div>
                  </div>
                </div>
                <div class="absolute w-full z-30">
                  <date-picker
                    v-if="openEndSaleTimePicker"
                    v-click-outside="clickOutsideEndTimePicker"
                    mode="dateTime"
                    v-model="endTimePicker"
                    :min-date="new Date()"
                    color="red"
                    is-dark
                    is-expanded
                  />
                </div>
              </div>
              <div v-if="sale === 'FIX-SALE'" class="relative">
                <div>
                  <div>Payment method</div>
                  <div
                    class="flex items-center h-12.5 mt-3.5 font-ibm text-sm gap-5"
                  >
                    <div
                      v-if="asset.contract.chain === 'BSC-TESTNET'"
                      class="w-8 h-8"
                    >
                      <svg
                        role="img"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <title>Binance</title>
                        <path
                          class="fill-tertiary-400"
                          d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                        />
                      </svg>
                    </div>
                    <font-awesome-icon
                      v-if="asset.contract.chain === 'ETHEREUM'"
                      :icon="['fab', 'ethereum']"
                      class="text-4xl text-tertiary-400"
                    />
                    {{ MainToken[getChainKey(asset.contract.chain)] }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="border-t border-primary-900 mt-6 mb-6" />
          <div class="grid 3xl:grid-cols-3 gap-5.75 text-left">
            <div>
              <div class="flex">
                Protection period
                <nftmx-tooltip
                  text="Benefit from APY returns when utilizing Liquidity Protection to sell a NFT property. You earn APY on the amount of purchase price once the buyer purchases the NFT for the entire protection period."
                >
                  <sup>
                    <font-awesome-icon
                      :icon="['fas', 'question-circle']"
                      class="ml-1 text-10 cursor-pointer"
                    />
                  </sup>
                </nftmx-tooltip>
              </div>
              <div
                :class="[
                  warn && isNaN(period) ? 'border-red-800' : 'border-black',
                  'flex mt-3.5 mb-4 font-ibm text-sm border-2 bg-tertiary-700',
                ]"
              >
                <nftmx-input
                  v-model="period"
                  number
                  border="none"
                  :min="0"
                  placeholder="0"
                />
                <div
                  class="w-30 h-12.5 px-4 bg-black flex items-center justify-center"
                >
                  DAYS
                </div>
              </div>
            </div>
            <div>
              <div>Slippage fee</div>
              <div
                :class="[
                  warn && isNaN(slippage) ? 'border-red-800' : 'border-black',
                  'flex mt-3.5 mb-4 font-ibm text-sm border-2 bg-tertiary-700',
                ]"
              >
                <nftmx-input
                  v-model="slippage"
                  number
                  border="none"
                  :min="0"
                  :max="100"
                  placeholder="0"
                />
                <div
                  class="w-14 h-12.5 px-4 bg-black flex items-center justify-center"
                >
                  %
                </div>
              </div>
            </div>
            <div>
              <div class="flex">
                Leveraging staking
                <nftmx-tooltip
                  text="Choosing this option will allow you to generate extra APY by leveraging the purchasing funds during the liquidity protection period via a 3rd party staking protocol, such as Compound, Earnest Finance, Venus, etc. You can use this option instead of slippage or combine it with slippage"
                >
                  <sup>
                    <font-awesome-icon
                      :icon="['fas', 'question-circle']"
                      class="ml-1 text-10 cursor-pointer"
                    />
                  </sup>
                </nftmx-tooltip>
              </div>
              <div
                class="grid grid-cols-2 items-center h-12.5 mt-3.5 mb-4 font-ibm text-sm"
              >
                <div
                  @click="staking = true"
                  class="flex items-center gap-4 w-fit cursor-pointer"
                >
                  <nftmx-radio :active="staking" />
                  <span>Yes</span>
                </div>
                <div
                  @click="staking = false"
                  class="flex items-center gap-4 w-fit cursor-pointer"
                >
                  <nftmx-radio :active="!staking" />
                  <span>No</span>
                </div>
              </div>
            </div>
          </div>
          <div class="border-t border-primary-900 mt-3 mb-6" />
          <div class="flex">Add hashtags</div>
          <div class="relative h-12.5 mt-3.5 mb-4 z-20 text-left">
            <div
              v-click-outside="
                () => {
                  hashtagSection = false;
                }
              "
              class="font-ibm text-13 border-2 border-black absolute w-full"
            >
              <div class="flex">
                <div class="absolute p-4 text-tertiary-400">#</div>
                <input
                  v-model="hashtag"
                  class="focus:outline-none h-12.5 text-white placeholder-tertiary-500 bg-tertiary-700 w-full pl-8 pr-6 font-ibm text-sm"
                  @focus="hashtagSection = true"
                  @keydown.enter="enterKeyDown"
                />
              </div>
              <div
                v-if="hashtagSection"
                class="bg-tertiary-700 px-4 max-h-40 overflow-auto"
              >
                <div
                  v-for="(item, index) in hashtags"
                  :key="index"
                  @click="selectHashtag(item)"
                  class="py-2 parent cursor-pointer"
                >
                  <span class="text-tertiary-400 child"> # </span>
                  <span class="child"> {{ item }} </span>
                </div>
              </div>
            </div>
          </div>
          <div class="flex flex-wrap gap-3">
            <nftmx-hashtag
              v-for="(name, index) in selectedHashtags"
              :key="index"
              :value="name"
              @click="deselectHashtag(name)"
            />
          </div>
          <div class="w-full mt-16 relative">
            <div
              class="absolute mt-5 text-tertiary-400 cursor-pointer transition hover:text-primary-900 h-fit"
              @click="step--"
            >
              <font-awesome-icon :icon="['fas', 'angle-left']" />
              <span class="text-sm"> Back </span>
            </div>
            <nftmx-button
              color="primary"
              textColor="white"
              outline
              label="NEXT STEP"
              :class="[
                waiting ? 'cursor-wait' : '',
                'w-full font-press text-base lg:text-lg lg:w-3/5 mx-auto',
              ]"
              h="xl2"
              @click="setOffering"
            />
          </div>
        </div>
        <div v-if="step === 3">
          <div class="text-left text-2xl font-ibm-bold mt-11.5">
            Apply multilevel ownership
          </div>
          <div
            class="grid grid-cols-2 gap-4 items-center w-full justify-between font-ibm text-13 mt-10"
          >
            <div
              @click="royalty = false"
              class="flex gap-3 items-center w-fit cursor-pointer"
            >
              <nftmx-radio :active="!royalty" />
              <div class="flex flex-1">
                <span>Sell 100% of your ownership</span>
                <nftmx-tooltip text="Sell 100% of your ownership">
                  <sup>
                    <font-awesome-icon
                      :icon="['fas', 'question-circle']"
                      class="ml-1 text-10"
                    />
                  </sup>
                </nftmx-tooltip>
              </div>
            </div>
            <div
              @click="royalty = true"
              class="flex gap-3 items-center w-fit cursor-pointer"
            >
              <nftmx-radio :active="royalty" />
              <div class="flex flex-1">
                <span>Retain a percentage of ownership</span>
                <nftmx-tooltip text="Retain a percentage of ownership">
                  <sup>
                    <font-awesome-icon
                      :icon="['fas', 'question-circle']"
                      class="ml-1 text-10 cursor-pointer"
                    />
                  </sup>
                </nftmx-tooltip>
              </div>
            </div>
          </div>
          <div v-if="royalty" class="grid 3xl:grid-cols-2 gap-5.75 mt-12">
            <div>
              <div class="flex font-ibm-bold text-lg">
                Ownership to retain
                <nftmx-tooltip text="Ownership percentage to retain in the NFT">
                  <sup>
                    <font-awesome-icon
                      :icon="['fas', 'question-circle']"
                      class="ml-1 text-10 cursor-pointer"
                    />
                  </sup>
                </nftmx-tooltip>
              </div>
              <div
                :class="[
                  warn && !ownershipToKeep ? 'border-red-800' : 'border-black',
                  'flex mt-3.5 mb-4 font-ibm text-sm border-2 bg-tertiary-700',
                ]"
              >
                <nftmx-input
                  v-model="ownershipToKeep"
                  number
                  border="none"
                  :min="0"
                  :max="100"
                  placeholder="0"
                />
                <div
                  class="w-14 h-12.5 px-4 bg-black flex items-center justify-center"
                >
                  %
                </div>
              </div>
            </div>
            <div>
              <div class="flex font-ibm-bold text-lg">
                Buyout asking price
                <nftmx-tooltip
                  text="Set an amount for which your ownership percentage can be bought out"
                >
                  <sup>
                    <font-awesome-icon
                      :icon="['fas', 'question-circle']"
                      class="ml-1 text-10 cursor-pointer"
                    />
                  </sup>
                </nftmx-tooltip>
              </div>
              <div
                :class="[
                  warn && !buyoutPrice ? 'border-red-800' : 'border-black',
                  'flex mt-3.5 mb-4 font-ibm text-sm border-2 bg-tertiary-700',
                ]"
              >
                <div
                  class="w-14 h-12.5 px-4 bg-black flex items-center justify-center"
                >
                  <nftmx-img
                    :src="ChainIcons[getChainKey(asset.contract.chain)]"
                  />
                </div>
                <nftmx-input
                  v-model="buyoutPrice"
                  number
                  border="none"
                  :min="0"
                  placeholder="0"
                />
              </div>
            </div>
          </div>
          <div class="w-full mt-16 relative">
            <div
              class="absolute mt-5 text-tertiary-400 cursor-pointer transition hover:text-primary-900 h-fit"
              @click="step--"
            >
              <font-awesome-icon :icon="['fas', 'angle-left']" />
              <span class="text-sm"> Back </span>
            </div>
            <nftmx-button
              color="primary"
              textColor="white"
              outline
              label="NEXT STEP"
              :class="[
                waiting ? 'cursor-wait' : '',
                'w-full font-press text-base lg:text-lg lg:w-3/5 mx-auto',
              ]"
              h="xl2"
              @click="step++"
            />
          </div>
        </div>
        <div v-if="step === 4">
          <div class="text-left text-2xl font-ibm-bold pt-10 pb-5.5">Fees</div>
          <div class="text-left">
            <div class="flex text-xs font-ibm-medium text-tertiary-500">
              <div>Service Fee</div>
              <div class="grow"></div>
              <div>2.5%</div>
            </div>
            <div class="text-11 font-ibm text-primary-900">
              100% gas and fee reinbursement with NFTPX tokens
            </div>
          </div>
          <nftmx-divider class="mt-4 mb-6" />
          <div class="text-sm flex items-center">
            <basic-checkbox
              border="border-black border"
              small
              class="w-8.5 h-5"
              @check="deploySyndication = true"
            />
            <div class="flex pt-0.5 text-tertiary-400">
              <span class="flex text-11">
                Deploy syndication contract to boost your sale
                <nftmx-tooltip
                  text="Automated Decentralized Syndication (ADS) allows any buyer or seller to pool funds together to purchase an NFT and automatically resell it for a profit. ADS acts as the owner of the NFT and each ADS can only be used for one NFT. All members of the ADS have an equal share based on their amount, and can claim their profits or refunded principal at any time without authorization from other investors."
                >
                  <sup>
                    <font-awesome-icon
                      :icon="['fas', 'question-circle']"
                      class="ml-1 text-10 cursor-pointer"
                    />
                  </sup>
                </nftmx-tooltip>
              </span>
            </div>
          </div>
          <div class="w-full mt-16 relative">
            <div
              class="absolute mt-5 text-tertiary-400 cursor-pointer transition hover:text-primary-900 h-fit"
              @click="step--"
            >
              <font-awesome-icon :icon="['fas', 'angle-left']" />
              <span class="text-sm"> Back </span>
            </div>
            <nftmx-button
              color="primary"
              textColor="white"
              outline
              label="LAUNCH YOUR DERIVATIVES OFFERING"
              :class="[
                waiting ? 'cursor-wait' : '',
                'w-full font-press text-base lg:text-lg lg:w-3/5 mx-auto',
              ]"
              h="xl2"
              @click="launchOffering"
              :loading="loading"
            />
          </div>
        </div>
      </div>
    </div>
  </vue-final-modal>
</template>

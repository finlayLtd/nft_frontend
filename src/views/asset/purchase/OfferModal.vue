<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import NftmxButton from "@/core/components/basic/NftmxButton.vue";
import { useStore } from "vuex";
import { getChainKey, roundTo } from "@/core/utils/common";
import { useToast } from "vue-toastification";
import { $vfm } from "vue-final-modal";
import NftmxTooltip from "@/core/components/basic/NftmxTooltip.vue";
import DatePicker from "@/core/components/v-calendar/src/components/DatePicker/DatePicker.vue";
import NftmxInput from "@/core/components/basic/NftmxInput.vue";
import { createOffer } from "@/core/utils/contracts/market.utils";
import { createOfferInMLR } from "@/core/utils/contracts/mlr.utils";
import Web3 from "web3/dist/web3.min.js";
import NftmxRadio from "@/core/components/basic/NftmxRadio.vue";
import {
  NULL_ADDRESS,
  BSC_TESTNET_VAULT_CONTRACT_ADDRESS,
} from "../../../core/config/constant";
import Accordion from "@/core/components/accordion/BasicAccordion.vue";
import VaultModal from "@/core/components/modal/VaultModal.vue";

const props = defineProps({
  asset: {
    type: Object,
    default: {},
  },
});

const emit = defineEmits(["update-asset"]);

const store = useStore();
const route = useRoute();
const chain = route.params.chain.toUpperCase();
const chainKey = getChainKey(chain);
const balance = computed(() => store.state.wallet.balance);
const tokenAddress = route.params.tokenAddress.toLowerCase();
const tokenId = route.params.tokenId;
const user = computed(() => store.getters["auth/user"]);
const coinPrice = computed(() =>
  store.getters["market/getCoinPrice"](chainKey)
);
const tokenPrice = ref();
const slippage = ref();
const downsidePeriod = ref();
const openExpirationPicker = ref(false);
const expirationPicker = ref(
  new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    new Date().getDate()
  )
);
const expiration = computed(() => {
  console.log(expirationPicker.value);
  if (expirationPicker.value) {
    return (
      expirationPicker.value.getDate() +
      " " +
      expirationPicker.value.toLocaleString("default", { month: "long" }) +
      ", " +
      expirationPicker.value.getFullYear()
    );
  } else {
    return "Choose date and time";
  }
});
const toast = useToast();
const warn = ref(false);
const staking = ref(false);
const loading = ref(false);
const open = ref(false);
const selectedWallet = ref("Vault Balance");
const walletBalanceInEth = computed(() =>
  selectedWallet.value === "Vault Balance" && user.value
    ? user.value.bscTestnetVault
      ? user.value.bscTestnetVault.funds
      : 0
    : selectedWallet.value === "Wallet Balance"
    ? roundTo(Web3.utils.fromWei(balance.value.toString()))
    : 0
);
const openVaultModal = ref(false);

const makeOffer = async () => {
  if (!store.state.wallet.account) {
    toast.error("Please connect wallet.");
    return;
  }
  if (chain === "ETHEREUM") {
    toast.error("Ethereum network is not ready yet.");
    return;
  }
  if (
    isNaN(slippage.value) ||
    isNaN(downsidePeriod.value) ||
    !expirationPicker.value
  ) {
    toast.error("Please fill out the fields");
    warn.value = true;
    return;
  }
  if (isNaN(tokenPrice.value) || tokenPrice.value <= 0) {
    toast.error("Offer price can't be zero");
    return;
  }
  if (walletBalanceInEth.value < tokenPrice.value) {
    toast.error("Insufficient funds");
    return;
  }

  try {
    loading.value = true;
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x61" }],
    });

    if (props.asset.mlrContract) {
      createOfferInMLR(
        props.asset.mlrContract.address,
        Web3.utils.toWei(tokenPrice.value.toString(), "ether"),
        (100 - slippage.value) * 100,
        downsidePeriod.value * 86400,
        parseInt(new Date(expirationPicker.value).getTime() / 1000)
      )
        .then((res) => {
          toast.success("You bid the order successfully.");
          emit("update-asset");
        })
        .catch((err) => {
          console.log("err: ", err);
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
      let offer = {
        tokenAddress,
        tokenId,
        buyer: store.state.user,
        orderStatus: "0",
        tokenPrice: tokenPrice.value,
        protectionRate: 100 - slippage.value,
        protectionTime: downsidePeriod.value * 86400,
        endSaleTime: parseInt(
          new Date(expirationPicker.value).getTime() / 1000
        ),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      createOffer([
        tokenAddress,
        tokenId,
        selectedWallet.value === "Vault Balance"
          ? BSC_TESTNET_VAULT_CONTRACT_ADDRESS
          : NULL_ADDRESS,
        Web3.utils.toWei(tokenPrice.value.toString(), "ether"),
        staking.value,
        (100 - slippage.value) * 100,
        downsidePeriod.value * 86400,
        slippage.value * 100,
        parseInt(new Date(expirationPicker.value).getTime() / 1000),
      ])
        .then((res) => {
          offer = {
            ...offer,
            offerId: res.events.CreateOffer.returnValues.offerID,
            tx: res.events.CreateOffer.transactionHash,
          };
          toast.success("Your offer has submitted successfully");
          emit("update-asset");
        })
        .catch((err) => {
          console.log(err);
          if (err.code === 4001) {
            toast.error("User denied transaction signature.");
          } else {
            toast.error("Something went wrong.");
          }
        })
        .finally(() => {
          loading.value = false;
          cancel();
        });
    }
  } catch (err) {
    console.log(err);
    if (err.code === 4001) {
      toast.error("User denied transaction signature.");
    } else {
      toast.error("Something went wrong");
    }
    loading.value = false;
  }
};

const chooseWallet = (val) => {
  selectedWallet.value = val;
  open.value = false;
};
const onClickOutside = () => {
  open.value = false;
};
const handleClick = () => {
  open.value = !open.value;
};
const cancel = () => {
  $vfm.hide("offerModal");
};
const clickOutsideExpirationPicker = () => {
  openExpirationPicker.value = false;
};
</script>

<template>
  <vue-final-modal
    classes="w-full flex justify-center overflow-y-auto"
    content-class="my-4 lg:my-auto mx-4 h-fit"
    :overlay-style="{ backgroundColor: 'black', opacity: '0.9' }"
    name="offerModal"
    esc-to-close
    fit-parent
  >
    <div class="bg-tertiary-900 text-white xl:w-modal-md">
      <div class="text-right text-[22px] leading-none p-5 relative w-full">
        <span
          class="cursor-pointer hover:text-red-900 transition"
          @click="cancel"
        >
          &#10005;
        </span>
      </div>
      <div class="text-center relative mt-3">
        <div class="font-press text-xl sm:text-2xl">Make an Offer</div>
        <div
          class="font-ibm-light text-primary-900 text-sm sm:text-lg mt-4 flex justify-center"
        >
          Gain rewards while your offer is pending
          <nftmx-tooltip
            :adjust="5"
            class="flex"
            text="During the pending period of the offer, funds that remain in your vault will earn rewards."
          >
            <template v-slot:custom>
              <div
                @click="openVaultModal = true"
                class="text-primary-900 cursor-pointer"
              >
                Add funds to your vault
              </div>
            </template>
            <font-awesome-icon
              :icon="['fas', 'question-circle']"
              class="ml-1.5 text-sm cursor-pointer"
            />
          </nftmx-tooltip>
        </div>
      </div>
      <div class="text-white px-4 lg:px-17.25 pb-12">
        <div class="relative text-lg font-ibm-medium">
          <div class="flex mt-8">Your Offer</div>
          <div class="sm:flex mt-3.25 font-ibm text-sm">
            <div
              :class="[
                warn && !tokenPrice ? 'border-red-900' : 'border-black',
                'flex flex-grow bg-tertiary-700 border-2 ',
              ]"
            >
              <div
                class="bg-black flex items-center font-ibm-medium px-6 gap-4 w-full sm:w-32.5 h-12.5"
              >
                <font-awesome-icon
                  v-if="chain === 'ETHEREUM'"
                  :icon="['fab', 'ethereum']"
                  class="text-3xl text-tertiary-400"
                />
                <div
                  v-if="chain === 'BSC-TESTNET'"
                  class="w-6 h-6 fill-tertiary-400"
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
                {{ chain === "ETHEREUM" ? "ETH" : "BNB" }}
              </div>
              <nftmx-input
                number
                v-model="tokenPrice"
                placeholder="Type of amount"
                border="none"
              />
              <div
                class="flex items-center justify-end px-4 border-black h-12.5 border-l-2 mt-4 sm:mt-0 w-full sm:w-37 text-tertiary-500 bg-tertiary-700"
              >
                ${{
                  tokenPrice && coinPrice
                    ? (tokenPrice * coinPrice).toFixed(2)
                    : 0
                }}
              </div>
            </div>
          </div>
          <div class="font-ibm text-11 flex justify-end text-tertiary-400">
            Balance:
            {{ roundTo(walletBalanceInEth) }}
            {{ chain === "ETHEREUM" ? "ETH" : "BNB" }}
          </div>
          <div class="mt-6 text-tertiary-400 font-ibm-bold">
            Liquidity protection
          </div>
          <div class="grid sm:grid-cols-2 mt-5 gap-6">
            <div>
              <div class="flex">Days of Protection</div>
              <div
                :class="[
                  warn && isNaN(downsidePeriod)
                    ? 'border-red-900'
                    : 'border-black',
                  'flex mt-3.25 mb-4 font-ibm text-sm border-2 bg-tertiary-700',
                ]"
              >
                <nftmx-input
                  number
                  v-model="downsidePeriod"
                  placeholder="0"
                  border="none"
                />
                <div
                  class="w-50 h-12.5 px-4 bg-black flex items-center justify-center font-ibm-medium"
                >
                  DAYS
                </div>
              </div>
            </div>
            <div>
              <div class="flex">Slippage fees</div>
              <div
                :class="[
                  warn && isNaN(slippage) ? 'border-red-900' : 'border-black',
                  'flex mt-3.25 font-ibm text-sm bg-tertiary-700 border-2',
                ]"
              >
                <nftmx-input
                  v-model="slippage"
                  placeholder="0"
                  number
                  :max="100"
                  border="none"
                />
                <div
                  class="w-13.5 h-12.5 px-4 bg-black flex items-center justify-center"
                >
                  %
                </div>
              </div>
            </div>
          </div>
          <div class="grid sm:grid-cols-2 gap-6.5">
            <div>
              <div class="flex mt-2.25">Offer Expiration</div>
              <div
                @click="openExpirationPicker = !openExpirationPicker"
                :class="[
                  warn && !expirationPicker ? 'border-red-900' : 'border-black',
                  'relative border-2 h-13.5 mt-3.25 text-white bg-tertiary-700 w-full px-4.25 font-ibm text-sm flex items-center gap-5.5 cursor-pointer',
                ]"
              >
                <font-awesome-icon
                  :icon="['fas', 'calendar-alt']"
                  class="text-lg"
                />
                <span>
                  {{ expiration }}
                </span>
              </div>
              <date-picker
                v-if="openExpirationPicker"
                v-click-outside="clickOutsideExpirationPicker"
                v-model="expirationPicker"
                is-dark
                is-expanded
                :min-date="
                  new Date(
                    new Date().getFullYear(),
                    new Date().getMonth(),
                    new Date().getDate() + 1
                  )
                "
                mode="dateTime"
              />
            </div>
            <div>
              <div class="flex mt-2.25">
                Leveraging staking
                <nftmx-tooltip
                  text="Selecting this option allows DAOs to join the syndication contract and purchase the NFT."
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
                  class="flex w-fit cursor-pointer items-center gap-2"
                >
                  <nftmx-radio :active="staking" />
                  <span class="px-2">Yes</span>
                </div>
                <div
                  @click="staking = false"
                  class="flex w-fit cursor-pointer items-center gap-2"
                >
                  <nftmx-radio :active="!staking" />
                  <span class="px-2">No</span>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-8 mb-8 flex gap-6">
            <nftmx-button
              color="primary"
              textColor="white"
              outline
              label="SUBMIT YOUR OFFER"
              class="font-press w-full text-sm md:text-lg flex-1"
              @click="makeOffer"
              h="xl"
              :loading="loading"
            />
            <div class="col-span-3 relative h-16.5 w-64">
              <div
                class="absolute w-full z-10 border-2 border-black px-5 overflow-hidden bg-black"
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
                    <div
                      class="py-4 mr-4 h-15.5 font-ibm-bold text-lg text-left"
                    >
                      {{ selectedWallet || "Pay with" }}
                    </div>
                  </template>
                  <div
                    class="py-4 font-ibm-bold text-left transition hover:text-primary-900 cursor-pointer"
                    @click="chooseWallet('Vault Balance')"
                  >
                    Vault Balance
                  </div>
                  <div
                    class="pt-4 pb-8 font-ibm-bold text-left transition hover:text-primary-900 cursor-pointer"
                    @click="chooseWallet('Wallet Balance')"
                  >
                    Wallet Balance
                  </div>
                </accordion>
              </div>
            </div>
          </div>
          <div
            v-if="selectedWallet === 'Vault Balance'"
            class="text-left font-ibm-medium text-11 cursor-pointer h-0 relative -top-5"
          >
            <span class="text-white">
              Vault balance:
              <font-awesome-icon :icon="['fab', 'ethereum']" />
              {{ roundTo(walletBalanceInEth) }}
            </span>
            <span class="text-tertiary-400">
              [${{ roundTo(walletBalanceInEth * coinPrice) }}]
            </span>
            <span class="text-tertiary-700"> | </span>
            <span @click="openVaultModal = true" class="text-primary-900">
              Deposit more funds to the vault
            </span>
          </div>
        </div>
      </div>
    </div>
    <vault-modal v-model="openVaultModal" />
  </vue-final-modal>
</template>

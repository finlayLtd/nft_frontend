<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import NftmxButton from "@/core/components/basic/NftmxButton.vue";
import { useStore } from "vuex";
import {
  keyCodeNumberRange,
  formatAMPM,
  roundTo,
  getChainKey,
} from "@/core/utils/common";
import { useToast } from "vue-toastification";
import { $vfm } from "vue-final-modal";
import NftmxTooltip from "@/core/components/basic/NftmxTooltip.vue";
import BasicCheckbox from "@/core/components/basic/BasicCheckbox.vue";
import Timer from "@/core/components/timer/Timer.vue";
import NftmxInput from "@/core/components/basic/NftmxInput.vue";
import Web3 from "web3/dist/web3.min.js";
import { createBid } from "@/core/utils/contracts/market.utils";
import { createBidInMLR } from "@/core/utils/contracts/mlr.utils";
import {
  NULL_ADDRESS,
  BSC_TESTNET_VAULT_CONTRACT_ADDRESS,
} from "@/core/config/constant";
import Accordion from "@/core/components/accordion/BasicAccordion.vue";
import VaultModal from "@/core/components/modal/VaultModal.vue";

const emit = defineEmits(["update-asset"]);

const props = defineProps({
  asset: {
    type: Object,
    default: {},
  },
  currentSale: Object,
});

const store = useStore();
const user = computed(() => store.getters["auth/user"]);
const toast = useToast();
const route = useRoute();
const router = useRouter();
const chain = route.params.chain.toUpperCase();
const chainKey = getChainKey(chain);
const balance = computed(() => store.state.wallet.balance);
const walletAddress = computed(() => store.getters["auth/walletAddress"]);
const coinPrice = computed(() =>
  store.getters["market/getCoinPrice"](chainKey)
);
const nftPrice = ref();
const disabled = ref(false);
const loading = ref(false);
const open = ref(false);
const selectedWallet = ref("Vault Balance");
const walletBalanceInEth = computed(() =>
  selectedWallet.value === "Vault Balance" && user.value
    ? user.value.bscTestnetVault
      ? user.value.bscTestnetVault.funds
      : 0
    : selectedWallet.value === "Wallet Balance"
    ? roundTo(Web3.utils.fromWei(balance.value))
    : 0
);
const openVaultModal = ref(false);

const cancel = () => {
  $vfm.hide("bidModal");
};
const bidOrder = async () => {
  if (!store.state.wallet.account) {
    toast.error("Please connect wallet.");
    return;
  }
  if (chain === "ETHEREUM") {
    toast.error("Ethereum network is not ready yet.");
    return;
  }
  if (props.asset.currentOrder.endSaleTime < new Date().getTime() / 1000) {
    toast.error("Auction has ended.");
    return;
  }
  if (!nftPrice.value || nftPrice.value <= props.currentSale.tokenPrice) {
    toast.error("You must bid higher");
    return;
  }
  if (walletBalanceInEth.value < nftPrice.value) {
    toast.error("Insufficient funds");
    return;
  }

  try {
    loading.value = true;
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x61" }],
    });

    const bidPrice = Web3.utils.toWei(nftPrice.value.toString(), "ether");

    if (props.asset.mlrContract) {
      createBidInMLR(
        props.currentSale.contractAddress,
        props.currentSale.orderId,
        bidPrice
      )
        .then((res) => {
          toast.success("Your bid has successfully placed.");
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
      createBid(
        props.currentSale.contractAddress,
        props.currentSale.orderId,
        selectedWallet.value === "Vault Balance"
          ? BSC_TESTNET_VAULT_CONTRACT_ADDRESS
          : NULL_ADDRESS,
        bidPrice
      )
        .then((res) => {
          toast.success("Your bid has successfully placed.");
          emit("update-asset");
        })
        .catch((err) => {
          console.log("err: ", err);
          if (err.code === 4001) {
            toast.error("User denied transaction signature.");
          } else {
            toast.error("Something went wrong");
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
</script>

<template>
  <vue-final-modal
    classes="w-full flex justify-center overflow-y-auto"
    content-class="my-4 lg:my-auto mx-4 h-fit"
    :overlay-style="{ backgroundColor: 'black', opacity: '0.9' }"
    name="bidModal"
    esc-to-close
    fit-parent
  >
    <div class="relative bg-tertiary-900 text-white xl:w-modal-md">
      <div class="text-right text-[22px] leading-none p-5 relative w-full">
        <span
          class="cursor-pointer hover:text-red-900 transition"
          @click="cancel"
        >
          &#10005;
        </span>
      </div>
      <div class="text-center relative mt-2 px-4 lg:px-17.25 pb-12">
        <div class="font-press text-xl sm:text-2xl">Bid Now</div>
        <div class="mt-9.5 text-lg">Current auction ends in</div>
        <div class="flex justify-center">
          <timer
            size="big"
            color="tertiary-800"
            class="my-3.25"
            :time="
              parseInt(
                currentSale.endSaleTime - new Date().getTime() / 1000 > 0
                  ? currentSale.endSaleTime - new Date().getTime() / 1000
                  : 0
              )
            "
          />
        </div>
        <div class="text-white">
          <div class="relative text-lg font-ibm-medium">
            <div class="flex mt-4">Price</div>
            <div class="sm:flex mt-3.25 font-ibm text-sm">
              <div class="flex flex-grow">
                <div
                  class="bg-black flex items-center justify-center font-ibm-medium px-3.25 gap-4 w-full sm:w-32.5 h-13.5"
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
                  <span>
                    {{ chain === "ETHEREUM" ? "ETH" : "BNB" }}
                  </span>
                </div>
                <div
                  class="bg-tertiary-700 w-full sm:w-auto flex-grow border border-black"
                >
                  <nftmx-input
                    number
                    v-model="nftPrice"
                    class="sm:border-l-0 h-13 text-sm"
                    placeholder="Type of amount"
                  />
                </div>
              </div>
              <div
                class="flex items-center justify-end px-4 border-2 border-black h-13.5 sm:border-l-0 mt-4 sm:mt-0 w-full sm:w-37 text-tertiary-500 bg-tertiary-700"
              >
                ${{
                  nftPrice && coinPrice ? (nftPrice * coinPrice).toFixed(2) : 0
                }}
              </div>
            </div>
            <div
              class="font-ibm text-11 mt-3 flex justify-end text-tertiary-400"
            >
              Balance:
              {{ roundTo(walletBalanceInEth) }}
              {{ chain === "ETHEREUM" ? "ETH" : "BNB" }}
            </div>
            <div class="mt-8 mb-8 flex gap-6">
              <nftmx-button
                color="primary"
                textColor="white"
                outline
                label="BID NOW"
                class="font-press w-full text-sm md:text-lg flex-1"
                @click="bidOrder"
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
              class="text-left font-ibm-medium text-11 cursor-pointer h-0 relative -top-3 flex items-center gap-1"
            >
              <span class="text-white flex items-center gap-1.5">
                Vault balance:
                <!-- <font-awesome-icon :icon="['fab', 'ethereum']" /> -->
                <div class="text-xs w-3 h-3 fill-white">
                  <svg viewBox="0 0 24 24">
                    <title>Binance</title>
                    <path
                      d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                    />
                  </svg>
                </div>
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
    </div>
    <vault-modal v-model="openVaultModal" />
  </vue-final-modal>
</template>

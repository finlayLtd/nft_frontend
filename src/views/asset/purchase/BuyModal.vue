<script setup>
import NftmxButton from "@/core/components/basic/NftmxButton.vue";
import { useStore } from "vuex";
import NftmxPriceCommon from "@/core/components/price/NftmxPriceCommon.vue";
import { MainToken } from "@/core/config/constant";
import { roundTo, getChainKey } from "@/core/utils/common";
import marketService from "@/core/services/market.service";
import { computed, onMounted, ref, watchEffect } from "vue";
import { $vfm } from "vue-final-modal";
import { useRoute, useRouter } from "vue-router";
import NftmxImg from "@/core/components/basic/NftmxImg.vue";
import { buyFixedPayOrder } from "@/core/utils/contracts/market.utils";
import { buyFixedPayOrderInMLR } from "@/core/utils/contracts/mlr.utils";
import Web3 from "web3/dist/web3.min.js";
import { useToast } from "vue-toastification";
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
const balance = computed(() => store.state.wallet.balance);
const toast = useToast();
const route = useRoute();
const router = useRouter();
const chain = route.params.chain.toUpperCase();
const chainKey = getChainKey(chain);
const user = computed(() => store.getters["auth/user"]);
const coinPrice = computed(() => store.state.market.coinPrice.BSC_TESTNET);
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

async function buyOrder() {
  if (!store.state.wallet.account) {
    toast.error("Please connect wallet.");
    return;
  }
  if (chain === "ETHEREUM") {
    toast.error("Ethereum network is not ready yet.");
    return;
  }
  if (walletBalanceInEth.value < props.currentSale.tokenPrice) {
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
      buyFixedPayOrderInMLR(
        props.currentSale.contractAddress,
        props.currentSale.orderId,
        selectedWallet.value === "Vault Balance"
          ? BSC_TESTNET_VAULT_CONTRACT_ADDRESS
          : NULL_ADDRESS,
        Web3.utils.toWei(props.currentSale.tokenPrice.toString())
      )
        .then((res) => {
          toast.success("You bought the order successfully", { timeout: 0 });
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
      buyFixedPayOrder(
        props.currentSale.contractAddress,
        [props.currentSale.orderId],
        selectedWallet.value === "Vault Balance"
          ? BSC_TESTNET_VAULT_CONTRACT_ADDRESS
          : NULL_ADDRESS,
        Web3.utils.toWei(props.currentSale.tokenPrice.toString())
      )
        .then((res) => {
          toast.success("You bought the order successfully", { timeout: 0 });
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
    }
  } catch (err) {
    if (err.code === 4001) {
      toast.error("User denied transaction signature.");
    } else {
      toast.error("Something went wrong");
    }
    loading.value = false;
  }
}
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
  $vfm.hide("buyModal");
};
</script>

<template>
  <vue-final-modal
    classes="w-full flex justify-center overflow-y-auto"
    content-class="my-4 lg:my-auto mx-4 h-fit"
    :overlay-style="{ backgroundColor: 'black', opacity: '0.9' }"
    name="buyModal"
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
      <div class="text-center relative pt-2 px-4 md:px-16 pb-10">
        <div class="font-press text-xl md:text-2xl">Buy Now</div>
        <div class="text-left font-ibm-bold text-lg mt-12">Asking price</div>
        <div
          class="flex border-2 border-black divide-x-2 divide-black h-13.5 text-sm mt-3"
        >
          <div class="bg-black w-32 flex items-center justify-center gap-5">
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
          <div class="flex-1 flex items-center px-4 bg-tertiary-800">
            {{ currentSale.tokenPrice }}
          </div>
          <div
            class="w-32 px-4 flex items-center justify-end bg-tertiary-700 text-tertiary-400"
          >
            <nftmx-price-common
              :price="roundTo(currentSale.tokenPrice * coinPrice)"
            />
          </div>
        </div>
        <div class="font-ibm text-11 flex justify-end text-tertiary-400">
          Balance:
          {{ roundTo(walletBalanceInEth) }}
          {{ chain === "ETHEREUM" ? "ETH" : "BNB" }}
        </div>
        <div class="mt-12 mb-8 flex gap-6">
          <nftmx-button
            color="primary"
            textColor="white"
            outline
            label="BUY NOW"
            class="font-press w-full text-sm md:text-lg flex-1"
            @click="buyOrder"
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
                  <div class="py-4 mr-4 h-15.5 font-ibm-bold text-lg text-left">
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
    <vault-modal v-model="openVaultModal" />
  </vue-final-modal>
</template>

<script setup>
import NftmxButton from "@/core/components/basic/NftmxButton.vue";
import { capitalize } from "lodash";
import { $vfm } from "vue-final-modal";
import NftmxImg from "@/core/components/basic/NftmxImg.vue";
import NftmxTooltip from "@/core/components/basic/NftmxTooltip.vue";
import { useStore } from "vuex";
import { themeConfig } from "@/core/config/constant";
import { computed, ref } from "vue";
import Web3 from "web3/dist/web3.min.js";
import NftmxInput from "@/core/components/basic/NftmxInput.vue";
import { useToast } from "vue-toastification";
import { addLiquidity, withdraw } from "@/core/utils/contracts/dvc.utils.js";
import { roundTo, getChainKey, shortenAddress } from "@/core/utils/common";

const props = defineProps({
  dvc: Object,
});

const emit = defineEmits(["invest"]);

const toast = useToast();
const store = useStore();
const windowWidth = computed(() => store.state.app.windowWidth);
const investment = ref();
const loading = ref(false);
const userId = computed(() => store.getters["auth/userId"]);
const walletAddress = computed(() => store.getters["auth/walletAddress"]);
const chainKey = getChainKey(props.dvc.chain);
const coinPrice = computed(() => store.state.market.coinPrice[chainKey] || 1);
const myInvestment = computed(() =>
  props.dvc.backers.find((item) => item.user.id === userId.value)
);

const invest = async () => {
  if (!store.state.wallet.account) {
    toast.error("Please connect wallet.");
    return;
  }
  if (investment.value > myInvestment.value.lp) {
    toast.error("Redeem balance must be below than the available redemption");
    return;
  }

  try {
    loading.value = true;
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x61" }],
    });

    await withdraw(
      props.dvc.address,
      Web3.utils.toWei(investment.value.toString())
    );

    toast.success("Redeemed your investment successfully");
    cancel();
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

const cancel = () => {
  $vfm.hide("backDvcModal");
};
</script>

<template>
  <vue-final-modal
    classes="w-full flex justify-center overflow-y-auto"
    content-class="my-4 lg:my-auto mx-4 h-fit"
    :overlay-style="{ backgroundColor: 'black', opacity: '0.9' }"
    name="backDvcModal"
    esc-to-close
    fit-parent
  >
    <div class="bg-tertiary-900 text-white xl:w-modal-md 3xl:w-modal-big">
      <div class="text-right text-xl p-5">
        <font-awesome-icon
          :icon="['fas', 'times']"
          class="cursor-pointer hover:text-tertiary-400 transition"
          @click="cancel"
        />
      </div>
      <div
        class="text-center font-press text-xl md:text-2xl leading-6 mx-4 py-2"
      >
        Redeem Investment
      </div>
      <div class="px-8 lg:px-16 pb-20 mt-6">
        <div class="font-ibm-bold text-lg">Choose DVC</div>
        <div
          class="font-ibm text-sm border-2 border-black bg-tertiary-700 h-13.5 flex items-center px-4 gap-2 mt-3"
        >
          <span>
            {{ dvc.name }}
          </span>
          <span class="text-tertiary-400"> (DVC </span>
          <span class="text-tertiary-400"> {{ dvc.index }}) </span>
        </div>
        <div class="text-tertiary-400 text-xs text-right mt-2">
          AVG ROI <span class="text-primary-900"> 55% </span> | See all criteria
        </div>
        <div
          :class="[
            'flex mt-7 bg-tertiary-700 border-2',
            investment > myInvestment.lp ? 'border-red-900' : 'border-black',
          ]"
        >
          <nftmx-input
            placeholder="Type of amount"
            number
            v-model="investment"
            class="h-12.5 text-white placeholder-tertiary-500 w-full pl-20 font-ibm text-sm"
            border="none"
          />
          <div
            class="w-14 h-12.5 bg-black absolute flex items-center justify-center text-tertiary-400"
          >
            <font-awesome-icon
              v-if="dvc.chain === 'ETHEREUM'"
              :icon="['fab', 'ethereum']"
              class="text-3xl"
            />
            <div
              v-if="dvc.chain === 'BSC-TESTNET'"
              class="w-7 h-7 fill-tertiary-400"
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
          </div>
        </div>
        <div class="text-tertiary-400 text-xs mt-2 flex items-center gap-1">
          Your available redemption:
          <font-awesome-icon
            v-if="dvc.chain === 'ETHEREUM'"
            :icon="['fab', 'ethereum']"
            class="text-white"
          />
          <div v-if="dvc.chain === 'BSC-TESTNET'" class="w-3 h-3 fill-white">
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
          <span class="text-white">
            {{ myInvestment.lp }}
          </span>
          <span>
            [${{ roundTo(myInvestment.lp * coinPrice).toLocaleString() }}]
          </span>
        </div>
        <div class="w-full text-center mt-12.5 lg:w-1/2 mx-auto">
          <nftmx-button
            color="red"
            textColor="white"
            outline
            label="REDEEM INVESTMENT"
            class="font-press text-lg py-5 leading-6"
            h="xl"
            w="full"
            @click="invest"
            :loading="loading"
          />
          <div class="text-tertiary-400 text-11 mt-2 text-right">
            Connected wallet
            <span class="text-white">{{ shortenAddress(walletAddress) }}</span>
          </div>
        </div>
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup>
import NftmxTable from "@/core/components/table/NftmxTable.vue";
import NftmxThead from "@/core/components/table/NftmxThead.vue";
import NftmxTh from "@/core/components/table/NftmxTh.vue";
import NftmxTbody from "@/core/components/table/NftmxTbody.vue";
import NftmxTd from "@/core/components/table/NftmxTd.vue";
import NftmxTr from "@/core/components/table/NftmxTr.vue";
import NftmxButton from "@/core/components/basic/NftmxButton.vue";
import { $vfm } from "vue-final-modal";
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
import NftmxInput from "@/core/components/basic/NftmxInput.vue";
import {
  getChainKey,
  roundTo,
  getDateAgo,
  shortenHash,
  shortenAddress,
} from "@/core/utils/common";
import { useRoute } from "vue-router";
import { createSyndicationMarket } from "@/core/utils/contracts/syndication-market-factory.utils.js";
import { createSyndicationMlr } from "@/core/utils/contracts/syndication-mlr-factory.utils.js";
import { addLiquidityMarket } from "@/core/utils/contracts/syndication-market.utils.js";
import { addLiquidityMlr } from "@/core/utils/contracts/syndication-mlr.utils.js";
import { increaseAllowance } from "@/core/utils/contracts/vault.utils.js";
import { useToast } from "vue-toastification";
import Web3 from "web3/dist/web3.min.js";
import {
  BSC_TESTNET_MARKET_CONTRACT_ADDRESS,
  BSC_TESTNET_VAULT_CONTRACT_ADDRESS,
  NULL_ADDRESS,
} from "@/core/config/constant";
import Accordion from "@/core/components/accordion/BasicAccordion.vue";
import VaultModal from "@/core/components/modal/VaultModal.vue";

const props = defineProps({
  asset: Object,
  syndication: Object,
  syndicationHistory: Array,
});

const emit = defineEmits(["update-syndication"]);

const cancel = () => {
  $vfm.hide("syndicationModal");
};

const store = useStore();
const route = useRoute();
const toast = useToast();
const chain = route.params.chain.toUpperCase();
const tokenAddress = route.params.tokenAddress.toLowerCase();
const tokenId = route.params.tokenId.toLowerCase();
const nftPrice = ref();
const chainKey = getChainKey(chain);
const user = computed(() => store.getters["auth/user"]);
const coinPrice = computed(() =>
  store.getters["market/getCoinPrice"](chainKey)
);
const balance = computed(() => store.state.wallet.balance);
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

const createNewSyndication = async () => {
  if (!store.state.wallet.account) {
    toast.error("Please connect wallet.");
    return;
  }
  if (chain === "ETHEREUM") {
    toast.error("Ethereum network is not ready yet.");
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
    if (!nftPrice.value) nftPrice.value = 0;
    if (props.asset.mlrContract) {
      await createSyndicationMlr(
        [
          [
            tokenAddress,
            tokenId,
            true,
            !props.asset.currentOrder
              ? 2
              : props.asset.currentOrder.orderType === "0"
              ? 0
              : 1,
            !props.asset.currentOrder ? 0 : props.asset.currentOrder.orderId,
            props.asset.mlrContract.address,
            0,
          ],
        ],
        selectedWallet.value === "Vault Balance" && nftPrice.value > 0
          ? BSC_TESTNET_VAULT_CONTRACT_ADDRESS
          : NULL_ADDRESS,
        Web3.utils.toWei(nftPrice.value.toString())
      );
    } else {
      await createSyndicationMarket(
        [
          [
            tokenAddress,
            tokenId,
            true,
            !props.asset.currentOrder
              ? 2
              : props.asset.currentOrder.orderType === "0"
              ? 0
              : 1,
            !props.asset.currentOrder ? 0 : props.asset.currentOrder.orderId,
            BSC_TESTNET_MARKET_CONTRACT_ADDRESS,
            0,
          ],
        ],
        selectedWallet.value === "Vault Balance" && nftPrice.value > 0
          ? BSC_TESTNET_VAULT_CONTRACT_ADDRESS
          : NULL_ADDRESS,
        Web3.utils.toWei(nftPrice.value.toString())
      );
    }
    emit("update-syndication");
    toast.success("Syndication is created successfully");
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
const joinSyndication = async () => {
  if (!store.state.wallet.account) {
    toast.error("Please connect wallet.");
    return;
  }
  if (chain === "ETHEREUM") {
    toast.error("Ethereum network is not ready yet.");
    return;
  }
  if (!nftPrice.value) {
    toast.error("Please enter amount more than zero");
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
    if (selectedWallet.value === "Vault Balance") {
      toast.success("Increase allowance...");
      await increaseAllowance(
        props.asset.syndication.address,
        Web3.utils.toWei(nftPrice.value.toString())
      );
    }
    toast.success("Join syndication...");
    if (props.asset.mlrContract) {
      await addLiquidityMlr(
        props.asset.syndication.address,
        selectedWallet.value === "Vault Balance" && nftPrice.value > 0
          ? BSC_TESTNET_VAULT_CONTRACT_ADDRESS
          : NULL_ADDRESS,
        Web3.utils.toWei(nftPrice.value.toString())
      );
    } else {
      await addLiquidityMarket(
        props.asset.syndication.address,
        selectedWallet.value === "Vault Balance" && nftPrice.value > 0
          ? BSC_TESTNET_VAULT_CONTRACT_ADDRESS
          : NULL_ADDRESS,
        Web3.utils.toWei(nftPrice.value.toString())
      );
    }
    emit("update-syndication");
    toast.success("Your fund has successfully joined the syndication");
    loading.value = false;
  } catch (err) {
    console.log("err: ", err);
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
    name="syndicationModal"
    esc-to-close
    fit-parent
  >
    <div class="bg-tertiary-900 text-white xl:w-modal-md">
      <div class="text-right text-xl p-5">
        <font-awesome-icon
          :icon="['fas', 'times']"
          class="cursor-pointer hover:text-tertiary-400 transition"
          @click="cancel"
        />
      </div>
      <div class="text-center">
        <div class="font-press text-xl md:text-2xl leading-6 mx-4 mt-1.75">
          Total Syndication Fundraising
        </div>
        <div
          class="font-ibm-semi-bold text-2xl md:text-3xl text-primary-900 items-center py-1.25 flex justify-center"
        >
          <div
            v-if="chain === 'BSC-TESTNET'"
            class="text-xs w-7 h-7 text-primary-900"
          >
            <svg
              role="img"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Binance</title>
              <path
                d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                fill="#19cb58"
              ></path>
            </svg>
          </div>
          <font-awesome-icon
            v-if="chain === 'ETHEREUM'"
            :icon="['fab', 'ethereum']"
          />
          <div class="leading-none font-ibm text-lg text-tertiary-400 ml-4">
            <span class="font-ibm-bold text-3xl text-primary-900">
              {{ asset.syndication ? roundTo(asset.syndication.total) : 0 }}
            </span>
            <span> [$</span>
            <span>
              {{
                asset.syndication
                  ? roundTo(asset.syndication.total * coinPrice)
                  : 0
              }}
            </span>
            <span>]</span>
          </div>
        </div>
      </div>
      <div class="px-4 md:px-16 pb-10 mt-9">
        <div
          v-if="syndicationHistory && syndicationHistory.length > 0"
          class="overflow-auto"
          style="max-width: 85vw"
        >
          <table
            class="border border-black bg-tertiary-800 w-full text-left min-w-max"
          >
            <thead class="text-xs font-ibm-light text-tertiary-400">
              <tr class="border-b border-black">
                <th class="py-4 border-r border-black px-4">Date</th>
                <th class="border-r border-black px-4">Wallet Address</th>
                <th class="border-r border-black px-4">
                  {{ chain === "ETHEREUM" ? "ETH" : "BNB" }} amount
                </th>
                <th class="border-r border-black px-4">Ownership %</th>
                <th class="px-4">Proof</th>
              </tr>
            </thead>
            <tbody class="font-ibm-light text-xs">
              <tr
                v-for="(item, index) in syndicationHistory"
                :key="index"
                class="border-b border-black"
              >
                <td class="py-4 border-r border-black px-4">
                  {{ getDateAgo(item.createdAt) }}
                </td>
                <td class="py-4 border-r border-black px-4 text-primary-900">
                  {{ shortenAddress(item.user.walletAddress) }}
                </td>
                <td class="py-4 border-r border-black px-4">
                  {{ roundTo(item.investment) }}
                </td>
                <td class="py-4 border-r border-black px-4">
                  {{
                    roundTo(
                      (item.investment /
                        (asset.currentOrder?.tokenPrice ||
                          asset.syndication.total)) *
                        100,
                      1
                    )
                  }}%
                </td>
                <td
                  class="py-4 border-r border-black px-4 text-secondary-600 font-ibm-medium"
                >
                  <a
                    target="_blank"
                    :href="
                      (chain === 'ETHEREUM'
                        ? 'https://etherscan.io/tx/'
                        : 'https://testnet.bscscan.com/tx/') + item.tx
                    "
                    class="text-secondary-600"
                  >
                    {{ shortenHash(item.tx) }}
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="sm:flex mt-8 font-ibm text-sm">
          <div class="border-black flex items-center w-full border-2">
            <div class="bg-black h-12.5 flex items-center justify-center w-14">
              <div
                v-if="chain === 'BSC-TESTNET'"
                class="text-xs w-7 h-7 text-primary-900"
              >
                <svg
                  role="img"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>Binance</title>
                  <path
                    d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                    fill="#949494"
                  ></path>
                </svg>
              </div>
              <font-awesome-icon
                v-if="chain === 'ETHEREUM'"
                :icon="['fab', 'ethereum']"
                class="text-3xl text-tertiary-400"
              />
            </div>
            <div class="bg-tertiary-700 w-full flex-1">
              <nftmx-input
                placeholder="Type of amount"
                class="h-12.5"
                number
                v-model="nftPrice"
                border="none"
              />
            </div>
            <div
              class="flex items-center justify-end px-4 border-black h-12.5 border-l-2 mt-4 sm:mt-0 w-full sm:w-37 text-tertiary-500 bg-tertiary-700"
            >
              ${{
                nftPrice && coinPrice ? (nftPrice * coinPrice).toFixed(2) : 0
              }}
            </div>
          </div>
        </div>
        <div class="text-11 font-ibm mt-3 text-right text-tertiary-400">
          Balance:
          {{ roundTo(walletBalanceInEth) }}
          {{ chain === "ETHEREUM" ? "ETH" : "BNB" }}
        </div>
        <div class="w-full text-center mt-4.25">
          <div class="mb-8 flex gap-6">
            <nftmx-button
              v-if="!asset.syndication"
              color="black"
              label="CREATE SYNDICATION"
              class="font-press w-full text-lg py-5 leading-6 flex-1"
              h="xl"
              textColor="secondary-900"
              outline
              @click="createNewSyndication"
              :loading="loading"
            />
            <nftmx-button
              v-else
              color="secondary"
              label="JOIN SYNDICATION"
              class="font-press w-full text-lg py-5 leading-6 flex-1"
              h="xl"
              textColor="white"
              outline
              @click="joinSyndication"
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
    <vault-modal v-model="openVaultModal" />
  </vue-final-modal>
</template>

<script setup>
import NftmxTable from "@/core/components/table/NftmxTable.vue";
import NftmxThead from "@/core/components/table/NftmxThead.vue";
import NftmxTh from "@/core/components/table/NftmxTh.vue";
import NftmxTbody from "@/core/components/table/NftmxTbody.vue";
import NftmxTd from "@/core/components/table/NftmxTd.vue";
import NftmxTr from "@/core/components/table/NftmxTr.vue";
import NftmxButton from "@/core/components/basic/NftmxButton.vue";
import { $vfm } from "vue-final-modal";
import NftmxImg from "@/core/components/basic/NftmxImg.vue";
import { buyOut } from "@/core/utils/contracts/mlr.utils";
import Web3 from "web3/dist/web3.min.js";
import { NULL_ADDRESS } from "../../core/config/constant";
import { useStore } from "vuex";
import { computed, ref } from "vue";
import Accordion from "@/core/components/accordion/BasicAccordion.vue";
import VaultModal from "@/core/components/modal/VaultModal.vue";
import { roundTo } from "@/core/utils/common";
import { useToast } from "vue-toastification";

const props = defineProps({
  contract: Object,
  nft: Object,
  owner: Object,
});

const emit = defineEmits(["buyout"]);

const toast = useToast();
const store = useStore();
const balance = computed(() => store.state.wallet.balance);
const user = computed(() => store.getters["auth/user"]);
const coinPrice = computed(() => store.state.market.coinPrice.BSC_TESTNET);
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
const loading = ref(false);

const cancel = () => {
  $vfm.hide("buyoutModal");
};
const buyout = async () => {
  if (walletBalanceInEth.value < props.owner.buyout) {
    toast.error("Insufficient funds");
    return;
  }
  try {
    loading.value = true;
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x61" }],
    });
    buyOut(
      props.nft.mlrContract.address,
      props.owner.user.walletAddress,
      NULL_ADDRESS,
      Web3.utils.toWei(props.owner.buyout.toString())
    )
      .then((res) => {
        emit("buyout");
      })
      .catch((err) => {
        if (err.code === 4001) {
          toast.error("User denied transaction signature.");
        } else {
          toast.error("Something went wrong");
        }
      })
      .finally(() => {
        loading.value = false;
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
    name="buyoutModal"
    esc-to-close
    fit-parent
  >
    <div
      class="bg-tertiary-900 opacity-100 text-white xl:w-modal-md 3xl:w-modal-big"
    >
      <div class="text-right text-xl p-5">
        <font-awesome-icon
          :icon="['fas', 'times']"
          class="cursor-pointer hover:text-tertiary-400 transition"
          @click="cancel"
        />
      </div>
      <div class="text-center">
        <div class="font-press text-2xl leading-6 mx-4">
          Buyout NFT Ownership
        </div>
      </div>
      <div class="px-4 md:px-16 pb-17 pt-12">
        <div class="overflow-auto" style="max-width: 85vw">
          <nftmx-table class="border border-black text-xs">
            <nftmx-thead>
              <nftmx-tr>
                <nftmx-th>
                  <div class="px-2">Collections</div>
                </nftmx-th>
                <nftmx-th>NFT</nftmx-th>
                <nftmx-th>Status</nftmx-th>
                <nftmx-th>Baseline ownership %</nftmx-th>
                <nftmx-th>Actual ownership %</nftmx-th>
                <nftmx-th> Total ownership reward to date </nftmx-th>
                <nftmx-th>Buyout asking price</nftmx-th>
              </nftmx-tr>
            </nftmx-thead>
            <nftmx-tbody>
              <nftmx-tr
                v-for="(item, index) in [1]"
                :key="index"
                class="transition hover:bg-tertiary-200"
              >
                <nftmx-td>
                  <div class="flex items-center gap-4 w-max">
                    <nftmx-img class="w-8 h-8" :src="contract.imageUrl" />
                    <div>{{ contract.name }}</div>
                  </div>
                </nftmx-td>
                <nftmx-td>
                  <div class="flex items-center gap-4 w-max">
                    <nftmx-img class="w-8 h-8" :src="nft.imageUrl" />
                    <div>{{ nft.name || "#" + nft.tokenId }}</div>
                  </div>
                </nftmx-td>
                <nftmx-td>
                  <div :class="['text-red-900']">Sold</div>
                </nftmx-td>
                <nftmx-td>{{ owner.royalty }}%</nftmx-td>
                <nftmx-td>{{ owner.realRoyalty }}%</nftmx-td>
                <nftmx-td>
                  <div class="flex items-center gap-2">
                    <nftmx-img src="/images/logo/s-ethereum.png" />
                    <div>6.5356</div>
                    <div class="text-tertiary-400">[$6.5356]</div>
                  </div>
                </nftmx-td>
                <nftmx-td>
                  <div class="flex items-center gap-2">
                    <nftmx-img src="/images/logo/s-ethereum.png" />
                    <div>{{ owner.buyout }}</div>
                    <div class="text-tertiary-400">
                      [${{ (owner.buyout * coinPrice).toFixed(3) }}]
                    </div>
                  </div>
                </nftmx-td>
              </nftmx-tr>
            </nftmx-tbody>
          </nftmx-table>
        </div>
        <div class="mt-8 mb-8 flex gap-6">
          <nftmx-button
            color="primary"
            outline
            label="BUYOUT"
            class="font-press w-full text-lg py-5 leading-6 flex-1"
            h="xl"
            @click="buyout"
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

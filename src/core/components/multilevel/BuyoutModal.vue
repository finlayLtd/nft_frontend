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
import { useStore } from "vuex";
import { buyOut } from "@/core/utils/contracts/mlr.utils";
import Web3 from "web3/dist/web3.min.js";
import { roundTo } from "@/core/utils/common";
import { computed, ref } from "vue";
import Accordion from "@/core/components/accordion/BasicAccordion.vue";
import VaultModal from "@/core/components/modal/VaultModal.vue";
import { useToast } from "vue-toastification";
import { NULL_ADDRESS } from "@/core/config/constant";

const props = defineProps({
  asset: Object,
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
    ? roundTo(Web3.utils.fromWei(balance.value))
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
      props.asset.mlrContract.address,
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
    <div class="bg-tertiary-900 opacity-100 text-white xl:w-modal-md">
      <div class="text-right text-xl p-5">
        <span
          class="cursor-pointer hover:text-red-900 transition"
          @click="cancel"
        >
          &#10005;
        </span>
      </div>
      <div class="text-center">
        <div class="font-press text-2xl leading-6 mx-4">
          Buyout NFT Ownership
        </div>
        <div class="font-ibm-bold mt-13.25">
          <div>Buyout asking price from current owner</div>
          <div class="mt-1.75">
            <font-awesome-icon
              :icon="['fab', 'ethereum']"
              class="text-primary-900 text-3xl"
            />
            <span class="text-primary-900 text-3xl ml-4">
              {{ owner.buyout }}
            </span>
            <span class="text-tertiary-400 text-lg font-ibm">
              [${{ roundTo(owner.buyout * coinPrice) }}]
            </span>
          </div>
        </div>
      </div>
      <div class="px-4 md:px-16 pb-10 mt-7">
        <div class="overflow-auto" style="max-width: 85vw">
          <nftmx-table
            class="border border-black text-xs text-left bg-tertiary-800"
          >
            <nftmx-thead>
              <nftmx-tr>
                <th class="px-4">Collections</th>
                <th class="px-4">NFT</th>
                <th class="px-4">Status</th>
                <th class="px-4">Baseline ownership %</th>
                <th class="px-4">Actual ownership %</th>
                <th class="px-4">Total ownership reward to date</th>
              </nftmx-tr>
            </nftmx-thead>
            <nftmx-tbody>
              <nftmx-tr>
                <nftmx-td>
                  <div class="flex items-center gap-3 w-max">
                    <nftmx-img class="w-8 h-8" :src="asset.contract.imageUrl" />
                    <span>{{ asset.contract.name }}</span>
                  </div>
                </nftmx-td>
                <nftmx-td>
                  <div class="flex items-center gap-3 w-max">
                    <nftmx-img class="w-8 h-8" :src="asset.imageUrl" />
                    <span>{{ asset.name || "#" + asset.tokenId }}</span>
                  </div>
                </nftmx-td>
                <nftmx-td>
                  <div class="text-primary-900">Under Contract</div>
                </nftmx-td>
                <nftmx-td>{{ owner.royalty }}%</nftmx-td>
                <nftmx-td>{{ owner.realRoyalty }}%</nftmx-td>
                <nftmx-td>
                  <div class="flex items-center gap-2">
                    <nftmx-img src="/images/logo/s-ethereum.png" />
                    <div>0</div>
                    <div class="text-tertiary-400">[$0]</div>
                  </div>
                </nftmx-td>
              </nftmx-tr>
            </nftmx-tbody>
          </nftmx-table>
        </div>
        <div class="mt-12 mb-8 flex gap-6">
          <nftmx-button
            color="primary"
            textColor="white"
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

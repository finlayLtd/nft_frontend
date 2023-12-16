<script setup>
import BodyContainer from "@/core/container/BodyContainer.vue";
import Accordion from "@/core/components/accordion/AccordionInTable.vue";
import NftmxTable from "@/core/components/table/NftmxTable.vue";
import NftmxThead from "@/core/components/table/NftmxThead.vue";
import NftmxTh from "@/core/components/table/NftmxTh.vue";
import NftmxTbody from "@/core/components/table/NftmxTbody.vue";
import NftmxTd from "@/core/components/table/NftmxTd.vue";
import NftmxTr from "@/core/components/table/NftmxTr.vue";
import NftmxImg from "@/core/components/basic/NftmxImg.vue";
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
import BuyoutModal from "./BuyoutModal.vue";
import marketService from "@/core/services/market.service";
import Web3 from "web3/dist/web3.min.js";
import NftmxTooltip from "@/core/components/basic/NftmxTooltip.vue";

const buyoutModal = ref(false);
const store = useStore();
const userId = computed(() => store.getters["auth/userId"]);
const walletAddress = computed(() => store.getters["auth/walletAddress"]);
const multilevelContracts = ref([]);
const selectedContract = ref();
const selectedNft = ref();
const selectedOwner = ref();
const loading = ref(true);

const openBuyout = (contract, nft, owner) => {
  selectedContract.value = contract;
  selectedNft.value = nft;
  selectedOwner.value = owner;
  buyoutModal.value = true;
};
const openConnectWalletModal = () => {
  store.commit("app/OPEN_CONNECT_WALLET_MODAL");
};
onMounted(() => {
  marketService
    .getMultilevelNfts("BSC-TESTNET", 0, 100)
    .then((res) => {
      multilevelContracts.value = res.data;
      loading.value = false;
    })
    .catch((err) => {
      console.log("err", err);
    });
});

const showOwners = (contractIndex, nftIndex) => {
  multilevelContracts.value[contractIndex].nfts[nftIndex].open =
    !multilevelContracts.value[contractIndex].nfts[nftIndex].open;
};
const buyout = () => {
  selectedOwner.value.user = store.state.user;
};
</script>
<template>
  <div v-if="!userId" class="h-multilevel min-h-[600px] w-full relative -mb-6">
    <nftmx-img
      src="/images/landing/hero-image-background-1920.png"
      class="w-full h-full object-center object-cover absolute"
    />
    <div class="w-full h-full flex items-center justify-center absolute">
      <div class="text-center px-4 md:px-40">
        <div class="font-press text-3xl xl:text-4xl text-white">
          Build a Multilevel Ownership NFT
        </div>
        <div
          class="font-ibm text-tertiary-400 text-xl md:text-[21px] mt-5.25 mb-9.5 2xl:px-60 md:leading-9"
        >
          <span>
            Continue generating profits even after you sell an NFT, potentially
            even in perpetuity</span
          >
          <nftmx-tooltip
            text="Multilevel ownership provides for continuous profit after selling an asset when other sales execute. Income streams like renting an asset are not considered for multilevel ownership."
          >
            <sup>
              <font-awesome-icon
                :icon="['fas', 'question-circle']"
                class="ml-1 text-10 cursor-pointer"
              />
            </sup>
          </nftmx-tooltip>
        </div>
        <div>
          <button
            class="bg-black text-white font-press text-sm px-13 h-15 hover:bg-tertiary-900 transition"
            @click="openConnectWalletModal"
          >
            CONNECT WALLET
          </button>
        </div>
      </div>
    </div>
  </div>
  <body-container>
    <div v-if="userId" class="text-center text-white mt-9">
      <span class="text-3xl font-press">Multilevel Ownership OTC</span>
      <p class="mt-6">
        List your NFTs and add yourself into the multilevel ownership or buyout
        other owners and take over their level position
      </p>
    </div>
    <div v-if="userId" class="mt-15 mb-12.75">
      <div
        v-if="multilevelContracts.length > 0"
        class="text-left font-ibm text-xs border border-black bg-tertiary-800"
      >
        <nftmx-table>
          <nftmx-tbody>
            <nftmx-tr
              v-for="(contract, contractIndex) in multilevelContracts"
              :key="contractIndex"
            >
              <td class="p-0">
                <div>
                  <accordion :border="false" :value="false">
                    <template v-slot:caption>
                      <div
                        class="flex items-center px-6 py-3 font-ibm-medium text-xs gap-4 transition hover:bg-tertiary-300"
                      >
                        <nftmx-img
                          class="w-12 h-12 bg-black"
                          :src="contract.imageUrl"
                        />
                        <div>
                          {{ contract.name }}
                        </div>
                        <div
                          class="h-6 bg-black text-tertiary-400 ml-auto py-1 px-4"
                        >
                          {{ contract.nfts.length }} NFTs
                        </div>
                      </div>
                    </template>
                    <div class="text-left font-ibm text-xs bg-tertiary-900">
                      <nftmx-table>
                        <nftmx-thead>
                          <nftmx-tr>
                            <nftmx-th>
                              <div class="px-2">NFT</div>
                            </nftmx-th>
                            <nftmx-th>Status</nftmx-th>
                            <nftmx-th>Owners</nftmx-th>
                            <nftmx-th />
                          </nftmx-tr>
                        </nftmx-thead>
                        <nftmx-tbody>
                          <template
                            v-for="(nft, nftIndex) in contract.nfts"
                            :key="nftIndex"
                          >
                            <nftmx-tr
                              :class="[
                                'transition hover:bg-tertiary-200 cursor-pointer',
                                nft.open ? 'bg-tertiary-200' : '',
                              ]"
                              @click="showOwners(contractIndex, nftIndex)"
                            >
                              <td class="px-4 py-3.25">
                                <router-link
                                  :to="{
                                    name: 'asset',
                                    params: {
                                      chain: 'BSC-TESTNET',
                                      tokenAddress: nft.contract.address,
                                      tokenId: nft.tokenId,
                                    },
                                  }"
                                  target="_blank"
                                  class="flex items-center gap-4 w-max"
                                >
                                  <nftmx-img
                                    class="w-8 h-8 bg-black"
                                    :src="nft.imageUrl"
                                  />
                                  <span>
                                    {{ nft.name || "#" + nft.tokenId }}
                                  </span>
                                </router-link>
                              </td>
                              <td class="px-4 py-3.25">
                                <div :class="['text-red-900']">Sold</div>
                              </td>
                              <td class="px-4 py-3.25">
                                {{ nft.mlrContract.owners.length }}
                              </td>
                              <td class="w-16">
                                <div class="flex items-center justify-center">
                                  <font-awesome-icon
                                    v-if="!nft.open"
                                    :icon="['fas', 'sort-down']"
                                    class="text-sm -translate-y-1/3"
                                  />
                                  <font-awesome-icon
                                    v-if="nft.open"
                                    :icon="['fas', 'sort-up']"
                                    class="text-sm"
                                  />
                                </div>
                              </td>
                            </nftmx-tr>
                            <nftmx-tr v-if="nft.open">
                              <td class="p-0" colspan="4">
                                <div
                                  class="text-left font-ibm text-xs bg-tertiary-200"
                                >
                                  <nftmx-table>
                                    <nftmx-thead>
                                      <nftmx-tr>
                                        <nftmx-th>Ownership positions</nftmx-th>
                                        <nftmx-th class="whitespace-pre-line">
                                          Baseline ownership %
                                          <nftmx-tooltip
                                            text="Starting ownership percentage"
                                          >
                                            <sup>
                                              <font-awesome-icon
                                                :icon="[
                                                  'fas',
                                                  'question-circle',
                                                ]"
                                                class="text-xs cursor-pointer"
                                              />
                                            </sup>
                                          </nftmx-tooltip>
                                        </nftmx-th>
                                        <nftmx-th class="whitespace-pre-line">
                                          Actual ownership %
                                          <nftmx-tooltip
                                            text="Current ownership percentage"
                                          >
                                            <sup>
                                              <font-awesome-icon
                                                :icon="[
                                                  'fas',
                                                  'question-circle',
                                                ]"
                                                class="text-xs cursor-pointer"
                                              />
                                            </sup>
                                          </nftmx-tooltip>
                                        </nftmx-th>
                                        <nftmx-th>
                                          Ownership reward to date
                                        </nftmx-th>
                                        <nftmx-th>Buyout asking price</nftmx-th>
                                        <nftmx-th />
                                      </nftmx-tr>
                                    </nftmx-thead>
                                    <nftmx-tbody class="text-11">
                                      <nftmx-tr
                                        v-for="(owner, ownerIndex) in nft
                                          .mlrContract.owners"
                                        :key="ownerIndex"
                                        class="transition hover:bg-tertiary-100"
                                      >
                                        <td class="pl-3.5">
                                          <div class="flex gap-4 items-center">
                                            <span class="text-xl">
                                              &#8627;
                                            </span>
                                            <span>{{ ownerIndex + 1 }}</span>
                                          </div>
                                        </td>
                                        <td class="px-4 py-2.5">
                                          {{ owner.royalty }}%
                                        </td>
                                        <td class="px-4 py-2.5">
                                          {{ owner.realRoyalty }}%
                                        </td>
                                        <td class="px-4 py-2.5">
                                          <div class="flex items-center gap-2">
                                            <nftmx-img
                                              src="/images/logo/s-ethereum.png"
                                            />
                                            <div>6.5356</div>
                                            <div class="text-tertiary-400">
                                              [$6.5356]
                                            </div>
                                          </div>
                                        </td>
                                        <td class="px-4 py-2.5">
                                          <div class="flex items-center gap-2">
                                            <nftmx-img
                                              src="/images/logo/s-ethereum.png"
                                            />
                                            <div>
                                              {{ owner.buyout }}
                                            </div>
                                            <div class="text-tertiary-400">
                                              [$6.5356]
                                            </div>
                                          </div>
                                        </td>
                                        <td
                                          class="px-4 py-2.25 text-red-700 w-10"
                                        >
                                          <button
                                            v-if="
                                              walletAddress !==
                                              owner.user?.walletAddress
                                            "
                                            class="h-7.25 border-2 border-primary-900 hover:bg-primary-900 transition font-press text-10 text-primary-900 hover:text-white px-15 shadow-[0_0px_8px_0px_rgb(0_0_0_/_0.1),_0_0px_0px_0px_rgb(0_0_0_/_0.1);] shadow-[#19cb5866]"
                                            @click="
                                              openBuyout(contract, nft, owner)
                                            "
                                          >
                                            BUYOUT
                                          </button>
                                          <div v-else class="w-45.5 text-white">
                                            My ownership
                                          </div>
                                        </td>
                                      </nftmx-tr>
                                    </nftmx-tbody>
                                  </nftmx-table>
                                </div>
                              </td>
                            </nftmx-tr>
                          </template>
                        </nftmx-tbody>
                      </nftmx-table>
                    </div>
                  </accordion>
                </div>
              </td>
            </nftmx-tr>
          </nftmx-tbody>
        </nftmx-table>
      </div>
      <div
        v-else
        class="flex justify-center items-center text-tertiary-400 py-20"
      >
        {{ loading ? "Loading..." : "No Multilevel NFTs" }}
      </div>
    </div>
  </body-container>
  <buyout-modal
    v-if="selectedContract && selectedNft && selectedOwner"
    v-model="buyoutModal"
    :contract="selectedContract"
    :nft="selectedNft"
    :owner="selectedOwner"
    @buyout="buyout"
  />
</template>

<style scoped>
.h-multilevel {
  height: calc(100vh - 240px);
}
</style>

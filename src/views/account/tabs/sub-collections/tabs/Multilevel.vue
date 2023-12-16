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
import usersService from "@/core/services/market/users.service";
import Web3 from "web3/dist/web3.min.js";
import NftmxTooltip from "@/core/components/basic/NftmxTooltip.vue";

const props = defineProps({
  account: Object,
});

const _account = computed(() => props.account);
const buyoutModal = ref(false);
const walletPop = ref(false);
const store = useStore();
const userId = computed(() => store.getters["auth/userId"]);
const walletAddress = computed(() => store.getters["auth/walletAddress"]);
const multilevelContracts = ref([]);
const selectedContract = ref();
const selectedNft = ref();
const selectedOwner = ref();

const openBuyout = (contract, nft, owner) => {
  selectedContract.value = contract;
  selectedNft.value = nft;
  selectedOwner.value = owner;
  buyoutModal.value = true;
};

onMounted(() => {
  usersService
    .mlrTokens({
      type: "DERIVATIVE",
    })
    .then((res) => {
      multilevelContracts.value = res.data;
    })
    .catch((err) => {
      console.log("err: ", err);
    });
});

const showOwners = (contractIndex, nftIndex) => {
  multilevelContracts.value[contractIndex].nfts[nftIndex].open =
    !multilevelContracts.value[contractIndex].nfts[nftIndex].open;
};
</script>
<template>
  <div v-if="userId" class="py-30">
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
                          <nftmx-th>Collections</nftmx-th>
                          <nftmx-th>
                            <div class="px-2">Item</div>
                          </nftmx-th>
                          <nftmx-th>Status</nftmx-th>
                          <nftmx-th>My baseline ownership %</nftmx-th>
                          <nftmx-th>My actual ownership %</nftmx-th>
                          <nftmx-th>My ownership reward to date</nftmx-th>
                          <nftmx-th>My buyout asking price</nftmx-th>
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
                            <nftmx-td>
                              <span class="text-xl"> &#8627; </span>
                            </nftmx-td>
                            <td class="px-4 py-3.25">
                              <div class="flex items-center gap-4 w-max">
                                <nftmx-img
                                  class="w-8 h-8 bg-black"
                                  :src="nft.imageUrl"
                                />
                                <span>
                                  {{ nft.name || "#" + nft.tokenId }}
                                </span>
                              </div>
                            </td>
                            <td class="px-4 py-3.25">
                              <div :class="['text-red-900']">Sold</div>
                            </td>
                            <td class="px-4 py-3.25">
                              {{ nft.mlrContract.owners[0].royalty }}%
                            </td>
                            <nftmx-td>
                              {{ nft.mlrContract.owners[0].realRoyalty }}%
                            </nftmx-td>
                            <nftmx-td class="text-tertiary-400">
                              <font-awesome-icon :icon="['fab', 'ethereum']" />
                              <span class="text-white"> 6.5635 </span>
                              <span> [${{ (9856.36).toLocaleString() }}] </span>
                            </nftmx-td>
                            <nftmx-td class="text-tertiary-400">
                              <font-awesome-icon :icon="['fab', 'ethereum']" />
                              <span class="text-white"> 1.1256 </span>
                              <span> [${{ (1000).toLocaleString() }}] </span>
                            </nftmx-td>
                            <nftmx-td class="text-tertiary-400">
                              <font-awesome-icon :icon="['fas', 'edit']" />
                            </nftmx-td>
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
      No Multilevel NFTs
    </div>
  </div>
</template>

<style scoped>
.h-multilevel {
  height: calc(100vh - 240px);
}
</style>

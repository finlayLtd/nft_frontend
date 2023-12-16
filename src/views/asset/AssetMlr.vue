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
import BuyoutModal from "@/core/components/multilevel/BuyoutModal.vue";
import { roundTo, getChainKey } from "@/core/utils/common";
import { useRoute } from "vue-router";
import AccordionPagination from "@/core/components/accordion/AccordionPagination.vue";
import mlrService from "@/core/services/market/mlr.service";
import NftmxTooltip from "@/core/components/basic/NftmxTooltip.vue";
import NftmxButton from "@/core/components/basic/NftmxButton.vue";

const props = defineProps({
  asset: Object,
});

const buyoutModal = ref(false);
const store = useStore();
const route = useRoute();
const tokenAddress = route.params.tokenAddress.toLowerCase();
const tokenId = route.params.tokenId.toLowerCase();
const chain = route.params.chain.toUpperCase();
const chainKey = getChainKey(chain);
const walletAddress = computed(() => store.getters["auth/walletAddress"]);
const buyoutOwner = ref();
const coinPrice = computed(() =>
  store.getters["market/getCoinPrice"](chainKey)
);
const currency = ref("ETH");
const mlrOwners = ref([]);
const page = ref(1);
const count = ref(0);

const openBuyout = (item) => {
  buyoutModal.value = true;
  buyoutOwner.value = item;
};
const buyout = () => {
  buyoutOwner.value.user = store.state.user;
};
const getNftMlrOwners = (page, limit) => {
  mlrService
    .getNftMlrOwners({
      chain,
      tokenAddress,
      tokenId,
      offset: page * limit,
    })
    .then((res) => {
      count.value = res.data.count;
      mlrOwners.value = res.data.mlrOwners;
    });
};
const selectPage = (val) => {
  if (page.value === val) return;
  page.value = val;
  getNftMlrOwners(val - 1, 10);
};
const openConnectWalletModal = () => {
  store.commit("app/OPEN_CONNECT_WALLET_MODAL");
};
onMounted(() => {
  getNftMlrOwners(0, 10);
});
</script>

<template>
  <div>
    <div
      class="border border-black bg-tertiary-800 divide-y divide-black overflow-hidden"
    >
      <accordion :border="false">
        <template v-slot:caption>
          <div class="flex justify-between">
            <div
              class="flex items-center text-white px-6 h-14.5 text-lg font-ibm-bold"
            >
              <span> Buyout ownership positions for Play Quiet #10/10 </span>
              <div
                class="h-5 border-l border-l-black border-r border-r-tertiary-700 ml-5.5 mr-4"
              />
              <div class="w-7 h-7 fill-white">
                <svg viewBox="0 0 28 28">
                  <path
                    class="st0"
                    d="M25.42,14.53c0-0.32-0.19-0.61-0.49-0.74l-3.02-1.26l3.02-1.26c0.3-0.12,0.49-0.42,0.49-0.74
	c0-0.32-0.19-0.61-0.49-0.74l-10.7-4.47c-0.2-0.08-0.42-0.08-0.62,0L2.91,9.79c-0.3,0.12-0.49,0.42-0.49,0.74
	c0,0.32,0.19,0.61,0.49,0.74l3.02,1.26l-3.02,1.26c-0.3,0.12-0.49,0.42-0.49,0.74c0,0.32,0.19,0.61,0.49,0.74l3.02,1.26l-3.02,1.26
	c-0.3,0.12-0.49,0.42-0.49,0.74c0,0.32,0.19,0.61,0.49,0.74l10.7,4.47c0.1,0.04,0.2,0.06,0.31,0.06s0.21-0.02,0.31-0.06l10.7-4.47
	c0.3-0.12,0.49-0.42,0.49-0.74c0-0.32-0.19-0.61-0.49-0.74l-3.02-1.26l3.02-1.26C25.23,15.14,25.42,14.85,25.42,14.53z M13.92,6.92
	l8.63,3.61l-3.02,1.26c0,0,0,0,0,0l-5.61,2.34l-5.61-2.34c0,0,0,0,0,0l-3.02-1.26L13.92,6.92z M22.55,18.53l-8.63,3.61l-8.63-3.61
	L8,17.4l5.61,2.34c0.1,0.04,0.2,0.06,0.31,0.06s0.21-0.02,0.31-0.06l5.61-2.34L22.55,18.53z M19.53,15.79
	C19.53,15.79,19.53,15.79,19.53,15.79l-5.61,2.34l-5.61-2.34c0,0,0,0,0,0l-3.02-1.26L8,13.4l5.61,2.34c0.1,0.04,0.2,0.06,0.31,0.06
	s0.21-0.02,0.31-0.06l5.61-2.34l2.71,1.13L19.53,15.79z"
                  />
                </svg>
              </div>
              <span class="ml-2">
                {{ asset.mlrContract?.totalOwnership || 0 }}%
              </span>
            </div>
            <div
              class="flex items-center gap-3 text-lg text-black font-ibm-bold"
            >
              <font-awesome-icon
                v-if="chain === 'ETHEREUM'"
                :icon="['fab', 'ethereum']"
                :class="[
                  currency === 'ETH'
                    ? 'text-primary-900'
                    : 'transition hover:text-primary-900',
                  'cursor-pointer',
                ]"
                @click.stop
                @click="currency = 'ETH'"
              />
              <div
                v-if="chain === 'BSC-TESTNET'"
                :class="[
                  currency === 'ETH'
                    ? 'fill-primary-900'
                    : 'transition hover:fill-primary-900',
                  'w-4 h-4',
                ]"
                @click.stop
                @click="currency = 'ETH'"
              >
                <svg viewBox="0 0 24 24">
                  <title>Binance</title>
                  <path
                    d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                  />
                </svg>
              </div>
              <div
                class="h-5 border-l border-l-black border-r border-r-tertiary-700 my-3.5"
              />
              <span
                :class="[
                  currency === 'DOLAR'
                    ? 'text-primary-900'
                    : 'transition hover:text-primary-900',
                  'cursor-pointer',
                ]"
                @click.stop
                @click="currency = 'DOLAR'"
              >
                $
              </span>
            </div>
          </div>
        </template>
        <div class="text-left font-ibm text-xs bg-tertiary-800">
          <nftmx-table v-if="mlrOwners.length > 0">
            <nftmx-thead>
              <nftmx-tr>
                <nftmx-th>
                  <div class="px-2">Ownership positions</div>
                </nftmx-th>
                <nftmx-th>
                  Baseline ownership %
                  <nftmx-tooltip text="Starting ownership percentage">
                    <sup>
                      <font-awesome-icon
                        :icon="['fas', 'question-circle']"
                        class="text-xs cursor-pointer"
                      />
                    </sup>
                  </nftmx-tooltip>
                </nftmx-th>
                <nftmx-th>
                  Actual ownership %
                  <nftmx-tooltip text="Current ownership percentage">
                    <sup>
                      <font-awesome-icon
                        :icon="['fas', 'question-circle']"
                        class="text-xs cursor-pointer"
                      />
                    </sup>
                  </nftmx-tooltip>
                </nftmx-th>
                <nftmx-th> Ownership reward to date </nftmx-th>
                <nftmx-th>Buyout asking price</nftmx-th>
                <nftmx-th />
              </nftmx-tr>
            </nftmx-thead>
            <nftmx-tbody>
              <nftmx-tr
                v-for="(item, index) in mlrOwners"
                :key="index"
                class="transition hover:bg-tertiary-300"
              >
                <nftmx-td class="py-1.5">
                  {{ index + 1 }}
                </nftmx-td>
                <nftmx-td class="py-1.5">{{ item.royalty }}%</nftmx-td>
                <nftmx-td class="py-1.5">{{ item.realRoyalty }}%</nftmx-td>
                <nftmx-td class="py-1.5">
                  <div class="flex items-center gap-0.5">
                    <font-awesome-icon
                      v-if="currency === 'ETH' && chain === 'ETHEREUM'"
                      :icon="['fab', 'ethereum']"
                    />
                    <div
                      v-if="currency === 'ETH' && chain === 'BSC-TESTNET'"
                      class="w-4 h-4 fill-white"
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
                    <span v-if="currency === 'DOLAR'">$</span>
                    <span>
                      {{
                        currency === "ETH"
                          ? item.buyout
                          : roundTo(item.buyout * coinPrice)
                      }}
                    </span>
                  </div>
                </nftmx-td>
                <nftmx-td class="py-1.5">
                  <div class="flex items-center gap-0.5">
                    <font-awesome-icon
                      v-if="currency === 'ETH' && chain === 'ETHEREUM'"
                      :icon="['fab', 'ethereum']"
                    />
                    <div
                      v-if="currency === 'ETH' && chain === 'BSC-TESTNET'"
                      class="w-4 h-4 fill-white"
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
                    <span v-if="currency === 'DOLAR'">$</span>
                    <span>
                      {{
                        currency === "ETH"
                          ? item.buyout
                          : roundTo(item.buyout * coinPrice)
                      }}
                    </span>
                  </div>
                </nftmx-td>
                <nftmx-td class="w-40 py-2">
                  <nftmx-button
                    v-if="!walletAddress"
                    color="red"
                    label="CONNECT WALLET"
                    class="font-press w-47 text-10"
                    @click="openConnectWalletModal"
                    h="xs"
                    outline
                    textColor="white"
                  />
                  <nftmx-button
                    v-else-if="walletAddress !== item.user?.walletAddress"
                    color="primary"
                    label="BUYOUT"
                    class="font-press w-47 text-10"
                    @click="openBuyout(item)"
                    h="xs"
                    outline
                    textColor="white"
                  />
                  <span v-else class=""> My ownership </span>
                </nftmx-td>
              </nftmx-tr>
            </nftmx-tbody>
          </nftmx-table>
          <div
            v-else
            class="font-ibm text-2xl text-white h-40 flex items-center justify-center"
          >
            No ownership position yet
          </div>
        </div>
      </accordion>
    </div>
    <div class="flex justify-between">
      <div class="text-primary-900 text-xs font-ibm-medium mt-4">
        <router-link to="/multilevel" class="cursor-pointer">
          Search more ownership for other NFTs in the OTC
        </router-link>
      </div>
      <div
        class="flex justify-end text-11 text-tertiary-400 mt-2 gap-4 items-center"
      >
        <span> Page </span>
        <div class="relative w-20 h-8">
          <accordion-pagination class="bg-black">
            <template v-slot:caption>
              <div class="text-11 flex justify-between">
                <span> {{ page }} </span>
              </div>
            </template>
            <div class="text-left font-ibm text-11 max-h-30 overflow-auto">
              <div
                v-for="i in Math.ceil(count / 10)"
                :key="i"
                class="py-1 cursor-pointer transition hover:text-white"
                @click="selectPage(i)"
              >
                {{ i }}
              </div>
            </div>
          </accordion-pagination>
        </div>
        <span>
          result {{ (page - 1) * 10 + 1 }}-{{ page * 10 }} of {{ count }}
        </span>
      </div>
    </div>
    <buyout-modal
      v-if="asset && buyoutOwner"
      v-model="buyoutModal"
      :asset="asset"
      :owner="buyoutOwner"
      @buyout="buyout"
    />
  </div>
</template>

<style scoped>
.h-multilevel {
  height: calc(100vh - 240px);
}
</style>

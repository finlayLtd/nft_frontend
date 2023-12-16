<script setup>
import { useStore } from "vuex";
import {
  themeConfig,
  BSC_TESTNET_PACKABLE_CONTRACT_ADDRESS,
  NULL_ADDRESS,
} from "@/core/config/constant";
import NftmxLineChart from "@/core/components/chart/NftmxLineChart.vue";
import Accordion from "@/core/components/accordion/BasicAccordion.vue";
import AccordionPagination from "@/core/components/accordion/AccordionPagination.vue";
import NftmxTable from "@/core/components/table/NftmxTable.vue";
import NftmxThead from "@/core/components/table/NftmxThead.vue";
import NftmxTh from "@/core/components/table/NftmxTh.vue";
import NftmxTbody from "@/core/components/table/NftmxTbody.vue";
import NftmxTd from "@/core/components/table/NftmxTd.vue";
import NftmxTr from "@/core/components/table/NftmxTr.vue";
import NftmxWalletAddress from "@/core/components/blockchain-address/NftmxWalletAddress.vue";
import NftmxWalletAddressPop from "@/core/components/blockchain-address/NftmxWalletAddressPop.vue";
import { computed, onMounted, ref, watch, watchEffect } from "vue";
import historyService from "@/core/services/market/history.service";
import {
  getDateAgo,
  roundTo,
  getChainKey,
  shortenHash,
  shortenAddress,
} from "@/core/utils/common";
import { useRoute } from "vue-router";

const store = useStore();
const route = useRoute();
const tokenAddress = route.params.tokenAddress.toLowerCase();
const tokenId = route.params.tokenId.toLowerCase();
const chain = route.params.chain.toUpperCase();
const chainKey = getChainKey(chain);
const history = ref([]);
const orders = ref([]);
const coinPrice = computed(() =>
  store.getters["market/getCoinPrice"](chainKey)
);
const currency = ref("ETH");
const page = ref(1);
const count = ref(0);

const getNftHistory = (page, limit) => {
  historyService
    .getNftHistory({
      chain,
      tokenAddress,
      tokenId,
      offset: page * limit,
    })
    .then((res) => {
      count.value = res.data.count;
      history.value = res.data.history;
    });
};
const selectPage = (val) => {
  if (page.value === val) return;
  page.value = val;
  getNftHistory(val - 1, 10);
};
onMounted(() => {
  getNftHistory(0, 10);
});
</script>

<template>
  <div>
    <accordion class="overflow-hidden">
      <template v-slot:caption>
        <div class="flex justify-between pr-8">
          <div class="flex items-center">
            <div class="text-lg font-ibm-bold pt-4 pb-3.5">Ledger</div>
            <a
              target="_blank"
              :href="`/asset-ledger/${chain}/${tokenAddress}/${tokenId}`"
            >
              <font-awesome-icon
                :icon="['fas', 'external-link-alt']"
                class="text-primary-700 hover:text-primary-900 transition text-sm cursor-pointer ml-8 mt-1"
              />
            </a>
          </div>
          <div class="flex items-center gap-3 text-lg text-black font-ibm-bold">
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
      <div class="text-left font-ibm text-xs">
        <nftmx-table>
          <nftmx-thead>
            <nftmx-tr>
              <nftmx-th first>Event</nftmx-th>
              <nftmx-th>Last Value</nftmx-th>
              <nftmx-th>Protection period (Days)</nftmx-th>
              <nftmx-th>Slippage fee</nftmx-th>
              <nftmx-th>From</nftmx-th>
              <nftmx-th>To</nftmx-th>
              <nftmx-th>Date</nftmx-th>
              <nftmx-th>Txn Hash</nftmx-th>
            </nftmx-tr>
          </nftmx-thead>
          <nftmx-tbody>
            <nftmx-tr
              v-for="(item, index) in history"
              :key="index"
              class="hover:bg-tertiary-300 transition cursor-pointer"
            >
              <nftmx-td first>
                {{
                  item.event === "0"
                    ? !item.from || item.from.walletAddress === NULL_ADDRESS
                      ? item.nft &&
                        item.nft.contract.address ===
                          BSC_TESTNET_PACKABLE_CONTRACT_ADDRESS
                        ? "Pack"
                        : "Created"
                      : !item.to || item.to.walletAddress === NULL_ADDRESS
                      ? item.nft &&
                        item.nft.contract.address ===
                          BSC_TESTNET_PACKABLE_CONTRACT_ADDRESS
                        ? "Unpack"
                        : "Burn"
                      : "Transferred"
                    : item.event === "1"
                    ? "List"
                    : item.event === "2"
                    ? "Sold"
                    : "Canceled"
                }}
              </nftmx-td>
              <nftmx-td>
                <div v-if="item.price > 0" class="flex items-center gap-0.5">
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
                        ? item.price
                        : roundTo(item.price * coinPrice)
                    }}
                  </span>
                </div>
              </nftmx-td>
              <nftmx-td>{{ item.downsidePeriod || "-" }}</nftmx-td>
              <nftmx-td>
                {{ item.protectionRate ? 100 - item.protectionRate : "-" }}
              </nftmx-td>
              <nftmx-td>
                <div
                  v-if="item.from && item.from.walletAddress"
                  class="text-primary-900"
                >
                  <span v-if="item.from.walletAddress === NULL_ADDRESS">
                    Null address
                  </span>
                  <a
                    v-else
                    target="_blank"
                    :href="'/account/' + item.from.walletAddress"
                  >
                    {{
                      item.from.name || shortenAddress(item.from.walletAddress)
                    }}
                  </a>
                </div>
              </nftmx-td>
              <nftmx-td>
                <div
                  v-if="item.to && item.to.walletAddress"
                  class="text-primary-900"
                >
                  <span v-if="item.to.walletAddress === NULL_ADDRESS">
                    Null address
                  </span>
                  <a
                    v-else
                    target="_blank"
                    :href="'/account/' + item.to.walletAddress"
                  >
                    {{ item.to.name || shortenAddress(item.to.walletAddress) }}
                  </a>
                </div>
              </nftmx-td>
              <nftmx-td>
                {{ getDateAgo(item.timestamp) }}
              </nftmx-td>
              <nftmx-td>
                <a
                  v-if="item.tx"
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
              </nftmx-td>
            </nftmx-tr>
          </nftmx-tbody>
        </nftmx-table>
      </div>
    </accordion>
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
</template>

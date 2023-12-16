<script setup>
import BasicAccordion from "@/core/components/accordion/BasicAccordion.vue";
import NftmxTable from "@/core/components/table/NftmxTable.vue";
import NftmxThead from "@/core/components/table/NftmxThead.vue";
import NftmxTh from "@/core/components/table/NftmxTh.vue";
import NftmxTbody from "@/core/components/table/NftmxTbody.vue";
import NftmxTd from "@/core/components/table/NftmxTd.vue";
import NftmxTr from "@/core/components/table/NftmxTr.vue";
import NftmxWalletAddressPop from "@/core/components/blockchain-address/NftmxWalletAddressPop.vue";
import { ref, onMounted, computed, watch, onBeforeUnmount } from "vue";
import NftmxButton from "@/core/components/basic/NftmxButton.vue";
import marketService from "@/core/services/market.service";
import { useStore } from "vuex";
import NftmxImg from "@/core/components/basic/NftmxImg.vue";
import NftmxWalletAddress from "@/core/components/blockchain-address/NftmxWalletAddress.vue";
import {
  NULL_ADDRESS,
  BSC_TESTNET_PACKABLE_CONTRACT_ADDRESS,
} from "@/core/config/constant";
import historyService from "@/core/services/market/history.service";
import { useRoute } from "vue-router";
import {
  getDateAgo,
  roundTo,
  getChainKey,
  shortenHash,
  shortenAddress,
} from "@/core/utils/common";
import AccordionPagination from "@/core/components/accordion/AccordionPagination.vue";

const props = defineProps({
  account: Object,
});

const _account = computed(() => props.account);
const store = useStore();
const route = useRoute();
const history = ref([]);
const page = ref(1);
const count = ref(0);
const coinPrice = computed(() => store.state.market.coinPrice);
const loading = ref(false);
const intervalId = ref(null);

const getUserHistory = (page, limit) => {
  loading.value = true;
  historyService
    .getUserHistory({
      walletAddress: _account.value.walletAddress,
      offset: page * limit,
      limit,
    })
    .then((res) => {
      count.value = res.data.count;
      history.value = res.data.history;
      updateDateAgo();
    })
    .finally(() => {
      loading.value = false;
    });
};
const updateDateAgo = () => {
  history.value.forEach((record) => {
    if (record.timestamp) {
      const date = new Date(record.timestamp);
      const now = new Date();
      const diff = now - date;
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      const weeks = Math.floor(days / 7);
      const months = Math.floor(days / 30);
      const years = Math.floor(days / 365);

      if (years > 0) {
        record.dateAgo = years + " years ago";
      } else if (months > 0) {
        record.dateAgo = months + " months ago";
      } else if (weeks > 0) {
        record.dateAgo = weeks + " weeks ago";
      } else if (days > 0) {
        record.dateAgo = days + " days ago";
      } else if (hours > 0) {
        record.dateAgo = hours + " hours ago";
      } else {
        record.dateAgo = minutes + " minutes ago";
      }
    }
  });
};

const selectPage = (val) => {
  if (page.value === val) return;
  page.value = val;
  getUserHistory(val - 1, 10);
};
watch(_account, (val) => {
  if (val) {
    getUserHistory(0, 10);
  }
});
onMounted(() => {
  if (_account.value) {
    getUserHistory(0, 10);
  }
  intervalId.value = setInterval(() => {
    updateDateAgo();
  }, 60000);
});
onBeforeUnmount(() => {
  if (intervalId.value) {
    clearInterval(intervalId.value);
  }
});
const getStatus = (status) => {
  switch (status) {
    case "0":
      return "List";
    case "1":
      return "Bidded";
    case "2":
      return "Downside protection";
    case "3":
      return "Completed";
    default:
      return "Canceled";
  }
};
</script>

<template>
  <div class="xl:pt-30 pb-22 text-white">
    <div
      class="border border-black divide-y divide-black bg-tertiary-800 text-left"
    >
      <div class="pt-4 pb-3.5 px-5.5 text-lg font-ibm-bold">
        Transaction History
      </div>
      <div
        v-if="loading"
        class="h-60 text-white text-2xl flex items-center justify-center"
      >
        Loading...
      </div>
      <div v-else-if="history.length > 0" class="text-left font-ibm text-xs">
        <nftmx-table
          :limitHeight="false"
          class="text-11 tracking-wider leading-4"
        >
          <nftmx-thead>
            <nftmx-tr>
              <nftmx-th class="text-left">Event</nftmx-th>
              <nftmx-th class="text-left">NFT</nftmx-th>
              <nftmx-th class="text-left">NFT price</nftmx-th>
              <nftmx-th class="text-left">Slippage</nftmx-th>
              <nftmx-th class="text-left">Period protection</nftmx-th>
              <nftmx-th class="text-left">Staking leverage</nftmx-th>
              <nftmx-th class="text-left">From</nftmx-th>
              <nftmx-th class="text-left">To</nftmx-th>
              <nftmx-th class="text-left">Date</nftmx-th>
              <nftmx-th class="text-left">Txn Hash</nftmx-th>
            </nftmx-tr>
          </nftmx-thead>
          <nftmx-tbody>
            <nftmx-tr
              v-for="(item, index) in history"
              :key="index"
              class="hover:bg-tertiary-300 transition cursor-pointer"
            >
              <nftmx-td>
                {{
                  item.event === "0"
                    ? !item.from || item.from.walletAddress === NULL_ADDRESS
                      ? "Created"
                      : item.from.walletAddress ===
                        BSC_TESTNET_PACKABLE_CONTRACT_ADDRESS
                      ? "Unpack"
                      : item.to?.walletAddress ===
                        BSC_TESTNET_PACKABLE_CONTRACT_ADDRESS
                      ? "Pack"
                      : "Transferred"
                    : item.event === "1"
                    ? "List"
                    : item.event === "2"
                    ? "Sold"
                    : "Canceled"
                }}
              </nftmx-td>
              <nftmx-td>
                <a
                  target="_blank"
                  :href="`/asset/${item.nft.contract.chain}/${item.nft.contract.address}/${item.nft.tokenId}`"
                  class="flex gap-4.5 items-center"
                >
                  <div class="w-11 h-11">
                    <nftmx-img
                      :src="item.nft ? item.nft.imageUrl : ''"
                      class="h-full w-full object-cover bg-black"
                    />
                  </div>
                  <div>
                    <span>
                      {{ item.nft.name || "#" + item.nft.tokenId }}
                    </span>
                  </div>
                </a>
              </nftmx-td>
              <nftmx-td>
                <div v-if="item.price > 0">
                  <div class="flex items-center gap-1">
                    <font-awesome-icon
                      v-if="item.nft.contract.chain === 'ETHEREUM'"
                      :icon="['fab', 'ethereum']"
                    />
                    <div
                      v-if="item.nft.contract.chain === 'BSC-TESTNET'"
                      class="w-3 h-3 fill-white"
                    >
                      <svg viewBox="0 0 24 24">
                        <path
                          d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                        />
                      </svg>
                    </div>
                    <span>
                      {{ item.price }}
                    </span>
                  </div>
                  <div class="text-tertiary-400">
                    <span>[$</span>
                    <span>
                      {{
                        roundTo(
                          item.price *
                            coinPrice[getChainKey(item.nft.contract.chain)]
                        )
                      }}
                    </span>
                    <span>]</span>
                  </div>
                </div>
              </nftmx-td>
              <nftmx-td>
                <div v-if="item.price > 0">
                  {{
                    isNaN(item.protectionRate)
                      ? "-"
                      : 100 - item.protectionRate
                  }}%
                </div>
              </nftmx-td>
              <nftmx-td>
                <div v-if="item.price > 0">
                  {{
                    isNaN(item.protectionTime)
                      ? "-"
                      : Math.round(item.protectionTime / 86400)
                  }}
                </div>
              </nftmx-td>
              <nftmx-td>
                {{ item.price > 0 ? (item.staking ? "Yes" : "No") : "-" }}
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
                    class="flex items-center gap-3"
                  >
                    <nftmx-img
                      :src="item.from && item.from.profile_img"
                      class="h-6 w-6 object-cover bg-black"
                    />
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
                    class="flex items-center gap-3"
                  >
                    <nftmx-img
                      :src="item.to && item.to.profile_img"
                      class="h-6 w-6 object-cover bg-black"
                    />
                    {{ item.to.name || shortenAddress(item.to.walletAddress) }}
                  </a>
                </div>
              </nftmx-td>
              <nftmx-td>{{ item.dateAgo }}</nftmx-td>
              <nftmx-td class="text-secondary-600">
                <a
                  v-if="item.tx"
                  target="_blank"
                  :href="
                    (item.nft.contract.chain === 'ETHEREUM'
                      ? 'https://etherscan.io/tx/'
                      : 'https://testnet.bscscan.com/tx/') + item.tx
                  "
                >
                  {{ shortenHash(item.tx) }}
                </a>
              </nftmx-td>
            </nftmx-tr>
          </nftmx-tbody>
        </nftmx-table>
      </div>
      <div
        v-else
        class="h-60 text-white text-2xl flex items-center justify-center"
      >
        No history found
      </div>
    </div>
    <div
      class="flex justify-end text-11 text-tertiary-400 mt-2 gap-4 items-center"
    >
      <span> Page </span>
      <div class="relative w-20 h-8 z-30">
        <accordion-pagination class="bg-tertiary-800">
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

<style scoped>
.h-multilevel {
  height: calc(100vh - 240px);
}
</style>

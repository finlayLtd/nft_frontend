<script setup>
import DvcSearch from "./DvcSearch.vue";
import BodyContainer from "@/core/container/BodyContainer.vue";
import NftmxTable from "@/core/components/table/NftmxTable.vue";
import NftmxThead from "@/core/components/table/NftmxThead.vue";
import NftmxTh from "@/core/components/table/NftmxTh.vue";
import NftmxTbody from "@/core/components/table/NftmxTbody.vue";
import NftmxTd from "@/core/components/table/NftmxTd.vue";
import NftmxTr from "@/core/components/table/NftmxTr.vue";
import NftmxWalletAddress from "@/core/components/blockchain-address/NftmxWalletAddress.vue";
import NftmxWalletAddressPop from "@/core/components/blockchain-address/NftmxWalletAddressPop.vue";
import NftmxButton from "@/core/components/basic/NftmxButton.vue";
import SectionButton from "@/core/components/buttons/SectionButton.vue";
import Accordion from "@/core/components/accordion/AccordionInTable.vue";
import NftmxImg from "@/core/components/basic/NftmxImg.vue";
import { computed, onBeforeMount, onBeforeUnmount, onMounted, ref } from "vue";
import marketService from "../../core/services/market.service";
import { CHAIN_ROUTES } from "../../core/config/constant";
import NftmxTooltip from "../../core/components/basic/NftmxTooltip.vue";
import { capitalize } from "lodash";
import { useStore } from "vuex";
import BackDvcModal from "./BackDvcModal.vue";
import { addLiquidity, withdraw } from "@/core/utils/contracts/dvc.utils.js";
import { useToast } from "vue-toastification";
import Web3 from "web3/dist/web3.min.js";
import { useRoute } from "vue-router";
import { io } from "socket.io-client";
import {
  formatAMPM,
  getDateAgo,
  shortenHash,
  roundTo,
} from "@/core/utils/common";
import RedeemModal from "./RedeemModal.vue";

const socket = io(import.meta.env.VITE_APP_SERVER_URL);
const store = useStore();
const toast = useToast();
const route = useRoute();
const userId = computed(() => store.getters["auth/userId"]);
const dvcs = ref([]);
const showRows = ref([]);
const backModalOpen = ref(false);
const backDvc = ref(null);
const loading = ref(false);
const coinPrice = computed(() => store.state.market.coinPrice.BSC_TESTNET);
const searchOption = ref();
const selectedDvc = ref();
const openRedeemModal = ref(false);

const formatDate = (val) => {
  const date = new Date(val);
  return (
    date.toLocaleString("default", { month: "long" }) +
    " " +
    date.getDate() +
    ", " +
    date.getFullYear() +
    " UTC " +
    formatAMPM(date)
  );
};
const checkBacker = (dvc) => {
  const backer = dvc.backers.find((item) => item.user.id === userId.value);
  if (backer && backer.lp > 0) {
    return true;
  }
  return false;
};
const showRow = (index) => {
  const indexOf = showRows.value.indexOf(index);
  if (indexOf > -1) {
    showRows.value.splice(indexOf, 1);
  } else {
    showRows.value.push(index);
  }
};
const openBackDvc = (dvc) => {
  backDvc.value = dvc;
  backModalOpen.value = true;
};
const searchDvcs = (option) => {
  searchOption.value = option;
  loading.value = true;
  marketService
    .searchDvcs(option)
    .then((res) => {
      dvcs.value = res.data;
    })
    .finally(() => {
      loading.value = false;
    });
};
onBeforeMount(() => {
  socket.on(`dvc-updated`, () => {
    searchDvcs(searchOption.value);
  });
});
onMounted(() => {
  searchDvcs();
});
onBeforeUnmount(() => {
  socket.removeAllListeners();
});
</script>

<template>
  <dvc-search @search-dvcs="searchDvcs" />
  <body-container>
    <div class="font-press text-3xl text-white text-center mt-9.5">
      Decentralized Venture Capital Fund List
    </div>
    <div class="text-white mt-5.75">
      <p>
        Decentralized Venture Capital (DVC) is a fund with a potential no loss
        strategy built through smart contracts and the ability to add up to 100%
        liquidity protection. The DVC contract allows the creator to deploy
        funds or to act as a General Partner (GP) and welcome Limited Partners
        (LP) as backers to contribute funds to the DVC.
      </p>
      <br />
      <p>
        The DVC criteria is set by the creator, automatically triggering buying
        and selling of NFTs through specific, preselected investment criteria.
        Criteria options allow DVCs to set the Liquidity Protection amount
        offered, specific collection, maximum or minimum investment amount, and
        many other optional criteria like populatiry rate, volume, and more.
      </p>
    </div>
    <div class="mt-16">
      <nftmx-table
        :limitHeight="false"
        class="border border-black bg-tertiary-800 text-11 tracking-wider leading-4"
      >
        <nftmx-thead>
          <nftmx-tr>
            <nftmx-th>No</nftmx-th>
            <nftmx-th>DVC Fund Name</nftmx-th>
            <nftmx-th class="cursor-pointer">
              <div class="flex justify-between items-center gap-4">
                <div class="text-left">Investment type</div>
                <font-awesome-icon :icon="['fas', 'sort']" class="text-sm" />
              </div>
            </nftmx-th>
            <nftmx-th>
              <div class="flex justify-between items-center gap-4">
                <div class="text-left">Max Slippage</div>
                <font-awesome-icon :icon="['fas', 'sort']" class="text-sm" />
              </div>
            </nftmx-th>
            <nftmx-th>
              <div class="flex justify-between items-center gap-4">
                <div class="text-left">Leverage Staking</div>
                <font-awesome-icon :icon="['fas', 'sort']" class="text-sm" />
              </div>
            </nftmx-th>
            <nftmx-th>
              <div class="flex justify-between items-center gap-4">
                <div class="text-left">Minimum Investment</div>
                <font-awesome-icon :icon="['fas', 'sort']" class="text-sm" />
              </div>
            </nftmx-th>
            <nftmx-th>
              <div class="flex justify-between items-center gap-4">
                <div class="text-left">Maximum Investment</div>
                <font-awesome-icon :icon="['fas', 'sort']" class="text-sm" />
              </div>
            </nftmx-th>
            <nftmx-th>
              <div class="flex justify-between items-center gap-4">
                <span class="whitespace-nowrap">
                  Carry %
                  <nftmx-tooltip
                    class="whitespace-pre-line"
                    text="Carry, also known as carried interest, is the share of profits that a venture capital firm earns as a result of its investments. It is typically a percentage of the profits earned by the fund, and it is paid to the VC firm's partners or general partners as a performance incentive"
                  >
                    <sup>
                      <font-awesome-icon
                        :icon="['fas', 'question-circle']"
                        class="text-10 cursor-pointer"
                      />
                    </sup>
                  </nftmx-tooltip>
                </span>
                <font-awesome-icon :icon="['fas', 'sort']" class="text-sm" />
              </div>
            </nftmx-th>
            <nftmx-th>
              <div class="flex justify-between items-center gap-4">
                <div class="whitespace-nowrap">
                  Avg ROI
                  <nftmx-tooltip
                    class="whitespace-pre-line"
                    text="Average DVC ROI based on transfers and staking"
                  >
                    <sup>
                      <font-awesome-icon
                        :icon="['fas', 'question-circle']"
                        class="text-10 cursor-pointer"
                      />
                    </sup>
                  </nftmx-tooltip>
                </div>
                <font-awesome-icon :icon="['fas', 'sort']" class="text-sm" />
              </div>
            </nftmx-th>
            <nftmx-th>
              <div class="flex justify-between items-center gap-4">
                <div class="text-left">Backers allowed</div>
                <font-awesome-icon :icon="['fas', 'sort']" class="text-sm" />
              </div>
            </nftmx-th>
            <nftmx-th>
              <div class="flex justify-between items-center gap-4">
                <div>TVL</div>
                <font-awesome-icon :icon="['fas', 'sort']" class="text-sm" />
              </div>
            </nftmx-th>
            <nftmx-th>
              <div class="flex justify-between items-center gap-4">
                <div class="text-left">Your investment</div>
                <font-awesome-icon :icon="['fas', 'sort']" class="text-sm" />
              </div>
            </nftmx-th>
            <nftmx-th></nftmx-th>
          </nftmx-tr>
        </nftmx-thead>
        <nftmx-tbody>
          <template v-for="(dvc, index) in dvcs" :key="index">
            <nftmx-tr
              class="cursor-pointer hover:bg-tertiary-300 transition"
              @click="showRow(index)"
            >
              <nftmx-td class="w-0 text-center">
                {{ index + 1 }}
              </nftmx-td>
              <td class="px-4">
                <div class="flex gap-4 items-center">
                  <div class="w-11 h-11">
                    <nftmx-img
                      :src="dvc.logo"
                      class="object-cover object-center w-full h-full"
                    />
                  </div>
                  <div class="flex-1">
                    <div class="text-primary-900">{{ dvc.name }}</div>
                    <div class="text-tertiary-400 whitespace-nowrap">
                      {{
                        dvc.fundStruct === "OPEN"
                          ? "Open ended fund"
                          : "Close ended fund"
                      }}
                    </div>
                    <div class="text-secondary-600">Explore More</div>
                  </div>
                </div>
              </td>
              <nftmx-td>Most new</nftmx-td>
              <nftmx-td> {{ 100 - dvc.minBuyProtection }}% </nftmx-td>
              <nftmx-td> Yes </nftmx-td>
              <nftmx-td>${{ (dvc.minInvest * coinPrice).toFixed() }}</nftmx-td>
              <nftmx-td>
                {{
                  dvc.maxInvest > 0
                    ? "$" + (dvc.maxInvest * coinPrice).toFixed()
                    : "-"
                }}
              </nftmx-td>
              <nftmx-td>{{ dvc.feeValue }}%</nftmx-td>
              <nftmx-td>55%</nftmx-td>
              <nftmx-td>{{ dvc.maxBackers }}</nftmx-td>
              <nftmx-td> $5,210,512.55 </nftmx-td>
              <nftmx-td>
                <div class="text-primary-900">$105,563.56</div>
                <div class="text-secondary-600">Explore More</div>
              </nftmx-td>
              <nftmx-td>
                <nftmx-button
                  @click.stop
                  small
                  label="BECOME A BACKER"
                  color="primary"
                  class="font-press text-8 h-9.75"
                  @click="openBackDvc(dvc)"
                />
              </nftmx-td>
            </nftmx-tr>
            <nftmx-tr
              class="bg-tertiary-900"
              :style="{
                visibility: showRows.includes(index) ? 'visible' : 'collapse',
              }"
            >
              <td class="p-0" colspan="13">
                <div>
                  <div
                    class="grid grid-cols-3 divide-x divide-black py-7 font-ibm-medium text-xs gap-4"
                  >
                    <div class="flex">
                      <div class="px-4 py-10">
                        <nftmx-img src="/images/components/b_r_arrow.png" />
                      </div>
                      <div class="w-full">
                        <div class="text-lg flex justify-between">
                          <span>ABOUT</span>
                          <div class="text-11 font-ibm">
                            <span>
                              {{
                                dvc.fundStruct === "OPEN"
                                  ? "Open ended fund"
                                  : "Close ended fund"
                              }}
                            </span>
                            <nftmx-tooltip
                              text="Decentralized venture capital (DVC) creators have the flexibility to dicide between two types of fund structures: open-ended or closed-ended. An open-ended fund structure allows investors to enter and exit the fund at any point in time without restriction. In contrast, a closed-ended fund structure has a set fundrasing period and once it ends, no new investors can join the fund."
                              class="tracking-tighter"
                            >
                              <sup>
                                <font-awesome-icon
                                  :icon="['fas', 'question-circle']"
                                  class="text-10 cursor-pointer ml-1"
                                />
                              </sup>
                            </nftmx-tooltip>
                          </div>
                        </div>
                        <div class="flex gap-4.5 items-center py-4">
                          <div class="w-13.5 h-13.5">
                            <nftmx-img
                              :src="dvc.logo"
                              class="object-cover object-center w-full h-full"
                            />
                          </div>
                          <div class="font-ibm">
                            <div class="text-13">
                              <span class="text-primary-900">
                                {{ dvc.name }}
                              </span>
                              <span class="text-tertiary-400">
                                (DVC {{ dvc.index }})
                              </span>
                            </div>
                            <div class="mt-1 text-11">
                              <span class="text-tertiary-400">GP: </span>
                              <span>
                                {{ dvc.address }}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p class="font-ibm text-11">
                          {{ dvc.description }}
                        </p>
                        <div class="flex text-sm py-6 gap-6 text-tertiary-400">
                          <a
                            v-if="dvc.website"
                            :href="dvc.website"
                            target="_blank"
                          >
                            <font-awesome-icon
                              :icon="['fas', 'globe']"
                              class="cursor-pointer hover:text-white transition"
                            />
                          </a>
                          <a
                            v-if="dvc.twitter"
                            :href="dvc.twitter"
                            target="_blank"
                          >
                            <font-awesome-icon
                              :icon="['fab', 'twitter']"
                              class="cursor-pointer hover:text-white transition"
                            />
                          </a>
                          <a
                            v-if="dvc.medium"
                            :href="dvc.medium"
                            target="_blank"
                          >
                            <font-awesome-icon
                              :icon="['fab', 'medium-m']"
                              class="cursor-pointer hover:text-white transition"
                            />
                          </a>
                          <a
                            v-if="dvc.telegram"
                            :href="dvc.telegram"
                            target="_blank"
                          >
                            <font-awesome-icon
                              :icon="['fab', 'telegram-plane']"
                              class="cursor-pointer hover:text-white transition"
                            />
                          </a>
                          <a
                            v-if="dvc.discord"
                            :href="dvc.discord"
                            target="_blank"
                          >
                            <font-awesome-icon
                              :icon="['fab', 'discord']"
                              class="cursor-pointer hover:text-white transition"
                            />
                          </a>
                          <a
                            v-if="dvc.instagram"
                            :href="dvc.instagram"
                            target="_blank"
                          >
                            <font-awesome-icon
                              :icon="['fab', 'instagram']"
                              class="cursor-pointer hover:text-white transition"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                    <div class="px-6">
                      <span class="text-lg">BUY CRITERIA</span>
                      <div class="font-ibm text-11 mt-2.5">
                        <div class="py-0.5">
                          <span class="text-tertiary-400"> Buy type: </span>
                          <span>
                            {{
                              dvc.buyType === "INDIVIDUAL"
                                ? "Individual NFT"
                                : "pack of NFTs"
                            }}
                          </span>
                        </div>
                        <div class="py-0.5">
                          <span class="text-tertiary-400"> Buy model: </span>
                          <span>
                            {{
                              dvc.buyModel === "FIX_SALE"
                                ? "Fix sale"
                                : "Auction"
                            }}
                          </span>
                        </div>
                        <div class="py-0.5">
                          <span class="text-tertiary-400"> NFT value: </span>
                          <span> Minimum </span>
                          <span> ${{ dvc.minBuyPrice }} </span>
                          <span class="text-tertiary-400"> | </span>
                          <span> Maximum </span>
                          <span> ${{ dvc.maxBuyPrice || " - " }} </span>
                        </div>
                        <div class="py-0.5">
                          <span class="text-tertiary-400"> Transferred: </span>
                          <span> Minimum </span>
                          <span> {{ dvc.minTrans }} </span>
                          <span class="text-tertiary-400"> | </span>
                          <span> Maximum </span>
                          <span> {{ dvc.maxTrans || " - " }} </span>
                        </div>
                        <div class="py-0.5">
                          <span class="text-tertiary-400">
                            Downside protection:
                          </span>
                          <span> Minimum </span>
                          <span> {{ dvc.minBuyProtection }}% </span>
                          <span class="text-tertiary-400"> | </span>
                          <span> Maximum </span>
                          <span> {{ dvc.maxBuyProtection }}% </span>
                        </div>
                        <div class="py-0.5">
                          <span class="text-tertiary-400">
                            Downside period:
                          </span>
                          <span> Minimum </span>
                          <span> {{ dvc.minBuyPeriod }} days </span>
                          <span class="text-tertiary-400"> | </span>
                          <span> Maximum </span>
                          <span> {{ dvc.maxBuyPeriod }} days </span>
                        </div>
                        <div class="py-0.5">
                          <span class="text-tertiary-400"> Unique: </span>
                          <span> Minimum </span>
                          <span> 1/{{ dvc.minUnique || "-" }} </span>
                          <span class="text-tertiary-400"> | </span>
                          <span> Maximum </span>
                          <span> 1/{{ dvc.maxUnique || "-" }} </span>
                        </div>
                        <div class="py-0.5">
                          <span class="text-tertiary-400">
                            Allow multilevel ownership:
                          </span>
                          <span> {{ capitalize(dvc.buyMlr) }} </span>
                        </div>
                        <div class="py-0.5">
                          <span class="text-tertiary-400">
                            Max to invest:
                          </span>
                          <span>
                            {{ dvc.maxToInvest }}% above last transaction
                          </span>
                        </div>
                        <div class="py-0.5">
                          <span class="text-tertiary-400">
                            Max to cancel:
                          </span>
                          <span>
                            {{ dvc.cancelInvest }}% above last transaction
                          </span>
                        </div>
                        <div class="py-0.5">
                          <span class="text-tertiary-400">
                            Limited to specific collections:
                          </span>
                          <span> {{ capitalize(dvc.collectionLimit) }} </span>
                        </div>
                      </div>
                    </div>
                    <div class="px-6">
                      <span class="text-lg">SELL CRITERIA</span>
                      <div class="font-ibm text-11 mt-2.5">
                        <div class="py-0.5">
                          <span class="text-tertiary-400"> Sale type: </span>
                          <span>
                            {{
                              dvc.sellType === "INDIVIDUAL"
                                ? "Sell as individual"
                                : "Sell as part of a pack"
                            }}
                          </span>
                        </div>
                        <div v-if="dvc.sellType === 'PACK'" class="py-0.5">
                          <span class="text-tertiary-400"> Pack as: </span>
                          <span> Minimum 1 </span>
                          <span class="text-tertiary-400"> | </span>
                          <span> Maximum 5 </span>
                          <span class="text-tertiary-400"> | </span>
                          <span> Pack any collection </span>
                        </div>
                        <div class="py-0.5">
                          <span class="text-tertiary-400"> Sale model: </span>
                          <span>
                            {{
                              dvc.sellModel === "FIX_SALE"
                                ? "Fix sale"
                                : "Auction"
                            }}
                          </span>
                        </div>
                        <div class="py-0.5">
                          <span class="text-tertiary-400"> Soft cap: </span>
                          <span>
                            {{
                              dvc.softCapOption === "PRICE"
                                ? "Above purchased price "
                                : "ROI "
                            }}
                          </span>
                          <span> {{ dvc.softCapValue }}% </span>
                        </div>
                        <div class="py-0.5">
                          <span class="text-tertiary-400">
                            Downside protection:
                          </span>
                          <span> {{ dvc.sellProtection }}% </span>
                        </div>
                        <div class="py-0.5">
                          <span class="text-tertiary-400">
                            Period protection:
                          </span>
                          <span>
                            Same as buy criteria minus
                            {{ dvc.sellPeriod }} day</span
                          >
                        </div>
                        <div class="py-0.5">
                          <span class="text-tertiary-400">
                            Apply on going royalty:
                          </span>
                          <span> {{ capitalize(dvc.useSellMlr) }} </span>
                          <span v-if="dvc.useSellMlr">
                            {{ dvc.royalty }}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    v-if="dvc.history && dvc.history.length > 0"
                    class="text-left font-ibm text-xs bg-tertiary-900 border-t border-black"
                  >
                    <nftmx-table>
                      <nftmx-thead>
                        <nftmx-tr>
                          <th></th>
                          <nftmx-th>Time</nftmx-th>
                          <nftmx-th>Invested</nftmx-th>
                          <nftmx-th>Gain / Loss</nftmx-th>
                          <nftmx-th>Redeemed</nftmx-th>
                          <nftmx-th> Date </nftmx-th>
                          <nftmx-th>Balance</nftmx-th>
                          <nftmx-th>Txn Hash</nftmx-th>
                          <nftmx-th />
                        </nftmx-tr>
                      </nftmx-thead>
                      <nftmx-tbody class="text-11">
                        <nftmx-tr
                          v-for="(history, index) in dvc.history"
                          :key="index"
                          class="transition hover:bg-tertiary-200"
                        >
                          <td class="pl-3.5">
                            <div>
                              <nftmx-img
                                src="/images/components/b_r_arrow.png"
                              />
                            </div>
                          </td>
                          <td class="px-4 py-2.5">
                            {{ formatDate(history.updatedAt) }}
                          </td>
                          <td class="px-4 py-2.5">
                            ${{
                              Math.round(
                                history.invested * coinPrice
                              ).toLocaleString()
                            }}
                          </td>
                          <td class="px-4 py-2.5 text-primary-900">
                            <div class="flex items-center gap-2">
                              <font-awesome-icon
                                v-if="dvc.chain === 'ETHEREUM'"
                                :icon="['fab', 'ethereum']"
                              />
                              <div
                                v-if="dvc.chain === 'BSC-TESTNET'"
                                class="w-3 h-3 fill-primary-900"
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
                              {{ history.profit }}
                            </div>
                            <div>
                              [${{
                                roundTo(
                                  history.profit * coinPrice,
                                  2
                                ).toLocaleString()
                              }}]
                            </div>
                          </td>
                          <td class="px-4 py-2.5 text-red-600">
                            <div class="flex items-center gap-2">
                              <font-awesome-icon
                                v-if="dvc.chain === 'ETHEREUM'"
                                :icon="['fab', 'ethereum']"
                              />
                              <div
                                v-if="dvc.chain === 'BSC-TESTNET'"
                                class="w-3 h-3 fill-red-600"
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
                              {{ history.withdraw }}
                            </div>
                            <div>
                              [${{
                                roundTo(
                                  history.withdraw * coinPrice,
                                  2
                                ).toLocaleString()
                              }}]
                            </div>
                          </td>
                          <td class="px-4 py-2.5">
                            {{ getDateAgo(history.updatedAt) }}
                          </td>
                          <td class="px-4 py-2.5">
                            <div class="flex items-center gap-2">
                              <font-awesome-icon
                                v-if="dvc.chain === 'ETHEREUM'"
                                :icon="['fab', 'ethereum']"
                              />
                              <div
                                v-if="dvc.chain === 'BSC-TESTNET'"
                                class="w-3 h-3 fill-white"
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
                              {{ history.balance }}
                            </div>
                            <div>
                              [${{
                                roundTo(
                                  history.balance * coinPrice,
                                  2
                                ).toLocaleString()
                              }}]
                            </div>
                          </td>
                          <td class="px-4 py-2.5 text-secondary-600">
                            <a
                              target="_blank"
                              :href="
                                (dvc.chain === 'ETHEREUM'
                                  ? 'https://etherscan.io/tx/'
                                  : 'https://testnet.bscscan.com/tx/') +
                                history.tx
                              "
                            >
                              {{ shortenHash(history.tx) }}
                            </a>
                          </td>
                          <td class="px-4 py-2.5 text-red-600">
                            <span
                              v-if="checkBacker(dvc)"
                              class="cursor-pointer transition hover:text-red-900"
                              @click="
                                selectedDvc = dvc;
                                openRedeemModal = true;
                              "
                            >
                              Redeem Balance
                            </span>
                            <span v-else> Redeemed </span>
                          </td>
                        </nftmx-tr>
                      </nftmx-tbody>
                    </nftmx-table>
                  </div>
                </div>
              </td>
            </nftmx-tr>
          </template>
          <tr v-if="dvcs.length === 0">
            <td colspan="12" class="h-80 text-center font-ibm-bold text-2xl">
              <span> {{ loading ? "Loading..." : "No DVCs Found" }} </span>
            </td>
          </tr>
        </nftmx-tbody>
      </nftmx-table>
    </div>
    <div class="font-ibm-medium mt-4.75">
      <router-link
        to="/dvc/launch"
        class="flex items-center gap-4 text-primary-900 hover:text-primary-700 transition w-min whitespace-nowrap cursor-pointer"
      >
        <font-awesome-icon :icon="['fas', 'plus']" class="text-xs" />
        <span class="text-11 leading-3">Launch your DVC</span>
      </router-link>
    </div>
    <div class="flex justify-center mt-10 mb-20">
      <!-- <section-button label="SEE MORE" v-if="dvcs.length > 0" /> -->
    </div>
    <back-dvc-modal v-if="backDvc" :dvc="backDvc" v-model="backModalOpen" />
    <redeem-modal
      v-if="selectedDvc"
      :dvc="selectedDvc"
      v-model="openRedeemModal"
    />
  </body-container>
</template>

<script setup>
import { computed, onMounted, ref, watch, watchEffect } from "vue";
import CollectionCard from "@/core/components/cards/CollectionCard.vue";
import marketService from "@/core/services/market.service";
import collectionsService from "@/core/services/market/collections.service";
import { themeConfig } from "@/core/config/constant";
import { useStore } from "vuex";
import NftmxButton from "@/core/components/basic/NftmxButton.vue";
import NftmxThead from "@/core/components/table/NftmxThead.vue";
import NftmxTbody from "@/core/components/table/NftmxTbody.vue";
import NftmxTd from "@/core/components/table/NftmxTd.vue";
import NftmxTr from "@/core/components/table/NftmxTr.vue";
import NftmxImg from "@/core/components/basic/NftmxImg.vue";
import NftmxTrimString from "@/core/components/basic/NftmxTrimString.vue";
import { roundTo, getChainKey } from "@/core/utils/common";
import { useRouter } from "vue-router";

const props = defineProps({
  ledgerPanelVisible: Boolean,
  collectionFilterOption: Object,
  viewOption: String,
  displayLimit: Number,
});

const store = useStore();
const router = useRouter();
const walletAddress = computed(() => store.getters["auth/walletAddress"]);
const userId = computed(() => store.getters["auth/userId"]);
const coinPrice = computed(() => store.state.market.coinPrice);
const windowWidth = computed(() => store.state.app.windowWidth);
const allContracts = ref({ contracts: [], cursor: null });
const contracts = ref([]);
const limit = ref(2);
const more = computed(
  () =>
    allContracts.value.cursor ||
    allContracts.value.contracts.length > contracts.value.length
);
const loading = ref(true);
const filterOption = computed(() => props.collectionFilterOption);
const period = ref("1H");
const favorite = ref("All");
const sortBy = ref("");
const orderBy = ref("DESC");

const retrieveContracts = async () => {
  return new Promise((resolve, reject) => {
    marketService
      .getContracts({
        ...filterOption.value,
        favoriteAddress:
          favorite.value === "Favourites" ? walletAddress.value : "",
        sortBy: sortBy.value || filterOption.value?.sortBy,
        orderBy: sortBy.value ? orderBy.value : "",
        stats: true,
        cursor: allContracts.value.cursor,
        limit: props.displayLimit || 30,
      })
      .then((res) => {
        allContracts.value = {
          contracts: [...allContracts.value.contracts, ...res.data.contracts],
          cursor: res.data.cursor,
        };
        resolve(true);
      })
      .catch((err) => {
        resolve(false);
      });
  });
};
const loadMoreContracts = async () => {
  loading.value = true;
  if (allContracts.value.cursor) await retrieveContracts();
  loading.value = false;
  const sliceLimit = limit.value * 10;
  const nextStartPoint = contracts.value.length;
  contracts.value = contracts.value.concat(
    allContracts.value.contracts.slice(
      nextStartPoint,
      props.viewOption === "LIST"
        ? allContracts.value.contracts.length
        : nextStartPoint + sliceLimit
    )
  );
};
const initialContracts = async () => {
  allContracts.value = { contracts: [], cursor: null };
  contracts.value = [];
  loading.value = true;
  await retrieveContracts();
  loading.value = false;
  contracts.value = contracts.value.concat(
    allContracts.value.contracts.slice(
      0,
      props.viewOption === "LIST"
        ? allContracts.value.contracts.length
        : limit.value * 5
    )
  );
};
const starContract = async (index) => {
  if (!userId.value) {
    store.commit("app/OPEN_CONNECT_WALLET_MODAL");
    return;
  }
  collectionsService
    .starContract({
      contractId: contracts.value[index].id,
      userId: userId.value,
    })
    .then((res) => {
      if (res.data) {
        contracts.value[index].starUsers
          ? contracts.value[index].starUsers.push(store.state.user)
          : (contracts.value[index].starUsers = [store.state.user]);
      } else {
        const i = contracts.value[index].starUsers?.findIndex(
          (item) => item.id === userId.value
        );
        i > -1 && contracts.value[index].starUsers.splice(i, 1);
      }
    });
};
const sortTable = (val) => {
  if (sortBy.value === val) {
    orderBy.value = orderBy.value === "ASC" ? "DESC" : "ASC";
  } else {
    sortBy.value = val;
  }
  initialContracts();
};
onMounted(() => {
  initialContracts();
});
const setLimitValue = (value) => {
  if (props.viewOption === "LIST") {
    contracts.value = allContracts.value.contracts;
    return;
  }
  const lines = Math.ceil(contracts.value.length / limit.value);
  contracts.value = allContracts.value.contracts.slice(0, value * lines);
  limit.value = value;
};
watch(windowWidth, (value) => {
  if (windowWidth.value >= themeConfig.xl3) {
    props.ledgerPanelVisible ? setLimitValue(1) : setLimitValue(2);
  } else {
    setLimitValue(1);
  }
});
watch(filterOption, (value) => {
  sortBy.value = "";
  initialContracts();
});
watch(favorite, (val) => {
  if (walletAddress.value) {
    initialContracts();
  }
});
</script>

<template>
  <div :class="[ledgerPanelVisible ? 'lg:pl-2' : 'pl-0', 'flex-1 -mb-3']">
    <div>
      <div class="font-press text-sm text-white my-2.25 pl-3">Collections</div>
      <div
        v-if="viewOption === 'TILE'"
        :class="[
          ledgerPanelVisible ? 'grid-cols-1 ' : 'grid-cols-1 2xl:grid-cols-2',
          'grid mt-3 -mx-2 lg:pl-2',
        ]"
      >
        <collection-card
          v-for="(contract, index) in contracts"
          :key="index"
          :collection="contract"
        />
      </div>
      <div v-if="viewOption === 'LIST'" class="-mt-9.25 pb-2.5 pl-1">
        <div
          class="overflow-x-auto text-11 tracking-wider leading-4 mt-3.5 p-2"
        >
          <div class="w-full min-w-fit relative">
            <table
              class="w-full divide-y divide-black font-ibm text-white z-1 relative"
            >
              <nftmx-thead>
                <tr>
                  <th colspan="13" />
                  <th
                    class="border border-black py-3 text-primary-900 bg-tertiary-800 shadow-default shadow-primary-900"
                    colspan="2"
                    style="width: 223px"
                  >
                    100% Liquidity Protection
                  </th>
                </tr>
                <nftmx-tr class="border border-black text-left bg-tertiary-800">
                  <th class="px-4 py-2">#</th>
                  <th class="px-4 py-2">Collections</th>
                  <th
                    class="px-3 py-2 cursor-pointer"
                    @click="sortTable('CHAIN')"
                  >
                    <div class="flex justify-between items-center">
                      <span> Chain </span>
                      <font-awesome-icon
                        :icon="['fas', 'sort']"
                        class="text-sm"
                      />
                    </div>
                  </th>
                  <th
                    class="px-3 py-2 cursor-pointer"
                    @click="sortTable('ITEMS')"
                  >
                    <div class="flex justify-between items-center">
                      <span> Items </span>
                      <font-awesome-icon
                        :icon="['fas', 'sort']"
                        class="text-sm"
                      />
                    </div>
                  </th>
                  <th
                    class="px-3 py-2 cursor-pointer"
                    @click="sortTable('LISTING')"
                  >
                    <div class="flex justify-between items-center">
                      <span> Listing </span>
                      <font-awesome-icon
                        :icon="['fas', 'sort']"
                        class="text-sm"
                      />
                    </div>
                  </th>
                  <th
                    class="px-3 py-2 cursor-pointer"
                    @click="sortTable('OWNERS')"
                  >
                    <div class="flex justify-between items-center">
                      <span> Owners/unique </span>
                      <font-awesome-icon
                        :icon="['fas', 'sort']"
                        class="text-sm"
                      />
                    </div>
                  </th>
                  <th
                    class="px-3 py-2 cursor-pointer"
                    @click="sortTable('VOLUME')"
                  >
                    <div class="flex justify-between items-center">
                      <span> Volume </span>
                      <font-awesome-icon
                        :icon="['fas', 'sort']"
                        class="text-sm"
                      />
                    </div>
                  </th>
                  <th
                    class="px-3 py-2 cursor-pointer"
                    @click="
                      sortTable(
                        period === '1m'
                          ? 'V_CHANGE_1M'
                          : period === '5m'
                          ? 'V_CHANGE_5M'
                          : period === '15m'
                          ? 'V_CHANGE_15M'
                          : period === '30m'
                          ? 'V_CHANGE_30M'
                          : period === '1H'
                          ? 'V_CHANGE_1H'
                          : period === '1D'
                          ? 'V_CHANGE_1D'
                          : period === '1W'
                          ? 'V_CHANGE_1W'
                          : period === '1M'
                          ? 'V_CHANGE_1MTH'
                          : ''
                      )
                    "
                  >
                    <div class="flex justify-between items-center">
                      <span> Volume change </span>
                      <font-awesome-icon
                        :icon="['fas', 'sort']"
                        class="text-sm"
                      />
                    </div>
                  </th>
                  <th
                    class="px-3 py-2 cursor-pointer"
                    @click="sortTable('BOTTOM_BID')"
                  >
                    <div class="flex justify-between items-center">
                      <span> Bottom bid </span>
                      <font-awesome-icon
                        :icon="['fas', 'sort']"
                        class="text-sm"
                      />
                    </div>
                  </th>
                  <th
                    class="px-3 py-2 cursor-pointer"
                    @click="sortTable('TOP_BID')"
                  >
                    <div class="flex justify-between items-center">
                      <span> Top bid </span>
                      <font-awesome-icon
                        :icon="['fas', 'sort']"
                        class="text-sm"
                      />
                    </div>
                  </th>
                  <th
                    class="px-3 py-2 cursor-pointer"
                    @click="sortTable('FLOOR')"
                  >
                    <div class="flex justify-between items-center">
                      <span> Floor price </span>
                      <font-awesome-icon
                        :icon="['fas', 'sort']"
                        class="text-sm"
                      />
                    </div>
                  </th>
                  <th
                    class="px-3 py-2 cursor-pointer"
                    @click="
                      sortTable(
                        period === '1m'
                          ? 'F_CHANGE_1M'
                          : period === '5m'
                          ? 'F_CHANGE_5M'
                          : period === '15m'
                          ? 'F_CHANGE_15M'
                          : period === '30m'
                          ? 'F_CHANGE_30M'
                          : period === '1H'
                          ? 'F_CHANGE_1H'
                          : period === '1D'
                          ? 'F_CHANGE_1D'
                          : period === '1W'
                          ? 'F_CHANGE_1W'
                          : period === '1M'
                          ? 'F_CHANGE_1MTH'
                          : ''
                      )
                    "
                  >
                    <div class="flex justify-between items-center">
                      <span> Floor change </span>
                      <font-awesome-icon
                        :icon="['fas', 'sort']"
                        class="text-sm"
                      />
                    </div>
                  </th>
                  <th
                    class="px-3 py-2 cursor-pointer"
                    @click="sortTable('ATH_PRICE')"
                  >
                    <div class="flex justify-between items-center">
                      <span> ATH price </span>
                      <font-awesome-icon
                        :icon="['fas', 'sort']"
                        class="text-sm"
                      />
                    </div>
                  </th>
                  <th
                    class="cursor-pointer text-center relative"
                    style="width: 112px"
                    @click="sortTable('MIN_PROTECTION')"
                  >
                    <div class="w-27 flex justify-between items-center px-2">
                      <span> Minimum slippage </span>
                      <font-awesome-icon
                        :icon="['fas', 'sort']"
                        class="text-sm"
                      />
                    </div>
                    <div
                      class="absolute w-2 h-full -left-2.25 top-0 bg-gradient-to-r opacity-30 from-transparent to-primary-900"
                    />
                  </th>
                  <th
                    class="cursor-pointer text-center relative"
                    style="width: 111px"
                    @click="sortTable('MAX_DAYS')"
                  >
                    <div class="w-27 flex justify-between items-center px-2">
                      <span> Maximum days </span>
                      <font-awesome-icon
                        :icon="['fas', 'sort']"
                        class="text-sm"
                      />
                    </div>
                    <div
                      class="absolute w-2 h-full1 -right-2.25 top-0 bg-gradient-to-r opacity-30 from-primary-900"
                    />
                  </th>
                </nftmx-tr>
              </nftmx-thead>
              <nftmx-tbody
                :style="{
                  border: '1px solid black',
                }"
                class="bg-tertiary-800"
              >
                <nftmx-tr
                  v-for="(contract, index) in contracts"
                  :key="contract.id"
                  class="hover:bg-tertiary-300 cursor-pointer shadow-default hover:shadow-primary-900"
                  @click="
                    router.push(
                      `/collection/${contract.chain}/${contract.address}`
                    )
                  "
                >
                  <nftmx-td @click.stop>
                    <span>
                      {{ index + 1 }}
                    </span>
                    <font-awesome-icon
                      :icon="['fas', 'star']"
                      :class="[
                        contract.starUsers?.findIndex(
                          (item) => item.id === userId
                        ) > -1
                          ? 'text-primary-900'
                          : 'text-tertiary-400',
                        ' ml-2 hover:text-primary-900 transition',
                      ]"
                      @click="starContract(index)"
                    />
                  </nftmx-td>
                  <nftmx-td>
                    <div class="flex gap-4.5 items-center">
                      <div class="w-11 h-11">
                        <nftmx-img
                          :src="contract.imageUrl"
                          class="h-full w-full object-cover bg-black"
                        />
                      </div>
                    </div>
                  </nftmx-td>
                  <nftmx-td>
                    <div
                      v-if="contract.chain === 'BSC-TESTNET'"
                      class="w-4 h-4"
                    >
                      <svg viewBox="0 0 24 24">
                        <path
                          class="fill-white"
                          d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                        />
                      </svg>
                    </div>
                    <font-awesome-icon
                      v-if="contract.chain === 'ETHEREUM'"
                      :icon="['fab', 'ethereum']"
                      class="text-sm"
                    />
                  </nftmx-td>
                  <nftmx-td>
                    {{
                      contract.items.toLocaleString("en-US", {
                        notation: "compact",
                        compactDisplay: "short",
                      })
                    }}
                  </nftmx-td>
                  <nftmx-td>
                    {{
                      contract.listings.toLocaleString("en-US", {
                        notation: "compact",
                        compactDisplay: "short",
                      })
                    }}
                    <div class="text-tertiary-400">
                      [{{
                        roundTo((contract.listings / contract.items) * 100, 2)
                      }}%]
                    </div>
                  </nftmx-td>
                  <nftmx-td>
                    {{
                      contract.owners.toLocaleString("en-US", {
                        notation: "compact",
                        compactDisplay: "short",
                      })
                    }}
                    <div class="text-tertiary-400">[32.23%]</div>
                  </nftmx-td>
                  <nftmx-td>
                    <div>
                      <font-awesome-icon :icon="['fab', 'ethereum']" />
                      {{
                        contract.stats
                          ? contract.stats.volume.toLocaleString("en-US", {
                              notation: "compact",
                              compactDisplay: "short",
                              maximumFractionDigits: 2,
                            })
                          : 0
                      }}
                    </div>
                    <div class="text-tertiary-400">
                      [${{
                        contract.stats
                          ? (
                              contract.stats.volume *
                              coinPrice[getChainKey(contract.chain)]
                            ).toLocaleString("en-US", {
                              notation: "compact",
                              compactDisplay: "short",
                              maximumFractionDigits: 2,
                            })
                          : 0
                      }}]
                    </div>
                  </nftmx-td>
                  <nftmx-td
                    :class="[
                      contract.stats
                        ? period === '1m' && contract.stats.volume1m >= 0
                          ? 'text-primary-900'
                          : period === '5m' && contract.stats.volume5m >= 0
                          ? 'text-primary-900'
                          : period === '15m' && contract.stats.volume15m >= 0
                          ? 'text-primary-900'
                          : period === '30m' && contract.stats.volume30m >= 0
                          ? 'text-primary-900'
                          : period === '1H' && contract.stats.volume1h >= 0
                          ? 'text-primary-900'
                          : period === '1D' && contract.stats.volume1d >= 0
                          ? 'text-primary-900'
                          : period === '1W' && contract.stats.volume1w >= 0
                          ? 'text-primary-900'
                          : period === '1M' && contract.stats.volume1mth >= 0
                          ? 'text-primary-900'
                          : period === 'All'
                          ? 'text-primary-900'
                          : 'text-red-900'
                        : 'text-primary-900',
                    ]"
                  >
                    {{
                      contract.stats
                        ? period === "1m"
                          ? roundTo(contract.stats.volume1m, 2)
                          : period === "5m"
                          ? roundTo(contract.stats.volume5m, 2)
                          : period === "15m"
                          ? roundTo(contract.stats.volume15m, 2)
                          : period === "30m"
                          ? roundTo(contract.stats.volume30m, 2)
                          : period === "1H"
                          ? roundTo(contract.stats.volume1h, 2)
                          : period === "1D"
                          ? roundTo(contract.stats.volume1d, 2)
                          : period === "1W"
                          ? roundTo(contract.stats.volume1w, 2)
                          : period === "1M"
                          ? roundTo(contract.stats.volume1mth, 2)
                          : "-"
                        : 0
                    }}{{ period === "All" ? "" : "%" }}
                  </nftmx-td>
                  <nftmx-td>
                    <div>
                      <font-awesome-icon :icon="['fab', 'ethereum']" />
                      {{
                        contract.stats
                          ? contract.stats.bottomBid.toLocaleString("en-US", {
                              notation: "compact",
                              compactDisplay: "short",
                              maximumFractionDigits: 2,
                            })
                          : 0
                      }}
                    </div>
                    <div class="text-tertiary-400">
                      [${{
                        contract.stats
                          ? (
                              contract.stats.bottomBid *
                              coinPrice[getChainKey(contract.chain)]
                            ).toLocaleString("en-US", {
                              notation: "compact",
                              compactDisplay: "short",
                              maximumFractionDigits: 2,
                            })
                          : 0
                      }}]
                    </div>
                  </nftmx-td>
                  <nftmx-td>
                    <div>
                      <font-awesome-icon :icon="['fab', 'ethereum']" />
                      {{
                        contract.stats
                          ? contract.stats.topBid.toLocaleString("en-US", {
                              notation: "compact",
                              compactDisplay: "short",
                              maximumFractionDigits: 2,
                            })
                          : 0
                      }}
                    </div>
                    <div class="text-tertiary-400">
                      [${{
                        contract.stats
                          ? (
                              contract.stats.topBid *
                              coinPrice[getChainKey(contract.chain)]
                            ).toLocaleString("en-US", {
                              notation: "compact",
                              compactDisplay: "short",
                              maximumFractionDigits: 2,
                            })
                          : 0
                      }}]
                    </div>
                  </nftmx-td>
                  <nftmx-td>
                    <div>
                      <font-awesome-icon :icon="['fab', 'ethereum']" />
                      {{
                        contract.stats
                          ? contract.stats.floor.toLocaleString("en-US", {
                              notation: "compact",
                              compactDisplay: "short",
                              maximumFractionDigits: 2,
                            })
                          : 0
                      }}
                    </div>
                    <div class="text-tertiary-400">
                      [${{
                        contract.stats
                          ? (
                              contract.stats.floor *
                              coinPrice[getChainKey(contract.chain)]
                            ).toLocaleString("en-US", {
                              notation: "compact",
                              compactDisplay: "short",
                              maximumFractionDigits: 2,
                            })
                          : 0
                      }}]
                    </div>
                  </nftmx-td>
                  <nftmx-td
                    :class="[
                      contract.stats
                        ? period === '1m' && contract.stats.floor1m >= 0
                          ? 'text-primary-900'
                          : period === '5m' && contract.stats.floor5m >= 0
                          ? 'text-primary-900'
                          : period === '15m' && contract.stats.floor15m >= 0
                          ? 'text-primary-900'
                          : period === '30m' && contract.stats.floor30m >= 0
                          ? 'text-primary-900'
                          : period === '1H' && contract.stats.floor1h >= 0
                          ? 'text-primary-900'
                          : period === '1D' && contract.stats.floor1d >= 0
                          ? 'text-primary-900'
                          : period === '1W' && contract.stats.floor1w >= 0
                          ? 'text-primary-900'
                          : period === '1M' && contract.stats.floor1mth >= 0
                          ? 'text-primary-900'
                          : period === 'All'
                          ? 'text-primary-900'
                          : 'text-red-900'
                        : 'text-primary-900',
                    ]"
                  >
                    {{
                      contract.stats
                        ? period === "1m"
                          ? roundTo(contract.stats.floor1m, 2)
                          : period === "5m"
                          ? roundTo(contract.stats.floor5m, 2)
                          : period === "15m"
                          ? roundTo(contract.stats.floor15m, 2)
                          : period === "30m"
                          ? roundTo(contract.stats.floor30m, 2)
                          : period === "1H"
                          ? roundTo(contract.stats.floor1h, 2)
                          : period === "1D"
                          ? roundTo(contract.stats.floor1d, 2)
                          : period === "1W"
                          ? roundTo(contract.stats.floor1w, 2)
                          : period === "1M"
                          ? roundTo(contract.stats.floor1mth, 2)
                          : "-"
                        : 0
                    }}{{ period === "All" ? "" : "%" }}
                  </nftmx-td>
                  <nftmx-td>
                    <div>
                      <font-awesome-icon :icon="['fab', 'ethereum']" />
                      {{ 5.23 }}
                    </div>
                    <div class="text-tertiary-400">[$18.78k]</div>
                  </nftmx-td>
                  <td class="text-center relative" style="width: 112px">
                    {{ contract.stats?.minProtection || 0 }}%
                    <div
                      class="absolute w-2 h-full -left-2.25 top-0 bg-gradient-to-r opacity-30 from-transparent to-primary-900"
                    />
                  </td>
                  <td class="text-center relative" style="width: 111px">
                    {{ contract.stats?.maxDays || 0 }}
                    <div
                      class="absolute w-2 h-full1 -right-2.25 top-0 bg-gradient-to-r opacity-30 from-primary-900"
                    />
                  </td>
                </nftmx-tr>
              </nftmx-tbody>
            </table>
            <div
              class="absolute bottom-0 right-0 w-56 h-2 shadow-default shadow-primary-900 z-0"
            />
            <div
              class="absolute z-1 -top-1.5 pl-60 pr-64 w-full flex justify-between font-ibm text-sm text-white"
            >
              <div class="flex items-center gap-2.75">
                <div
                  :class="[
                    period === '1m' ? 'text-primary-900' : '',
                    'hover:text-primary-900 transition cursor-pointer',
                  ]"
                  @click="period = '1m'"
                >
                  1m
                </div>
                <div
                  class="border-l border-l-black border-r border-r-tertiary-700 h-4"
                />
                <div
                  :class="[
                    period === '5m' ? 'text-primary-900' : '',
                    'hover:text-primary-900 transition cursor-pointer',
                  ]"
                  @click="period = '5m'"
                >
                  5m
                </div>
                <div
                  class="border-l border-l-black border-r border-r-tertiary-700 h-4"
                />
                <div
                  :class="[
                    period === '15m' ? 'text-primary-900' : '',
                    'hover:text-primary-900 transition cursor-pointer',
                  ]"
                  @click="period = '15m'"
                >
                  15m
                </div>
                <div
                  class="border-l border-l-black border-r border-r-tertiary-700 h-4"
                />
                <div
                  :class="[
                    period === '30m' ? 'text-primary-900' : '',
                    'hover:text-primary-900 transition cursor-pointer',
                  ]"
                  @click="period = '30m'"
                >
                  30m
                </div>
                <div
                  class="border-l border-l-black border-r border-r-tertiary-700 h-4"
                />
                <div
                  :class="[
                    period === '1H' ? 'text-primary-900' : '',
                    'hover:text-primary-900 transition cursor-pointer',
                  ]"
                  @click="period = '1H'"
                >
                  1H
                </div>
                <div
                  class="border-l border-l-black border-r border-r-tertiary-700 h-4"
                />
                <div
                  :class="[
                    period === '1D' ? 'text-primary-900' : '',
                    'hover:text-primary-900 transition cursor-pointer',
                  ]"
                  @click="period = '1D'"
                >
                  1D
                </div>
                <div
                  class="border-l border-l-black border-r border-r-tertiary-700 h-4"
                />
                <div
                  :class="[
                    period === '1W' ? 'text-primary-900' : '',
                    'hover:text-primary-900 transition cursor-pointer',
                  ]"
                  @click="period = '1W'"
                >
                  1W
                </div>
                <div
                  class="border-l border-l-black border-r border-r-tertiary-700 h-4"
                />
                <div
                  :class="[
                    period === '1M' ? 'text-primary-900' : '',
                    'hover:text-primary-900 transition cursor-pointer',
                  ]"
                  @click="period = '1M'"
                >
                  1M
                </div>
                <div
                  class="border-l border-l-black border-r border-r-tertiary-700 h-4"
                />
                <div
                  :class="[
                    period === 'All' ? 'text-primary-900' : '',
                    'hover:text-primary-900 transition cursor-pointer',
                  ]"
                  @click="period = 'All'"
                >
                  All
                </div>
              </div>
              <div class="flex items-center gap-2.75">
                <div
                  :class="[
                    favorite === 'All' ? 'text-primary-900' : '',
                    'hover:text-primary-900 transition cursor-pointer',
                  ]"
                  @click="favorite = 'All'"
                >
                  All
                </div>
                <div
                  class="border-l border-l-black border-r border-r-tertiary-700 h-4"
                />
                <div
                  :class="[
                    favorite === 'Favourites' ? 'text-primary-900' : '',
                    'hover:text-primary-900 transition cursor-pointer',
                  ]"
                  @click="favorite = 'Favourites'"
                >
                  Favourites
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="loading"
      class="h-96 flex justify-center items-center font-ibm-bold text-tertiary-500 text-lg"
    >
      Loading...
    </div>
    <div
      v-if="!loading && contracts.length === 0"
      class="h-96 flex justify-center items-center font-ibm-bold text-tertiary-500 text-lg"
    >
      No Collections found
    </div>
    <div
      v-if="!displayLimit"
      class="absolute bottom-1.25 left-0 flex justify-center w-full h-27"
    >
      <div class="text-center w-full px-4 sm:px-10">
        <nftmx-button
          v-if="more"
          color="primary"
          label="SEE MORE"
          :outline="true"
          @click="loadMoreContracts"
          class="font-ibm-bold text-lg text-primary-900 h-13.5 w-full md:w-auto md:px-22.5"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-center {
  text-align: -webkit-center;
}
.h-full1 {
  height: calc(100% + 1px);
}
</style>

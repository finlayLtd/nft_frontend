<script setup>
import { computed, onMounted, ref, watch, watchEffect } from "vue";
import NftmxImg from "@/core/components/basic/NftmxImg.vue";
import usersService from "@/core/services/market/users.service";
import {
  themeConfig,
  defaultPagination,
  BSC_TESTNET_MARKET_OFFER_CONTRACT_ADDRESS,
} from "@/core/config/constant";
import { useStore } from "vuex";
import NftmxSearchInput from "@/core/components/basic/NftmxSearchInput.vue";
import useDebouncedRef from "@/core/utils/hook/useDebouncedRef";
import marketService from "@/core/services/market.service";
import nftsService from "@/core/services/market/nfts.service";
import OfferSearchOptions from "../components/OfferSearchOptions.vue";
import NftmxButton from "@/core/components/basic/NftmxButton.vue";
import BasicAccordion from "@/core/components/accordion/BasicAccordion.vue";
import NftmxTable from "@/core/components/table/NftmxTable.vue";
import NftmxThead from "@/core/components/table/NftmxThead.vue";
import NftmxTh from "@/core/components/table/NftmxTh.vue";
import NftmxTbody from "@/core/components/table/NftmxTbody.vue";
import NftmxTd from "@/core/components/table/NftmxTd.vue";
import NftmxTr from "@/core/components/table/NftmxTr.vue";
import NftmxWalletAddressPop from "@/core/components/blockchain-address/NftmxWalletAddressPop.vue";
import NftmxTrimString from "@/core/components/basic/NftmxTrimString.vue";
import {
  roundTo,
  getDateAgo,
  getDateLeft,
  shortenHash,
  getChainKey,
} from "@/core/utils/common";
import { acceptOffer } from "@/core/utils/contracts/market.utils";
import {
  isApprovedForAll,
  setApprovalForAll,
} from "@/core/utils/contracts/erc721.utils.js";

const store = useStore();
const windowWidth = computed(() => store.state.app.windowWidth);
const walletAddress = computed(() => store.getters["auth/walletAddress"]);
const userId = computed(() => store.getters["auth/userId"]);
const coinPrice = computed(() => store.state.market.coinPrice);
const loading = ref(false);
const allOffers = ref({ offers: [], cursor: null });
const offers = ref([]);
const more = computed(
  () =>
    allOffers.value.cursor ||
    offers.value.length < allOffers.value.offers.length
);
const limit = ref(2);
const filterOption = ref({
  chain: "BSC-TESTNET",
  name: "",
  min: null,
  max: null,
  collection: [],
  sortBy: "",
});
const searchText = useDebouncedRef("", 1000);
const filterActive = ref(false);
const sortBy = ref("HIGH_TO_LOW");
const orderBy = ref("DESC");

const clickFilter = () => {
  filterActive.value = !filterActive.value;
};
const filterOffers = (value) => {
  filterOption.value = value;
  initialOffers();
};
const cancelOffer = (id) => {
  usersService
    .cancelOffersReceived({
      chain: filterOption.value.chain,
      offerId: id,
    })
    .then((res) => {
      const index = allOffers.value.offers.findIndex(
        (asset) => asset.id === id
      );
      allOffers.value.offers.splice(index, 1);
      const lines = Math.ceil((offers.value.length - 1) / limit.value);
      offers.value = allOffers.value.offers.slice(0, limit.value * lines);
    });
};
const accept = async (index, offerId) => {
  const offer = offers.value[index];
  const approved = await isApprovedForAll(
    offer.tokenAddress,
    walletAddress.value,
    BSC_TESTNET_MARKET_OFFER_CONTRACT_ADDRESS
  );
  if (!approved) {
    await setApprovalForAll(
      offer.tokenAddress,
      BSC_TESTNET_MARKET_OFFER_CONTRACT_ADDRESS,
      true
    );
  }
  acceptOffer(offerId)
    .then((res) => {
      const index = allOffers.value.offers.findIndex(
        (item) => item.id === offer.id
      );
      allOffers.value.offers.splice(index, 1);
      const lines = Math.ceil((offers.value.length - 1) / limit.value);
      offers.value = allOffers.value.offers.slice(0, limit.value * lines);
    })
    .catch((err) => {
      console.log("err: ", err);
    });
};
const loadMoreOffers = async () => {
  loading.value = true;
  if (allOffers.value.cursor) await retrieveOffers();
  loading.value = false;
  const sliceLimit = limit.value * 3;
  const nextStartPoint = offers.value.length;
  offers.value = offers.value.concat(
    allOffers.value.offers.slice(nextStartPoint, nextStartPoint + sliceLimit)
  );
};
const initialOffers = async () => {
  allOffers.value = { offers: [], cursor: null };
  offers.value = [];
  loading.value = true;
  await retrieveOffers();
  loading.value = false;
  offers.value = offers.value.concat(
    allOffers.value.offers.slice(0, limit.value * 4)
  );
};
const retrieveOffers = async () => {
  return new Promise((resolve, reject) => {
    usersService
      .offersReceived({
        ...filterOption.value,
        cursor: allOffers.value.cursor,
        limit: defaultPagination.limit,
        walletAddress: walletAddress.value,
        sortBy: sortBy.value || filterOption.value.sortBy,
        orderBy: sortBy.value ? orderBy.value : "",
      })
      .then((res) => {
        allOffers.value = {
          offers: [...allOffers.value.offers, ...res.data.offers],
          cursor: res.data.cursor,
        };
        resolve(true);
      })
      .catch((err) => {
        resolve(false);
      });
  });
};
const sortTable = (val) => {
  if (sortBy.value === val) {
    orderBy.value = orderBy.value === "ASC" ? "DESC" : "ASC";
  } else {
    sortBy.value = val;
  }
  initialOffers();
};
watch(walletAddress, (val) => {
  initialOffers();
});
onMounted(() => {
  initialOffers();
});
watch(searchText, (val) => {
  filterOffers({ ...filterOption.value, name: val });
});
</script>

<template>
  <div class="flex flex-col sm:flex-row mb-22 xl:pt-7.25 text-white">
    <div class="flex-1">
      <div class="flex xl:justify-end">
        <nftmx-search-input
          v-model="searchText"
          @handle-filter="clickFilter"
          :filterActive="filterActive"
          class="bg-tertiary-800 z-10"
        />
      </div>
      <div
        class="-ml-5 sm:-ml-10 md:-ml-16 xl:-ml-22 -mr-5 sm:-mr-10 md:-mr-16 xl:-mr-22"
      >
        <offer-search-options
          :gridExtend="false"
          :filterOption="filterOption"
          @filter-offers="filterOffers"
          :filterActive="filterActive"
        />
      </div>
      <div class="mt-10">
        <div class="border border-black bg-tertiary-800">
          <div class="flex items-center px-5 border-b border-black">
            <div class="text-lg font-ibm-bold pt-4 pb-3.5">Offers Received</div>
          </div>
          <div class="text-left font-ibm text-xs">
            <nftmx-table class="text-11 tracking-wider leading-4">
              <nftmx-thead>
                <nftmx-tr>
                  <nftmx-th class="text-left">Item</nftmx-th>
                  <nftmx-th class="text-left">From</nftmx-th>
                  <nftmx-th class="text-left" @click="sortTable('HIGH_TO_LOW')">
                    <div class="flex justify-between items-center">
                      <span> Offer </span>
                      <font-awesome-icon
                        :icon="['fas', 'sort']"
                        class="text-sm"
                      />
                    </div>
                  </nftmx-th>
                  <nftmx-th class="text-left" @click="sortTable('SLIPPAGE')">
                    <div class="flex justify-between items-center">
                      <span> Slippage </span>
                      <font-awesome-icon
                        :icon="['fas', 'sort']"
                        class="text-sm"
                      />
                    </div>
                  </nftmx-th>
                  <nftmx-th class="text-left" @click="sortTable('PROTECTION')">
                    <div class="flex justify-between items-center">
                      <span> Period protection </span>
                      <font-awesome-icon
                        :icon="['fas', 'sort']"
                        class="text-sm"
                      />
                    </div>
                  </nftmx-th>
                  <nftmx-th class="text-left" @click="sortTable('STAKING')">
                    <div class="flex justify-between items-center">
                      <span> Staking leverage </span>
                      <font-awesome-icon
                        :icon="['fas', 'sort']"
                        class="text-sm"
                      />
                    </div>
                  </nftmx-th>
                  <nftmx-th class="text-left" @click="sortTable('FLOOR')">
                    <div class="flex justify-between items-center">
                      <span> Floor price </span>
                      <font-awesome-icon
                        :icon="['fas', 'sort']"
                        class="text-sm"
                      />
                    </div>
                  </nftmx-th>
                  <nftmx-th
                    class="text-left"
                    @click="sortTable('FLOOR_DIFFERENCE')"
                  >
                    <div class="flex justify-between items-center">
                      <span> Floor Difference </span>
                      <font-awesome-icon
                        :icon="['fas', 'sort']"
                        class="text-sm"
                      />
                    </div>
                  </nftmx-th>
                  <nftmx-th class="text-left" @click="sortTable('NEW')">
                    <div class="flex justify-between items-center">
                      <span> Offered </span>
                      <font-awesome-icon
                        :icon="['fas', 'sort']"
                        class="text-sm"
                      />
                    </div>
                  </nftmx-th>
                  <nftmx-th class="text-left" @click="sortTable('EXPIRATION')">
                    <div class="flex justify-between items-center">
                      <span> Expiration </span>
                      <font-awesome-icon
                        :icon="['fas', 'sort']"
                        class="text-sm"
                      />
                    </div>
                  </nftmx-th>
                  <nftmx-th class="text-left"></nftmx-th>
                </nftmx-tr>
              </nftmx-thead>
              <nftmx-tbody>
                <nftmx-tr
                  v-for="(offer, index) in offers"
                  :key="index"
                  class="hover:bg-tertiary-300 transition"
                >
                  <nftmx-td>
                    <router-link
                      :to="{
                        name: 'asset',
                        params: {
                          chain: offer.nft.contract.chain,
                          tokenAddress: offer.nft.contract.address,
                          tokenId: offer.nft.tokenId,
                        },
                      }"
                      target="_blank"
                      class="flex gap-4.5 items-center cursor-pointer"
                    >
                      <div class="w-11 h-11">
                        <nftmx-img
                          :src="offer.nft.imageUrl"
                          class="w-full h-full object-cover"
                        />
                      </div>
                      <nftmx-trim-string :line="2">
                        {{ offer.nft.name || "#" + offer.nft.tokenId }}
                      </nftmx-trim-string>
                    </router-link>
                  </nftmx-td>
                  <nftmx-td>
                    <nftmx-wallet-address-pop
                      tx
                      class="text-primary-900"
                      :address="offer.buyer.walletAddress"
                    />
                  </nftmx-td>
                  <nftmx-td>
                    <div class="flex items-center">
                      <font-awesome-icon
                        v-if="offer.nft.contract?.chain === 'ETHEREUM'"
                        :icon="['fab', 'ethereum']"
                      />
                      <div
                        v-if="offer.nft.contract?.chain === 'BSC-TESTNET'"
                        class="w-3 h-3 fill-white"
                      >
                        <svg viewBox="0 0 24 24">
                          <title>Binance</title>
                          <path
                            d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                          />
                        </svg>
                      </div>
                      <span class="ml-1">
                        {{ roundTo(offer.tokenPrice, 2) }}
                      </span>
                    </div>
                    <div class="text-tertiary-400">
                      [${{
                        roundTo(
                          offer.tokenPrice *
                            coinPrice[getChainKey(offer.nft.contract?.chain)],
                          2
                        )
                      }}]
                    </div>
                  </nftmx-td>
                  <nftmx-td> {{ 100 - offer.protectionRate }}% </nftmx-td>
                  <nftmx-td>
                    {{ roundTo(offer.protectionTime / 86400) }}
                  </nftmx-td>
                  <nftmx-td>
                    {{ offer.useDepository ? "Yes" : "No" }}
                  </nftmx-td>
                  <nftmx-td>
                    ${{
                      roundTo(
                        offer.nft.floorPrice *
                          coinPrice[getChainKey(offer.nft.contract?.chain)],
                        2
                      )
                    }}
                  </nftmx-td>
                  <nftmx-td>
                    <div
                      :class="[
                        !offer.nft.floorPrice ||
                        offer.nft.floorPrice === offer.tokenPrice
                          ? 'text-tertiary-400'
                          : offer.nft.floorPrice > offer.tokenPrice
                          ? 'text-red-700'
                          : 'text-primary-900',
                      ]"
                    >
                      <span>
                        {{
                          offer.nft.floorPrice
                            ? roundTo(
                                ((offer.tokenPrice - offer.nft.floorPrice) /
                                  offer.nft.floorPrice) *
                                  100,
                                2
                              )
                            : "0"
                        }}
                      </span>
                      <span>% </span>
                      <span
                        v-if="
                          offer.nft.floorPrice &&
                          offer.nft.floorPrice !== offer.nft.floorPrice
                        "
                      >
                        {{
                          offer.tokenPrice > offer.nft.contract.floorPrice
                            ? "above"
                            : "below"
                        }}
                      </span>
                    </div>
                  </nftmx-td>
                  <nftmx-td>{{ getDateAgo(offer.createdAt) }}</nftmx-td>
                  <nftmx-td>
                    {{ getDateLeft(offer.endSaleTime * 1000) }}
                  </nftmx-td>
                  <nftmx-td class="w-56">
                    <nftmx-button
                      color="primary"
                      outline
                      label="ACCEPT"
                      class="font-press text-10 h-8.75 w-38 mr-4 text-primary-900"
                      small
                      @click="accept(index, offer.orderId)"
                    />
                    <font-awesome-icon
                      :icon="['fas', 'trash-alt']"
                      class="transition text-tertiary-400 hover:text-red-900 cursor-pointer text-sm"
                      @click="cancelOffer(offer.id)"
                    />
                  </nftmx-td>
                </nftmx-tr>
                <tr v-if="loading">
                  <td colspan="11">
                    <div
                      class="h-96 font-ibm-bold text-tertiary-500 text-lg flex items-center justify-center"
                    >
                      Loading...
                    </div>
                  </td>
                </tr>
                <tr v-if="!loading && offers.length === 0">
                  <td colspan="11">
                    <div
                      class="h-96 font-ibm-bold text-tertiary-500 text-lg flex items-center justify-center"
                    >
                      No Offers found
                    </div>
                  </td>
                </tr>
              </nftmx-tbody>
            </nftmx-table>
          </div>
        </div>
      </div>
      <div class="text-center w-full mt-8">
        <nftmx-button
          v-if="more"
          color="primary"
          label="SEE MORE"
          :outline="true"
          @click="loadMoreOffers"
          class="font-ibm-bold text-lg text-primary-900 w-full sm:w-68"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import Ribbon from "@/core/components/basic/Ribbon.vue";
import Icon from "@/core/components/basic/Icon.vue";
import SaleInfo from "@/core/components/cards/SaleInfo.vue";
import NftmxButton from "@/core/components/basic/NftmxButton.vue";
import { computed, onMounted, ref, watch, watchEffect } from "vue";
import Timer from "@/core/components/timer/Timer.vue";
import moralisService from "@/core/services/moralis.service";
import { MainToken, CHAIN_ROUTES } from "@/core/config/constant";
import { useStore } from "vuex";
import marketService from "@/core/services/market.service";
import BundleImage from "@/core/components/basic/BundleImage.vue";
import NftmxTrimString from "@/core/components/basic/NftmxTrimString.vue";
import Web3 from "web3/dist/web3.min.js";

const props = defineProps({
  token: Object,
});

const store = useStore();
const userId = computed(() => store.getters["auth/userId"]);
const vote = computed(
  () =>
    props.token &&
    props.token.votes &&
    props.token.votes.find((item) =>
      item.id === store.getters["auth/userId"] ? true : false
    )
);
const voteCount = computed(() =>
  props.token && props.token.votes ? props.token.votes.length : 0
);
const card = ref(null);
const transferred = ref("not");
const price = ref(0);
const open = ref(false);
const tokenImage = computed(() => {
  if (props.token.nfts) {
    return props.token.nfts.map((nft) => nft.imageUrl);
  } else {
    return props.token.imageUrl || "";
  }
});

const handleVote = async () => {
  let votedStatus = await marketService.vote(
    userId.value,
    CHAIN_ROUTES.BSC_TESTNET,
    props.token.contract.address,
    props.token.tokenId
  );
  const index = props.token.votes.findIndex((item) => item.id === userId.value);
  if (index > -1) {
    props.token.votes.splice(index, 1);
  } else {
    props.token.votes.push(store.state.user);
  }
};
</script>

<template>
  <div ref="card" class="w-full">
    <div
      class="transition hover:shadow-[0_0px_12px_0px_rgb(0_0_0_/_0.1),_0_0px_0px_0px_rgb(0_0_0_/_0.1);] hover:shadow-primary-700"
      @mouseover="open = true"
      @mouseleave="open = false"
    >
      <div class="relative w-full overflow-hidden pt-73per">
        <bundle-image
          :images="tokenImage"
          class="w-full h-full absolute top-0 left-0 object-cover bg-tertiary-400"
        />
        <ribbon
          v-if="token.order"
          :percent="token.order.protectionRate"
          :period="token.order.protectionTime / 86400"
        />
      </div>
      <div class="relative px-4.5 pt-5.25 pb-4.75 bg-tertiary-700">
        <div class="relative text-white">
          <div class="text-base font-ibm-bold leading-6 pr-2 h-16 ts-width">
            <router-link
              :to="{
                name: 'asset',
                params: {
                  chain: token.chain,
                  tokenAddress: token.contract.address,
                  tokenId: token.tokenId,
                },
              }"
              target="_blank"
              class="cursor-pointer"
            >
              <nftmx-trim-string :line="2">
                {{ token.name || "#" + token.tokenId }}
              </nftmx-trim-string>
            </router-link>
          </div>
          <div class="text-xs flex mt-1.5 absolute right-0 top-0">
            <span class="pr-1 text-tertiary-400">{{ voteCount }}</span>
            <font-awesome-icon
              :icon="['fas', 'thumbs-up']"
              :class="[
                vote ? 'text-primary-900' : 'text-white',
                'cursor-pointer hover:text-primary-900',
              ]"
              @click="handleVote()"
            />
          </div>
        </div>
        <sale-info :transferred="transferred" :value="price" />
        <div class="text-tertiary-400 text-11 text-center relative mt-5.75">
          <div v-if="token.order.orderType === '0'">
            <span> Asking price </span>
            <div class="pt-1.75 w-fit mx-auto max-w-full">
              <span class="text-lg text-primary-900 font-ibm-medium">
                <font-awesome-icon :icon="['fab', 'ethereum']" />
                {{ token.order.tokenPrice }}
              </span>
              <span class="ml-2">[$</span>
              <span>
                {{ token.order.tokenPrice * 200 }}
              </span>
              <span>]</span>
            </div>
          </div>
          <div v-else>
            <span> Current auction ends in </span>
            <div class="pt-2.75 w-fit mx-auto max-w-full">
              <timer
                :time="
                  parseInt(
                    token.order.endSaleTime - new Date().getTime() / 1000 >
                      0
                      ? token.order.endSaleTime -
                          new Date().getTime() / 1000
                      : 0
                  )
                "
              />
            </div>
          </div>
        </div>
        <div
          :class="[
            open ? 'h-15' : 'h-0',
            'absolute overflow-hidden bottom-0 left-0 w-full transition-all',
          ]"
        >
          <nftmx-button
            :to="{
              name: 'asset',
              params: {
                chain: 'BSC-TESTNET',
                tokenAddress: token.contract.address,
                tokenId: token.tokenId,
              },
            }"
            color="primary"
            :label="token.order.orderType === '0' ? 'BUY NOW' : 'BID NOW'"
            class="transition-all w-full font-press text-sm h-15"
            h="lg"
          />
        </div>
      </div>
    </div>
    <div v-if="token.packId" class="px-2 shadow-xl">
      <div class="w-full h-1 bg-primary-200" />
      <div class="px-2">
        <div class="w-full h-1 bg-primary-100" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.ts-width {
  width: calc(100% - theme("spacing[10]"));
}
</style>

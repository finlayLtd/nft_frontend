<script setup>
import { computed, ref, watchEffect } from "vue";
import { useStore } from "vuex";
import { themeConfig, CHAIN_ROUTES } from "@/core/config/constant";
import NftmxWalletAddressPop from "@/core/components/blockchain-address/NftmxWalletAddressPop.vue";
import NftmxDivider from "@/core/components/basic/NftmxDivider.vue";
import FavoritedModal from "./FavoritedModal.vue";
import { useRoute } from "vue-router";
import NftmxTrimString from "@/core/components/basic/NftmxTrimString.vue";
import nftsService from "@/core/services/market/nfts.service";
import { shortenAddress } from "@/core/utils/common";

const props = defineProps({
  asset: Object,
});

const store = useStore();
const route = useRoute();
const userId = computed(() => store.getters["auth/userId"]);
const favoritedByModal = ref(false);
const votePending = ref(false);
const chain = route.params.chain.toUpperCase();

const handleVote = () => {
  if (votePending.value) return;
  votePending.value = true;
  nftsService
    .vote({
      chain: chain,
      userId: userId.value,
      nftId: props.asset.id,
    })
    .then((res) => {
      if (res.data) {
        props.asset.votes.push(store.state.user);
      } else {
        const index = props.asset.votes.findIndex(
          (item) => item.id === userId.value
        );
        props.asset.votes.splice(index, 1);
      }
      votePending.value = false;
    });
};
</script>

<template>
  <div v-if="asset">
    <div class="flex gap-6 justify-between items-center">
      <div class="text-3xl font-ibm-bold leading-none">
        <div
          v-if="asset?.nfts?.length"
          class="-mt-0.5 text-xs text-tertiary-400"
        >
          Bundle of {{ asset.nfts.length }}
        </div>
        <div class="pt-3">
          {{ asset.name || "#" + asset.tokenId }}
        </div>
      </div>
      <div
        class="text:xs md:text-base text-tertiary-400 flex items-center gap-5 font-ibm-medium"
      >
        <span
          @click="favoritedByModal = true"
          class="leading-4 text-lg cursor-pointer hover:text-white transition"
        >
          {{ asset && asset.votes ? asset.votes.length : 0 }}
        </span>
        <font-awesome-icon
          :icon="['fas', 'thumbs-up']"
          :class="[
            votePending ? 'cursor-wait' : 'cursor-pointer',
            asset &&
            asset.votes &&
            asset.votes.findIndex((user) => user.id === store.state.user.id) >
              -1
              ? 'text-primary-900'
              : 'text-white',
            'transition hover:text-primary-900 text-lg md:text-2xl',
          ]"
          @click="handleVote()"
        />
      </div>
    </div>
    <div
      :class="[
        asset.owner?.id === userId ? 'mt-3' : 'mt-6',
        'flex gap-6 justify-between items-center',
      ]"
    >
      <div
        class="flex flex-col sm:flex-row text-11 tracking-wider font-ibm gap-4"
      >
        <div>
          <span class="w-max"> Created by </span>
          <a
            v-if="asset && asset.creator"
            target="_blank"
            :href="'/account/' + asset.creator.walletAddress"
            class="text-primary-900"
          >
            {{
              asset.creator.name || shortenAddress(asset.creator.walletAddress)
            }}
          </a>
        </div>
        <div
          class="border-l border-l-black border-r border-r-tertiary-700 my-0.5"
        />
        <div>
          <span class="w-max"> Owned by </span>
          <a
            v-if="asset && asset.owner"
            target="_blank"
            :href="'/account/' + asset.owner.walletAddress"
            class="text-primary-900"
          >
            {{ asset.owner.name || shortenAddress(asset.owner.walletAddress) }}
          </a>
        </div>
        <div
          class="border-l border-l-black border-r border-r-tertiary-700 my-0.5"
        />
        <div class="flex items-center gap-1.5 w-max">
          <svg viewBox="0 0 28 28" class="w-4.5 h-4.5 fill-white">
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
          <span class="text-primary-900">
            {{ asset.mlrContract?.totalOwnership || 0 }}%
          </span>
          <span class="text-tertiary-400">
            [{{ asset.mlrContract?.owners.length || 0 }} owners]
          </span>
        </div>
      </div>
      <div
        v-if="asset.owner?.id === userId"
        class="font-ibm text-right text-shadow-gray text-xs text-tertiary-400"
      >
        <div>You have 0 pending offers</div>
        <div class="flex items-center justify-end gap-2 text-sm mt-2">
          <span class="ml-2"> Top bid </span>
          <div
            class="svg-shadow-white w-7 h-7 rounded-full flex items-center justify-center -m-2.5"
          >
            <font-awesome-icon
              v-if="chain === 'ETHEREUM'"
              :icon="['fab', 'ethereum']"
              class="text-shadow-gray"
            />
            <div v-if="chain === 'BSC-TESTNET'">
              <svg viewBox="0 0 24 24" class="w-3.5 h-3.5 fill-white">
                <path
                  d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                />
              </svg>
            </div>
          </div>
          <span class="text-white"> 0 </span>
          <span>[$0]</span>
        </div>
      </div>
      <div
        v-else
        class="text-xs md:text-sm text-primary-900 font-ibm-medium tracking-wide text-right"
      >
        {{
          asset && asset.currentOrder
            ? asset.currentOrder.orderType === "0"
              ? "FIXED SALE"
              : "AUCTION"
            : "MAKE AN OFFER"
        }}
      </div>
    </div>
    <favorited-modal v-model="favoritedByModal" :favoriteUsers="asset.votes" />
  </div>
</template>

<style scoped>
.svg-shadow-white {
  background-image: radial-gradient(
    circle at center,
    rgb(255 255 255 / 0%) 0%,
    rgb(255 255 255 / 20%) 30%,
    rgb(255 255 255 / 10%) 40%,
    rgb(255 255 255 / 2%) 60%,
    rgb(0 0 0 / 0) 100%
  );
}
</style>
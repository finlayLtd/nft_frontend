<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useStore } from "vuex";
import Web3 from "web3/dist/web3.min.js";
import NftmxTooltip from "@/core/components/basic/NftmxTooltip.vue";
import VaultModal from "@/core/components/modal/VaultModal.vue";
import { roundTo, shortenAddress } from "@/core/utils/common";
import NftmxButton from "@/core/components/basic/NftmxButton.vue";
import { useRouter } from "vue-router";

defineProps({
  extend: {
    type: Boolean,
    default: false,
  },
  top: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["handle-footer"]);

const router = useRouter();
const disableStatusBar = computed(
  () => router.currentRoute.value.name === "landing"
);
const balance = computed(() => store.state.wallet.balance);
const chainId = computed(() => store.state.wallet.chainId);
const balanceInEth = computed(() => Web3.utils.fromWei(balance.value));
const store = useStore();
const footer = ref();
const windowWidth = computed(() => store.state.app.windowWidth);
const user = computed(() => store.getters["auth/user"]);
const walletAddress = computed(() =>
  user.value
    ? shortenAddress(Web3.utils.toChecksumAddress(user.value.walletAddress))
    : ""
);
const openVaultModal = ref(false);
const coinPrice = computed(
  () =>
    store.state.market.coinPrice[
      chainId.value === "0x1" ? "ETHEREUM" : "BSC_TESTNET"
    ]
);
const vaultModal = ref(null);
const vaultBalance = computed(() =>
  chainId.value === "0x61" && user.value && user.value.bscTestnetVault
    ? user.value.bscTestnetVault.funds
    : 0
);

onMounted(() => {
  emit("handle-footer", footer.value.scrollHeight);
  const observer = new MutationObserver(setFooterHeight);
  observer.observe(footer.value, {
    childList: true,
    subtree: true,
    attributes: true,
  });
});
const setFooterHeight = () => {
  if (footer.value) emit("handle-footer", footer.value.scrollHeight);
};
const openConnectWalletModal = () => {
  store.commit("app/OPEN_CONNECT_WALLET_MODAL");
};
watch(windowWidth, (val) => {
  emit("handle-footer", footer.value.scrollHeight);
});
</script>

<template>
  <div ref="footer" class="bottom-0 w-full font-ibm absolute cursor-default">
    <div v-if="top" class="bg-black text-white pt-6 pb-7 px-8">
      <p
        class="text-center text-sm sm:text-19 text-primary-900 font-press leading-6 sm:leading-9"
      >
        NFT.Protection is a fully decentralized protocol
      </p>
      <div class="text-sm pb-px flex justify-center items-center gap-4">
        <router-link to="/airdrop" class="cursor-pointer">
          Airdrops
        </router-link>
        <div class="border-r border-r-tertiary-700 h-3.5" />
        <span> Reward Program </span>
        <div class="border-r border-r-tertiary-700 h-3.5" />
        <span>
          Gas cost and fees are 100% reimbursable with the NFTPX token
        </span>
      </div>
    </div>
    <div v-if="extend" class="bg-tertiary-900 text-center pt-12">
      <div class="max-w-screen-3xl mx-auto pb-24.25">
        <div class="text-white font-press px-4 pt-8 pb-2 sm:pb-6 lg:pb-11">
          <div class="text-xl sm:text-2xl lg:text-3xl">
            For developers and marketers
          </div>
        </div>
        <div
          class="grid grid-cols-1 lg:grid-cols-4 px-5.5 sm:px-10 md:px-16 lg:px-22 sm:gap-4 lg:gap-10"
        >
          <div class="flex flex-col items-center">
            <img
              v-lazy="'/images/landing/free-whitelabel.png'"
              class="h-25 mb-5.25"
            />
            <div class="text-white font-ibm-medium text-lg py-3">
              Whitelabel
            </div>
            <div class="text-tertiary-400 font-ibm text-xm">
              Build your own NFT.Protection under a new brand and enjoy fees
            </div>
          </div>
          <div class="flex flex-col items-center">
            <img v-lazy="'/images/landing/spinoff.png'" class="h-25 mb-5.25" />
            <div class="text-white font-ibm-medium text-lg py-3">
              Spinoff collection
            </div>
            <div class="text-tertiary-400 font-ibm text-xm">
              Brand your collection for free with your own domain and logo
            </div>
          </div>
          <div class="flex flex-col items-center">
            <img
              v-lazy="'/images/landing/display-us.png'"
              class="h-25 mb-5.25"
            />
            <div class="text-white font-ibm-medium text-lg py-3">
              Display us
            </div>
            <div class="text-tertiary-400 font-ibm text-xm">
              Use our API to display NFTs on your website and enjoy fees
            </div>
          </div>
          <div class="flex flex-col items-center">
            <img
              v-lazy="'/images/landing/become-an-affiliate.png'"
              class="h-25 mb-5.25"
            />
            <div class="text-white font-ibm-medium text-lg py-3">
              Become an affiliate
            </div>
            <div class="text-tertiary-400 font-ibm text-xm">
              Drive traffic to NFT.Protection and enjoy sale fees
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!top" class="bg-black text-white pt-6 pb-7 px-8">
      <p
        class="text-center text-sm sm:text-19 text-primary-900 font-press leading-6 sm:leading-9"
      >
        NFT.Protection is a fully decentralized protocol
      </p>
      <div class="text-sm pb-px flex justify-center items-center gap-4">
        <router-link to="/airdrop" class="cursor-pointer">
          Airdrops
        </router-link>
        <div class="border-r border-r-tertiary-700 h-4" />
        <span> Reward Program </span>
        <div class="border-r border-r-tertiary-700 h-4" />
        <span>
          Gas cost and fees are 100% reimbursable with the NFTPX token
        </span>
      </div>
    </div>
    <div
      class="border-t border-tertiary-900 bg-black px-4 sm:px-8 pt-7 pb-8.5 text-lg font-press text-white text-center"
    >
      100% LTV secured loans for any NFT
    </div>
    <div
      class="border-t border-tertiary-900 bg-black px-4 sm:px-8 pt-2 pb-2.5 text-xs font-ibm-bold"
    >
      <div class="max-w-screen-3xl mx-auto lg:flex justify-between">
        <div class="flex text-tertiary-600 justify-center lg:justify-start">
          <a
            href="https://qwantum.finance/"
            class="w-fit flex items-center"
            target="_blank"
          >
            <span>Powered by:</span>
            <img
              v-lazy="'/images/logo/atom-logo-footer.png'"
              class="h-12.5 ml-2.5"
            />
          </a>
        </div>
        <div class="flex gap-1 items-center text-tertiary-600 text-base">
          <img src="/images/components/social1.png" />
          <img src="/images/components/social2.png" />
          <font-awesome-icon :icon="['fab', 'telegram-plane']" class="ml-1" />
          <font-awesome-icon :icon="['fab', 'discord']" class="ml-2" />
          <font-awesome-icon :icon="['fab', 'twitter']" class="ml-2" />
        </div>
        <router-link
          to="/evm"
          class="flex justify-center items-center text-tertiary-600"
        >
          <span> Supporting Blockchains: </span>
          <font-awesome-icon :icon="['fab', 'ethereum']" class="text-lg mx-2" />
          <span> 300+ EVM </span>
        </router-link>
      </div>
    </div>
    <div v-if="!disableStatusBar" class="3xl:h-17"></div>
    <div class="3xl:fixed bottom-0 w-full z-30">
      <div
        v-if="!disableStatusBar"
        class="max-w-screen-3xl mx-auto 3xl:flex flex-wrap justify-between bg-tertiary-350 font-ibm text-sm text-center"
      >
        <router-link to="/airdrop" class="relative">
          <div
            class="bg-primary-900 hover:bg-tertiary-250 text-black hover:text-primary-900 transition cursor-pointer font-ibm-semi-bold py-3 px-6"
          >
            <div class="text-13 tracking-tighter">Available rewards</div>
            <div class="flex mx-auto items-center justify-center mt-1 w-max">
              <span> P2P:250% </span>
              <div class="border-l border-tertiary-600 h-3.5 mx-1.5" />
              <span> P2C:7.81% </span>
              <div class="border-l border-tertiary-600 h-3.5 mx-1.5" />
              <span> Vault:25.53% </span>
            </div>
          </div>
          <div
            class="hidden 3xl:block absolute top-0 left-full w-6 h-full bg-gradient-to-r from-black to-tertiary-350"
          />
        </router-link>
        <div class="text-tertiary-400 font-ibm-medium py-3">
          <div class="text-13 tracking-tighter">Your investments</div>
          <div
            v-if="user && user.walletAddress"
            class="mt-1 mx-auto w-max flex items-center"
          >
            <font-awesome-icon
              v-if="chainId === '0x1'"
              :icon="['fab', 'ethereum']"
              class="text-white"
            />
            <div v-if="chainId === '0x61'" class="w-3.5 h-3.5 fill-white">
              <svg viewBox="0 0 24 24">
                <path
                  d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                />
              </svg>
            </div>
            <span class="text-white ml-1"> 1.12532</span>
            <span class="font-ibm">[$1.52K]</span>
          </div>
          <div v-else>-</div>
        </div>
        <div
          class="my-4 border-l border-l-black border-r border-r-tertiary-700"
        />
        <div class="text-tertiary-400 font-ibm-medium py-3">
          <div class="text-13 tracking-tighter">Airdrop rewards</div>
          <div
            v-if="user && user.walletAddress"
            class="mt-1 mx-auto w-max flex items-center"
          >
            <font-awesome-icon
              v-if="chainId === '0x1'"
              :icon="['fab', 'ethereum']"
              class="text-primary-900"
            />
            <div v-if="chainId === '0x61'" class="w-3.5 h-3.5 fill-primary-900">
              <svg viewBox="0 0 24 24">
                <path
                  d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                />
              </svg>
            </div>
            <span class="text-primary-900 ml-1"> 1.12532</span>
            <span class="font-ibm">[$1.52K]</span>
          </div>
          <div v-else>-</div>
        </div>
        <div
          class="my-4 border-l border-l-black border-r border-r-tertiary-700"
        />
        <div class="text-tertiary-400 font-ibm-medium py-3">
          <div class="w-max text-13 tracking-tighter mx-auto">
            Market making gain
          </div>
          <div
            v-if="user && user.walletAddress"
            class="mt-1 mx-auto flex items-center"
          >
            <font-awesome-icon
              v-if="chainId === '0x1'"
              :icon="['fab', 'ethereum']"
              class="text-primary-900"
            />
            <div v-if="chainId === '0x61'" class="w-3.5 h-3.5 fill-primary-900">
              <svg viewBox="0 0 24 24">
                <path
                  d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                />
              </svg>
            </div>
            <span class="text-primary-900 ml-1"> 1.12532</span>
            <span class="font-ibm">[$1.52K]</span>
          </div>
          <div v-else>-</div>
        </div>
        <div
          class="my-4 border-l border-l-black border-r border-r-tertiary-700"
        />
        <div class="text-tertiary-400 font-ibm-medium py-3">
          <div class="w-max text-13 tracking-tighter mx-auto">
            Multilevel ownership gain
          </div>
          <div
            v-if="user && user.walletAddress"
            class="mt-1 mx-auto flex items-center w-fit"
          >
            <font-awesome-icon
              v-if="chainId === '0x1'"
              :icon="['fab', 'ethereum']"
              class="text-primary-900"
            />
            <div v-if="chainId === '0x61'" class="w-3.5 h-3.5 fill-primary-900">
              <svg viewBox="0 0 24 24">
                <path
                  d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                />
              </svg>
            </div>
            <span class="text-primary-900 ml-1"> 1.12532</span>
            <span class="font-ibm">[$1.52K]</span>
          </div>
          <div v-else>-</div>
        </div>
        <div
          class="my-4 border-l border-l-black border-r border-r-tertiary-700"
        />
        <div class="text-tertiary-400 font-ibm-medium py-3">
          <div class="w-max text-13 tracking-tighter mx-auto">ROI to date</div>
          <div v-if="user && user.walletAddress" class="mt-1 mx-auto">
            <span class="text-primary-900"> 24.56% </span>
          </div>
          <div v-else>-</div>
        </div>
        <div
          class="my-4 border-l border-l-black border-r border-r-tertiary-700"
        />
        <div class="text-tertiary-400 font-ibm-medium py-3">
          <div class="w-max mx-auto">
            <font-awesome-icon
              @click="
                () => {
                  openVaultModal = true;
                  vaultModal.tab = 'REMOVE';
                }
              "
              :icon="['fas', 'minus-circle']"
              class="text-red-700 transition hover:text-red-900 cursor-pointer"
            />
            <span class="text-13 tracking-tighter"> Vault balance </span>
            <font-awesome-icon
              @click="
                () => {
                  openVaultModal = true;
                  vaultModal.tab = 'ADD';
                }
              "
              :icon="['fas', 'plus-circle']"
              class="text-primary-700 transition hover:text-primary-900 cursor-pointer"
            />
          </div>
          <div
            v-if="user && user.walletAddress"
            class="mt-1 mx-auto flex items-center w-fit"
          >
            <font-awesome-icon
              v-if="chainId === '0x1'"
              :icon="['fab', 'ethereum']"
              class="text-white"
            />
            <div v-if="chainId === '0x61'" class="w-3.5 h-3.5 fill-white">
              <svg viewBox="0 0 24 24">
                <path
                  d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                />
              </svg>
            </div>
            <span class="text-white ml-2">
              {{ roundTo(vaultBalance) }}
            </span>
            <span class="font-ibm">
              [${{
                roundTo(vaultBalance * coinPrice, 2).toLocaleString("en-US", {
                  notation: "compact",
                  compactDisplay: "short",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                })
              }}]
            </span>
          </div>
          <div v-else>-</div>
        </div>
        <div
          class="flex gap-3 text-tertiary-400 font-ibm-medium py-3 justify-center"
        >
          <font-awesome-icon
            :icon="['fas', 'angle-double-left']"
            class="text-lg text-primary-900 my-auto"
          />
          <div class="w-max">
            <div
              @click="openVaultModal = true"
              class="text-primary-900 cursor-pointer"
            >
              Deposit to the vault
              <nftmx-tooltip
                text="Your self-custody vault serves as both a funding source and collateral, allowing you to make as many offers as you wish without paying any gas fees until they are accepted. Furthermore, you can earn APY rewards on the funds you have stored in the vault."
              >
                <sup>
                  <font-awesome-icon
                    :icon="['fas', 'question-circle']"
                    class="text-10 cursor-pointer"
                  />
                </sup>
              </nftmx-tooltip>
            </div>
            <div class="mt-1">
              <span> Gain 25.53% APY </span>
            </div>
          </div>
        </div>
        <div
          v-if="user && user.walletAddress"
          class="text-tertiary-400 font-ibm-medium py-3 pr-6"
        >
          <div>
            {{ walletAddress }}
          </div>
          <div class="mt-1 flex items-center">
            <font-awesome-icon
              v-if="chainId === '0x1'"
              :icon="['fab', 'ethereum']"
              class="text-white"
            />
            <div v-if="chainId === '0x61'" class="w-3.5 h-3.5 fill-white">
              <svg viewBox="0 0 24 24">
                <path
                  d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                />
              </svg>
            </div>
            <span class="text-white ml-2"> {{ roundTo(balanceInEth) }}</span>
            <span class="font-ibm">
              [${{
                roundTo(balanceInEth * coinPrice, 2).toLocaleString("en-US", {
                  notation: "compact",
                  compactDisplay: "short",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                })
              }}]
            </span>
          </div>
        </div>
        <div v-else class="flex items-center pr-6 font-ibm-bold justify-center">
          <nftmx-button
            color="gray"
            outline
            textColor="tertiary-400"
            label="Connect Wallet"
            h="sm"
            @click="openConnectWalletModal"
          />
        </div>
      </div>
    </div>
    <vault-modal v-model="openVaultModal" ref="vaultModal" />
  </div>
</template>

<style scoped>
.text-xm {
  font-size: 0.81rem;
  line-height: 1.5rem;
}
.text-19 {
  font-size: 19px;
  line-height: 28px;
}
</style>

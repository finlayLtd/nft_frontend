<script setup>
import NftmxSummaryContainer from "@/core/container/NftmxSummaryContainer.vue";
import {
  computed,
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  watchEffect,
} from "vue";
import { useStore } from "vuex";
import { themeConfig, defaultUser } from "@/core/config/constant";
import NftmxWalletAddress from "@/core/components/blockchain-address/NftmxWalletAddress.vue";
import { useToast } from "vue-toastification";
import NftmxImg from "@/core/components/basic/NftmxImg.vue";
import Web3 from "web3/dist/web3.min.js";
import NftmxButton from "@/core/components/basic/NftmxButton.vue";
import { useRoute } from "vue-router";
import FollowersModal from "./components/FollowersModal.vue";
import FollowingModal from "./components/FollowingModal.vue";
import usersService from "@/core/services/market/users.service";
import { defaultPagination } from "@/core/config/constant";
import { shortenAddress } from "@/core/utils/common";
import { io } from "socket.io-client";
const socket = io(import.meta.env.VITE_APP_SERVER_URL);

const props = defineProps({
  account: Object,
});

const store = useStore();
const route = useRoute();
const accountAddress = computed(() => props.account?.walletAddress);
const routeAddress = computed(() => route.params.address.toLowerCase());
const toast = useToast();
const walletAddress = computed(() => store.getters["auth/walletAddress"]);
const profileImg = ref();
const profileBanner = ref();
const name = ref();
const username = ref();
const joinedDate = ref();
const user = computed(() => store.getters["auth/user"]);
const followerModal = ref(false);
const followingModal = ref(false);
const loading = ref(false);
const iFollowing = ref(false);
const followStats = ref({ followers: 0, following: 0 });

watchEffect(() => {
  if (props.account) {
    profileBanner.value =
      props.account.profile_banner || defaultUser.profile_banner;
    profileImg.value =
      props.account.id === user.value.id
        ? user.value.profile_img || defaultUser.profile_img
        : props.account.profile_img || defaultUser.profile_img;
    name.value = props.account.name || defaultUser.name;
    username.value = props.account.username || null;
    const joined = new Date(props.account.createdAt);
    joinedDate.value =
      joined.toLocaleString("default", { month: "long" }) +
      " " +
      joined.getFullYear();
  }
});

const onCopy = (e) => {
  toast.success("Wallet Address is copied");
};

const checkFollowing = () => {
  if (!walletAddress.value) return;
  usersService
    .checkFollowing(
      walletAddress.value,
      routeAddress.value ? accountAddress.value : walletAddress.value
    )
    .then((res) => {
      iFollowing.value = res.data.isFollowing;
      followStats.value = res.data.followStats;
    });
};
onMounted(() => {
  if (accountAddress.value) {
    checkFollowing();
  }
});
watch(accountAddress, (val, oldVal) => {
  if (oldVal) {
    socket.removeListener(`update-follow-stats/${oldVal}`);
  }
  if (val) {
    checkFollowing();
    socket.on(`update-follow-stats/${val}`, (res) => {
      followStats.value = res;
    });
  }
});
watch(walletAddress, (val) => {
  if (routeAddress.value && accountAddress.value) {
    checkFollowing();
  }
});
const follow = () => {
  if (!walletAddress.value) {
    toast.error("Please connect wallet first");
    return;
  }
  loading.value = true;
  usersService
    .follow(walletAddress.value, accountAddress.value)
    .then((res) => {
      iFollowing.value = true;
    })
    .finally(() => {
      loading.value = false;
    });
};
const unfollow = () => {
  if (!walletAddress.value) {
    toast.error("Please connect wallet first");
    return;
  }
  loading.value = true;
  usersService
    .unfollow(walletAddress.value, accountAddress.value)
    .then((res) => {
      iFollowing.value = false;
    })
    .finally(() => {
      loading.value = false;
    });
};
onBeforeUnmount(() => {
  socket.removeAllListeners();
});
</script>

<template>
  <nftmx-summary-container :img_url="profileBanner">
    <div class="flex">
      <div class="">
        <nftmx-img
          :src="profileImg"
          class="w-24 h-24 mt-14.5 sm:mt-10.5 xl:mt-12.75 sm:w-50 sm:h-50 object-cover bg-transparent object-center"
        />
      </div>
      <div class="ml-5.75 md:ml-13 mt-10 xl:mt-12.5">
        <div
          class="flex font-press text-md sm:text-lg md:text-3xl leading-loose text-white w-max"
        >
          {{ name }}
        </div>
        <div class="font-ibm text-sm text-white w-max mt-1.5">
          {{ "@" + username }}
        </div>
        <div class="flex font-ibm text-sm pb-1.5 md:pb-4 mt-1.75 sm:mt-2.5">
          <a
            v-if="account"
            :href="`https://bscscan.com/address/${account.walletAddress}`"
            target="_blank"
            class="text-primary-900"
          >
            {{
              store.state.app.windowWidth > themeConfig.sm
                ? Web3.utils.toChecksumAddress(account.walletAddress)
                : shortenAddress(
                    Web3.utils.toChecksumAddress(account.walletAddress)
                  )
            }}
          </a>
        </div>
        <div class="font-ibm text-11 md:text-sm pb-px text-white">
          Joined {{ joinedDate }}
        </div>
        <div class="mt-4.75 md:mt-6 flex">
          <div
            class="flex text-sm text-white cursor-pointer border border-black divide-x divide-black"
          >
            <div
              class="transition h-7.5 px-2.25 pt-1 hover:bg-primary-900 bg-tertiary-800"
              v-clipboard:copy="account ? account.walletAddress : ''"
              v-clipboard:success="onCopy"
            >
              <font-awesome-icon :icon="['fas', 'copy']" />
            </div>

            <a
              v-if="account && account.website"
              :href="account.website"
              target="_blank"
              class="transition h-7.5 px-2 pt-1 hover:bg-primary-900 bg-tertiary-800"
            >
              <font-awesome-icon :icon="['fas', 'globe']" />
            </a>
            <a
              v-if="account && account.twitter"
              :href="account.twitter"
              target="_blank"
              class="transition h-7.5 px-2.25 pt-1 hover:bg-primary-900 bg-tertiary-800"
            >
              <font-awesome-icon :icon="['fab', 'twitter']" />
            </a>
            <a
              v-if="account && account.instagram"
              :href="account.instagram"
              target="_blank"
              class="transition h-7.5 px-2 pt-1 hover:bg-primary-900 bg-tertiary-800"
            >
              <font-awesome-icon :icon="['fab', 'instagram']" />
            </a>
            <router-link
              v-if="account && account.id === user.id"
              to="/account-setting"
              class="transition h-7.5 px-2 pt-1 hover:bg-primary-900 bg-tertiary-800"
            >
              <font-awesome-icon :icon="['fas', 'cog']" />
            </router-link>
          </div>
        </div>
      </div>
      <div
        class="font-ibm hidden xl:flex flex-col flex-auto justify-center items-end text-sm"
      >
        <div>
          <span class="text-white"> Total ROI: </span>
          <span class="text-primary-900">
            ${{ (12786.63).toLocaleString() }}
          </span>
          <span class="text-white ml-4"> Total APY reward: </span>
          <span class="text-primary-900">
            ${{ (4586.63).toLocaleString() }}
          </span>
        </div>
        <div class="mt-2.5">
          <span class="text-white"> Followers: </span>
          <span
            class="text-primary-900 cursor-pointer"
            @click="followerModal = true"
          >
            {{ followStats.followers.toLocaleString() }}
          </span>
          <span class="text-white ml-4"> Following: </span>
          <span
            class="text-primary-900 cursor-pointer"
            @click="followingModal = true"
          >
            {{ followStats.following.toLocaleString() }}
          </span>
        </div>
        <div v-if="account && account.id !== user.id" class="mt-6.5">
          <nftmx-button
            color="primary"
            outline
            textColor="white"
            :label="iFollowing ? 'Unfollow' : 'Follow'"
            h="sm"
            class="px-8"
            customPx
            @click="iFollowing ? unfollow() : follow()"
            :loading="loading"
          />
        </div>
      </div>
    </div>
    <followers-modal
      v-if="followerModal"
      v-model="followerModal"
      :account="account"
    />
    <following-modal
      v-if="followingModal"
      v-model="followingModal"
      :account="account"
    />
  </nftmx-summary-container>
</template>

<script setup>
import { $vfm } from "vue-final-modal";
import NftmxImg from "@/core/components/basic/NftmxImg.vue";
import { shortenAddress } from "@/core/utils/common";
import NftmxButton from "@/core/components/basic/NftmxButton.vue";
import NftmxTrimString from "@/core/components/basic/NftmxTrimString.vue";
import { computed, onMounted, ref, watch } from "vue";
import usersService from "@/core/services/market/users.service";
import { useStore } from "vuex";
import { useToast } from "vue-toastification";
import { useRoute } from "vue-router";

const props = defineProps({
  account: Object,
});

const toast = useToast();
const scrollComponent = ref(null);
const store = useStore();
const route = useRoute();
const userInfo = computed(() => store.getters["auth/user"]);
const walletAddress = computed(() => store.getters["auth/walletAddress"]);
const loading = ref(false);
const following = ref({ count: 0, users: [], cursor: null });
const routeAddress = computed(() => route.params.address.toLowerCase());
const accountAddress = computed(() => props.account?.walletAddress);

const cancel = () => {
  $vfm.hide("follwersModal");
};
const retrieveFollowing = () => {
  usersService
    .following(
      routeAddress.value ? accountAddress.value : walletAddress.value,
      {
        walletAddress: walletAddress.value,
        cursor: following.value.cursor,
        limit: 20,
      }
    )
    .then((res) => {
      following.value = {
        count: res.data.count,
        users: [...following.value.users, ...res.data.users],
        cursor: res.data.cursor,
      };
      loading.value = false;
    });
};
const initFollowing = () => {
  following.value = { count: 0, users: [], cursor: null };
  retrieveFollowing();
};
const handleScroll = (e) => {
  if (loading.value || !props.following?.cursor) {
    return;
  }
  const scrollHeight = scrollComponent.value.scrollHeight;
  const scrollTop = scrollComponent.value.scrollTop;
  const offsetHeight = scrollComponent.value.offsetHeight;

  if (scrollTop + offsetHeight >= scrollHeight) {
    loading.value = true;
    retrieveFollowing();
  }
};
const follow = (user) => {
  if (!walletAddress.value) {
    toast.error("Please connect wallet first");
    return;
  }
  usersService
    .follow(walletAddress.value, user.walletAddress)
    .then((res) => {
      const index = following.value.users.findIndex(
        (item) => item.id === user.id
      );
      following.value.users[index].followers = [userInfo.value];
    })
    .finally(() => {});
};
const unfollow = (user) => {
  if (!walletAddress.value) {
    toast.error("Please connect wallet first");
    return;
  }
  usersService
    .unfollow(walletAddress.value, user.walletAddress)
    .then((res) => {
      const index = following.value.users.findIndex(
        (item) => item.id === user.id
      );
      following.value.users[index].followers = [];
    })
    .finally(() => {});
};
onMounted(() => {
  if (accountAddress.value) {
    initFollowing();
  }
});
watch(walletAddress, (val) => {
  if (accountAddress.value) {
    initFollowing();
  }
});
</script>

<template>
  <vue-final-modal
    classes="w-full flex items-center justify-center"
    :overlay-style="{ backgroundColor: 'black', opacity: '0.9' }"
    name="follwersModal"
    esc-to-close
    fit-parent
  >
    <div class="relative bg-tertiary-900 text-white overflow-auto w-90vw">
      <div class="text-right text-[22px] leading-none p-6.5 w-full">
        <span
          class="cursor-pointer hover:text-red-900 transition"
          @click="cancel"
        >
          &#10005;
        </span>
      </div>
      <div class="text-center font-press text-2xl">Following List</div>
      <div
        ref="scrollComponent"
        @scroll="handleScroll"
        class="overflow-auto max-h-80vh m-14 font-ibm"
      >
        <div
          v-for="(user, index) in following?.users"
          :key="index"
          :class="[
            index % 2 ? 'bg-tertiary-900' : 'bg-tertiary-350',
            'flex justify-between items-center p-7 min-w-[1250px]',
          ]"
        >
          <div class="text-center text-sm w-8">#{{ index + 1 }}</div>
          <div class="flex justify-between w-2/5">
            <div class="flex items-center gap-6">
              <div class="w-16 h-16">
                <nftmx-img :src="user.profile_img" class="w-full h-full" />
              </div>
              <div class="flex-1">
                <div class="font-ibm-bold text-2xl">
                  <nftmx-trim-string :line="1">
                    {{ user.name || "Unnamed" }}
                  </nftmx-trim-string>
                </div>
                <div class="text-11 mt-1">
                  <a
                    target="_blank"
                    :href="'/account/' + user.walletAddress"
                    class="text-tertiary-400 font-ibm-medium"
                  >
                    {{ shortenAddress(user.walletAddress) }}
                  </a>
                </div>
              </div>
            </div>
            <div class="flex text-sm py-3 gap-5 text-tertiary-400">
              <a v-if="user.website" :href="user.website" target="_blank">
                <font-awesome-icon
                  :icon="['fas', 'globe']"
                  class="cursor-pointer hover:text-white transition"
                />
              </a>
              <a v-if="user.twitter" :href="user.twitter" target="_blank">
                <font-awesome-icon
                  :icon="['fab', 'twitter']"
                  class="cursor-pointer hover:text-white transition"
                />
              </a>
              <a v-if="user.medium" :href="user.medium" target="_blank">
                <font-awesome-icon
                  :icon="['fab', 'medium-m']"
                  class="cursor-pointer hover:text-white transition"
                />
              </a>
              <a v-if="user.telegram" :href="user.telegram" target="_blank">
                <font-awesome-icon
                  :icon="['fab', 'telegram-plane']"
                  class="cursor-pointer hover:text-white transition"
                />
              </a>
              <a v-if="user.discord" :href="user.discord" target="_blank">
                <font-awesome-icon
                  :icon="['fab', 'discord']"
                  class="cursor-pointer hover:text-white transition"
                />
              </a>
              <a v-if="user.instagram" :href="user.instagram" target="_blank">
                <font-awesome-icon
                  :icon="['fab', 'instagram']"
                  class="cursor-pointer hover:text-white transition"
                />
              </a>
            </div>
          </div>
          <div>
            <div
              class="border-l border-l-black border-r border-r-tertiary-800 h-10 w-0 mx-1"
            />
          </div>
          <div class="w-1/5">
            <div class="text-sm font-ibm-medium">
              <div>
                <span> Collections: </span>
                <span class="text-primary-900"> {{ user.items }} </span>
              </div>
              <div class="mt-1">
                <span> Subcollections: </span>
                <span class="text-primary-900"> {{ user.subItems }} </span>
              </div>
            </div>
          </div>
          <div>
            <div
              class="border-l border-l-black border-r border-r-tertiary-800 h-10 w-0 mx-1"
            />
          </div>
          <div class="w-1/5">
            <div class="text-sm font-ibm-medium">
              <div>
                <span> Total ROI: </span>
                <span class="text-primary-900"> $12,786.63 </span>
              </div>
              <div class="mt-1">
                <span> NFTmx voting rights: </span>
                <span class="text-primary-900"> 1.23% </span>
              </div>
            </div>
          </div>
          <div>
            <button
              v-if="user.followers?.length"
              class="font-ibm-medium text-sm px-5.5 shadow-default shadow-tertiary-400 border-2 border-tertiary-400 hover:bg-tertiary-400 transition h-8.75"
              @click="unfollow(user)"
            >
              Unfollow
            </button>
            <nftmx-button
              v-else
              outline
              color="primary"
              textColor="white"
              label="Follow"
              h="sm"
              class="font-ibm text-sm px-7.5"
              customPx
              @click="follow(user)"
            />
          </div>
        </div>
        <div v-if="following?.cursor" class="text-center mt-4">Loading...</div>
      </div>
    </div>
  </vue-final-modal>
</template>

<style scoped>
.max-h-80vh {
  max-height: calc(80vh - theme("spacing[10]"));
}
.w-90vw {
  width: 90vw;
}
@media (min-width: 640px) {
  .sm\:w-modal-sm {
    width: 550px;
  }
}
</style>

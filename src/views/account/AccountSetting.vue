<script setup>
import { computed, onMounted, ref, watchEffect } from "vue";
import { useStore } from "vuex";
import BodyContainer from "@/core/container/BodyContainer.vue";
import NftmxFooter from "@/core/container/NftmxFooter.vue";
import NftmxSelectNetwork from "@/core/components/basic/NftmxSelectNetwork.vue";
import SettingItemRow from "@/core/components/basic/SettingItemRow.vue";
import NftmxFileUploader from "@/core/components/file-uploader/NftmxFileUploader.vue";
import NftmxTextarea from "@/core/components/basic/NftmxTextarea.vue";
import NftmxButton from "@/core/components/basic/NftmxButton.vue";
import { defaultUser } from "@/core/config/constant";
import { useToast } from "vue-toastification";
import { emailValidate, prefixUrl } from "@/core/utils/common";
import NftmxIconInput from "@/core/components/basic/NftmxIconInput.vue";
import AccountImage from "./components/AccountImage.vue";
import AccountBanners from "./components/AccountBanner.vue";
import { useRouter } from "vue-router";

const store = useStore();
const router = useRouter();
const walletAddress = computed(() => store.getters["auth/walletAddress"]);
const name = ref("");
const username = ref("");
const profileImg = ref("");
const originProfileImg = ref("");
const profileBanner = ref("");
const originProfileBanner = ref("");
const bio = ref("");
const email = ref("");
const website = ref("");
const twitter = ref("");
const instagram = ref("");
const toast = useToast();
const isEmail = ref(true);

function save() {
  const user = new FormData();
  user.append("name", name.value);
  user.append("username", username.value);
  profileImg.value && profileImg.value.length > 0
    ? user.append("profileImg", profileImg.value[0].file)
    : user.append("profile_img", originProfileImg.value);
  profileBanner.value && profileBanner.value.length > 0
    ? user.append("profileBanner", profileBanner.value[0].file)
    : user.append("profile_banner", originProfileBanner.value);
  user.append("bio", bio.value);
  user.append("email", email.value);
  user.append("website", prefixUrl(website.value));
  user.append("twitter", prefixUrl(twitter.value));
  user.append("instagram", prefixUrl(instagram.value));
  store.dispatch("auth/saveProfile", user).then((res) => {
    toast.success("Profile saved successfully!");
    router.push("/account/" + walletAddress.value);
  });
}

watchEffect(() => {
  const user = store.getters["auth/user"];
  if (user) {
    name.value = user.name;
    username.value = user.username;
    bio.value = user.bio;
    email.value = user.email;
    website.value = user.website;
    twitter.value = user.twitter;
    instagram.value = user.instagram;
    originProfileImg.value = user.profile_img;
    originProfileBanner.value = user.profile_banner;
  }
});

const onCopy = (e) => {
  toast.success("Wallet Address is copied");
};
const removeOriginProfileImg = () => {
  originProfileImg.value = "";
};
const removeOriginProfileBanner = () => {
  originProfileBanner.value = "";
};
</script>

<template>
  <body-container>
    <div class="mt-10.75 mb-2.5 text-white text-center">
      <div class="col-span-2 font-press text-xl md:text-2.5xl 2xl:text-3xl">
        Profile Settings
      </div>
    </div>
    <div>
      <setting-item-row class>
        <template v-slot:item>
          <div class="font-ibm-bold text-lg pt-3.5">Full name</div>
        </template>
        <template v-slot:value>
          <div class="font-ibm text-sm text-tertiary-400 mt-3 md:mt-0">
            <nftmx-icon-input v-model="name" />
          </div>
        </template>
      </setting-item-row>
      <setting-item-row class>
        <template v-slot:item>
          <div class="font-ibm-bold text-lg pt-3.5">Username</div>
        </template>
        <template v-slot:value>
          <div class="font-ibm text-sm text-tertiary-400 mt-3 md:mt-0">
            <nftmx-icon-input v-model="username" />
          </div>
        </template>
      </setting-item-row>
      <account-image
        v-model="profileImg"
        :originImage="originProfileImg"
        @remove-origin="removeOriginProfileImg"
      />
      <account-banners
        v-model="profileBanner"
        :originImage="originProfileBanner"
        @remove-origin="removeOriginProfileBanner"
      />
      <setting-item-row class="mt-10">
        <template v-slot:item>
          <div class="font-ibm-bold text-lg pt-2.25">Bio</div>
          <div class="font-ibm-medium text-sm text-tertiary-500 pt-2">
            Tell the world your story!
          </div>
        </template>
        <template v-slot:value>
          <div
            class="font-ibm text-sm text-tertiary-400 h-37.5 mt-4.75 md:mt-0"
          >
            <nftmx-textarea v-model="bio" class="h-37.5" />
          </div>
        </template>
      </setting-item-row>
      <setting-item-row>
        <template v-slot:item>
          <div class="font-ibm-bold text-lg pt-3.5">Email Address</div>
        </template>
        <template v-slot:value>
          <div class="relative font-ibm text-sm text-tertiary-400 pt-3 md:pt-0">
            <nftmx-icon-input v-model="email" />
            <div
              v-if="email && !emailValidate(email)"
              class="absolute font-ibm text-11 text-red-900 mt-1"
            >
              Please enter valid email
            </div>
          </div>
        </template>
      </setting-item-row>
      <setting-item-row class="mt-9.75">
        <template v-slot:item>
          <div class="font-ibm-bold text-lg pt-3.5">Links</div>
        </template>
        <template v-slot:value>
          <div class="font-ibm text-sm text-tertiary-400 pt-4 md:pt-0">
            <div>
              <nftmx-icon-input
                v-model="website"
                iconGroup="fas"
                icon="globe"
                placeholder="Your website"
              />
            </div>
            <div class="pt-4.75">
              <nftmx-icon-input
                v-model="twitter"
                iconGroup="fab"
                icon="twitter"
                placeholder="Your twitter profile"
              />
            </div>
            <div class="pt-4.75">
              <nftmx-icon-input
                v-model="instagram"
                iconGroup="fab"
                icon="instagram"
                placeholder="Your instagram profile"
              />
            </div>
          </div>
        </template>
      </setting-item-row>
      <setting-item-row class="mt-9.75">
        <template v-slot:item>
          <div class="font-ibm-bold text-lg pt-3.5">Wallet Address</div>
        </template>
        <template v-slot:value>
          <div
            class="flex font-ibm text-sm text-tertiary-400 mt-3 md:mt-0 cursor-default"
          >
            <div class="w-full">
              <nftmx-icon-input :placeholder="walletAddress" readonly />
            </div>
            <div
              class="text-white hover:text-primary-900 text-base right-6 top-4 cursor-pointer float-right w-fit -ml-9 mt-4"
              v-clipboard:copy="walletAddress"
              v-clipboard:success="onCopy"
            >
              <font-awesome-icon :icon="['fas', 'copy']" />
            </div>
          </div>
        </template>
      </setting-item-row>
    </div>
    <div class="mt-7.5 md:mt-25 mb-11 md:mb-20.75 flex justify-center">
      <nftmx-button
        color="primary"
        label="SAVE"
        class="font-press w-btn-xl text-sm md:text-lg left-0 bottom-0 h-15 md:h-17.75"
        @click="save()"
      ></nftmx-button>
    </div>
  </body-container>
</template>

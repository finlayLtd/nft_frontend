<script setup>
import { computed, onMounted, ref, watch, watchEffect } from "vue";
import { useStore } from "vuex";
import BodyContainer from "@/core/container/BodyContainer.vue";
import NftmxFooter from "@/core/container/NftmxFooter.vue";
import NftmxSelectNetwork from "@/core/components/basic/NftmxSelectNetwork.vue";
import SettingItemRow from "@/core/components/basic/SettingItemRow.vue";
import NftmxFileUploader from "@/core/components/file-uploader/NftmxFileUploader.vue";
import NftmxIconInput from "@/core/components/basic/NftmxIconInput.vue";
import NftmxTextarea from "@/core/components/basic/NftmxTextarea.vue";
import NftmxButton from "@/core/components/basic/NftmxButton.vue";
import { useToast } from "vue-toastification";
import NftmxToggle from "@/core/components/basic/NftmxToggle.vue";
import { useRoute, useRouter } from "vue-router";
import marketService from "@/core/services/market.service";
import LogoImage from "./collection-setting/LogoImage.vue";
import FeaturedImage from "./collection-setting/FeaturedImage.vue";
import BannerImage from "./collection-setting/BannerImage.vue";

const store = useStore();
const route = useRoute();
const router = useRouter();
const chain = route.params.chain;
const contractAddress = route.params.contractAddress;
const walletAddress = computed(() => store.getters["auth/walletAddress"]);
const name = ref();
const logo = ref();
const originLogo = ref();
const featuredImg = ref();
const originFeaturedImg = ref();
const bannerImg = ref();
const originBannerImg = ref();
const description = ref();
const customUrl = ref();
const website = ref();
const twitter = ref();
const medium = ref();
const telegram = ref();
const discord = ref();
const instagram = ref();
const toast = useToast();
const theme = ref("");
const explicitContent = ref(false);
const contract = ref({});
const onSaving = ref(false);

onMounted(() => {
  marketService.getContract(chain, contractAddress, false).then((res) => {
    contract.value = res.data;
    name.value = res.data.name;
    description.value = res.data.description;
    originLogo.value = res.data.logoUrl;
    originBannerImg.value = res.data.bannerUrl;
    originFeaturedImg.value = res.data.imageUrl;
    customUrl.value = res.data.customUrl;
    website.value = res.data.website;
    twitter.value = res.data.twitter;
    medium.value = res.data.medium;
    telegram.value = res.data.telegram;
    discord.value = res.data.discord;
    instagram.value = res.data.instagram;
    theme.value = res.data.theme;
    explicitContent.value = res.data.explicit === "true" ? true : false;
  });
});

const removeOriginFeaturedImg = () => {
  originFeaturedImg.value = "";
};
const removeOriginBanner = () => {
  originBannerImg.value = "";
};
const removeOriginLogo = () => {
  originLogo.value = "";
};
function save() {
  if (onSaving.value) return;
  onSaving.value = true;
  const collection = new FormData();
  collection.append("name", name.value);
  logo.value && logo.value.length > 0
    ? collection.append("logoImg", logo.value[0].file)
    : collection.append("logoUrl", originLogo.value);
  featuredImg.value && featuredImg.value.length > 0
    ? collection.append("featuredImg", featuredImg.value[0].file)
    : collection.append("imageUrl", originFeaturedImg.value);
  bannerImg.value && bannerImg.value.length > 0
    ? collection.append("bannerImg", bannerImg.value[0].file)
    : collection.append("bannerUrl", originBannerImg.value);
  collection.append("description", description.value);
  collection.append("customUrl", customUrl.value);
  collection.append("website", website.value);
  collection.append("twitter", twitter.value);
  collection.append("medium", medium.value);
  collection.append("telegram", telegram.value);
  collection.append("discord", discord.value);
  collection.append("instagram", instagram.value);
  collection.append("theme", theme.value);
  collection.append("explicit", explicitContent.value);
  marketService
    .saveCollection(chain, contract.value.id, collection)
    .then((res) => {
      toast.success("Collection saved successfully!");
      onSaving.value = false;
    })
    .catch((err) => {
      toast.error("Something went wrong");
      onSaving.value = false;
    });
}
const onCopy = (e) => {
  toast.success("Wallet Address is copied");
};
const cancelEditing = () => {
  router.push(`/collection/${chain}/${contractAddress}`);
};
</script>

<template>
  <body-container>
    <div class="mt-12.5 mb-2.5 text-white text-center">
      <div class="col-span-2 font-press text-xl md:text-3xl 2xl:text-4.5xl">
        Edit My Collections
      </div>
    </div>
    <div>
      <setting-item-row class>
        <template v-slot:item>
          <div class="font-ibm-bold text-lg pt-3.5">Name</div>
        </template>
        <template v-slot:value>
          <div class="font-ibm text-sm text-tertiary-400 mt-3 md:mt-0">
            <nftmx-icon-input v-model="name" />
          </div>
        </template>
      </setting-item-row>
      <logo-image
        v-model="logo"
        :originImage="originLogo"
        @remove-origin="removeOriginLogo"
      />
      <featured-image
        v-model="featuredImg"
        :originImage="originFeaturedImg"
        @remove-origin="removeOriginFeaturedImg"
      />
      <banner-image
        v-model="bannerImg"
        :originImage="originBannerImg"
        @remove-origin="removeOriginBanner"
      />
      <setting-item-row>
        <template v-slot:item>
          <div class="font-ibm-bold text-lg pt-3.5">URL</div>
          <div class="font-ibm-medium text-sm text-tertiary-500 pt-2">
            Customize your URL on nftmx. Must only contain lowercase letters,
            numbers, and hyphens.
          </div>
        </template>
        <template v-slot:value>
          <div class="relative font-ibm text-sm text-tertiary-400 pt-3 md:pt-0">
            <nftmx-icon-input v-model="customUrl" />
          </div>
        </template>
      </setting-item-row>
      <setting-item-row>
        <template v-slot:item>
          <div class="font-ibm-bold text-lg pt-2.25">Description</div>
          <div class="font-ibm-medium text-sm text-tertiary-500 pt-2">
            <span class="text-primary-900">Markdown</span>
            syntax is supported. 158 of 1000 characters used.
          </div>
        </template>
        <template v-slot:value>
          <div
            class="font-ibm text-sm text-tertiary-400 h-37.5 mt-4.75 md:mt-0"
          >
            <nftmx-textarea v-model="description" class="h-37.5" />
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
            <div class="flex pt-4.75">
              <nftmx-icon-input
                v-model="twitter"
                iconGroup="fab"
                icon="twitter"
                placeholder="Your twitter profile"
              />
              <nftmx-button
                color="primary"
                label="CONNECT"
                class="font-press text-xs sm:px-10"
              />
            </div>
            <div class="pt-4.75">
              <nftmx-icon-input
                v-model="medium"
                iconGroup="fab"
                icon="medium-m"
                placeholder="Your medium profile"
              />
            </div>
            <div class="flex pt-4.75">
              <nftmx-icon-input
                v-model="telegram"
                iconGroup="fab"
                icon="telegram-plane"
                placeholder="Your telegram profile"
              />

              <nftmx-button
                color="primary"
                label="CONNECT"
                class="font-press text-xs sm:px-10"
              />
            </div>
            <div class="pt-4.75">
              <nftmx-icon-input
                v-model="discord"
                iconGroup="fab"
                icon="discord"
                placeholder="Your discord profile"
              />
            </div>
            <div class="flex pt-4.75">
              <nftmx-icon-input
                v-model="instagram"
                iconGroup="fab"
                icon="instagram"
                placeholder="Your instagram profile"
              />
              <nftmx-button
                color="primary"
                label="CONNECT"
                class="font-press text-xs sm:px-10"
              />
            </div>
          </div>
        </template>
      </setting-item-row>
      <setting-item-row>
        <template v-slot:item>
          <div class="font-ibm-bold text-lg pt-3.5">Display theme</div>
          <div class="font-ibm-medium text-sm text-tertiary-500 pt-2">
            Change how your items are shown.
          </div>
        </template>
        <template v-slot:value>
          <div
            class="relative grid 2xl:grid-cols-3 gap-4 items-center font-ibm text-sm text-tertiary-400 pt-3 md:pt-0"
          >
            <div
              :class="[
                theme === 'PADDED' ? 'border-primary-900' : 'border-black',
                'cursor-pointer h-full flex gap-6 border-2 transition hover:border-primary-900 p-7',
              ]"
              @click="theme = 'PADDED'"
            >
              <div
                class="w-22.5 h-24.25 border-2 border-black px-5 py-3.5 bg-tertiary-700"
              >
                <div class="w-full h-full bg-primary-900" />
              </div>
              <div class="flex-1">
                <div class="font-ibm-bold text-lg text-white">Padded</div>
                <div>Recommended for assets with transparent background</div>
              </div>
            </div>
            <div
              :class="[
                theme === 'CONTAINED' ? 'border-primary-900' : 'border-black',
                'cursor-pointer h-full flex gap-6 border-2 transition hover:border-primary-900 p-7',
              ]"
              @click="theme = 'CONTAINED'"
            >
              <div
                class="w-22.5 h-24.25 border-2 border-black px-2 bg-tertiary-700"
              >
                <div class="w-full h-full bg-primary-900" />
              </div>
              <div class="flex-1">
                <div class="font-ibm-bold text-lg text-white">Contained</div>
                <div>Recommended for assets that are not a 1:1 ratio</div>
              </div>
            </div>
            <div
              :class="[
                theme === 'COVERED' ? 'border-primary-900' : 'border-black',
                'cursor-pointer h-full flex gap-6 border-2 transition hover:border-primary-900 p-7',
              ]"
              @click="theme = 'COVERED'"
            >
              <div class="w-22.5 h-24.25 border-2 border-black bg-tertiary-700">
                <div class="w-full h-full bg-primary-900" />
              </div>
              <div class="flex-1">
                <div class="font-ibm-bold text-lg text-white">Covered</div>
                <div>Recommended for assets that can extend to the edge</div>
              </div>
            </div>
          </div>
        </template>
      </setting-item-row>
      <setting-item-row>
        <template v-slot:item>
          <div class="font-ibm-bold text-lg">Explicit & sensitive content</div>
          <div class="font-ibm-medium text-sm text-tertiary-500 pt-2">
            Set this collection as explicit and sensitive content
          </div>
        </template>
        <template v-slot:value>
          <div>
            <nftmx-toggle v-model="explicitContent" />
          </div>
        </template>
      </setting-item-row>
    </div>
    <div class="mt-7.5 md:mt-25 flex justify-center">
      <nftmx-button
        color="primary"
        outline
        textColor="white"
        label="UPDATE COLLECTION"
        :class="[
          onSaving ? 'cursor-wait' : '',
          'font-press w-btn-xl text-base md:text-lg left-0 bottom-0 h-15 md:h-17.75',
        ]"
        @click="save"
      ></nftmx-button>
    </div>
    <div class="flex justify-center mt-5 mb-20">
      <div
        class="w-fit font-ibm-medium text-xs text-red-900 cursor-pointer hover:text-red-800 transition"
        @click="cancelEditing"
      >
        Cancel editing
      </div>
    </div>
  </body-container>
</template>

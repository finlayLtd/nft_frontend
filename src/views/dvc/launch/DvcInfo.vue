<script setup>
import NftmxInput from "@/core/components/basic/NftmxInput.vue";
import NftmxTextarea from "@/core/components/basic/NftmxTextarea.vue";
import NftmxRadio from "@/core/components/basic/NftmxRadio.vue";
import NftmxImg from "@/core/components/basic/NftmxImg.vue";
import { ref } from "vue";
import NftmxTooltip from "@/core/components/basic/NftmxTooltip.vue";
import NftmxButton from "@/core/components/basic/NftmxButton.vue";
import { useToast } from "vue-toastification";
import { imageFileFilter } from "@/core/utils/file-upload/file-uploader";

const props = defineProps({
  dvcInfo: Object,
});
const emit = defineEmits(["set-dvc-info"]);

const toast = useToast();
const name = ref(props.dvcInfo.name);
const logo = ref(props.dvcInfo.logo);
const logoPreview = ref(props.dvcInfo.logoPreview);
const description = ref(props.dvcInfo.description);
const website = ref(props.dvcInfo.website);
const twitter = ref(props.dvcInfo.twitter);
const medium = ref(props.dvcInfo.medium);
const telegram = ref(props.dvcInfo.telegram);
const discord = ref(props.dvcInfo.discord);
const instagram = ref(props.dvcInfo.instagram);
const warn = ref(false);

const onInputChange = (e) => {
  logo.value = e.target.files[0];
  if (!imageFileFilter(e.target.files[0])) {
    toast.error("Only image files are allowed!");
    return;
  }
  logoPreview.value = URL.createObjectURL(logo.value);
};
const nextStep = () => {
  if (!name.value || !logo.value || !description.value) {
    warn.value = true;
    toast.error("Please fill out the fields");
    return;
  }
  const data = {
    name: name.value,
    logo: logo.value,
    logoPreview: logoPreview.value,
    description: description.value,
    website: website.value,
    twitter: twitter.value,
    medium: medium.value,
    telegram: telegram.value,
    discord: discord.value,
    instagram: instagram.value,
  };
  emit("set-dvc-info", data);
};
</script>

<template>
  <div>
    <div class="mt-16 mb-11.25">
      <span class="font-ibm-bold text-3xl text-white">DVC info</span>
    </div>
    <div class="font-ibm-medium text-white text-lg">
      <div class="grid 2xl:grid-cols-2 items-center">
        <div class="grid sm:grid-cols-2 2xl:grid-cols-5 items-center">
          <div class="col-span-1 2xl:col-span-2">DVC name</div>
          <div
            class="bg-tertiary-700 col-span-1 2xl:col-span-3 2xl:mr-12 mt-3.25 sm:mt-0"
          >
            <nftmx-input
              class="h-13 text-sm"
              v-model="name"
              border="thick"
              :error="warn && !name"
            />
          </div>
        </div>
        <div
          class="grid sm:grid-cols-2 2xl:grid-cols-11 items-center mt-7 2xl:mt-0"
        >
          <div class="col-span-1 2xl:col-span-5 2xl:ml-12">Add logo</div>
          <div
            class="flex col-span-1 2xl:col-span-6 gap-4 mt-3.25 sm:mt-0 justify-between"
          >
            <label
              for="dvc-logo"
              class="block relative overflow-hidden w-48.75 h-13.5"
            >
              <input type="file" id="dvc-logo" @change="onInputChange" />
              <div
                :class="[
                  warn && !logo ? 'border-2 border-red-800' : '',
                  'absolute top-0 left-0 bg-tertiary-700 w-48.75 flex items-center justify-center gap-4 text-sm h-13.5 cursor-pointer',
                ]"
              >
                <font-awesome-icon :icon="['fas', 'upload']" />
                <span>Choose a logo</span>
              </div>
            </label>
            <div class="h-13.5 w-13.5 bg-tertiary-700">
              <nftmx-img
                :src="logoPreview"
                class="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="grid sm:grid-cols-10 mt-7">
        <div class="col-span-5 2xl:col-span-2">DVC description</div>
        <div
          class="bg-tertiary-700 col-span-5 2xl:col-span-8 2xl:mr-12 w-full mt-3.25 sm:mt-0"
        >
          <nftmx-textarea
            class="h-32.5"
            v-model="description"
            :error="warn && !description"
          />
        </div>
      </div>
      <div class="items-center mt-7">
        <div class="grid sm:grid-cols-2 2xl:grid-cols-10">
          <div class="col-span-1 2xl:col-span-2 py-3">
            Display your community power
          </div>
          <div
            class="col-span-1 2xl:col-span-8 text-sm font-ibm mt-3.25 sm:mt-0"
          >
            <div class="flex items-center w-full text-sm font-ibm">
              <div
                class="bg-black h-13.5 flex items-center justify-center w-12"
              >
                <font-awesome-icon :icon="['fas', 'globe']" />
              </div>
              <div class="bg-tertiary-700 w-full flex-1">
                <nftmx-input
                  border="thick"
                  placeholder="Your website"
                  class="h-13.5"
                  v-model="website"
                />
              </div>
            </div>
            <div class="flex items-center w-full text-sm font-ibm mt-4.75">
              <div
                class="bg-black h-13.5 flex items-center justify-center w-12"
              >
                <font-awesome-icon :icon="['fab', 'twitter']" />
              </div>
              <div class="bg-tertiary-700 w-full flex-1">
                <nftmx-input
                  border="thick"
                  placeholder="Your twitter profile"
                  class="h-13.5"
                  v-model="twitter"
                />
              </div>
            </div>
            <div class="flex items-center w-full text-sm font-ibm mt-4.75">
              <div
                class="bg-black h-13.5 flex items-center justify-center w-12"
              >
                <font-awesome-icon :icon="['fab', 'medium-m']" />
              </div>
              <div class="bg-tertiary-700 w-full flex-1">
                <nftmx-input
                  border="thick"
                  placeholder="Your medium profile"
                  class="h-13.5"
                  v-model="medium"
                />
              </div>
            </div>
            <div class="flex items-center w-full text-sm font-ibm mt-4.75">
              <div
                class="bg-black h-13.5 flex items-center justify-center w-12"
              >
                <font-awesome-icon :icon="['fab', 'telegram-plane']" />
              </div>
              <div class="bg-tertiary-700 w-full flex-1">
                <nftmx-input
                  border="thick"
                  placeholder="Your telegram profile"
                  class="h-13.5"
                  v-model="telegram"
                />
              </div>
            </div>
            <div class="flex items-center w-full text-sm font-ibm mt-4.75">
              <div
                class="bg-black h-13.5 flex items-center justify-center w-12"
              >
                <font-awesome-icon :icon="['fab', 'discord']" />
              </div>
              <div class="bg-tertiary-700 w-full flex-1">
                <nftmx-input
                  border="thick"
                  placeholder="Your discord profile"
                  class="h-13.5"
                  v-model="discord"
                />
              </div>
            </div>
            <div class="flex items-center w-full text-sm font-ibm mt-4.75">
              <div
                class="bg-black h-13.5 flex items-center justify-center w-12"
              >
                <font-awesome-icon :icon="['fab', 'instagram']" />
              </div>
              <div class="bg-tertiary-700 w-full flex-1">
                <nftmx-input
                  border="thick"
                  placeholder="Your instagram profile"
                  class="h-13.5"
                  v-model="instagram"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-end my-20">
      <nftmx-button
        outline
        color="secondary"
        textColor="white"
        label="NEXT STEP"
        class="font-press px-38 text-lg h-17.75"
        h="xl2"
        customPx
        @click="nextStep"
      />
    </div>
  </div>
</template>

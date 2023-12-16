<script setup>
import { ref, onMounted, computed, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import NftmxButton from "@/core/components/basic/NftmxButton.vue";
import { useStore } from "vuex";
import { useToast } from "vue-toastification";
import { $vfm } from "vue-final-modal";
import NftmxInput from "@/core/components/basic/NftmxInput.vue";
import { safeTransferFrom } from "@/core/utils/contracts/erc721.utils";

const props = defineProps({
  token: { type: Object, default: {} },
});

const emit = defineEmits(["transfer"]);

const store = useStore();
const walletAddress = computed(() => store.getters["auth/walletAddress"]);
const route = useRoute();
const router = useRouter();
const toast = useToast();
const toAddress = ref();
const loading = ref(false);

const cancel = () => {
  $vfm.hide("transferModal");
};
const transferNFT = () => {
  if (!walletAddress.value) {
    toast.error("Please connect wallet first");
    return;
  }
  if (!toAddress.value) {
    toast.error("Enter the receipient address.");
    return;
  }
  loading.value = true;
  safeTransferFrom(
    props.token.contract.address,
    walletAddress.value,
    toAddress.value,
    props.token.tokenId
  )
    .then((res) => {
      emit("transfer");
      toast.success("NFT is transfered successfully.");
    })
    .catch((err) => {
      if (err.code === 4001) {
        toast.error("User denied transaction signature.");
      } else {
        toast.error("Transfer is not possible to the address.");
      }
    })
    .finally(() => {
      loading.value = false;
    });
};
</script>

<template>
  <vue-final-modal
    classes="w-full flex justify-center overflow-y-auto"
    content-class="my-4 lg:my-auto mx-4 h-fit"
    :overlay-style="{ backgroundColor: 'black', opacity: '0.9' }"
    name="transferModal"
    esc-to-close
    fit-parent
  >
    <div class="bg-tertiary-900 text-white xl:w-home-lg">
      <div class="text-right text-[22px] leading-none p-5">
        <span
          class="cursor-pointer hover:text-red-900 transition"
          @click="cancel"
        >
          &#10005;
        </span>
      </div>
      <div class="text-center relative mt-1.75">
        <div class="font-press text-xl sm:text-2xl">Transfer NFT</div>
      </div>
      <div class="text-white mt-9 pb-17.5 px-4 lg:px-17.25">
        <div class="font-ibm-bold text-sm sm:text-lg py-2 sm:leading-6">
          Recipient address
        </div>
        <div class="bg-tertiary-700 border border-black text-sm mt-2">
          <nftmx-input
            v-model="toAddress"
            placeholder="Add here recipient address"
            class="h-13"
          />
        </div>
        <div class="mt-12.5 font-press text-lg">
          <nftmx-button
            @click="transferNFT"
            label="TRANSFER"
            color="primary"
            class="w-full"
            h="xl"
            :loading="loading"
          />
        </div>
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup>
import { computed, ref, watchEffect } from "vue";
import NftmxButton from "@/core/components/basic/NftmxButton.vue";
import { $vfm } from "vue-final-modal";

const emit = defineEmits(["confirm"]);

const confirm = () => {
  emit("confirm");
};

const cancel = () => {
  $vfm.hide("cancelModal");
};
</script>

<template>
  <vue-final-modal
    classes="w-full flex justify-center overflow-y-auto"
    content-class="my-auto mx-4 h-fit"
    :overlay-style="{ backgroundColor: 'black', opacity: '0.9' }"
    name="cancelModal"
    esc-to-close
    fit-parent
  >
    <div
      class="p-6 bg-tertiary-900 font-press text-white text-xl xl:text-2xl z-50"
    >
      <div class="text-right text-[22px] leading-none">
        <span
          class="cursor-pointer hover:text-red-900 transition"
          @click="cancel"
        >
          &#10005;
        </span>
      </div>
      <div class="py-6 lg:pt-12 lg:px-12">
        <div class="lg:mx-8 text-center">
          Are you sure you cancel your purchasing?
        </div>
        <div class="flex justify-center text-center mt-4">
          <div
            class="font-ibm leading-relaxed text-red-600 text-base w-full max-w-4xl"
          >
            By cancelling your purchasing you forfeit all subcollections rights,
            multilevel ownership, and income streams or any privilege of this
            NFT
          </div>
        </div>
        <div
          class="flex flex-col-reverse md:grid md:grid-cols-2 gap-6 xl:gap-11 mt-12"
        >
          <nftmx-button
            color="gray"
            outline
            label="NO"
            class="font-press w-full text-sm xl:text-lg"
            h="xl"
            @click="cancel"
          />
          <nftmx-button
            color="red"
            outline
            label="YES"
            class="font-press w-full text-sm xl:text-lg"
            h="xl"
            @click="confirm"
          />
        </div>
        <div class="font-ibm text-xs mt-4 text-center">
          Expected fund to be refunded: (equal to purchasing price minus 10%
          slippage and 2.5% transaction fee)
        </div>
      </div>
    </div>
  </vue-final-modal>
</template>

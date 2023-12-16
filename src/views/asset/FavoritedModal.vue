<script setup>
import { $vfm } from "vue-final-modal";
import NftmxWalletAddressPop from "@/core/components/blockchain-address/NftmxWalletAddressPop.vue";

defineProps({
  favoriteUsers: Array,
});

const cancel = () => {
  $vfm.hide("favoritedByModal");
};
</script>

<template>
  <vue-final-modal
    classes="w-full flex items-center justify-center"
    :overlay-style="{ backgroundColor: 'black', opacity: '0.9' }"
    name="favoritedByModal"
    esc-to-close
    fit-parent
  >
    <div
      class="relative bg-tertiary-900 text-white overflow-auto w-90vw sm:w-modal-sm"
    >
      <font-awesome-icon
        :icon="['fas', 'times']"
        class="cursor-pointer text-2xl hover:text-tertiary-400 transition absolute right-5 top-5"
        @click="cancel"
      />
      <div class="text-center font-press text-lg py-6">Favorited by</div>
      <div
        class="overflow-auto max-h-80vh border-y border-black divide-y divide-black"
      >
        <div
          v-for="(user, index) in favoriteUsers"
          :key="index"
          class="p-6 flex gap-4"
        >
          <div
            :style="{
              background: `url('${user.profile_img}')`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundColor: 'black',
            }"
            class="w-10 h-10 rounded-full"
          />
          <div class="flex flex-col justify-between">
            <div class="font-ibm-bold">{{ user.name || "Unnamed" }}</div>
            <div class="text-xs">
              <nftmx-wallet-address-pop
                class="text-secondary-600"
                :address="user.walletAddress"
              />
            </div>
          </div>
        </div>
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

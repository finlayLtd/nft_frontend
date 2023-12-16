<script setup>
import { $vfm } from "vue-final-modal";
import NftmxWalletAddressPop from "@/core/components/blockchain-address/NftmxWalletAddressPop.vue";
import BasicDropdown from "@/core/components/dropdown/BasicDropdown.vue";
import NftmxButton from "@/core/components/basic/NftmxButton.vue";
import { onMounted, ref } from "vue";
import marketService from "@/core/services/market.service";

defineProps({
  favoriteUsers: Array,
});

const emit = defineEmits(["add-category"]);

const categories = ref([]);
const selectedCategory = ref({});

onMounted(() => {
  marketService.getCategories().then((res) => {
    categories.value = res.data;
  });
});

const selectCategory = (item) => {
  selectedCategory.value = item;
};
const addCategory = () => {
  emit("add-category", selectedCategory.value);
  $vfm.hide("categoryModal");
};
const cancel = () => {
  $vfm.hide("categoryModal");
};
</script>

<template>
  <vue-final-modal
    classes="w-full flex justify-center overflow-y-auto"
    content-class="my-4 lg:my-auto mx-4 h-fit"
    name="categoryModal"
    esc-to-close
    fit-parent
  >
    <div
      class="relative bg-tertiary-900 text-white w-90vw lg:w-modal-sm"
    >
      <div class="flex justify-end p-5">
        <font-awesome-icon
          :icon="['fas', 'times']"
          class="cursor-pointer text-2xl hover:text-tertiary-400 transition"
          @click="cancel"
        />
      </div>
      <div class="text-center font-press text-2xl py-3">Add Category</div>
      <div class="overflow-auto max-h-80vh px-17 py-7">
        <div class="font-ibm-bold text-lg">
          Add category for this collection
        </div>
        <div class="relative h-15 mt-3 z-10">
          <basic-dropdown
            big
            :title="selectedCategory.name || 'Select a category'"
            class="bg-tertiary-700 w-full"
          >
            <template v-slot:content>
              <div
                class="font-ibm text-13 flex-grow text-white px-5 w-full gap-1 max-h-40 overflow-auto"
              >
                <div
                  v-for="(item, index) in categories"
                  :key="index"
                  class="py-2.75 w-full hover:text-primary-900 cursor-pointer"
                  @click="selectCategory(item)"
                >
                  {{ item.name }}
                </div>
              </div>
            </template>
          </basic-dropdown>
        </div>
        <div class="font-press text-lg mt-11.25 mb-13">
          <nftmx-button
            color="primary"
            label="ADD CATEGORY"
            class="w-full h-16.5"
            @click="addCategory"
          />
        </div>
      </div>
    </div>
  </vue-final-modal>
</template>

<style scoped>
.max-h-80vh {
  max-height: 80vh;
}
.w-90vw {
  width: 90vw;
}
@media (min-width: 1024px) {
  .lg\:w-modal-sm {
    width: 850px;
  }
}
</style>

<script setup>
import { onMounted, ref, watch } from "vue";
import { $vfm } from "vue-final-modal";
import ReportDropdown from "@/core/components/dropdown/ReportDropdown.vue";
import NftmxButton from "@/core/components/basic/NftmxButton.vue";
import NftmxInput from "@/core/components/basic/NftmxInput.vue";
import NftmxTextarea from "@/core/components/basic/NftmxTextarea.vue";
import { useToast } from "vue-toastification";
import Accordion from "@/core/components/accordion/BasicAccordion.vue";
import marketService from "@/core/services/market.service";
import { useRoute } from "vue-router";
import useDebouncedRef from "@/core/utils/hook/useDebouncedRef.js";

const reasonList = [
  "Fake collection or possible scam",
  "Explicit and sensitive content",
  "Spam",
  "In the wrong category",
  "Might be stolen",
  "Other",
];

const toast = useToast();
const category = ref("");
const collectionName = useDebouncedRef("", 1000);
const collections = ref([]);
const route = useRoute();
const chain = route.params.chain;
const rightCollection = ref();
const open = ref(false);

const getContracts = (chain, name) => {
  marketService.getContracts({ chain, name }).then((res) => {
    collections.value = res.data.contracts;
  });
};
const onClickOutside = () => {
  open.value = false;
};
const handleClick = () => {
  open.value = !open.value;
};
const report = () => {
  toast.success("This collection has been reported.");
  cancel();
};
const cancel = () => {
  $vfm.hide("collectionReportModal");
};
const selectCollection = (collection) => {
  rightCollection.value = collection;
  open.value = false;
};

watch(collectionName, (value) => {
  getContracts(chain, value);
});
onMounted(() => {
  getContracts(chain, "");
});
</script>

<template>
  <vue-final-modal
    classes="w-full flex justify-center overflow-y-auto"
    content-class="my-4 lg:my-auto mx-4 h-fit"
    :overlay-style="{ backgroundColor: 'black', opacity: '0.9' }"
    name="collectionReportModal"
    esc-to-close
    fit-parent
  >
    <div class="bg-tertiary-900 text-white xl:w-home-lg">
      <div class="text-right text-xl p-5">
        <font-awesome-icon
          :icon="['fas', 'times']"
          class="cursor-pointer hover:text-tertiary-400 transition"
          @click="cancel"
        />
      </div>
      <div class="text-center relative mt-2 px-4 lg:px-17.25">
        <div class="font-press text-xl sm:text-2xl">Report This Collection</div>
      </div>
      <div class="text-white mt-7 pb-20 px-4 lg:px-17.25">
        <div>
          <div class="font-ibm-bold py-3.5">I think this collection is...</div>
          <report-dropdown class="z-20" v-model="category" :list="reasonList" />
        </div>
        <div v-if="category === reasonList[0]">
          <div class="font-ibm-bold pt-4.25 pb-3.5">Original collections</div>
          <div class="relative h-18.5">
            <div
              class="absolute w-full z-10 border-2 border-black px-5 overflow-hidden bg-tertiary-700"
              v-click-outside="onClickOutside"
            >
              <accordion
                mIcon
                :border="false"
                :sidebar="true"
                v-model="open"
                @handle-click="handleClick"
                handleEmit
                class="w-full"
              >
                <template v-slot:caption>
                  <div class="flex items-center w-full">
                    <div class="flex-1 text-13 font-ibm-medium py-4 mr-4 h-13">
                      {{
                        rightCollection
                          ? rightCollection.name
                          : "Select collection"
                      }}
                    </div>
                  </div>
                </template>
                <div
                  class="pt-2 gap-2.5 justify-between text-xs pb-6 mr-1 relative h-64"
                >
                  <div class="relative">
                    <font-awesome-icon
                      :icon="['fas', 'search']"
                      class="text-white text-sm absolute top-4 left-4"
                    />
                    <nftmx-input
                      placeholder="Search"
                      class="pt-2 pb-2.25 pl-11 h-11.5"
                      v-model="collectionName"
                      border="thick"
                    />
                  </div>
                  <div class="overflow-auto height my-4">
                    <div
                      v-for="(collection, index) in collections"
                      :key="index"
                      @click="selectCollection(collection)"
                    >
                      <div
                        class="flex items-center gap-3.5 font-ibm text-sm py-4 cursor-pointer transition text-white hover:text-primary-900"
                      >
                        <div class="leading-3">
                          {{ collection.name }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </accordion>
            </div>
          </div>
        </div>
        <div v-if="category === reasonList[5]">
          <div class="bg-tertiary-700">
            <nftmx-textarea border="thick" class="h-30" />
          </div>
        </div>
        <div class="mt-8">
          <nftmx-button
            color="primary"
            textColor="white"
            outline
            label="REPORT"
            class="font-press text-lg"
            w="full"
            h="xl"
            @click="report"
          />
        </div>
      </div>
    </div>
  </vue-final-modal>
</template>

<style scoped>
.text-1\.5xl {
  font-size: 1.3125rem;
}
.height {
  height: calc(100% - theme("spacing[12]"));
}
</style>

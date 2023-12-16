<script setup>
import useFileList from "@/core/utils/file-upload/file-list";
import DropZone from "@/core/components/file-uploader/DropZone.vue";
import FilePreview from "@/core/components/file-uploader/FilePreview.vue";
import SettingItemRow from "@/core/components/basic/SettingItemRow.vue";
import NftmxImg from "@/core/components/basic/NftmxImg.vue";
import { computed, watch } from "vue";

const props = defineProps({
  modelValue: Object,
  originImage: String,
});
const emit = defineEmits(["update:modelValue", "remove-origin"]);
const { files, replaceFiles, removeFile } = useFileList();

function onInputChangeBanner(e) {
  replaceFiles(e.target.files);
  e.target.value = null; // reset so that selecting the same file again will still cause it to fire this change
}
watch(files, (val) => {
  emit("update:modelValue", val);
});
const removeOriginalImage = () => {
  emit("remove-origin");
};
</script>

<template>
  <setting-item-row class="mt-10 grid-cols-2 xl:grid-cols-3">
    <template v-slot:item>
      <div class="font-ibm-bold text-lg pt-3.5">Banner image</div>
      <div class="font-ibm text-tertiary-400 text-sm pt-2.5">
        This image will appear at the top of your collection page. Avoid
        including too much text in this banner image, as the dimensions change
        on different devices. 1400 x 400 recommended.
      </div>
    </template>
    <template v-slot:value>
      <div class="md:grid md:grid-cols-8 text-tertiary-500 mt-4 xl:mt-0">
        <div class="col-span-5 md:pr-5">
          <drop-zone
            id="banner-image"
            @files-dropped="replaceFiles"
            #default="{ dropZoneActive }"
          >
            <label
              for="banner-image-input"
              class="block relative overflow-hidden h-45"
            >
              <input
                type="file"
                id="banner-image-input"
                @change="onInputChangeBanner"
              />
              <div>
                <div
                  :class="[
                    dropZoneActive ? 'bg-tertiary-800' : 'bg-tertiary-700',
                    'h-45 overlayed border-dash cursor-pointer',
                  ]"
                >
                  <div
                    class="text-center h-full flex flex-col items-center justify-center pt-2"
                  >
                    <div class="font-ibm-bold text-2xl">
                      <div class="flex justify-center">
                        <nftmx-img
                          src="/images/components/nft-shield.png"
                          class="bg-tertiary-900 p-1.5 w-16 h-14"
                        />
                      </div>
                      <div class="mt-3 leading-9">Drag & drop file</div>
                      <div class="font-ibm-medium text-sm">
                        or browse media on your device
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </label>
          </drop-zone>
        </div>
        <div class="col-span-3 md:pl-6 mt-5 md:mt-0 w-full h-45">
          <div
            class="border-2 border-black text-center flex flex-col justify-center w-full md:w-auto h-50 md:h-full"
          >
            <div v-if="files && files.length > 0" class="h-full">
              <file-preview
                v-for="file of files"
                :key="file.id"
                :file="file"
                @remove="removeFile"
              />
            </div>
            <div v-else-if="originImage" class="h-full relative">
              <nftmx-img
                :src="originImage"
                class="w-full h-full object-cover object-center"
              />
              <button
                @click="removeOriginalImage"
                class="text-4xl absolute top-0 right-2 transition text-white hover:text-red-900"
              >
                &times;
              </button>
            </div>
            <div v-else>
              <div class="font-ibm-bold text-lg md:text-2xl leading-9">
                Preview Banner
              </div>
              <div class="text-sm">Upload file to preview image</div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </setting-item-row>
</template>

<style scoped>
/* Finally we use Tailwind CSS to create our overlayed class */
.overlayed {
  @apply absolute top-0 left-0 right-0 bottom-0 w-full block;
}
.border-dash {
  background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='%23000' stroke-width='6' stroke-dasharray='6%2c 14' stroke-dashoffset='3' stroke-linecap='square'/%3e%3c/svg%3e");
}
</style>

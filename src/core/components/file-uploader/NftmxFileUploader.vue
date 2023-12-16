<script setup>
import { ref, computed } from "vue";
import NftmxImg from "@/core/components/basic/NftmxImg.vue";

const props = defineProps({
  id: { type: String, default: "drag-and-drop-input" },
  multiple: { type: Boolean, default: false },
  modelValue: File,
});

const files = ref([]);

const emit = defineEmits(["update:modelValue"]);

const computedValue = computed({
  get: () => files.value,
  set: (value) => {
    emit("update:modelValue", value);
  },
});

// const uploadInfo = computed(() => {
//   return files.value.length === 1
//     ? files.value[0].name
//     : `${files.value.length} files selected`
// })

const handleUpload = (e) => {
  files.value = Array.from(e.target.files) || [];
  emit("update:modelValue", files.value);
};
</script>

<template>
  <label :for="id" class="block relative overflow-hidden">
    <input :id="id" type="file" :multiple="multiple" @change="handleUpload" />
    <div :class="`overlayed border-dash bg-tertiary-700 cursor-pointer`">
      <div
        class="text-center h-full flex flex-col items-center justify-center pt-2"
      >
        <slot>
          <div class="font-ibm-bold text-2xl">
            <div>
              <nftmx-img src="/images/components/nft-shield.png" />
            </div>
            <div class="mt-5.5 leading-9">Drag & drop file</div>
            <div class="font-ibm-medium text-sm">
              or browse media on your device
            </div>
          </div>
        </slot>

        <!-- <small v-if="files.length" :class="`text-border-black bg-tertiary-700 block`"> -->
        <!-- <slot name="file" :files="files" :uploadInfo="uploadInfo">{{ uploadInfo }}</slot> -->
        <!-- </small> -->
      </div>
    </div>
  </label>
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

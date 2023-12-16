<script setup>
import { computed, ref } from "vue";
import Accordion from "@/core/components/accordion/BasicAccordion.vue";
const reasonList = [
  "Fake collection or possible scam",
  "Explicit and sensitive content",
  "Span",
  "In the wrong category",
  "Might be stolen",
];
const props = defineProps({
  modelValue: String,
});

const emit = defineEmits(["update:modelValue"]);

const computedValue = computed(() => props.modelValue);
const open = ref(false);
const onClickOutside = () => {
  open.value = false;
};
const handleClick = () => {
  open.value = !open.value;
};
const selectReason = (item) => {
  open.value = false;
  emit("update:modelValue", item);
};
</script>

<template>
  <div class="relative w-full h-15">
    <div
      :class="[
        open ? 'z-10' : '',
        'w-full absolute bg-tertiary-700 border-2 border-black pr-4',
      ]"
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
            <div
              :class="[
                computedValue ? 'text-white' : 'text-tertiary-400',
                'flex-1 text-sm font-ibm py-3.75 px-5',
              ]"
            >
              {{ computedValue || "Select a reason" }}
            </div>
          </div>
        </template>
        <div class="pt-2 gap-2.5 justify-between text-sm pb-4">
          <div
            v-for="(item, index) in reasonList"
            :key="index"
            @click="selectReason(item)"
            :class="[
              computedValue === item ? 'text-primary-900' : 'text-white',
              'px-5 py-2 font-ibm transition hover:text-primary-900 cursor-pointer',
            ]"
          >
            {{ item }}
          </div>
        </div>
      </accordion>
    </div>
  </div>
</template>

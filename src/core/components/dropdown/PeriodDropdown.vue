<script setup>
import { ref } from "vue";
import DropDown from "./DropDown.vue";
const options = [
  {
    text: "1 day",
    value: 1,
  },
  {
    text: "1 week",
    value: 7,
  },
  {
    text: "1 month",
    value: 30,
  },
  {
    text: "3 months",
    value: 90,
  },
  {
    text: "6 months",
    value: 180,
  },
  {
    text: "1 year",
    value: 365,
  },
  {
    text: "2 years",
    value: 730,
  },
  {
    text: "3 years",
    value: 1095,
  },
  {
    text: "4 years",
    value: 1460,
  },
  {
    text: "5 years",
    value: 1825,
  },
];

const props = defineProps({
  modelValue: Number,
});

const emit = defineEmits(["update:modelValue"]);

const choosePeriod = (period) => {
  emit("update:modelValue", period);
};
const checkPeriod = (evt) => {
  if (isNaN(String.fromCharCode(evt.which))) evt.preventDefault();
};
const editPeriod = (evt) => {
  emit("update:modelValue", parseInt(evt.currentTarget.textContent) || 0);
};
</script>

<template>
  <drop-down
    :icon="false"
    class="border-2 text-white bg-tertiary-700 font-ibm-light text-sm"
  >
    <template v-slot:header>
      <div class="flex font-ibm text-sm cursor-pointer">
        <div class="flex items-center gap-2 h-12.5 w-full pl-4">
          <span
            :contenteditable="true"
            type="number"
            class="outline-none ml-2 cursor-text"
            @keypress="checkPeriod"
            @input="editPeriod"
            v-on:paste="checkPeriod"
          >
            {{ modelValue }}
          </span>
          days
        </div>
        <font-awesome-icon
          :icon="['fas', 'sort-down']"
          class="text-lg mr-4 mt-3"
        />
      </div>
    </template>
    <template v-slot:body>
      <div class="px-6 pb-2">
        <div
          v-for="(option, index) in options"
          :key="index"
          @click="choosePeriod(option.value)"
          class="hover:text-primary-900 cursor-pointer"
        >
          {{ option.text }}
        </div>
      </div>
    </template>
  </drop-down>
</template>

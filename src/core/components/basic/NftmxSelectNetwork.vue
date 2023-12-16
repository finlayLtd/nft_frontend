<script setup>
import Accordion from "@/core/components/accordion/BasicAccordion.vue";
import { onMounted, ref, watchEffect } from "vue";
import { networks } from "@/core/config/constant";
import NftmxImg from "@/core/components/basic/NftmxImg.vue";

const props = defineProps({
  color: {
    type: String,
    default: "tertiary",
  },
});

const bgColor = {
  tertiary: "bg-tertiary-700",
  black: "bg-black",
};

const hoverColor = {
  tertiary: "hover:bg-tertiary-900",
  black: "hover:bg-tertiary-900",
};

const selected = ref(networks[0]);
const selectNetwork = (network) => {
  selected.value = network;
  open.value = !open.value;
};

const open = ref(false);

const handleClick = () => {
  open.value = !open.value;
};
const onClickOutside = () => {
  open.value = false;
};
</script>

<template>
  <div class="relative h-15" v-click-outside="onClickOutside">
    <div
      :class="[
        open ? '' : 'border-b-0',
        bgColor[props.color],
        'border-2 border-black font-ibm absolute z-10 w-full',
      ]"
    >
      <div
        @click="handleClick"
        class="border-b-2 border-black px-5 flex text-2xl text-white cursor-pointer"
      >
        <div class="flex-1">
          <div class="selected flex items-center cursor-pointer h-14 text-sm">
            <nftmx-img :src="selected.icon" class="mr-3" />
            <span>{{ selected.name }}</span>
          </div>
        </div>
        <div class="self-center cursor-pointer">
          <font-awesome-icon
            v-if="!open"
            :icon="['fas', 'sort-down']"
            class="text-sm -translate-y-1/3"
          />
          <font-awesome-icon
            v-if="open"
            :icon="['fas', 'sort-up']"
            class="text-sm"
          />
        </div>
      </div>
      <div
        class="transition-all overflow-auto"
        :style="{ maxHeight: open ? '200px' : '0' }"
      >
        <div
          :class="[
            hoverColor[props.color],
            'flex items-center h-12 cursor-pointer px-5',
          ]"
          v-for="(option, i) of networks"
          :key="i"
          @click="selectNetwork(option)"
        >
          <nftmx-img :src="option.icon" class="mr-3" />
          {{ option.name }}
        </div>
      </div>
    </div>
  </div>
</template>

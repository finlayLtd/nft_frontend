<script setup>
import { onMounted, ref } from "vue";

const anim = ref(null);
const aHeight = ref(0);
const open = ref(false);
const overflowHidden = ref(true);

const handleClick = () => {
  aHeight.value = anim.value.scrollHeight + "px";
  open.value = !open.value;
};
const clickOutside = () => {
  open.value = false;
};

onMounted(() => {
  aHeight.value = anim.value.scrollHeight + "px";
  if (open.value) {
    setTimeout(() => {
      overflowHidden.value = false;
    }, 500);
  }
  const observer = new MutationObserver(setAnimHeight);
  observer.observe(anim.value, {
    childList: true,
    subtree: true,
  });
});
const setAnimHeight = () => {
  if (anim.value) {
    aHeight.value = anim.value.scrollHeight + "px";
  }
};
</script>

<template>
  <div class="py-1.25 pl-3 pr-1">
    <div
      v-click-outside="clickOutside"
      @click="handleClick"
      class="flex text-2xl cursor-pointer"
    >
      <div class="flex-grow">
        <slot name="caption"></slot>
      </div>
      <div
        class="w-4 flex items-center justify-center text-xs text-tertiary-400"
      >
        <font-awesome-icon
          v-if="!open"
          :icon="['fas', 'sort-down']"
          class="-translate-y-1/3"
        />
        <font-awesome-icon v-if="open" :icon="['fas', 'sort-up']" class="" />
      </div>
    </div>
    <div
      :class="[
        open && !overflowHidden ? '' : 'overflow-hidden',
        'transition-all',
      ]"
      :style="{ maxHeight: open ? aHeight : '0' }"
    >
      <div ref="anim">
        <slot />
      </div>
    </div>
  </div>
</template>

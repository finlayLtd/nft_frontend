<script setup>
import { onMounted, ref, watchEffect } from "vue";

const props = defineProps({
  icon: {
    type: Boolean,
    default: true,
  },
  border: {
    type: Boolean,
    default: true,
  },
  sidebar: {
    type: Boolean,
    default: false,
  },
  value: {
    type: Boolean,
    default: true,
  },
  animation: {
    type: Boolean,
    default: true,
  },
  handleEmit: Boolean,
  modelValue: Boolean,
  updatePeried: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(["handle-click"]);

const anim = ref(null);
const aHeight = ref(0);
const open = ref(props.handleEmit ? props.modelValue : props.value);
const overflowHidden = ref(true);

const handleClick = () => {
  aHeight.value = anim.value.scrollHeight + "px";
  if (props.handleEmit) {
    emit("handle-click");
  } else {
    open.value = !open.value;
  }
};

watchEffect(() => {
  if (props.handleEmit) {
    open.value = props.modelValue;
  }
});
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
  setTimeout(() => {
    if (anim.value) {
      aHeight.value = anim.value.scrollHeight + "px";
    }
  }, props.updatePeried);
};
</script>

<template>
  <div>
    <div
      @click="handleClick"
      :class="[
        open ? 'border-b border-black' : '',
        'flex text-2xl cursor-pointer ',
      ]"
    >
      <div class="flex-grow">
        <slot name="caption"></slot>
      </div>
      <div v-if="icon" class="w-16 flex items-center justify-center text-white">
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
      :class="[
        animation && open && !overflowHidden ? '' : 'overflow-hidden',
        'transition-all',
      ]"
      :style="{ maxHeight: animation ? (open ? aHeight : '0') : '' }"
    >
      <div ref="anim" v-if="!animation ? open : true">
        <slot />
      </div>
    </div>
  </div>
</template>

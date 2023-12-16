<script setup>
import { computed, onMounted, ref, watch, watchEffect } from "vue";
import { useStore } from "vuex";

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
  bIcon: {
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

const store = useStore();
const anim = ref(null);
const aHeight = ref(0);
const open = ref(props.handleEmit ? props.modelValue : props.value);
const overflowHidden = ref(true);
const windowWidth = computed(() => store.state.app.windowWidth);

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
    attributes: true,
  });
});
const setAnimHeight = () => {
  setTimeout(() => {
    if (anim.value) {
      aHeight.value = anim.value.scrollHeight + "px";
    }
  }, props.updatePeried);
};
watch(windowWidth, (val) => {
  aHeight.value = anim.value.scrollHeight + "px";
});
</script>

<template>
  <div
    :class="[border ? 'border border-black bg-tertiary-800' : '', 'font-ibm']"
  >
    <div
      @click="handleClick"
      :class="[
        border && open ? 'border-b border-black' : '',
        sidebar ? '' : 'px-5',
        'flex text-2xl cursor-pointer',
      ]"
    >
      <div class="flex-1">
        <slot name="caption" v-bind="{ open }" />
      </div>
      <div v-if="icon" class="self-center cursor-pointer">
        <font-awesome-icon
          v-if="!open"
          :icon="['fas', 'sort-down']"
          :class="[bIcon ? 'text-2xl' : 'text-sm', '-translate-y-1/3']"
        />
        <font-awesome-icon
          v-if="open"
          :icon="['fas', 'sort-up']"
          :class="[bIcon ? 'text-2xl' : 'text-sm']"
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

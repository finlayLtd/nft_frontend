<script setup>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import NftmxBadge from "./NftmxBadge.vue";

const props = defineProps({
  active: Boolean,
  to: String,
  disable: Boolean,
  sidebar: Boolean,
  red: Boolean,
  badge: Boolean,
  badgeCount: Number,
});

const store = useStore();
const hover = ref(false);

const is = computed(() => {
  if (props.to) {
    return "router-link";
  }

  return "div";
});

const computedCss = computed(() => {
  const base = [
    "py-1.25 transition cursor-pointer font-ibm-medium text-13 tracking-wider",
  ];
  if (props.disable) {
    base.push("text-white");
  } else if (props.active) {
    if (props.red) {
      base.push("text-red-900");
    } else {
      base.push("text-primary-900");
    }
  } else {
    if (props.red) {
      base.push("text-white hover:text-red-900");
    } else {
      base.push("text-white hover:text-primary-900");
    }
  }

  return base;
});
const badgeClass = computed(() => {
  const base = ["-ml-1 -mt-2.25 transition"];
  if (props.active) {
    if (props.red) {
      base.push("bg-red-900");
    } else {
      base.push("bg-primary-900");
    }
  } else if (hover.value) {
    if (props.red) {
      base.push("bg-red-900");
    } else {
      base.push("bg-primary-900");
    }
  }

  return base;
});

const closeSidebar = () => {
  if (props.sidebar) {
    store.commit("app/TOGGLE_MENU", false);
  }
};
</script>

<template>
  <component
    :is="is"
    :to="to"
    :class="computedCss"
    @click="closeSidebar"
    @mouseover="hover = true"
    @mouseout="hover = false"
  >
    <slot />
    <nftmx-badge
      v-if="badge"
      :value="badgeCount"
      :class="badgeClass"
      :active="active || hover"
    />
  </component>
</template>

<script setup>
import { computed } from "vue";
import { getButtonColor, getButtonHoverColor } from "@/colors.js";

const props = defineProps({
  label: {
    type: [String, Number],
    default: null,
  },
  href: {
    type: String,
    default: null,
  },
  target: {
    type: String,
    default: null,
  },
  to: {
    type: [String, Object],
    default: null,
  },
  type: {
    type: String,
    default: null,
  },
  color: {
    type: String,
    default: "white",
  },
  as: {
    type: String,
    default: null,
  },
  h: {
    type: String,
    default: "md",
  },
  w: {
    type: String,
    default: null,
  },
  customPx: Boolean,
  textColor: {
    type: String,
    default: null,
  },
  small: Boolean,
  outline: Boolean,
  loading: Boolean,
  disabled: Boolean,
});

const is = computed(() => {
  if (props.as) {
    return props.as;
  }

  if (props.to) {
    return "router-link";
  }

  if (props.href) {
    return "a";
  }

  return "button";
});

const height = {
  xl2: "17.75",
  xl1: "17",
  xl: "16.5",
  lg: "15",
  md: "13.5",
  base: "10",
  sm: "8.75",
  xs: "8",
  xs1: "7.25",
};

const computedType = computed(() => {
  if (is.value === "button") {
    return props.type ?? "button";
  }

  return null;
});

const labelClass = computed(() => (props.small ? "px-2" : "px-4"));

const componentClass = computed(() => {
  const base = [
    "relative",
    "inline-flex",
    "justify-center",
    "items-center",
    "focus:outline-none",
    "transition",
    getButtonColor(
      props.color,
      props.outline,
      !props.disabled && !props.loading,
      props.textColor
    ),
    "h-" + height[props.h],
    props.w ? "w-" + props.w : "",
    props.customPx ? "" : "px-4",
    props.textColor ? "text-" + props.textColor : "",
  ];

  if (props.disabled) {
    base.push("cursor-not-allowed", props.outline ? "" : "opacity-70");
  } else if (props.loading) {
    base.push("cursor-wait");
  } else {
    base.push("cursor-pointer");
  }

  return base;
});
const componentHoverCss = computed(() =>
  getButtonHoverColor(props.color, props.outline)
);
</script>

<template>
  <component
    :is="is"
    :class="componentClass"
    :href="href"
    :type="computedType"
    :to="to"
    :target="target"
    :disabled="disabled || loading"
  >
    <div
      v-if="!outline"
      :class="[
        componentHoverCss,
        'absolute w-full h-full inline-flex justify-center items-center transition hover:opacity-0',
      ]"
    >
      <span v-if="label" :class="labelClass">{{ label }}</span>
    </div>
    <svg
      v-if="loading"
      class="animate-spin mr-3 h-5 w-5 mb-1"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
    <span v-if="label">{{ label }}</span>
  </component>
</template>

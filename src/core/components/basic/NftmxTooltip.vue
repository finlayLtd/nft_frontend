<script setup>
import { computed, onMounted, onUpdated, ref, watch } from "vue";
import { useStore } from "vuex";

const props = defineProps({
  text: {
    type: String,
    default: "",
  },
  custom: Boolean,
  adjust: { type: Number, default: 0 },
});

const store = useStore();
const windowWidth = computed(() => store.state.app.windowWidth);
const tooltip = ref(false);
const tooltipBox = ref(null);
const tooltipRef = ref(null);
const tooltipStyle = ref({ top: 0, left: 0 });
const computedBoxWidth = computed(() =>
  props.custom
    ? 480
    : props.text.length > 200
    ? props.text.length * 1.15
    : props.text.length > 50
    ? props.text.length * (-0.01 * props.text.length + 3.8)
    : 175
);
const boxWidth = computed(() =>
  computedBoxWidth.value + 36 > windowWidth.value
    ? windowWidth.value - 36 + "px"
    : computedBoxWidth.value + "px"
);

const showTooltip = () => {
  let tooltipBoxPosition = tooltipBox.value.getBoundingClientRect();
  let tooltipRefPosition = tooltipRef.value.getBoundingClientRect();
  let tooltipBoxPositionRight = windowWidth.value - tooltipBoxPosition.left;
  if (
    tooltipBoxPosition.top > tooltipRefPosition.height &&
    tooltipBoxPositionRight - tooltipBoxPosition.width >
      tooltipRefPosition.width
  ) {
    tooltipStyle.value = {
      top:
        tooltipBoxPosition.top -
        tooltipRefPosition.height +
        props.adjust +
        "px",
      left:
        tooltipBoxPosition.left +
        tooltipBoxPosition.width -
        props.adjust +
        "px",
    };
  }
  if (
    tooltipBoxPosition.top > tooltipRefPosition.height &&
    tooltipBoxPositionRight - tooltipBoxPosition.width <=
      tooltipRefPosition.width
  ) {
    tooltipStyle.value = {
      top:
        tooltipBoxPosition.top -
        tooltipRefPosition.height +
        props.adjust +
        "px",
      left:
        tooltipBoxPosition.left -
        tooltipRefPosition.width +
        props.adjust +
        "px",
    };
  }
  if (
    tooltipBoxPosition.top <= tooltipRefPosition.height &&
    tooltipBoxPositionRight - tooltipBoxPosition.width >
      tooltipRefPosition.width
  ) {
    tooltipStyle.value = {
      top:
        tooltipBoxPosition.top +
        tooltipBoxPosition.height -
        props.adjust +
        "px",
      left:
        tooltipBoxPosition.left +
        tooltipBoxPosition.width -
        props.adjust +
        "px",
    };
  }
  if (
    tooltipBoxPosition.top <= tooltipRefPosition.height &&
    tooltipBoxPositionRight - tooltipBoxPosition.width <=
      tooltipRefPosition.width
  ) {
    tooltipStyle.value = {
      top:
        tooltipBoxPosition.top +
        tooltipBoxPosition.height -
        props.adjust +
        "px",
      left:
        tooltipBoxPosition.left -
        tooltipRefPosition.width +
        props.adjust +
        "px",
    };
  }
};
</script>

<template>
  <span
    ref="tooltipBox"
    @mouseover="tooltip = true"
    @mouseout="tooltip = false"
    @mouseenter="showTooltip()"
    class="h-fit"
  >
    <slot />
    <div
      ref="tooltipRef"
      :class="[
        tooltip ? 'opacity-100 z-50' : 'hidden -z-50',
        'fixed transition bg-black text-white font-ibm-light text-left text-11 shadow-default shadow-primary-900 px-4 py-3',
      ]"
      :style="{
        ...tooltipStyle,
        width: boxWidth,
      }"
    >
      {{ text }}
      <slot name="custom" />
    </div>
  </span>
</template>

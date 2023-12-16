<script setup>
import { computed, onMounted, ref, watch, watchEffect } from "vue";
import { useStore } from "vuex";

const props = defineProps({
  open: Boolean,
  delay: { type: Number, default: 100 },
});

const store = useStore();
const anim = ref(null);
const aHeight = ref(0);
const overflowHidden = ref(true);
const windowWidth = computed(() => store.state.app.windowWidth);

onMounted(() => {
  aHeight.value = anim.value.scrollHeight + "px";
  setTimeout(() => {
    overflowHidden.value = false;
  }, 500);
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
  }, props.delay);
};
watch(windowWidth, (val) => {
  aHeight.value = anim.value.scrollHeight + "px";
});
</script>

<template>
  <div>
    <div
      :class="[
        open && !overflowHidden ? '' : 'overflow-hidden',
        'transition-all duration-75',
      ]"
      :style="{ maxHeight: open ? aHeight : 0 }"
    >
      <div ref="anim">
        <slot />
      </div>
    </div>
  </div>
</template>

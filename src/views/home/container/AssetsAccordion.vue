<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useStore } from "vuex";

const store = useStore();
const anim = ref(null);
const aHeight = ref(0);
const open = ref(true);
const overflowHidden = ref(true);
const windowWidth = computed(() => store.state.app.windowWidth);

const handleClick = () => {
  aHeight.value = anim.value.scrollHeight + "px";
  open.value = !open.value;
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
  setTimeout(() => {
    if (anim.value) {
      aHeight.value = anim.value.scrollHeight + "px";
    }
  }, 100);
};
watch(windowWidth, (val) => {
  aHeight.value = anim.value.scrollHeight + "px";
});
defineExpose({
  open,
});
</script>

<template>
  <div>
    <div
      @click="handleClick"
      :class="['flex text-2xl text-white cursor-pointer px-4']"
    >
      <div class="flex-1">
        <slot name="caption"></slot>
      </div>
      <div class="cursor-pointer pt-2">
        <font-awesome-icon
          v-if="!open"
          :icon="['fas', 'sort-down']"
          class="text-2xl -translate-y-1/3"
        />
        <font-awesome-icon
          v-if="open"
          :icon="['fas', 'sort-up']"
          class="text-2xl"
        />
      </div>
    </div>
    <div
      class="overflow-hidden transition-all"
      :style="{ maxHeight: open ? aHeight : '0' }"
    >
      <div ref="anim">
        <slot />
      </div>
    </div>
  </div>
</template>

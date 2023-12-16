<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
import { themeConfig } from "@/core/config/constant";

defineProps({
  title: String,
});

const store = useStore();
const emit = defineEmits(["update:modelValue", "select-tab", "confirm"]);

const value = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const confirmCancel = (mode) => {
  emit(mode);
};

const confirm = () => confirmCancel("confirm");

const cancel = () => confirmCancel("select-tab");

function onClickOutside() {
  if (store.state.app.windowWidth < themeConfig.sm) {
    cancel();
  }
}
</script>

<template>
  <div
    class="fixed sm:absolute top-0 left-0 bg-tertiary-800 h-5/6 border-y sm:border-none border-black sm:h-full w-full bg-opacity-90 z-10 mt-20 sm:mt-0"
    v-click-outside="onClickOutside"
  >
    <div
      class="font-ibm-medium text-lg border-b border-black py-3.75 px-5.25 flex justify-between items-center"
    >
      {{ title }}
      <font-awesome-icon
        :icon="['fas', 'times']"
        class="text-xl cursor-pointer hover:text-tertiary-400 transition"
        @click="cancel()"
      />
    </div>
    <div class="py-7.5 px-5.25 height h-full overflow-auto">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.height {
  height: calc(100% - theme("spacing[15]"));
}
</style>

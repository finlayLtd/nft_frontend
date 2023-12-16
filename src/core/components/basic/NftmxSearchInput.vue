<script setup>
import { useStore } from "vuex";
import { themeConfig } from "@/core/config/constant";
import { computed } from "vue";

const props = defineProps({
  navbar: Boolean,
  placeholder: String,
  filterActive: Boolean,
  modelValue: String,
});

const emit = defineEmits(["update:modelValue", "handle-filter"]);

const store = useStore();
const searchText = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

function clickFilter() {
  emit("handle-filter");
}

function onKeyDown(evt) {
  if (evt.keyCode === 13) {
    evt.preventDefault();
    return;
  }
}
</script>

<template>
  <div
    :class="[
      navbar ? 'w-full' : 'w-full sm:w-68.5 border border-black px-6',
      'flex justify-between items-center gap-4 h-12.5',
    ]"
  >
    <div class="flex items-center w-full">
      <font-awesome-icon
        :icon="['fas', 'search']"
        class="text-white text-lg pointer-events-none"
      />
      <input
        v-if="!navbar || store.state.app.windowWidth >= themeConfig.sm"
        class="text-white pl-6 py-2 font-ibm placeholder-tertiary-500 w-full border-0 focus:outline-none bg-transparent"
        :placeholder="placeholder ? placeholder : 'Search'"
        v-model="searchText"
      />
      <textarea
        v-if="navbar && store.state.app.windowWidth < themeConfig.sm"
        @keydown="onKeyDown($event)"
        rows="2"
        class="text-sm leading-snug text-white pl-6 py-2 font-ibm-medium placeholder-tertiary-500 w-full border-0 outline-none focus:outline-none bg-transparent resize-none"
        :placeholder="placeholder ? placeholder : 'Search'"
        v-model="searchText"
      />
    </div>
    <font-awesome-icon
      @click="clickFilter"
      :icon="['fas', 'filter']"
      :class="[
        navbar ? 'text-lg' : 'text-sm',
        filterActive ? 'text-primary-900' : 'text-white',
        'transition text-white hover:text-primary-900 cursor-pointer',
      ]"
    />
  </div>
</template>

<style scoped>
textarea {
  -webkit-box-shadow: none;
}
</style>

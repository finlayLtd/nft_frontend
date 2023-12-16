<script setup>
import NftmxImg from "@/core/components/basic/NftmxImg.vue";
import { computed, onMounted, ref, watch } from "vue";
import { useStore } from "vuex";
const tabWidth = 10;
const gap = 8;
const tabsPadding = 64;

const props = defineProps({
  images: Array,
});

const emit = defineEmits(["update:modelValue"]);

const store = useStore();
const windowWidth = computed(() => store.state.app.windowWidth);
const inner = ref(null);
const currentIndex = ref(0);
const cardWidth = ref(0);
const left = computed(() => -cardWidth.value * currentIndex.value);
const tabsWidth = computed(() => (tabWidth + gap) * props.images.length - gap);
const selectedTabToCenter = computed(
  () =>
    -(tabWidth + gap) * currentIndex.value + (cardWidth.value - tabsPadding) / 2
);
const tabLeftLimit = computed(
  () => -tabsWidth + (cardWidth.value - tabsPadding)
);
const tabLeftAble = computed(() => tabsWidth > cardWidth.value - tabsPadding);
const tabLeft = computed(() =>
  tabLeftAble
    ? selectedTabToCenter.value > 0
      ? 0
      : selectedTabToCenter.value < tabLeftLimit.value
      ? tabLeftLimit.value
      : selectedTabToCenter.value
    : 0
);
onMounted(() => {
  cardWidth.value = inner.value.clientWidth;
  const observer = new MutationObserver(setAnimWidth);
  observer.observe(inner.value, {
    childList: true,
    subtree: true,
  });
});
const setAnimWidth = () => {
  cardWidth.value = inner.value.clientWidth;
};
const next = () => {
  if (currentIndex.value >= props.images.length - 1) return;
  currentIndex.value++;
};
const prev = () => {
  if (currentIndex.value < 1) return;
  currentIndex.value--;
};
const select = (index) => {
  currentIndex.value = index;
};
watch(windowWidth, (val) => {
  setAnimWidth();
});
watch(currentIndex, (val) => {
  emit("update:modelValue", val);
});
</script>

<template>
  <div class="relative w-full h-full overflow-hidden text-6xl" ref="inner">
    <div class="h-full">
      <div
        class="flex h-full transition-all relative"
        :style="{ left: left + 'px' }"
      >
        <div
          v-for="(image, index) in images"
          :key="index"
          class="absolute w-full h-full"
          :style="{ left: `${100 * index}%` }"
        >
          <div class="h-full">
            <nftmx-img :src="image" class="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </div>
    <div class="absolute w-full h-full top-0 left-0 child">
      <div @click.prevent class="absolute w-full px-8 bottom-0 h-5">
        <div class="overflow-x-hidden w-full">
          <div
            class="flex gap-2 h-full transition-all relative mx-auto w-fit"
            :style="{ left: tabLeft + 'px' }"
          >
            <div
              v-for="(image, index) in images"
              :key="index"
              :class="[
                index === currentIndex ? ' bg-primary-900' : 'bg-white',
                'cursor-pointer w-2.5 h-2.5 border border-black',
              ]"
              @click="select(index)"
            />
          </div>
        </div>
      </div>
      <div
        @click.prevent
        class="absolute right-4 bottom-0 h-8 flex items-center"
      >
        <font-awesome-icon
          v-if="currentIndex < images.length - 1"
          :icon="['fas', 'angle-right']"
          class="text-white text-lg cursor-pointer hover:text-primary-900 transition"
          @click="next"
        />
      </div>
      <div
        @click.prevent
        class="absolute left-4 bottom-0 h-8 flex items-center"
      >
        <font-awesome-icon
          v-if="currentIndex > 0"
          :icon="['fas', 'angle-left']"
          class="text-white text-lg cursor-pointer hover:text-primary-900 transition"
          @click="prev"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.parent:hover .child {
  background-color: black;
  opacity: 0.8;
}
</style>

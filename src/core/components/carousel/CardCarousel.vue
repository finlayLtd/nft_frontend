<script setup>
import NftmxImg from "@/core/components/basic/NftmxImg.vue";
import { computed, onMounted, ref, watch } from "vue";
import { useStore } from "vuex";

const props = defineProps({
  images: Array,
  small: Boolean,
});

const store = useStore();
const windowWidth = computed(() => store.state.app.windowWidth);
const inner = ref(null);
const currentIndex = ref(0);
const cardWidth = ref(0);
const left = computed(() => -cardWidth.value * currentIndex.value);
onMounted(() => {
  cardWidth.value = inner.value.clientWidth;
  const observer = new MutationObserver(setAnimHeight);
  observer.observe(inner.value, {
    childList: true,
    subtree: true,
  });
});
const setAnimHeight = () => {
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
</script>

<template>
  <div class="relative w-full h-full overflow-hidden" ref="inner">
    <div class="bg-tertiary-800 absolute right-2 top-2 p-1 text-xs z-10">
      {{ currentIndex + 1 + " of " + images.length }}
    </div>
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
    <div class="absolute w-full h-full top-0 left-0">
      <div class="absolute right-4 h-full flex items-center">
        <font-awesome-icon
          v-if="currentIndex < images.length - 1"
          :icon="['fas', 'angle-right']"
          class="text-white text-3xl cursor-pointer hover:text-primary-900 transition"
          @click="next"
        />
      </div>
      <div class="absolute left-4 h-full flex items-center">
        <font-awesome-icon
          v-if="currentIndex > 0"
          :icon="['fas', 'angle-left']"
          class="text-white text-3xl cursor-pointer hover:text-primary-900 transition"
          @click="prev"
        />
      </div>
      <div
        :class="[
          small ? 'h-12' : 'h-20',
          'absolute w-full  px-2 bottom-0 overflow-x-auto',
        ]"
      >
        <div class="flex gap-2 h-full transition-all relative mx-auto w-fit">
          <div
            v-for="(image, index) in images"
            :key="index"
            :class="[
              index === currentIndex ? 'border-2 border-primary-900' : '',
              small ? 'w-8 h-8' : 'w-16 h-16',
              'cursor-pointer',
            ]"
            @click="select(index)"
          >
            <nftmx-img
              :src="image"
              class="w-full h-full object-cover bg-tertiary-500"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

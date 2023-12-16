<script setup>
import NftmxImg from "@/core/components/basic/NftmxImg.vue";
import { computed, onMounted, ref, watch } from "vue";
import { useStore } from "vuex";

const props = defineProps({
  nfts: Array,
  chain: String,
});

const emit = defineEmits(["add-to-cart"]);

const store = useStore();
const inner = ref(null);
const currentIndex = ref(0);
const cardWidth = ref(0);
const cardLeftUnit = ref(25);
const left = computed(() => -cardWidth.value * currentIndex.value);
const count = ref(0);
onMounted(() => {
  cardWidth.value = inner.value.clientWidth / 4;
  cardLeftUnit.value = 25;
  const observer = new ResizeObserver(setAnimHeight);
  observer.observe(inner.value, { box: "border-box" });
});
const setAnimHeight = () => {
  if (inner.value) {
    count.value = Math.ceil(inner.value.clientWidth / 300);
    cardWidth.value = inner.value.clientWidth / count.value;
    cardLeftUnit.value = 100 / count.value;
  }
};
const next = () => {
  if (currentIndex.value >= props.nfts.length - 1) return;
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
  <div class="relative w-full h-full px-10 pb-6">
    <div class="absolute w-full h-full top-0 left-0">
      <div class="absolute right-4 h-full flex items-center">
        <font-awesome-icon
          v-if="currentIndex < nfts.length - count"
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
      <div :class="['absolute w-full  px-2 bottom-0 overflow-x-auto']">
        <div
          v-if="nfts.length > count"
          class="flex gap-3 h-full transition-all relative mx-auto w-fit"
        >
          <div
            v-for="(image, index) in nfts.length - count + 1"
            :key="index"
            :class="[
              index === currentIndex ? 'bg-primary-900' : 'bg-tertiary-400',
              'cursor-pointer w-4.5 h-2 rounded-full',
            ]"
            @click="select(index)"
          />
        </div>
      </div>
    </div>
    <div class="h-full overflow-hidden" ref="inner">
      <div
        class="flex h-full transition-all relative"
        :style="{ left: left + 'px' }"
      >
        <div
          v-for="(nft, index) in nfts"
          :key="index"
          class="absolute h-full"
          :style="{ left: `${cardLeftUnit * index}%`, width: `${cardWidth}px` }"
        >
          <div class="h-full px-2.5">
            <div
              class="relative w-full h-full card-parent cursor-pointer"
              @click="
                emit('add-to-cart', { ...nft, contract: { chain: chain } })
              "
            >
              <nftmx-img
                :src="nft.imageUrl"
                class="w-full h-full object-cover bg-black"
              />
              <div
                class="card-child absolute w-full h-full top-0 left-0 bg-black bg-opacity-80 items-center justify-center"
              >
                <div class="w-5.5 h-5.5 fill-white">
                  <svg viewBox="0 0 64 64">
                    <g>
                      <path
                        class="st0"
                        d="M62.95,13.89c0.27-1.27-0.53-2.51-1.8-2.79c-1.27-0.27-2.51,0.53-2.79,1.8l-4.81,22.34H20.72L13.64,5.71H2.41
		c-1.3,0-2.35,1.05-2.35,2.35s1.05,2.35,2.35,2.35h7.53l9.12,38.05h36.51c1.3,0,2.35-1.05,2.35-2.35s-1.05-2.35-2.35-2.35H22.76
		l-0.92-3.83h35.49L62.95,13.89z"
                      />
                      <circle class="st0" cx="26" cy="54.57" r="4.04" />
                      <circle class="st0" cx="48.41" cy="54.57" r="4.04" />
                      <polygon
                        class="st0"
                        points="50.1,18.37 41.24,18.37 41.24,5.71 37.07,5.71 32.9,5.71 32.9,18.37 24.04,18.37 37.07,30.46 	"
                      />
                    </g>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-child {
  display: none;
}
.card-parent:hover .card-child {
  display: flex;
}
</style>
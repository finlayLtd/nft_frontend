<script setup>
import { onMounted, onUnmounted, ref, watchEffect } from "vue";
import BundleImage from "@/core/components/basic/BundleImage.vue";
import NftmxButton from "@/core/components/basic/NftmxButton.vue";
import NftmxProgressBar from "@/core/components/basic/NftmxProgressBar.vue";
import NftmxPriceCommon from "@/core/components/price/NftmxPriceCommon.vue";
import Timer from "@/core/components/timer/Timer.vue";
import NftmxHelp from "@/core/components/basic/NftmxHelp.vue";
import { themeConfig } from "@/core/config/constant";
import { useStore } from "vuex";
import NftmxTrimString from "../basic/NftmxTrimString.vue";
import dvcsService from "@/core/services/market/dvcs.service";
import { shortenAddress } from "@/core/utils/common";

const props = defineProps({
  carouselPlay: Boolean,
});

const store = useStore();
const dvcs = ref([]);
const innerStyles = ref({});
const step = ref("");
const transitioning = ref(false);
const inner = ref(null);
const left = ref(0);
const anim = ref(null);

watchEffect(() => {
  if (!anim.value & props.carouselPlay) {
    anim.value = setInterval(() => {
      left.value = left.value + 1;
      if (left.value > 0) {
        left.value = -inner.value.scrollWidth / 2;
      }
    }, 50);
  } else if (anim.value && !props.carouselPlay) {
    clearInterval(anim.value);
    anim.value = null;
  }
});
onMounted(() => {
  dvcsService.find().then((res) => {
    dvcs.value = res.data;
  });
});
onUnmounted(() => {
  clearInterval(anim.value);
  anim.value = null;
});
</script>

<template>
  <div class="w-full overflow-hidden">
    <div
      :class="['relative w-full flex inner']"
      :style="{ left: left + 'px' }"
      ref="inner"
    >
      <div
        class="flex"
        v-for="(item, index) in [...dvcs, ...dvcs]"
        :key="index"
      >
        <div
          class="transition duration-300 m-4 cursor-default hover:shadow-default hover:shadow-white w-max"
        >
          <div
            class="w-70.75 sm:w-141.5 h-72 sm:h-48.75 2xl:w-165 bg-tertiary-900 relative text-11 tracking-wider"
          >
            <div class="flex items-center pb-15 h-full">
              <div
                class="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-black px-6 py-2.5 w-full"
              >
                <div class="flex items-center gap-4 pb-4 sm:pb-0">
                  <div
                    class="w-18.5 h-18.5"
                    :style="{
                      background: 'url(' + item.logo + ')',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundColor: 'black',
                    }"
                  />
                  <div class="font-ibm-medium text-left h-full pt-2.5 flex-1">
                    <div class="text-tertiary-400">DVC #{{ item.index }}</div>
                    <nftmx-trim-string
                      class="font-ibm-bold text-white text-base"
                      :line="1"
                    >
                      {{ item.name }}
                    </nftmx-trim-string>
                    <div class="mt-1">
                      <span class="text-tertiary-400"> Created by </span>
                      <router-link
                        class="text-primary-900"
                        :to="`/account/${item.owner.walletAddress}`"
                      >
                        {{
                          item.owner.name ||
                          shortenAddress(item.owner.walletAddress)
                        }}
                      </router-link>
                    </div>
                  </div>
                </div>
                <div class="pt-4 sm:pt-0 sm:px-4 grid grid-cols-2">
                  <div class="font-ibm-medium text-left">
                    <div class="text-white">Total TVL</div>
                    <div class="text-primary-900">
                      ${{ (141565445656).toLocaleString() }}
                    </div>
                  </div>
                  <div class="font-ibm-medium text-left">
                    <div class="text-white">Backers</div>
                    <div class="text-primary-900">4201</div>
                  </div>
                  <div class="font-ibm-medium text-left mt-2">
                    <div class="text-white">Total assets</div>
                    <div class="text-primary-900">1,589,986</div>
                  </div>
                  <div class="font-ibm-medium text-left mt-2">
                    <div class="text-white">Average ROI</div>
                    <div class="text-primary-900">186.62%</div>
                  </div>
                </div>
              </div>
            </div>
            <router-link
              :to="`/dvc?id=${item.dvcId}`"
              class="transition bg-black hover:shadow-default hover:shadow-white text-white font-press w-full flex items-center justify-center h-15 bottom-0 absolute text-sm"
            >
              BECOME A BACKER
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.inner {
  transition: transform 5s;
  transition-timing-function: linear;
}
.card {
  width: 700px;
  margin-right: 10px;
  /* display: inline-flex; */
  /* optional */
  color: white;
  border-radius: 4px;
  align-items: center;
  justify-content: center;
}
/* optional */
button {
  margin-right: 5px;
  margin-top: 10px;
}
.w-fill {
  width: calc(100% + 4px);
}
.piece {
  animation: carouselmove 60s infinite;
  animation-timing-function: linear;
}
@keyframes carouselmove {
  from {
    left: -3588px;
  }
  to {
    left: 0;
  }
}
.piecebig {
  animation: bigcarouselmove 60s infinite;
  animation-timing-function: linear;
}
@keyframes bigcarouselmove {
  from {
    left: -4153px;
  }
  to {
    left: 0;
  }
}
</style>

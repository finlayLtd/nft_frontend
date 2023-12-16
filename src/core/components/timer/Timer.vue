<script setup>
import NumberBlock from "@/core/components/basic/NumberBlock.vue";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

const props = defineProps({
  size: {
    type: String,
    default: "small",
  },
  color: {
    type: String,
    default: "tertiary-800",
  },
  time: {
    type: Number,
    default: 80000,
  },
});
const time = ref(props.time);
const day = ref(parseInt(time.value / 86400));
const hour = ref(parseInt((time.value % 86400) / 3600));
const hour1 = ref(parseInt(hour.value / 10));
const hour2 = ref(hour.value % 10);
const min = ref(parseInt((time.value % 3600) / 60));
const min1 = ref(parseInt(min.value / 10));
const min2 = ref(min.value % 10);
const sec = ref(parseInt(time.value % 60));
const sec1 = ref(parseInt(sec.value / 10));
const sec2 = ref(sec.value % 10);
const intervalId = ref(null);

const countdownSec = () => {
  if (sec2.value <= 0) {
    sec2.value = 9;
    if (sec1.value <= 0) {
      sec1.value = 5;
      countdownMin();
    } else {
      sec1.value--;
    }
  } else {
    sec2.value--;
  }
};
const countdownMin = () => {
  if (min2.value <= 0) {
    min2.value = 9;
    if (min1.value <= 0) {
      min1.value = 5;
      countdownHour();
    } else {
      min1.value--;
    }
  } else {
    min2.value--;
  }
};
const countdownHour = () => {
  if (hour2.value <= 0) {
    if (hour1.value <= 0) {
      hour2.value = 3;
      hour1.value = 2;
      countdownDay();
    } else {
      hour2.value = 9;
      hour1.value--;
    }
  } else {
    hour2.value--;
  }
};
const countdownDay = () => {
  if (day.value <= 0) return;
  day.value--;
};
onMounted(() => {
  intervalId.value = setInterval(() => {
    if (time.value > 0) {
      time.value--;
      countdownSec();
    } else {
      clearInterval(intervalId.value);
    }
  }, 1000);
});
onBeforeUnmount(() => {
  if (intervalId.value) {
    clearInterval(intervalId.value);
  }
});
</script>

<template>
  <div
    :class="[
      size === 'big' ? 'font-ibm-bold text-2xl' : 'font-ibm text-sm',
      'flex gap-x-0.5 max-w-fit items-center text-white whitespace-normal',
    ]"
    style="width: -webkit-fill-available"
  >
    <number-block v-if="day.toString().length <= 1" :color="color" :size="size">
      {{ 0 }}
    </number-block>
    <number-block
      v-for="i in day.toString().length"
      :key="i"
      :color="color"
      :size="size"
    >
      {{
        parseInt(
          (day % Math.pow(10, day.toString().length - i + 1)) /
            Math.pow(10, day.toString().length - i)
        )
      }}
    </number-block>
    <span class="-mx-px">:</span>
    <number-block :color="color" :size="size">
      {{ hour1 ? hour1 : 0 }}
    </number-block>
    <number-block :color="color" :size="size">
      {{ hour2 ? hour2 : 0 }}
    </number-block>
    <span class="-mx-px">:</span>
    <number-block :color="color" :size="size">
      {{ min1 ? min1 : 0 }}
    </number-block>
    <number-block :color="color" :size="size">
      {{ min2 ? min2 : 0 }}
    </number-block>
    <span class="-mx-px">:</span>
    <number-block :color="color" :size="size">
      {{ sec1 ? sec1 : 0 }}
    </number-block>
    <number-block :color="color" :size="size">
      {{ sec2 ? sec2 : 0 }}
    </number-block>
    <span class="-mx-px">:</span>
    <number-block :color="color" :size="size">
      <span class="numbers__window">
        <span
          :class="[time > 0 ? 'number-milli-1' : '', 'number-milli']"
          data-fake="0987654321"
        >
          0
        </span>
      </span>
    </number-block>
    <number-block :color="color" :size="size">
      <span class="numbers__window">
        <span
          :class="[time > 0 ? 'number-milli-2' : '', 'number-milli']"
          data-fake="0987654321"
        >
          0
        </span>
      </span>
    </number-block>
  </div>
</template>

<style scoped>
.numbers__window {
  display: inline-block;
  overflow: hidden;
  width: 100%;
  height: 1em;
  line-height: 1;
}
.number-milli {
  font: inherit;
  word-break: break-all;
  display: block;
  width: 0;
  padding: 0 0.65em 0 0;
  margin: 0 auto;
  overflow: inherit;
}
.number-milli::before {
  content: attr(data-fake);
  display: inline-block;
  width: 100%;
  height: auto;
}
@keyframes counting {
  100% {
    transform: translate3d(0, -10em, 0);
  }
}
.number-milli-1 {
  animation-iteration-count: 6;
  animation: counting 1s steps(10) forwards infinite;
}
.number-milli-2 {
  animation-iteration-count: 9;
  animation: counting 0.1s steps(10) forwards infinite;
}
</style>

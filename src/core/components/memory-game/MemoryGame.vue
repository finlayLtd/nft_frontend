<script setup>
import { onMounted, ref } from "vue";
import NftmxImg from "../basic/NftmxImg.vue";
import marketService from "@/core/services/market.service";

const cards = ref([]);
const firstPick = ref(null);
const secondPick = ref(null);
const pickedCards = ref([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
const clicks = ref(0);
const restarting = ref(false);

const pickCard = (index) => {
  if (
    pickedCards.value.indexOf(index) > -1 ||
    firstPick.value === index ||
    secondPick.value === index ||
    (firstPick.value !== null && secondPick.value !== null)
  ) {
    return true;
  } else if (firstPick.value === null) {
    firstPick.value = index;
  } else {
    secondPick.value = index;
    if (cards.value[firstPick.value] === cards.value[secondPick.value]) {
      setTimeout(() => {
        pickedCards.value.push(firstPick.value, secondPick.value);
      }, 500);
    }
    setTimeout(() => {
      firstPick.value = null;
      secondPick.value = null;
    }, 750);
  }
  clicks.value++;
};

const shuffle = (array) => {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

const restart = () => {
  if (restarting.value) return;
  restarting.value = true;
  marketService.getMatchGameNfts().then((res) => {
    restarting.value = false;
    const images = res.data.map((item) => item.imageUrl);
    cards.value = images.concat(images);
    firstPick.value = null;
    secondPick.value = null;
    clicks.value = 0;
    shuffle(cards.value);
    pickedCards.value = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    setTimeout(() => {
      pickedCards.value = [];
    }, 1000);
  });
};

onMounted(() => {
  restart();
});
</script>

<template>
  <div class="py-4 flex flex-col items-center">
    <div class="text-sm text-center">
      <span> Find the match </span>
    </div>
    <div
      class="flex flex-wrap justify-around items-center w-80 h-60 sm:w-[400px] sm:h-[300px] xl:w-[520px] xl:h-[390px] opacity-60"
    >
      <div
        v-for="(item, index) in cards"
        :key="index"
        @click="pickCard(index)"
        :class="[
          'card transition w-15 h-15 sm:w-20 sm:h-20 xl:w-25 xl:h-25 bg-tertiary-900',
          pickedCards.indexOf(index) > -1 ||
          firstPick === index ||
          secondPick === index
            ? 'open'
            : '',
          pickedCards.indexOf(index) > -1 ? 'match' : '',
        ]"
      >
        <nftmx-img
          :src="item"
          :class="[
            pickedCards.indexOf(index) > -1 ||
            firstPick === index ||
            secondPick === index
              ? ''
              : 'hidden',
            'object-cover w-full h-full',
          ]"
        />
      </div>
    </div>
    <div class="text-13 font-ibm text-center">
      <span> Clicks: {{ clicks }}, </span>
      <span> Cards: 12 </span>
      <span @click="restart" class="text-primary-900 cursor-pointer ml-4">
        Play again
      </span>
    </div>
  </div>
</template>

<style scoped>
.card {
  margin: 0.2rem 0.2rem;
  background: no-repeat center url("/images/components/nft-shield.png");
  background-color: #151515;
  font-size: 0;
  color: #ffffff;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}
.card:hover {
  background-color: black;
}
.card.open {
  transform: rotateY(0);
  background: #151515;
  /*#02b3e4*/
  cursor: default;
  animation-name: flipInY;
  -webkit-backface-visibility: visible !important;
  backface-visibility: visible !important;
  animation-duration: 0.75s;
}

.card.match {
  cursor: default;
  background: #343434;
  font-size: 33px;
  animation-name: rubberBand;
  -webkit-backface-visibility: visible !important;
  backface-visibility: visible !important;
  animation-duration: 0.75s;
}

@keyframes flipInY {
  from {
    transform: perspective(400px) rotate3d(0, 1, 0, 90deg);
    animation-timing-function: ease-in;
    opacity: 0;
  }

  40% {
    transform: perspective(400px) rotate3d(0, 1, 0, -20deg);
    animation-timing-function: ease-in;
  }

  60% {
    transform: perspective(400px) rotate3d(0, 1, 0, 10deg);
    opacity: 1;
  }

  80% {
    transform: perspective(400px) rotate3d(0, 1, 0, -5deg);
  }

  to {
    transform: perspective(400px);
  }
}

@keyframes rubberBand {
  from {
    transform: scale3d(1, 1, 1);
  }

  30% {
    transform: scale3d(1.25, 0.75, 1);
  }

  40% {
    transform: scale3d(0.75, 1.25, 1);
  }

  50% {
    transform: scale3d(1.15, 0.85, 1);
  }

  65% {
    transform: scale3d(0.95, 1.05, 1);
  }

  75% {
    transform: scale3d(1.05, 0.95, 1);
  }

  to {
    transform: scale3d(1, 1, 1);
  }
}
</style>

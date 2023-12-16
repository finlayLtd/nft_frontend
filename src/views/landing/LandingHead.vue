<script setup>
import NftmxButton from "@/core/components/basic/NftmxButton.vue";
import NftmxImg from "@/core/components/basic/NftmxImg.vue";
</script>

<template>
  <div class="relative h-landing bg-black text-white">
    <div class="absolute h-full w-full ape-grad">
      <img
        src="/images/landing/ape.png"
        class="h-full absolute right-[10%] pt-[5%] object-contain pl-[10%]"
      />
    </div>
    <div
      class="flex flex-col justify-center px-5.5 sm:px-10 md:px-20 2xl:px-50 w-full h-full absolute"
    >
      <div class="font-press text-4xl text-shadow text-primary-900">
        TO BUY OR NOT TO BUY?
      </div>
      <p class="font-ibm-bold text-[21px] text-white mt-8 max-w-[770px]">
        It's not a question anymore! With a Quantum finance model you can have
        BOTH positions at the same time.
      </p>
      <div class="font-press text-sm mt-14 flex gap-10">
        <a
          class="flex justify-between items-center pl-11 pr-8 w-68 h-15 cursor-pointer text-primary-900 hover:text-white hover:bg-primary-900 transition shadow-default shadow-primary-900 rounded-full"
          href="#learn"
        >
          <span> LEARN MORE </span>
          <font-awesome-icon :icon="['fas', 'angle-down']" class="text-2xl" />
        </a>
        <router-link
          to="/home"
          class="flex justify-between items-center pl-11 pr-8 w-68 h-15 cursor-pointer text-primary-900 hover:text-white hover:bg-primary-900 transition shadow-default shadow-primary-900 rounded-full"
        >
          <span> Marketplace </span>
          <font-awesome-icon :icon="['fas', 'angle-down']" class="text-2xl" />
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.h-landing {
  height: 100vh;
}
</style>

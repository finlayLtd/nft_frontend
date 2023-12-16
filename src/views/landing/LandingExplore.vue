<script setup>
import NftmxButton from "@/core/components/basic/NftmxButton.vue";
</script>

<template>
  <div class="bg-tertiary-900 relative">
    <div
      class="grid lg:grid-cols-2 text-center font-press cursor-pointer parent"
    >
      <div
        class="parent-dvc relative top-0 left-0 w-full h-full text-shadow-secondary flex flex-col items-center justify-center px-12 py-30 lg:py-60 border-2 border-tertiary-900 transition hover:border-secondary-700"
      >
        <div
          class="child-dvc explore-grad-secondary absolute top-0 left-0 w-full h-full transition"
        />
        <div
          class="child absolute w-2/3 bottom-0 border-t lg:w-auto lg:bottom-auto lg:border-t-0 lg:h-80 lg:right-0 lg:border-r border-black"
        />
        <div class="text-secondary-800 text-2xl">BUY NFTs</div>
        <div
          class="text-white text-2xl xl:text-3xl 2xl:text-[56px] 2xl:leading-relaxed mt-3"
        >
          VIA C2C
        </div>
        <div class="text-white text-2xl mt-px">(Contract-To-Contract)</div>
        <div class="w-full sm:w-2/3 xl:w-1/2 mt-10.75 text-shadow-none">
          <nftmx-button
            color="secondary"
            textColor="white"
            outline
            label="EXPLORE"
            h="lg"
            w="full"
            class="text-lg"
            to="dvc"
          />
        </div>
      </div>
      <div
        class="parent-dvc relative top-0 left-0 w-full h-full text-shadow flex flex-col items-center justify-center px-12 pt-30 pb-60 lg:py-60 border-2 border-tertiary-900 transition hover:border-primary-700"
      >
        <div
          class="child-dvc explore-grad-primary absolute top-0 left-0 w-full h-full transition"
        />
        <div class="text-primary-800 text-2xl">BUY NFTs</div>
        <div
          class="text-white text-2xl xl:text-3xl 2xl:text-[56px] 2xl:leading-relaxed mt-3"
        >
          VIA P2C
        </div>
        <div class="text-white text-2xl mt-px">(Peer-To-Contract)</div>
        <div class="w-full sm:w-2/3 xl:w-1/2 mt-10.75 text-shadow-none">
          <nftmx-button
            color="primary"
            textColor="white"
            outline
            label="EXPLORE"
            h="lg"
            w="full"
            class="text-lg"
            to="/home?tab=NFTS"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.parent:hover .child {
  display: none;
}
.child-dvc {
  opacity: 0;
}
.parent-dvc:hover .child-dvc {
  opacity: 100;
}
</style>

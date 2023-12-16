<script setup>
import { computed, ref } from 'vue'
import Icon from '@/core/components/basic/Icon.vue'
import NftmxButton from '@/core/components/basic/NftmxButton.vue';
import TopBar from '@/core/components/basic/TopBar.vue';
import NftmxSearchInput from '@/core/components/basic/NftmxSearchInput.vue';
</script>

<template>
  <top-bar class="font-ibm-medium" :search="true">
    <div class="px-2 sm:px-8 md:px-16 flex-grow items-stretch flex h-17.25 md:h-23.5 bg-tertiary-800">
        <div class="w-full flex items-center">
          <nftmx-search-input navbar placeholder="Search items, collections, and accounts"></nftmx-search-input>
        </div>
    </div>
  </top-bar>
</template>

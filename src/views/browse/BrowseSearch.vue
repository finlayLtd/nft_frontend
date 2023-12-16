<script setup>
import { ref } from "@vue/reactivity";
import NftmxButton from '@/core/components/basic/NftmxButton.vue';
import Accordion from '@/core/components/accordion/BasicAccordion.vue';
import NftmxDivider from '@/core/components/basic/NftmxDivider.vue';
import CheckboxCell from '@/core/components/basic/CheckboxCell.vue';
import NftmxSearchInput from "@/core/components/basic/NftmxSearchInput.vue";


const filterBy = ref('collection')
const filterActive = ref(false);

function clickFilter() {
    filterActive.value = !filterActive.value;
}
function clickFilterBy(value) {
    filterBy.value = value;
}
</script>

<template>
    <div class="bg-tertiary-800 border-t border-b border-black pt-5 pb-4 px-10 lg:px-22">
        <div class="flex flex-wrap flex-col xl:flex-row justify-between items-center">
            <div class="flex flex-1 w-full min-w-max items-center">
                <nftmx-search-input
                    v-model="filterActive"
                    @handle-filter="clickFilter"
                    navbar
                    class="w-full h-full font-ibm-medium text-sm"
                    placeholder="Search items, collections, and accounts"
                ></nftmx-search-input>
            </div>
        </div>
        <div v-if="filterActive">
            <div class="grid grid-cols-2 text-center text-lg font-ibm-semi-bold mt-5">
                <div
                    @click="clickFilterBy('collection')"
                    :class="[filterBy === 'collection' ? 'text-primary-900 border-primary-900' : 'text-white border-black', 'cursor-pointer transition hover:text-primary-900 border-b-2 hover:border-primary-900 py-4']"
                >Collections</div>
                <div
                    @click="clickFilterBy('all')"
                    :class="[filterBy === 'all' ? 'text-primary-900 border-primary-900' : 'text-white border-black', 'cursor-pointer transition hover:text-primary-900 border-b-2 hover:border-primary-900 py-4']"
                >All NFTs</div>
            </div>
            <div v-if="filterBy === 'all'" class="flex my-2">
                
            </div>
            <div v-if="filterBy === 'collection'" class="flex my-2">
                <!-- <checkbox-cell class="pb-3.5">
                    <span class="text-xs relative -top-0.5">List Price Available</span>
                </checkbox-cell>
                <checkbox-cell class="pb-3.5">
                    <span class="text-xs relative -top-0.5">Open Offer Available</span>
                </checkbox-cell>
                <checkbox-cell class="pb-3.5">
                    <span class="text-xs relative -top-0.5">Creator Owned</span>
                </checkbox-cell>
                <checkbox-cell class="pb-3.5">
                    <span class="text-xs relative -top-0.5">Sold</span>
                </checkbox-cell>
                <checkbox-cell class="pb-3.5">
                    <span class="text-xs relative -top-0.5">Domain Names</span>
                </checkbox-cell>
                <checkbox-cell class="pb-3.5">
                    <span class="text-xs relative -top-0.5">Music</span>
                </checkbox-cell>
                <checkbox-cell class="pb-3.5">
                    <span class="text-xs relative -top-0.5">Art</span>
                </checkbox-cell>
                <checkbox-cell class="pb-3.5">
                    <span class="text-xs relative -top-0.5">Collectibles</span>
                </checkbox-cell>
                <checkbox-cell class="pb-3.5">
                    <span class="text-xs relative -top-0.5">Virtual Worlds</span>
                </checkbox-cell>
                <checkbox-cell class="pb-3.5">
                    <span class="text-xs relative -top-0.5">Utility</span>
                </checkbox-cell>
                <checkbox-cell class="pb-3.5">
                    <span class="text-xs relative -top-0.5">Most Popular</span>
                </checkbox-cell>
                <checkbox-cell class="pb-3.5">
                    <span class="text-xs relative -top-0.5">Trading Cards</span>
                </checkbox-cell>
                <checkbox-cell class="pb-3.5">
                    <span class="text-xs relative -top-0.5">Reverse Price Set</span>
                </checkbox-cell>
                <checkbox-cell class="pb-3.5">
                    <span class="text-xs relative -top-0.5">Sports</span>
                </checkbox-cell>-->
            </div>
        </div>
    </div>
</template>

<style>
.text-center {
    text-align: -webkit-center;
}
.max-w-search {
    max-width: 23em;
}
.w-68 {
    width: 17rem /* 260px */;
}
.leading-7\.5 {
    line-height: 30px;
}
.leading-4\.5 {
    line-height: 18px;
}
</style>

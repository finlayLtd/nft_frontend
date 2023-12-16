<script setup>
import { ref } from 'vue';
import Accordion from '@/core/components/accordion/BasicAccordion.vue';

defineProps({
    title: String
})

const open = ref(false);
const onClickOutside = () => {
    open.value = false;
}
const handleClick = () => {
    open.value = !open.value;
}
</script>

<template>
    <div class="pr-3 absolute w-full bg-tertiary-900" v-click-outside="onClickOutside">
        <accordion
            mIcon
            :border="false"
            :sidebar="true"
            v-model="open"
            @handle-click="handleClick"
            handleEmit
            class="w-full"
        >
            <template v-slot:caption>
                <div class="flex items-center w-full">
                    <div class="flex-1 text-lg font-ibm-bold py-3.75 px-5">{{ title }}</div>
                </div>
            </template>
            <div class="pt-2 gap-2.5 justify-between text-lg pb-6">
                <div
                    @click="open = false"
                    class="px-5 font-ibm-bold text-white transition hover:text-primary-900 cursor-pointer"
                >BSC</div>
            </div>
        </accordion>
    </div>
</template>

<script setup>
import { formatDate, formatOrderStatus } from "@/core/utils/common";
import { useStore } from "vuex";

const props = defineProps({
    log: {
        type: Object,
        default: {
            img: '/images/nfts/item1-45x.png',
            tokenName: 'Miss Atrbreellllll',
            description: 'Sold for 0.0005ETH',
            updatedAt: '7/12/2021, 4:21 AM'
        }
    }
});

const store = useStore();
const orderLog = {
    name: props.log.tokenName,
    img: '/images/nfts/item1-45x.png',
    description: formatOrderStatus(props.log.orderStatus) + ' for ' + store.getters['market/etherFromWei'](props.log.tokenPrice) + ' BNB',
    updatedAt: formatDate(props.log.updatedAt)
}
</script>

<template>
    <div
        class="flex items-center font-ibm text-sm text-white border-b border-tertiary-800 mr-8 pt-4.75 pb-7"
    >
        <div
            :style="{ background: 'url( ' + orderLog.img + ' )', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center' }"
            class="w-12.75 h-13 mr-4 -ml-0.5"
        />
        <div class="truncate">
            <div class="truncate">{{ orderLog.name }}</div>
            <div
                class="truncate text-11 font-ibm-bold text-tertiary-500 mt-2"
            >{{ orderLog.description }}</div>
            <div class="truncate text-11 text-tertiary-500 mt-1">{{ orderLog.updatedAt }}</div>
        </div>
    </div>
</template>

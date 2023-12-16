<script setup>
import { ref, watchEffect } from 'vue';
import NumberBlock from '@/core/components/basic/NumberBlock.vue';

const props = defineProps({
    price: {
        type: Number,
        required: true
    },
    color: {
        type: String,
        default: "primary"
    }
})

const integer = ref();
const integerString = ref()
const _dLength = ref();
const decimal = ref();

function setPrice(price) {
    integer.value = parseInt(price);
    integerString.value = integer.value.toString();
    _dLength.value = price.toString().length - integer.value.toString().length - 1;
    decimal.value = _dLength.value > 0 ? (price - integer.value).toFixed(_dLength.value) : null;
}
watchEffect(() => {
    if (props.price) {
        setPrice(props.price)
    }
})
</script>

<template>
    <div class="flex baseline w-fit">
        $
        <div
            v-for="(l, index) in integerString"
            :key="index"
            class="flex"
        >{{ index > 0 && (integerString.length - index) % 3 === 0 ? ',' : null }}{{ l }}</div>
        <span v-if="decimal">.</span>
        <div
            v-for="(l, index) in decimal"
            :key="index"
            class="flex"
        >{{ index > 1 && index < 7 ? l : '' }}</div>
    </div>
</template>
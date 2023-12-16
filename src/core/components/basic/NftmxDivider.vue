<script setup>
defineProps({
    vertical: {
        type: Boolean,
        default: false
    }
})

</script>


<template>
    <div :class="[vertical?'border-r':'border-t', 'border-black']"></div>
</template>
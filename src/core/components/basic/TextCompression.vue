<script setup>
defineProps({
    text: String,
    length: {
        type: Number,
        default: 20
    }
})
</script>

<template>
    <span>{{ text.length < length ? text : text.slice(0, length) + ' ...' }}</span>
</template>

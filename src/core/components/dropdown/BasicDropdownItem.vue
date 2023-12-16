<script setup>
defineProps({
    label: String
})
</script>

<template>
    <div class="py-1.25 transition hover:text-primary-900 cursor-pointer">{{ label }}</div>
</template>

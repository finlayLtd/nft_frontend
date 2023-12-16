<script setup>
defineProps({
    black: Boolean
})

</script>

<template>
    <div :class="[black ? 'bg-black' : '', 'text-white py-14 lg:pt-22 lg:pb-24 px-5.5 sm:px-10 md:px-16 lg:px-22']">
        <slot />
    </div>
</template>

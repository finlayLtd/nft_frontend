<script setup>
defineProps({
    search: {
        type: Boolean,
        default: false
    }
})
</script>


<template>
    <div
        :class="[search ? 'z-10' : 'z-50 sticky', 'top-0 left-0 right-0 bg-black border-b border-black transition-position lg:w-auto lg:items-stretch text-white font-ibm']"
    >
        <div class="max-w-screen-3xl flex mx-auto">
            <slot />
        </div>
    </div>
</template>

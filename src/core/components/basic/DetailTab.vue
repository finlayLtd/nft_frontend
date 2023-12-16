<script setup>
defineProps({
    active: Boolean
})
</script>

<template>
    <div
        :class="[active ? 'text-primary-900' : 'text-white', 'transition min-w-fit pr-6 hover:text-primary-900 cursor-pointer w-auto']"
    >
        <slot />
    </div>
</template>

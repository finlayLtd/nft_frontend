<script setup>
defineProps({
    img_url: String
})
</script>

<template>
    <div
        class="h-summary-xs sm:h-summary-sm px-5.5 sm:px-10 md:px-16 lg:px-22"
        :style="{ background: 'url(' + img_url + ')', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'right' }"
    >
        <div class="max-w-8xl mx-auto">
            <slot />
        </div>
    </div>
</template>
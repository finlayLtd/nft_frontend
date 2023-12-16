<template>
    <div class="md:grid grid-cols-3 text-white gap-x-10 mt-3.5 md:mt-10">
        <div class="col-span-1 pr-10">
            <slot name="item" />
        </div>
        <div class="col-span-2">
            <slot name="value" />
        </div>
    </div>
</template>
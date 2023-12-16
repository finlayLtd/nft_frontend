<script setup>
import { computed } from "vue"

const props = defineProps({
    modelValue: String,
    placeholder: String,
    iconGroup: String,
    icon: String,
    readonly: Boolean
})

const emit = defineEmits(['update:modelValue'])

const computedValue = computed({
  get: () => props.modelValue,
  set: value => {
    emit('update:modelValue', value)
  }
})

</script>

<template>
    <div v-if="icon" class="absolute bg-black w-13 h-13 flex justify-center items-center">
        <font-awesome-icon :icon="[iconGroup, icon]" class="text-white text-base" />
    </div>
    <input
        v-model="computedValue"
        :class="[icon ? 'pl-17.5' : 'pl-4.75', 'pr-14 h-13.5 focus:outline-none border-2 border-black text-white placeholder-tertiary-500 bg-tertiary-700 w-full font-ibm text-sm']"
        :placeholder="placeholder"
        :readonly="readonly"
    />
</template>

<style scoped>
input {
    white-space: nowrap; /*keep text on one line */
    overflow: hidden; /*prevent text from being shown outside the border */
    text-overflow: ellipsis;
}
</style>

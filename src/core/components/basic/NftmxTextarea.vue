<script setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: String,
  placeholder: String,
  error: Boolean,
});

const emit = defineEmits(["update:modelValue"]);

const computedValue = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit("update:modelValue", value);
  },
});
</script>

<template>
  <div :class="[error ? 'border-red-800' : 'border-black', 'border-2']">
    <textarea
      v-model="computedValue"
      class="outline-none text-white placeholder-tertiary-500 bg-tertiary-700 w-full h-full font-ibm text-sm -mb-1.25 pt-2 px-4"
      :placeholder="placeholder"
    />
  </div>
</template>

<style scoped>
textarea {
  border: none;
  overflow: auto;
  outline: none;

  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;
  resize: none;
}
</style>

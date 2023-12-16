<script setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: [String, Number],
  placeholder: String,
  readonly: Boolean,
  number: Boolean,
  error: Boolean,
  border: { type: String, default: "normal" },
  min: Number,
  max: Number,
});

const emit = defineEmits(["update:modelValue"]);

const updateInput = (event) => {
  let value = event.target.value;
  if (props.number) {
    value = parseFloat(value);
  }
  if (props.number && props.max !== undefined && value > props.max) {
    emit("update:modelValue", props.max);
    event.target.value = props.max;
  } else if (props.number && props.min !== undefined && value < props.min) {
    emit("update:modelValue", props.min);
    event.target.value = props.min;
  } else {
    emit("update:modelValue", value);
  }
};
</script>

<template>
  <input
    :value="modelValue"
    @input="updateInput"
    :class="[
      border === 'normal' ? 'border' : border === 'thick' ? 'border-2' : '',
      error ? 'border-red-800' : 'border-black',
      'focus:outline-none text-white placeholder-tertiary-500 bg-transparent w-full px-4',
    ]"
    :placeholder="placeholder"
    :readonly="readonly"
    :type="number ? 'number' : 'text'"
  />
</template>

<style scoped>
input {
  white-space: nowrap; /*keep text on one line */
  overflow: hidden; /*prevent text from being shown outside the border */
  text-overflow: ellipsis;
}
</style>

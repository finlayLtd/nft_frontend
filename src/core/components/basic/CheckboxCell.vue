<script setup>
import { ref, watch } from "vue";

defineProps({
  type: {
    type: String,
    default: "span",
  },
  text: {
    type: String,
    default: "",
  },
  border: String,
  small: Boolean,
  bgColor: String,
});

const emit = defineEmits(["checked"]);

const checked = ref(false);

watch(checked, (newVal) => {
  emit("checked", newVal);
});
</script>

<template>
  <component :is="type" class="checkbox-cell mr-4 my-1">
    <label :class="[text ? text : 'text-white', 'container']">
      <slot />
      <input v-model="checked" type="checkbox" checked="checked" />
      <span
        :class="[
          bgColor ? bgColor : '',
          border ? border : 'border-black',
          small ? 'w-4 h-4' : 'w-4.5 h-4.5',
          'checkmark border-2 text-primary-700',
        ]"
      ></span>
    </label>
  </component>
</template>

<style scoped>
.container {
  display: block;
  position: relative;
  padding-left: 32px;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Hide the browser's default checkbox */
.container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

/* Create a custom checkbox */
.checkmark {
  position: absolute;
  top: 2px;
  left: 0;
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show the checkmark when checked */
.container input:checked ~ .checkmark:after {
  display: block;
}

/* Style the checkmark/indicator */
.container .checkmark:after {
  left: 6px;
  top: -6px;
  width: 10px;
  height: 16px;
  border: solid #19cb58;
  border-width: 0 4px 4px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}
</style>

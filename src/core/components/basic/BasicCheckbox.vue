<script setup>
import { ref, watch } from "vue";

const emit = defineEmits(["check"]);
const props = defineProps({
  type: {
    type: String,
    default: "span",
  },
  border: String,
  small: Boolean,
  bgColor: String,
  checked: Boolean,
  thick: Boolean,
  color: String,
});

const check = (evt) => {
  emit("check", evt.target.checked);
};
</script>

<template>
  <component :is="type" class="checkbox-cell">
    <label :class="[small ? 'w-4 h-4' : 'w-4.5 h-4.5', 'container']">
      <input type="checkbox" :checked="checked" @change="check" />
      <span
        :class="[
          bgColor ? bgColor : '',
          border ? border : 'border-black',
          small ? 'w-3.75 h-3.75 checkmark-small' : 'w-4.5 h-4.5 checkmark',
          thick ? 'border-2' : 'border',
          color === 'primary'
            ? 'after:border-primary-900'
            : 'after:border-red-600',
        ]"
      />
      <slot />
    </label>
  </component>
</template>

<style scoped>
.container {
  display: block;
  position: relative;
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
  border-width: 0 4px 4px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}

/* Create a custom checkbox */
.checkmark-small {
  position: absolute;
  top: 2px;
  left: 0;
}

.checkmark-small:after {
  content: "";
  position: absolute;
  display: none;
}

.container input:checked ~ .checkmark-small:after {
  display: block;
}

.container .checkmark-small:after {
  left: 6px;
  top: -3px;
  width: 8px;
  height: 13px;
  border-width: 0 3px 3px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}
</style>

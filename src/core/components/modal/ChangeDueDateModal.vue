<script setup>
import { computed, ref } from "vue";
import { $vfm } from "vue-final-modal";
import NftmxButton from "@/core/components/basic/NftmxButton.vue";
import { useToast } from "vue-toastification";
import Web3 from "web3/dist/web3.min.js";
import { useStore } from "vuex";
import DatePicker from "@/core/components/v-calendar/src/components/DatePicker/DatePicker.vue";
import { formatAMPM } from "@/core/utils/common";
import { updateBid } from "@/core/utils/contracts/market.utils.js";
import { updateBidInMlr } from "@/core/utils/contracts/mlr.utils.js";
import { BSC_TESTNET_MARKET_ORDER_CONTRACT_ADDRESS } from "@/core/config/constant";

const props = defineProps({
  order: Object,
});

const store = useStore();
const toast = useToast();
const pickerOpened = ref(false);
const datePicker = ref();
const currentDate = computed(() =>
  props.order
    ? new Date(props.order.endSaleTime * 1000).toLocaleString("default", {
        month: "long",
      }) +
      " " +
      new Date(props.order.endSaleTime * 1000).getDate() +
      ", " +
      new Date(props.order.endSaleTime * 1000).getFullYear()
    : ""
);
const endTime = computed(() => {
  if (datePicker.value) {
    return (
      datePicker.value.toLocaleString("default", { month: "long" }) +
      " " +
      datePicker.value.getDate() +
      ", " +
      datePicker.value.getFullYear() +
      " " +
      formatAMPM(datePicker.value) +
      " UTC"
    );
  } else {
    return "";
  }
});
const warn = ref(false);
const loading = ref(false);

const cancel = () => {
  $vfm.hide("vaultModal");
};
const clickOutsidePicker = () => {
  pickerOpened.value = false;
};
const changeDueDate = async () => {
  if (!datePicker.value) {
    toast.error("Choose a due date");
    warn.value = true;
    return;
  }

  loading.value = true;
  try {
    if (
      props.order.contractAddress === BSC_TESTNET_MARKET_ORDER_CONTRACT_ADDRESS
    ) {
      await updateBid(
        props.order.orderId,
        Math.floor(new Date(datePicker.value).getTime() / 1000)
      );
    } else {
      await updateBidInMlr(
        props.order.contractAddress,
        props.order.orderId,
        Math.floor(new Date(datePicker.value).getTime() / 1000)
      );
    }
    toast.success("Due date has been successfully updated.");
    cancel();
  } catch (err) {
    if (err.code === 4001) {
      toast.error("User denied transaction signature.");
    } else {
      toast.error("Something went wrong.");
    }
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <vue-final-modal
    classes="w-full flex justify-center overflow-y-auto"
    content-class="my-4 lg:my-auto mx-4 h-fit"
    :overlay-style="{ backgroundColor: 'black', opacity: '0.9' }"
    name="vaultModal"
    esc-to-close
    fit-parent
  >
    <div class="bg-tertiary-900 text-white w-full xl:w-btn-xl">
      <div class="text-right text-[22px] leading-none p-5">
        <span
          class="cursor-pointer hover:text-red-900 transition"
          @click="cancel"
        >
          &#10005;
        </span>
      </div>
      <div class="text-center relative mt-2 px-4 lg:px-17.25 pb-16">
        <div class="font-press text-xl sm:text-2xl">Change Due Date</div>
        <div class="font-ibm-bold text-lg grid grid-cols-2 text-start mt-10">
          <div>Current due date</div>
          <div>Update due date</div>
        </div>
        <div
          class="font-ibm text-sm grid grid-cols-2 items-center text-start mt-3"
        >
          <div>{{ currentDate }}</div>
          <div class="relative">
            <div
              @click="pickerOpened = !pickerOpened"
              class="flex font-ibm text-sm cursor-pointer"
            >
              <div
                :class="[
                  warn && !datePicker ? 'border-red-800' : 'border-black',
                  'flex items-center justify-between gap-5 border-2 h-13.5 text-white bg-tertiary-700 w-full pl-5 font-ibm-light text-sm',
                ]"
              >
                <div>
                  {{ endTime }}
                </div>
                <div class="bg-black h-full w-13 p-3.5">
                  <font-awesome-icon
                    :icon="['fas', 'calendar-alt']"
                    class="text-lg ml-0.75 mr-0.5"
                  />
                </div>
              </div>
            </div>
            <div class="absolute w-full z-30">
              <date-picker
                v-if="pickerOpened"
                v-click-outside="clickOutsidePicker"
                mode="dateTime"
                v-model="datePicker"
                :min-date="new Date()"
                color="red"
                is-dark
                is-expanded
              />
            </div>
          </div>
        </div>
        <nftmx-button
          outline
          color="primary"
          textColor="white"
          label="CHANGE DUE DATE"
          class="w-full font-press mt-10 text-lg"
          h="xl"
          @click="changeDueDate"
          :loading="loading"
        />
      </div>
    </div>
  </vue-final-modal>
</template>

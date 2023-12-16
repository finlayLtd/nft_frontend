<script setup>
import NftmxInput from "@/core/components/basic/NftmxInput.vue";
import NftmxTextarea from "@/core/components/basic/NftmxTextarea.vue";
import NftmxRadio from "@/core/components/basic/NftmxRadio.vue";
import NftmxImg from "@/core/components/basic/NftmxImg.vue";
import { computed, ref } from "vue";
import NftmxTooltip from "@/core/components/basic/NftmxTooltip.vue";
import NftmxButton from "@/core/components/basic/NftmxButton.vue";
import { useToast } from "vue-toastification";
import DatePicker from "@/core/components/v-calendar/src/components/DatePicker/DatePicker.vue";

const props = defineProps({
  dvcFee: Object,
});
const emit = defineEmits(["set-dvc-fee", "move-back"]);

const toast = useToast();
const fundStruct = ref(props.dvcFee.fundStruct ?? "OPEN");
const lastJoinDate = ref(props.dvcFee.lastJoinDate);
const lastJoinDateDisplay = computed(() => {
  if (!lastJoinDate.value) return "";
  const date = new Date(lastJoinDate.value);
  return (
    date.toLocaleString("default", { month: "long" }) +
    " " +
    date.getDate() +
    ", " +
    date.getFullYear()
  );
});
const lastJoinDatePicker = ref(false);
const lastLeaveDate = ref(props.dvcFee.lastLeaveDate);
const lastLeaveDateDisplay = computed(() => {
  if (!lastLeaveDate.value) return "";
  const date = new Date(lastLeaveDate.value);
  return (
    date.toLocaleString("default", { month: "long" }) +
    " " +
    date.getDate() +
    ", " +
    date.getFullYear()
  );
});
const lastLeaveDatePicker = ref(false);
const feeStruct = ref(props.dvcFee.feeStruct ?? "CARRY");
const feeValue = ref(props.dvcFee.feeValue);
const maxBackerAllowed = ref(props.dvcFee.maxBackerAllowed);
const minInvestment = ref(props.dvcFee.minInvestment);
const maxInvestment = ref(props.dvcFee.maxInvestment);
const dvcLimit = ref(props.dvcFee.dvcLimit ?? "PUBLIC");
const kyc = ref(props.dvcFee.kyc ?? false);
const warn = ref(false);

const onInputChange = (e) => {
  logo.value = e.target.files[0];
  logoPreview.value = URL.createObjectURL(logo.value);
};
const nextStep = () => {
  if (
    (fundStruct.value === "CLOSE" &&
      (!lastJoinDateDisplay.value || !lastLeaveDateDisplay.value)) ||
    maxInvestment.value < minInvestment.value
  ) {
    warn.value = true;
    toast.error("Please fill out the fields");
    return;
  }
  const data = {
    fundStruct: fundStruct.value,
    feeStruct: feeStruct.value,
    feeValue: feeValue.value,
    maxBackerAllowed: maxBackerAllowed.value,
    minInvestment: minInvestment.value,
    maxInvestment: maxInvestment.value,
    dvcLimit: dvcLimit.value,
    kyc: kyc.value,
    lastJoinDate: lastJoinDate,
    lastLeaveDate: lastLeaveDate,
  };
  emit("set-dvc-fee", data);
};
const closeJoinPicker = () => {
  lastJoinDatePicker.value = false;
};
const closeLeavePicker = () => {
  lastLeaveDatePicker.value = false;
};
</script>

<template>
  <div>
    <div
      class="text-tertiary-400 cursor-pointer transition hover:text-secondary-700 h-fit mt-3"
      @click="emit('move-back', 0)"
    >
      <font-awesome-icon :icon="['fas', 'angle-left']" />
      <span class="text-sm"> Back </span>
    </div>
    <div class="mt-7">
      <span class="font-ibm-bold text-3xl text-white">DVC fees</span>
    </div>
    <p class="text-tertiary-400 mt-6">
      DVC creators, much like a GP, can choose to charge a carry or fix success
      fees from the profit of their LPs. Akin to real world GPs, DVCs are
      incentivized to bring added value to the portfolio by marketing,
      promoting, or by building on top of the NFTs to directly add value vs
      waiting for market forces to appreciate the NFT.
    </p>
    <div class="font-ibm-medium text-white text-lg mt-16">
      <div class="grid 2xl:grid-cols-2 items-center">
        <div
          class="grid sm:grid-cols-2 2xl:grid-cols-5 items-start lg:items-center"
        >
          <div class="col-span-1 2xl:col-span-2 flex">
            <span> Fund structure </span>
          </div>
          <div
            class="col-span-1 2xl:col-span-3 2xl:mr-12 text-sm font-ibm mt-3.25 sm:mt-0 grid grid-cols-2"
          >
            <div
              class="flex gap-3 items-center w-fit cursor-pointer"
              @click="fundStruct = 'OPEN'"
            >
              <nftmx-radio :active="fundStruct === 'OPEN'" />
              <div class="flex-1">
                <span>
                  Open ended fund
                  <nftmx-tooltip
                    text="An open-ended fund structure allows investors to enter and exit the fund at any point in time without restriction"
                  >
                    <sup>
                      <font-awesome-icon
                        :icon="['fas', 'question-circle']"
                        class="text-xs cursor-pointer"
                      />
                    </sup>
                  </nftmx-tooltip>
                </span>
              </div>
            </div>
            <div
              class="flex gap-3 items-center w-fit cursor-pointer"
              @click="fundStruct = 'CLOSE'"
            >
              <nftmx-radio :active="fundStruct === 'CLOSE'" />
              <div class="flex-1">
                <span>
                  Close ended fund
                  <nftmx-tooltip
                    text="A closed-ended fund structure has a set fundraising period and once it ends, no new investors can join the fund"
                  >
                    <sup>
                      <font-awesome-icon
                        :icon="['fas', 'question-circle']"
                        class="text-xs cursor-pointer"
                      />
                    </sup>
                  </nftmx-tooltip>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="fundStruct === 'CLOSE'"
          class="grid grid-cols-2 2xl:ml-12 text-sm font-ibm gap-8 mt-5 2xl:mt-0 h-7"
        >
          <div class="flex items-center gap-6 relative">
            <span>
              Last date to join the fund
              <nftmx-tooltip
                text="Set a date when LP funds are no longer accepted"
              >
                <sup>
                  <font-awesome-icon
                    :icon="['fas', 'question-circle']"
                    class="text-xs cursor-pointer"
                  />
                </sup>
              </nftmx-tooltip>
            </span>
            <font-awesome-icon
              :icon="['fas', 'calendar-alt']"
              :class="[
                warn && !lastJoinDateDisplay ? 'text-red-800' : '',
                'text-lg cursor-pointer',
              ]"
              @click="lastJoinDatePicker = true"
            />
            <span>{{ lastJoinDateDisplay }}</span>
            <div
              v-if="lastJoinDatePicker"
              class="absolute top-10 w-full z-10 max-w-lg"
              v-click-outside="closeJoinPicker"
            >
              <date-picker
                v-model="lastJoinDate"
                is-dark
                is-expanded
                mode="dateTime"
              />
            </div>
          </div>
          <div class="flex items-center gap-6 relative">
            <span>
              Due date to leave the fund
              <nftmx-tooltip
                text="Set a date when LPs are allowed to cash out and leave the fund"
              >
                <sup>
                  <font-awesome-icon
                    :icon="['fas', 'question-circle']"
                    class="text-xs cursor-pointer"
                  />
                </sup>
              </nftmx-tooltip>
            </span>
            <font-awesome-icon
              :icon="['fas', 'calendar-alt']"
              :class="[
                warn && !lastLeaveDateDisplay ? 'text-red-800' : '',
                'text-lg cursor-pointer',
              ]"
              @click="lastLeaveDatePicker = true"
            />
            <span>{{ lastLeaveDateDisplay }}</span>
            <div
              v-if="lastLeaveDatePicker"
              class="absolute top-10 w-full z-10 max-w-lg"
              v-click-outside="closeLeavePicker"
            >
              <date-picker
                v-model="lastLeaveDate"
                is-dark
                is-expanded
                mode="dateTime"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="grid 2xl:grid-cols-2 items-center mt-10">
        <div
          class="grid sm:grid-cols-2 2xl:grid-cols-5 items-start lg:items-center"
        >
          <div class="col-span-1 2xl:col-span-2 flex">
            <span>
              Fee structure
              <nftmx-tooltip text="Set the fee structure for your DVC.">
                <sup>
                  <font-awesome-icon
                    :icon="['fas', 'question-circle']"
                    class="text-xs cursor-pointer"
                  />
                </sup>
              </nftmx-tooltip>
            </span>
          </div>
          <div
            class="col-span-1 2xl:col-span-3 2xl:mr-12 lg:flex items-center justify-between text-sm font-ibm mt-3.25 sm:mt-0 grid grid-cols-2"
          >
            <div
              class="flex gap-3 items-center w-fit cursor-pointer"
              @click="
                feeStruct = 'CARRY';
                feeValue = 0;
              "
            >
              <nftmx-radio :active="feeStruct === 'CARRY'" />
              <div class="flex-1">
                <span>
                  % Carry
                  <nftmx-tooltip
                    text="Carry, also known as carried interest, is the share of profits that a venture capital firm earns as a result of its investments. It is typically a percentage of the profits earned by the fund, and it is paid to the VC firm's partners or general partners as a performance incentive"
                  >
                    <sup>
                      <font-awesome-icon
                        :icon="['fas', 'question-circle']"
                        class="text-xs cursor-pointer"
                      />
                    </sup>
                  </nftmx-tooltip>
                </span>
              </div>
            </div>
            <div
              class="flex gap-3 items-center w-fit cursor-pointer"
              @click="
                feeStruct = 'FEE';
                feeValue = 0;
              "
            >
              <nftmx-radio :active="feeStruct === 'FEE'" />
              <div class="flex-1">
                <span>
                  $ Fix fees
                  <nftmx-tooltip
                    text="A fee structured based on fees, rewards your DVC on the funds sent from backers into the DVC"
                  >
                    <sup>
                      <font-awesome-icon
                        :icon="['fas', 'question-circle']"
                        class="text-xs cursor-pointer"
                      />
                    </sup>
                  </nftmx-tooltip>
                </span>
              </div>
            </div>
            <div
              class="flex items-center border-2 w-full sm:w-fit mt-4.75 lg:mt-0 col-span-2 border-black"
            >
              <div
                class="bg-black h-12.5 flex items-center justify-center w-12"
              >
                {{ feeStruct === "CARRY" ? "%" : "$" }}
              </div>
              <div class="bg-tertiary-700 w-full flex-1">
                <nftmx-input
                  number
                  class="h-12.5 w-full lg:w-30"
                  v-model="feeValue"
                  :max="feeStruct === 'CARRY' ? 100 : undefined"
                  border="none"
                />
              </div>
            </div>
          </div>
        </div>
        <div
          class="grid sm:grid-cols-2 2xl:grid-cols-11 items-center mt-7 2xl:mt-0"
        >
          <div class="col-span-1 2xl:col-span-5 2xl:ml-12">
            Maximum backers allowed
          </div>
          <div
            class="bg-tertiary-700 text-sm col-span-1 2xl:col-span-6 2xl:mr-12 w-full mt-3.25 sm:mt-0"
          >
            <nftmx-input
              class="h-13"
              number
              v-model="maxBackerAllowed"
              border="thick"
            />
          </div>
        </div>
      </div>
      <div class="grid 2xl:grid-cols-2 items-center mt-7.5">
        <div class="grid sm:grid-cols-2 2xl:grid-cols-5 items-center">
          <div class="col-span-1 2xl:col-span-2">Minimum backer investment</div>
          <div
            class="col-span-1 2xl:col-span-3 2xl:mr-12 flex items-center text-sm font-ibm mt-3.25 sm:mt-0"
          >
            <div class="flex items-center w-full border-2 border-black">
              <div
                class="bg-black h-12.5 flex items-center justify-center w-12"
              >
                <font-awesome-icon :icon="['fab', 'ethereum']" />
              </div>
              <div class="bg-tertiary-700 w-full flex-1">
                <nftmx-input
                  number
                  placeholder="Type Amount"
                  class="h-12.5"
                  v-model="minInvestment"
                  border="none"
                  :min="0"
                />
              </div>
            </div>
          </div>
        </div>
        <div
          class="grid sm:grid-cols-2 2xl:grid-cols-11 items-center mt-7 2xl:mt-0"
        >
          <div class="col-span-1 2xl:col-span-5 2xl:ml-12">
            Maximum backer investment
          </div>
          <div
            class="col-span-1 2xl:col-span-6 2xl:mr-12 w-full mt-3.25 sm:mt-0"
          >
            <div
              :class="[
                warn && maxInvestment < minInvestment
                  ? 'border-red-800'
                  : 'border-black',
                'flex items-center w-full text-sm font-ibm border-2',
              ]"
            >
              <div
                class="bg-black h-12.5 flex items-center justify-center w-12"
              >
                <font-awesome-icon :icon="['fab', 'ethereum']" />
              </div>
              <div class="bg-tertiary-700 w-full flex-1">
                <nftmx-input
                  number
                  placeholder="Type Amount"
                  class="h-12.5"
                  v-model="maxInvestment"
                  border="none"
                />
              </div>
            </div>
            <p
              v-if="warn && maxInvestment < minInvestment"
              class="font-ibm text-11 text-red-900 h-0"
            >
              Should be greater than the minimum backer investment
            </p>
          </div>
        </div>
      </div>
      <div class="grid 2xl:grid-cols-2 items-center mt-11">
        <div class="grid sm:grid-cols-2 2xl:grid-cols-5 items-center">
          <div class="col-span-1 2xl:col-span-2">DVC limitations</div>
          <div
            class="col-span-1 2xl:col-span-3 2xl:mr-12 flex items-center text-sm font-ibm mt-3.25 sm:mt-0"
          >
            <div class="grid grid-cols-2 items-center w-full justify-between">
              <div
                class="flex gap-3 items-center w-fit cursor-pointer"
                @click="dvcLimit = 'PUBLIC'"
              >
                <nftmx-radio :active="dvcLimit === 'PUBLIC'" />
                <span>
                  Public
                  <nftmx-tooltip
                    text="Allows anyone to participate in the funds"
                  >
                    <sup>
                      <font-awesome-icon
                        :icon="['fas', 'question-circle']"
                        class="text-xs cursor-pointer"
                      />
                    </sup>
                  </nftmx-tooltip>
                </span>
              </div>
              <div
                class="flex gap-3 items-center w-fit cursor-pointer"
                @click="dvcLimit = 'PRIVATE'"
              >
                <nftmx-radio :active="dvcLimit === 'PRIVATE'" />
                <span>
                  Private
                  <nftmx-tooltip
                    text="Private funds allow access to a limited number of partners or only to approved value-add partners."
                  >
                    <sup>
                      <font-awesome-icon
                        :icon="['fas', 'question-circle']"
                        class="text-xs cursor-pointer"
                      />
                    </sup>
                  </nftmx-tooltip>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="grid 2xl:grid-cols-2 items-center mt-14">
        <div class="grid sm:grid-cols-2 2xl:grid-cols-5 items-center">
          <div class="col-span-1 2xl:col-span-2">
            <span>
              Require KYC
              <nftmx-tooltip
                text="Only accept users to the fund that have passed KYC / AML"
              >
                <sup>
                  <font-awesome-icon
                    :icon="['fas', 'question-circle']"
                    class="text-xs cursor-pointer"
                  />
                </sup>
              </nftmx-tooltip>
            </span>
          </div>
          <div
            class="col-span-1 2xl:col-span-3 2xl:mr-12 flex items-center text-sm font-ibm mt-3.25 sm:mt-0"
          >
            <div class="grid grid-cols-2 items-center w-full justify-between">
              <div
                class="flex gap-3 items-center w-fit cursor-pointer"
                @click="kyc = false"
              >
                <nftmx-radio :active="!kyc" />
                <span>No</span>
              </div>
              <div
                class="flex gap-3 items-center w-fit cursor-pointer"
                @click="kyc = true"
              >
                <nftmx-radio :active="kyc" />
                <span>Yes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-between items-center my-20">
      <div
        class="text-tertiary-400 cursor-pointer transition hover:text-secondary-700 h-fit"
        @click="emit('move-back', 0)"
      >
        <font-awesome-icon :icon="['fas', 'angle-left']" />
        <span class="text-sm"> Back </span>
      </div>
      <nftmx-button
        outline
        color="secondary"
        textColor="white"
        label="NEXT STEP"
        class="font-press px-38 text-lg"
        h="xl2"
        customPx
        @click="nextStep"
      />
    </div>
  </div>
</template>

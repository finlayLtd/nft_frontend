<script setup>
import NftmxButton from "@/core/components/basic/NftmxButton.vue";
import { capitalize } from "lodash";
import { $vfm } from "vue-final-modal";
import NftmxImg from "@/core/components/basic/NftmxImg.vue";
import NftmxTooltip from "@/core/components/basic/NftmxTooltip.vue";
import { useStore } from "vuex";
import { themeConfig } from "@/core/config/constant";
import { computed, ref } from "vue";
import Web3 from "web3/dist/web3.min.js";
import NftmxInput from "@/core/components/basic/NftmxInput.vue";
import { useToast } from "vue-toastification";
import { addLiquidity } from "@/core/utils/contracts/dvc.utils.js";
import { shortenAddress } from "@/core/utils/common";

const props = defineProps({
  dvc: Object,
});

const emit = defineEmits(["invest"]);

const toast = useToast();
const store = useStore();
const windowWidth = computed(() => store.state.app.windowWidth);
const investment = ref();
const loading = ref(false);

const invest = async () => {
  if (!store.state.wallet.account) {
    toast.error("Please connect wallet.");
    return;
  }

  try {
    loading.value = true;
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x61" }],
    });

    await addLiquidity(
      props.dvc.address,
      Web3.utils.toWei(investment.value.toString())
    );

    toast.success("Investment has been added successfully");
    cancel();
    loading.value = false;
  } catch (err) {
    if (err.code === 4001) {
      toast.error("User denied transaction signature.");
    } else {
      toast.error("Something went wrong");
    }
    loading.value = false;
  }
};

const cancel = () => {
  $vfm.hide("backDvcModal");
};
</script>

<template>
  <vue-final-modal
    classes="w-full flex justify-center overflow-y-auto"
    content-class="my-4 lg:my-auto mx-4 h-fit"
    :overlay-style="{ backgroundColor: 'black', opacity: '0.9' }"
    name="backDvcModal"
    esc-to-close
    fit-parent
  >
    <div class="bg-tertiary-900 text-white xl:w-modal-md 3xl:w-modal-big">
      <div class="text-right text-xl p-5">
        <font-awesome-icon
          :icon="['fas', 'times']"
          class="cursor-pointer hover:text-tertiary-400 transition"
          @click="cancel"
        />
      </div>
      <div
        class="text-center font-press text-xl md:text-2xl leading-6 mx-4 py-2"
      >
        Back This DVC
      </div>
      <div class="px-8 lg:px-16 pb-20 mt-6">
        <div class="overflow-auto">
          <div class="grid lg:grid-cols-3 py-7 font-ibm-medium text-xs">
            <div
              class="w-full lg:border-r lg:border-black lg:pr-6 lg:border-b-0 border-b border-black pb-6"
            >
              <div class="text-lg flex justify-between">
                <span>ABOUT</span>
                <div class="text-11 font-ibm">
                  <span>
                    {{
                      dvc.fundStruct === "OPEN"
                        ? "Open ended fund"
                        : "Close ended fund"
                    }}
                  </span>
                  <nftmx-tooltip
                    :text="
                      dvc.fundStruct === 'OPEN'
                        ? 'Open ended funds allow investors to join and leave the fund at any time'
                        : 'Close ended funds end fundraising on a due date'
                    "
                  >
                    <sup>
                      <font-awesome-icon
                        :icon="['fas', 'question-circle']"
                        class="text-10 cursor-pointer ml-1"
                      />
                    </sup>
                  </nftmx-tooltip>
                </div>
              </div>
              <div class="flex gap-4.5 items-center py-4">
                <div class="w-13.5 h-13.5">
                  <nftmx-img
                    :src="dvc.logo"
                    class="object-cover object-center w-full h-full"
                  />
                </div>
                <div class="font-ibm">
                  <div class="text-13">
                    <span class="text-primary-900"> {{ dvc.name }} </span>
                    <span class="text-tertiary-400">
                      (DVC {{ dvc.index }})
                    </span>
                  </div>
                  <div class="mt-1 text-11">
                    <span class="text-tertiary-400">GP: </span>
                    <span>
                      {{
                        windowWidth >= themeConfig.xl3
                          ? Web3.utils.toChecksumAddress(dvc.address)
                          : shortenAddress(
                              Web3.utils.toChecksumAddress(dvc.address)
                            )
                      }}
                    </span>
                  </div>
                </div>
              </div>
              <p class="font-ibm text-11">
                {{ dvc.description }}
              </p>
              <div class="flex text-sm py-6 gap-6 text-tertiary-400">
                <font-awesome-icon
                  :icon="['fas', 'globe']"
                  class="cursor-pointer hover:text-white transition"
                />
                <font-awesome-icon
                  :icon="['fab', 'twitter']"
                  class="cursor-pointer hover:text-white transition"
                />
                <font-awesome-icon
                  :icon="['fab', 'medium-m']"
                  class="cursor-pointer hover:text-white transition"
                />
                <font-awesome-icon
                  :icon="['fab', 'telegram-plane']"
                  class="cursor-pointer hover:text-white transition"
                />
                <font-awesome-icon
                  :icon="['fab', 'discord']"
                  class="cursor-pointer hover:text-white transition"
                />
                <font-awesome-icon
                  :icon="['fab', 'instagram']"
                  class="cursor-pointer hover:text-white transition"
                />
              </div>
            </div>
            <div
              class="lg:px-6 lg:border-l lg:border-l-tertiary-700 lg:border-r py-6 lg:py-0 border-t lg:border-t-0 border-t-tertiary-700 border-b lg:border-b-0 border-black"
            >
              <span class="text-lg">BUY CRITERIA</span>
              <div class="font-ibm text-11 mt-2.5">
                <div class="py-0.5">
                  <span class="text-tertiary-400"> Buy type: </span>
                  <span>
                    {{
                      dvc.buyType === "INDIVIDUAL"
                        ? "Individual NFT"
                        : "pack of NFTs"
                    }}
                  </span>
                </div>
                <div class="py-0.5">
                  <span class="text-tertiary-400"> Buy model: </span>
                  <span>
                    {{ dvc.buyModel === "FIX_SALE" ? "Fix sale" : "Auction" }}
                  </span>
                </div>
                <div class="py-0.5">
                  <span class="text-tertiary-400"> NFT value: </span>
                  <span> Minimum </span>
                  <span> ${{ dvc.minBuyPrice }} </span>
                  <span class="text-tertiary-400"> | </span>
                  <span> Maximum </span>
                  <span> ${{ dvc.maxBuyPrice }} </span>
                </div>
                <div class="py-0.5">
                  <span class="text-tertiary-400"> Transferred: </span>
                  <span> Minimum </span>
                  <span> {{ dvc.minTrans }} </span>
                  <span class="text-tertiary-400"> | </span>
                  <span> Maximum </span>
                  <span> {{ dvc.maxTrans }} </span>
                </div>
                <div class="py-0.5">
                  <span class="text-tertiary-400"> Downside protection: </span>
                  <span> Minimum </span>
                  <span> {{ dvc.minBuyProtection }}% </span>
                  <span class="text-tertiary-400"> | </span>
                  <span> Maximum </span>
                  <span> {{ dvc.maxBuyProtection }}% </span>
                </div>
                <div class="py-0.5">
                  <span class="text-tertiary-400"> Downside period: </span>
                  <span> Minimum </span>
                  <span> {{ dvc.minBuyPeriod }} days </span>
                  <span class="text-tertiary-400"> | </span>
                  <span> Maximum </span>
                  <span> {{ dvc.maxBuyPeriod }} days </span>
                </div>
                <div class="py-0.5">
                  <span class="text-tertiary-400"> Unique: </span>
                  <span> Minimum </span>
                  <span> 1/{{ dvc.minUnique }} </span>
                  <span class="text-tertiary-400"> | </span>
                  <span> Maximum </span>
                  <span> 1/{{ dvc.maxUnique }} </span>
                </div>
                <div class="py-0.5">
                  <span class="text-tertiary-400">
                    Allow multilevel ownership:
                  </span>
                  <span> {{ capitalize(dvc.buyMlr) }} </span>
                </div>
                <div class="py-0.5">
                  <span class="text-tertiary-400"> Max to invest: </span>
                  <span> {{ dvc.maxToInvest }}% above last transaction </span>
                </div>
                <div class="py-0.5">
                  <span class="text-tertiary-400"> Max to cancel: </span>
                  <span> {{ dvc.cancelInvest }}% above last transaction </span>
                </div>
                <div class="py-0.5">
                  <span class="text-tertiary-400">
                    Limited to specific collections:
                  </span>
                  <span> {{ capitalize(dvc.collectionLimit) }} </span>
                </div>
              </div>
            </div>
            <div
              class="lg:px-6 lg:border-l lg:border-l-tertiary-700 py-6 lg:py-0 border-t lg:border-t-0 border-t-tertiary-700"
            >
              <span class="text-lg">SELL CRITERIA</span>
              <div class="font-ibm text-11 mt-2.5">
                <div class="py-0.5">
                  <span class="text-tertiary-400"> Sale type: </span>
                  <span>
                    {{
                      dvc.sellType === "INDIVIDUAL"
                        ? "Sell as individual"
                        : "Sell as part of a pack"
                    }}
                  </span>
                </div>
                <div v-if="dvc.sellType === 'PACK'" class="py-0.5">
                  <span class="text-tertiary-400"> Pack as: </span>
                  <span> Minimum 1 </span>
                  <span class="text-tertiary-400"> | </span>
                  <span> Maximum 5 </span>
                  <span class="text-tertiary-400"> | </span>
                  <span> Pack any collection </span>
                </div>
                <div class="py-0.5">
                  <span class="text-tertiary-400"> Sale model: </span>
                  <span>
                    {{ dvc.sellModel === "FIX_SALE" ? "Fix sale" : "Auction" }}
                  </span>
                </div>
                <div class="py-0.5">
                  <span class="text-tertiary-400"> Soft cap: </span>
                  <span>
                    {{
                      dvc.softCapOption === "PRICE"
                        ? "Above purchased price "
                        : "ROI "
                    }}
                  </span>
                  <span> {{ dvc.softCapValue }}% </span>
                </div>
                <div class="py-0.5">
                  <span class="text-tertiary-400"> Downside protection: </span>
                  <span> {{ dvc.sellProtection }}% </span>
                </div>
                <div class="py-0.5">
                  <span class="text-tertiary-400"> Period protection: </span>
                  <span>
                    Same as buy criteria minus
                    {{ dvc.sellPeriod }} day</span
                  >
                </div>
                <div class="py-0.5">
                  <span class="text-tertiary-400">
                    Apply on going royalty:
                  </span>
                  <span> {{ capitalize(dvc.useSellMlr) }} </span>
                  <span v-if="dvc.useSellMlr"> {{ dvc.royalty }}% </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex mt-3 bg-tertiary-700">
          <nftmx-input
            placeholder="Type of amount"
            number
            v-model="investment"
            class="h-13.5 text-white placeholder-tertiary-500 w-full pl-20 font-ibm text-sm"
            border="thick"
          />
          <div
            class="w-14 h-13.5 bg-black absolute bg-[url('/images/currencies/curr-1.png')] bg-no-repeat bg-center"
          />
        </div>
        <div class="w-full text-center mt-12.5">
          <nftmx-button
            color="primary"
            textColor="white"
            outline
            label="INVEST"
            class="font-press text-lg py-5 leading-6 lg:w-1/2"
            h="xl"
            w="full"
            @click="invest"
            :loading="loading"
          />
        </div>
      </div>
    </div>
  </vue-final-modal>
</template>

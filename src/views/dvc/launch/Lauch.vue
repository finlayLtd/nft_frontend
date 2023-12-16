<script setup>
import NftmxImg from "@/core/components/basic/NftmxImg.vue";
import NftmxButton from "@/core/components/basic/NftmxButton.vue";
import { computed, ref } from "vue";
import { v4 as uuidv4 } from "uuid";
import { CHAIN_ROUTES } from "@/core/config/constant";
import marketService from "@/core/services/market.service";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { createDvc } from "../../../core/utils/contracts/dvc-factory.utils";
import Web3 from "web3/dist/web3.min.js";
import { prefixUrl } from "../../../core/utils/common";
import { useToast } from "vue-toastification";

const props = defineProps({
  dvcInfo: Object,
  dvcFee: Object,
  buyCriteria: Object,
  sellCriteria: Object,
});
const emit = defineEmits(["edit-dvc"]);

const store = useStore();
const toast = useToast();
const router = useRouter();
const walletAddress = computed(() => store.getters["auth/walletAddress"]);
const loading = ref(false);

const lastJoinDate =
  props.dvcFee.fundStruct === "CLOSE"
    ? parseInt(new Date(props.dvcFee.lastJoinDate.value).getTime() / 1000)
    : 0;
const lastLeaveDate =
  props.dvcFee.fundStruct === "CLOSE"
    ? parseInt(new Date(props.dvcFee.lastLeaveDate.value).getTime() / 1000)
    : 0;
const minBuyPrice = props.buyCriteria.minPrice
  ? Web3.utils.toWei(props.buyCriteria.minPrice.toString(), "ether")
  : 0;
const maxBuyPrice = props.buyCriteria.maxPrice
  ? Web3.utils.toWei(props.buyCriteria.maxPrice.toString(), "ether")
  : 0;
const launchDvc = async () => {
  if (!store.state.wallet.account) {
    toast.error("Please connect wallet.");
    openConnectWalletModal();
    return;
  }
  ethereum.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: "0x61" }],
  });
  const dvc = new FormData();
  const uuid = uuidv4();
  dvc.append("dvcId", uuid);
  dvc.append("ownerAddress", walletAddress.value);
  dvc.append("name", props.dvcInfo.name);
  dvc.append("logo", props.dvcInfo.logo);
  dvc.append("description", props.dvcInfo.description);
  dvc.append("website", prefixUrl(props.dvcInfo.website));
  dvc.append("twitter", prefixUrl(props.dvcInfo.twitter));
  dvc.append("medium", prefixUrl(props.dvcInfo.medium));
  dvc.append("telegram", prefixUrl(props.dvcInfo.telegram));
  dvc.append("discord", prefixUrl(props.dvcInfo.discord));
  dvc.append("instagram", prefixUrl(props.dvcInfo.instagram));
  dvc.append("fundStruct", props.dvcFee.fundStruct);
  dvc.append("lastJoinDate", lastJoinDate);
  dvc.append("lastLeaveDate", lastLeaveDate);
  dvc.append("feeStruct", props.dvcFee.feeStruct);
  dvc.append("feeValue", props.dvcFee.feeValue || 0);
  dvc.append(
    "maxBackers",
    props.dvcFee.maxBackerAllowed ? parseInt(props.dvcFee.maxBackerAllowed) : 0
  );
  dvc.append("minInvest", props.dvcFee.minInvestment || 0);
  dvc.append("maxInvest", props.dvcFee.maxInvestment || 0);
  dvc.append("dvcLimit", props.dvcFee.dvcLimit);
  dvc.append("kyc", props.dvcFee.kyc);
  dvc.append("buyType", props.buyCriteria.buyType);
  dvc.append("priority", props.buyCriteria.priority);
  dvc.append("buyModel", props.buyCriteria.buyModel);
  dvc.append("maxToInvest", props.buyCriteria.maxToInvest);
  dvc.append("cancelInvest", props.buyCriteria.cancelInvest);
  dvc.append("minBuyPrice", props.buyCriteria.minPrice || 0);
  dvc.append("maxBuyPrice", props.buyCriteria.maxPrice || 0);
  dvc.append("sweep", props.buyCriteria.sweep);
  dvc.append(
    "minTrans",
    props.buyCriteria.minTransferred
      ? parseInt(props.buyCriteria.minTransferred)
      : 0
  );
  dvc.append(
    "maxTrans",
    props.buyCriteria.maxTransferred
      ? parseInt(props.buyCriteria.maxTransferred)
      : 0
  );
  dvc.append(
    "minUnique",
    props.buyCriteria.minUnique ? parseInt(props.buyCriteria.minUnique) : 0
  );
  dvc.append(
    "maxUnique",
    props.buyCriteria.maxUnique ? parseInt(props.buyCriteria.maxUnique) : 0
  );
  dvc.append("minBuyProtection", 100 - props.buyCriteria.maxProtection);
  dvc.append("maxBuyProtection", 100 - props.buyCriteria.minProtection);
  dvc.append("minBuyPeriod", props.buyCriteria.minPeriod);
  dvc.append("maxBuyPeriod", props.buyCriteria.maxPeriod);
  dvc.append("buyMlr", props.buyCriteria.useRoyalty);
  const collectionList = props.buyCriteria.collectionLimit
    ? props.buyCriteria.limitedCollections.map((item) => item.address)
    : [];
  dvc.append("collectionList", collectionList);
  dvc.append("sellType", props.sellCriteria.saleType);
  dvc.append("triggerOption", props.sellCriteria.triggerSaleByOption);
  dvc.append("triggerValue", props.sellCriteria.triggerSaleByValue || 0);
  dvc.append("sellModel", props.sellCriteria.saleModel);
  dvc.append("softCapOption", props.sellCriteria.softCapOption);
  dvc.append("softCapValue", props.sellCriteria.softCapPrice || 0);
  dvc.append("sellProtection", 100 - props.sellCriteria.downsideProtection);
  dvc.append("sellPeriod", props.sellCriteria.protectionPeriod);
  dvc.append("useSellMlr", props.sellCriteria.useRoyalty);
  if (props.sellCriteria.useRoyalty) {
    dvc.append("mlrMaxOwners", parseInt(props.sellCriteria.maxOwners));
    dvc.append("royalty", props.sellCriteria.royaltyPercentage);
    dvc.append("buyout", props.sellCriteria.buyoutPrice);
  }
  dvc.append("triggerRefund", props.sellCriteria.triggerRefundBy);
  loading.value = true;

  try {
    await createDvcOnBackend(CHAIN_ROUTES.BSC_TESTNET, dvc);
    await createDvcOnContract(
      uuid,
      props.dvcFee.fundStruct === "CLOSE",
      lastJoinDate,
      lastLeaveDate,
      [
        collectionList,
        props.buyCriteria.buyType === "PACK",
        props.buyCriteria.buyModel === "AUCTION",
        maxBuyPrice,
        minBuyPrice,
        props.buyCriteria.maxToInvest * 100,
        (100 - props.buyCriteria.maxProtection) * 100,
        props.buyCriteria.maxPeriod * 86400, // day to seconds
        props.buyCriteria.useRoyalty,
      ],
      [
        props.sellCriteria.softCapOption === "PRICE",
        props.sellCriteria.softCapOption === "PRICE"
          ? Web3.utils.toWei(
              props.sellCriteria.softCapPrice.toString(),
              "ether"
            )
          : props.sellCriteria.softCapPrice * 100,
        props.sellCriteria.saleModel === "AUCTION",
        props.sellCriteria.saleType === "PACK",
        props.sellCriteria.nftAmountOfPack ?? 0,
        true,
        (100 - props.sellCriteria.downsideProtection) * 100,
        true,
        props.sellCriteria.downsideProtection * 100,
        props.sellCriteria.useRoyalty,
        props.sellCriteria.royaltyPercentage
          ? props.sellCriteria.royaltyPercentage * 100
          : 0,
        props.sellCriteria.buyoutPrice
          ? Web3.utils.toWei(props.sellCriteria.buyoutPrice.toString())
          : 0,
      ]
    );

    toast.success("DVC created successfully");
    router.push("/dvc");
    loading.value = false;
  } catch (err) {
    if (err.code === 4001) {
      toast.error("User denied transaction signature.");
    } else {
      toast.error("Something went wrong.");
    }
    loading.value = false;
  }
};
const editDvc = (page) => {
  emit("edit-dvc", page);
};
const createDvcOnBackend = async (chain, dvc) => {
  return new Promise((resolve, reject) => {
    marketService
      .createDvc(chain, dvc)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
const createDvcOnContract = async (
  uuid,
  isClose,
  lastJoinDate,
  lastLeaveDate,
  buyArgs,
  sellArgs
) => {
  return new Promise((resolve, reject) => {
    createDvc(uuid, isClose, lastJoinDate, lastLeaveDate, buyArgs, sellArgs)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
const openConnectWalletModal = () => {
  store.commit("app/OPEN_CONNECT_WALLET_MODAL");
};
</script>

<template>
  <div class="text-sm text-tertiary-400 font-ibm">
    <div>
      <div class="mt-16 mb-7">
        <span class="font-ibm-bold text-3xl text-white">Summary</span>
      </div>
      <div>
        <div class="grid grid-cols-24 items-center py-1">
          <div class="col-span-5 text-white font-ibm-medium text-lg">
            DVC name
          </div>
          <div class="col-start-6 col-end-[25] flex justify-between">
            <span>{{ dvcInfo.name }}</span>
            <font-awesome-icon
              :icon="['fas', 'edit']"
              @click="editDvc(0)"
              class="hover:text-white transition cursor-pointer"
            />
          </div>
        </div>
        <div class="grid grid-cols-24 items-start py-1">
          <div class="col-span-5 text-white font-ibm-medium text-lg">
            Add logo
          </div>
          <div class="col-start-6 col-end-[25] flex justify-between py-1">
            <nftmx-img
              :src="dvcInfo.logoPreview"
              class="w-13.5 h-13.5 object-center object-cover"
            />
          </div>
        </div>
        <div class="grid grid-cols-24 items-start py-1">
          <div class="col-span-5 text-white font-ibm-medium text-lg">
            DVC description
          </div>
          <p class="col-start-6 col-end-[25] flex">
            {{ dvcInfo.description }}
          </p>
        </div>
        <div class="grid grid-cols-24 items-start py-1">
          <div class="col-span-5 text-white font-ibm-medium text-lg">
            Display your community power
          </div>
          <div class="col-start-6 col-end-[25]">
            <div v-if="dvcInfo.website" class="flex items-center pt-1 pb-2">
              <div class="w-9">
                <font-awesome-icon :icon="['fas', 'globe']" class="text-sm" />
              </div>
              <span>{{ dvcInfo.website }}</span>
            </div>
            <div v-if="dvcInfo.twitter" class="flex items-center py-2">
              <div class="w-9">
                <font-awesome-icon :icon="['fab', 'twitter']" />
              </div>
              <span>{{ dvcInfo.twitter }}</span>
            </div>
            <div v-if="dvcInfo.medium" class="flex items-center py-2">
              <div class="w-9">
                <font-awesome-icon :icon="['fab', 'medium-m']" />
              </div>
              <span>{{ dvcInfo.medium }}</span>
            </div>
            <div v-if="dvcInfo.telegram" class="flex items-center py-2">
              <div class="w-9">
                <font-awesome-icon :icon="['fab', 'telegram-plane']" />
              </div>
              <span>{{ dvcInfo.telegram }}</span>
            </div>
            <div v-if="dvcInfo.discord" class="flex items-center py-2">
              <div class="w-9">
                <font-awesome-icon :icon="['fab', 'discord']" />
              </div>
              <span>{{ dvcInfo.discord }}</span>
            </div>
            <div v-if="dvcInfo.instagram" class="flex items-center py-2">
              <div class="w-9">
                <font-awesome-icon :icon="['fab', 'instagram']" />
              </div>
              <span>{{ dvcInfo.instagram }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="border-t border-black border-b border-b-tertiary-700 mt-7" />
    <div class="py-8">
      <div class="grid grid-cols-24 items-center py-1">
        <div class="col-span-5 text-white font-ibm-medium text-lg">
          Fund structure
        </div>
        <div class="col-start-6 col-end-[25] flex justify-between">
          <span>
            {{
              dvcFee.fundStruct === "OPEN"
                ? "Open ended fund"
                : "Close ended fund"
            }}
          </span>
          <font-awesome-icon
            :icon="['fas', 'edit']"
            @click="editDvc(1)"
            class="hover:text-white transition cursor-pointer"
          />
        </div>
      </div>
      <div class="grid grid-cols-2 py-1">
        <div class="grid grid-cols-12 items-center">
          <div class="col-span-5 text-white font-ibm-medium text-lg">
            Fee structure
          </div>
          <div class="col-span-7">
            {{ dvcFee.feeStruct === "CARRY" ? "% Carry" : "$ Fee" }}
          </div>
        </div>
        <div class="grid grid-cols-12 items-center pl-12">
          <div class="col-span-5 text-white font-ibm-medium text-lg">
            Maximum backers allowed
          </div>
          <div class="col-span-7">{{ dvcFee.maxBackerAllowed || "Any" }}</div>
        </div>
      </div>
      <div class="grid grid-cols-2 py-1">
        <div class="grid grid-cols-12 items-center">
          <div class="col-span-5 text-white font-ibm-medium text-lg">
            Minimum backer investment
          </div>
          <div class="col-span-7">{{ dvcFee.minInvestment || "Any" }}</div>
        </div>
        <div class="grid grid-cols-12 items-center pl-12">
          <div class="col-span-5 text-white font-ibm-medium text-lg">
            Maximum backer investment
          </div>
          <div class="col-span-7">{{ dvcFee.maxInvestment || "Any" }}</div>
        </div>
      </div>
      <div class="grid grid-cols-2 py-1">
        <div class="grid grid-cols-12 items-center">
          <div class="col-span-5 text-white font-ibm-medium text-lg">
            DVC limitations
          </div>
          <div class="col-span-7">
            {{ dvcFee.dvcLimit === "PUBLIC" ? "Public" : "Private" }}
          </div>
        </div>
      </div>
      <div class="grid grid-cols-24 items-center py-1">
        <div class="col-span-5 text-white font-ibm-medium text-lg">
          Require KYC
        </div>
        <div class="col-start-6 col-end-[25]">
          <span>{{ dvcFee.kyc ? "Yes" : "No" }}</span>
        </div>
      </div>
    </div>
    <div class="border-t border-black border-b border-b-tertiary-700" />
    <div class="py-8">
      <div class="grid grid-cols-2 py-1">
        <div class="grid grid-cols-12 items-center">
          <div class="col-span-5 text-white font-ibm-medium text-lg">
            Buy type
          </div>
          <div class="col-span-7">
            {{
              buyCriteria.buyType === "INDIVIDUAL"
                ? "Buy individual NFT"
                : "Buy a pack of NFTs"
            }}
          </div>
        </div>
        <div class="grid grid-cols-12 items-center pl-12">
          <div class="col-span-5 text-white font-ibm-medium text-lg">
            Priority based on
          </div>
          <div class="col-span-7 flex justify-between">
            {{
              buyCriteria.priority === "LIKE"
                ? "Likes"
                : "First come first serve"
            }}
            <font-awesome-icon
              :icon="['fas', 'edit']"
              @click="editDvc(2)"
              class="hover:text-white transition cursor-pointer"
            />
          </div>
        </div>
      </div>
      <div class="grid grid-cols-24 items-center py-1">
        <div class="col-span-5 text-white font-ibm-medium text-lg">
          Buy model
        </div>
        <div class="col-start-6 col-end-[25]">
          <span>{{
            buyCriteria.buyModel === "FIX_SALE"
              ? "Fix sale"
              : "Syndication Auction"
          }}</span>
        </div>
      </div>
      <div class="grid grid-cols-2 py-1">
        <div class="grid grid-cols-12 items-center">
          <div class="col-span-5 text-white font-ibm-medium text-lg">
            Max to invest
          </div>
          <div class="col-span-7">{{ buyCriteria.maxToInvest }}%</div>
        </div>
        <div class="grid grid-cols-12 items-center pl-12">
          <div class="col-span-5 text-white font-ibm-medium text-lg">
            A trigger to cancel investment
          </div>
          <div class="col-span-7">{{ buyCriteria.cancelInvest }}%</div>
        </div>
      </div>
      <div class="grid grid-cols-2 py-1">
        <div class="grid grid-cols-12 items-center">
          <div class="col-span-5 text-white font-ibm-medium text-lg">
            Minimum NFT value
          </div>
          <div class="col-span-7">${{ buyCriteria.minPrice }}</div>
        </div>
        <div class="grid grid-cols-12 items-center pl-12">
          <div class="col-span-5 text-white font-ibm-medium text-lg">
            Maximum NFT value
          </div>
          <div class="col-span-7">${{ buyCriteria.maxPrice }}</div>
        </div>
      </div>
      <div class="grid grid-cols-24 items-center py-1">
        <div class="col-span-5 text-white font-ibm-medium text-lg">
          Sweep the floor
        </div>
        <div class="col-start-6 col-end-[25]">
          <span>{{ buyCriteria.sweep ? "Yes" : "No" }}</span>
        </div>
      </div>
      <div class="grid grid-cols-2 py-1">
        <div class="grid grid-cols-12 items-center">
          <div class="col-span-5 text-white font-ibm-medium text-lg">
            Minimum NFT transferred
          </div>
          <div class="col-span-7">{{ buyCriteria.minTransferred }}</div>
        </div>
        <div class="grid grid-cols-12 items-center pl-12">
          <div class="col-span-5 text-white font-ibm-medium text-lg">
            Maximum NFT transferred
          </div>
          <div class="col-span-7">{{ buyCriteria.maxTransferred }}</div>
        </div>
      </div>
      <div class="grid grid-cols-2 py-1">
        <div class="grid grid-cols-12 items-center">
          <div class="col-span-5 text-white font-ibm-medium text-lg">
            Minimum unique
          </div>
          <div class="col-span-7">1 of {{ buyCriteria.minUnique }}</div>
        </div>
        <div class="grid grid-cols-12 items-center pl-12">
          <div class="col-span-5 text-white font-ibm-medium text-lg">
            Maximum unique
          </div>
          <div class="col-span-7">1 of {{ buyCriteria.maxUnique }}</div>
        </div>
      </div>
      <div class="grid grid-cols-2 py-1">
        <div class="grid grid-cols-12 items-center">
          <div class="col-span-5 text-white font-ibm-medium text-lg">
            Minimum liquidity protection
          </div>
          <div class="col-span-7">{{ buyCriteria.minProtection }}%</div>
        </div>
        <div class="grid grid-cols-12 items-center pl-12">
          <div class="col-span-5 text-white font-ibm-medium text-lg">
            Maximum liquidity protection
          </div>
          <div class="col-span-7">{{ buyCriteria.maxProtection }}%</div>
        </div>
      </div>
      <div class="grid grid-cols-2 py-1">
        <div class="grid grid-cols-12 items-center">
          <div class="col-span-5 text-white font-ibm-medium text-lg">
            Minimum period protection
          </div>
          <div class="col-span-7">{{ buyCriteria.minPeriod }} DAYS</div>
        </div>
        <div class="grid grid-cols-12 items-center pl-12">
          <div class="col-span-5 text-white font-ibm-medium text-lg">
            Maximum period protection
          </div>
          <div class="col-span-7">{{ buyCriteria.maxPeriod }} DAYS</div>
        </div>
      </div>
      <div class="grid grid-cols-2 py-1">
        <div class="grid grid-cols-12 items-center">
          <div class="col-span-5 text-white font-ibm-medium text-lg">
            Buy with multilevel ownership program
          </div>
          <div class="col-span-7">
            {{ buyCriteria.useRoyalty ? "Yes" : "No" }}
          </div>
        </div>
        <div class="grid grid-cols-12 items-center pl-12">
          <div class="col-span-5 text-white font-ibm-medium text-lg">
            Limited to specific collection
          </div>
          <div class="col-span-7">
            {{ buyCriteria.collectionLimit ? "Yes" : "No" }}
          </div>
        </div>
      </div>
    </div>
    <div class="border-t border-black border-b border-b-tertiary-700 mt-7" />
    <div class="py-8">
      <div class="grid grid-cols-24 items-center py-1">
        <div class="col-span-5 text-white font-ibm-medium text-lg">
          Sale type
        </div>
        <div class="col-start-6 col-end-[25] flex justify-between">
          <span>
            {{
              sellCriteria.saleType === "INDIVIDUAL"
                ? "Sell as individual"
                : "Sell as part of a pack"
            }}
          </span>
          <font-awesome-icon
            :icon="['fas', 'edit']"
            @click="editDvc(3)"
            class="hover:text-white transition cursor-pointer"
          />
        </div>
      </div>
      <div class="grid grid-cols-24 items-center py-1">
        <div class="col-span-5 text-white font-ibm-medium text-lg">
          Trigger to sale by
        </div>
        <div class="col-start-6 col-end-[25]">
          <span>
            {{ sellCriteria.triggerSaleByOption === "DATE" ? "" : "Value of " }}
          </span>
          <span>{{ sellCriteria.triggerSaleByValue }}</span>
        </div>
      </div>
      <div class="grid grid-cols-24 items-center py-1">
        <div class="col-span-5 text-white font-ibm-medium text-lg">
          Sale model
        </div>
        <div class="col-start-6 col-end-[25]">
          <span>
            {{ sellCriteria.saleModel === "FIX_SALE" ? "Fix sale" : "Auction" }}
          </span>
        </div>
      </div>
      <div class="grid grid-cols-24 items-center py-1">
        <div class="col-span-5 text-white font-ibm-medium text-lg">
          Minimum sell price
        </div>
        <div class="col-start-6 col-end-[25]">
          <span>
            {{
              sellCriteria.softCapOption === "ROI" ? "ROI" : "Purchased Price"
            }}
          </span>
        </div>
      </div>
      <div class="grid grid-cols-2 py-1">
        <div class="grid grid-cols-12 items-center">
          <div class="col-span-5 text-white font-ibm-medium text-lg">
            Downside protection
          </div>
          <div class="col-span-7">{{ sellCriteria.downsideProtection }}%</div>
        </div>
        <div class="grid grid-cols-12 items-center pl-12">
          <div class="col-span-5 text-white font-ibm-medium text-lg">
            Period protection
          </div>
          <div class="col-span-7">
            Due date minus {{ sellCriteria.protectionPeriod }} DAYS
          </div>
        </div>
      </div>
      <div class="grid grid-cols-24 items-center py-1">
        <div class="col-span-5 text-white font-ibm-medium text-lg">
          Apply ongoing multilevel ownership
        </div>
        <div class="col-start-6 col-end-[25]">
          <span>
            {{
              sellCriteria.useRoyalty
                ? sellCriteria.royaltyOption === "FOREVER"
                  ? "Forever"
                  : "For limited transfers " +
                    sellCriteria.maxOwners +
                    " TRANSFERS"
                : "No"
            }}
          </span>
        </div>
      </div>
      <div v-if="sellCriteria.useRoyalty" class="grid grid-cols-2 py-1">
        <div class="grid grid-cols-12 items-center">
          <div class="col-span-5 text-white font-ibm-medium text-lg">
            Baseline multilevel ownership
          </div>
          <div class="col-span-7">{{ sellCriteria.royaltyPercentage }}%</div>
        </div>
        <div class="grid grid-cols-12 items-center pl-12">
          <div class="col-span-5 text-white font-ibm-medium text-lg">
            Buyout multiplier price
          </div>
          <div class="col-span-7">{{ sellCriteria.buyoutPrice }}</div>
        </div>
      </div>
      <div class="grid grid-cols-24 items-center py-1">
        <div class="col-span-5 text-white font-ibm-medium text-lg">
          Trigger liquidity protection refund by
        </div>
        <div class="col-start-6 col-end-[25]">
          <span>
            {{
              sellCriteria.triggerRefundBy === "DATE"
                ? "Date"
                : "Before Liquidity Protection ends"
            }}
          </span>
        </div>
      </div>
    </div>
    <div class="flex justify-center my-20">
      <nftmx-button
        outline
        color="secondary"
        textColor="white"
        label="LAUNCH YOUR DVC"
        class="font-press text-lg"
        h="xl2"
        w="1/2"
        @click="launchDvc"
        :loading="loading"
      />
    </div>
  </div>
</template>

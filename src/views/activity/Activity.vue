<script setup>
import BodyContainer from "@/core/container/BodyContainer.vue";
import NftmxButton from "@/core/components/basic/NftmxButton.vue";
import CheckboxCell from "@/core/components/basic/CheckboxCell.vue";
import SearchDropdown from "@/core/components/dropdown/SearchDropdown.vue";
import DropDownItem from "@/core/components/basic/DropDownItem.vue";
import Accordion from "@/core/components/accordion/BasicAccordion.vue";
import NftmxTable from "@/core/components/table/NftmxTable.vue";
import NftmxThead from "@/core/components/table/NftmxThead.vue";
import NftmxTh from "@/core/components/table/NftmxTh.vue";
import NftmxTbody from "@/core/components/table/NftmxTbody.vue";
import NftmxTd from "@/core/components/table/NftmxTd.vue";
import NftmxTr from "@/core/components/table/NftmxTr.vue";
import NftmxFooter from "@/core/container/NftmxFooter.vue";
</script>

<template>
  <body-container :searchAble="true">
    <div
      class="flex flex-wrap justify-start pt-4 pb-3 mt-px border-b border-b-black font-ibm-medium"
    >
      <checkbox-cell
        ><span class="text-xs relative -top-0.5">Art</span></checkbox-cell
      >
      <checkbox-cell
        ><span class="text-xs relative -top-0.5"
          >Domain Names</span
        ></checkbox-cell
      >
      <checkbox-cell
        ><span class="text-xs relative -top-0.5">Art</span></checkbox-cell
      >
      <checkbox-cell
        ><span class="text-xs relative -top-0.5">Art</span></checkbox-cell
      >
      <checkbox-cell
        ><span class="text-xs relative -top-0.5">Art</span></checkbox-cell
      >
    </div>
    <div class="grid lg:grid-cols-2 py-4">
      <div class="flex-1 items-stretch flex">
        <nftmx-button
          :outline="true"
          color="primary"
          label="Listings"
          :small="true"
          class="hover:bg-tertiary-600"
        />
        <div>
          <span class="text-sm text-primary-900 mx-2">Clear All</span>
        </div>
      </div>
      <div
        class="grid sm:grid-cols-2 mt-4 lg:mt-0 lg:justify-end lg:justify-self-end justify-self-start"
      >
        <div class="">
          <search-dropdown title="Event type">
            <drop-down-item> SearchDropdown Item </drop-down-item>
          </search-dropdown>
        </div>
        <div class="mt-2 sm:mt-0 sm:ml-3">
          <search-dropdown title="Event type">
            <drop-down-item>
              <checkbox-cell
                ><div class="text-xs pt-1">ETH Address</div></checkbox-cell
              >
            </drop-down-item>
            <drop-down-item>
              <checkbox-cell><div class="text-xs pt-1">ETH</div></checkbox-cell>
            </drop-down-item>
            <drop-down-item>
              <checkbox-cell><div class="text-xs pt-1">ETH</div></checkbox-cell>
            </drop-down-item>
          </search-dropdown>
        </div>
      </div>
    </div>
    <accordion :accordion="false">
      <template v-slot:caption>
        <div class="flex items-center">
          <div class="text-lg font-ibm-bold py-4 mr-24">Trading History</div>
        </div>
      </template>
      <nftmx-table height="80%">
        <nftmx-thead>
          <nftmx-tr>
            <nftmx-th>Event</nftmx-th>
            <nftmx-th>Item</nftmx-th>
            <nftmx-th>Unit Price</nftmx-th>
            <nftmx-th>Quantity</nftmx-th>
            <nftmx-th>From</nftmx-th>
            <nftmx-th :border="false">To</nftmx-th>
          </nftmx-tr>
        </nftmx-thead>
        <nftmx-tbody>
          <nftmx-tr
            v-for="index in 10"
            :key="index"
            :border="index === 10 ? false : true"
          >
            <nftmx-td>Name</nftmx-td>
            <nftmx-td class="flex"> Item </nftmx-td>
            <nftmx-td>Unit Price</nftmx-td>
            <nftmx-td>Quantity</nftmx-td>
            <nftmx-td>From</nftmx-td>
            <nftmx-td :border="false">To</nftmx-td>
          </nftmx-tr>
        </nftmx-tbody>
      </nftmx-table>
    </accordion>
  </body-container>
</template>

<style>
.px-22 {
  padding-left: 88px;
  padding-right: 88px;
}
</style>

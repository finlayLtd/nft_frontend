<script setup>
import { computed, onMounted, ref, watch, watchEffect, createApp } from "vue";
import ordersService from "@/core/services/market/orders.service";
import { roundTo, getChainKey } from "@/core/utils/common";
import { useStore } from "vuex";
import Timer from "@/core/components/timer/Timer.vue";

const props = defineProps({
  collection: Object,
});

const store = useStore();
const _collection = computed(() => props.collection);
const series = ref([
  {
    name: "Bar",
    type: "bar",
    data: [
      [1, 35],
      [2, 35],
      [3, 40],
      [4, 31],
      [5, 43],
      [6, 33],
      [7, 52],
      [8, 35],
      [9, 35],
      [10, 40],
      [11, 31],
      [12, 43],
      [13, 33],
      [14, 52],
    ],
  },
]);
const coinPrice = computed(
  () => store.state.market.coinPrice[getChainKey(props.collection.chain)] || 1
);

const markerClick = (event, chartContext, { seriesIndex, dataPointIndex }) => {
  //   const pointData =
  //     chartContext.series.w.config.series[seriesIndex].data[dataPointIndex].data;
  //   window.open(
  //     `/asset/${pointData.contract.chain}/${pointData.contract.address}/${pointData.tokenId}`,
  //     "_blank"
  //   );
};

const chartOptions = ref({
  chart: {
    id: "depth-chart",
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
    foreColor: "#949494",
  },
  stroke: {
    curve: "stepline",
    show: false,
  },
  xaxis: {
    categories: [],
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    tooltip: {
      enabled: false,
    },
  },
  colors: ["#19cb58", "#19cb58"],
  markers: {
    size: [5, 0],
    colors: "#151515",
    strokeColors: ["#949494", "#19cb58"],
    strokeWidth: 2,
    hover: {
      size: 6,
    },
  },
  grid: {
    borderColor: "#000000",
  },
  yaxis: {
    show: true,
    min: 0,
    axisBorder: {
      show: true,
      color: "#000000",
    },
    axisTicks: {
      show: true,
      color: "#000000",
    },
    tickAmount: 7,
  },
  tooltip: {
    enabled: true,
    style: {
      border: 0,
      fontSize: "12px",
    },
    custom: function ({ series, seriesIndex, dataPointIndex, w }) {
      //   const chart = w.config.series[seriesIndex];
      //   const pointData = w.config.series[seriesIndex].data[dataPointIndex].data;
      return `<div class="bg-black px-4 py-3 shadow-default shadow-primary-900 text-white font-ibm text-xs">${series[seriesIndex][dataPointIndex]} asks</div>`;
    },
  },
});

onMounted(() => {
  //   if (props.collection) {
  //     ordersService
  //       .getSaleOrders({
  //         contractAddress: [props.collection.address],
  //         fromTimestamp: new Date(
  //           new Date().getFullYear() - 1,
  //           new Date().getMonth(),
  //           new Date().getDate(),
  //           new Date().getHours(),
  //           new Date().getMinutes()
  //         ).getTime(),
  //       })
  //       .then((res) => {
  //         const data = [];
  //         for (let i = 0; i < res.data.length; i++) {
  //           const element = res.data[i];
  //           data.push({
  //             x: new Date(element.currentOrder.createdAt).getTime(),
  //             y: element.currentOrder.tokenPrice,
  //             data: element,
  //           });
  //         }
  //         series.value.push({ name: "NFT price", type: "scatter", data });
  //       });
  //   }
});
watch(_collection, (val) => {
  console.log("collection-watch===", val);
});
</script>

<template>
  <div class="text-black">
    <apexchart
      height="450"
      :options="chartOptions"
      :series="series"
      @dataPointSelection="markerClick"
    >
    </apexchart>
  </div>
</template>

<style scoped>
/deep/.apexcharts-tooltip {
  overflow: visible;
}
/deep/.apexcharts-tooltip.apexcharts-theme-light {
  border: 0;
  border-radius: 0;
}
</style>
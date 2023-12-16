<script setup>
import { computed, ref, watch, watchEffect } from "vue";
const defaultChartOption = {
  chart: {
    id: "sale-history-chart",
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
    foreColor: "#949494",
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
    type: "datetime",
  },
  colors: ["#19cb58", "#fff"],
  markers: {
    size: 5,
    colors: "#151515",
    strokeColors: ["#19cb58", "#fff"],
    strokeWidth: 3,
    hover: {
      size: 6,
    },
  },
  grid: {
    borderColor: "#000000",
  },
  yaxis: {
    show: true,
    axisBorder: {
      show: true,
      color: "#000000",
    },
    axisTicks: {
      show: true,
      color: "#000000",
    },
  },
};

const props = defineProps({
  series: Array,
});

const chartOptions = ref(defaultChartOption);
// const series = ref([
//   // {
//   //   name: "Series 1",
//   //   data: [
//   //     [1486684800000, 34],
//   //     [1486771200000, 43],
//   //     [1486857600000, 31],
//   //     [1486944000000, 43],
//   //     [1487030400000, 33],
//   //     [1487116800000, 52],
//   //   ],
//   // },
//   // {
//   //   name: "Series 2",
//   //   data: [
//   //     [1486684800000, 35],
//   //     [1486771200000, 40],
//   //     [1486857600000, 31],
//   //     [1486944000000, 43],
//   //     [1487030400000, 33],
//   //     [1487116800000, 52],
//   //   ],
//   // },
// ]);

// watchEffect(() => {
//   if (props.data) {
//     let categories = [];
//     let seriesData = [];
//     for (let i = 0; i < props.data.length; i++) {
//       const element = props.data[i];
//       const date = new Date(element.name);
//       const name =
//         date.getMonth() + 1 + "/" + date.getFullYear().toFixed().slice(2, 4);
//       categories.push(name);
//       seriesData.push(element.value);
//     }
//     series.value[0].data = seriesData;
//     let chartOptionData = JSON.parse(JSON.stringify(defaultChartOption));
//     chartOptionData.xaxis.categories = categories;
//     chartOptions.value = chartOptionData;
//   }
// });
</script>

<template>
  <div class="text-black">
    <apexchart
      height="290"
      type="line"
      :options="chartOptions"
      :series="series"
    ></apexchart>
  </div>
</template>

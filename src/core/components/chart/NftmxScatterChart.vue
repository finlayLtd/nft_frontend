<script setup>
import { computed, onMounted, ref, watch, watchEffect, createApp } from "vue";
import ordersService from "@/core/services/market/orders.service";
import historyService from "@/core/services/market/history.service";
import { roundTo, getChainKey } from "@/core/utils/common";
import { useStore } from "vuex";
import Timer from "@/core/components/timer/Timer.vue";
import ApexCharts from "@/core/utils/apex-charts/apexcharts.js";

const props = defineProps({
  collection: Object,
  type: String,
});

const store = useStore();
const _collection = computed(() => props.collection);
const series = ref([]);
const coinPrice = computed(
  () => store.state.market.coinPrice[getChainKey(props.collection.chain)] || 1
);
const period = ref("1D");

const markerClick = (event, chartContext, { seriesIndex, dataPointIndex }) => {
  const pointData =
    chartContext.series.w.config.series[seriesIndex].data[dataPointIndex].data;
  const chart = chartContext.series.w.config.series[seriesIndex];
  if (chart.type === "scatter" && pointData)
    window.open(
      `/asset/${pointData.contract.chain}/${pointData.contract.address}/${pointData.tokenId}`,
      "_blank"
    );
};
const chart = ref();
const chartContainer = ref();

const chartOptions = ref({
  chart: {
    id: "sale-history-chart",
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
    foreColor: "#949494",
    height: "450px",
  },
  legend: {
    show: false,
  },
  stroke: {
    curve: "stepline",
    show: false,
  },
  plotOptions: {
    bar: {
      columnWidth: "100%",
    },
  },
  xaxis: {
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
    labels: {
      formatter: function (value) {
        return value ? value.toFixed(2) : 0; // Format values to two decimals
      },
    },
  },
  tooltip: {
    enabled: true,
    style: {
      border: 0,
      fontSize: "12px",
    },
    custom: function ({ series, seriesIndex, dataPointIndex, w }) {
      const chart = w.config.series[seriesIndex];
      const pointData = w.config.series[seriesIndex].data[dataPointIndex]?.data;
      const closingTime = pointData?.currentOrder
        ? parseInt(
            pointData.currentOrder.endSaleTime -
              new Date().getTime() / 1000 >
              0
              ? pointData.currentOrder.endSaleTime -
                  new Date().getTime() / 1000
              : 0
          )
        : 0;
      const timerComponent = closingTime
        ? createApp({
            components: { Timer },
            template: `<timer :time="${closingTime}" />`,
          }).mount(document.createElement("div")).$el.outerHTML
        : "";
      if (chart.type === "scatter" && pointData) {
        return `<div class="transition shadow-default shadow-primary-900 w-64 border-0">
          <div class="relative w-full overflow-hidden pt-73per bg-black">
            <div
              class="w-full h-full absolute top-0 left-0"
            >
              <div class="w-full h-full absolute top-0 left-0">
                <img
                  src="${pointData.imageUrl}"
                  class="w-full h-full object-cover text-6xl"
                />
              </div>
            </div>
            <div
              class="w-50 h-12.5 -ml-14 mt-4 absolute top-0 left-0 -rotate-45 bg-primary-900 text-white whitespace-no-wrap px-4 font-ibm-semi-bold bg-opacity-80 flex flex-col items-center justify-center"
            >
              <div class="text-sm">100%</div>
              <div class="text-10">Liquidity Protection</div>
            </div>
          </div>
          <div class="relative px-4.5 pt-5.5 pb-4 bg-tertiary-700">
            <div class="flex text-white overflow-hidden">
              <div class="flex-1 text-base font-ibm-bold leading-6 pr-2 h-14.5">
                <div
                  class="cursor-pointer"
                >
                  <div class="truncated" style="-webkit-line-clamp: 2">
                    ${pointData.name || "#" + pointData.tokenId}
                  </div>
                </div>
              </div>
              <div class="text-xs flex mt-1.5">
                <span class="pr-1 text-tertiary-400">55</span>
                <svg class="svg-inline--fa fa-thumbs-up fa-w-16 text-primary-900 cursor-pointer hover:text-primary-900 transition"
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="thumbs-up"
                  viewBox="0 0 512 512"
                >
                  <path fill="currentColor" d="M104 224H24c-13.255 0-24 10.745-24 24v240c0 13.255 10.745 24 24 24h80c13.255 0 24-10.745 24-24V248c0-13.255-10.745-24-24-24zM64 472c-13.255 0-24-10.745-24-24s10.745-24 24-24 24 10.745 24 24-10.745 24-24 24zM384 81.452c0 42.416-25.97 66.208-33.277 94.548h101.723c33.397 0 59.397 27.746 59.553 58.098.084 17.938-7.546 37.249-19.439 49.197l-.11.11c9.836 23.337 8.237 56.037-9.308 79.469 8.681 25.895-.069 57.704-16.382 74.757 4.298 17.598 2.244 32.575-6.148 44.632C440.202 511.587 389.616 512 346.839 512l-2.845-.001c-48.287-.017-87.806-17.598-119.56-31.725-15.957-7.099-36.821-15.887-52.651-16.178-6.54-.12-11.783-5.457-11.783-11.998v-213.77c0-3.2 1.282-6.271 3.558-8.521 39.614-39.144 56.648-80.587 89.117-113.111 14.804-14.832 20.188-37.236 25.393-58.902C282.515 39.293 291.817 0 312 0c24 0 72 8 72 81.452z"></path>
                </svg>
              </div>
            </div>
            <div class="text-11 leading-4.5 text-white font-ibm">
              <div class="flex justify-between items-end">
                <div class="flex">
                  <span class="font-ibm-medium">ROI</span>
                  <sup>
                    <svg class="svg-inline--fa fa-question-circle fa-w-16 ml-1 text-10 cursor-pointer"
                      aria-hidden="true" focusable="false" data-prefix="fas"
                      data-icon="question-circle"
                      viewBox="0 0 512 512"
                    >
                      <path fill="currentColor" d="M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zM262.655 90c-54.497 0-89.255 22.957-116.549 63.758-3.536 5.286-2.353 12.415 2.715 16.258l34.699 26.31c5.205 3.947 12.621 3.008 16.665-2.122 17.864-22.658 30.113-35.797 57.303-35.797 20.429 0 45.698 13.148 45.698 32.958 0 14.976-12.363 22.667-32.534 33.976C247.128 238.528 216 254.941 216 296v4c0 6.627 5.373 12 12 12h56c6.627 0 12-5.373 12-12v-1.333c0-28.462 83.186-29.647 83.186-106.667 0-58.002-60.165-102-116.531-102zM256 338c-25.365 0-46 20.635-46 46 0 25.364 20.635 46 46 46s46-20.636 46-46c0-25.365-20.635-46-46-46z"></path>
                    </svg>
                  </sup>
                </div>
                <div class="flex items-center">
                  <span class="text-primary-900">
                    +${roundTo(
                      (pointData.athPrice / (pointData.baselinePrice || 1)) *
                        100
                    )}%
                  </span>
                  <span class="ml-1 text-tertiary-400">
                    [${roundTo(
                      pointData.athPrice / (pointData.baselinePrice || 1)
                    )}x]
                  </span>
                </div>
              </div>
              <div class="flex justify-between items-end">
                <div class="flex">
                  <span class="font-ibm-medium">Floor Price</span>
                  <sup>
                    <svg class="svg-inline--fa fa-question-circle fa-w-16 ml-1 text-10 cursor-pointer"
                      aria-hidden="true" focusable="false" data-prefix="fas"
                      data-icon="question-circle"
                      viewBox="0 0 512 512"
                    >
                      <path fill="currentColor" d="M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zM262.655 90c-54.497 0-89.255 22.957-116.549 63.758-3.536 5.286-2.353 12.415 2.715 16.258l34.699 26.31c5.205 3.947 12.621 3.008 16.665-2.122 17.864-22.658 30.113-35.797 57.303-35.797 20.429 0 45.698 13.148 45.698 32.958 0 14.976-12.363 22.667-32.534 33.976C247.128 238.528 216 254.941 216 296v4c0 6.627 5.373 12 12 12h56c6.627 0 12-5.373 12-12v-1.333c0-28.462 83.186-29.647 83.186-106.667 0-58.002-60.165-102-116.531-102zM256 338c-25.365 0-46 20.635-46 46 0 25.364 20.635 46 46 46s46-20.636 46-46c0-25.365-20.635-46-46-46z"></path>
                    </svg>
                  </sup>
                </div>
                <div class="flex items-center">
                  <span class="text-primary-900">
                    <font-awesome-icon :icon="['fab', 'ethereum']" />
                    ${pointData.floorPrice ? pointData.floorPrice : 0}
                  </span>
                  <span class="ml-1 text-tertiary-400">
                    <span>[$</span>
                    <span>
                      ${
                        pointData.floorPrice
                          ? roundTo(pointData.floorPrice * coinPrice.value)
                          : 0
                      }
                    </span>
                    <span>]</span>
                  </span>
                </div>
              </div>
            </div>
            <div class="flex gap-2 items-center mt-4 mb-2.5">
              <div
                class="border-t border-t-black border-b border-b-tertiary-600 w-full h-0"
              ></div>
              <div
                class="text-black font-ibm-bold text-11 whitespace-nowrap text-shadow-h1"
              >
                Multilevel Ownership
              </div>
              <div
                class="border-t border-t-black border-b border-b-tertiary-600 w-full h-0"
              ></div>
            </div>
            <div class="text-11 leading-4.5 text-white font-ibm">
              <div class="flex justify-between">
                <span class="font-ibm-medium">
                  Owners
                  <sup>
                    <svg class="svg-inline--fa fa-question-circle fa-w-16 ml-1 text-10 cursor-pointer"
                      aria-hidden="true" focusable="false" data-prefix="fas"
                      data-icon="question-circle"
                      viewBox="0 0 512 512"
                    >
                      <path fill="currentColor" d="M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zM262.655 90c-54.497 0-89.255 22.957-116.549 63.758-3.536 5.286-2.353 12.415 2.715 16.258l34.699 26.31c5.205 3.947 12.621 3.008 16.665-2.122 17.864-22.658 30.113-35.797 57.303-35.797 20.429 0 45.698 13.148 45.698 32.958 0 14.976-12.363 22.667-32.534 33.976C247.128 238.528 216 254.941 216 296v4c0 6.627 5.373 12 12 12h56c6.627 0 12-5.373 12-12v-1.333c0-28.462 83.186-29.647 83.186-106.667 0-58.002-60.165-102-116.531-102zM256 338c-25.365 0-46 20.635-46 46 0 25.364 20.635 46 46 46s46-20.636 46-46c0-25.365-20.635-46-46-46z"></path>
                    </svg>
                  </sup>
                </span>
                <span class="text-primary-900">
                  ${
                    pointData.mlrContract && pointData.mlrContract.owners
                      ? pointData.mlrContract.owners.length
                      : 0
                  }
                </span>
              </div>
              <div class="flex justify-between">
                <span class="font-ibm-medium">
                  Total Ownership
                  <sup>
                    <svg class="svg-inline--fa fa-question-circle fa-w-16 ml-1 text-10 cursor-pointer"
                      aria-hidden="true" focusable="false" data-prefix="fas"
                      data-icon="question-circle"
                      viewBox="0 0 512 512"
                    >
                      <path fill="currentColor" d="M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zM262.655 90c-54.497 0-89.255 22.957-116.549 63.758-3.536 5.286-2.353 12.415 2.715 16.258l34.699 26.31c5.205 3.947 12.621 3.008 16.665-2.122 17.864-22.658 30.113-35.797 57.303-35.797 20.429 0 45.698 13.148 45.698 32.958 0 14.976-12.363 22.667-32.534 33.976C247.128 238.528 216 254.941 216 296v4c0 6.627 5.373 12 12 12h56c6.627 0 12-5.373 12-12v-1.333c0-28.462 83.186-29.647 83.186-106.667 0-58.002-60.165-102-116.531-102zM256 338c-25.365 0-46 20.635-46 46 0 25.364 20.635 46 46 46s46-20.636 46-46c0-25.365-20.635-46-46-46z"></path>
                    </svg>
                  </sup>
                </span>
                <div class="flex items-center">
                  <span class="text-primary-900">
                    ${
                      pointData.mlrContract && pointData.mlrContract.owners
                        ? pointData.mlrContract.owners.reduce(
                            (ac, owner) => ac + owner.realRoyalty,
                            0
                          )
                        : 0
                    }%
                  </span>
                </div>
              </div>
            </div>
            <div class="flex gap-2 items-center mt-4.75 mb-2">
              <div
                class="border-t border-t-black border-b border-b-tertiary-600 w-full h-0"
              ></div>
              <div
                class="text-black font-ibm-bold text-11 whitespace-nowrap text-shadow-h1"
              >
                Liquidity Protection
              </div>
              <div
                class="border-t border-t-black border-b border-b-tertiary-600 w-full h-0"
              ></div>
            </div>
            <div class="text-11 leading-4.5 text-white font-ibm">
              <div class="flex justify-between">
                <span class="font-ibm-medium">
                  Period
                  <sup>
                    <svg class="svg-inline--fa fa-question-circle fa-w-16 ml-1 text-10 cursor-pointer"
                      aria-hidden="true" focusable="false" data-prefix="fas"
                      data-icon="question-circle"
                      viewBox="0 0 512 512"
                    >
                      <path fill="currentColor" d="M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zM262.655 90c-54.497 0-89.255 22.957-116.549 63.758-3.536 5.286-2.353 12.415 2.715 16.258l34.699 26.31c5.205 3.947 12.621 3.008 16.665-2.122 17.864-22.658 30.113-35.797 57.303-35.797 20.429 0 45.698 13.148 45.698 32.958 0 14.976-12.363 22.667-32.534 33.976C247.128 238.528 216 254.941 216 296v4c0 6.627 5.373 12 12 12h56c6.627 0 12-5.373 12-12v-1.333c0-28.462 83.186-29.647 83.186-106.667 0-58.002-60.165-102-116.531-102zM256 338c-25.365 0-46 20.635-46 46 0 25.364 20.635 46 46 46s46-20.636 46-46c0-25.365-20.635-46-46-46z"></path>
                    </svg>
                  </sup>
                </span>
                <span class="text-primary-900">
                  ${
                    pointData.currentOrder
                      ? Math.round(
                          pointData.currentOrder.protectionTime / 86400
                        )
                      : 0
                  }
                  Days
                </span>
              </div>
              <div class="flex justify-between">
                <span class="font-ibm-medium">
                  Fees
                  <sup>
                    <svg class="svg-inline--fa fa-question-circle fa-w-16 ml-1 text-10 cursor-pointer"
                      aria-hidden="true" focusable="false" data-prefix="fas"
                      data-icon="question-circle"
                      viewBox="0 0 512 512"
                    >
                      <path fill="currentColor" d="M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zM262.655 90c-54.497 0-89.255 22.957-116.549 63.758-3.536 5.286-2.353 12.415 2.715 16.258l34.699 26.31c5.205 3.947 12.621 3.008 16.665-2.122 17.864-22.658 30.113-35.797 57.303-35.797 20.429 0 45.698 13.148 45.698 32.958 0 14.976-12.363 22.667-32.534 33.976C247.128 238.528 216 254.941 216 296v4c0 6.627 5.373 12 12 12h56c6.627 0 12-5.373 12-12v-1.333c0-28.462 83.186-29.647 83.186-106.667 0-58.002-60.165-102-116.531-102zM256 338c-25.365 0-46 20.635-46 46 0 25.364 20.635 46 46 46s46-20.636 46-46c0-25.365-20.635-46-46-46z"></path>
                    </svg>
                  </sup>
                </span>
                <div class="flex items-center">
                  <span class="text-primary-900">
                    Slippage
                    ${
                      pointData.currentOrder
                        ? 100 - pointData.currentOrder.protectionRate
                        : 0
                    }%
                  </span>
                  <div class="h-2.5 mx-1.5 border-l border-tertiary-400" ></div>
                  <span class="${
                    pointData.staking ? "text-primary-900" : "text-tertiary-400"
                  }">
                    Staking
                  </span>
                </div>
              </div>
            </div>
            <div class="h-14 text-tertiary-400 text-11 text-center relative mt-6">
              ${
                pointData.currentOrder &&
                pointData.currentOrder.orderType === "0"
                  ? `<div>
                      <span> Asking price </span>
                      <div class="flex items-end pt-1.75 w-fit mx-auto max-w-full">
                        <div
                          class="flex items-center gap-2 text-lg text-primary-900 font-ibm-medium"
                        >
                        ${
                          pointData.contract.chain === "ETHEREUM"
                            ? `<svg class="svg-inline--fa fa-ethereum fa-w-10" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="ethereum" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path class="" fill="currentColor" d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>`
                            : `
                              <div
                                class="w-4 h-4 fill-primary-900"
                              >
                                <svg
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                                  />
                                </svg>
                              </div>
                            `
                        }

                          ${roundTo(pointData.currentOrder.tokenPrice)}
                        </div>
                        <span class="ml-2">[$</span>
                        <span>
                          ${roundTo(
                            pointData.currentOrder.tokenPrice * coinPrice.value
                          )}
                        </span>
                        <span>]</span>
                      </div>
                    </div>`
                  : `<div>
                    <span> Current auction ends in </span>
                    <div class="pt-2.5 w-fit mx-auto max-w-full">
                      ${timerComponent}
                    </div>
                  </div>`
              }
            </div>
          </div>
        </div>`;
      } else if (chart.type === "bar") {
        return `<div class="bg-black px-4 py-3 shadow-default shadow-primary-900 text-white font-ibm text-xs">
          <div>Total volume</div>
          <div class="text-sm mt-1">
            ${
              props.collection.chain === "ETHEREUM"
                ? `<svg class="svg-inline--fa fa-ethereum fa-w-10" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="ethereum" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path class="" fill="currentColor" d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>`
                : `
                  <div
                    class="w-4 h-4 fill-primary-900"
                  >
                    <svg
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"
                      />
                    </svg>
                  </div>
                `
            }
            ${roundTo(pointData.volume)}
          </div>
          <div class="text-tertiary-400 text-11">
            [$${roundTo(pointData.volume * coinPrice.value)}]
          </div>
        </div>`;
      } else if (chart.type === "line" && series[seriesIndex].step) {
        return `<div>Step Line Series Tooltip Content</div>`;
      } else {
        return ``;
      }
    },
  },
});

const getVolumeHistory = () => {
  return new Promise((resolve, reject) => {
    historyService
      .getCollectionVolumeHistory({
        address: props.collection.address,
        period: period.value,
      })
      .then((res) => {
        const data = [];
        for (let i = 0; i < res.data.length; i++) {
          const element = res.data[i];
          data.push({
            x: new Date(element.time).getTime(),
            y: element.volume,
            data: element,
          });
        }
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
const getSales = () => {
  return new Promise((resolve, reject) => {
    ordersService
      .getSaleOrders({
        contractAddress: [props.collection.address],
        period: period.value,
        type: props.type || "",
      })
      .then((res) => {
        const data = [];
        for (let i = 0; i < res.data.length; i++) {
          const element = res.data[i];
          data.push({
            x: new Date(element.currentOrder.createdAt).getTime(),
            y: element.currentOrder.softCap,
            data: element,
          });
        }
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
const setSeries = () => {
  if (props.collection) {
    Promise.all([getVolumeHistory(), getSales()]).then(
      ([volumeData, salesData]) => {
        if (volumeData?.length > 0 && salesData?.length > 0) {
          const maxVolume = volumeData.reduce((prev, current) => {
            return current.y > prev.y ? current : prev;
          });
          const maxSale = salesData.reduce((prev, current) => {
            return current.y > prev.y ? current : prev;
          });
          const rate = maxSale.y / maxVolume.y / 5;
          for (let i = 0; i < volumeData.length; i++) {
            volumeData[i].y *= rate;
          }
        }
        series.value = [
          { name: "NFT price", type: "scatter", data: salesData },
          { name: "Volume", type: "bar", data: volumeData },
        ];
        chart.value.updateSeries(series.value);
      }
    );
  }
};

onMounted(() => {
  setSeries();
  chart.value = new ApexCharts(chartContainer.value, {
    ...chartOptions.value,
    series: series.value,
  });
  chart.value.render();
});
watch(_collection, (val) => {
  console.log("collection-watch===", val);
});
watch(period, (val) => {
  setSeries();
});
</script>

<template>
  <div>
    <div class="border border-black bg-tertiary-800">
      <!-- <apexchart
        height="450"
        :options="chartOptions"
        :series="series"
        @dataPointSelection="markerClick"
      >
      </apexchart> -->
      <div ref="chartContainer" />
    </div>
    <div
      class="flex items-center gap-4 text-white font-ibm-medium text-sm mt-4"
    >
      <span
        :class="[
          period === '1D' ? 'text-primary-900' : 'hover:text-primary-900',
          'cursor-pointer',
        ]"
        @click="period = '1D'"
      >
        24H
      </span>
      <div class="border-l border-l-black border-r border-r-tertiary-700 h-5" />
      <span
        :class="[
          period === '1W' ? 'text-primary-900' : 'hover:text-primary-900',
          'cursor-pointer',
        ]"
        @click="period = '1W'"
      >
        7D
      </span>
      <div class="border-l border-l-black border-r border-r-tertiary-700 h-5" />
      <span
        :class="[
          period === '1M' ? 'text-primary-900' : 'hover:text-primary-900',
          'cursor-pointer',
        ]"
        @click="period = '1M'"
      >
        30D
      </span>
      <div class="border-l border-l-black border-r border-r-tertiary-700 h-5" />
      <span
        :class="[
          period === '3M' ? 'text-primary-900' : 'hover:text-primary-900',
          'cursor-pointer',
        ]"
        @click="period = '3M'"
      >
        90D
      </span>
      <div class="border-l border-l-black border-r border-r-tertiary-700 h-5" />
      <span
        :class="[
          period === '1Y' ? 'text-primary-900' : 'hover:text-primary-900',
          'cursor-pointer',
        ]"
        @click="period = '1Y'"
      >
        365D
      </span>
    </div>
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
.truncated {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-wrap: "break-word";
  word-break: break-all;
}
</style>
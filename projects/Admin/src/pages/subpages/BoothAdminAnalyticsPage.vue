<template>
  <VContainer class="mt-4 px-0 px-sm-2 py-2 pa-md-6 d-flex flex-column">
    <div v-if="Object.keys(orderHistory).length > 0">
      <VSlideGroup v-model="currentSelectedDay" class="justify-center px-2 mb-4" show-arrows center-active mandatory>
        <VSlideGroupItem value="all" v-slot="{ isSelected, toggle }">
          <VChip class="h-auto mx-1" rounded="lg" :color="isSelected ? 'primary' : ''" @click="toggle">
            <div class="d-flex flex-column align-center justify-center pa-1">
              <div class="text-h5 font-weight-bold">전체 표시</div>
              <div class="text-caption"></div>
            </div>
          </VChip>
        </VSlideGroupItem>

        <VSlideGroupItem v-for="day in orderHistoryDays.asArray()"
                         :key="day"
                         :value="day"
                         v-slot="{ isSelected, toggle }">
          <VChip class="h-auto mx-1"
                 rounded="lg"
                 :color="isSelected ? 'primary' : ''"
                 @click="toggle">
            <div class="d-flex flex-column align-center justify-center pa-1">
              <div class="text-h5 font-weight-bold">{{ day.day }}일</div>
              <div class="text-caption">{{ day.year }}년 {{ day.month }}월</div>
            </div>
          </VChip>
        </VSlideGroupItem>
      </VSlideGroup>

      <Chart class="bg-background" type="line" :options="CHART_ANALYTICS_OPTIONS" :data="chartOrderHistoryDataOfSelectedDay" />
    </div>
    <div v-else>
      <h2 class="text-center">등록된 판매 기록이 없습니다.</h2>
    </div>
  </VContainer>
</template>

<script lang="ts">
import type { ChartOptions, ChartData, Point } from "chart.js";
import { currencySymbolInfo, type IGoodsOrder } from "@myboothmanager/common";
import ChartJS from "chart.js/auto";
import "chartjs-adapter-moment";
import { Component, Vue } from "vue-facing-decorator";
import { Chart } from "vue-chartjs";
import colors from "vuetify/util/colors";
import { useAdminStore } from "@/stores/admin";
import { Dateonly, OrderedDateonlySet } from "@/lib/classes";

ChartJS.register();

@Component({
  components: {
    Chart,
  },
})
export default class BoothAdminAnalyticsPage extends Vue {
  readonly CHART_ANALYTICS_OPTIONS: ChartOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        mode: "index",
        intersect: false,
      },
      title: {
        display: true,
        text: "분 단위 굿즈 판매 기록",
      },
      legend: {
        onClick(e, legendItem) {
          const index = legendItem.datasetIndex!;
          this.chart.data.datasets[index].hidden = !this.chart.data.datasets[index].hidden;
          this.chart.scales[this.chart.data.datasets[index].stack!].options.display = !this.chart.data.datasets[index].hidden;
          this.chart.update();
        },
      },
    },
    hover: {
      mode: "index",
      intersect: false,
    },
    scales: {
      x: {
        type: "timeseries",
        time: {
          unit: "minute",
          round: "minute",
          tooltipFormat: "YYYY년 MM월 DD일 / HH시 mm분",
          displayFormats: {
            hour: "DD일 HH시",
            minute: "DD일 HH:mm",
          },
        },
        ticks: {
          autoSkip: false,
          maxRotation: 0,
          major: { enabled: true },
          font: {
            weight(context) {
              if(context.tick.major) return "bold";
            },
          },
        },
      },
      quantity: {
        type: "linear",
        display: true,
        position: "left",
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: "판매 굿즈 수량",
        },
        min: 0,
        ticks: {
          autoSkip: true,
          autoSkipPadding: 10,
        },
      },
      price: {
        type: "linear",
        display: true,
        position: "right",
        title: {
          display: true,
          text: "판매 금액",
        },
        min: 0,
        ticks: {
          autoSkip: true,
          autoSkipPadding: 10,
          callback: (value) => `${this.currencySymbol}${value.toLocaleString()}`,
          stepSize: (this.currencySymbol === currencySymbolInfo["KRW"].symbol) ? 10000 : 10,
        },
      },
    },
  };

  dataLoading: boolean = true;
  currentSelectedDay: Dateonly | "all" = "all";

  async mounted() {
    await useAdminStore().fetchGoodsOrdersOfCurrentBooth();

    this.dataLoading = false;
  }

  get currencySymbol(): string {
    return useAdminStore().boothList[useAdminStore().currentBoothId]?.currencySymbol ?? "";
  }

  get orderHistory(): Record<number, IGoodsOrder> {
    return useAdminStore().boothGoodsOrderList;
  }

  get orderHistoryDays(): OrderedDateonlySet {
    const set = new OrderedDateonlySet(true);

    Object.values(this.orderHistory).forEach((item) => {
      if(item.createdAt) set.add(Dateonly.fromDate(item.createdAt));
    });

    return set;
  }

  get orderHistoryByDay(): Record<number, Array<IGoodsOrder>> {
    const merged: Record<number, Array<IGoodsOrder>> = { };

    Object.values(this.orderHistory).forEach((item) => {
      if(!item.createdAt) return;

      const targetDate = new Date(item.createdAt);
      targetDate.setHours(0);
      targetDate.setMinutes(0);
      targetDate.setSeconds(0);
      const targetTimestamp = targetDate.getTime();

      if(!merged[targetTimestamp]) merged[targetTimestamp] = [];

      merged[targetTimestamp].push(item);
    });

    return merged;
  }

  get orderHistoryOfCurrentSelectedDay(): Array<IGoodsOrder> {
    if(this.currentSelectedDay === "all") return Object.values(this.orderHistory);
    else return this.orderHistoryByDay[this.currentSelectedDay.getTimestamp()] ?? [];
  }

  get orderHistoryInfoMergedByMinute(): Record<number, { quantity: number, price: number }> {
    const merged: Record<any, { quantity: number, price: number }> = {};

    Object.values(this.orderHistory).forEach((item) => {
      if(!item.createdAt) return;

      const targetDate = new Date(item.createdAt);
      targetDate.setSeconds(0);
      const targetTimestamp = targetDate.getTime();

      if(!merged[targetTimestamp]) merged[targetTimestamp] = { quantity: 0, price: 0 };

      merged[targetTimestamp].quantity += item.order.reduce((acc, cur) => acc + cur.quantity, 0);
      merged[targetTimestamp].price += item.totalPrice;
    });

    return merged;
  }

  get chartOrderHistoryDataOfSelectedDay(): ChartData {
    return {
      datasets: [{
        label: "판매 굿즈 수량",
        type: "bar",
        data: Object.entries(this.orderHistoryInfoMergedByMinute).map((item) => {
          const date = new Date(parseInt(item[0]));
          if(this.currentSelectedDay !== "all" && !Dateonly.fromDate(date).equals(this.currentSelectedDay)) return;

          return {
            x: parseInt(item[0]),
            y: item[1].quantity,
          } as Point;
        }).filter((item) => typeof item !== "undefined") as Array<Point>,
        borderColor: colors.amber.lighten1,
        backgroundColor: colors.amber.lighten1,
        order: 1,
        stack: "quantity",
        yAxisID: "quantity",
      }, {
        label: "판매 금액",
        type: "line",
        data: Object.entries(this.orderHistoryInfoMergedByMinute).map((item) => {
          const date = new Date(parseInt(item[0]));
          if(this.currentSelectedDay !== "all" && !Dateonly.fromDate(date).equals(this.currentSelectedDay)) return;

          return {
            x: parseInt(item[0]),
            y: item[1].price,
          } as Point;
        }).filter((item) => typeof item !== "undefined") as Array<Point>,
        borderWidth: 1.5,
        borderColor: colors.indigo.darken1,
        backgroundColor: colors.indigo.darken1,
        order: 0,
        stack: "price",
        yAxisID: "price",
      }],
    };
  }
}
</script>

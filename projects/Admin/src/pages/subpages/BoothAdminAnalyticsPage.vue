<template>
  <VContainer class="mt-4 pa-2 pa-md-6 d-flex flex-column">
    <!-- <span v-for="(info, idx) in orderHistoryInfoMergedByMinute" :key="idx">
      {{ idx }}:
      {{ info.price }} / {{ info.sellStock }}
    </span> -->

    <VChipGroup v-model="currentSelectedDay" column class="justify-center">
      <VChip class="h-auto" rounded="lg" value="all">
        <div class="d-flex flex-column align-center justify-center pa-1">
          <div class="text-h5 font-weight-bold">전체 보기</div>
          <div class="text-caption">블라블라</div>
        </div>
      </VChip>
      <VChip v-for="day in orderHistoryDays.asArray()"
             :key="day"
             :value="day"
             class="h-auto"
             rounded="lg">
        <div class="d-flex flex-column align-center justify-center pa-1">
          <div class="text-h5 font-weight-bold">{{ day.day }}일</div>
          <div class="text-caption">{{ day.year }}년 {{ day.month }}월</div>
        </div>
      </VChip>
    </VChipGroup>

    <!-- <span v-for="item in orderHistoryOfCurrentSelectedDay" :key="item.id">
      {{ item.id }}:
      {{ item.totalPrice }} / {{ item.order.reduce((acc, cur) => acc + cur.quantity, 0) }}
    </span> -->

    <Line class="bg-background" :options="CHART_SELL_OPTIONS" :data="chartOrderHistoryDataOfSelectedDay" />
  </VContainer>
</template>

<script lang="ts">
import type { IGoodsOrder } from "@myboothmanager/common";
import { type ChartOptions, type ChartData, Chart, Title, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from "chart.js";
import { Component, Vue } from "vue-facing-decorator";
import { Line } from "vue-chartjs";
import { useAdminStore } from "@/stores/admin";
import { Dateonly, OrderedDateonlySet } from "@/lib/classes";

Chart.register(Title, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

@Component({
  components: {
    Line,
  },
})
export default class BoothAdminAnalyticsPage extends Vue {
  readonly CHART_SELL_OPTIONS: ChartOptions = {
    responsive: true,
    scales: {
      quantity: {
        type: "linear",
        display: true,
        position: "left",
        title: {
          display: true,
          text: "판매 굿즈 수량",
        },
      },
      price: {
        type: "linear",
        display: true,
        position: "right",
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: "판매 금액",
        },
      },
    },
  };

  dataLoading: boolean = true;
  currentSelectedDay: Dateonly | "all" = Dateonly.fromDate(new Date());

  async mounted() {
    await useAdminStore().fetchGoodsOrdersOfCurrentBooth();

    this.dataLoading = false;

    this.currentSelectedDay = this.orderHistoryDays.asArray()[0];
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
      labels: Object.keys(this.orderHistoryInfoMergedByMinute).map((item) => {
        const date = new Date(parseInt(item));
        if(this.currentSelectedDay !== "all" && !Dateonly.fromDate(date).equals(this.currentSelectedDay)) return;

        const format = "HH:mm";
        return format.replace("HH", date.getHours().toString().padStart(2, "0")).replace("mm", date.getMinutes().toString().padStart(2, "0"));
      }).filter((item) => item) as Array<string>,
      datasets: [{
        label: "판매 굿즈 수량",
        data: Object.entries(this.orderHistoryInfoMergedByMinute).map((item) => {
          const date = new Date(parseInt(item[0]));
          if(this.currentSelectedDay !== "all" && !Dateonly.fromDate(date).equals(this.currentSelectedDay)) return;
          else return item[1].quantity;
        }).filter((item) => typeof item !== "undefined") as Array<number>,
        borderColor: "#7986CB",
        backgroundColor :"#3F51B5",
        yAxisID: "quantity",
      }, {
        label: "판매 금액",
        data: Object.entries(this.orderHistoryInfoMergedByMinute).map((item) => {
          const date = new Date(parseInt(item[0]));
          if(this.currentSelectedDay !== "all" && !Dateonly.fromDate(date).equals(this.currentSelectedDay)) return;
          else return item[1].price;
        }).filter((item) => typeof item !== "undefined") as Array<number>,
        borderColor: "#FFB74D",
        backgroundColor :"#FF9800",
        yAxisID: "price",
      }],
    };
  }
}
</script>

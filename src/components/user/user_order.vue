<script setup lang="ts">
import { getorder } from "@/api/order";
import { ref } from "vue";

const panel = ref([]);
interface data {
  id: number;
  user_id: number;
  total_price: number;
  status: string;
  created_at: string;
  ship_way: string;
  ship_info: string;
  ship_cost: number;
  discount: number;
  items: {
    order_id: number;
    special_code: string;
    quantity: number;
    price: number;
    capacity: number;
    name: string;
    image_url: string;
    special_code0: string;
  }[];
}
const changedata = (data: data[]) => {
  const shipWayMap: Record<string, string> = {
    store: "門市取貨",
    home: "宅配到家",
    third_way: "超商取貨",
  };

  const statusMap: Record<string, string> = {
    pending: "處理中",
    paid: "已付款",
    shipped: "已出貨",
    completed: "已完成",
    canceled: "已取消",
  };

  return data.map((order) => ({
    ...order,
    ship_way: shipWayMap[order.ship_way] || order.ship_way,
    status: statusMap[order.status] || order.status,
    created_at: formatDate(order.created_at),
  }));
};

const formatDate = (datetimeStr: string): string => {
  const date = new Date(datetimeStr);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${yyyy}/${mm}/${dd} - ${hh}:${min}`;
};

const icon_change = (status: string) => {
  switch (status) {
    case "處理中":
      return "mdi-clipboard-text-clock";

    case "已付款":
      return "mdi-cash-check";

    case "已出貨":
      return "mdi-truck-check";

    case "已完成":
      return "mdi-check-circle";

    case "已取消":
      return "mdi-close-circle";
  }
};

const data = ref<data[]>();
const get_data = async () => {
  const res = await getorder();
  if (res.status == 200) {
    data.value = changedata(res.data);
  }
};
get_data();
</script>

<template>
  <v-container class="sm-w-[80vw] w-[90vw] px-4 m-a text-center">
    <h3>訂單資訊</h3>
    <v-expansion-panels v-model="panel" multiple class="sm-w-80% w-100% m-a mt-4">
      <v-expansion-panel v-for="i in data">
        <v-expansion-panel-title>
          <v-row class="items-center text-3 sm-text-4">
            <v-col><v-icon :icon="icon_change(i.status)"></v-icon></v-col>
            <v-col cols="8" sm="">訂單編號 : {{ i.id }}</v-col>

            <v-col cols="6" sm="">下單時間 : {{ i.created_at }}</v-col>
            <v-col cols="6" sm=""> 狀態 : {{ i.status }}</v-col>
          </v-row>
        </v-expansion-panel-title>
        <v-expansion-panel-text class="border-t">
          <v-list class="p-0 h-a">
            <v-row class="w-[100%] h-[20px] sm-h-[40px] sm-my-2 my- items-center text-3 sm-text-4">
              <v-col> </v-col>

              <v-col class="w-[200px]"> 名稱 </v-col>
              <v-col class="text-end">數量</v-col>
              <v-col class="text-end">金額</v-col>
            </v-row>
            <v-divider></v-divider>
          </v-list>
          <v-list v-for="it in i.items" class="p-0 my-2 h-a">
            <v-row class="w-[100%] h-[70px] my-2 items-center text-3 sm-text-4">
              <v-col>
                <v-img :src="it.image_url" height="50" contain></v-img>
              </v-col>

              <v-col class="w-[200px]">{{ it.name }}</v-col>
              <v-col class="text-end">{{ it.quantity }}</v-col>
              <v-col class="text-end"> {{ it.quantity * it.price }}</v-col>
            </v-row>
            <v-divider></v-divider>
          </v-list>
          <v-row class="text-end px-4  text-3 sm-text-4">
            <v-col>
              {{ i.ship_way }} :{{ i.ship_info }} - ${{ i.ship_cost }}
            </v-col>
          </v-row>
          <v-row class="text-end px-4  text-3 sm-text-4">
            
            <v-col> 折扣: {{ i.discount }}</v-col>
          </v-row>

          <v-row class="text-end px-4  text-3 sm-text-4">
            
            <v-col
              ><h3>總計: {{ i.total_price }}</h3></v-col
            >
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<style scoped></style>

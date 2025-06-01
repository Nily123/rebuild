<script setup lang="ts">
import { getAllorder, updateorder, deleteorder } from "@/api/order";
import { computed, ref } from "vue";

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
  username: string;
  email: string;
  phone: string;
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
interface updaterange {
  ship_way: string;
  ship_info: string;
  ship_cost: number;
  discount: number;
  total_price: number;
  status: string;
}
const emptydata = {
  id: 0,
  user_id: 0,
  total_price: 0,
  status: "",
  created_at: "",
  ship_way: "",
  ship_info: "",
  ship_cost: 0,
  discount: 0,
  username: "",
  email: "",
  phone: "",
  items: [
    {
      order_id: 0,
      special_code: "",
      quantity: 0,
      price: 0,
      capacity: 0,
      name: "",
      image_url: "",
      special_code0: "",
    },
  ],
};

const data = ref<data[]>([]);
const deletedialog = ref(false);
const panel = ref([]);
const selectedid = ref(0);
const selecteddata = ref<data>(emptydata);
const snackbar = ref(false);
const text = ref("");
const alert_color = ref("black");
const editdialog = ref(false);

const ship_item = [
  {
    text: "處理中",
    value: "pending",
  },
  {
    text: "已付款",
    value: "paid",
  },
  {
    text: "已出貨",
    value: "shipped",
  },
  {
    text: "已完成",
    value: "completed",
  },
  {
    text: "已取消",
    value: "canceled",
  },
];
const shipping_match = [
  { way: "store", cost: 0 },
  { way: "home", cost: 50 },
  { way: "third_way", cost: 70 },
];
const countship = () => {
  if (!selecteddata.value) return;

  const match = shipping_match.find(
    (i) => i.way === selecteddata.value!.ship_way
  );
  selecteddata.value.ship_cost = match?.cost ?? 0;
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

const statusMap = (data: string) => {
  switch (data) {
    case "pending":
      return "處理中";
    case "paid":
      return "已付款";
    case "shipped":
      return "已出貨";
    case "completed":
      return "已完成";
    case "canceled":
      return "已取消";
  }
  return data;
};

const shipWayMap = (data: string) => {
  switch (data) {
    case "store":
      return "門市取貨";
    case "home":
      return "宅配到家";
    case "third_way":
      return "超商取貨";
  }
  return data;
};

const getdata = async () => {
  try {
    const res = await getAllorder();
    if (res.status == 200) {
      console.log(res.data);
      const data0 = res.data;
      data.value = data0;
    }
  } catch (err) {
    console.log(err);
  }
};

const openEditDialog=(i:data)=>{
    console.log('1');
    selecteddata.value = i;
    editdialog.value= true;
}
const calculateTotalAmount=(data: data): number =>{
  const itemsTotal = data.items.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  const total = itemsTotal + data.ship_cost - data.discount;
  return total;
}

const savechange = () => {
  selecteddata.value.total_price = calculateTotalAmount(selecteddata.value);
  const id = selecteddata.value.id;

  if (id === undefined) return;

  const index = data.value.findIndex((item) => item.id === id);
  if (index !== -1) {
    Object.assign(data.value[index], selecteddata.value);
    //data.value[index] = { ...selecteddata.value }; // 複製 selecteddata 的內容覆蓋
  }
  editdialog.value = false;
};

const UpdateOrder = async (id: number) => {
  const target = data.value.find((item) => item.id === id);

  if (!target) {
    console.error("找不到對應的訂單資料");
    return;
  }

  const object: updaterange = {
    ship_way: target.ship_way,
    ship_info: target.ship_info,
    discount: target.discount,
    total_price: target.total_price,
    status: target.status,
    ship_cost: target.ship_cost,
  };
  try {
    const res = await updateorder(id, object);
    if (res.status == 200) {
      snackbar.value = true;
      text.value = "更新成功!";
      alert_color.value = "success";
      getdata();
    } else {
      snackbar.value = true;
      text.value = "更新失敗!";
      alert_color.value = "red";
    }
  } catch (err) {
    console.log(err);
  }
};
const DeleteOrder = async () => {
  try {
    const res = await deleteorder(selectedid.value);
    if (res.status == 200) {
      snackbar.value = true;
      text.value = "刪除成功!";
      alert_color.value = "success";
    } else {
      snackbar.value = true;
      text.value = "刪除失敗!";
      alert_color.value = "red";
    }
  } catch (err) {
    console.log(err);
  }
};

const selectedStatusList = ref<string[]>([]);

const filteredDataList = computed(() =>
  data.value.filter(
    (order) =>
      selectedStatusList.value.length === 0 ||
      selectedStatusList.value.includes(order.status)
  )
);

getdata();
</script>

<template>
  <v-container>
    <div class="flex sm-px-10%">
      <v-spacer></v-spacer
      ><v-select
        variant="outlined"
        max-width="300"
        v-model="selectedStatusList"
        multiple
        :items="ship_item"
        item-title="text"
        item-value="value"
        label="Select"
        single-line
      ></v-select>
    </div>
    <v-expansion-panels
      v-model="panel"
      elevation="0"
      multiple
      class="sm-w-90% w-100% m-a mt-4 gap-2"
    >
      <v-expansion-panel
        v-for="i in filteredDataList"
        class="bg-[#D7CEAD]/10 border-solid border-1px border-black/20"
      >
        <v-expansion-panel-title>
          <v-row class="items-center text-3 sm-text-4">
            <v-col cols="8" sm="">訂單編號 : {{ i.id }}</v-col>
            <v-col> {{ i.username }} </v-col>
            <v-col cols="6" sm=""
              >下單時間 : {{ formatDate(i.created_at) }}</v-col
            >
            <v-col cols="6" sm=""> 狀態 : {{ statusMap(i.status) }}</v-col>
          </v-row>
        </v-expansion-panel-title>
        <v-expansion-panel-text class="border-t">
          <div class="flex">
            <v-spacer></v-spacer>
            <v-select
              variant="outlined"
              max-width="200"
              v-model="i.status"
              :items="ship_item"
              item-title="text"
              item-value="value"
              label="Select"
              single-line
            ></v-select>
            <v-btn
              variant="text"
              icon="mdi-pencil-outline"
              @click="openEditDialog(i);"
            ></v-btn>
            <v-btn
              variant="text"
              icon="mdi-delete-outline"
              @click="
                deletedialog = true;
                selectedid = i.id;
              "
            ></v-btn>
          </div>
          <div class="py-2">
            <h2>用戶資訊</h2>
            <v-row>
              <v-col>用戶名 : {{ i.username }}</v-col>
              <v-col>{{ i.email }}</v-col>
              <v-col>{{ i.phone }}</v-col>
            </v-row>
          </div>
          <v-divider></v-divider>
          <div class="py-2">
            <h2>訂單內容</h2>
            <v-list class="p-0 h-a bg-[#D7CEAD]/40">
              <v-row
                class="w-[100%] h-[20px] sm-h-[40px] sm-my-2 my- items-center text-3 sm-text-4"
              >
                <v-col> </v-col>

                <v-col class="w-[200px]"> 名稱 </v-col>
                <v-col class="text-end">數量</v-col>
                <v-col class="text-end">金額</v-col>
              </v-row>
              <v-divider></v-divider>
            </v-list>
            <v-list v-for="it in i.items" class="p-0 my-2 h-a bg-[#D7CEAD]/10">
              <v-row
                class="w-[100%] h-[70px] my-2 items-center text-3 sm-text-4"
              >
                <v-col>
                  <v-img :src="it.image_url" height="50" contain></v-img>
                </v-col>

                <v-col class="w-[30 0px]"
                  >{{ it.name }}-{{ it.capacity }}ml</v-col
                >
                <v-col class="text-end">{{ it.quantity }}</v-col>
                <v-col class="text-end"> {{ it.quantity * it.price }}</v-col>
              </v-row>
              <v-divider></v-divider>
            </v-list>
            <v-row class="text-end px-4 text-3 sm-text-4">
              <v-col>
                {{ shipWayMap(i.ship_way) }} :{{ i.ship_info }} - ${{
                  i.ship_cost
                }}
              </v-col>
            </v-row>
            <v-row class="text-end px-4 text-3 sm-text-4">
              <v-col> 折扣: {{ i.discount }}</v-col>
            </v-row>

            <v-row class="text-end px-4 text-3 sm-text-4">
              <v-col
                ><h3>總計: {{ i.total_price }}</h3></v-col
              >
            </v-row>
          </div>
          <div class="flex gap-2">
            <v-spacer></v-spacer>
            <v-btn variant="outlined" color="#F4C549" @click="getdata()"
              >取消</v-btn
            >
            <v-btn
              variant="flat"
              color="#F4C549"
              class="font-800 text-white"
              @click="UpdateOrder(i.id)"
              >儲存</v-btn
            >
          </div>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-dialog v-model="deletedialog" width="auto">
      <v-card
        class="sm-min-w-[300px]"
        prepend-icon="mdi-check-circle-outline"
        text="確認要刪除這筆訂單嗎?"
        title=" 刪除確認"
      >
        <template v-slot:actions>
          <v-spacer></v-spacer>
          <v-btn
            class="ms-auto"
            text="取消"
            @click="deletedialog = false"
          ></v-btn>
          <v-btn class="ms-auto" text="確認" @click="DeleteOrder()"></v-btn>
        </template>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" timeout="2000" :color="alert_color">
      {{ text }}

      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="snackbar = false">
          X
        </v-btn>
      </template>
    </v-snackbar>

    <v-dialog
      v-model="editdialog"
      max-width="1000"
      class="w-[700px]"
    >
      <v-card title="訂單資訊編輯">
        <template v-slot:text>
          <v-row>
            <v-col cols="12" md="6">
              <v-radio-group
                class="w-[200px]"
                v-model="selecteddata.ship_way"
                defaults-target="store"
                @update:model-value="countship()"
              >
                <v-radio label="門市取貨" value="store"></v-radio>
                <v-radio label="宅配到府" value="home"></v-radio>
                <v-radio label="超商、蝦皮取貨" value="third_way"></v-radio>
              </v-radio-group>
            </v-col>

            <v-col cols="12" md="6">
              <div v-show="selecteddata.ship_way == 'store'">
                <v-select
                  class="sm-w-[300px] w-[200px]"
                  clearable
                  label="選取門市"
                  v-model="selecteddata.ship_info"
                  :items="[
                    'A門市',
                    'B門市',
                    'C門市',
                    'D門市',
                    'E門市',
                    'F門市',
                  ]"
                  variant="outlined"
                ></v-select>
              </div>
              <div v-show="selecteddata.ship_way == 'home'">
                <v-text-field
                  clearable
                  label="配送地址"
                  prepend-icon="mdi-truck"
                  variant="outlined"
                  class="sm-w-[300px] w-[200px]"
                  v-model="selecteddata.ship_info"
                ></v-text-field>
              </div>
              <div v-show="selecteddata.ship_way == 'third_way'">
                <v-select
                  class="sm-w-[300px] w-[200px]"
                  clearable
                  label="選取通路"
                  v-model="selecteddata.ship_info"
                  prepend-icon="mdi-store-plus"
                  :items="['7-11', '全家', '萊爾富', '蝦皮門市']"
                  variant="outlined"
                ></v-select>
                <v-text-field
                  clearable
                  label="門市名稱"
                  prepend-icon="mdi-store-marker"
                  variant="outlined"
                  class="sm-w-[300px] w-[200px]"
                  v-model="selecteddata.ship_info"
                ></v-text-field>
              </div>
            </v-col>

            <v-col cols="12" md="6">
                折扣金額
              <input type="number"
              class="px-2 border-solid rounded"
                v-model="selecteddata.discount"
              ></input>
            </v-col> 
          </v-row>
        </template>

        <v-divider></v-divider>

        <v-card-actions class="px-4">
          <v-btn
            text="取消"
            variant="plain"
            @click="editdialog = false"
          ></v-btn>

          <v-spacer></v-spacer>

          <v-btn text="儲存變更" variant="outlined" @click="savechange()"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped></style>

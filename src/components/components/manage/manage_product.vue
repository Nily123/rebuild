<script setup lang="ts">
import { deleteManageproduct, getAllProducts } from "@/api/product";
import { useUserStore } from "@/stores/index";
import { ref } from "vue";
import Edit_product from "./edit_product.vue";
const userStore = useUserStore();
interface product_info {
  product: {
    id: number;
    name: string;
    is_active: number;
    description: string;
    vendor_name: string;
    slug: string;
    ingredients: {
      前調: string[];
      中調: string[];
      後調: string[];
      香調: string[];
    };
  };
  products_variants: {
    special_code: string;
    capacity: string;
    price: string;
  }[];
  product_images_common: string[];
  product_images_variants: {
    special_code: string;
    images: string[];
  }[];
}
const emptydata: product_info = {
  product: {
    id: 0,
    name: "",
    description: "",
    ingredients: {
      中調: [""],
      前調: [""],
      後調: [""],
      香調: [""],
    },
    is_active: 1,
    vendor_name: "",
    slug: "",
  },
  products_variants: [
    {
      special_code: "",
      capacity: "",
      price: "",
    },
  ],
  product_images_common: [],
  product_images_variants: [
    {
      special_code: "",
      images: [""],
    },
  ],
};
const data = ref<product_info[]>([emptydata]);
const loading = ref(true);
const page = ref(1);
const itemsPerPage = ref(10);
const expandedItems = ref([]);
const updatedialog = ref(false);
const deletedialog = ref(false);
const mode = ref("");
const snackbar = ref(false);
const snackbarText = ref("");
const alert_color = ref("success");
const selectid = ref<number>(0);
const search = ref("");
const headers = [
  { title: "ID", key: "product.id", sortable: true },
  { title: "商品名", key: "product.name", sortable: true },
  { title: "品牌", key: "product.vendor_name", sortable: true },
  { title: "是否上架", key: "product.is_active", sortable: true },
  { title: "動作", key: "actions", sortable: false },
];

// 依照分頁參數計算當前頁資料
const pageCount = () => {
  return Math.ceil(data.value.length / itemsPerPage.value);
};

const active_change = (data: number) => {
  if (data == 0) {
    return "下架";
  } else {
    return "上架";
  }
};

const getdata = async () => {
  try {
    const res = await getAllProducts();
    if (res.status == 200) {
      loading.value = false;
      data.value = res.data;
    }
  } catch (err) {
    console.log(err);
  }
};
const AddProduct = () => {
  mode.value = "add";
  updatedialog.value = true;
  selectid.value = 0;
};
const EditProduct = (data: product_info) => {
  mode.value = "edit";
  updatedialog.value = true;
  selectid.value = data.product.id;
};
const DeleteProduct = async () => {
  if (userStore.user.role == "manager") {
    try {
      const res = await deleteManageproduct(selectid.value);
      if (res.status == 200) {
        deletedialog.value = false;
        snackbarText.value = "商品刪除成功!";
        snackbar.value = true;
        alert_color.value = "red";
        getdata();
      }
    } catch (err) {
      console.log(err);
    }
  }
};
const DeleteDialog = (id: number) => {
  if (userStore.user.role == "manager") {
    selectid.value = id;
    deletedialog.value = true;
  }
};

const handleSuccess = (result: number) => {
  updatedialog.value = false; // 關閉 dialog
  console.log("API 結果：", result);
  if (result == 200) {
    alert_color.value = "success";
    showNotification("更新成功");
  } else {
    alert_color.value = "red";
    showNotification("更新失敗");
  }
  getdata();
};
const showNotification = (message: string) => {
  snackbarText.value = message;
  snackbar.value = true;
};
getdata();
</script>

<template>
  <v-container>
    <v-snackbar v-model="snackbar" timeout="2000" :color="alert_color">
      {{ snackbarText }}

      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="snackbar = false">
          X
        </v-btn>
      </template>
    </v-snackbar>

    <v-dialog v-model="deletedialog" width="500">
      <v-card>
        <v-card-title class="font-800 p-4"> 刪除確認 </v-card-title>
        <v-card-text> 確定要刪除這筆商品嗎? </v-card-text>
        <v-card-actions>
          <v-btn @click="deletedialog = false"> 取消 </v-btn>
          <v-btn @click="DeleteProduct()"> 確定 </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <div class="flex my-2">
      <v-text-field
        v-model="search"
        label="Search"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        hide-details
        single-line
      ></v-text-field>
      <v-spacer></v-spacer>

      <h3>商品清單</h3>
      <v-spacer></v-spacer>
      <v-btn
        variant="flat"
        color="#DBA74C"
        class="text-white font-800"
        @click="AddProduct()"
      >
        +
      </v-btn>
    </div>
    <v-data-table
      class="w-[100%]"
      :filter-keys="['product.name']"
      v-model:search="search"
      v-model:page="page"
      :headers="headers"
      :items="data"
      item-value="product.id"
      hide-default-footer
      show-expand
      :loading="loading"
      :items-per-page="itemsPerPage"
      :expanded-items.sync="expandedItems"
    >
      <template v-slot:loading>
        <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
      </template>
      <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort }">
        <tr>
          <template v-for="column in columns" :key="column.key">
            <th>
              <div class="flex justify-center">
                <span
                  class="me-2 cursor-pointer"
                  @click="toggleSort(column)"
                  v-text="column.title"
                  style="text-align: center !important"
                ></span>

                <v-icon
                  v-if="isSorted(column) && column.key !== 'actions'"
                  :icon="getSortIcon(column)"
                  color="medium-emphasis"
                ></v-icon>
              </div>
            </th>
          </template>
        </tr>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn
          variant="text"
          icon="mdi-pencil-outline"
          @click="EditProduct(item)"
        ></v-btn>
        <v-btn
          variant="text"
          icon="mdi-delete-outline"
          @click="DeleteDialog(item.product.id)"
        ></v-btn>
      </template>
      <template
        v-slot:item.data-table-expand="{
          internalItem,
          isExpanded,
          toggleExpand,
        }"
      >
        <v-btn
          :append-icon="
            isExpanded(internalItem) ? 'mdi-chevron-up' : 'mdi-chevron-down'
          "
          :text="isExpanded(internalItem) ? '收起' : '詳細資訊'"
          class="text-none"
          color="medium-emphasis"
          size="small"
          variant="text"
          slim
          @click="toggleExpand(internalItem)"
        ></v-btn>
      </template>
      <template v-slot:item.product.is_active="{ item }">
        {{ active_change(item.product.is_active) }}
      </template>

      <template v-slot:expanded-row="{ columns, item }">
        <tr class="bg-[#FAF1E0]">
          <td :colspan="columns.length" class="py-2">
            <v-sheet rounded="lg" class="h-max">
              <v-table density="compact" class="bg-[#FAF1E0]">
                <tbody>
                  <tr>
                    <td class="font-800">商品介紹</td>
                    <td>
                      {{ item.product.description }}
                    </td>
                  </tr>
                  <tr>
                    <td class="font-800">香調</td>
                    <td>
                      <tr>
                        <td>香調 :</td>
                        <td
                          class="flex gap-2"
                          v-for="i in item.product.ingredients.香調"
                        >
                          <div class="w-a text-center ml-1">{{ i }}</div>
                        </td>
                      </tr>
                      <tr>
                        <td>前調 :</td>
                        <td class="flex gap-2">
                          <div
                            v-for="i in item.product.ingredients.前調"
                            class="w-a text-center ml-1"
                          >
                            {{ i }}
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>中調 :</td>
                        <td class="flex gap-2">
                          <div
                            v-for="i in item.product.ingredients.中調"
                            class="w-a text-center ml-1"
                          >
                            {{ i }}
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>後調 :</td>
                        <td class="flex gap-2">
                          <div
                            v-for="i in item.product.ingredients.後調"
                            class="w-a text-center ml-1"
                          >
                            {{ i }}
                          </div>
                        </td>
                      </tr>
                    </td>
                  </tr>
                  <tr>
                    <td class="font-800">
                      <div class="h-max py-2">商品類型</div>
                    </td>
                    <td>
                      <v-row v-for="i in item.products_variants">
                        <v-col>商品編號: {{ i.special_code }}</v-col>

                        <v-col>容量 : {{ i.capacity }}</v-col>
                        <v-col>價錢 : {{ i.price }}</v-col>
                      </v-row>
                    </td>
                  </tr>
                  <tr>
                    <td class="font-800">商品類型照片</td>
                    <td>
                      <v-row
                        v-for="i in item.product_images_variants"
                        class="py-2"
                      >
                        <v-col class="flex items-center" cols="auto"
                          >商品編號 : {{ i.special_code }}</v-col
                        >
                        <v-col class="flex gap-2" cols="">
                          <v-img
                            class="w-[100px] cover"
                            max-width="100"
                            v-for="pic in i.images"
                            :src="pic"
                          ></v-img>
                        </v-col>
                      </v-row>
                    </td>
                  </tr>
                  <tr>
                    <td class="font-800">商品共通照片</td>
                    <td>
                      <v-row>
                        <v-col class="flex gap-2 flex-wrap">
                          <v-img
                            class="w-[100px] cover"
                            max-width="100"
                            min-width="100"
                            v-for="pic in item.product_images_common"
                            :src="pic"
                          ></v-img>
                        </v-col>
                      </v-row>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-sheet>
          </td>
        </tr>
      </template>

      <template v-slot:bottom>
        <div class="text-center pt-2">
          <v-pagination v-model="page" :length="pageCount()">{{
            page
          }}</v-pagination>
        </div>
      </template>
    </v-data-table>
    <Edit_product
      v-if="updatedialog"
      :prop_data="{ selectid, mode }"
      v-model:visible="updatedialog"
      @submit-success="handleSuccess"
    />
  </v-container>
</template>

<style scoped></style>

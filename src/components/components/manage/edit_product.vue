<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  getManageproduct,
  postproductpics,
  postproductdata,
  updateManageproduct,
} from "@/api/product";
const visible = defineModel<boolean>("visible"); // 就是 v-model:visible
const emit = defineEmits<{
  (e: "submit-success", result: any): void;
}>();
const props = defineProps<{
  prop_data: {
    selectid: number;
    mode: string;
  };
}>();
interface product_data {
  product: {
    id: number;
    name: string;
    vendor_id: number;
    special_code: string;
    description: string;
    ingredients: {
      前調: string[];
      中調: string[];
      後調: string[];
      香調: string[];
    };
    gender: string;
    is_active: boolean | number;
  };
  variants: {
    special_code: string;
    product_id: number;
    capacity: string;
    price: number;
  }[];
  product_images_common: {
    id: number;
    product_id: number;
    image_url: string;
    sequence: number;
  }[];
  product_images_variants: {
    special_code: string;
    images: {
      id: number;
      product_id: number;
      special_code: string;
      image_url: string;
      sequence: number;
    }[];
  }[];
}
const emptydata: product_data = {
  product: {
    id: 0,
    name: "",
    vendor_id: 0,
    special_code: "",
    description: "",
    ingredients: {
      前調: [],
      中調: [],
      後調: [],
      香調: [],
    },
    gender: "",
    is_active: true,
  },
  variants: [],
  product_images_common: [],
  product_images_variants: [],
};
const data = ref<product_data>(emptydata);

const title = ref("");
const valid = ref(false);
const addingredient = ref(false);
const tempdata = ref("");
const tempsite = ref("");
const ingredients_type = ref<string[]>([]);
const ingredients_front = ref<string[]>([]);
const ingredients_mid = ref<string[]>([]);
const ingredients_back = ref<string[]>([]);
const addvariant = ref(false);
const addcommonpic = ref(false);
const addvariantpic = ref(false);
const temp_special_code = ref("");
const temp_pic_sequence = ref(0);
const temp_pic_url = ref('');
const pic = ref<File>();
const temp_variant = ref({
  special_code: "",
  product_id: 0,
  capacity: "",
  price: 0,
});
const rules = {
  required: (v: any) => !!v || "必填",
};
const vendor = [
  {
  label:'Frederic Malle',value: 1
  },
  {
  label:'Penhaligon’s',value: 2
  },
  {
  label:'Aesop',value: 3
  },
  {
  label:'Le Labo',value: 4
  },
  {
  label:'JO MALONE',value: 5
  },{
  label:'ACQUA DI PARMA',value: 6
  },
  ];

// 商品香調
const addingredients = (site: string) => {
  addingredient.value = true;
  tempsite.value = site;
};
const storeaddingredients = () => {
  const validNotes = ["前調", "中調", "後調", "香調"];
  if (validNotes.includes(tempsite.value)) {
    switch (tempsite.value) {
      case "香調":
        ingredients_type.value.push(tempdata.value);
        break;
      case "前調":
        ingredients_front.value.push(tempdata.value);
        break;
      case "中調":
        ingredients_mid.value.push(tempdata.value);
        break;
      case "後調":
        ingredients_back.value.push(tempdata.value);
        break;
    }
  }
  canceladdingredients();
};
const canceladdingredients = () => {
  tempdata.value = "";
  tempsite.value = "";
  addingredient.value = false;
};

const popingredients = (item: string, site: string) => {
  tempsite.value = site;
  const index = ingredients_type.value.indexOf(item);
  if (index !== -1) {
    const validNotes = ["前調", "中調", "後調", "香調"];
    if (validNotes.includes(tempsite.value)) {
      switch (tempsite.value) {
        case "香調":
          ingredients_type.value.splice(index, 1);
          break;
        case "前調":
          ingredients_front.value.splice(index, 1);
          break;
        case "中調":
          ingredients_mid.value.splice(index, 1);
          break;
        case "後調":
          ingredients_back.value.splice(index, 1);
          break;
      }
      tempsite.value = "";
    }
  }
};

// 商品種類
const addvariants = () => {
  addvariant.value = true;
  temp_variant.value.product_id = data.value.product.id;
};

const storevariants = () => {
  data.value.variants.push(temp_variant.value);
  cancelvariants();
};

const cancelvariants = () => {
  temp_variant.value = {
    special_code: "",
    product_id: 0,
    capacity: "",
    price: 0,
  };
  addvariant.value = false;
};

const popvaraint = (index: number) => {
  data.value.variants.splice(index, 1);
};

// 商品共用圖片
const addcommonpics = () => {
  addcommonpic.value = true;
  temp_pic_sequence.value = data.value.product_images_common.length + 1;
};

const storecommonpics = async () => {
  try {
    if (pic.value) {
      const res = await postproductpics(pic.value);
      if (res.status == 200) {
        const body = {
          id: 0,
          product_id: data.value.product.id,
          image_url: res.data.url,
          sequence: temp_pic_sequence.value,
        };
        data.value.product_images_common.push(body);
      }
    }else{
      const body = {
          id: 0,
          product_id: data.value.product.id,
          image_url: temp_pic_url.value,
          sequence: temp_pic_sequence.value,
        };
        data.value.product_images_common.push(body);
    }

  } catch (err) {}
  cancelcommonpics();
};

const cancelcommonpics = () => {
  addcommonpic.value = false;
};

const popcommonpics = (index: number) => {
  data.value.product_images_common.splice(index, 1);
};

// 商品種類圖片
const addvariantpics = () => {
  addvariantpic.value = true;
  temp_pic_sequence.value = data.value.product_images_variants.length + 1;
};

const storevariantpics = async () => {
  try {
    if (pic.value) {
      const res = await postproductpics(pic.value);
      if (res.status == 200) {
        const targetSpecialCode = temp_special_code.value;
        const body = {
          id: 0,
          product_id: 0,
          image_url: res.data.url,
          sequence: temp_pic_sequence.value,
          special_code: temp_special_code.value,
        };
        // 嘗試找出是否已有這個 special_code 的群組
        let targetVariant = data.value.product_images_variants.find(
          (variant) => variant.special_code === targetSpecialCode
        );

        if (!targetVariant) {
          // 若無則建立一個新的物件並加入陣列
          targetVariant = {
            special_code: targetSpecialCode,
            images: [],
          };
          data.value.product_images_variants.push(targetVariant);
        }

        // 加入圖片資料
        targetVariant.images.push(body);
      }
    }else{
      const targetSpecialCode = temp_special_code.value;
        const body = {
          id: 0,
          product_id: 0,
          image_url: temp_pic_url.value,
          sequence: temp_pic_sequence.value,
          special_code: temp_special_code.value,
        };
        // 嘗試找出是否已有這個 special_code 的群組
        let targetVariant = data.value.product_images_variants.find(
          (variant) => variant.special_code === targetSpecialCode
        );

        if (!targetVariant) {
          // 若無則建立一個新的物件並加入陣列
          targetVariant = {
            special_code: targetSpecialCode,
            images: [],
          };
          data.value.product_images_variants.push(targetVariant);
        }

        // 加入圖片資料
        targetVariant.images.push(body);
    }
  } catch (err) {}
  cancelvariantpics();
};

const cancelvariantpics = () => {
  addvariantpic.value = false;
};

const popvariantpics = (i: number, j: number) => {
  data.value.product_images_variants[i].images.splice(j, 1);
};

// GET
const getdata = async () => {
  try {
    title.value = props.prop_data.mode == "add" ? "新增商品" : "編輯商品";
    if(props.prop_data.mode == "edit"){
      const res = await getManageproduct(props.prop_data.selectid);
      if (res.status == 200) {
        data.value = res.data;
        data.value.product.is_active = Boolean(data.value.product.is_active);
        ingredients_type.value = data.value.product.ingredients.香調;
        ingredients_front.value = data.value.product.ingredients.前調;
        ingredients_mid.value = data.value.product.ingredients.中調;
        ingredients_back.value = data.value.product.ingredients.後調;
      }
    }
  } catch (err) {
    console.log(err);
  }
};

const senddata = async () => {
  
    data.value.product.is_active = Number(data.value.product.is_active);
    data.value.product.ingredients.香調 = ingredients_type.value;
    data.value.product.ingredients.前調 = ingredients_front.value;
    data.value.product.ingredients.中調 = ingredients_mid.value;
    data.value.product.ingredients.後調 = ingredients_back.value;
    console.log(data.value);

  if (!valid.value) return;
    try {
      if (props.prop_data.mode == "add") {
        const res =await postproductdata(data.value);
        if(res.status ==200){
          data.value = emptydata;
          emit("submit-success", res.status);
          visible.value = false;
        } else {
          emit("submit-success", res.status);
        }
      }
       else {
        const res = await updateManageproduct(data.value);
        if (res.status == 200) {
          emit("submit-success",  res.status);
          visible.value = false;
        } else {
          emit("submit-success",  res.status);
        }
      }
    } catch (err) {
      console.log(err);
    }
};

const closedialog = ()=>{
  visible.value = false
}
onMounted(() => {
  getdata();
});
</script>

<template>
  <v-dialog v-model="visible" max-width="900px">
    <template #activator="{ props }">
      <v-btn v-bind="props" color="primary">編輯商品</v-btn>
    </template>
    <v-dialog v-model="addingredient">
      <v-card width="300" location="center" class="pt-2">
        <v-card-title class="pl-6">新增{{ tempsite }}</v-card-title>
        <v-text-field
          v-model="tempdata"
          variant="outlined"
          width="250"
          class="m-a"
        >
        </v-text-field>
        <v-card-actions>
          <v-btn @click="canceladdingredients()"> 取消 </v-btn>
          <v-btn @click="storeaddingredients()"> 儲存 </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="addvariant">
      <v-card width="300" location="center" class="pt-2">
        <v-card-title class="pl-6">新增商品種類</v-card-title>
        <v-text-field
          v-model="temp_variant.special_code"
          label="商品種類編號"
          variant="outlined"
          width="250"
          class="m-a"
        >
        </v-text-field>
        <v-text-field
          v-model="temp_variant.capacity"
          label="容量"
          variant="outlined"
          width="250"
          class="m-a"
        >
        </v-text-field>
        <v-text-field
          label="價錢"
          v-model="temp_variant.price"
          variant="outlined"
          width="250"
          class="m-a"
        >
        </v-text-field>
        <v-card-actions>
          <v-btn @click="cancelvariants()"> 取消 </v-btn>
          <v-btn @click="storevariants()"> 儲存 </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="addcommonpic">
      <v-card width="500" location="center" class="pt-2 px-2">
        <v-card-title class="pl-6 mb-2 font-800">新增商品共用圖片</v-card-title>
        <v-row>
          <v-spacer />
          <v-col cols="10" class="flex items-center gap-2">
            <v-file-input
              class="m-a"
              v-model="pic"
              clearable
              label="上傳檔案"
              variant="outlined"
              show-size
            >
            </v-file-input>
            <div class=""> or </div>
            <v-text-field
              label="上傳網址"
              v-model="temp_pic_url"
              variant="outlined"
              class="m-a"
            ></v-text-field>
          </v-col>
          <v-spacer />
          </v-row>
          <v-row>
            <v-spacer />
            <v-col cols="10">
              <v-text-field
                label="順序"
                v-model="temp_pic_sequence"
                variant="outlined"
                class="m-a"
              >
              </v-text-field>
            </v-col>
            <v-spacer />
          </v-row>

        <v-card-actions>
          <v-btn @click="cancelcommonpics()"> 取消 </v-btn>
          <v-btn @click="storecommonpics()"> 儲存 </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="addvariantpic">
      <v-card width="500" location="center" class="pt-2">
        <v-card-title class="pl-6 font-800 mb-2">新增商品種類圖片</v-card-title>
        <v-row>
          <v-spacer />
          <v-col cols="10">
            <v-select
              variant="outlined"
              label="選擇商品種類編號"
              v-model="temp_special_code"
              :items="data.variants.map((item) => item.special_code)"
            /> 
            </v-col>
            <v-spacer />
        </v-row>
        <v-row>
          <v-spacer />
          <v-col cols="10" class="flex items-center gap-2">
            <v-file-input
              class="m-a"
              v-model="pic"
              clearable
              label="上傳檔案"
              variant="outlined"
              show-size
            >
            </v-file-input>
            <div class=""> or </div>
            <v-text-field
              label="上傳網址"
              v-model="temp_pic_url"
              variant="outlined"
              class="m-a"
            ></v-text-field>
          </v-col>
          <v-spacer />
          </v-row>
          <v-row>
            <v-spacer />
            <v-col cols="10">
              <v-text-field
                label="順序"
                v-model="temp_pic_sequence"
                variant="outlined"
                class="m-a"
              >
              </v-text-field>
            </v-col>
            <v-spacer />
          </v-row>
        <v-card-actions>
          <v-btn @click="cancelvariantpics()"> 取消 </v-btn>
          <v-btn @click="storevariantpics()"> 儲存 </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-card class="py-2">
      <v-card-title class="ml-6 font-800 text-6">{{ title }}</v-card-title>
      <v-card-text>
        <v-form v-model="valid" ref="form">
          <v-container>
            <v-row>
              <!-- Products table -->
              <v-col cols="12">
                <v-text-field
                  variant="outlined"
                  label="商品名稱"
                  v-model="data.product.name"
                  :rules="[rules.required]"
                />
                <v-text-field
                  variant="outlined"
                  label="特殊代碼"
                  v-model="data.product.special_code"
                  :rules="[rules.required]"
                />
                <v-textarea
                  class="min-h-[150px]"
                  variant="outlined"
                  label="描述"
                  v-model="data.product.description"
                  rows="2"
                />
                <div class="my-4">
                  <p>成分 :</p>
                  <div class="flex items-center gap-2">
                    <p>香調 :</p>
                    <v-chip-group v-model="ingredients_type">
                      <v-chip
                        v-for="i in ingredients_type"
                        closable
                        @click:close="popingredients(i, '香調')"
                      >
                        {{ i }}
                      </v-chip>
                    </v-chip-group>
                    <v-btn
                      variant="outlined"
                      icon="mdi-plus"
                      size="28"
                      @click="addingredients('香調')"
                    />
                  </div>
                  <div class="flex items-center gap-2">
                    <p>前調 :</p>
                    <v-chip-group v-model="ingredients_front">
                      <v-chip
                        v-for="i in ingredients_front"
                        closable
                      >
                        {{ i }}
                      </v-chip>
                    </v-chip-group>
                    <v-btn
                      variant="outlined"
                      icon="mdi-plus"
                      size="28"
                      @click="addingredients('前調')"
                    />
                  </div>
                  <div class="flex items-center gap-2">
                    <p>中調 :</p>
                    <v-chip-group v-model="ingredients_mid">
                      <v-chip
                        v-for="i in ingredients_mid"
                        closable
                      >
                        {{ i }}
                      </v-chip>
                    </v-chip-group>
                    <v-btn
                      variant="outlined"
                      icon="mdi-plus"
                      size="28"
                      @click="addingredients('中調')"
                    />
                  </div>
                  <div class="flex items-center gap-2">
                    <p>後調 :</p>
                    <v-chip-group v-model="ingredients_back">
                      <v-chip
                        v-for="i in ingredients_back"
                        closable
                      >
                        {{ i }}
                      </v-chip>
                    </v-chip-group>
                    <v-btn
                      variant="outlined"
                      icon="mdi-plus"
                      size="28"
                      @click="addingredients('後調')"
                    />
                  </div>
                </div>
                <v-row class="flex">
                  <v-col>
                    <v-select
                      class="mt-4"
                      label="性別"
                      variant="outlined"
                      v-model="data.product.gender"
                      :items="['中性', '男', '女']"
                    />
                  </v-col>
                  <v-col>
                    <v-select
                      class="mt-4"
                      label="品牌"
                      variant="outlined"
                      v-model="data.product.vendor_id"
                      :items="vendor"
                      item-title="label"
                      item-value="value"
                    />
                  </v-col>
                  <v-col class="text-center items-center p-a flex">
                    <v-switch
                      class="text-center items-center"
                      color="#F1C04C"
                      base-color="black"
                      :label="data.product.is_active ? '上架中' : '下架'"
                      v-model="data.product.is_active"
                    >
                      <template v-slot:prepend> 狀態 : </template>
                    </v-switch>
                  </v-col>
                </v-row>
              </v-col>
              <v-divider></v-divider>
              <v-col cols="12">
                <div class="flex my-4">
                  <h3 class="text-h6">商品種類</h3>
                  <v-spacer></v-spacer>
                  <v-btn
                    variant="outlined"
                    icon="mdi-plus"
                    @click="addvariants()"
                  ></v-btn>
                </div>

                <v-row v-for="(variant, i) in data.variants" :key="i">
                  <v-col cols="4">
                    <v-text-field
                      variant="outlined"
                      label="變體代碼"
                      v-model="variant.special_code"
                    />
                  </v-col>
                  <v-col cols="3">
                    <v-text-field
                      variant="outlined"
                      label="容量"
                      v-model="variant.capacity"
                    />
                  </v-col>
                  <v-col cols="4">
                    <v-text-field
                      variant="outlined"
                      label="售價"
                      v-model="variant.price"
                      type="number"
                    />
                  </v-col>
                  <v-col cols="1" class="items-center">
                    <v-btn
                      variant="text"
                      icon="mdi-close"
                      @click="popvaraint(i)"
                    ></v-btn
                  ></v-col>
                </v-row>
              </v-col>
              <v-divider></v-divider>
              <v-col cols="12">
                <div class="flex my-4">
                  <h3 class="text-h6">共通圖片</h3>
                  <v-spacer></v-spacer>
                  <v-btn
                    variant="text"
                    icon="mdi-plus"
                    @click="addcommonpics"
                  ></v-btn>
                </div>

                <v-row v-for="(img, i) in data.product_images_common" :key="i">
                  <v-col cols="3">
                    <v-text-field
                      variant="outlined"
                      label="圖片網址"
                      v-model="img.image_url"
                    />
                  </v-col>
                  <v-col cols="2">
                    <v-text-field
                      variant="outlined"
                      label="順序"
                      v-model="img.sequence"
                      type="number"
                    />
                  </v-col>
                  <v-col cols="6">
                    <v-img :src="img.image_url"></v-img>
                  </v-col>
                  <v-col cols="1">
                    <v-btn
                      variant="text"
                      icon="mdi-close"
                      @click="popcommonpics(i)"
                    ></v-btn>
                  </v-col>
                </v-row>
              </v-col>

              <v-divider></v-divider>
              <v-col cols="12">
                <div class="flex my-4">
                  <h3 class="text-h6">商品種類圖片</h3>
                  <v-spacer></v-spacer>
                  <v-btn
                    variant="text"
                    icon="mdi-plus"
                    @click="addvariantpics()"
                  ></v-btn>
                </div>
                <v-row
                  v-for="(img, i) in data.product_images_variants"
                  :key="i"
                  class="my-2 border-solid border-1px border-rounded border-[#F1C04C]/50"
                >
                  <v-col cols="12">
                    <h3>{{ img.special_code }}</h3>
                  </v-col>
                  <v-col cols="12">
                    <v-row v-for="(im, j) in img.images" :key="j">
                      <v-col cols="3">
                        <v-text-field
                          variant="outlined"
                          label="圖片網址"
                          v-model="im.image_url"
                        />
                      </v-col>
                      <v-col cols="2">
                        <v-text-field
                          variant="outlined"
                          label="順序"
                          v-model="im.sequence"
                          type="number"
                        />
                      </v-col>
                      <v-col cols="6">
                        <v-img :src="im.image_url"></v-img>
                      </v-col>
                      <v-col cols="1">
                        <v-btn
                          variant="text"
                          icon="mdi-close"
                          @click="popvariantpics(i, j)"
                        ></v-btn>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn text @click="closedialog()">取消</v-btn>
        <v-btn color="primary" @click="senddata()">儲存</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped></style>

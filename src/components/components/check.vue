<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { check } from '@/api/cart';

const emit = defineEmits(['update:visible'])

interface CartItem {
  id: number;
  special_code: string;
  quantity: number;
  product_id: number;
  capacity: number;
  price: number;
  image_url: string;
  name: string;
  special_code0: string;
}
interface BuyItem {
  special_code: string;
  quantity: number;
  price: number;
}
interface product{
    name:string;
    price:number;
    capacity:number;
    quantity:number;
}
interface data{
  product_list:{
    special_code:string;
    number: number;
  }[];
  total :number;
  ship :string;
  ship_info :string;
  ship_cost :number;
  discount :number;
}

const props = defineProps<{
  prop_data: {
    buyItems: BuyItem[],
    data: CartItem[]
  },
  visible: boolean
}>()

const localVisible = ref(props.visible)

watch(() => props.visible, (val) => {
  localVisible.value = val
})
watch(localVisible, (val) => {
  emit('update:visible', val)
})

const shipping = ref('store')
const step = ref(1)

const products = ref<product[]>([])

const subtotal = computed(() =>
  products.value.reduce((acc, product) => acc + product.quantity * product.price, 0)
)

const shipping_cost = ref(0)
const total = computed(() => subtotal.value + shipping_cost.value)

const countdata = () => {
  products.value = props.prop_data.buyItems.map(item => {
    const product = props.prop_data.data.find(p => p.special_code === item.special_code)
    return {
      name: product?.name || '',
      capacity: product?.capacity || 0,
      price: item.price,
      quantity: item.quantity
    }
  })
}

const shipping_match = [
  { way: 'store', cost: 0 },
  { way: 'home', cost: 50 },
  { way: 'third_way', cost: 70 }
]
const ship_store = ref();
const ship_home = ref();
const ship_third_way0 = ref();
const ship_third_way1 = ref();
const ship_info = ref();
const countship = () => {
  const match = shipping_match.find(i => i.way === shipping.value)
  shipping_cost.value = match?.cost ?? 0
}

const items = ['確認商品', '選擇取貨方式', '結帳','完成']
const discount = ref(0);
const post_check = async()=>{
    
    switch(shipping.value){
      case 'store':
          ship_info.value = ship_store.value;
          break;
      case 'home':
          ship_info.value = ship_home.value;
          break;
      case 'third_way':
          ship_info.value = ship_third_way0.value + ship_third_way1.value;
          break;
    }
   console.log(ship_info.value) 
    const post_data:data = {
        product_list: props.prop_data.buyItems.map(item => ({
          special_code: item.special_code,
          number: item.quantity
        })),
        total : total.value,
        ship : shipping.value,
        ship_info :ship_info.value,
        ship_cost : shipping_cost.value,
        discount : discount.value
    }
    console.log(post_data);
    try {
      const res = await check(post_data)
      if(res.status == 200){
        console.log('Order submitted:', res)
        step.value = step.value + 1;
      }
    } catch (error) {
      console.error('Error submitting order:', error)
    }
}
const check_done=() =>{
    localVisible.value = false;
    history.go(0)
}

countdata();
</script>

<template>
  <v-dialog v-model="localVisible" persistent max-width="800">
    <v-card>
      <v-card-title class="flex items-center font-1000 ml-4">
        結帳流程
        <v-spacer />
        <v-btn variant="text" icon @click="localVisible = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>


      <v-card-text>
        <v-stepper v-model="step" :items="items" show-actions>
          <template #item.1>
            <h3 class="text-h6">商品清單</h3>
            <v-sheet border>
              <v-table>
                <thead>
                  <tr>
                    <th>商品</th>
                    <th class="text-end">數量</th>
                    <th class="text-end">價錢</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(product, index) in products" :key="index">
                    <td>{{ product.name }} - {{ product.capacity }}ml </td>
                    <td class="text-end">{{ product.quantity }}</td>
                    <td class="text-end">{{ product.quantity * product.price }}</td>
                  </tr>
                  <tr>
                    <th>總計</th>
                    <th></th>
                    <th class="text-end">${{ subtotal }}</th>
                  </tr>
                </tbody>
              </v-table>
            </v-sheet>
          </template>

          <template #item.2>
            <h3 class="text-h6"><v-icon icon="mdi-package" class="mx-2"></v-icon>取貨方式</h3>
            <div class="flex">
                <v-radio-group v-model="shipping" defaults-target="store" @update:model-value="countship()">
                  <v-radio  label="門市取貨" value="store"></v-radio>
                  <v-radio label="宅配到府" value="home"></v-radio>
                  <v-radio label="超商、蝦皮取貨" value="third_way"></v-radio>
                </v-radio-group>
                <div >
                    <div v-show="shipping == 'store'">
                        <v-select
                          width="300"
                          clearable
                          label="選取門市"
                          v-model="ship_store"
                          :items="['A門市', 'B門市', 'C門市', 'D門市', 'E門市', 'F門市']"
                          variant="outlined"
                        ></v-select>
                    </div>
                    <div v-show="shipping == 'home'">
                        <v-text-field
                          clearable
                          label="配送地址"
                          prepend-icon="mdi-truck"
                          variant="outlined"
                          width="400"
                          v-model="ship_home"
                        ></v-text-field>
                    </div>
                    <div v-show="shipping == 'third_way'">
                        <v-select
                          width="300"
                          clearable
                          label="選取通路"
                          v-model="ship_third_way0"
                          prepend-icon="mdi-store-plus"
                          :items="['7-11', '全家', '萊爾富', '蝦皮門市']"
                          variant="outlined"
                        ></v-select>
                        <v-text-field
                          clearable
                          label="門市名稱"
                          prepend-icon="mdi-store-marker"
                          variant="outlined"
                          width="400"
                          v-model="ship_third_way1"
                        ></v-text-field>
                    </div>
                </div>
            </div>
          </template>

          <template #item.3>
            <h3 class="text-h6">送出帳單</h3>
            <v-sheet border>
              <v-table>
                <thead>
                  <tr>
                    <th>商品</th>
                    <th class="text-end">數量</th>
                    <th class="text-end">價錢</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(product, index) in products" :key="index">
                    <td>{{ product.name }} - {{ product.capacity }} ml </td>
                    <td class="text-end">{{ product.quantity }}</td>
                    <td class="text-end">{{ product.quantity * product.price }}</td>
                  </tr>
                  <tr>
                    <td>配送</td>
                    <td></td>
                    <td class="text-end">{{ shipping_cost }}</td>
                  </tr>
                  <tr>
                    <th>總計</th>
                    <th></th>
                    <th class="text-end">${{ total }}</th>
                  </tr>
                </tbody>
              </v-table>
            </v-sheet>
          </template>
               
          <template #item.4>
                <div class="size-6 mx-auto w-[400px] h-[200px] text-center items-center" >
                  <h3> 訂單已送出</h3> 
                  <v-icon icon="mdi-check-circle-outline" size="100" color="green"></v-icon>
                  
                </div>
                <v-btn location="center" variant="outlined"  @click="check_done()">關閉</v-btn>
          </template>
          <template v-slot:next>
            <v-btn variant="text" v-show="step!==3" @click="step=step+1" icon="mdi-arrow-right-bold"></v-btn>
            <v-btn variant="outlined" color="#BB8C3F" class="" v-show="step ==3" @click="post_check()"> 送出 </v-btn>
          </template>
          <template v-slot:prev>
            <v-btn variant="text" @click="step=step-1" icon="mdi-arrow-left-bold"></v-btn>
          </template>
        </v-stepper>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

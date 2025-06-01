<script setup lang="ts">
import { ref, watch } from "vue";
import { updateActivity, addActivity} from '@/api/acivity';
import router from "@/router";
const emit = defineEmits(["update:visible"]);
interface activity {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  coverage: string;
}
const props = defineProps<{
  prop_data: { 
    selectdata: activity;
    mode:string;
   };
  visible: boolean;
}>();
const data = ref<activity>(props.prop_data.selectdata);
const localVisible = ref(props.visible);

watch(
  () => props.visible,
  (val) => {
    localVisible.value = val;
  }
);
watch(localVisible, (val) => {
  emit("update:visible", val);
});

const startDateInput = ref(""); // 顯示給使用者的格式
const endDateInput = ref("");

const startError = ref("");
const endError = ref("");
const snackbar = ref(false);
const text = ref('');
const emptydata:activity = {
        id :0,
        name : '',
        description:'',
        start_date:'',
        end_date:'',
        coverage:''
};

// 解析輸入的 YYYY/MM/DD HH:mm 轉為 ISO 字串
const parseDateToISO = (input: string): string | null =>{
  const match = input.match(/^(\d{4})\/(\d{2})\/(\d{2}) (\d{2}):(\d{2})$/);
  if (!match) return null;

  const [_, year, month, day, hour, minute] = match;
  const date = new Date(`${year}-${month}-${day}T${hour}:${minute}:00`);
  return date.toISOString();
}

const  validateDateRange =(
  startInput: string,
  endInput: string
): { valid: boolean; message?: string } => {
  const startISO = parseDateToISO(startInput);
  const endISO = parseDateToISO(endInput);

  if (!startISO || !endISO) {
    return { valid: false, message: "請輸入正確格式：YYYY/MM/DD HH:mm" };
  }

  if (new Date(startISO) >= new Date(endISO)) {
    return { valid: false, message: "起始時間必須早於結束時間" };
  }

  return { valid: true };
}

// 格式化 ISO 時間 → YYYY/MM/DD HH:mm
const  formatDate = (dateStr: string): string =>{
  const date = new Date(dateStr);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

// 初始化時把 ISO 轉成輸入格式
if(props.prop_data.selectdata.start_date!==''){
    startDateInput.value = formatDate(props.prop_data.selectdata.start_date);
}
if(props.prop_data.selectdata.end_date!==''){
    endDateInput.value = formatDate(props.prop_data.selectdata.end_date);
}

const isoToMySQLDatetime = (isoString: string): string => {
  const date = new Date(isoString);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
         `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}
// 使用者輸入後轉回 ISO 存進 props
watch([startDateInput, endDateInput], ([start, end]) => {
  const result = validateDateRange(start, end);
  if (!result.valid) {
    startError.value = result.message ?? "";
    endError.value = result.message ?? "";
  } else {
    startError.value = "";
    endError.value = "";
    props.prop_data.selectdata.start_date = isoToMySQLDatetime(start) ?? "";
    props.prop_data.selectdata.end_date = isoToMySQLDatetime(end) ?? "";
  }
});

const senddata =async() =>{
    try{
        if(props.prop_data.mode == 'add'){
            const res =await addActivity(props.prop_data.selectdata);
            if(res.status == 200){
                text.value = '新增成功!';
                snackbar.value = true;
                props.prop_data.selectdata = emptydata;
                localVisible.value =false;
            }else{
                text.value = '新增失敗!';
                snackbar.value = true;
            }
        }else{
            const res =await updateActivity(props.prop_data.selectdata);
            if(res.status == 200){
                text.value = '更新成功!';
                snackbar.value = true;
                props.prop_data.selectdata = emptydata;
                router.go(0);
                localVisible.value =false;
            }else{
                text.value = '更新失敗!';
                snackbar.value = true;
            }
        }
    }catch(err){
        console.log(err);
    }
}

</script>

<template>
  <v-dialog
    v-model="localVisible"
    persistent
    max-width="800"
    class="text-3 sm-text-4"
  >
    <v-card class="py-2">
      <v-card-title class="flex items-center font-1000 ml-4">
        <div v-show="data.id == 0">新增活動</div>
        <div v-show="data.id !== 0">編輯活動</div>
        <v-spacer />
        <v-btn variant="text" icon @click="localVisible = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="text-3 sm-text-4">
        <v-text-field
          v-model="prop_data.selectdata.name"
          color="#E6AE4F"
          label="名稱"
          required
          variant="outlined"
        ></v-text-field>
        <v-text-field
          v-model="prop_data.selectdata.description"
          color="#E6AE4F"
          label="內容"
          required
          variant="outlined"
        ></v-text-field>
        <v-text-field
          v-model="startDateInput"
          color="#E6AE4F"
          label="起始時間"
          required
          variant="outlined"
          :error-messages="startError"
          class="mb-2"
        />

        <v-text-field
          v-model="endDateInput"
          color="#E6AE4F"
          label="結束時間"
          required
          variant="outlined"
          :error-messages="endError"
          class="mb-2"
        />
        <v-text-field
          v-model="prop_data.selectdata.coverage"
          color="#E6AE4F"
          label="活動範圍"
          required
          variant="outlined"
        ></v-text-field>
      </v-card-text>
      <v-card-actions class="mx-4">
        <v-btn variant="outlined" @click="localVisible = false">取消</v-btn>
        <v-btn variant="outlined" @click="senddata()">確認</v-btn>
      </v-card-actions>
    </v-card>
    <v-snackbar
      v-model="snackbar"
      timeout="2000"
    >
      {{ text }}

      <template v-slot:actions>
        <v-btn
          color="blue"
          variant="text"
          @click="snackbar = false"
        >
          X
        </v-btn>
      </template>
    </v-snackbar>
  </v-dialog>
</template>

<style scoped></style>

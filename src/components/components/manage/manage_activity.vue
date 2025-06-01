<script setup lang="ts">
import {getAllActivity,deleteActivity} from'@/api/acivity';
import EditDialog from '@/components/components/manage/edit_activity.vue'
import { ref, watch } from 'vue';
interface activity{
  id :number;
  name : string; 
  description:string;
  start_date:string;
  end_date:string;
  coverage:string;
}
const notice = ref(0);
const data = ref<activity[]>();
const deletedialog = ref(false);
const updatedialog = ref(false);
const emptydata:activity = {
        id :0,
        name : '',
        description:'',
        start_date:'',
        end_date:'',
        coverage:''
};
const selectdata = ref<activity>(emptydata); 
const selectedid =ref(0);
const needF5 = ref(false);
const mode = ref('add');
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')} 
    ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};


const getdata=async()=>{
    try{
        const res =await getAllActivity()
        if(res.status == 200){
            data.value = res.data;
        }
        else{
            console.log("fail to fetch activities")
        }
    }
    catch(err)
    {
        console.log(err);
    }
}

const Addactivity = () =>{
    mode.value ='add';
    selectdata.value = emptydata;
    updatedialog.value = true;
    console.log(updatedialog.value);
}

const EditActivity = (data:activity)=>{
    mode.value='edit';
    selectdata.value = data;
    updatedialog.value = true;
}

const DeleteDialog =(id:number)=>{
    selectedid.value = id;
    deletedialog.value = true;
}

const DeleteActivity = async()=>{
    try{
        const res = await deleteActivity(selectedid.value);
        if(res.status == 200){
            notice.value = 1;
            deletedialog.value = false;
            selectedid.value = 0;
            getdata();
        }else{
            notice.value = 2;
            deletedialog.value = false;
            selectedid.value = 0;
        }
    }catch(err){
        notice.value = 2;
        deletedialog.value = false;
        selectedid.value = 0;
        console.log(err)
    }
}

//dialog關閉後重撈資料
watch(updatedialog, (val) => {
  if (val) {
    needF5.value = true;
  } else {
    if (needF5.value) {
      getdata();
      needF5.value = false;
    }
  }
});

getdata()
</script>

<template>
    <v-container>
    <div class="flex my-2"> 
        <v-spacer></v-spacer>
        
        <h3>  活動清單  </h3>
        <v-spacer></v-spacer>
        <v-btn variant="flat" color="#DBA74C" class="text-white font-800" @click="Addactivity()">
            +
        </v-btn>
        
    </div>
    <v-list v-for=" i in data" class="mb-2 border-1px border-solid border-black/10 h-[120px]">
        <v-row class="w-100% sm-h-[100px]  h-max">
            <v-col cols="4" sm="1">
                {{i.id}}
            </v-col>
            <v-col cols="6" sm="2" class="font-800">
                {{i.name}}
            </v-col>
            <v-col cols="10" sm="3" class="mx-a items-start">
                {{i.description}}
            </v-col>
            <v-col class="text-[14px] mx-a" cols="6" sm="3">
                {{formatDate(i.start_date)}} ~<br/>
                 {{formatDate(i.end_date)}}
            </v-col>
            <v-col cols="4" sm="1">
                {{i.coverage}}
            </v-col>
            <v-col cols="12" sm="2" class="mx-a">
                <v-btn variant="text" icon="mdi-pencil-outline" @click="EditActivity(i)"></v-btn>
                <v-btn variant="text" icon="mdi-delete-outline" @click="DeleteDialog(i.id)"></v-btn>
            </v-col>
        </v-row>
    </v-list>
    <v-dialog
      v-model="deletedialog"
      width="auto"
    >
      <v-card
        class="sm-min-w-[300px]"
        prepend-icon="mdi-check-circle-outline"
        text="確認要刪除這筆活動嗎?"
        title=" 刪除確認"
      >
        <template v-slot:actions>
          <v-spacer></v-spacer>
          <v-btn
            class="ms-auto"
            text="取消"
            @click="deletedialog = false"
          ></v-btn>
          <v-btn
            class="ms-auto"
            text="確認"
            @click="DeleteActivity()"
          ></v-btn>
        </template>
      </v-card>
    </v-dialog>
    <EditDialog v-if="updatedialog" :prop_data="{selectdata,mode}"  v-model:visible="updatedialog"  />
    </v-container>
</template>

<style scoped>
</style>
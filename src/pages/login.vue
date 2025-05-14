<script setup lang="ts">
import { ref, watch } from "vue";
import { loginUser, registerUser, vertifyRegister } from "../api/auth";
import { useStateStore, useUserStore } from '../stores/index'
import router from "@/router";
const userStore = useUserStore();
const stateStore = useStateStore();
interface RegisterPayload {
  account_name: string;
  username: string;
  email: string;
  password: string;
  phone: string;
}
const re = ref(false);
const login_err =ref(false);
const login_suc =ref(false);
const res_data = ref({
  Name: "",
  Account: "",
  Email: "",
  Password: "",
  phone : ""
});
const data = ref({
  Account: "",
  Password: "",
});
const val =  ref({
  email:'',
  phone : ''
});
const val_res_color =ref({
  email: 0,
  phone: 0
})
const terms = ref(false);

const props = defineProps<{
  visible: boolean
}>()

const dialogVisible = ref(props.visible)
const step =ref(1);
watch(() => props.visible, (val) => {
  dialogVisible.value = val
})
watch(dialogVisible, (val) => {
  emit('update:visible', val)
})

const emit = defineEmits(['update:visible'])
const login = async () => {
  try {
    const res = await loginUser({
      account_name: data.value.Account,
      password: data.value.Password,
    });
    console.log(res.data);
    const token = res.data.data.token;
    
    userStore.setUser({
      id: res.data.data.userId,
      username: res.data.data.username,
      email:res.data.data.email,
      role: res.data.data.role,
      phone:res.data.data.phone,
      token: token, 
      favorites:res.data.data.favorites,
      carts:res.data.data.carts
    });
    console.log("login successful!!")
    login_suc.value = true;
    stateStore.justlogin = true;
    router.push("/rebuild");
  } catch (err) {
    login_err.value = true;
    console.log("Fail login!!");
  }
};

const resgister = async()=>{
  try{
    const body:RegisterPayload ={
      account_name: res_data.value.Account,
      username:res_data.value.Name ,
      email: res_data.value.Email,
      password: res_data.value.Password,
      phone:res_data.value.phone,
    }
    const res =await registerUser(body)
    if(res.status == 200){
      data.value.Account = res_data.value.Account;
      data.value.Password =res_data.value.Password;
      login();
    }

  }catch(err){
    console.log(err);
  }
}
const vertify =async()=>{
  try{
    const body ={
      val_email : val.value.email,
      val_phone : val.value.phone
    }
    const res = await vertifyRegister(body)
    if(res.status ==200){
      const val_res =res.data;
      if(val_res.email_res == true ){
        val_res_color.value.email = 1;
      }else{
        val_res_color.value.email =2;
      }
      if(val_res.phone_res == true ){
        val_res_color.value.phone = 1;
      }else{
        val_res_color.value.phone =2;
      }
      if(val_res_color.value.email == 1 && val_res_color.value.phone == 1){
        resgister();
      }
    }
  }catch(err){
    console.log(err);
  }
}
const color_change =(data: any)=>{
  switch (data){
    case 0 :
      return '';
    case 1 :
      return '驗證成功';
    case 2 :
      return '驗證失敗';
  }
  
}

</script>

<template>
 
  <v-dialog v-model="dialogVisible" persistent class="sm-w-[30vw] w-[50vw] sm-m-a m-0">
     <v-alert type="error" variant="tonal" closable
        position="fixed"
        max-width="500"
        location="top center"
        class="z-100 mt-100px"
        v-if="login_err == true"
        icon="mdi-alert-circle-outline"
        text=" 登入失敗 QAQ"
        @click:close="login_err = !login_err"
      ></v-alert>
      <v-alert type="success" variant="tonal" closable
        position="fixed"
        max-width="500"
        location="top center"
        class="z-100 mt-100px"
        v-if="login_suc == true"
        icon="mdi-check-circle-outline"
        text=" 登入成功!!"
        @click:close="login_suc = !login_suc"
      ></v-alert>
    <v-card class="mx-auto w-[20vw] min-w-[300px]" v-if="!re">
      <v-card-title class="flex items-center font-1000 ml-4">
        登入
        <v-spacer />
        <v-btn variant="text" icon @click="dialogVisible = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-container>
        <v-text-field
          v-model="data.Account"
          color="primary"
          label="帳號"
          variant="underlined"
          class="px-2"
        ></v-text-field>

        <v-text-field
          v-model="data.Password"
          color="primary"
          label="密碼"
          variant="underlined"
          class="px-2"
        ></v-text-field>
        <div class="flex content-center gap-2 py-4 px-2">
          <v-spacer></v-spacer>
            <v-btn variant="outlined" @click="login"> 登入 </v-btn>
            <v-btn variant="text" @click="re = !re" > 註冊 </v-btn>
        </div>
        
      </v-container>
    </v-card>

    <v-card class="mx-auto px-4 py-2 w-[30vw] min-w-[300px] min-w-[330px]" v-if="re">
      
      <v-card-title class="flex items-center font-1000 ml-4">
        帳號註冊
        <v-spacer />
        <v-btn variant="text" icon @click="dialogVisible = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-container v-show="step == 1">
        <v-text-field
          v-model="res_data.Name"
          color="primary"
          label="姓名"
          variant="underlined"
        ></v-text-field>

        <v-text-field
          v-model="res_data.Account"
          color="primary"
          label="帳號"
          variant="underlined"
        ></v-text-field>

        <v-text-field
          v-model="res_data.Password"
          color="primary"
          label="密碼"
          variant="underlined"
        ></v-text-field>

        <v-text-field
          v-model="res_data.Email"
          color="primary"
          label="Email"
          variant="underlined"
        ></v-text-field>

        <v-text-field
          v-model="res_data.phone"
          color="primary"
          label="電話"
          variant="underlined"
        ></v-text-field>
        

        <v-checkbox
          v-model="terms"
          color="secondary"
          label="我同意使用者規範..."
        ></v-checkbox>
      </v-container>

      <v-container v-show="step == 2">
        <div>
          email驗證碼
        </div>
        <v-text-field
          v-model="val.email"
          :hint="color_change(val_res_color.email)"
          variant="outlined"
          persistent-hint
        >
        
      </v-text-field>
      <div class="flex">
        <v-spacer></v-spacer>
        <v-btn variant="outlined" class="text-3 p-1 ml-a">再次發送</v-btn>
      </div>
      
        <div>
          手機驗證碼
        </div>
        <v-text-field
          v-model="val.phone"
          :hint="color_change(val_res_color.phone)"
          variant="outlined"
          persistent-hint
        ></v-text-field>
        <div class="flex">
        <v-spacer></v-spacer>
        <v-btn variant="outlined" class="text-3 p-1 ml-a">再次發送</v-btn>
        </div>
      </v-container>

      <v-divider></v-divider>

      <v-card-actions>
        <v-btn prepend-icon="mdi-chevron-left" v-show="step == 1" @click="re = !re">登入</v-btn>
        <v-btn color="success" v-show="step == 2" @click="step = step -1">
          <v-icon icon="mdi-chevron-left" class="pr-4" end></v-icon>
          上一步
        </v-btn>
        <v-spacer></v-spacer>

        <v-btn color="success" v-show="step == 1" @click="step = step + 1">
          下一步
          <v-icon icon="mdi-chevron-right" end></v-icon>
        </v-btn>
        <v-btn color="success" v-show="step == 2" @click="vertify()">
          驗證
          <v-icon icon="mdi-chevron-right" end></v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped></style>

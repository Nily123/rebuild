<script setup lang="ts">
import { ref } from "vue";
import { loginUser } from "../api/auth";
import { useStateStore, useUserStore } from '../stores/index'
import router from "@/router";
const userStore = useUserStore();
const stateStore = useStateStore();

const re = ref(false);
const login_err =ref(false);
const login_suc =ref(false);
const res_data = ref({
  Name: "",
  Account: "",
  Email: "",
  Password: "",
});
const data = ref({
  Account: "",
  Password: "",
});
const terms = ref(false);

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
      token: token, 
      favorites:res.data.data.favorites,
      carts:res.data.data.carts
    });
    console.log("login successful!!")
    login_suc.value = true;
    stateStore.justlogin = true;
    router.push("/");
  } catch (err) {
    login_err.value = true;
    console.log("Fail login!!");
  }
};
</script>

<template>
 
  <v-container>
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
    <v-card class="mx-auto" max-width="344" title="使用者登入" v-if="!re">
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
        <v-row class=" content-center  py-4 px-2">
          <v-col cols="3">
          </v-col>
          <v-col cols="6">
            <v-btn variant="outlined" @click="login"> 登入 </v-btn>
          </v-col>
          <v-col cols="3">
            <v-btn variant="text" @click="re = !re" > 註冊 </v-btn>
          </v-col>
        </v-row>
        
      </v-container>
    </v-card>

    <v-card class="mx-auto px-4 py-2" max-width="344" title="帳號註冊" v-if="re">
      <v-container>
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
          v-model="res_data.Email"
          color="primary"
          label="Email"
          variant="underlined"
        ></v-text-field>

        <v-text-field
          v-model="res_data.Password"
          color="primary"
          label="密碼"
          placeholder="Enter your password"
          variant="underlined"
        ></v-text-field>

        <v-checkbox
          v-model="terms"
          color="secondary"
          label="我同意使用者規範..."
        ></v-checkbox>
      </v-container>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="success">
          Complete Registration

          <v-icon icon="mdi-chevron-right" end></v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<style scoped></style>

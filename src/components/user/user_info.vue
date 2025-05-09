<script setup lang="ts">
import { useUserStore } from "@/stores";
import { ref } from "vue";
import { getUserInfo, updateUserInfo } from "@/api/auth";

const store = useUserStore();
const form = ref();
const name = ref(store.user?.username);
const email = ref(store.user?.email);

const passwordDialog = ref(false);
const newPassword = ref("");
const confirmPassword = ref("");

const nameRules = [
  (v: any) => !!v || "名稱必填",
  (v: string | any[]) => (v && v.length <= 15) || "名稱長度限制15字",
];

const emailRules = [
  (v: any) => !!v || "Email 必填",
  (v: string) => /.+@.+\..+/.test(v) || "Email 格式錯誤",
];

const validate = async () => {
  if (!form.value) return;

  const { valid } = await form.value.validate();

  if (!valid) return;

  try {
    if ((store.user && name.value && email.value) || newPassword.value) {
      const res = await updateUserInfo({
        id: store.user?.id,
        username: name.value,
        email: email.value,
        password: newPassword.value || undefined,
      });
      if(res.status == 200){
        alert("更新成功！");
        passwordDialog.value = false;
        newPassword.value = "";
        confirmPassword.value = "";
      }else{
        alert("更新失敗!");
        newPassword.value = "";
        confirmPassword.value = "";
      }
      

      // 重新更新 store 的 user
      if (store.user?.id) {
        const store_user = await getUserInfo(store.user?.id);
        if (store_user.status == 200) {
          store.setUser(store_user.data);
        }
      }
    }
  } catch (error) {
    console.error(error);
    alert("更新失敗");
  }
};

const openPasswordDialog = () => {
  newPassword.value = "";
  confirmPassword.value = "";
  passwordDialog.value = true;
};

const savePassword = () => {
  if (newPassword.value !== confirmPassword.value) {
    alert("兩次密碼輸入不一致");
    return;
  }
  passwordDialog.value = false;
};
</script>

<template>
  <v-container class="">
    <v-card class="m-a sm-p-4 p-4 w-[280px] sm-w-[40vw] max-w-[330px]">
      <v-sheet class="mx-auto w-[250px] sm-min-w-[300px]">
        <v-form ref="form">
          <v-text-field
            v-model="name"
            :counter="15"
            :rules="nameRules"
            color="#E6AE4F"
            label="名稱"
            required
            variant="outlined"
          ></v-text-field>

          <v-text-field
            v-model="email"
            color="#E6AE4F"
            :rules="emailRules"
            label="Email"
            required
            variant="outlined"
          ></v-text-field>

          <div class="d-flex flex-column">
            <v-btn
              variant="outlined"
              class="mt-4 font-800 "
              color="#E6AE4F"
              block
              @click="openPasswordDialog"
            >
              變更密碼
            </v-btn>
            <v-btn class="mt-4 font-800 bg-[#E6AE4F] text-white" block @click="validate">
              保存修改
            </v-btn>
          </div>
        </v-form>
      </v-sheet>
    </v-card>

    <!-- 密碼 Dialog -->
    <v-dialog v-model="passwordDialog" max-width="400px">
      <v-card class="py-2">
        <v-card-title class="items-center text-center font-800">修改密碼</v-card-title>
        <v-card-text class="py-4">
          <v-text-field
            v-model="newPassword"
            label="新密碼"
            type="password"
            required
            variant="outlined"
          />
          <v-text-field
            v-model="confirmPassword"
            label="確認新密碼"
            type="password"
            required
            variant="outlined"
          />
        </v-card-text>
        <v-card-actions class="px-6">
          <v-spacer />
          <v-btn class=" font-800" variant="outlined" @click="passwordDialog = false">取消</v-btn>
          <v-btn class=" font-800" variant="outlined" color="primary" @click="savePassword">儲存</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped></style>

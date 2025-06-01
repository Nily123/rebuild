<script setup lang="ts">
import { getAllUser } from "@/api/auth";
import { ref } from "vue";
interface user {
  id: number;
  username: string;
  email: string;
  password: string;
  created_at: string;
  account_name: string;
  login_fail_count: number;
  last_login_fail_time: null | string;
  account_locked_until: null | string;
  phone: string;
  user_id: number;
  role_id: number;
  role_name: string;
  permissions: null;
}
const data = ref<user[]>();
const search = ref('')
const headers = [
    {
      key: 'username',
      title: '使用者名稱',
    },
    { key: 'account_name', title: '帳號名稱' },
    { key: 'email', title: 'E-mail' },
    { key: 'phone', title: '電話' },
    { key: 'role_name', title: '帳號類型' },
    { key: 'created_at', title: '創建時間' },
    { key: 'action_but', title: '重設密碼' },
    { key: 'action_but2', title: '其他操作' },
  ];
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return `${date.getFullYear()}/${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")} 
    ${date.getHours().toString().padStart(2, "0")}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
};

const getdata = async () => {
  try {
    const res = await getAllUser();
    if (res.status == 200) {
      data.value = res.data;
    }
  } catch (err) {
    console.log(err);
  }
};
getdata();
</script>

<template>
  <v-container>
    <div class="flex my-2">
      <v-spacer></v-spacer>

      <h3>用戶清單</h3>
      <v-spacer></v-spacer>
      <v-btn variant="flat" color="#DBA74C" class="text-white font-800">
        +
      </v-btn>
    </div>

    <v-text-field
        v-model="search"
        label="Search"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        hide-details
        single-line
      ></v-text-field>

      <v-data-table
      :headers="headers"
      :filter-keys="['username']"
      :items="data"
      v-model:search="search"
      class="bg-white/50 t0"
    >
      <template v-slot:item.created_at="{ item }">
        {{ formatDate(item.created_at) }}
      </template>
      <template v-slot:item.action_but>
        <v-btn variant="text" icon="mdi-restart"></v-btn>
      </template>
      <template v-slot:item.action_but2>
        <v-btn variant="text" icon="mdi-dots-horizontal-circle-outline"></v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>

<style scoped>
th{
    font-weight: 800 !important;
}
</style>

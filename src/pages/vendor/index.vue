<script setup lang="ts">
import { getvendor,getvendor_name } from '@/api/vendor';
import vendor_card from '@/components/components/vendor_card.vue';
import { ref } from 'vue';
interface vendor{
    id: number,
    name: string,
    website: string,
    description: string,
    sub_title: string,
    img_icon: string,
    img_pic: string
    slug:string;
}
const vendor_data = ref<vendor[]>();
const vendor_id_name =ref <string[]>();
const get_vendor = async () =>{
    try{
        const res = await getvendor();
        if(res.status == 200){
            vendor_data.value = res.data; 
        }
    }catch(err){
        console.log(err);
    }
}
const get_vendorname = async()=>{
    try{
        const res = await getvendor_name();
        if(res.status ==200){
            vendor_id_name.value =res.data;
        }
    }catch(err){
        console.log(err);
    }
}

const init = () =>{
    get_vendor();
    get_vendorname();
}
init();
</script>

<template>
<v-container class="w-[80%] ">
    <div>
        <v-input></v-input>
    </div>
<v-row >
    <v-col col="4" v-for="i in vendor_data">
        <vendor_card :prop_data="i"></vendor_card>
    </v-col>
    
</v-row>
</v-container>
</template>

<style scoped>
</style>
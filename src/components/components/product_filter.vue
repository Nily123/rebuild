<script setup lang="ts">
import { ref, watch } from 'vue';
import {getAllproduct_name} from '@/api/product';
const emit = defineEmits<{
  (e: 'update-filters', payload: { names: string[], notes: string[],selected:number }): void
}>();
const all_name = ref<string[]>([]);
const filter_name= ref<string[]>([]);
const flavor = ref([]);
const options = [
    {
        label:'木質調',
        value:'木質'
    },{
        label:'花香調',
        value:'花香'
    },
    {
        label:'麝香調',
        value:'麝香'
    },{
        label:'柑橘調',
        value:'柑橘'
    },{
        label:'皮革調',
        value:'皮革'
    },{
        label:'清新調',
        value:'清新'
    },{
        label:'東方調',
        value:'東方'
    },
]
const init =async() =>{
    try{
        const res= await getAllproduct_name();
        if(res.status == 200){
            all_name.value =res.data;
        }
    }
    catch(err){
        console.log(err)
    }
    
}
const op = ref(0);
watch([filter_name, flavor], () => {
    if(filter_name.value.length !==0 && flavor.value.length ==0){
        op.value = 1;
    }else if(filter_name.value.length ==0 && flavor.value.length !==0){
        op.value = 2;
    }else if(filter_name.value.length !==0 && flavor.value.length !==0){
        op.value = 3;
    }else{
        op.value = 0;
    }
  emit('update-filters', {
    names: filter_name.value,
    notes: flavor.value,
    selected: op.value
  });
});
init();
</script>

<template>
    <div class="sm-pl-4 border-l-solid border-l-2px border-[#EDC17B] sm-text-[16px] text-[10px]">
        <v-autocomplete
          variant="underlined"
          class="ml-2 sm-ml-0 w-[80px] sm-w-[15vw] sm-max-w-[200px] text-[8px]"
          clearable
          chips
          label="商品名稱搜尋"
          v-model="filter_name"
          :items="all_name"
          multiple
        >
        </v-autocomplete>
        <v-checkbox
        color="#EDC17B"
        class="-py-2 sm-text-[16px] text-[10px] h-[50px]"
          v-for="i in options"
          v-model="flavor"
          :label="i.label"
          :value="i.value"
        ></v-checkbox>
    </div>
</template>

<style scoped>
</style>
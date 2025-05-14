<script setup lang="ts">
import { ref } from "vue";
import { postExplore } from "@/api/product";
import product_card from "@/components/components/product_card.vue";
interface qus {
  question: string;
  options: {
    label: string;
    next: {
      question: string;
      options: {
        label: string;
        next: {
          question: string;
          options: {
            label: string;
            result: string[];
          }[];
        };
      }[];
    };
  }[];
}
interface product_info {
  id: number;
  product_id: number;
  special_code: string;
  special_code0: string;
  image_url: string;
  sequence: number;
  product_name: string;
  description: string;
  ingredients: {
    前調: string[];
    中調: string[];
    後調: string[];
    香調: string[];
  };
  vendor_name: string;
  variant_prices:{
    price:number;
    capacity:string;
  }[];
}

const qus0: qus = {
  question: "月光鋪灑在靜謐小徑，你拾起一段微光，打開記憶的盒子。裡頭是：",
  options: [
    {
      label: "一段花開不語的往昔",
      next: {
        question: "你追溯那花香，落腳在何處？",
        options: [
          {
            label: "蒸氣裊裊的溫室",
            next: {
              question: "你推開霧氣，看見了什麼？",
              options: [
                { label: "玻璃後盛放的白花", result: ["FM-CF", "AE-UON"] },
                {
                  label: "一隻正在打盹的玫瑰",
                  result: ["P-CDR", "LL-RO31", "JM-TR"],
                },
                { label: "遺落的花瓣信件", result: ["FM-EP", "AE-MA"] },
              ],
            },
          },
          {
            label: "午後陽光穿透樹影",
            next: {
              question: "空氣中浮動的氣味是？",
              options: [
                { label: "花園深處的茶香", result: ["LL-MA26", "LL-NO29"] },
                { label: "蜜意中帶點草本", result: ["AE-WU", "JM-MM"] },
                { label: "果實掉落後的溫熱", result: ["JM-OB", "AE-CU"] },
              ],
            },
          },
        ],
      },
    },
    {
      label: "一串未寄出的遠方明信片",
      next: {
        question: "信上記錄了哪段旅程？",
        options: [
          {
            label: "赤道邊的辛香之路",
            next: {
              question: "你的腳步踏在什麼之上？",
              options: [
                { label: "紅泥路與風乾的辛香", result: ["FM-MR", "ADP-CC"] },
                { label: "神殿階梯殘留的香脂", result: ["P-A", "P-TT"] },
                { label: "市集裡飄出的皮革氣息", result: ["JM-FA", "LL-SA33"] },
              ],
            },
          },
          {
            label: "冬日山嶺上的霧與光",
            next: {
              question: "哪段記憶在此凝結？",
              options: [
                { label: "木屋中的煙火與焚香", result: ["ADP-ST", "LL-AN13"] },
                { label: "凍雪下的甜意焦糖", result: ["FM-LD", "P-CC"] },
                { label: "一雙靜靜對望的眼眸", result: ["FM-FL", "JM-SC"] },
              ],
            },
          },
        ],
      },
    },
    {
      label: "一本泛黃的筆記本，封面寫著「你是誰？」",
      next: {
        question: "你打開第一頁，看到的文字是？",
        options: [
          {
            label: "『我，是風。』",
            next: {
              question: "風把你帶往何方？",
              options: [
                {
                  label: "地中海海岸的柑橘園",
                  result: ["ADP-LC", "ADP-KP", "ADP-KL"],
                },
                { label: "無花果與雨交織的午後", result: ["AE-WAI", "ADP-CA"] },
                {
                  label: "高原上的香根草與泥土",
                  result: ["LL-LA31", "LL-RO31"],
                },
              ],
            },
          },
          {
            label: "『我，是獸。』",
            next: {
              question: "哪種野性正在你心中甦醒？",
              options: [
                { label: "公鹿般的優雅莊嚴", result: ["P-TLG", "P-RR"] },
                { label: "犀牛式的衝動與神秘", result: ["P-TT", "AE-MI"] },
                { label: "大象行走過的鳶尾塵香", result: ["P-MT", "AE-WAI"] },
              ],
            },
          },
        ],
      },
    },
  ],
};
const qus1: qus = {
  question: "你正走入一座神秘的香氣花園，你首先被哪股氣息吸引？",
  options: [
    {
      label: "晨光下的花朵正悄悄綻放",
      next: {
        question: "微風拂過，你會選擇停留在哪個角落？",
        options: [
          {
            label: "玫瑰圍繞的石徑小徑",
            next: {
              question: "玫瑰間藏著什麼讓你駐足？",
              options: [
                {
                  label: "幽微而溫柔的記憶",
                  result: ["JM-ET", "ADP-CC", "AE-UON"],
                },
                {
                  label: "遙遠星辰下的承諾",
                  result: ["JM-TR", "LL-MA26", "ADP-KP"],
                },
                { label: "一場未完的夢", result: ["LL-AN13", "ADP-CA"] },
              ],
            },
          },
          {
            label: "紫丁香搖曳的水池邊",
            next: {
              question: "池水倒映著哪段回憶？",
              options: [
                { label: "幽微而溫柔的記憶", result: ["JM-SC", "LL-SA33"] },
                { label: "遙遠星辰下的承諾", result: ["AE-MI", "JM-MM"] },
                { label: "一場未完的夢", result: ["LL-RO31", "FM-BC"] },
              ],
            },
          },
        ],
      },
    },
    {
      label: "柑橘果樹在陽光中閃耀",
      next: {
        question: "你穿過果園，心中浮現哪種感受？",
        options: [
          {
            label: "甘甜中透出一絲微苦",
            next: {
              question: "這微苦讓你想起什麼？",
              options: [
                { label: "幽微而溫柔的記憶", result: ["P-TLG", "AE-CU"] },
                { label: "遙遠星辰下的承諾", result: ["P-MT", "FM-LD"] },
                { label: "一場未完的夢", result: ["JM-OB", "FM-CF"] },
              ],
            },
          },
          {
            label: "清新爽朗，像一場夏日午後的雨",
            next: {
              question: "這場雨留下了什麼痕跡？",
              options: [
                { label: "幽微而溫柔的記憶", result: ["FM-MR", "P-CC"] },
                { label: "遙遠星辰下的承諾", result: ["P-TT", "ADP-LC"] },
                { label: "一場未完的夢", result: ["P-A", "FM-EP"] },
              ],
            },
          },
        ],
      },
    },
    {
      label: "焚香與皮革混合著曖昧的夜色",
      next: {
        question: "夜幕低垂，你被哪段旋律引領？",
        options: [
          {
            label: "低語般的煙草與木質調",
            next: {
              question: "那是誰的氣息縈繞不去？",
              options: [
                { label: "幽微而溫柔的記憶", result: ["AE-MA", "ADP-KL"] },
                { label: "遙遠星辰下的承諾", result: ["LL-LA31", "JM-MC"] },
                { label: "一場未完的夢", result: ["AE-WAI", "AE-WU"] },
              ],
            },
          },
          {
            label: "麝香與香草交織的呢喃",
            next: {
              question: "這呢喃在耳畔說了什麼？",
              options: [
                { label: "幽微而溫柔的記憶", result: ["P-CDR", "P-RR"] },
                { label: "遙遠星辰下的承諾", result: ["ADP-ST", "LL-NO29"] },
                { label: "一場未完的夢", result: ["FM-FL", "JM-FA"] },
              ],
            },
          },
        ],
      },
    },
  ],
};
const an0 = ref(0);
const an1 = ref(0);
const an2 = ref(0);
const step = ref(0);
const question = ref(qus0);
const qus_num =ref(0);
const data = ref<product_info[]>([]);
const final = ref(question.value.options[an0.value].next.options[an1.value].next.options[an2.value].result);

const card_back = () => {
  switch (step.value) {
    case 0:
      break;
    case 1:
      const back0 = color_q1();
      //return  {background: `radial-gradient(ellipse at center,white 60%,${back0} 120%)`};
      return {
        background: `linear-gradient(${back0} -40%, white 30%,white 70%, ${back0} 150%)`,
      };
    case 2:
      const back1 = color_q2();
      //return  {background: `radial-gradient(ellipse at center,white 60%,${back1} 120%)`};
      return {
        background: `linear-gradient(${back1} -40%, white 30%,white 70%, ${back1} 150%)`,
      };

    case 3:
      const back2 = color_q3();
      //return  {background: `radial-gradient(ellipse at center,white 60%,${back2} 120%)`};
      return {
        background: `linear-gradient(${back2} -40%, white 30%,white 70%, ${back2} 150%)`,
      };

    case 4:
      return {
        background: `linear-gradient(#F7C552 -40%, white 30%,white 70%, #F7C552 150%)`,
      };
  }
};

const color_q1 = () => {
  switch (an0.value) {
    case 0:
      return "#FF8484";
    case 1:
      return "#89D7EC";
    case 2:
      return "#ECBF6A";
  }
};
const color_q2 = () => {
  switch (an0.value) {
    case 0:
      switch (an1.value) {
        case 0:
          return "#F0C808";
        case 1:
          return "#469E2B";
      }
      break;
    case 1:
      switch (an1.value) {
        case 0:
          return "#CC8D50";
        case 1:
          return "#67AB9D";
      }
      break;
    case 2:
      switch (an1.value) {
        case 0:
          return "#7EE7F2";
        case 1:
          return "#754D37";
      }
      break;
  }
};
const color_q3 = () => {
    switch (an0.value) {
    case 0:
      switch (an1.value) {
        case 0:
        switch (an2.value) {
            case 0:
              return "#F3F3F3";
            case 1:
              return "#C98E94";
            case 2:
              return "#EAC7CE";
          };
          break;
        case 1:
        switch (an2.value) {
            case 0:
              return "#7A8260";
            case 1:
              return "#C2C18F";
            case 2:
              return "#E89563";
          };
          break;
      }
      break;
    case 1:
      switch (an1.value) {
        case 0:
        switch (an2.value) {
            case 0:
              return "#B85042";
            case 1:
              return "#A78A69";
            case 2:
              return "#4A2E1F";
          };
          break;
        case 1:
        switch (an2.value) {
            case 0:
              return "#6B4C3B";
            case 1:
              return "#D8C1B1";
            case 2:
              return "#A3B1C6";
          };
          break;
      }
      break;
    case 2:
      switch (an1.value) {
        case 0:
        switch (an2.value) {
            case 0:
              return "#F09535";
            case 1:
              return "#BF3575";
            case 2:
              return "#BDF064";
          };
          break;
        case 1:
        switch (an2.value) {
            case 0:
              return "#AB9040";
            case 1:
              return "#528AA1";
            case 2:
              return "#8A92F7";
          };
          break;
      }
      break;
  }
};

const getfinalans = async () => {
    final.value = question.value.options[an0.value].next.options[an1.value].next.options[an2.value].result  ;
  try {
    const body={
        special_code:final.value
    }
    const res = await postExplore(body);
    if(res.status == 200){
        data.value = res.data;
    }
    step.value = step.value + 1;
  } catch (err) {
    console.log("Exception:", err);
  }
};
const replay =() =>{
    step.value = 0;
}
const anplay =() =>{
    step.value = 0;
    if(qus_num.value == 0){
       question.value = qus1;
       qus_num.value = 1;  
    }else{
        question.value =qus0;
        qus_num.value = 0; 
    }
    
}
</script>

<template>
  <v-container class="w-[90vw] sm-w-[60vw] m-a">
    <v-card
      location="center"
      class="border-2px border-[#ECBD69]"
      :style="card_back()"
    >
      <div>
        <div
          v-show="step == 0"
          class="h-[300px] items-center text-center flex bg-[linear-gradient(45deg,#F1EFD2,white)]"
        >
          <div class="text-center m-a font-800 text-6 sm-p-0 px-4">
            準備好一起展開尋找香水的探索之旅了嗎
            <br />
            <v-btn
              class="mt-8 font-800"
              variant="outlined"
              color="#F0BD53"
              @click="step = step + 1"
              >開始</v-btn
            >
          </div>
        </div>
        <div
          class="my-4 h-[300px] items-center text-center flex mx-4"
          v-show="step == 1"
        >
          <div class="mx-a my-a">
            <h3>{{ question.question }}</h3>

            <v-radio-group v-model="an0" sub-title="1">
              <v-radio
                v-for="(i, index) in question.options"
                :label="i.label"
                :value="index"
              ></v-radio>
            </v-radio-group>
            <v-btn
              variant="flat"
              class="text-white font-800"
              :color="color_q1()"
              @click="step = step + 1"
              >繼續</v-btn
            >
          </div>
        </div>
        <div
          class="my-4 h-[300px] items-center text-center flex mx-4"
          v-show="step == 2"
        >
          <div class="mx-a my-a">
            <h3>{{ question.options[an0].next.question }}</h3>
            <v-radio-group v-model="an1" sub-title="1">
              <v-radio
                v-for="(i, index) in question.options[an0].next.options"
                :label="i.label"
                :value="index"
              ></v-radio>
            </v-radio-group>
            <v-btn
              variant="flat"
              class="text-white font-800"
              :color="color_q2()"
              @click="step = step + 1"
              >繼續</v-btn
            >
          </div>
        </div>
        <div
          class="my-4 h-[300px] items-center text-center flex mx-4"
          v-show="step == 3"
        >
          <div class="mx-a my-a">
            <h3>{{ question.options[an0].next.options[an1].next.question }}</h3>
            <v-radio-group v-model="an2" sub-title="1">
              <v-radio
                v-for="(i, index) in question.options[an0].next.options[an1].next
                  .options"
                :label="i.label"
                :value="index"
              ></v-radio>
            </v-radio-group>
            <v-btn
              variant="flat"
              class=" font-800"
              :color="color_q3()"
              @click="getfinalans()"
              >查看結果</v-btn
            >
          </div>
        </div>
        <div class="my-4 w-a min-h-[500px] items-center text-center flex mx-4" v-show="step == 4">
            <div class="mx-a my-a">
                <h3 class="mb-4">
                    以下是可能適合您的香水:
                </h3>
            
                <v-row height="400">
                    <v-col v-for="i in data">
                        <product_card :prop_data="i" ></product_card>
                    </v-col>
                </v-row>
                <div class="flex mt-4">
                    <v-spacer></v-spacer>
                <v-btn variant="flat" color="#EDBB65" class="text-white font-800" @click="replay()"> 再探索一次 </v-btn>
                <v-spacer></v-spacer>
                <v-btn variant="flat" color="#EDBB65" class="text-white font-800" @click="anplay()"> 從另一個故事出發 </v-btn>
                <v-spacer></v-spacer>
            </div>
            </div>
                
        </div>
      </div>
    </v-card>
  </v-container>
</template>

<style scoped></style>

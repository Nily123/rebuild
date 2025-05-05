import api from "./index";
const BASE_URL = '/favorites'

export const userfav = (userId: number) => {
    return api.get(`${BASE_URL}/${userId}`);
};

export const adduserfav = (data:{user_id : number, product_id: number}) =>{
    return api.post(`${BASE_URL}`,data);
};

export const deluserfav = (data:Object) =>{
    return api.post(`${BASE_URL}`,data);
};

export const getfavcard = (userId:number) =>{
    return api.get(`${BASE_URL}/product_card/${userId}`)
};
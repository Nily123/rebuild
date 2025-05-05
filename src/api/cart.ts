import api from "./index";
const BASE_URL = '/carts'
interface data{
  product_list:{
    special_code:string;
    number: number;
  }[];
  total :number;
  ship :string;
  ship_info :string;
  ship_cost :number;
  discount :number;
}
export const check =async(data:data)=>{
 return api.post(`${BASE_URL}/check`,data)
}

export const getCartByUserId = async (userId: number) => {
    return await api.get(`${BASE_URL}/${userId}`)
}

export const addItemToCart = async (payload: {
  user_id: number
  special_code: string
  quantity: number
}) => {
    return await api.post(`${BASE_URL}`, payload)
}

export const removeItemFromCart = async (payload: {
  user_id: number
  special_code: string
}) => {
    return api.delete(`${BASE_URL}`, { data: payload })
}


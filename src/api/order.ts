import api from "./index";
const BASE_URL = '/orders'
interface updaterange{
    ship_way:string,
    ship_info:string,
    ship_cost:number,
    discount:number,
    total_price:number,
    status:string
}
export const getorder = async() => {
    return api.get(`${BASE_URL}/`)
}

export const getAllorder = async() => {
    return api.get(`${BASE_URL}/all_orders`)
}

export const updateorder = async(id:number,data:updaterange) => {
    return api.put(`${BASE_URL}/${id}`,data)
}

export const deleteorder = async(id:number) => {
    return api.delete(`${BASE_URL}/${id}`)
}
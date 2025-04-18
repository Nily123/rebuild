import api from "./index";
const BASE_URL = '/carts'

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

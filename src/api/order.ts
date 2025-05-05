import api from "./index";
const BASE_URL = '/orders'

export const getorder = async() => {
    return api.get(`${BASE_URL}/`)
}
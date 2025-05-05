import api from "./index";
const BASE_URL = '/vendors'

export const getvendor = () => {
    return api.get(`${BASE_URL}/all`);
};

export const getvendor_name = () => {
    return api.get(`${BASE_URL}/vendor_name`);
};

export const getvendor_id =(id:number) =>{
    return api.get(`${BASE_URL}/${id}`)
};
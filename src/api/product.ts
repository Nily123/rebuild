import api from "./index";

export const getAllProducts = () => {
  return api.get("/products");
};

export const getAllproduct_name = () =>{
  return api.get("/products/product_name")
}

export const getProductBySC = (special_code: number | string) => {
  return api.get(`/products/${special_code}`);
};  

export const getAllProductsCard = () => {
  return api.get("/products/all_productcard");
};

export const getTOP5 = () => {
  return api.get("/products/top5");
};

export const getNEW5 = () => {
  return api.get("/products/new5");
};

export const postExplore = (data:{special_code:string[]}) =>{
  return api.post("/explores",data)
}
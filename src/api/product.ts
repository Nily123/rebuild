import api from "./index";

export const getAllProducts = () => {
  return api.get("/products");
};

export const getAllproduct_id = () =>{
  return api.get("/products/product_id")
}

export const getProductById = (id: number | string) => {
  return api.get(`/products/${id}`);
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
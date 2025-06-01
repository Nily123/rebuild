import api from "./index";
interface product_data {
  product: {
    id: number;
    name: string;
    vendor_id: number;
    special_code: string;
    description: string;
    ingredients: {
      前調: string[];
      中調: string[];
      後調: string[];
      香調: string[];
    };
    gender: string;
    is_active: boolean | number;
  };
  variants: {
    special_code: string;
    product_id: number;
    capacity: string;
    price: number;
  }[];
  product_images_common: {
    id: number;
    product_id: number;
    image_url: string;
    sequence: number;
  }[];
  product_images_variants: {
    special_code: string;
    images: {
      id: number;
      product_id: number;
      special_code: string;
      image_url: string;
      sequence: number;
    }[];
  }[];
}

export const getAllProducts = () => {
  return api.get("/products");
};

export const getAllproduct_name = () => {
  return api.get("/products/product_name");
};

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

export const postExplore = (data: { special_code: string[] }) => {
  return api.post("/explores", data);
};

export const postproductdata = (data:product_data) => {
  return api.post(`/products/full`, data);
};

export const postproductpics = (data:File) => {
  const formData = new FormData();
  formData.append("image", data); // 這裡的 "image" 要跟後端的 upload.single('image') 名稱一致

  return api.post("/products/upload-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

export const getManageproduct = (id: number) => {
  return api.get(`/products/${id}/full`);
};

export const updateManageproduct = (data:product_data) => {
  return api.put(`/products/${data.product.id}/full`);
};

export const deleteManageproduct = (id: number) => {
  return api.delete(`/products/${id}/full`);
};

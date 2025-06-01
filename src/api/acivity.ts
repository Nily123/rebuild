import api from "./index";
const BASE_URL = '/activities'

interface activity{
  id :number;
  name : string; 
  description:string;
  start_date:string;
  end_date:string;
  coverage:string;
}

export const getAllActivity = () => {
  return api.get(`${BASE_URL}/`);
};

export const addActivity =(data:activity) =>{
  return api.post(`${BASE_URL}/`,data)
}

export const updateActivity = (data:activity) => {
  return api.put(`${BASE_URL}/${data.id}`,data);
};

export const deleteActivity = (id:number) => {
  return api.delete(`${BASE_URL}/${id}`);
};

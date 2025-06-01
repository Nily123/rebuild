import api from "./index";

interface LoginPayload {
  account_name: string;
  password: string;
}

interface RegisterPayload {
  account_name: string;
  username: string;
  email: string;
  password: string;
  phone: string;
}
interface updatepayload{
  id:number| undefined,
  username: string| undefined,
  email:string| undefined,
  password: string | undefined,
  phone : string | undefined
}
interface vertify{
  val_email: string;
  val_phone: string;
}

export const loginUser = (data: LoginPayload) => {
  return api.post("/users/login", data);
};

export const registerUser = (data: RegisterPayload) => {
  return api.post("/users/register", data);
};

export const vertifyRegister =(data:vertify)=>{
  return api.post("/users/vertify",data)
}

export const getUserInfo = (id:number) =>{
  return api.get(`/users/${id}`)
}

export const updateUserInfo = (data:updatepayload) => {
  return api.put("/users/update",data);
}

export const getAllUser = () =>{
  return api.get(`/users/all_user`)
}
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
  
}

export const loginUser = (data: LoginPayload) => {
  return api.post("/users/login", data);
};

export const registerUser = (data: RegisterPayload) => {
  return api.post("/users/register", data);
};

export const getUserInfo = (id:number) =>{
  return api.get(`/users/${id}`)
}

import api from "./index";
const BASE_URL = '/activities'

export const getAllActivity = () => {
  return api.get(`${BASE_URL}/`);
};

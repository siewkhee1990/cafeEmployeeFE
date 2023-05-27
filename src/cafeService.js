import { backendUrl } from "./constant.js";
import axios from "axios";

const CafeService = {
  getAllCafes: async () => {
    try {
      const result = await axios.get(`${backendUrl}/cafes`);
      return result;
    } catch (error) {
      return error.response;
    }
  },
  getAllCafesByLocation: (location) => {
    console.log(backendUrl);
    console.log(location);
  },
  createCafe: async (obj) => {
    try {
      const result = await axios.post(`${backendUrl}/cafes`, obj);
      return result;
    } catch (error) {
      return error.response;
    }
  },
  updateCafe: async (id, obj) => {
    try {
      const result = await axios.put(`${backendUrl}/cafes/${id}`, obj);
      return result;
    } catch (error) {
      return error.response;
    }
  },
  deleteCafe: async (id) => {
    try {
      const result = await axios.delete(`${backendUrl}/cafes/${id}`);
      return result;
    } catch (error) {
      return error.response;
    }
  },
};

export default CafeService;

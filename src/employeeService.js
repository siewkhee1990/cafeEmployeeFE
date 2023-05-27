import { backendUrl } from "./constant.js";
import axios from "axios";

const EmployeeService = {
  getAllEmployees: async () => {
    try {
      const result = await axios.get(`${backendUrl}/employees`);
      return result;
    } catch (error) {
      return error.response;
    }
  },
  getAllEmployeesByCafeId: async (id) => {
    try {
      const result = await axios.get(`${backendUrl}/employees?cafe=${id}`);
      return result;
    } catch (error) {
      return error.response;
    }
  },
  createEmployee: async (obj) => {
    try {
      const result = await axios.post(`${backendUrl}/employees`, obj);
      return result;
    } catch (error) {
      return error.response;
    }
  },
  updateEmployeeInfo: async (id, obj) => {
    try {
      const result = await axios.put(`${backendUrl}/employees/${id}`, obj);
      return result;
    } catch (error) {
      return error.response;
    }
  },
  deleteEmployee: async (id) => {
    try {
      const result = await axios.delete(`${backendUrl}/employees/${id}`);
      return result;
    } catch (error) {
      return error.response;
    }
  },
};

export default EmployeeService;

import { backendUrl } from "./constant.js";
import axios from "axios";

const EmploymentService = {
  removeEmployeeFromCafe: async (id) => {
    try {
      const result = await axios.get(
        `${backendUrl}/employments/terminate/${id}`
      );
      return result;
    } catch (error) {
      return error.response;
    }
  },
  assignEmployeeToCafe: async (empId, cafeId) => {
    try {
      const result = await axios.get(
        `${backendUrl}/employments/assign/${empId}/${cafeId}`
      );
      return result;
    } catch (error) {
      return error.response;
    }
  },
};

export default EmploymentService;

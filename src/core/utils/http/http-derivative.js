import axios from "axios";
import { DERIVATIVE_API } from "@/core/config/constant";

export default axios.create({
  baseURL: DERIVATIVE_API,
  headers: {
    "Content-type": "application/json",
  },
});

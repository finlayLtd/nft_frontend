import axios from "axios";
import { BASE_API } from "@/core/config/constant";

export default axios.create({
  baseURL: BASE_API,
  headers: {
    "Content-type": "application/json",
  },
});

import axios from "axios";

export default axios.create({
  baseURL: import.meta.env.VITE_APP_MORALIS_REST_API,
  headers: {
    "Content-type": "application/json",
    "X-API-Key": import.meta.env.VITE_APP_MORALIS_API_KEY
  }
});

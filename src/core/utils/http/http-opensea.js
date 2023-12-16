import axios from "axios";

export default axios.create({
    baseURL: import.meta.env.VITE_OPENSEA_URL,
    headers: {
        "Content-type": "application/json",
        "X-API-Key": import.meta.env.VITE_OPENSEA_API_KEY
    }
});

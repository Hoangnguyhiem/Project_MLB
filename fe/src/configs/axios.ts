import axios from 'axios'
// import dotenv from "dotenv";
// dotenv.config();

const instance = axios.create({

    // baseURL: import.meta.env.VITE_BASE_URL
    baseURL: "http://localhost:8080/api"
})
export default instance

// process.env.DB_URL

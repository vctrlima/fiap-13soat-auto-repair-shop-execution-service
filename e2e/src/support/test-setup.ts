import axios from "axios";

const baseURL = process.env.EXECUTION_SERVICE_URL || "http://localhost:3004";
axios.defaults.baseURL = baseURL;

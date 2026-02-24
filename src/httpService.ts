import axios from "axios";

export const baseURL =
  process.env.NODE_ENV === "production"
    ? "https://miniautotestcentral-be.onrender.com/api"
    : //
      "http://192.168.17.29:4000/api";

const httpService = axios.create({
  baseURL,
  withCredentials: true, // always send cookies
  timeout: 20_000,
  headers: {
    "Content-Type": "application/json",
  },
});

httpService.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      return { data: error.response.data, status: error.response.status };
    }

    return { data: "Cannot connect to the central server", status: 500 };
  },
);

export { httpService };

import axios from "axios";
const centralServerRoute = {
  dev: "http://192.168.16.219:4000/api/",
  prod: "https://policymeeting.jamb.gov.ng/api/",
};

const route =
  process.env.NODE_ENV === "development"
    ? centralServerRoute.dev
    : centralServerRoute.prod;

const httpService = axios.create({
  //   baseURL:
  //     "https://nmcn-thirdparty-api.azurewebsites.net/api/v1/Examination/submit-scores",
  baseURL: route,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
    "X-Client-ID": "client_e84a8631c5ad4ca3",
    "X-API-Key": "Nb0Mv1n2x1eyBrlAs9bAAJjYHHk5fekzRkCByeJ4FWA=",
    //adminid: loggedInAdmin ? loggedInAdmin._id : "",
  },
  withCredentials: true,
});

httpService.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // console.log(error);
    if (error.response) {
      return { data: error.response.data, status: error.response.status };
    }
    return { data: "Cannot establish connection", status: 500 };
  },
);

export { httpService };

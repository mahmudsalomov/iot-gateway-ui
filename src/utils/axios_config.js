import axios from "axios";
import {BASE_URL} from "./API_PATH";

const instance = axios.create();
instance.defaults.baseURL = BASE_URL
let token = localStorage.getItem("token")
const onRequestSuccess = (config) => {
    // if (token) {
    //     config.headers.Authorization = `Bearer ${token}`
    // }
    return config
}

const onRequestError = (config) => {
    return Promise.reject(config)
}

const onResponseSuccess = (config) => {
    return config
}

const onResponseError = (config) => {
    return Promise.reject(config)
}

instance.interceptors.request.use(onRequestSuccess, onRequestError)
instance.interceptors.response.use(onResponseSuccess, onResponseError)

export default instance
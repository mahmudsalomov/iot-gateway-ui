import axios from "axios";
import {ACCESS_TOKEN, BASE_URL, REFRESH_TOKEN} from "./API_PATH";

const instance = axios.create();
instance.defaults.baseURL = BASE_URL
let token = localStorage.getItem("token")
const onRequestSuccess = (config) => {
    // if (token) {
    //     config.headers.Authorization = `Bearer ${token}`
    // }
    if (config?.notRequireAuth) {
        delete config?.notRequireAuth
    } else {
        let token = localStorage.getItem(ACCESS_TOKEN)
        let refreshToken = localStorage.getItem(REFRESH_TOKEN)
        if (token) {
            config.headers.Authorization = 'Bearer ' + token
            if (config?.requireRefreshToken) {
                config.headers['refresh-token'] = refreshToken
                delete config?.requireRefreshToken
            }
        }
    }
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
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { Toast } from "vant";

type GetConfig = Omit<AxiosRequestConfig, 'params' | 'url' | 'method'>
type PostConfig = Omit<AxiosRequestConfig, 'url' | 'data' | 'method'>
type PatchConfig = Omit<AxiosRequestConfig, 'url' | 'data'>
type DeleteConfig = Omit<AxiosRequestConfig, 'params'>

export class Http {
    instance: AxiosInstance
    constructor(baseURL: string) {
        this.instance = axios.create({
            baseURL
        })
    }
    get<R = unknown>(url: string, query?: Record<string, JSONValue>, config?: GetConfig) {
        return this.instance.request<R>({ ...config, url: url, params: query, method: 'get' })
    }
    post<R = unknown>(url: string, data?: Record<string, JSONValue>, config?: PostConfig) {
        return this.instance.request<R>({ ...config, url, data, method: 'post' })
    }
    patch<R = unknown>(url: string, data?: Record<string, JSONValue>, config?: PatchConfig) {
        return this.instance.request<R>({ ...config, url, data, method: 'patch' })
    }
    delete<R = unknown>(url: string, query?: Record<string, string>, config?: DeleteConfig) {
        return this.instance.request<R>({ ...config, url: url, params: query, method: 'delete' })
    }
}

export const http = new Http(DEBUG ? '/api/v1' : 'http://8.134.183.52:3000/api/v1')

http.instance.interceptors.request.use(config => {
    const jwt = localStorage.getItem('jwt')
    if (jwt) {
        config.headers!.Authorization = `Bearer ${jwt}`
    }
    if (config?._autoLoading) {
        Toast.loading({
            message: 'Loading...',
            forbidClick: true,
            duration: 0
        });
    }
    return config
})

http.instance.interceptors.response.use((response) => {
    response.config?._autoLoading && Toast.clear()
    return response
}, (error) => {
    error?.response.config?._autoLoading && Toast.clear()
    throw error
})

http.instance.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            const axiosError = error as AxiosError
            if (axiosError.response?.status === 429) {
                Toast('Requests are too frequent')
            }
        }
        throw error
    }
)

if (DEBUG) {
    import("../mock/mock").then(({mockTagShow, mockItemCreate, mockSession, mockTagIndex, mockItemIndex, mockItemIndexBalance, mockItemSummary}) => {
        const mock = (response: AxiosResponse) => {
            return
            if (location.hostname !== 'localhost'
                && location.hostname !== '127.0.0.1') { return false }
            switch (response.config?._mock) {
                case 'tagIndex':
                    [response.status, response.data] = mockTagIndex(response.config)
                    return true
                case 'session':
                    [response.status, response.data] = mockSession(response.config)
                    return true
                case 'itemCreate':
                    [response.status, response.data] = mockItemCreate(response.config)
                    return true
                case 'getTag':
                    [response.status, response.data] = mockTagShow(response.config)
                    return true
                case 'editTag':
                    [response.status, response.data] = mockTagShow(response.config)
                    return true
                case 'itemIndex':
                    [response.status, response.data] = mockItemIndex(response.config)
                    return true
                case 'itemIndexBalance':
                    [response.status, response.data] = mockItemIndexBalance(response.config)
                    return true
                case 'itemSummary':
                    [response.status, response.data] = mockItemSummary(response.config)
                    return true
            }
            return false
        }
        http.instance.interceptors.response.use((response) => {
            mock(response)
            return response
        }, (error) => {
            mock(error.response)
            if (error.response.status >= 400) {
                throw error
            } else {
                return error.response
            }
        })
    })

}

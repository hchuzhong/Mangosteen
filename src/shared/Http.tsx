import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";

export class Http {
    instance: AxiosInstance
    
    constructor(baseURL: string) {
        this.instance = axios.create({baseURL})
    }
    // read<
    get<R = unknown>(url: string, query?: Record<string, string>, config?: Omit<AxiosRequestConfig, 'params' | 'url' | 'method'>) {
        return this.instance.request<R>({ ...config, url, params: query, method: 'get' })
    }
    // cerate
    post<R = unknown>(url: string, data?: Record<string, JSONValue>, config?: Omit<AxiosRequestConfig, 'params' | 'data' | 'method'>) {
        return this.instance.request<R>({ ...config, url, data, method: 'post' })
    }
    // update
    patch<R = unknown>(url: string, data?: Record<string, JSONValue>, config?: Omit<AxiosRequestConfig, 'params' | 'data' | 'method'>) {
        return this.instance.request<R>({ ...config, url, data, method: 'patch' })
    }
    // destroy
    delete<R = unknown>(url: string, query?: Record<string, string>, config?: Omit<AxiosRequestConfig, 'params' | 'url' | 'method'>) {
        return this.instance.request<R>({ ...config, url, params: query, method: 'delete' })
    }
}

export const http = new Http('/api/v1')

http.instance.interceptors.response.use(response => {
    return response
}, error => {
    if (error.response) {
        const axiosError = error as AxiosError
        if (axiosError.response?.status === 429) {
            alert('请求太频繁')
        }
    }
    throw error
})
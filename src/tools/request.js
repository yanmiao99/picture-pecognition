// 引入文件
import axios from "axios"

// 全局配置
const service = axios.create({
    timeout: 8000,
})

// 响应拦截
service.interceptors.response.use((res) => {
    if (res.status === 200) {
        return res.data // 返回数据正确
    } else {
        return Promise.reject(res.statusText)
    }
})

// request 方法
function request(options) {
    options.method = options.method || 'get'
    if (options.method.toLowerCase() === 'get') {
        options.params = options.data
    }
    return service(options)
}

// 使用对象的方式调用
['get', 'post', 'put', 'delete', 'patch'].forEach(item => {
    request[item] = (url, data, options) => {
        return request({
            url,
            data,
            method: item,
            ...options
        })
    }
})

export default request

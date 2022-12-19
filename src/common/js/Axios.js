import axios from 'axios'
import { Message } from 'element-ui'

export const Axios = axios.create({
  baseURL: process.env.BASE_API,
  timeout: 5000,
  // withCredentials: true, //带上 cookie
  headers:{
    'token':"xiaobai",
    'Content-Type':'application/json;charset=utf-8'
  }
})

Axios.interceptors.request.use(config => {
  //POST传参序列化
  if(config.method  === 'post'){
    // 数据序列化成表单
    // const formData = new FormData()
    // Object.keys(config.data).forEach(key => formData.append(key, config.data[key]))
    config.headers.post = {'Content-Type':'application/json;charset=utf-8'}
    // config.data = JSON.stringify(config.data)
  }

  return config
},error =>{
  alert("错误的传参", 'fail')
  return Promise.reject(error)
})


Axios.interceptors.response.use(res => {
  const { data } = res
  if(data.code == "K-000000") {
    return data.context;
  } else if (!data.code || data.code == 'K-000001') {
    // location.href = location.origin + '/#/login'
  // } else {
    Message.error(data.message)
    return Promise.reject(data.errMsg)
  }
},error => {
  Message.error('网络错误，请检查网络再试！')
  return Promise.reject(error)
})


export default {
  install(Vue) {
    Object.defineProperty(Vue.prototype, '$http', { value: Axios })
  }
}

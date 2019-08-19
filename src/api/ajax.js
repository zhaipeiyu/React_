/*
用来发ajax请求的函数模块
包装的就是axios ==> 向外暴露本质就是axios
*/ 

import axios from "axios"
import {message} from 'antd'
import qs from "qs"
//const qs = require('qs')
//！！！使用请求拦截器   在发送请求之前
axios.interceptors.request.use((config) => {
    //1.将post请求的data对象数据转换成urlencoded格式的字符串数据 ==>请求拦截器（后台不能处理json格式请求参数）       
    //3.统一处理请求异常，外部调用者不用再处理请求异常
    
    //判断数据的类型不能用typeof 有可能是null
    if (config.method.toUpperCase() === 'POST' && config.data instanceof Object){
        //config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
        //进来的话就将数据 json格式转化为urlencoded格式 
        config.data = qs.stringify(config.data)  //用它替换原本的对象 

    }

    return config
})


//！！！！使用响应拦截器
axios.interceptors.response.use(
    response => {//ajax请求成功了

       //2.请求成功得到的不是response,而是response.data 
        //因为响应想得到他里面的数据
      return response.data
    },
    error => { //ajax请求异常 
        message.error('请求失败' + error.message) //执行没有出异常
        //只有成功 还是失败 下面的.then才可以执行 但是这里是初始化状态 ==> 中断promise链
       return new Promise (() => {}) //返回一个初始状态的promise

    }

)


//  axios.post('/login',{username:'admin',password:'admin'})
//     .then(
//         //上面返回的是数据
//         data => { //data是响应体的数据，而不是响应对象

//         },
//         error => {
//             message('请求失败' + error.message)
//         }
//     )




//这样写会很多 所以要用 请求拦截器
//axios.post('/register','username=admin&password=admin')
//axios.post('/login','username=admin&password=admin')

export default axios


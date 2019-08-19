/*
包含n个接口函数的模块,每个函数的返回值都是promise对象
    根据接口文档去编写

*/
import jsonp from 'jsonp'
import ajax from "./ajax"

import { message } from 'antd';
// const BASE = 'http://localhost:5000'
const BASE = ''

/*
   1. 登录
*/
    //接口请求函数名
// export function reqLogin({username,password}){
//         //第一个参数是url 第二个参数是数据 对象
//         //是一个promise对象 可以return返回
//    return ajax.post('/login',{username,password})

// }
                                //=>匿名函数     //如果 => 后面加{ } 就不会自动返回必须手动return
export const reqLogin = ({username,password}) =>  ajax.post(BASE +'/login',{username,password})
//let a = () => ({name:'tom'}) //返回一个对象


/*
    2.添加用户
*/
//返回值依然是promise
export const reqAddUser = (user) => ajax({
    url:'http://localhost:5000/login',
    method:'POST',
    //这里数据有很多 所以要外面定义一个
    data: user

})

/*
    获取天气信息（jsonp）
*/
export const reqWeather = (city) => {
    const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
    //第一个参数是地址 第二个参数是配置对象 第三个是回调函数
    return new Promise((resolve,reject) => { //执行器函数

        jsonp(url, {}, (err, data) => { //这个函数需要返回一个promise
            if (!err && data.error === 0) {
                //图片的地址和天气的文本
               const {dayPictureUrl,weather} = data.results[0].weather_data[0]
                resolve({dayPictureUrl,weather})

            }else{
                message.error('获取天气信息失败')
            }

        })
    })
    
}

/*
    获取所有商品分类的列表
*/                             //这个ajax就是axios         //是get类型所以不用写第二个参数
//export const reqCategorys = () => ajax('/manage/category/list')

 export const reqCategorys = () => ajax.get('/manage/category/list')
// //当函数使用 要传一个配置对象
// export const reqCategorys = () => ajax({
//     method:'GET',
//     url:'/manage/category/list'
// })


/*
    添加分类
*/
export const reqAddCategory = (categoryName) => ajax.post('/manage/category/add', {
    categoryName
})


/*
    修改分类
*/
export const reqUpdateCategory = (categoryId, categoryName) => ajax.post('/manage/category/update', {
    categoryId, categoryName
})


/* 
获取商品分页列表
*/
export const reqProducts = (pageNum, pageSize) => ajax.get('/manage/product/list', {
    //params 直接再路径上写是params   ? query上写是
    params: { // 值是对象, 对象中包含的是query参数数据
        pageNum,
        pageSize
    }
})
// ajax({ url: '/manage/product/list', params: {pageNum, pageSize}})

/*
    根据Name / desc搜索产品分页列表 
*/

export const reqSeachProducts = ({
    pageNum, 
    pageSize,
    searchType, //搜索方式'productDesc' 或者 productName
    searchName //当前输入的内容
    }) => ajax({
    method:'GET',
    url: '/manage/product/search',
    //参数 get请求的params参数
    params:{
        pageNum,
        pageSize,
        [searchType]: searchName
    }
})


/*
对商品进行上架 / 下架处理
*/

export const reqUpdateProductStatus = (productId, status) => ajax({
    method:'POST',
    url: '/manage/product/updateStatus',
    //携带参数用data来携带
    data:{
        productId,
        status
    }
})

/*
根据商品ID获取商品
*/
export const reqProduct = (productId) => ajax({
    method: 'GET',
    url: '/manage/product/info',
    params:{
       productId
    }

})

/**
根据分类ID获取分类

 */
export const reqCategory = (categoryId) => ajax.get('/manage/category/info', {
    params:{
        categoryId
    }
   
})

/**
 * 
 * 删除图片
 */

 export const reqDeleteImg = (name) => ajax.post('/manage/img/delete', {
     name
 })

//添加或更新商品
export const reqAddUpdateProduct = (products) => ajax.post(
'/manage/product/' + (products._id ? 'update' : 'add'),
products
)


// 获取所有角色的列表
export const reqRoles = () => ajax(BASE + '/manage/role/list')
// 添加角色
export const reqAddRole = (roleName) => ajax.post(BASE + '/manage/role/add', {
    roleName
})
// 更新角色给角色授权
export const reqUpdateRole = (role) => ajax.post(BASE + '/manage/role/update', role)



// 获取所有用户的列表
export const reqUsers = () => ajax(BASE + '/manage/user/list')
// 删除指定用户
export const reqDeleteUser = (userId) => ajax.post(BASE + '/manage/user/delete', {userId})
// 添加/更新用户
export const reqAddOrUpdateUser = (user) => ajax.post(BASE + '/manage/user/'+(user._id ? 'update' : 'add'), user)




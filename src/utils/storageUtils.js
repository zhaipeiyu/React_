/*
操作local数据的工具函数模块
*/
import store from 'store'
const USER_KEY = 'user_key'

//保存user
//export const saverUser = (user) => localStorage.setItem('user_key',JSON.stringify(user))
export const saverUser = (user) => store.set(USER_KEY, user)

//读取user
//export const getUser = () => JSON.parse(localStorage.getItem('user_key') || '{}')
export const getUser = () => store.get(USER_KEY) || {}

/*
删除user
*/
export const removeUser = () => store.remove(USER_KEY)

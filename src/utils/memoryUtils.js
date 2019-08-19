import {getUser} from '../utils/storageUtils'
//const user = JSON.parse(localStorage.getItem('user_key') || '{}')
const user = getUser()
//这样的话只保存一次
export default {
    //从local读取user,保存在内存中
    user,
    products:{}, //要显示的商品
}
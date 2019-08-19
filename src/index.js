/*
    入口js
*/
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './utils/memoryUtils'

//从local读取user，保存在内存中 
//第一次有可能没有，没登录就没存
//const user = JSON.parse(localStorage.getItem('user_key') || '{}')
//const user = memoryUtils.user

ReactDOM.render(<App />, document.getElementById('root'));
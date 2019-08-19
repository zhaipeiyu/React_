import React, { Component } from 'react'

import {HashRouter,BrowserRouter,Route,Switch,Redirect} from 'react-router-dom'
import Admin from './pages/admin/admin.jsx';
import Login from './pages/login/login.jsx';
export default class App extends Component {
  

    render() {
        return (
            <BrowserRouter>
                <Switch>  {/* 从前往后匹配 ，逐级路由匹配 ，一但匹配成功停止向下匹配 ， 默认模糊匹配*/}
                    <Route path="/login" component={Login}/>
                    <Route path="/" component={Admin}/>   
                </Switch>
            </BrowserRouter>  

        )
    }
}

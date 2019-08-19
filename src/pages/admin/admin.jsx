import React, { Component } from 'react'
import {Redirect,Switch,Route} from 'react-router-dom'
import memoryUtils from '../../utils/memoryUtils'
import { Layout } from 'antd';
import LeftNav from '../../components/left-nav'
import Header from '../../components/header'

import Home from '../home/home'
import Category from '../category/category'
import Product from '../product/product'
import Role from '../role/role'
import User from '../user/user'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'
const { Footer, Sider, Content } = Layout;
export default class Admin extends Component {
    render() {
        const user = memoryUtils.user
        //如果当前用户没有登录，自动跳转到login
        //在render()中自动跳转
            if(!user._id){
                return <Redirect to='/login'/>
                //在时间回调函数中自动跳转：history.push()
            }


        return (
            <Layout style={{minheight:'100%'}}>
                <Sider>
                    <LeftNav/>
                </Sider>
                <Layout>
                  <Header>Header</Header>
                  <Content style={{margin:"20px" ,background:"white"}}>
                      <Switch>
                          {/* 逐级匹配因为前面/到admin */}
                          <Route path='/home' component={Home}/>
                          <Route path='/category' component={Category}/>
                          <Route path='/product' component={Product}/>
                          <Route path='/role' component={Role}/>
                          <Route path='/user' component={User}/>
                          <Route path='/charts/bar' component={Bar}/>
                          <Route path='/charts/line' component={Line}/>
                          <Route path='/charts/pie' component={Pie}/>
                          <Redirect to='/home' />
                      </Switch>
                  </Content>
                  <Footer style={{textAlign:"center" ,color:'#aaaa'}}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
                </Layout>
            </Layout>
        )
    }
}

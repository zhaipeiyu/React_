import React, { Component } from 'react'
import './index.less'
import {Link,NavLink,withRouter} from 'react-router-dom'
import logo from '../../assets/images/logo.png'
import  menuList  from "../../config/menuConfig";
import { Menu, Icon } from 'antd';
import { thisExpression } from '@babel/types';
import memoryUtils from '../../utils/memoryUtils'
const { SubMenu, Item } = Menu;
/*
admin左侧的导航组件
*/
 class LeftNav extends Component {
/*
    根据菜单数据数组返回标签（Item/SubMenu）数组
    reduce() + 递归
*/
    // getMenuNodes2 = (menuList) =>{   
    //     //pre第一次是初始值 第二次是第一次返回的结果
    //     //[1, 2, 3, 5].reduce((pre, now) => pre + (now % 2 === 0 ? now:0) ,0) //0是第二个参数 如果第一次没有值用初始值

    //     return menuList.reduce((pre,item)=>{
    //         //向pre中添加<Item>
    //         if (!item.children) {
    //            pre.push(
    //                <Item key={item.key}>
    //                    <Link to={item.key}>
    //                        <Icon type={item.icon} />
    //                        <span>{item.title}</span>
    //                    </Link>
    //                </Item>
    //            )
    //         }else{
    //             pre.push(//向pre中添加<SubMenu>
    //                 <SubMenu
    //                     key={item.key}
    //                     title={
    //                         <span>
    //                             <Icon type={item.icon} />
    //                             <span>{item.title}</span>
    //                         </span>
    //                     }
    //                 >
    //                     {/* 子标签也要遍历 所以要递归 */}
    //                     {
    //                         this.getMenuNodes2(item.children)
    //                     }

    //                 </SubMenu> 
    //             )
    //         }

            
    //         //必须return
    //         return pre 

    //       //默认值是空数组  
    //     } ,[])

    // }




    /*
        根据菜单数据数组返回标签（Item/SubMenu）数组   
        map() + 递归 
    */
    
    /*
    判断当前用户是否有对item的权限
    */

    hasAuth = (item) => {
        const user = memoryUtils.user
        const menus = user.role.menus
        /*
        1.如果当前的时admin
        2.item时公开的
        3.item的key在当前用户对应的menus中
        */
        if(user.username==='admin' || item.isPublic || menus.indexOf(item.key)!=-1){
            return true
        }else if(item.children){
            const Citme = item.children.find(Citme => menus.indexOf(Citme.key) != -1) 
            return !!Citme
        }

        return false
    }


    getMenuNodes = (menuList) => {
        const path = this.props.location.pathname
        // 返回的是<item></item> 标签
       return menuList.map((item) => {

        // 看当前item有没有权限
           if (this.hasAuth(item)) {
               // 判断没有没这个属性
               if (!item.children) {
                   return (
                       <Item key={item.key}>
                           <Link to={item.key}>
                               <Icon type={item.icon} />
                               <span>{item.title}</span>
                           </Link>
                       </Item>
                   )

               } else { //返回<SubMenu> 标签 看有没有 children 有的话就返回<SubMenu>
                   //当前item的children中某个item的key与当前请求的path相同, 当前item的key就是openKey
                   //find中第一个参数是回调 返回值是 布尔值 如果为true则上来第一个就找到了
                   const Citme = item.children.find((Citme) => Citme.key === path) //返回的是第一个子菜单对象
                   if (Citme) {
                       //保存openKey
                       this.openKey = item.key
                   }

                   return (
                       <SubMenu
                           key={item.key}
                           title={
                               <span>
                                   <Icon type={item.icon} />
                                   <span>{item.title}</span>
                               </span>
                           }
                       >
                           {/* 子标签也要遍历 所以要递归 */}
                           {
                               this.getMenuNodes(item.children)
                           }

                       </SubMenu>
                   )

               }
           }
        })

    }

    /*
    在第一次render（）之前执行
    1.同步操作 发请求
    2.第一次render()就需要
    */
    componentWillMount(){
         this.menuNodes = this.getMenuNodes(menuList)

    }

    /*
    在第一次render（）之后执行
    1.异步的操作（ajax请求，启动定时器）
    2.第一次render不需要
    */
    componentDidMount(){

    }

    render() {
        
        //得到当前的路径  会报错因为这里没有location 因为他不是路由组件
        //location/histoy/macth/只有路由组件才有 用withRouter才可实现
        const path = this.props.location.pathname
        
       // console.log(path,this.openKey)
        return (
            <div className="left-nav">
                <Link to='/home' className="left-nav-header">
                    <img src={logo} alt="logo"/>
                    <h1>后台管理</h1>
                </Link>
                {/* 能点开的是SubMenu 里面有Item 没有子菜单的也是Item */}
                <Menu
                // 上来默认选中的
                    // defaultSelectedKeys={['1']}
                    // defaultOpenKeys={['sub1']}
                    mode="inline"
                    theme="dark"
                    //defaultSelectedKeys={['home']} //第一次指定的值才会有效
                    selectedKeys={[path]} //上来首页默认选中 这个值不能写死
                    //defaultOpenKeys={['/products']} //二级菜单
                    defaultOpenKeys={[this.openKey]} //先后问题
                >
                    {/* 每一个路由都不一样 所以就把key也设为路径 每个Item不想写死 */}
                    {/* 根据menuList的数据 生成标签 Item标签和SubMenu标签 */}

                    {
                        // getMenuNodes这个方法必然返回标签的数组
                        this.menuNodes
                    }


                    
                    
                </Menu>
            </div>
        )
    }
}


//新组件会像LeftNav组件传递3个属性：history/location/match/
export default withRouter(LeftNav)
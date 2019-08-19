import React, { Component } from 'react'
import './login.less'
import logo from '../../assets/images/logo.png'
import { Form, Icon, Input, Button,message } from 'antd';
import {reqLogin} from '../../api/index'
import memoryUtils from '../../utils/memoryUtils';
import {Redirect} from 'react-router-dom'
import {saverUser} from '../../utils/storageUtils'
const Item = Form.Item
// alt + shift + R
class Login extends Component {
   
    handleSubmit = e => {
        //阻止事件的默认行为 发请求 提交表单就是默认行为
        e.preventDefault();
        //alert('校验成功，发送登陆的ajax请求')

        //进行表单的统一校验  判断输入是否正确
        this.props.form.validateFields(async (err,values) =>{
            if(!err){
                //alert('校验成功了，发送登录的ajax请求')  
                //reqLogin(values)进入登录页面 返回的是promise对象
                //try{} catch{}   values是username 和 password
              const result = await reqLogin(values) 
              console.log(result)  
               if(result.status === 0){ //登录请求成功
                //result 为成功的那个对象 "status":0 "data":{}
                //1.得到user
                const user = result.data
                console.log(user)    
                //2.保存user
                //保存到local
               // localStorage.setItem('user_key',JSON.stringify(user))
               saverUser(user)
                //保存到内存中
                memoryUtils.user = user

                //跳转到admin (那个路由对象有跳转的功能 所有的路由组件都有三个属性 location,match,history)
                 this.props.history.replace('/')   


               }else{ //登录请求失败
                 message.error (result.msg)
               }
            }
        })
      };

      //自定义验证 
      validator = (rule, value, callback)=>{
          //去除两端空格  开始上面都不输入 会报错value是undefined 所以要设置初始值
        value = value.trim()
        //   value是输入的内容
        if(!value){
           callback('密码必须输入')     
        }  else if(value.length<4){
            callback('密码不能小于4位')
        } else if(value.length>12){
            callback('密码不能小于12位')
        }else if(!/^[a-zA-Z0-9_]+$/.test(value)){
            callback('密码必须是英文、数字或下划线组成')    
        }else{
            // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
            callback() //通过校验
        }

      }
render() {
    //如果当前用户已经登录，自动跳转admin
    if(memoryUtils.user._id){
        return <Redirect to='/'/>
    }


    const getFieldDecorator = this.props.form.getFieldDecorator
return (
<div className="login">
    <div className="login-header">
        <img src={logo} alt="logo" />
        <h1>后台管理系统</h1>
    </div>
    <div className="login-content">
        <h1>用户登陆</h1>
        <Form onSubmit={this.handleSubmit} className="login-form">
            <Item>
            {
              /*
              用户名/密码的的合法性要求
                1). 必须输入
                2). 必须大于等于4位
                3). 必须小于等于12位
                4). 必须是英文、数字或下划线组成
              */
                /* 声明式验证: 使用库写好的规则进行验证 */
              }
            {getFieldDecorator('username', {
                //没有会报错
                initialValue: 'admin',//初始值
            rules: [
                { required: true, whtespace:true, message: '用户名必须输入' },
                { min:4, message:'用户名不能小于4位'},
                { max:12, message:'用户名不能大于12位'},
                // +号是大于等于一个
                { pattern:/^[a-zA-Z0-9_]+$/, message:'用户名必须是英文,数字,下划线组成'},
            ],
          })( //返回值是一个函数 是一个组件标签
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="用户名"
            />,
          )}
            </Item>
            <Item>
            {getFieldDecorator('password', {
                initialValue: '',
            rules: [ //自定义验证
                // 这里定义方法 外面定义规则
                { validator:this.validator }
            ],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="密码"
            />,
          )}
            </Item>
            <Form.Item>
        
                <Button type="primary" htmlType="submit" className="login-form-button">
                    登   陆
                </Button>
                
            </Form.Item>
        </Form>
    </div>
</div>


)
}
}
//为了给这个组件自动传入form对象
const WrappedLoginForm = Form.create()(Login)   // 组件名: 'Form(Login)'

export default WrappedLoginForm
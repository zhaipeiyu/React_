import React, { Component } from 'react'
import './index.less'
import memoryUtils from '../../utils/memoryUtils'
import { Modal } from 'antd'
import {removeUser} from '../../utils/storageUtils'
import menuConfig from '../../config/menuConfig'
import LinkButton from '../../components/link-button'
import {reqWeather} from '../../api'
import {formateDate} from '../../utils/dateUtils'
import {withRouter} from 'react-router-dom'
/*
admin左侧的导航组件
*/
class Header extends Component {
    state = {
        currentTime:formateDate(Date.now()),
        dayPictureUrl:'',
        weather:''
    }

    updateTime = ()=>{
        //启动循环定时器，每个1s更新一下时间状态
        this.Interval = setInterval(() => {
          const  currentTime = formateDate(Date.now())
          this.setState({
              currentTime
          })  
        }, 1000);
    }


    getWeather = async () => {
        const { dayPictureUrl, weather} = await reqWeather('北京')
        this.setState({
            dayPictureUrl,
            weather
        })
    }
   

    /*
        得到当前请求对应的标题
    */
    getTitle = () => {
        let title = ''
        const path = this.props.location.pathname
        menuConfig.forEach(item=>{
            if (item.key === path) {
                title = item.title
            }else if (item.children) {
                const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0)
                if (cItem) {
                    title = cItem.title
                }
            }

        })
        return title
    }

    logout = () =>{
        Modal.confirm({// 配置对象
            title: '确认退出吗?',
            
            onOk : () => {
                //删除保存的user数据
                removeUser()
                memoryUtils.user = {}
                //跳转
                this.props.history.replace('/login')
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    componentWillUnmount(){
        clearInterval(this.Interval)
    }

    /*
       异步获取天气信息显示 
   */
    componentDidMount() {
        this.updateTime()
        this.getWeather()
    }


    render() {
        let { currentTime, dayPictureUrl,weather} = this.state
        //内存中读取
       const user = memoryUtils.user
       //找到对应的路径 标题 title属性在 config中
       const title = this.getTitle()
        return (
            <div className="header">
                <div className="header-top">
                    <span>欢迎，{user.username}</span>
                    {/* <a href="javascript:;">退出</a> */}
                    {/* 自定义的标签会自带chirden属性 chirden：退出*/}
                    <LinkButton onClick={this.logout}>
                        退出
                    </LinkButton>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">{title}</div>
                    <div className="header-bottom-right">
                        <span>{currentTime}</span>
                        {weather?<img src={dayPictureUrl}alt="weather"/>:null}
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Header)

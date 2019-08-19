import React, { Component } from 'react'
import {
  Card,
  Button,
  Table,
  Modal,
  message
  
} from 'antd'
import { formateDate} from '../../utils/dateUtils'
import LinkButton from '../../components/link-button'
import Auth from './auth'
import AddForm from './add-form'
import { reqRoles, reqAddRole, reqUpdateRole} from '../../api'
import memoryUtils from '../../utils/memoryUtils';
/**
 * 角色管理
 */
export default class Role extends Component {
  state = {
    roles:[],
    isAddshow:false,
    isAuthshow:false
  }
  constructor(props){
    super(props)
    this.authRef = React.createRef()
  }

  initColumns = () =>{
    this.columns = [
      {
        title:'角色名称',
        dataIndex:'name'
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        render: (create_time) => formateDate(create_time)
        //render: formateDate
      },
      {
        title: '授权时间',
        dataIndex: 'auth_time',
        reder: formateDate
      },
      {
        title: '授权人',
        dataIndex: 'auth_name'
      },
      {
        title: '操作',
        
        render: (role) => <LinkButton onClick={() => this.ShowAuth(role)}>设置权限</LinkButton>
      },
    ]
  }

  ShowAuth = (role) =>{
    this.role = role
    this.setState({
      isAuthshow:true
    })


  }


  getRoles = async() =>{

  const result = await reqRoles()

  if (result.status===0) {
    const roles = result.data
      this.setState({
      roles
    })

  }

}

  addRoule = () => {
    // 进行表单验证
    this.form.validateFields(async(error,values)=>{
      
      if (!error) {
        this.form.resetFields()
        // 重置表单
       this.setState({
         isAddshow:false
       })
        // 获取的参数
        const { roleName } = values

        const result = await reqAddRole(roleName)
        if (result.status === 0) {
          message.success('添加角色成功')
          //重新获取列表显示 不然列表更新不了
          this.getRoles()
        }
      } 
    })

  }
 

  updateRoule = async() => {
    this.setState({
      isAuthshow: false
    })
    const role = this.role
    role.menus = this.authRef.current.getMenus()
    role.auth_time = Date.now()
    role.auth_name = memoryUtils.user.username
    const result = await reqUpdateRole(role)
    if (result.status===0) {
      
      message.success('授权成功了')
      this.getRoles()
    }
  }

  componentWillMount(){
    this.initColumns()
  }

  componentDidMount(){
    this.getRoles()
  }

  render() {
    const { roles,isAddshow,isAuthshow} = this.state
    const title = (<Button type="primary" onClick={() => this.setState({isAddshow:true})}>创建角色</Button>)
    
   
    return (
      <Card title={title}>
        <Table
          bordered
          rowKey="_id"
          // 所有角色列表
          dataSource={roles}
          columns={this.columns}
        />

        <Modal
          visible={isAddshow}
          title="添加角色"
          // 发请求 更新界面
          onOk={this.addRoule}
          onCancel={() => {
            // 重置表单将原始的输入再次打开不会显示
            this.form.resetFilelds()
            this.setState({ isAddshow: false })
          }}
        >
          <AddForm setForm={(form) => this.form = form}/>
        </Modal>


        <Modal
          visible={isAuthshow}
          title="设置角色权限"
          // 发请求 更新界面
          onOk={this.updateRoule}
          onCancel={() => {
            // 重置表单将原始的输入再次打开不会显示
            
            this.setState({ isAuthshow: false })
          }}
        >
          {/* 将角色传过去 */}
          {/* ？？？？？？？？ */}
          <Auth role={this.role || {}} ref={this.authRef}/>
        </Modal>
      </Card>
    )
  }
}

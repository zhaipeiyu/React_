import React, { Component } from 'react'
import {
  Tree ,
  Input,
  Form
} from 'antd'
import menuList from '../../config/menuConfig'
import PropTypes from 'prop-types'
const Item = Form.Item
const { TreeNode } = Tree;
export default class Auth extends Component {
  static propTypes = {
    role:PropTypes.object.isRequired
  }

  state = {
    // 这里初始不能为空 因为上来用户有默认权限
    checkedKey:[]
  }

  getMenus = () => {
    return this.state.checkedKey
  }


  //当用户改变某个treeNode的勾选状态时自动调用
  handleCheck = (checkedKey) =>{
    this.setState({
      checkedKey
    })

  }

  //第一次render前调用，后面打开显示时不会再调用
  componentWillMount(){
  //   const menus = this.props.role.menus
  //  // console.log(menus);
    
  //   this.setState({
  //     checkedKey:menus
  //   })

  }

  //组件将要接收到新的props
  componentWillReceiveProps(nextProps){
    //读取最新传入的role 更新 checkedKey
    const menus = nextProps.role.menus
    // console.log(menus);

    this.setState({
      checkedKey: menus
    })
  }

  getmenuNode = (menuList) =>{
    return  menuList.map((item) =>{
      return (
        <TreeNode title={item.title} key={item.key} >
          {item.children ? this.getmenuNode(item.children) : null}
        </TreeNode>
      )
      

    })

  }

  render() {
    const {name} = this.props.role
    const { checkedKey} = this.state
    //所有表单项的布局
    const formLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 8 },
    }
    return (
      <div>
        <Item label="角色名称:" {...formLayout}>
          <Input value={name} disabled></Input>
        </Item>

        <Tree
          defaultExpandAll={true}
          checkable={true}
          onCheck={this.handleCheck}
          checkedKeys={checkedKey}
        >
          <TreeNode title="平台权限" key="0-0">
            {/* 动态生成数据 */}
              {
                this.getmenuNode(menuList)
              }

            {/* <TreeNode title="parent 1-0" key="0-0-0" >
              <TreeNode title="leaf" key="0-0-0-0"  />
              <TreeNode title="leaf" key="0-0-0-1" />
            </TreeNode>
            <TreeNode title="parent 1-1" key="0-0-1">
              <TreeNode title={<span style={{ color: '#1890ff' }}>sss</span>} key="0-0-1-0" />
            </TreeNode> */}
          </TreeNode>
        </Tree>
      </div>
    )
  }
}

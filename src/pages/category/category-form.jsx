import React, { Component } from 'react'
import {Form,Inupt, Input} from 'antd'
import PropTypes from 'prop-types'
const  Item  = Form.Item;
/*
点击添加出来的form
*/
//分类添加/修改的表单组件
class CategoryForm extends Component {
  //类（函数）对象 CateforyForm.propTypes
  //是添加在标签上的 propTypes声明的都要通过标签属性传入
  static propTypes = {
    categoryName: PropTypes.string,
    // 不能是function 因为是关键字
    setForm:PropTypes.func.isRequired
  };

  //CateforyForm的实例
  //xxx = 2

  /*
    接收父组件传过来的函数
  */
  componentWillMount(){
    this.props.setForm(this.props.form) //将form交给父组件(Category)
  }


  render() {
    const { categoryName } = this.props;
    //console.log(categoryName);
    const { getFieldDecorator } = this.props.form;
    return (
      <Form>
        <Item>
          {// 第一个参数是名字 第二个参数是配置对象 */
          getFieldDecorator("categoryName", {
            initialValue: categoryName || "", //初始值  //如果手动输入了任意值，再指定新的默认值，无效（显示的是输入的值）
            rules: [{ required: true, message: "分类名称是必须的" }]
          })(<Input type="text" placeholder="分类名称" />)}
        </Item>
      </Form>
    );
  }
}

export default Form.create()(CategoryForm)

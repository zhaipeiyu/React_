import React, { Component } from 'react'
import { Card, Button, Icon, Table, Modal, message } from "antd";
import { reqCategorys, reqUpdateCategory ,reqAddCategory} from "../../api";
import  LinkButton  from "../../components/link-button";
import CategoryForm from './category-form'
/**
 * 分类管理
 */
//数据要发请求动态获取



export default class Category extends Component {
  //发请求得到的分类列表放到状态中去
  state = {
    categorys:[],
    loading:false,
    showStatus:0, //0:都不显示，1：显示添加，2：显示修改
  }

  //得到数据要显示
  getCtegorys = async()=> { 
    //显示loading
    this.setState({
      loading:true
    })

                //得到promise
  const result = await reqCategorys();
   this.setState({
     loading: false
   });

    if (result.status===0) {
      const categorys = result.data
     // console.log(categorys);
      
      //修改状态
      this.setState({
        categorys
      });
    } 

  }

  //初始化Table所有列的数组
  initColumns = () => {
    //列
     this.columns = [
       {
         title: "分类名称",
         dataIndex: "name"
         //render:(name) => name.toUpperCase()
       },
       {
         width: 300,
         title: "操作",
         // render后面 跟函数 箭头函数后面跟个1 就返回是1 操作下面显示的就是1
         //render传了当前所在行的分类对象 整个数据
         //因为LinkButton 是render出来的
         //如果定义了 dataIndex 他就把对应的值传给你name ，如果没有定义就把 category 传过来
         render: (
           category //渲染当前行时会自动传入当前行对应的数据对象 下面指定了 dataSource={categorys}
         ) => (
           <LinkButton
             onClick={() => { //点的时候才存的category 点之前是undefined
               //保存category
              this.category = category //避免初始render是没有的
               //显示更新的对话框
              this.setState({
                showStatus:2
              })
               
             }}
           >
             {/* 将分类对象存起来 */}
             修改分类
           </LinkButton>
         )
       }
     ];
  }
  /*
    显示添加界面
  */

  // showAdd = () => {
  //   this.setState({
  //     showStatus:1
  //   })
  // }

  /*
  显示修改
  
  */
  // showUpdate = (category) =>{
      //保存category
   // this.category = category
  //   this.setState({
  //     showStatus:2
  //   })
  // }


  /*
    更新分类
  */
  updateCateogory = () =>{
    this.form.validateFields(async(error,values)=>{
      if (!error) {
         //重置输入框的值（变为初始值）
        this.form.resetFields()

        //隐藏添加界面
        this.setState({
          showStatus:0
        })


        const categoryId = this.category._id 
        const categoryName =values.categoryName
        const result = await reqUpdateCategory(categoryId, categoryName);
        if (result.status === 0) {
          message.success("修改分类成功");
          //显示最新列表
          this.getCtegorys();
        } else {
          message.error("添加失败:" + result.msg);
        }

      }

    })

    


  }

  /*
    添加分类

    父组件想得到子组件的一个数据（form）；子组件向父组件通信 ==》函数类型的props
  */
  addCateogory = () =>{
    //1.进行表单验证 //夫组件没有form    //
    this.form.validateFields(async(error,values) =>{
      if (!error) { //验证通过了 

        //重置输入框的值（变为初始值）
        this.form.resetFields()

        //隐藏添加界面
        this.setState({
          showStatus:0
        })

        //2.添加数据   //values就是输入的值
        const categoryName = values.categoryName;
        //console.log(categoryName);
        //3.发送请求
       const result = await reqAddCategory(categoryName);
        //console.log(result)
        //4.根据请求结果做不同的处理
      if (result.status===0) {
        message.success('添加分类成功')
        //显示最新列表
        this.getCtegorys()

      }else{
        message.error('添加失败:' + result.msg)

      }
        
    }

    })
    

  }

  /*
    接收form并保存
  */
  setForm = (form) =>{
    //保存在form中
    //在子组件接收
    this.form = form
  }


  /*
    隐藏对话框
  */
  handleCancel = () => {
    //重置输入数据
    this.form.resetFields()
    //隐藏对话
    this.setState({
      showStatus:0
    });
  }




  //在didMout中发请求
  componentDidMount (){
    this.getCtegorys()

  }
  //初始化数据
  componentWillMount(){
   this.initColumns()
  }

  render() {
    //取出状态数据
    const { categorys, loading, showStatus } = this.state;
    //取出当前需要修改的分类
    const category = this.category || {}


    const extra = (
      // 点击添加 必须加() => 不然会自动执行
      <Button type="primary" onClick={() => this.setState({showStatus:1})}>
        <Icon type ="plus"/>
        添加
      </Button>
    );
    return (
      <Card extra={extra}>
        <Table
          loading={loading}
          //加上边框
          bordered={true}
          rowKey="_id"
          dataSource={categorys}
          columns={this.columns}
          // 这个默认传的是一个对象 defaultPageSize： 默认的每页条数
          pagination={{ defaultPageSize: 5, showQuickJumper: true }}
        />

        {/* 显示添加 显示修改 隐藏 */}
        <Modal
          title="修改分类"
          // visible 对话框是否可见
          visible={showStatus === 2}
          onOk={this.updateCateogory}
          onCancel={this.handleCancel}
        >
          <CategoryForm categoryName={category.name} setForm={this.setForm} />
          {/* category 点击的时候才往里面存 */}
        </Modal>

        <Modal
          title="添加分类"
          visible={showStatus === 1}
          onOk={this.addCateogory}
          onCancel={this.handleCancel}
        >
          {/* 点击添加后出来的form框 */}
          <CategoryForm setForm={this.setForm} />
        </Modal>
      </Card>
    );
  }
}

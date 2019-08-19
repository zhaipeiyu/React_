
import React, { Component } from 'react'
import LinkButton from '../../components/link-button'
import RichTextEditor from './rich-text-editor'
import { reqCategorys,reqAddUpdateProduct } from "../../api";
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Icon,
  message
} from 'antd'
import PicturesWall from './picures-wall';

const Item = Form.Item
const Option = Select.Option

/*
  商品管理的添加/修改子路由 
 */

 class ProductAddUpdate extends Component {
  state={
    categorys:[]
  }

   constructor(props) {
     super(props)
     // 创建一个ref容器
     this.pwRef = React.createRef()
     this.editorRef = React.createRef()
   }


  /*
  异步获取分类列表
  */
   getCategorys = async()=>{
     const result = await reqCategorys()
    if (result.status === 0) {
      this.setState({
        categorys:result.data
      })
    }
   }
   /*
   检查价格
   */
   validatePrice = (rule,value,callback) => {
      if (value < 0) {
        callback('价格不能小于0')
      }else{
        callback()
      }

   }


    //提交响应回调
   handleSubmit = (event) =>{
     event.preventDefault()
     this.props.form.validateFields(async(error,values) =>{
       if (!error) {
         const {name,desc,price,categoryId} = values

         // 得到所有上传图片文件名的数组
         const imgs = this.pwRef.current.getImgs()
         console.log('imgs', imgs)

        //得到富文本编辑器指定的detail
         const detail = this.editorRef.current.getDetail()
         console.log(detail)

         //获取products
        const products = { name, desc, price, categoryId, imgs, detail}
         if (this.products._id) { //当前时更新
           products._id = this.products._id
         //  console.log(products._id)
         }

        //发添加商品请求
     
        //发修改商品请求
         const result = await reqAddUpdateProduct(products)
         if(result.status === 0){
           message.success('商品操作成功')
           this.props.history.replace('/product')
         }else{
           message.error('商品操作失败')
         }
       }
     })
   }

  componentDidMount(){
    this.getCategorys()
  }

  componentWillMount(){
    //有值就是更新没有值就是添加
  const products = this.props.location.state
   // console.log(products)
    
      this.products = products || {} //如果是添加保存的是空对象{}
      this.isUpdate = !!this.products._id
      //console.log(products)
  }

  render() {
    
    const {products,isUpdate} = this
    console.log(products)
    const { categorys} = this.state
    const { getFieldDecorator} = this.props.form
    const title = (
       <span>
        <LinkButton onClick = {()=>this.props.history.goBack()}>
          <Icon type="arrow-left"></Icon>
        </LinkButton >
        <span>{isUpdate ? '更新' : '添加'}商品</span>
      </span>
    )
      //所有表单项的布局
    const formLayout = {
      labelCol:{span:4},
      wrapperCol:{span:8},
    }

    return (
      <Card title={title}>
        <Form {...formLayout} onSubmit={this.handleSubmit}>
          <Item label="商品名称">
            {
              getFieldDecorator('name',{
                initialValue:products.name,
                
                rules:[
                  {required:true,message:'商品名称必须输入'}
                ]
              })(
                <Input type="text" placeholder="商品名称" />
              )
            }
            
          </Item>
          <Item label="商品描述">
            {
              getFieldDecorator('desc', {
                initialValue: products.desc,
                rules: [
                  { required: true, message: '商品描述必须输入' }
                ]
              })(
                <Input type="text" placeholder="商品描述" />
              )
            }

          </Item>
          <Item label="商品价格">
            {
              getFieldDecorator('price', {
                initialValue: products.price,
                rules: [
                  { required: true, message: '商品价格必须输入' },
                  {validator:this.validatePrice}
                ]
              })(
                <Input type="number" placeholder="商品价格" addonAfter="元"/>
              )
            }
          </Item>

          <Item label="商品分类">
            {
              getFieldDecorator('categoryId', {
                initialValue: products.categoryId,
                rules: [
                  { required: true, message: '商品分类必须指定' }
                ]
              })(
                <Select>
                  <Option value="">未选择</Option>
                  {
                    categorys.map((c) => {
                      return <Option key={c._id} value={c._id}>{c.name}</Option>
                    })
                  }

                </Select>
              )
            }

          </Item>

          <Item label="商品图片" wrapperCol={{span:15}}>
            {/* 内部会将组件对象保存到ref容器对象：current:组件对象 */}
            <PicturesWall ref={this.pwRef} imgs={products.imgs}/>
          </Item>
          <Item label="商品详情" wrapperCol={{ span: 20 }}>
                                                {/* 修改显示之前的内容 */}
            <RichTextEditor ref={this.editorRef} detail={products.detail} />
          </Item>



          
          <Item>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
            
          </Item>
        </Form>
      </Card>
    )
  }
}

export default Form.create()(ProductAddUpdate)



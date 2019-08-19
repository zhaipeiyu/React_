import React, { Component } from 'react'
import LinkButton from '../../components/link-button'
import memoryUtils from '../../utils/memoryUtils'
import { reqProduct, reqCategory} from '../../api'
import { IMG_BASE_URL} from '../../utils/constants'
import {
  Card,
  List,
  Icon
} from 'antd'
const Item = List.Item


/*
  商品管理默认详情子路由 
 */

export default class ProductDetail extends Component {
  //页面刷新后商品名称会不显示
  state = {
    products:{},
    categoryName:''
  }

  //获取分类显示
  getCategory = async (categoryId) => {
    const result = await reqCategory(categoryId)
    if (result.status === 0) {
      const categoryName = result.data.name
      this.setState({
        categoryName
      })
    }
  }



  componentWillMount(){
    //从内存中读取products,如果有才更新状态
    const products = memoryUtils.products
    if (products._id) {
      this.setState({
        products
      })
    }
  }

  async componentDidMount (){
    //如果状态中的products没有数据，更具param参数请求获取
    if (!this.state.products._id) { //没有商品对象
      //取出地址栏的ID
     const productId =  this.props.match.params.id
     const result = await reqProduct(productId)
      
      if (result.status===0) {
        const products = result.data
        //得到商品对象后分类显示
        this.getCategory(products.categoryId)
        this.setState({
          products
        })
      }
    }else{ //没有商品对象
      const categoryId = this.state.products.categoryId
      this.getCategory(categoryId)
    }

  }



  render() {
    //读取状态数据
    const { products,categoryName} = this.state

    const title = (
      <span>
        <LinkButton onClick = {()=>this.props.history.goBack()}>
          <Icon type="arrow-left"></Icon>
        </LinkButton >
        <span>修改商品</span>
      </span>
        
      
    )
    return (
      <Card title={title} className="product-detail">
        <List>
          <Item>
            <span className="product-detail-left">商品名称：</span>
            <span>{products.name}</span>
          </Item>
          <Item>
            <span className="product-detail-left">商品描述：</span>
            <span>{products.desc}</span>
          </Item>
          <Item>
            <span className="product-detail-left">商品价格：</span>
            <span>{products.price}元</span>
          </Item>
          <Item>
            <span className="product-detail-left">所属分类：</span>
            <span>{categoryName}</span>
          </Item>
          <Item>
            <span className="product-detail-left">商品图片：</span>
            <span>
              {
                products.imgs && products.imgs.map((image)=>{
                  return <img className="product-detail-img" key={image} src={IMG_BASE_URL + image} alt="img" />
                  })
              }
             
            </span>
          </Item>
          <Item>
            <span className="product-detail-left">商品详情：</span>
            {/* 将标签转换成文本 */}
            <span dangerouslySetInnerHTML={{ __html: products.detail}}>
            {/* {products.detail} */}
            </span>
          </Item>
        </List>

      </Card>
    )
  }
}





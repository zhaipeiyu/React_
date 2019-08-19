import React, { Component } from 'react'
import {Route,Switch,Redirect} from 'react-router-dom'

import ProductAddUpdate from './product-add-update'
import ProductDetail from './product-detail'
import ProductHome from './product-home'
import  './product.less'

/**
 * 商品管理
 */
export default class Product extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route path="/product" component={ProductHome} exact />
          <Route path="/product/detail/:id" component={ProductDetail} />
          <Route path="/product/addupdate" component={ProductAddUpdate} />
          <Redirect to="/product" />
        </Switch>
      </div>
    );
  }
}

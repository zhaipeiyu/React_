import { Upload, Icon, Modal, message} from 'antd';
import PropTypes from 'prop-types'
import { reqDeleteImg} from '../../api'
import { IMG_BASE_URL} from '../../utils/constants'
import React from 'react'
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default class PicturesWall extends React.Component {
  //接受属性的声明
  static propTypes = {
    imgs: PropTypes.array
  }

  state = {
    previewVisible: false, //是否显示大图预览
    previewImage: '', //大图预览的URl
    // 所有已上传文件的列表
    fileList: [],
  };

  getImgs = () => {
    return this.state.fileList.map(file => file.name)
  }


  //隐藏大图预览
  handleCancel = () => this.setState({ previewVisible: false });

  //大图预览
  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  //当进行文件上传或者说删除时，文件状态发生改变时
  //还有两个参数 file 当前操作的文件对象
  handleChange = async({ file,fileList }) =>{
    console.log('handleChange', file.status, file == fileList[fileList.length - 1])
    //上传已经完成
    if (file.status==='done') {
      //file与fileList最后一个file代表的都是当前操作图片, 但不是同个对象
      // 取出最后个file
      file = fileList[fileList.length - 1]
        // 取出上传图片中的响应数据
      const { name, url } = file.response.data
      //修正过来 name   // 修正file中的属性
      file.name = 'name'
      file.url = 'url'

    }else if(file.status === 'removed'){ //删除
    const result = await reqDeleteImg(file.name)
      if (result.status === 0) {
        message.success('删除图片成功!')
      }
    }
    //更新状态
    this.setState({ fileList });
    console.log(file.status) //有response属性里有 name和url
  } 
  
  componentWillMount() {
    const imgs = this.props.imgs
    if (imgs && imgs.length > 0) {
      /* 
      {
        uid: '-5',
        name: 'image.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      },
      */
      const fileList = imgs.map((img, index) => ({
        uid: -index,
        name: img,
        status: 'done',
        url: IMG_BASE_URL + img,
      }))
      // 更新状态
      this.setState({
        fileList
      })
    }
  }

  
  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div>
        <Upload
        // 上传图片的接口
          action="/manage/img/upload"
          listType="picture-card"
          //已上传文件的列表
          fileList={fileList} 
          //发送到后台文件的参数名
          //没有url  name属性不正确
          name='image'
          //绑定监听 预览时触发
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}


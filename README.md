# imageCompress
html5 图片 压缩
### 1、如何安装
  npm install --save-dev html-image-compress

### 2、如何使用
```html
<input id="file" type="file" accept="image/*" />
```
```js
// 模块默认输出 图片压缩的构造器
import HtmlImageCompress from 'html-image-compress'

document.querySelector('#file').addEventListener('change', function () {
  var htmlImageCompress = new HtmlImageCompress(this.files[0],{quality:0.7})
  htmlImageCompress.then(function(result){
    // 成功后执行
      var file = result.file; // 压缩后的图片文件(file)对象
      var fileSize = result.fileSize // 压缩后的图片文件(file)大小
      var base64 = result.base64; // 压缩后的base64图片
      var origin = result.origin; // 压缩前的图片文件（file）对象
  })
  .catch(function (err) {
     // 处理失败会执行
  })

});
```
### 3、参数
```js
new HtmlImageCompress(file, [options]);
```
* file 通过 input:file 得到的文件

* [options] 这个参数允许忽略
  * width {Number} 图片最大不超过的宽度，默认为原图宽度，高度不设时会适应宽度。
  * height {Number} 同上
  * quality {Number} 图片压缩质量，取值 0 - 1，默认为0.7
  * imageType {String} 图片类型 ，默认 'image/jpeg'
  
### 4、返回结果
* 返回值是一个promise对象
  then(result)
  * result.file 压缩后的file对象
  * result.fileLen 生成后的图片的大小，后端可以通过此值来校验是否传输完整
  * result.base64 生成后的图片base64，后端可以处理此字符串为图片，也直接用于img.src = base64
  * result.base64Len 生成后的base64的大小，后端可以通过此值来校验是否传输完整 (如果采用base64上传方式)
  * result.origin 也就是原始的file对象，里面存了一些原始文件的信息，例如大小，日期等。



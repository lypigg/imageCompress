import Promise from './lib/Promise'
import EXIF from 'exif-js'

var ua = navigator.userAgent,
    isAndroid = ~ua.indexOf('Android'),
    isInWechat = ~ua.indexOf('MicroMessenger');


function ImageCompress(file, options) {
    if (!(this instanceof ImageCompress)) {
        throw new Error('ImageCompress is a constructor and should be called with the `new` keyword');
        return;
    }
    return this._init(file, options)
}


ImageCompress.prototype = {
    _init: function (file, options) {
        var that = this;
        that.file = file;
        that.options = {
            width: null,
            height: null,
            quality: 0.7,
            imageType: 'image/jpeg'
        }
        var img = that.img = new Image()
        for (var key in options) {
            that.options[key] = options[key]
        }
        return new Promise(function (resovle, reject) {
            var _imgOnload = function () {
                    // 非android，会有orientation 图片旋转角度
                    EXIF.getData(img, function () {
                        that.orientation = EXIF.getTag(this, 'Orientation');
                        return that._createBase64().then(function (base64) {
                            var file = dataURLtoBlob(base64)
                            resovle({
                                base64: base64,
                                base64Len: base64.length,
                                origin: that.file,
                                file: file,
                                fileSize: file.size
                            })
                        }).catch(function (err) {
                            console.error(err)
                            reject(err)
                        })
                    })
                },
                _imgonerror = function (err) {
                    console.error(err)
                    reject(err)
                };
            try {
                var reader = new FileReader();
                reader.onerror = function (err) {
                    console.error(err)
                    reject(err)
                };
                reader.onload = function (result) {
                    var fileUrl = result.currentTarget.result;
                    img.onerror = _imgonerror;
                    img.onload = _imgOnload;
                    img.src = fileUrl;
                };
                reader.readAsDataURL(file);
            } catch (err) {
                console.error(err);
                reject(err);
            }
        })

    },

    _getResize: function () {
        var that = this,
            img = that.img,
            options = that.options,
            width = options.width,
            height = options.height,
            orientation = that.orientation

        var resize = {
            width: img.width,
            height: img.height
        };

        if (~'5678'.indexOf(orientation)) {
            resize.width = img.height;
            resize.height = img.width;
        }

        // 如果原图小于设定，采用原图大小
        if (resize.width < width || resize.height < height) {
            return resize
        }

        // 宽高比例
        var scale = resize.width / resize.height;

        if (width && height) {

            if (scale >= width / height) {
                resize.width = width;
                resize.height = Math.ceil(width / scale)
            } else {
                resize.width = Math.ceil(scale * height);
                resize.height = height
            }

        } else if (width) {
            resize.width = width;
            resize.height = Math.ceil(width / scale)

        } else if (height) {

            resize.width = Math.ceil(scale * height);
            resize.height = height

        }

        return resize
    },
    _createBase64: function () {
        try {
            var that = this,
                img = that.img,
                quality = that.options.quality,
                imageType = that.options.imageType,
                resize = that._getResize(),
                width = resize.width,
                height = resize.height,
                orientation = that.orientation;
            // canvas双缓冲优化，处理android 又可能出现的黑屏问题
            var canvas = that.canvas = document.createElement('canvas');
            var realcanvas = document.createElement('canvas');
            realcanvas.width = canvas.width = width;
            realcanvas.height = canvas.height = height;
            var cxt = that.cxt = that.canvas.getContext('2d');
            // 填充背景颜色设置为 白色
            cxt.fillStyle = '#fff';

            // 调整为正确方向
            switch (orientation) {
                case 3:
                    cxt.rotate(180 * Math.PI / 180);
                    cxt.drawImage(img, -resize.width, -resize.height, resize.width, resize.height);
                    break;
                case 6:
                    cxt.rotate(90 * Math.PI / 180);
                    cxt.drawImage(img, 0, -resize.width, resize.height, resize.width);
                    break;
                case 8:
                    cxt.rotate(270 * Math.PI / 180);
                    cxt.drawImage(img, -resize.height, 0, resize.height, resize.width);
                    break;
                case 2:
                    cxt.translate(resize.width, 0);
                    cxt.scale(-1, 1);
                    cxt.drawImage(img, 0, 0, resize.width, resize.height);
                    break;
                case 4:
                    cxt.translate(resize.width, 0);
                    cxt.scale(-1, 1);
                    cxt.rotate(180 * Math.PI / 180);
                    cxt.drawImage(img, -resize.width, -resize.height, resize.width, resize.height);
                    break;
                case 5:
                    cxt.translate(resize.width, 0);
                    cxt.scale(-1, 1);
                    cxt.rotate(90 * Math.PI / 180);
                    cxt.drawImage(img, 0, -resize.width, resize.height, resize.width);
                    break;
                case 7:
                    cxt.translate(resize.width, 0);
                    cxt.scale(-1, 1);
                    cxt.rotate(270 * Math.PI / 180);
                    cxt.drawImage(img, -resize.height, 0, resize.height, resize.width);
                    break;
                default:
                    cxt.drawImage(img, 0, 0, resize.width, resize.height);
            }

            return new Promise(function (resolve) {
                realcanvas.getContext('2d').drawImage(canvas, 0, 0, canvas.width, canvas.height);
                resolve(realcanvas.toDataURL(imageType, quality))
            })
        } catch (err) {
            throw new Error(err)
        }
    }

}

/**dataURL to blob**/
function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type: mime});
}

export default window.HtmlImageCompress = window.HtmlImageCompress || ImageCompress


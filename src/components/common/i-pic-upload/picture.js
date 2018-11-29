/* eslint-disable */
import CONFIG from 'configuration'
import factory from 'utility/factory'
var
  imgPackageHeader = 'data:image/jpeg;base64,',
  imgDefaultBase64Code = '/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABQAAD/4QMpaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjAtYzA2MCA2MS4xMzQ3NzcsIDIwMTAvMDIvMTItMTc6MzI6MDAgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzUgV2luZG93cyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozMzM5RDY2ODMyNzQxMUU1QTJENkEwOTg5MjdGQTczNiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDozMzM5RDY2OTMyNzQxMUU1QTJENkEwOTg5MjdGQTczNiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjMzMzlENjY2MzI3NDExRTVBMkQ2QTA5ODkyN0ZBNzM2IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjMzMzlENjY3MzI3NDExRTVBMkQ2QTA5ODkyN0ZBNzM2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+/+4ADkFkb2JlAGTAAAAAAf/bAIQAAgICAgICAgICAgMCAgIDBAMCAgMEBQQEBAQEBQYFBQUFBQUGBgcHCAcHBgkJCgoJCQwMDAwMDAwMDAwMDAwMDAEDAwMFBAUJBgYJDQsJCw0PDg4ODg8PDAwMDAwPDwwMDAwMDA8MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwM/8AAEQgAEAAQAwERAAIRAQMRAf/EAG8AAAMBAAAAAAAAAAAAAAAAAAQFBggBAAIDAAAAAAAAAAAAAAAAAAMEBQcIEAABBAEDBAMAAAAAAAAAAAABAgMEBQYAERIhMUEHYSIUEQACAgAGAgMBAAAAAAAAAAABAhEDACFREgQFMUFhoRQi/9oADAMBAAIRAxEAPwDWfripp7WwyFy7q13MWmoZtmzXIecYLr0ct8U82vsN+RGq06+pHZt67gqkxMZiNMaH73k3U11ip9hexV3QDAafRywd7BxuorKfDchrKaXjLmTtTVS8cmPl9TP5HUIQ8hTiUOcHgokch46EjronP46IldiqV3T/ACTMQfOsH5wHpOfdddfRY62CsrDqIncCSDBIlYzjXPCbBMsGHy76ehyUxNn0kuvq5UTYLZlPFBbcKipJSElPUjc/Gg8LlfnZmzkqQI9E4a7jrf3pWhAKrYrMD4KiZHg64mLW4tr2WqfdWcq1mrASqVLdW85xHZIUskgDwOw0tbc9rbnJJ+c8SHG4tXGTZUgVdAAB9Y//2Q==',

  destinationTypes = {
    THUMB_URL_AND_FILE_URI: -1, // 非cordova自带类型, 返回略缩图和原图的url的json对象
    DATA_URL: 0, // Return image as base64-encoded string
    FILE_URI: 1, // Return image file URI
    NATIVE_URI: 2 // Return image native URI (e.g. assets-library:// on iOS or content:// on Android)
  }


if (!factory.product) {
  window.Camera = {};
  Camera.DestinationType = {
    THUMB_URL_AND_FILE_URI: -1, // 非cordova自带类型, 返回略缩图和原图的url的json对象
    DATA_URL: 0, // Return image as base64-encoded string
    FILE_URI: 1, // Return image file URI
    NATIVE_URI: 2 // Return image native URI (e.g. assets-library:// on iOS or content:// on Android)
  }
  Camera.PictureSourceType = {
    PHOTOLIBRARY: 0,
    CAMERA: 1,
    SAVEDPHOTOALBUM: 2
  }
  Camera.EncodingType = {
    JPEG: 0, // Return JPEG encoded image
    PNG: 1 // Return PNG encoded image
  }
  Camera.MediaType = {
    PICTURE: 0, // allow selection of still pictures only. DEFAULT. Will return format specified via DestinationType
    VIDEO: 1, // allow selection of video only, WILL ALWAYS RETURN FILE_URI
    ALLMEDIA: 2 // allow selection from all media types
  }
  Camera.Direction = {
    BACK: 0, // Use the back-facing camera
    FRONT: 1 // Use the front-facing camera
  }
}

var getPicture = function(type, params, feedback) {
  params = params || {}
  var quality = params.hasOwnProperty('quality') ? params.quality : 75
  var allowEdit = params.hasOwnProperty('allowEdit') ? params.allowEdit : false
  var saveToPhotoAlbum = params.hasOwnProperty('saveToPhotoAlbum') ? params.saveToPhotoAlbum : false


  if (!CONFIG.isNative) {
    feedback({
      base64Code: imgDefaultBase64Code,
      base64Url: imgPackageHeader + imgDefaultBase64Code
    })
  } else {
    // jpg格式，宽度：358像素，高度：441像素；文件不小于9KB，不大于20KB。
    factory.getPicture({
        quality: quality,
        destinationType: 0,
        allowEdit: allowEdit,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 358,
        targetHeight: 441,
        saveToPhotoAlbum: saveToPhotoAlbum,
        sourceType: type,
        mediaType: Camera.MediaType.PICTURE,
        correctOrientation: true,
        cameraDirection: Camera.Direction.BACK
    }).then(function(data) {
      feedback({
        base64Code: data,
        base64Url: imgPackageHeader + data
      })
    }, function(data) {
      console.log(data)
    });
  }
};

var selectPicture = function(key, feedback) {
  var
    maxNum = 1,
    isSingle = true,
    quality = 75,
    allowEdit = true,
    saveToPhotoAlbum = false,
    noneSelect = false,
    widthRate = 1,
    heightRate = 1,
    maxWidth = 720,
    maxHeight = 1280

  var params = {
    isSingle: isSingle,
    maxNum: maxNum,
    quality: quality,
    allowEdit: allowEdit,
    saveToPhotoAlbum: saveToPhotoAlbum,
    noneSelect: noneSelect,
    widthRate: widthRate,
    heightRate: heightRate,
    maxWidth: maxWidth,
    maxHeight: maxHeight
  };

  if (key === '1') {
    getPicture(Camera.PictureSourceType.CAMERA, params, feedback)
  } else if (key === '2') {
    getPicture(Camera.PictureSourceType.SAVEDPHOTOALBUM, params, feedback)
  }
}

var urlEncodeForBase64Code = function(base64Code) {
  return base64Code ? base64Code.replace(/\+/g, '%2B') : ''
}

export default {
  selectPicture: selectPicture,
  urlEncodeForBase64Code: urlEncodeForBase64Code
}

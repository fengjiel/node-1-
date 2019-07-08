const axios = require('axios');
var fs = require('fs'); //文件模块
var path = require('path'); //系统路径模块
var file = path.join(__dirname, 'video.json'); 
var cheerio = require("cheerio");
var charset = require("superagent-charset");
var agent = require("superagent");


var commonData
charset(agent); 
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
async function sleep(times) {
  await setTimeout(function () {},times)
}
//读取json文件
fs.readFile(file, 'utf-8', function(err, data) {
    if (err) {
        res.send('文件读取失败');
    } else {
        getTagMsg(JSON.parse(data))     
    }
});
function fileWrite(data) {
  fs.open("video2.json", "w+", function(err, fd) {
      if (err) { console.error(err)}
      fs.writeFile(fd, data, function(err) {
        if (err) {
          fileWrite(data)
          return console.error(err);
        }
      });  
      fs.close(fd, function(err) {
          if (err) {
            console.log(err)
            fileWrite(data)
          }
      });
  });
}
function setmessageUrl(name) {
   return `http://api.qq0pp.cn/api?name=${encodeURI(name)}`
}
function getParenthesesStr(text) {
  let result = ''
  if (isObjEmpty(text))
      return result
  let regex = /\((.+?)\)/g;
  let options = text.match(regex)
  if (!isObjEmpty(options)) {
      let option = options[0]
      if (!isObjEmpty(option)) {
          result = option.substring(1, option.length - 1)
      }
  }
  return result
}
async function getTagMsg(data) {
    commonData = data
    let i = 0
    for (let doc of Object.keys(data)) {
      i++
      await getDetails(commonData[doc], i === Object.keys(data).length, i);
    }
    
}
const getDetails = async function(el, iseEnd, index) {
  var html = '';
  await new Promise((resolve, reject) => {
    console.log(el.title, index, iseEnd);
    
      axios.get(setmessageUrl(el.title))  
        .then((res) => {
          try {
            let data = res.data[0] || {}
            commonData[el.title] = {
              ...el,
              "type": data.type,
              "years": data.year,
              "area": data.area,
              grade:data.grade,
              director:data.director,
            }
          } catch (error) {
            console.log(error);
            
          }
          if(iseEnd) {
            fileWrite(JSON.stringify(commonData))
          }
          resolve()
        })
  })
}
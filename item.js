var request = require('request')
var cheerio = require('cheerio')
var iconv = require('iconv-lite');

const headers = {
  Accept:
    'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript, */*; q=0.01',
  'Accept-Encoding': 'gzip, deflate',
  'Accept-Language': 'zh-CN,zh;q=0.9,so;q=0.8',
  Connection: 'keep-alive',
  // 'Cookie': 'live_num=; list_num=0; __jsluid=390a608fb281989b2075c67b0054b0ea; PHPSESSID=5vb2qgu03dbv0fh0k6b6d3kmm6; Hm_lvt_cef79b3bce43ff3a7baca14800e11bef=1558078622,1559293274,1559467787; HISTORY={video:[{"name":"\u5C01\u795E\u6F14\u4E49","link":"http://v.d9y.net/play.php?play=/tv/QrJvbH7lRWXoN3.html","pic":"/images/tick.png"},{"name":"\u7834\u51B0\u884C\u52A8","link":"http://v.d9y.net/play.php?play=/tv/PbZsaH7lRm0oMH.html","pic":"/images/tick.png"},{"name":"\u6597\u7F57\u5927\u9646","link":"http://v.d9y.net/play.php?play=/ct/OUPkaZ7kNY7vDj.html","pic":"/images/tick.png"},{"name":"\u53CD\u8D2A\u98CE\u66B44","link":"http://v.d9y.net/play.php?play=/m/fafnZhH5R0P2UR.html","pic":"/images/tick.png"},{"name":"\u8D85\u7EA7\u98DE\u4FA0 \u7B2C\u516D\u5B63","link":"http://v.d9y.net/play.php?play=/ct/O0Llap7lMIWvDD.html","pic":"/images/tick.png"},{"name":"\u6BD4\u60B2\u4F24\u66F4\u60B2\u4F24\u7684\u6545\u4E8B","link":"http://v.d9y.net/play.php?play=/m/f6jiZxH5R0HAUR.html","pic":"/images/tick.png"},{"name":"\u706B\u661F\u60C5\u62A5\u5C40 \u7B2C\u56DB\u5B63","link":"http://v.d9y.net/play.php?play=/va/ZcEra3Ny7ZM2DT.html","pic":"/images/tick.png"},{"name":"\u590D\u4EC7\u8005\u8054\u76DF4\uFF1A\u7EC8\u5C40\u4E4B\u6218","link":"http://v.d9y.net/bplay.php?play=167","pic":"/images/tick.png"}]}; Hm_lpvt_cef79b3bce43ff3a7baca14800e11bef=1559469106',
  Host: 'v.d9y.net',
  Referer: 'http://v.d9y.net',
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.108 Safari/537.36',
  'X-Requested-With': 'XMLHttpRequest'
}

request(
  {
    url: 'http://v.d9y.net/vod/tv/QrJvbH7lRWXoN3.html', // 请求的URL
    method: 'GET', // 请求方法
    headers: headers
  },
  function(error, response, body) {
    if (!error && response.statusCode == 200) {
      dataPraseDolphin(body)
    } else {
      console.log(error)
    }
  }
)
function dataPraseDolphin(body) {
  // console.log(body);
  // let html = iconv.decode(Buffer.concat(chunks), 'gb2312');
  // let $ = cheerio.load(body, { decodeEntities: false })
  // // var $ = cheerio.load(html);
  // console.log($('#xlu .btn').length)

  var buf =  iconv.decode(body, 'utf8');
  console.log(buf);
  // console.log('-----------------------------');
  // console.log(body);
  
  
  
  var $=cheerio.load(buf);
  console.log($('#xlu .btn').length)
}

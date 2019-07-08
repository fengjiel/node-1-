var fs = require("fs");
var cheerio = require("cheerio");
var charset = require("superagent-charset");
var agent = require("superagent");
charset(agent); 
let lastPage = 25
let pages = 0
let baseUrl = 'http://v.d9y.net/'
let listUrl = 'http://v.d9y.net/movie.php?m=/dianying/list.php?rank=rankhot&page='

let testObj = {}
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

async function sleep(times) {
  await setTimeout(function () {},times)
}

function file(data) {
  fs.open("video.json", "w+", function(err, fd) {
      if (err) { console.error(err)}
      fs.writeFile(fd, data, function(err) {if (err) {return console.error(err);}});  
      fs.close(fd, function(err) {
          if (err) {
            console.log(err)
            file(data)
          }
          console.log("文件关闭成功");
      });
  });
}

const getDetails = async function(url, titles, advertising, protagonist) {
  var html = '';
  await agent.get(baseUrl + url).charset('utf8').end((err, res) => {
      html = res.text;
      var $ = cheerio.load(html);  // 采用cheerio模块解析html
      let videoUrl = []
      $('.num-tab-main a').each(i =>{
        videoUrl.push({
          type:$('.num-tab-main a').eq(i).text(),
          url:$('.num-tab-main a').eq(i)[0].attribs.href
        })
      })
      process.nextTick(() => {
        let obj = {
          advertising,
          introduce:$('#list3 > div > div > p').text(),
          title:titles,
          url,
          protagonist,
          videoUrl,
          type:[],
          year:'',
          area:''
        }
        testObj.push(obj)    
        console.log('写入：' + titles);
            
        file(JSON.stringify(testObj))
      })
      
  })
}
const getPageList = async (url) => {
    var html = '';
    url+=pages
    await agent.get(url).charset('utf8').end((err, res) => {
        html = res.text;
        var $ = cheerio.load(html);  // 采用cheerio模块解析html
        let list = $('.hy-video-list ul>div>a')
        asyncForEach(list, async (x, index) => {
          await sleep(5000)
          let advertising = $(x).attr('data-original')
          let titles = $(x).attr('title')
          let protagonist = $(x).next().next().text()
          await getDetails(x.attribs.href, titles,  advertising, protagonist)
        })
    })
}
// getPageList(listUrl)

const init = () => {
  pages++
  console.log(pages + '页----------' );
  getPageList(listUrl)
  setTimeout( () => {
    if(pages < lastPage+1) {
      init()
    }
  }, 30000)
}
init()
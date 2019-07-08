const fs = require("fs");
const cheerio = require("cheerio");
const charset = require("superagent-charset");
const agent = require("superagent");
charset(agent);

let lastPage = 25
let pages = 0
let baseUrl = 'http://v.d9y.net/'
let listUrl = 'http://v.d9y.net/zongyi.php?m=/zongyi/list.php?cat=all&page='
let testObj = {}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

async function sleep(times) {
  await setTimeout(function () {}, times)
}

function file(data) {
  fs.open("variety.json", "w+", function (err, fd) {
    if (err) {
      console.error(err)
    }
    fs.writeFile(fd, data, function (err) {
      if (err) {
        file(data)
        return console.error(err);
      }
    });
    fs.close(fd, function (err) {
      if (err) {
        console.log(err)
        file(data)
      }      
      console.log("文件关闭成功");
    });
  });
}

const getDetails = async function (url, titles, advertising, protagonist) {
  var html = '';
  await agent
    .get(baseUrl + url)
    .set("X-Forwarded-For", "163.204.240.24")
    .charset('utf8')
    .end((err, res) => {
      html = res.text;
      var $ = cheerio.load(html); // 采用cheerio模块解析html
      let videoUrl = []
      $('#dianshijua .panel').each(i => {
        let el = $('#dianshijua .panel').eq(i)
        let obj = {
          type: el.find('a.option').text(),
          url: []
        }
        el.find('.num-tab-main>a').each(z => {
          console.log();
          let num = el.find('.num-tab-main>a').eq(z).attr('data-num')
          obj.url.push({
            img:$(el).find('img').attr('src'),
            num,
            details: el.find('.num-tab-main>a').eq(z).text().replace(num, ''),
            url: el.find('.num-tab-main>a').eq(z)[0].attribs.href || el.find('.num-tab-main>a').eq(z)[0].attribs['data-href'] 
          })
        })
        if(obj.type) {
          videoUrl.push(obj)
        }
      })
      process.nextTick(() => {
        let obj = {
          advertising,
          introduce: $('#list3 > div > div > p').text(),
          title: titles,
          url,
          protagonist,
          videoUrl
        }
        testObj[titles] = obj
        console.log('写入：' + titles + '-------' + testObj.length);        
        file(JSON.stringify(testObj))\ 
      })

    })
}
const getPageList = async (url) => {
  var html = '';
  url += pages
  await agent
    .get(url)
    .charset('utf8')
    .end((err, res) => {
      html = res.text;
      var $ = cheerio.load(html); // 采用cheerio模块解析html        
      let list = $('.hy-video-list ul>div>a')
      asyncForEach(list, async (x, index) => {
        await sleep(5000)
        let advertising = $(x).attr('data-original')
        let titles = $(x).attr('title')
        let protagonist = $(x).next().next().text()
        await getDetails(x.attribs.href, titles, advertising, protagonist)
      })
    })
}
getPageList(listUrl)

const init = () => {
  pages++
  console.log(pages + '页----------' );
  
  getPageList(listUrl)
  setTimeout( () => {
    // 
    if(pages < lastPage) {
      init()
    }
  }, 20000)
}
init()

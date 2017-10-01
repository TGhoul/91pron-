let request = require('request');
let cheerio = require('cheerio');
let fs = require('fs');
let filename;
let mp4url;
let src;
// 此处为91pron的首页地址,这里一定要输入首页地址,否则后面全部无法解析,这里的地址不一定是对的,毕竟总换
let Url = 'http://www.91porn.com/index.php'
request({url: Url}, function (err, res, body) {
    if (err) {
        console.log(err)
    } else {
        let $ = cheerio.load(body)
        let href = $('#navcontainer li:nth-child(3) a').attr('href')
        // 此处的j控制爬取页面数,可以自己更改
        for (let j = 1; j < 2; j++) {
            let Href = href + '&page=' + j
            request({url: Href}, function (err, res, body) {
                if (err) {
                    console.log(err)
                } else {
                    let $ = cheerio.load(body)
                    let videoUrl = $('#videobox .listchannel>div>a')
                    // let videoName = $('#videobox .listchannel>div>a>img')
                    // 控制爬取每页的视频数量,每页有20个视频
                    for (let i = 0; i < 20; i++) {

                        let mp4url = videoUrl[i].attribs.href;
                        // console.log(mp4url)
                        // 解析视频的真实地址
                        // setTimeout(jiexi(mp4url),1000)
                        // function jiexi(url) {

                     
                        let randomIp = Math.floor(Math.random()*255) + '.' + Math.floor(Math.random()*255) + '.' + Math.floor(Math.random()*255)
                
                        console.log(randomIp)
                        let referer = 'http://91.91p17.space/v.php?next=watch'
                        request({
                            url: mp4url,
                            // 此处为设置代理,这里的代理需要自己去爬,我做了测试,西祠代理的质量不高,基本不能用,代理请自己搞定
                            method: 'GET',
                            headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36','X-Forwarded-For':randomIp,'referer':referer}
                        }, function (err, response, body) {
                            // console.log(response)
                            console.log(err)
                            let $ = cheerio.load(body)
                            let src = $('source').attr('src')
                            console.log(src)
                            let name = $('#videodetails-content a span').text()
                            let filename = name
                            save(filename, src)
                        })
                        //   }
                    }
                    // 在data目录下存储解析的视频地址,文件名为发布者姓名
                    // 运行时如果报错,请自己建立data目录
                    function save(x, y) {
                        let line;
                        name = x;
                        src = y;
                        line = `${name.replace(/\n/g, '')},${src}`;
                        // line = src;
                        // fs.appendFile(x, y, function (err) {
                        //     if (err) {
                        //         console.log(err)
                        //     } else {
                        //         console.log('The "data to append" was appended to file!');
                        //     }
                        // });
                        fs.appendFile('./data/url.csv', `${line}\n`, 'utf8', (err) => {
                            if (err) {
                                console.log(err)
                            } else {
                                console.log('suceeess')
                            }
                            
                        });

                    }
                }
            })
        }
    }
})
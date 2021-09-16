const dotenv = require('dotenv');
const path = require('path');
const axios = require('axios').default

dotenv.config({path: path.join(__dirname, '../.env')})
const BIGKINDS_APIKEY = process.env.BIGKINDS_APIKEY


function apiRquester(url, argument){
    const access_key = BIGKINDS_APIKEY
    const config = {
        baseURL : "http://tools.kinds.or.kr:8888",
        url : url,
        method : 'post',
        data : {
            access_key,
            argument,
        }
    }
    
    axios(config).then(res=>console.log(res))
}


apiRquester('/search/news', {
    "query": "서비스 AND 출시",
    "published_at": {
        "from": "2019-01-01",
        "until": "2019-03-31",
    },
})

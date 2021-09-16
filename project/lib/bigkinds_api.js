const dotenv = require('dotenv');
const path = require('path');
const axios = require('axios').default
const utils = require('./utils');

dotenv.config({path: path.join(__dirname, '../.env')})
const BIGKINDS_APIKEY = process.env.BIGKINDS_APIKEY


async function apiRquester(url, argument){
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
    return axios(config)
}

/* 뉴스 검색 API */
async function newsSearch(title){
    const response = await apiRquester('/search/news',  {
        "query": "서비스 AND 출시",
        "published_at": {
            "from": "2019-01-01",
            "until": "2019-03-31"
        },
        "provider": [
            "경향신문",
        ],
        "category": [
            "정치>정치일반",
            "IT_과학"
        ],
        "category_incident": [
            "범죄",
            "교통사고",
            "재해>자연재해"
        ],
        "byline": "",
        "provider_subject": [
            "경제", "부동산"
        ],
        "subject_info": [
            ""
        ],
        "subject_info1": [
            ""
        ],
        "subject_info2": [
            ""
        ],
        "subject_info3": [
            ""
        ],
        "subject_info4": [
            ""
        ],
        "sort": {"date": "desc"},
        "hilight": 200,
        "return_from": 0,
        "return_size": 5,
        "fields": [
            "byline",
            "category",
            "category_incident",
            "provider_news_id"
        ]
    });
}

/* 키워드 추출 API */
async function keywordExtract(title){
    const response = await apiRquester('/keyword',  {title});
    const result = response.data.return_object.result.title
    const keywords = result ? result.trim().split(' ') : [];
    return keywords
}

async function topN(body){
    const response = await apiRquester('/topn_keyword', body);
    const result = response.data.return_object.result
    return result
}


module.exports = {keywordExtract}

//************ test field ************//
async function main(){
    // const keywords = await keywordExtract('올해 안에 삼성전자에 취업하기')
    // console.log(keywords);
    const result = await topN({
        date_hour : '2021091600'
    })
    console.log(utils.deepJSONstring(result))
}
main();
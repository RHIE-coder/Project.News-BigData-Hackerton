const express = require('express');
const app = express();
const path = require('path');
const { serverConfig } = require("./config/configurations");

// View Setting
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile)
app.set('views', path.join(__dirname, 'views'))

// Static
app.use('/static', express.static(path.join(__dirname, 'public')))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Parsing
app.use(express.urlencoded({extended : true}))
app.use(express.json())

// Request Logging on Console
app.use("/", (req,res)=>{
    console.log({
        method : req.method,
        url : req.url,
    });
    req.next();
})

/* 
 1. Database 연동
 2. 동적으로 DB 스키마 생성
 3. 세션 및 쿠키 설정 및 결정
 4. passport
 5. 동적 Router importing
*/

app.use(require('./routes/views'))
app.use(require('./routes/main'))

app.listen(serverConfig.port, ()=>{
    console.log(`app listening at http://localhost:${serverConfig.port}`)
}) 
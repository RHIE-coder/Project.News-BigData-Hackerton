const express = require('express')
const app = express()
const https = require('https')
const path = require('path')
const cookieParser = require('cookie-parser');
const client_session = require('cookie-session')
const server_session = require('express-session');
const helmet = require('helmet')
const { serverConfig,uploadConfig } = require('./config/configurations')
const database = require("./database/mongodb")
const FileStore = require('session-file-store')(server_session); /* TEST */
const favicon = require('serve-favicon'); 

// View Setting
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.set('views', path.join(__dirname, 'views'));

// Static
app.use('/static', express.static(path.join(__dirname, 'public')))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

/* 
var expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
app.use(client_session({
    name: 'session',
    keys: ['key1', 'key2'],
    cookie: {
      secure: true,
      httpOnly: true,
    //   domain: 'localhost',
      path: '/',
      expires: expiryDate
    }
})) 
*/

app.use(server_session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: false,
  }))

  
// Helmet
app.use(helmet());

// Passport
const passport = require('passport');
const flash = require('connect-flash'); //passport의 플래시 메시지가 사용하는  기능
const immigration = require('./lib/immigration')

// Passport
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
immigration.init(passport);


// Request Logging on Console
app.use("/",(req,res)=>{
    console.log({
        method: req.method, 
        url: req.url
    });
    req.next()
})

// favicon
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// Database
database.init(app, serverConfig);

/************************************************/
app.use('/', require('./routes/views'));
app.use('/', require('./routes/main')(passport));
app.use('/me', require('./routes/user'));
/************************************************/
/*************************Utils Methods SaveZone*************************/
async function saveCircularJSON(circular_data){
    let cache = [];
    const data = JSON.stringify(circular_data, (key, value) => {
        if (typeof value === 'object' && value !== null) {
            // Duplicate reference found, discard key
            if (cache.includes(value)) return;

            // Store value in our collection
            cache.push(value);
        }
        return value;
    }, 2);
    cache = null; // Enable garbage collection
    return data;
}
/************************************************************************/
/*************************Sample Section*************************/
const multipartEx = require("./routes/example/multer")
multipartEx.setting(app, uploadConfig);
/****************************************************************/
/*
https.createServer(serverConfig.httpsOpts, app).listen(serverConfig.port, () => {
    console.log(`app listening at https://localhost:${serverConfig.port}`);
});
*/
app.listen(serverConfig.port, () => {
    console.log(`app listening at http://localhost:${serverConfig.port}`);
});

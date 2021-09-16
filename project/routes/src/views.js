const router = require('express').Router()
const {
    if_logined_redirect_home,
    if_not_logined_redirect_login,
} = require("../../middleware/access_control")

module.exports = {
    routers,
}

function routers(){
    router.get('/', (req,res)=>{
        res.render('index')
    })
    
    router.get('/login', if_logined_redirect_home, (req,res)=>{
        res.render('login')
    })
    
    router.get('/signup', if_logined_redirect_home, (req,res)=>{
        res.render('signup')
    })
    
    router.get('/profile', if_not_logined_redirect_login, (req,res)=>{
        res.render('profile')
    })

    router.get('/multipart', (req,res)=>{
        res.render('multipart')
    })

    return router
}
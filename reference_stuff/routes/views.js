const express = require('express');
const router = express.Router();
const {logined_redirect_home,not_logined_redirect_login} = require("../middleware/access_control")

//메인화면
router.get('/',(req,res)=>{
    res.render('index.html')
})

//로그인화면
router.get('/login',logined_redirect_home, (req,res)=>{
    console.log(req.session)
    console.log(req.user)
    res.render('login.html')
})

//회원가입화면
router.get('/signup',logined_redirect_home, (req,res)=>{
    res.render('signup.html')
})

//프로파일화면
router.get('/profile',not_logined_redirect_login, (req,res)=>{
    res.render('profile.html')
})

module.exports = router
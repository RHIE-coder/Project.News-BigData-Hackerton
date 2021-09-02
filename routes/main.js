const express = require('express');
const router = express.Router();
const {logined_redirect_home,not_logined_redirect_login} = require("../middleware/access_control")

module.exports = function (passport) {
    // router.post('/login',function (req, res, next) {
    //     passport.authenticate('local-login', function (err, user, info) {
    //         if (err) { return next(err); }
    //         if (!user) { return res.redirect('/login'); }
    //         return req.login(user, loginError => {
    //             if (loginError) {
    //               console.error(loginError);
    //             }
    //           });
    //     })(req, res, next);
    // });

    router.post('/login',passport.authenticate('local-login',{
        successRedirect: '/',
        failureRedirect: '/login',
    }));

    router.post('/signup',passport.authenticate('local-signup', {
        successRedirect: '/',
        failureRedirect: '/signup',
    }));

    router.post('/check/login', (req,res)=>{
        const isLogin = req.isAuthenticated();
        res.send({isLogin});
    });

    return router;
}
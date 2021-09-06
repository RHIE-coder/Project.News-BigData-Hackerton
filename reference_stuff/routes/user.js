const express = require('express');
const router = express.Router();
const {not_logined_redirect_login} = require("../middleware/access_control")

router.use(not_logined_redirect_login);

router.get('/test/access', (req,res)=>{
    const message = "success"
    res.send({message})
})

module.exports = router;
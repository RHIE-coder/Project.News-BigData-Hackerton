const router = require('express').Router()

module.exports = {
    path : "/test",
    routers,
}

function routers(){

    router.get('/1',(req,res)=>{
        res.send("1111")
    })

    router.get('/2',(req,res)=>{
        res.send("2222")
    })

    return router
}

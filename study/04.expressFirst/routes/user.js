const express = require("express")
const router = express.Router()

router.get("/test", (req,res)=>{
    res.send("hello world!!");
})

router.get("/test2", (req,res)=>{
    res.send("Bye world!!");
})

module.exports = router
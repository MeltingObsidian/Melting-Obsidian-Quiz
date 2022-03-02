const express = require('express')
const path = require('path')

var router = express.Router()

router.use(express.static(path.join(__dirname)))

router.get('/', (req, res) =>{
    console.log("hello world")
    res.render('signIn.ejs')
})

module.exports = router
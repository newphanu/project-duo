const express = require('express')
const router = express.Router()
const db = require("./db.js")
module.exports = router

//http:localhost:7000/list
router.get('/', (req, res) => {
    console.log('show data')
    res.send('show data') 
})

//let db = req.db
router.get('/list', async (req, res) => {
    console.log('list')
    let row = await db('student')
    console.log(row)
    res.send({
        status: 'ok',
        row: row
    })
})
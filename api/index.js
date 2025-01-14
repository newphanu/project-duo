const express = require("express");
const app = express();

app.use((req, res, next) => {
   console.log('welcome')
   next()
})

app.use('/student', require('./student'))

app.listen(7000, () => {
    console.log('Example app listening on port 7000');
    })
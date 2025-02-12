const express = require("express");
const app = express();
const path = require('path')
const bodyParser = require('body-parser');
const cors = require('cors')
const port = 7000

app.use(express.json());
app.use(cors())
app.use(bodyParser.json());


const studentRoutes = require ('./routes/student'); //สร้างโตแปรนำเข้าไฟล์
const loginRoutes = require ('./routes/login'); //สร้างโตแปรนำเข้าไฟล์
const checkRoutes = require ('./routes/check'); //สร้างโตแปรนำเข้าไฟล์
const uploadRoutes = require ('./routes/upload'); //สร้างโตแปรนำเข้าไฟล์

app.use ('/', checkRoutes);
app.use('/', studentRoutes); 
app.use('/', loginRoutes); 
app.use ('/', uploadRoutes);

app.use('/uploads/profile', express.static(path.join(__dirname, 'uploads/profile')));

app.listen(7000, () => {
    console.log('Example app listening on port 7000');
    })
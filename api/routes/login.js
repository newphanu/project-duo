const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');
const SECRET_KEY = '123456';


// Route สำหรับการเข้าสู่ระบบ
router.post("/login", async (req, res) => {
  console.log("username & password=", req.body);
  try {
    // ตรวจสอบ username จากฐานข้อมูล
    let row = await db("student").where({ student_id: req.body.username });
    console.log('row=', row[0])
    if (row.length === 0) {
      // หากไม่มี username ในฐานข้อมูล
      return res.status(404).json({ status: 0, message: "username ไม่ถูกต้อง" });
    }
    const userFromDB = row[0]; // ดึงข้อมูลผู้ใช้จากฐานข้อมูล

    // ตรวจสอบรหัสผ่าน (เปรียบเทียบ req.body.password กับข้อมูลในฐานข้อมูล)
    if (req.body.password !== userFromDB.password) {
      return res.status(401).json({ status: 0, message: "password ไม่ถูกต้อง" });
    }

    // หาก username และ password ถูกต้อง สร้าง JWT Token
    const token = jwt.sign(
      { id: userFromDB.student_id, username: userFromDB.username, fullname: userFromDB.fullname},
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    // ส่ง token กลับไปยัง client
    return res.json({ 
      status: 1, 
      token, 
      fullname: userFromDB.fullname,
      username: userFromDB.username,
      picture: userFromDB.picture
    });
  } catch (e) {
    // จัดการข้อผิดพลาด
    console.error("Error:", e.message);
    return res.status(500).json({ ok: 0, error: e.message });
  }
});


module.exports = router;

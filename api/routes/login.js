const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');
const SECRET_KEY = '123456';


// Route สำหรับการเข้าสู่ระบบ
router.post("/login", async (req, res) => {
  console.log("username & password=", req.body);
  try {
    let userFromDB = null;
    let userType = null;

    // ค้นหาผู้ใช้ในตาราง student
    let row = await db("student").where({ student_id: req.body.username });
    if (row.length > 0) {
      userFromDB = row[0];
      userType = "student";
    } else {
      // ค้นหาผู้ใช้ในตาราง teacher
      row = await db("teacher").where({ username: req.body.username });
      if (row.length > 0) {
        userFromDB = row[0];
        userType = "teacher";
      } else {
        return res.status(404).json({ status: 0, message: "username ไม่ถูกต้อง" });
      }
    }

    // ตรวจสอบรหัสผ่าน
    if (req.body.password !== userFromDB.password) {
      return res.status(401).json({ status: 0, message: "password ไม่ถูกต้อง" });
    }

    // สร้าง JWT Token
    const tokenPayload = {
      id: userType === "student" ? userFromDB.student_id : userFromDB.teacher_id,
      username: userFromDB.username || userFromDB.student_id,
      fullname: userFromDB.fullname,
      role: userType, // เพิ่ม role เพื่อแยก student/teacher
    };

    const token = jwt.sign(tokenPayload, SECRET_KEY, { expiresIn: "1h" });

    // ส่ง token กลับไปยัง client
    return res.json({
      status: 1,
      token,
      fullname: userFromDB.fullname,
      username: userFromDB.username || userFromDB.student_id,
      picture: userFromDB.picture,
      role: userType,
    });

  } catch (e) {
    console.error("Error:", e.message);
    return res.status(500).json({ status: 0, error: e.message });
  }
});


module.exports = router;

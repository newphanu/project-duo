const express = require('express');
const router = express.Router();
const db = require('../db');


router.post('/checkUser', async (req, res) => {
    const { username } = req.body; // ดึง username จาก req.body
  
    if (!username) {
      return res.status(400).json({ status: 0, message: "กรุณาระบุ username" });
    }
  
    try {
      let row = await db("student").where({ username });
  
      if (row.length === 0) {
        return res.status(404).json({ status: 0, message: "username ไม่ถูกต้อง" });
      }
  
      const userFromDB = row[0];
  
      return res.json({ 
        status: 1, 
        message: "เรียกข้อมูลสำเร็จ", 
        user: userFromDB 
      });
    } catch (error) {
      console.error('Error querying database:', error);
      return res.status(500).json({ status: 0, message: "เกิดข้อผิดพลาด" });
    }
  });


  router.post("/check2", async (req, res) => {
    console.log("data=", req.body.payload);
    const activities = req.body.payload;
    //insert
    try {
      // ใช้ bulk insert สำหรับการ insert ข้อมูลทั้งหมดในครั้งเดียว
      await db('sttendance').insert(activities.map(activity => ({
        student_id: activity.student_id,
        status_id: activity.attendance || 3, // ถ้าไม่มี attendance ให้ตั้งค่าเป็น 1
      })));
      console.log('res=', res)
      // ส่งผลลัพธ์กลับไปยัง client เมื่อเสร็จสิ้นการ insert
      res.status(200).json({ message: "Data inserted successfully insert2" });
      // res.send('ok');
    } catch (e) {
      res.send({ status: 0, error: e.message });
    }
  });

module.exports = router;

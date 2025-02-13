const express = require('express');
const router = express.Router();
const db = require('../db');


router.post("/checkUser", async (req, res) => {
  const { username } = req.body; // ดึง username จาก req.body

  if (!username) {
    return res.status(400).json({ status: 0, message: "กรุณาระบุ username" });
  }

  try {
    let userFromDB = null;
    let userType = null;

    // ค้นหาผู้ใช้ในตาราง student
    let row = await db("student").where({ username }); // Query by username
    if (row.length > 0) {
      userFromDB = row[0];
      userType = "student";
    } else {
      // ค้นหาผู้ใช้ในตาราง teacher
      row = await db("teacher").where({ username }); // Query by username
      if (row.length > 0) {
        userFromDB = row[0];
        userType = "teacher";
      } else {
        return res.status(404).json({ status: 0, message: "username ไม่ถูกต้อง" });
      }
    }

    return res.json({
      status: 1,
      message: "เรียกข้อมูลสำเร็จ",
      user: {
        id: userType === "student" ? userFromDB.student_id : userFromDB.teacher_id,
        username: userFromDB.username,
        fullname: userFromDB.fullname,
        picture: userFromDB.picture,
        role: userType,
      },
    });
  } catch (error) {
    console.error("Error querying database:", error);
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

  router.post('/check3', async (req, res) => {
    try {
        const { payload } = req.body;
        
        for (const record of payload) {
            await db('attendance')
                .insert({
                    student_id: record.student_id,
                    attendance_date: db.raw('CURDATE()'),
                    status_id: record.attendance,
                    checkin_time: record.time,
                    method_id: 1
                })
                .onConflict(['student_id', 'attendance_date'])
                .merge(['status_id', 'checkin_time']);
        }

        res.json({
            success: true,
            message: 'บันทึกข้อมูลการเข้าแถวสำเร็จ'
        });
    } catch (error) {
        console.error('Error updating attendance:', error);
        res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูลการเข้าแถว',
            error: error.message
        });
    }
});

module.exports = router;

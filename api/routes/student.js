const express = require('express');
const router = express.Router();
const db = require('../db');
const path = require('path');
const fs = require('fs');

router.get('/attendance', async (req, res) => {
  try {
    // ดึงข้อมูลนักเรียนทั้งหมดก่อน
    const students = await db('student')
        .select('*')
        .orderBy('student_id');

    // ดึงข้อมูลการเข้าแถวของแต่ละคน
    const attendancePromises = students.map(async (student) => {
        const attendance = await db('sttendance as a')
            .select(
                'a.attendance_id',
                'a.attendance_date',
                'a.status_id',
                'a.checkin_time',
                's.status_name'
            )
            .leftJoin('status as s', 'a.status_id', 's.status_id')
            .where('a.student_id', student.student_id)
            .orderBy('a.attendance_date', 'desc');

        // นับจำนวนครั้งของแต่ละสถานะ
        const statusCounts = {
            1: 0, // มา
            2: 0, // สาย
            3: 0, // ขาด
            4: 0, // ลาป่วย
            5: 0  // ลากิจ
        };

        attendance.forEach(record => {
            if (statusCounts[record.status_id] !== undefined) {
                statusCounts[record.status_id]++;
            }
        });

        // คำนวณเปอร์เซ็นต์การเข้าแถว
        const totalDays = attendance.length;
        const presentDays = statusCounts[1] + statusCounts[2]; // มา + สาย
        const attendancePercentage = totalDays > 0 
            ? Math.round((presentDays / totalDays) * 100) 
            : 0;

        return {
            ...student,
            statusCounts,
            attendancePercentage,
            attendance,
            totalDays
        };
    });

    const results = await Promise.all(attendancePromises);

    res.json({
        success: true,
        data: results
    });
} catch (error) {
    console.error('Error in /attendance:', error);
    res.status(500).json({
        success: false,
        message: 'เกิดข้อผิดพลาดในการดึงข้อมูลการเข้าแถว',
        error: error.message,
        stack: error.stack
    });
}
});

// Get attendance summary for each student
router.get('/attendance/summary', async (req, res) => {
  try {
      const summary = await db('student as st')
          .select(
              'st.student_id',
              'st.fullname'
          )
          .leftJoin('attendance as a', 'st.student_id', 'a.student_id')
          .groupBy('st.student_id', 'st.fullname')
          .count('a.attendance_id as total_days')
          .countDistinct(db.raw('CASE WHEN a.status_id IN (1, 2) THEN a.attendance_id END as present_days'))
          .countDistinct(db.raw('CASE WHEN a.status_id = 1 THEN a.attendance_id END as on_time'))
          .countDistinct(db.raw('CASE WHEN a.status_id = 2 THEN a.attendance_id END as late'))
          .countDistinct(db.raw('CASE WHEN a.status_id = 3 THEN a.attendance_id END as absent'))
          .countDistinct(db.raw('CASE WHEN a.status_id = 4 THEN a.attendance_id END as sick_leave'))
          .countDistinct(db.raw('CASE WHEN a.status_id = 5 THEN a.attendance_id END as personal_leave'))
          .select(db.raw('ROUND((COUNT(CASE WHEN a.status_id IN (1, 2) THEN 1 END) / COUNT(a.attendance_id)) * 100, 2) as attendance_percentage'))
          .orderBy('st.student_id');

      res.json({
          success: true,
          data: summary
      });
  } catch (error) {
      console.error('Error fetching attendance summary:', error);
      res.status(500).json({
          success: false,
          message: 'เกิดข้อผิดพลาดในการดึงข้อมูลสรุปการเข้าแถว',
          error: error.message
      });
  }
});

// Record new attendance
router.post('/attendance', async (req, res) => {
  try {
      const { student_id, status_id, method_id } = req.body;

      const [newAttendance] = await db('sttendance')
          .insert({
              student_id,
              attendance_date: db.raw('CURDATE()'),
              status_id,
              checkin_time: db.raw('CURRENT_TIME()'),
              method_id
          })
          .returning('*');

      res.json({
          success: true,
          message: 'บันทึกข้อมูลการเข้าแถวสำเร็จ',
          data: newAttendance
      });
  } catch (error) {
      console.error('Error recording attendance:', error);
      res.status(500).json({
          success: false,
          message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูลการเข้าแถว',
          error: error.message
      });
  }
});

router.get('/status', async (req, res) => {
  try {
    const statusTypes = await db('status').select('*');
    res.json({
        success: true,
        data: statusTypes
    });
} catch (error) {
    console.error('Error in /status:', error);
    res.status(500).json({
        success: false,
        message: 'เกิดข้อผิดพลาดในการดึงข้อมูลสถานะ',
        error: error.message
    });
}
});

router.get('/listStudent', async (req, res) => {
    try {
      console.log('user = ', req.query)
      let row = await db('student');
      res.send({
        'status': 'ok',
        datas: row, 
      })
    } catch (error) {
      res.send({ ok: 0, error: error.messege });
    }
  })


  // API สำหรับสมัครสมาชิก
router.post('/register', async (req, res) => {
    const { fullname, student_id, username, password, room, level } = req.body;
  
    // ตรวจสอบว่าข้อมูลครบถ้วน
    if (!fullname || !student_id  || !password || !room || !level) {
      return res.status(400).json({ status: 0, message: 'Please fill all required fields.' });
    }
  
    try {
      // เข้ารหัสรหัสผ่าน
      // const hashedPassword = await bcrypt.hash(password, 10);
  
      // บันทึกข้อมูลลงในตาราง student
      const [newStudent] = await db('student')
        .insert({
          fullname,
          student_id,
          username: student_id + '@ccollege.ac.th',
          password,
          room,
          level,
        })
        .returning('*'); // PostgreSQL: ใช้ .returning('*') / MySQL: ลบ .returning('*')
  
      res.status(201).json({ status: 1, message: 'Student registered successfully.', data: newStudent });
    } catch (error) {
      if (error.code === '23505') {
        // PostgreSQL: Error code for unique violation
        return res.status(409).json({ status: 0, message: 'Student ID or Username already exists.' });
      }
      console.error('Error:', error);
      res.status(500).json({ status: 0, message: 'Internal Server Error.' });
    }
  });


  
  // API สำหรับการลบสมาชิก
  router.post('/deleteMember', async (req, res) => {
    const { student_id } = req.body; // รับ `student_id` จาก body
  
    try {
      // ค้นหาข้อมูลของสมาชิกที่ต้องการลบ
      const student = await db('student').where({ student_id }).first();
  
      if (!student) {
        return res.status(404).send({ message: 'ไม่พบข้อมูลสมาชิก' });
      }
  
      // หากมีรูปโปรไฟล์ ให้ลบไฟล์รูปโปรไฟล์ด้วย
      if (student.picture) {
        const filePath = path.join(__dirname, 'uploads/profile', student.picture);
        // ลบไฟล์จากระบบ
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error('Error deleting file:', err);
          } else {
            console.log(`Deleted file: ${filePath}`);
          }
        });
      }
  
      // ลบข้อมูลจากฐานข้อมูล
      await db('student').where({ student_id }).del();
  
      res.send({
        message: 'ลบสมาชิกสำเร็จ',
      });
    } catch (error) {
      console.error('เกิดข้อผิดพลาดขณะลบสมาชิก:', error);
      res.status(500).send({
        status: 0,
        error: error.message || 'มีบางอย่างผิดพลาด',
      });
    }
  });

  

module.exports = router;


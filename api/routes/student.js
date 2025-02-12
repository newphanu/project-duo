const express = require('express');
const router = express.Router();
const db = require('../db');
const path = require('path');
const fs = require('fs');



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


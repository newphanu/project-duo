const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require("multer");
const path = require('path');

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/profile/"); // Directory to save the uploaded files
  },
  filename: (req, file, cb) => {
    console.log('file =', file)
    cb(null, Date.now() + "-" + (file.originalname) + path.extname(file.originalname));
    console.log('filename =', file.originalname)
  },
});
const upload = multer({ storage: storage });


router.post('/upload-single', upload.single('picture'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ status: 0, message: "ไม่พบไฟล์อัปโหลด" });
      }
  
      const { username } = req.body; // รับ username
      console.log('file=', req.file);
      console.log('username=', username);
  
      // อัปเดตรูปภาพในฐานข้อมูล
      await db('student')
        .where({ username: username }) // ตรวจสอบจาก username
        .update({
          picture: req.file.filename, // อัปเดตชื่อไฟล์ที่อัปโหลด
        });
  
      res.send({
        status: 1,
        message: 'อัปโหลดไฟล์สำเร็จ',
        file: req.file.filename,
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).send({
        status: 0,
        message: 'เกิดข้อผิดพลาดในการอัปโหลดไฟล์',
        error: error.message,
      });
    }
  });

    
// API สำหรับอัปเดตข้อมูลสมาชิก
router.post('/updateMember', upload.single('picture'), async (req, res) => {
  console.log(req.body)
  try {
    const { student_id, fullname, username, password } = req.body;

    const updatedData = {
      fullname: fullname,
      username: username,
      password: password,
    };

    // ถ้ามีการอัปโหลดไฟล์รูปโปรไฟล์
    if (req.file) {
      updatedData.picture = req.file.filename;
    }

    // อัปเดตข้อมูลนักเรียนในฐานข้อมูล
    await db('student')
      .where({ student_id: student_id })
      .update(updatedData);

    res.send({
      message: 'อัปเดตข้อมูลสำเร็จ',
      data: updatedData,
    });
  } catch (error) {
    console.error('Error updating member:', error);
    res.status(500).send({
      status: 0,
      error: error.message || 'มีบางอย่างผิดพลาด',
    });
  }
});


router.post('/insertMember', upload.single('picture'), async (req, res) => {
  try {
    console.log('file=', req.file);
    console.log('username=', req.body.username);
    console.log('password=', req.body.password);
    console.log('fullname=', req.body.fullname);
    console.log('student_id=', req.body.student_id);

    // แทรกข้อมูลใหม่ในฐานข้อมูล
    let insert = await db('student')
      .insert({
        picture: req.file.filename,
        username: req.body.username,
        password: req.body.password,
        student_id: req.body.student_id,
        fullname: req.body.fullname,
      });

    res.send({
      message: 'อัปโหลดไฟล์สำเร็จ',
      file: req.file
    });
  } catch (error) {
    res.status(500).send({
      status: 0,
      error: error.message // แก้ไขจาก .messege เป็น .message
    });
  }
});
  

module.exports = router;


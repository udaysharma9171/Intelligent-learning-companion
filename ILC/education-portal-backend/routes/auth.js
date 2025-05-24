const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Teacher = require('./models/Teacher');
const Student = require('./models/Student');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET; // Store in .env file

// Teacher Registration
router.post('/register/teacher', async (req, res) => {
  // Logic for teacher registration
});

// Student Registration
router.post('/register/student', async (req, res) => {
  // Logic for student registration
});

// Login
router.post('/login', async (req, res) => {
  // Logic for login
});

module.exports = router;

const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // public 폴더 안의 HTML을 보여줌

// Neon 연결 (Render 환경변수 DATABASE_URL 사용)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// 데이터 조회 API
app.get('/api/grade-cuts', async (req, res) => {
  const { year, exam_type } = req.query;
  try {
    const query = `
      SELECT subject, grade_1, grade_2, grade_3 
      FROM grade_cuts 
      WHERE year = $1 AND exam_type = $2 
      ORDER BY id ASC`;
    const result = await pool.query(query, [year, exam_type]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB 조회 중 오류 발생' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
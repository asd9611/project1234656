const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // public 폴더 안의 index.html을 보여줌

// Neon 연결 (Render 환경변수 DATABASE_URL 사용)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

/**
 * 데이터 조회 API
 * 쿼리 파라미터: year, exam_type, subject
 */
app.get('/api/grade-cuts', async (req, res) => {
  // 프론트엔드에서 보낸 year, exam_type, subject를 모두 받습니다.
  const { year, exam_type, subject } = req.query;
  
  try {
    // SQL 쿼리에 subject 조건을 추가하여 정확한 과목 데이터만 가져옵니다.
    const query = `
      SELECT subject, grade_1, grade_2, grade_3 
      FROM grade_cuts 
      WHERE year = $1 AND exam_type = $2 AND subject = $3
      ORDER BY id ASC`;
      
    const result = await pool.query(query, [year, exam_type, subject]);
    
    // 결과 반환
    res.json(result.rows);
  } catch (err) {
    console.error('DB 조회 중 오류:', err);
    res.status(500).json({ error: 'DB 조회 중 오류 발생' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`=================================`);
  console.log(`Server running on port ${PORT}`);
  console.log(`API Endpoint: http://localhost:${PORT}/api/grade-cuts`);
  console.log(`=================================`);
});

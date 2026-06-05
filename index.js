
require('dotenv').config();

const express = require('express');
const { generateText } = require('ai');
const app = express();

const PORT = process.env.PORT || 3000;

// JSON, 폼 데이터를 사용할 수 있게 해주는 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const healthRecords = [];

function formatHealthRecords() {
  if (healthRecords.length === 0) {
    return '<p>아직 입력된 건강 데이터가 없습니다.</p>';
  }

  return `
    <table border="1" cellpadding="8" cellspacing="0">
      <thead>
        <tr>
          <th>날짜</th>
          <th>걸음 수</th>
          <th>심박수</th>
          <th>수면 시간</th>
          <th>칼로리</th>
          <th>체중</th>
        </tr>
      </thead>
      <tbody>
        ${healthRecords
          .map(record => `
            <tr>
              <td>${record.date}</td>
              <td>${record.steps}</td>
              <td>${record.heartRate || ''}</td>
              <td>${record.sleepHours || ''}</td>
              <td>${record.caloriesBurned || ''}</td>
              <td>${record.weight || ''}</td>
            </tr>
          `)
          .join('')}
      </tbody>
    </table>
  `;
}

// 기본 주소: 수동으로 건강 데이터를 입력할 수 있는 폼 제공
app.get('/', (req, res) => {
  res.send(`
    <!doctype html>
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Sports Mate - 건강 데이터 수동 입력</title>
      </head>
      <body>
        <h1>건강 데이터 수동 입력</h1>
        <p>스마트폰이나 다른 장치에서 수집한 건강 정보를 아래 폼에 직접 입력하세요.</p>
        <form action="/api/health" method="post">
          <label>날짜: <input type="date" name="date" required /></label><br /><br />
          <label>걸음 수: <input type="number" name="steps" required /></label><br /><br />
          <label>심박수: <input type="number" name="heartRate" /></label><br /><br />
          <label>수면 시간(시간): <input step="0.1" type="number" name="sleepHours" /></label><br /><br />
          <label>칼로리 소모: <input type="number" name="caloriesBurned" /></label><br /><br />
          <label>체중(kg): <input step="0.1" type="number" name="weight" /></label><br /><br />
          <button type="submit">저장</button>
        </form>
        <h2>저장된 건강 데이터</h2>
        ${formatHealthRecords()}
      </body>
    </html>
  `);
});

// 수동 입력된 건강 데이터를 받는 API
app.post('/api/health', (req, res) => {
  const { date, steps, heartRate, sleepHours, caloriesBurned, weight } = req.body;

  if (!date || !steps) {
    return res.status(400).json({ error: 'date와 steps는 필수 입력 항목입니다.' });
  }

  const record = {
    date,
    steps: Number(steps),
    heartRate: heartRate ? Number(heartRate) : undefined,
    sleepHours: sleepHours ? Number(sleepHours) : undefined,
    caloriesBurned: caloriesBurned ? Number(caloriesBurned) : undefined,
    weight: weight ? Number(weight) : undefined,
  };

  healthRecords.push(record);
  res.status(201).json({ message: '건강 데이터가 저장되었습니다.', record });
});

// 입력된 건강 데이터 전체 조회
app.get('/api/health', (req, res) => {
  res.json({ records: healthRecords });
});

// AI에게 질문을 보내는 API
app.get('/api/ai', async (req, res) => {
  try {
    const { prompt } = req.query;

    if (!prompt) {
      return res.status(400).json({
        error: 'prompt가 필요합니다.',
      });
    }

    const { text } = await generateText({
      model: 'google/gemini-3.1-flash-lite',
      prompt: prompt,
    });

    res.json({
      answer: text,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'AI 호출 중 오류가 발생했습니다.',
    });
  }
});

// 주소 뒤에 붙은 query 데이터를 받는 API
app.get('/api/data', (req, res) => {
  res.json({ received: req.query });
});

// 에러 처리
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
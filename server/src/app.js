

const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', app: 'StageCOMM API' });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/orgs', require('./routes/orgs'));
app.use('/api/layouts', require('./routes/layouts'));
app.use('/api/schedule', require('./routes/schedule'));

app.get('/invite', (req, res) => {
  const token = req.query.token;
 const expoUrl = `exp+stagecomm://join?token=${token}`;
  
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Join StageCOMM</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          background: #0f0f1a; 
          color: white; 
          font-family: Arial, sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 24px;
        }
        .card {
          background: #1e1e2e;
          border-radius: 16px;
          padding: 32px;
          max-width: 400px;
          width: 100%;
          text-align: center;
        }
        h1 { color: #4f46e5; font-size: 24px; margin-bottom: 12px; }
        p { color: #888; font-size: 15px; line-height: 1.6; margin-bottom: 24px; }
        .btn {
          display: block;
          background: #4f46e5;
          color: white;
          padding: 16px;
          border-radius: 10px;
          text-decoration: none;
          font-weight: bold;
          font-size: 16px;
          margin-bottom: 12px;
        }
        .note { color: #555; font-size: 12px; margin-top: 16px; }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>You're invited!</h1>
        <p>You've been invited to join an organisation on StageCOMM.</p>
        <a class="btn" href="${expoUrl}">Open in StageCOMM</a>
        <p class="note">Make sure you have Expo Go installed and StageCOMM open before tapping.</p>
      </div>
    </body>
    </html>
  `);
});

module.exports = app;
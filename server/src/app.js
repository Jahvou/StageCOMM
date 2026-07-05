

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
  const expoLink = `https://expo.dev/preview/update?message=final%3A+all+fixes+deployed&updateRuntimeVersion=1.0.0&createdAt=2026-06-12T04%3A10%3A46.371Z&slug=exp&projectId=4f654b8f-5f47-4a96-9535-f19b83508a8a&group=22659ef4-e3ff-42f4-ac7f-63c6b9ede3b8`;

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
        p { color: #888; font-size: 15px; line-height: 1.6; margin-bottom: 20px; }
        .token-box {
          background: #0f0f1a;
          border: 2px solid #4f46e5;
          border-radius: 12px;
          padding: 20px;
          margin: 20px 0;
        }
        .token-label { color: #888; font-size: 13px; margin-bottom: 8px; }
        .token { color: #4f46e5; font-size: 22px; font-weight: bold; letter-spacing: 2px; word-break: break-all; }
        .steps {
          text-align: left;
          margin: 20px 0;
        }
        .step {
          display: flex;
          gap: 12px;
          margin-bottom: 16px;
          align-items: flex-start;
        }
        .step-num {
          background: #4f46e5;
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: bold;
          flex-shrink: 0;
        }
        .step-text { color: #ccc; font-size: 14px; line-height: 1.5; }
        .btn {
          display: block;
          background: #4f46e5;
          color: white;
          padding: 16px;
          border-radius: 10px;
          text-decoration: none;
          font-weight: bold;
          font-size: 16px;
          margin-top: 20px;
        }
        .copy-btn {
          background: #333;
          color: #4f46e5;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 13px;
          cursor: pointer;
          margin-top: 8px;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>You're invited! 🎉</h1>
        <p>You've been invited to join an organisation on StageCOMM.</p>

        <div class="token-box">
          <p class="token-label">Your invite token</p>
          <p class="token" id="token">${token}</p>
          <button class="copy-btn" onclick="copyToken()">Copy Token</button>
        </div>

        <div class="steps">
          <div class="step">
            <div class="step-num">1</div>
            <p class="step-text">Copy your invite token above</p>
          </div>
          <div class="step">
            <div class="step-num">2</div>
            <p class="step-text">Open StageCOMM via the button below</p>
          </div>
          <div class="step">
            <div class="step-num">3</div>
            <p class="step-text">Register or log in, then tap <strong>"Join Organisation"</strong> and paste your token</p>
          </div>
        </div>

        <a class="btn" href="${expoLink}">Open StageCOMM</a>
      </div>
      <script>
        function copyToken() {
          navigator.clipboard.writeText('${token}');
          document.querySelector('.copy-btn').textContent = 'Copied!';
          setTimeout(() => document.querySelector('.copy-btn').textContent = 'Copy Token', 2000);
        }
      </script>
    </body>
    </html>
  `);
});

module.exports = app;
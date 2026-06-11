

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

module.exports = app;
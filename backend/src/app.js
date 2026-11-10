const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middlewares/error');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(`/${config.uploadDir}`, express.static(path.join(__dirname, '../', config.uploadDir)));

app.get('/api/health', (req, res) => res.json({ code: 0, message: 'ok', data: { status: 'up' } }));
app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`[smart-edu] 后端服务已启动: http://localhost:${config.port}`);
});

module.exports = app;
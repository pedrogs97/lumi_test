const express = require('express');
const cors = require('cors');
const config = require('config');
const dotenv = require('dotenv');
const dashboardRoutes = require('./routes/dashboardRoutes.js');
const faturaRoutes = require('./routes/faturaRoutes.js');
const errorHandler = require('./middleware/errorHandler.js');

dotenv.config();


const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/dashboard', dashboardRoutes);
app.use('/api/faturas', faturaRoutes);

app.use(errorHandler);

const PORT = config.get('server.port');
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;

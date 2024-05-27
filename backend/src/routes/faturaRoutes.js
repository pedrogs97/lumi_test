const express = require('express');
const { downloadFatura } = require('../controllers/faturaController.js');

const router = express.Router();

router.get('/download', downloadFatura);

module.exports = router;

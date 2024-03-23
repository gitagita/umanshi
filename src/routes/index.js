const express = require('express');
const router = express.Router();

// 테스트 api
router.use('/api', require('./api'));

// 캘린더 생성 api
router.use('/calendar/register', require('./api/calendar/register'));

module.exports = router;
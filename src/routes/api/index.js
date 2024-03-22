var express = require("express");
var router = express.Router();
var db = require('./../../../database');

var setResponse = (status, message, data) => {
  return {
    'status': status,
    'message': message,
    'data': data
  };
}

router.get("/", (req, res) => {
  const sql = "SHOW TABLES";
  db.query(
    sql, (err, result) => {
      if (err) {
        res.send(setResponse(500, "서버 내부 오류", err));
      } else {
        res.send(setResponse(200, "테이블 조회 성공", result));
      }
    }
  );
});

module.exports = router;

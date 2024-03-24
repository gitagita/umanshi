var express = require('express');
var router = express.Router();
var db = require('./../../../../database');
var template = require('./../../template');

//캘린더 일정 범위 저장
router.post("/", (req, res) => {
  const body = req.body;
  const start_dt = body.startDt;
  const end_dt = body.endDt;
  const calendar_code = body.calendarCode;

  if (calendar_code === undefined || start_dt === undefined || end_dt === undefined) {
    return res.send(template.setResponse(400, "캘린더 일정 범위 설정 실패(잘못된 요청)"));
  }

  const start_arr = start_dt.split(',');
  const end_arr = end_dt.split(',');
  const date_list = JSON.stringify({ start_dt: start_arr, end_dt: end_arr });

  const sqlCalendar = "UPDATE calendar_tb SET date_list = ? WHERE calendar_code = ?;"
  db.query(
    sqlCalendar, [date_list, calendar_code], (err, result) => {
      if (err) {
        return res.send(template.setResponse(500, "서버 내부 오류", err));
      } else {
        res.send(template.setResponse(200, "캘린더 일정 범위 저장 성공",
          {
            calendar_code: calendar_code,
            date_list: date_list
          }
        ));
      }
    }
  );
});

//특정 캘린더 정보 조회
router.get("/:calendarCode", (req, res) => {
  const calendar_code = req.params.calendarCode;

  if (calendar_code === undefined || calendar_code == ':calendarCode') {
    return res.send(template.setResponse(400, "캘린더 조회 실패(잘못된 요청)"));
  }
  
  const sqlCalendar = "SELECT calendar_code, calendar_nm, date_list FROM calendar_tb WHERE calendar_code = ?;"
  db.query(
    sqlCalendar, [calendar_code], (err, result) => {
      if (err) {
        return res.send(template.setResponse(500, "서버 내부 오류", err));
      } else {
        res.send(template.setResponse(200, "캘린더 조회 성공", result));
      }
    }
  );
});

module.exports = router;
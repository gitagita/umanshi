var express = require("express");
var router = express.Router();
var db = require('./../../../../database');
var template = require('./../../template');
var calfunc = require('./calfunc');

//캘린더 생성
router.post("/", async (req, res) => {
  const body = req.body;
  const calendar_nm = body.calendarNm;
  const user_nm = body.userNm;
  const is_leader = 1;  //1 고정
  
  if(calendar_nm === undefined || user_nm === undefined) {
    return res.send(template.setResponse(400, "캘린더 생성 실패(잘못된 요청)"));
  }

  //캘린더 랜덤 코드
  let code = await calfunc.makeCode();
  if(code.data === undefined) {
    return res.send(template.setResponse(400, "캘린더 생성 실패(코드 생성 실패)"));
  }
  let calendar_code = code.data.calendarCode;

  

  //캘린더 정보 저장
  const sqlCalendar = "INSERT INTO calendar_tb (calendar_code, calendar_nm) VALUES (?,?);";
  db.query(
    sqlCalendar, [calendar_code, calendar_nm], (err, result) => {
      if (err) {
        return res.send(template.setResponse(500, "서버 내부 오류", err));
      } else {
        //회원(리더) 정보 저장
        let calendar_id = result.insertId;  //calendar_tb PK
        const sqlSchedule = "INSERT INTO schedule_tb (calendar_id, user_nm, is_leader) VALUES (?,?,?)";
        db.query(
          sqlSchedule, [calendar_id, user_nm, is_leader], (err2, result2) => {
            if(err2) {
              return res.send(template.setResponse(500, "서버 내부 오류", err2));
            } else {
              res.send(template.setResponse(200, "캘린더 생성 성공", 
                {
                  calendarId: calendar_id,
                  calendarNm: calendar_nm,
                  calendarCode: calendar_code,
                  userNm: user_nm,
                  isLeader: true
              }));
            }
          });
      }
    }
  );
});

module.exports = router;
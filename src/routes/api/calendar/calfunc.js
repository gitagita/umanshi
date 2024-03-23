var db = require('../../../../database');
var template = require('../../template');
var crypto = require('crypto');

let calfunc = {};

calfunc.makeCode = () => {
  return new Promise((resolve, reject) => {
    //랜덤 난수 생성
    var randomBytes = crypto.randomBytes(32);
    var code = '8e2b580e18a3bb21';//randomBytes.toString('hex');

    //난수 중복 확인
    const sqlCheckUser = "SELECT calendar_code FROM calendar_tb where calendar_code = '" + code + "';";
    db.query(sqlCheckUser, (err, result) => {
      if (err) {
        resolve(template.setResponse(500, "서버 내부 오류", err));
      } else {
        if(result[0]){
          resolve(template.setResponse(201, "코드 중복 생성 오류"));
        } else {
          resolve(template.setResponse(200,"랜덤 코드 생성 성공", {'calendarCode' : code}));
        }
      }
    });
  })
}

module.exports = calfunc;
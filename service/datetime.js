function date(){
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; 
  var yyyy = today.getFullYear();
  if(dd<10)
    dd='0'+dd;
  if(mm<10)
    mm='0'+mm;
  today = dd+'/'+mm+'/'+yyyy;
  return today
}

function time(){
  var time = new Date();
  var hour =  time.getHours();
  var min =  time.getMinutes();
  if(hour<10)
    hour='0'+hour;
  if(min<10)
    min='0'+min
  time = hour+':'+min
  return time
}

function nextdatetime(){
  var date = Date.now()
  var lastday = new Date(date);
  var nextday = new Date(lastday.getFullYear(),lastday.getMonth()+1,lastday.getDate())
  let day = nextday.getDate()
  let month = nextday.getMonth()
  var d = new Date();
  var datestring = ("0" + (day)) + "-" + ("0"+(month))+ "-" +
    d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + 
    ":" + ("0" + d.getMilliseconds()).slice(-2);
    return datestring
}

function datetimeformat(){
  var d = new Date(),
  day = d.getDate(),month = d.getMonth()+1,year = d.getFullYear(),
  hour = d.getHours(),min = d.getMinutes(),sec =  d.getSeconds()
  var datestring = ( day <= 9? "0"+day:day) + "-" + (month <= 9? "0"+month:month)+ "-" +year + 
    "T" + (hour <= 9? "0"+hour:hour) + "-" + (min <= 9? "0"+min:min) + 
    "-" + (sec <= 9? "0"+sec:sec);
    return datestring

}

function sessiontimeout(){
  var date = Date.now()
  var lastday = new Date(date);
  var nextday = new Date(lastday.getFullYear(),lastday.getMonth()+1,lastday.getDate())
  day = nextday.getDate(),
  month = nextday.getMonth(), 
  hour =  lastday.getHours(),
  min =  lastday.getMinutes()
  return `${min} ${hour} ${day} ${month} *`
}


function addminutes(date,time,duration){
  let datesplit = date.split("-"),timesplit = time.split(":"),
  olddate = new Date(datesplit[0], datesplit[1], datesplit[2], timesplit[0], timesplit[1]),
  min = new Date(olddate.getTime() + duration*60000),
  hh =min.getHours(),mm = min.getMinutes()
  if ( hh < 10)
    hh = '0'+hh
  if (mm < 10) {
    mm = '0'+mm
  }
  return hh+':'+mm
}

// let d = new Date(Date.now()).toLocaleString(); //แสดงวันที่และเวลา 2018-5-31 16:30:00

module.exports = {
  date,time,nextdatetime,sessiontimeout,addminutes,datetimeformat
}


'use strict';
const { createLogger, format, transports } = require('winston');
const fs = require('fs');
const path = require('path');
const { type } = require('os');

const env = process.env.NODE_ENV || 'development';
const logDir = 'log';

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const filename = path.join(logDir, date()+'.log');

function date(){
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; 
  var yyyy = today.getFullYear();
  if(dd<10)
    dd='0'+dd;
  if(mm<10)
    mm='0'+mm;
  today = dd+'-'+mm+'-'+yyyy;
  return today
}


function info(message){
  const logger = createLogger({
    // change level if in dev environment versus production
    level: env === 'development' ? 'debug' : 'info',
    format: format.combine(
      format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      format.printf(info => `{"datetime":"${info.timestamp}","level":"${info.level}","message":"${info.message}"}`)
    ),
    transports: [
      new transports.Console({
        level: 'info',
        format: format.combine(
          format.colorize(),
          format.printf(
            info => `${info.timestamp}: ${info.level}: ${info.message}`
          )
        )
      }),
      new transports.File({ filename }),
      new transports.File({ filename: 'log/main.log' }),    
    ]
  });
}

function warn(message){
  const logger = createLogger({
    // change level if in dev environment versus production
    level: env === 'development' ? 'debug' : 'info',
    format: format.combine(
      format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      format.printf(info => `{"datetime":"${info.timestamp}","level":"${info.level}","message":"${info.message}"}`)
    ),
    transports: [
      new transports.Console({
        level: 'info',
        format: format.combine(
          format.colorize(),
          format.printf(
            info => `${info.timestamp}: ${info.level}: ${info.message}`
          )
        )
      }),
      new transports.File({ filename }),
      new transports.File({ filename: 'log/main.log' }),
    ]
  });
}

function error(message){
  
  const logger = createLogger({
    // change level if in dev environment versus production
    level: env === 'development' ? 'debug' : 'info',
    format: format.combine(
      format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      format.printf(info => `{"datetime":"${info.timestamp}","level":"${info.level}","message":"${info.message}"}`)
    ),
    transports: [
      new transports.Console({
        level: 'info',
        format: format.combine(
          format.colorize(),
          format.printf(
            info => `${info.timestamp}: ${info.level}: ${info.message}`
          )
        )
      }),
      new transports.File({ filename }),
      new transports.File({ filename: 'log/main.log' }),
    ]
  });
}

module.exports = {
   info,warn,error
};
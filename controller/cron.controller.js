var cron = require('node-cron');
var http = require('http');
var request = require('request');
var mailer = require('./mail.controller');
var moment = require('moment');
var ONE_HOUR = 60*60*1000;
var config = require("../config/system");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
var heartbeats;
/**
 * Schedule Heartbeats
 * @param {Object[]} heartbeats
 * @param {string} heartbeats[].url - URL you want to track
 * @param {string} heartbeats[].name - Friendly Name of URL
 * @param {string[]} heartbeats[].notify - List of email addresses to notify
 */ 
exports.scheduleHeartbeats = function(h){
  this.heartbeats = h;
  cron.schedule('* * * * *', ()=>{
    console.log('--------------------------------');
    this.heartbeats.forEach((h)=>{
      h.date = new Date();
      checkHeartbeat(h.url, (e,r)=>{
        if(e){
          console.log(h.name+'\t'+h.url+'\tfailed to register heartbeat\t'+moment().utc().format());
          handleError(h);
        }
        else{
          if(h.registeredError){
            console.log(h.name+"\t"+h.url+"\tregained heartbeat\t"+moment().utc().format())
            mailer.sendMail(h.notify, config.mail.from, "NOTICE - "+h.name+" regained heartbeat", "This is a message to notify you that "+h.name+" has regained its heartbeat at "+moment(h.date).utc().format(), "", ()=>{});
          }
          else{
            console.log(h.name+"\t"+h.url+"\tregistered heartbeat\t"+moment().utc().format())
          }
          h.registeredError = false;
        }
      })
    })
  })
}

exports.getHeartbeats = function(callback){
  callback(null,this.heartbeats);
}

//Private Functions

/**
 * Check a heartbeat url
 * @param {string} url - URL to check
 * @param {callback} callback- A callback to run
 * @param {boolean} callback.error - Is an error
 * @param {boolean} callback.isOk - Is OK
 */
function checkHeartbeat(url, callback){
  request(url, (e,r,b)=>{
    if(e){
      callback(true, false);
    }
    else{
      callback(false, true);
    }
  })
}

/**
 * Handle a heartbeat error
 * @param {Object} heartbeat object
 */
function handleError(h){
  if(h.registeredError){
    //TODO: Check to see if sufficeient time has bassed since last notification
    if(h.date){
      var d = new Date().getTime()
      var htime = new Date(h.date).getTime()
      if((d - htime) > ONE_HOUR){
        console.log(h.name+" - has gone a full hour offline since last notification");
        mailer.sendMail(h.notify, config.mail.from, "REMINDER - "+h.name+" lost heartbeat", prepareText(h), "", ()=>{})
        h.date = new Date()
      }
    }
  }
  else{
    h.registeredError = true
    h.date = new Date()
    mailer.sendMail(h.notify, config.mail.from, "URGENT - "+h.name+" lost heartbeat", prepareText(h), "", ()=>{})  
  }
}

/**
 * Prepare text email message for heartbeat error
 * @param {Object} h - heartbeat object
 * @return {string} text - text string for email notification
 */
function prepareText(h){
  var t = ""
  t+=h.name+" operating at: "+h.url+" failed to return a heartbeat\n"
  if(h.date){
    t+="Last failure notice delivered at: "+h.date
  }
  return t
}

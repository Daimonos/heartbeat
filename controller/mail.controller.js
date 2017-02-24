var mailer = require('nodemailer');
var mailConfig = require('../config/mailer');
var transport;
var directTransport = require('nodemailer-direct-transport');

if(!mailConfig.service && !mailConfig.host){
  console.log('No Mailer configured, defaulting to direct transport');
  transport = mailer.createTransport(directTransport({debug:false}));
}
else{
  transport = mailer.createTransport('SMTP', mailConfig);
}

exports.sendMail = function(to, from, subject, text, html, callback){
  var mailOptions = {
    from:from,
    to:(to instanceof Array)?to.toString():to,
    subject:subject,
    text:text,
    html:html
  };
  transport.sendMail(mailOptions, (e, k)=>{
    if(e){
      console.error(e);
    }
  });
  callback();
};
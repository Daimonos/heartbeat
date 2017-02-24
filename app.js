var controller = require('./controller/cron.controller');
var heartbeats = require('./config/heartbeats');
var cron = require('node-cron');
var http = require('http');
var config = require('./config/system');

controller.scheduleHeartbeats(heartbeats);

var server = http.createServer((req, res)=>{
  controller.getHeartbeats((e,h)=>{
    res.setHeader('Content-Type','application/json');
    res.end(JSON.stringify(h));
  });
});

server.listen(config.server.port, config.server.host);
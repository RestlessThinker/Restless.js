var http = require('http');
var express = require('express');
var path = require('path');
var sleep = require('sleep');

var api = express();
api.use(express.logger('test'));
api.use(express.json());
api.use(express.urlencoded());
api.use(express.methodOverride());
api.use(api.router)
api.use(express.errorHandler());
api.use(express.static(path.join(__dirname, 'src')));

api.get('/', function (req, res) {
  res.sendfile('src/test.html');
});

api.get('/getItem', function (req, res) {
    res.json({status: 'ok'});
});

api.get('/getItemById', function (req, res) {
    res.json({foo: 'bar'});
});

api.get('/queue1', function (req, res) {
    console.log('queue1');
    //sleep.sleep(10);
    res.json({endpoint: 'queue1'});
});

api.get('/queue2', function (req, res) {
    console.log('queue2');
    //sleep.sleep(1);
    res.json({endpoint: 'queue2'});
});

api.get('/queue3', function (req, res) {
    //console.log('queue3');
    res.json({endpoint: 'queue3'});
})

http.createServer(api).listen(3000, function () {
  console.log('\n   Express server listening on port 3000 \n');
});

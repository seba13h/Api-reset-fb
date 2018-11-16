var express = require('express');
var app = express();
var redis = require('redis');

var bodyParser  = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//end points fan pages
app.post('/controller/addFanpage', function (req, res) {
  console.log(req.body);
  res.status(200).send({ message: 'se recibe la fp'});
  let key = req.body.key;
  let fanpagesName = req.body.name;
  redisClient.sadd(key, fanpagesName);
  console.log('guardado');	
});

app.get('/controller/listAllFanpage', function (req, res){
	redisClient.smembers('fanpages',function(err, reply){
		res.send(200, {fanpages: reply});
	})
});
app.get('/controller/listFanpageError', function (req, res){
	redisClient.smembers('fanpagesError',function(err, reply){
		res.send(200, {fanpages con error: reply});
	})
});
app.get('/controller/listFanpageNoError', function (req, res){
	redisClient.smembers('fanpagesNoError',function(err, reply){
		res.send(200, {fanpages sin error: reply});
	})
});
app.get('/controller/listFanpageSinValidar', function (req, res){
	redisClient.smembers('fanpagesSinValidar',function(err, reply){
		res.send(200, {fanpages sin validar: reply});
	})
});
//end point tokens
app.post('/controller/addToken', function (req, res) {
  console.log(req.body);
  res.status(200).send({ message: 'se recibe token'});
  let key = req.body.key;
  let token = req.body.name;
  redisClient.sadd(key, token);
  console.log('token guardado');	
});

app.get('/controller/listToken', function (req, res){
	redisClient.smembers('tokens',function(err, reply){
		res.send(200, {tokens: reply});
	})
});

app.get('/controller/listTokenErroneos', function (req, res){
	redisClient.smembers('tokensErroneos',function(err, reply){
		res.send(200, {tokens con error: reply});
	})
});
//delete
app.delete('/controller/deleteFanpage/:idFp', function (req, res){
	let key = req.params.idFp;
	console.log(key);
	redisClient.DEL(key);
	console.log('borrado');
});

//conexion con redis
var redisClient = redis.createClient({
	host: 'fbredis'
});

redisClient.on('connect', function() {
    console.log('Conectado a Redis Server');
    app.listen(80, function () {
  	console.log('Server listening on port 80!');
	});
});




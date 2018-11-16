var express = require('express');
var app = express();
var redis = require('redis');

var bodyParser  = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


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




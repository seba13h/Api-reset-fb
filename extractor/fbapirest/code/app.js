var express = require('express');
var app = express();
var redis = require('redis');
var async = require('async');
var bodyParser  = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//end points fan pages

//add
app.post('/v1.0/fanpage/add', function (req, res) {
  let fanpageUrl = req.body.url;	
  let resultado = 0;
  		/*
  		*Validamos si existe en fanpages
  		*/
  		redisClient.sismember("fanpageValidadas", fanpageUrl, function (req, res){
  			if(res == 1){
  				console.log(fanpageUrl + ' es una fanpage validada');
  				res.send(200, fanpageUrl + ' es una fanpage validada' );
  				resultado = 1;
  			}else{
  				resultado = 0;
  			}
  		});
  		redisClient.sismember("fanpageNoValidadas", fanpageUrl, function (req, res){
  			if (res == 1 ){
  				console.log(fanpageUrl + ' es una fanpage no validada');
  				res.send(200, fanpageUrl + ' es una fanpage no validada' );
  				resultado = 1;	
  			}
  		});

  		redisClient.sismember("fanpageErroneas", fanpageUrl, function (req, res){
  			if (res == 1){
  				console.log(fanpageUrl + ' es una fanpage erronea');
  				res.send(200, fanpageUrl + ' es una fanpage erronea' );
  				resultado = 1;
  			}			
  		});
  		/*
  		* verifica que no existe la fanpage y la agrega
  		*/
	    if(resultado == 0){
  			redisClient.sadd('fanpagesNoValidadas', fanpageUrl);
  			console.log('se agrego :' + fanpageUrl);
  			res.send(200, 'se agrego :' + fanpageUrl );
  		} 	

});

//delete
app.delete('/v1.0/fanpage/delete/:urlFp', function (req, res){
	let url = req.params.urlFp;
	
	redisClient.SREM("fanpagesValidadas", url);
	redisClient.SREM("fanpagesNoValidadas", url);
	redisClient.SREM("fanpagesErroneas", url);
	redisClient.HDEL("ErroresFanPages", url);
	console.log('borrando' + url);
	res.send(200, {mesagge: 'se borro exitosamente'} );
	
});

//Listar fan pages
app.get('/v1.0/fanpage/listAll', function (req, res){
	let arrayFanpages = [];
	redisClient.smembers('fanpagesValidadas',function(err, reply){
		arrayFanpages= arrayFanpages.concat(reply);
	});
	redisClient.smembers('fanpagesNoValidadas',function(err, reply){
		arrayFanpages= arrayFanpages.concat(reply);	
	});
	redisClient.smembers('fanpagesErroneas',function(err, reply){
		arrayFanpages= arrayFanpages.concat(reply);
		//devolver json de todas las fp	
		console.log(arrayFanpages);
		res.send(200, {arrayFanpages});
	});		
});



app.get('/v1.0/fanpage/listError', function (req, res){
	let arrayFanpages = [];
	redisClient.smembers('fanpagesError',function(err, reply){
		arrayFanpages= arrayFanpages.concat(reply);
	});
	redisClient.hgetAll('ErroresFanPages', function(err, reply){
		arrayFanpages= arrayFanpages.concat(reply);
		console.log(arrayFanpages);
		res.send(200, {arrayFanpages});
	});

	//juntar los 2 array, la idea es mostrar la fp con el error.
});



app.get('/v1.0/fanpage/listNoError', function (req, res){
	let arrayFanpages = [];
	redisClient.smembers('fanpagesValidadas',function(err, reply){
		arrayFanpages= arrayFanpages.concat(reply);
	});
	redisClient.smembers('fanpagesNoValidadas',function(err, reply){
		arrayFanpages= arrayFanpages.concat(reply);	
		console.log(arrayFanpages);
		res.send(200, {arrayFanpages});
	});
	//devolver json con fp sin errores
});

app.get('/v1.0/fanpage/listUnvalidated', function (req, res){
	redisClient.smembers('fanpagesSinValidar',function(err, reply){
		res.send(200, {fanpagessinvalidar: reply});
	});
	//devolver json con fp sin validar
});

//end point tokens
//add
app.post('/v1.0/token/add', function (req, res) {
  
  let token = req.body.token;
  let resultado = 0;
  		/*
  		*Validamos si existe en fanpages
  		*/
  		redisClient.sismember('tokenValidados', token, function (err, res){
  			if(res == 1){
  				console.log(token + ' es un token validado');
  				res.send(200, token + ' es un token validado' );
  				resultado = 1;
  			}else{
  				resultado = 0;
  			}
  		});
  		redisClient.sismember("tokenErroneos", token, function (err, res){
  			if (res == 1 ){
  				console.log(token + ' es un token erroneo');
  				res.send(200, token + ' es un token erroneo' );
  				resultado = 1;	
  			}
  		});

  		redisClient.sismember("tokenNoValidados", token, function (err, res){
  			if (res == 1){
  				console.log(token + ' es un token no validado');
  				res.send(200, token + 'es un token no validado' );
  				resultado = 1;
  			}			
  		});
  		/*
  		* verifica que no existe la fanpage y la agrega
  		*/
	    if(resultado == 0){
  			redisClient.sadd('tokenNoValidados', token);
  			console.log('se agrego :' + token);
  			res.send(200, 'se agrego :' + token );
  		}  
});

//listar
app.get('/v1.0/token/listAll', function (req, res){
	let arrayTokens = [];
	redisClient.smembers('tokenValidados',function(err, reply){
		arrayTokens= arrayTokens.concat(reply);
	});
	redisClient.smembers('tokenErroneos',function(err, reply){
		arrayTokens= arrayTokens.concat(reply);
	});
	redisClient.smembers('tokenNoValidados',function(err, reply){
		//devolver json con todos los tokens anteriores
		arrayTokens= arrayTokens.concat(reply);
		console.log(arrayTokens);
		res.send(200, {arrayTokens});
	});
	
});

app.get('/v1.0/token/listError', function (req, res){
	redisClient.smembers('tokenErroneos',function(err, reply){
		res.send(200, {reply});
	});
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




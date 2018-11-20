var express = require('express');
var app = express();
var redis = require('redis');
var async = require('async');
var bodyParser  = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/*-------------------> End points fan pages <-----------------------------
*
*                       Agrega una fanpage
*                       ==================
*/
app.post('/v1.0/fanpage/add', function (req, res) {
  let fanpageUrl = req.body.url;	
   
   async.waterfall([
  		/*
  		* Validamos si existe en fanpages
  		* resultado =  0: no existe
  		*             1: existe
  		*/	
  		function getFanpagesValidadas(cb){
  			let resultado = 0;
  			redisClient.sismember("fanpages_redis", fanpageUrl,(err, reply)=>{
  				if(reply == 1){
  					resultado = 1;
  					res.send(200, fanpageUrl + ' es una fanpage validada' );
  					return cb({error:true, mesagge: 'es una fanpage validada'});
  				}else{
  					return cb(null, resultado);
  				}
  			});
  		},
  		function getFanpagesNoValidadas(resultado,cb){
  			redisClient.sismember("fanpages_no_validadas", fanpageUrl,(err, reply)=>{
  				if (reply == 1 ){
  					resultado = 1;
  					res.send(200, fanpageUrl + ' es una fanpage no validada');
  					return cb({error:true, mesagge: 'es una fanpage no validada'});			
  				}else{
  					return cb(null, resultado);
  				}
  			});
  		},
  		function getFanpagesError(resultado,cb){
  			redisClient.sismember("fanpages_error", fanpageUrl,(err, reply)=>{
  				if (reply == 1){
  					res.send(200, fanpageUrl + ' es una fanpage erronea' );
  					resultado = 1;
  					return cb({error:true, mesagge: 'es una fanpage con error'});	
  				}else{
  					return cb(null, resultado);
  				}
  			});
  		},
  		/*
  		* Si resultado = 0 entonces agrega la fan page
  		*/
  		function addFanpages(resultado,cb){
	    	if(resultado == 0){
  				redisClient.sadd('fanpages_no_validadas', fanpageUrl);
  					res.send(200, { mesagge: 'se agrego :' + fanpageUrl });
  			} 
  		}
   	]);  		
});
/*
*                      Elimina Fanpage
*                      ===============
*
*/
app.delete('/v1.0/fanpage/delete/:urlFp', function (req, res){
	let url = req.params.urlFp;
	redisClient.SREM("fanpages_redis", url);
	redisClient.SREM("fanpages_no_validadas", url);
	redisClient.SREM("fanpages_error", url);
	redisClient.HDEL("errores_fanpages", url);
	console.log('borrando: '  + url);
	res.send(200, {mesagge: 'se borro exitosamente'} );
	
});
/*
*                  Listar fan pages
*                  ================
*/ 
app.get('/v1.0/fanpage/listAll', function (req, res){
	let arrayFanpages = [];
	
	/*
	* arrayFanpages = array que contendra todas las fanpages  
	*/

	redisClient.smembers('fanpages_redis',function(err, reply){
		arrayFanpages= arrayFanpages.concat(reply);
	});
	redisClient.smembers('fanpages_no_validadas',function(err, reply){
		arrayFanpages= arrayFanpages.concat(reply);	
	});
	redisClient.smembers('fanpages_error',function(err, reply){
		arrayFanpages= arrayFanpages.concat(reply);
	
		/*
		* Devolver json de todas las fanpages
		*/

		res.send(200, {arrayFanpages});
	});		
});

/*
*               Listar fanpages con error
*               =========================
*/

app.get('/v1.0/fanpage/listError', function (req, res){
	let arrayFanpages = [];
	
	/*
	*  ArrayFanpages = array que contendra todas las fanpages  
	*/

	redisClient.smembers('fanpages_error',function(err, reply){
		arrayFanpages= arrayFanpages.concat(reply);
	});
	redisClient.hgetAll('errores_fanpages', function(err, reply){
		arrayFanpages= arrayFanpages.concat(reply);
		console.log(arrayFanpages)
		
		res.send(200, {arrayFanpages});
	});
	
	/*
	* Devolver json de las fp con error
	*/
});

/*
*               Listar las fanpages sin error 
*               =============================
*/

app.get('/v1.0/fanpage/listNoError', function (req, res){
	let arrayFanpages = [];
	/*
	* arrayFanpages contendra las fanpage sin error
	*/
	redisClient.smembers('fanpages_redis',function(err, reply){
		arrayFanpages= arrayFanpages.concat(reply);
	});
	redisClient.smembers('fanpages_no_validadas',function(err, reply){
		/*
		* Une las fansPages sin validar con las validadas y retorna un array
		*/
		arrayFanpages= arrayFanpages.concat(reply);	
		res.send(200, {arrayFanpages});
	});
});

/*
*                 Lista las fanpages no validadas
*                 ===============================
*/

app.get('/v1.0/fanpage/listUnvalidated', function (req, res){
	redisClient.smembers('fanpages_no_validadas',function(err, reply){
		/*
		* Devuelve un json con las fanspages sin validar
		*/
		res.send(200, {fanpagessinvalidar: reply});
	});
});

/*
*----------------------> End point tokens <--------------------------------
*
*                          Agregar token
*                          =============
*/

app.post('/v1.0/token/add', function (req, res) {
  
  let token = req.body.token;
  async.waterfall([
  		/*
  		*Validamos si existe token
  		*resultado =  0: no existe
  		*             1: existe
  		*/	
  		function getTokensValidadas(cb){
  			let resultado = 0;
  			redisClient.sismember('tokens_validados', token,(err, reply)=>{
  				if(reply == 1){
  					resultado = 1;
  					res.send(200, token + ' es un token validado' );
  					return cb({error:true, mesagge: 'es un token validado'});
  				}else{
  					return cb(null, resultado);
  				}
  			});
  		},
  		function getTokensNoValidadas(resultado,cb){
  			redisClient.sismember("tokens_no_validados", token,(err, reply)=>{
  				if (reply == 1 ){
  					resultado = 1;
  					res.send(200, token + ' es un token no validado');
  					return cb({error:true, mesagge: 'es un token no validado'});			
  				}else{
  					return cb(null, resultado);
  				}
  			});
  		},
  		function getTokensError(resultado,cb){
  			redisClient.sismember("tokens_error", token,(err, reply)=>{
  				if (reply == 1){
  					res.send(200, token + ' es un token erroneo' );
  					resultado = 1;
  					return cb({error:true, mesagge: 'es un token con error'});	
  				}else{
  					return cb(null, resultado);
  				}
  			});
  		},
  		/*
  		* Si resultado = 0 entonces agrega el token
  		*/
  		function addToken(resultado,cb){
	    	if(resultado == 0){
  				redisClient.sadd('tokens_no_validados', token);
  					res.send(200, { mesagge: 'se agrego :' + token });
  			} 
  		}
   	]);	     
});

/*
*                    Listar Tokens
*                    =============
*/
app.get('/v1.0/token/listAll', function (req, res){
	let arrayTokens = [];
	/*
	* arrayTokens guardara todos los tokens
	*/
	redisClient.smembers('tokens_validados',function(err, reply){
		arrayTokens= arrayTokens.concat(reply);
	});
	redisClient.smembers('tokens_error',function(err, reply){
		arrayTokens= arrayTokens.concat(reply);
	});
	redisClient.smembers('tokens_no_validados',function(err, reply){
		arrayTokens= arrayTokens.concat(reply);
	/*
	* Devuelve todos los tokens
	*/
		res.send(200, {arrayTokens});
	});
	
});

/*
*               Listar Tokens con error
*               =======================
*/

app.get('/v1.0/token/listError', function (req, res){
	/*
	* Obtiene los tokens con error
	*/
	redisClient.smembers('tokens_error',function(err, reply){
		res.send(200, {reply});
	});
});

/*
* ----------------------------> conexion con redis <----------------------------------
*/

var redisClient = redis.createClient({
	host: 'fbredis'
});
/*
*                          conexion con redis y express
*                          ============================
*/
redisClient.on('connect', function() {
    console.log('Conectado a Redis Server');
    app.listen(80, function () {
  	console.log('Server listening on port 80!');
	});
});




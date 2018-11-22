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
  res.setHeader('Content-Type', 'application/json'); 
   async.waterfall([
  		/*
  		 * Validamos si existe en fanpages
  		 * resultado =  0: no existe
  		 *             1: existe
  		 */
  		function validarRequest(cb){
  			let resultado = 0;
  			if(fanpageUrl === undefined || fanpageUrl == ""){
  				resultado = 1;
  				res.status(500).send(JSON.stringify( {mensaje: 'No ingreso una url valida'}));
  				return cb({error: true, mesagge: 'url invalida'});	
  			}else{
  				return cb(null, resultado);
  			}
  		},	
  		function getFanpagesValidadas(resultado,cb){
  			
  			redisClient.sismember("fanpages_redis", fanpageUrl,(err, reply)=>{
  				if(err){
  					console.log('\x1b[31m%s\x1b[0m', 'error2 en : ' + JSON.stringify(err));
  					return cb({ error : true, message : JSON.stringify(err), status : 500}); 
  				}else{
  					if(reply == 1){
  						resultado = 1;
  						res.status(200).send( JSON.stringify( {mensaje: fanpageUrl + ' es una fanpage validada'}) );
  						return cb({error:true, mesagge: 'es una fanpage validada'});
  					}else{
  						return cb(null, resultado);
  					}
  				}
  			});
  		},
  		function getFanpagesNoValidadas(resultado,cb){
  			redisClient.sismember("fanpages_no_validadas", fanpageUrl,(err, reply)=>{
  				if(err){
  					console.log('\x1b[31m%s\x1b[0m', 'error2 en : ' + JSON.stringify(err));
  					return cb({ error : true, message : JSON.stringify(err), status : 500});
  				}else{
  					if (reply == 1 ){
  						resultado = 1;
  						res.status(200).send(JSON.stringify( {mensaje: fanpageUrl + ' es una fanpage no validada'}));
  						return cb({error:true, mesagge: 'es una fanpage no validada'});			
  					}else{
  						return cb(null, resultado);
  					}
  				}
  			});
  		},
  		function getFanpagesError(resultado,cb){
  			redisClient.sismember("fanpages_error", fanpageUrl,(err, reply)=>{
  				if(err){
  					console.log('\x1b[31m%s\x1b[0m', 'error2 en : ' + JSON.stringify(err));
  					return cb({ error : true, message : JSON.stringify(err), status : 500});
  				}else{
  					if (reply == 1){
  						res.status(200).send(JSON.stringify({mensaje: fanpageUrl + ' es una fanpage erronea'})  );
  						resultado = 1;
  						return cb({error:true, mesagge: 'es una fanpage con error'});	
  					}else{
  						return cb(null, resultado);
  					}
  				}
  			});
  		},
  		/*
  		 * Si resultado = 0 entonces agrega la fan page
  		 */
  		function addFanpages(resultado,cb){
	    	if(resultado == 0){
  				redisClient.sadd('fanpages_no_validadas', fanpageUrl, (err, reply) =>{
  					if(err){
  					  console.log('\x1b[31m%s\x1b[0m', 'error2 en : ' + JSON.stringify(err));
  					}else{
  						res.status(200).send(JSON.stringify({ mesagge: 'se agrego :' + fanpageUrl }) );
  					}
  				});
  				
  			} 
  		}
   	]);  		
});
/*
 *                      Elimina Fanpage
 *                      ===============
 *
 */
app.post('/v1.0/fanpage/delete', function (req, res){
	let url = req.body.url;
	async.waterfall([
		function validarRequest(cb){
  			let resultado = 0;
  			if(url === undefined || url == ""){
  				resultado = 1;
  				res.status(500).send(JSON.stringify( {mensaje: 'No ingreso una url valida'}));
  				return cb({error: true, mesagge: 'url invalida'});	
  			}else{
  				return cb(null, resultado);
  			}
  		},	
  		function getFanpagesValidadas(resultado,cb){
  			redisClient.sismember("fanpages_redis", url,(err, reply)=>{
  				if(err){
  					console.log('\x1b[31m%s\x1b[0m', 'error2 en : ' + JSON.stringify(err));
  					return cb({ error : true, message : JSON.stringify(err), status : 500}); 
  				}else{
  					if(reply == 1){
  						resultado = 1;
  						res.status(200).send( JSON.stringify( {mensaje: url + ' es una fanpage validada'}) );
  						redisClient.SREM("fanpages_redis", url);
  						return cb({error:true, mesagge: 'es una fanpage validada'});
  					}else{
  						return cb(null, resultado);
  					}
  				}
  			});
  		},
  		function getFanpagesNoValidadas(resultado,cb){
  			redisClient.sismember("fanpages_no_validadas", url,(err, reply)=>{
  				if(err){
  					console.log('\x1b[31m%s\x1b[0m', 'error2 en : ' + JSON.stringify(err));
  					return cb({ error : true, message : JSON.stringify(err), status : 500});
  				}else{
  					if (reply == 1 ){
  						resultado = 1;
  						res.status(200).send(JSON.stringify( {mensaje: url + ' se borro del set fanpage no validada'}));
  						redisClient.SREM("fanpages_no_validadas", url);
  						return cb({error:true, mesagge: 'se borro una fanpage no validada'});			
  					}else{
  						return cb(null, resultado);
  					}
  				}
  			});
  		},
  		function getFanpagesError(resultado,cb){
  			redisClient.sismember("fanpages_error", url,(err, reply)=>{
  				if(err){
  					console.log('\x1b[31m%s\x1b[0m', 'error2 en : ' + JSON.stringify(err));
  					return cb({ error : true, message : JSON.stringify(err), status : 500});
  				}else{
  					if (reply == 1){
  						resultado = 1;
  						redisClient.SREM("fanpages_error", url);
  						redisClient.HDEL("descripcion_error", url);
  						res.status(200).send(JSON.stringify({mensaje:url + 'se borro del set fanpages con error'})  );
  					}else{
  						return cb(null, resultado);
  					}
  				}
  			});

  		},
  		function verificarExist(resultado,cb){
  			if (resultado == 0){
  				res.status(200).send(JSON.stringify({ mesagge: url + ' no existe' }) );	
  			} 
  		}
	]);	
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
		if(err){
			console.log('\x1b[31m%s\x1b[0m', 'error2 en : ' + JSON.stringify(err));
		}else{
			arrayFanpages= arrayFanpages.concat(reply);
		}
	});
	redisClient.smembers('fanpages_no_validadas',function(err, reply){
		if(err){
			console.log('\x1b[31m%s\x1b[0m', 'error2 en : ' + JSON.stringify(err));
		}else{
			arrayFanpages= arrayFanpages.concat(reply);	
		}
	});
	redisClient.smembers('fanpages_error',function(err, reply){
		if(err){
			console.log('\x1b[31m%s\x1b[0m', 'error2 en : ' + JSON.stringify(err));
		}else{
			arrayFanpages= arrayFanpages.concat(reply);
		/*
		 * Devolver json de todas las fanpages
		 */
			res.status(200).send(arrayFanpages);
		}
	});		
});

/*
*               Listar fanpages con error
*               =========================
*/

app.get('/v1.0/fanpage/listError', function (req, res){
	let arrayFanpages = [];
	let arrayFanpagesError = [];
	/*
	 *  ArrayFanpages = array que contendra todas las fanpages con error  
	 */
	async.waterfall([
		function getFanpagesError(cb){
			redisClient.smembers('fanpages_error',(err, reply)=>{
				if(err){
					console.log('\x1b[31m%s\x1b[0m', 'error2 en : ' + JSON.stringify(err));
					return cb ({error: true, mesagge: JSON.stringify(err), status : 500})
				}else{
					arrayFanpages= arrayFanpages.concat(reply);
					return cb(null, arrayFanpages)
				}
			});
		},
		function getDescripcionError(arrayFanpages, cb){
			let cont = 0;
			/*
			 * Recorremos el array cque contiene todas las fans page
			 * traemos los errores guardados en el hash 'errores_fanpages' de cada key (fan page con error)
			 * los resultados se van guardando en arrayFanpagesError
			 */
			arrayFanpages.forEach(function(key){
				redisClient.hget('descripcion_error', key,(err, reply)=>{
					if(err){
						console.log('\x1b[31m%s\x1b[0m', 'error2 en : ' + JSON.stringify(err));
					}else{
						arrayFanpagesError= arrayFanpagesError.concat({id: key, descrion_error: reply});	
						cont = cont + 1 ;
						if(cont === arrayFanpages.length){
							/*
							 * Devolver json de las fp con error
							 */
							res.status(200).send(arrayFanpagesError);	
						}	
					}
				});
				
			});
		}
	]);
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
		if(err){
			console.log('\x1b[31m%s\x1b[0m', 'error2 en : ' + JSON.stringify(err));
		}else{
			arrayFanpages= arrayFanpages.concat(reply);
			res.status(200).send(arrayFanpages);
		}
	});
});

/*
 *                 Lista las fanpages no validadas
 *                 ===============================
 */

app.get('/v1.0/fanpage/listUnvalidated', function (req, res){
	let fanpages = [];
	redisClient.smembers('fanpages_no_validadas',function(err, reply){
		if(err){
			console.log('\x1b[31m%s\x1b[0m', 'error2 en : ' + JSON.stringify(err));
		}else{
		/*
		 * Devuelve un json con las fanspages sin validar
		 */
		 	fanpages = fanpages.concat(reply);
			res.status(200).send(fanpages);
		}
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
  		function validarRequest(cb){
  			let resultado = 0;
  			if(token === undefined || token == ""){
  				resultado = 1;
  				res.status(500).send(JSON.stringify( {mensaje: 'No ingreso un token valido'}));
  				return cb({error: true, mesagge: 'token invalida'});	
  			}else{
  				return cb(null, resultado);
  			}
  		},	
  		function getTokensValidadas(resultado,cb){
  			redisClient.sismember('tokens_validados', token,(err, reply)=>{
  				if(err){
  					console.log('\x1b[31m%s\x1b[0m', 'error2 en : ' + JSON.stringify(err));
  					return cb({ error : true, message : JSON.stringify(err), status : 500}); 
  				}else{
  					if(reply == 1){
  						resultado = 1;
  						res.status(200).send(token + ' es un token validado' );
  						return cb({error:true, mesagge: 'es un token validado'});
  					}else{
  						return cb(null, resultado);
  					}
  				}
  			});
  		},
  		function getTokensNoValidadas(resultado,cb){
  			redisClient.sismember("tokens_no_validados", token,(err, reply)=>{
  				if(err){
  					console.log('\x1b[31m%s\x1b[0m', 'error2 en : ' + JSON.stringify(err));
  					return cb({ error : true, message : JSON.stringify(err), status : 500}); 
  				}else{
  					if (reply == 1 ){
  						resultado = 1;
  						res.status(200).send(JSON.stringify({ mensaje: token + ' es un token no validado' }) );
  						return cb({error:true, mesagge: 'es un token no validado'});			
  					}else{
  						return cb(null, resultado);
  					}
  				}
  			});
  		},
  		function getTokensError(resultado,cb){
  			redisClient.sismember("tokens_error", token,(err, reply)=>{
  				if(err){
  					console.log('\x1b[31m%s\x1b[0m', 'error2 en : ' + JSON.stringify(err));
  					return cb({ error : true, message : JSON.stringify(err), status : 500}); 
  				}else{
  					if (reply == 1){
  						res.status(200).send(JSON.stringify({ mensaje: token + ' es un token con error' }) );
  						resultado = 1;
  						return cb({error:true, mesagge: 'es un token con error'});	
  					}else{
  						return cb(null, resultado);
  					}
  				}	
  			});
  		},
  		/*
  		 * Si resultado = 0 entonces agrega el token
  		 */
  		function addToken(resultado,cb){
	    	if(resultado == 0){
  				redisClient.sadd('tokens_no_validados', token, (err, reply)=>{
  					if(err){
  						console.log('\x1b[31m%s\x1b[0m', 'error2 en : ' + JSON.stringify(err));
  					}else{
  						res.status(200).send({ mesagge: 'se agrego :' + token });
  					}
  				});	
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
		if(err){
			console.log('\x1b[31m%s\x1b[0m', 'error2 en : ' + JSON.stringify(err));
		}else{
			arrayTokens= arrayTokens.concat(reply);
		}
	});
	redisClient.smembers('tokens_error',function(err, reply){
		if(err){
			console.log('\x1b[31m%s\x1b[0m', 'error2 en : ' + JSON.stringify(err));
		}else{
			arrayTokens= arrayTokens.concat(reply);
		}
	});
	redisClient.smembers('tokens_no_validados',function(err, reply){
		if(err){
			console.log('\x1b[31m%s\x1b[0m', 'error2 en : ' + JSON.stringify(err));
		}else{
			arrayTokens= arrayTokens.concat(reply);
	/*
	 * Devuelve todos los tokens
	 */
			res.status(200).send(arrayTokens);
		}
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
		if(err){
			console.log('\x1b[31m%s\x1b[0m', 'error2 en : ' + JSON.stringify(err));
		}else{
			res.status(200).send(reply);
		}
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
    console.log('\x1b[36m%s\x1b[0m','Conectado a Redis Server');
    app.listen(7005, function (err, body) {
    	if(err){
    		console.log(JSON.stringify(err));
    	}else{
  		console.log('\x1b[35m%s\x1b[0m','Server listening on port 7005');
  		}
	});
});

redisClient.on('error', function (err) {
    console.log('Something went wrong ' + err);
});


module.exports = app; //for testing

//incluimos redis a nuestro script
var redis = require('redis');
//creamos un cliente
var redisClient = redis.createClient({
	host: 'fbredis'
});

redisClient.on('connect', function() {
    console.log('Conectado a Redis Server');
});



function addFanpage($key,$value){
	//primero validar si existe
	if(redisClient.EXISTS($key) == 0){
		//Agregar
		redisClient.sadd($key, $value);
	}		
}

function deleteFanpage($key){
	redisClient.DEL($key);
}

function listAllFanpage($key){
	//Listar
	redisClient.smember($key);
}

function listErrorFanpage($key){
	//listar fan page con errores
	redisClient.smember($key);
}
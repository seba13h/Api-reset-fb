//connect data base

var mongoose = require('mongoose');
var FAnPage = mongoose.model('FAnPage');


//Get solicitud de la BD
//listar todas las fanspage
exports.findAllFanPage = function(req,res){
	//Verifica si fanpage existe en set de fanpages validadas.
	//Verifica si fanpage existe en set de fanpages no validadas.
	//Verifica si fanpage existe en set de fanpages erróneas.
	//Agrega registro a set “fanpages no validadas” si corresponde.
	FAnPage.find(function(err, fanspages){
		if(err) res.send(500, err.message);
			console.log('GET /tvshows');
				res.status(200).jsonp(fanspages);
	});

};

//Get return a fan pages with specified ID
	exports.findById = function(req, res) {
			FanPage.findById(req.params.id, function(err, fanspages) {
    if(err) return res.send(500, err.message);

    console.log('GET /fanpages/' + req.params.id); // param id es el parametro de id que recibira la funcion
		res.status(200).jsonp(tvshow);
	});
	};
	


//POST - insert a new fanPage in the db

exports.addFanPage = function(req,res){
	console.log('POST');
	console.log(req.body);


	var fanPage = new FanPage({

		// campos fp....
		// parametros por request body

	});

	fanspages.save(function(err, fanspages){
		if(err) return res.status(500).send( err.message);
	res.status(200).jsonp(fanspages);	
	});
};


//DELETE - delete a fans page with specific ID

exports.deleteFansPage = function(req, res){
	FanPage.findById(req.params.id, function(err, fanpage){
		fanpage.remove(function(err){
			if(err) return res.status(500).send(err.message);
			res.status(200).send();
		})

	})

}
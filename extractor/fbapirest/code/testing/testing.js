
process.env.NODE_ENV = 'testing';

let chai = require('chai');
let chaiHttp = require('chai-http');
var assert = chai.assert;
var should = chai.should();
var expect = chai.expect;
var app = require('../app.js');

chai.use(chaiHttp);
/*
 *	Test /GET Fan Pages
 */
	describe('/GET fanpage', ()=>{

		it('List all fanpage', (done)=> {
			chai.request(app)
				.get('/v1.0/fanpage/listAll')
				.set('accept', 'application/json')
				.end((err, res) => {
				if(err){
					console.log('\x1b[31m%s\x1b[0m', 'error2 en : ' + JSON.stringify(err));
				}else{	
                  	res.should.have.status(200);
                  	res.body.should.be.a('object');
                  	//console.log(res.body);
              		done();
              	}
              });
		})

		it('List error fanpage and description', (done)=> {
			chai.request(app)
				.get('/v1.0/fanpage/listError')
				.set('accept', 'application/json')
				.end((err, res) => {
				  if(err){
				  	console.log('\x1b[31m%s\x1b[0m', 'error en : ' + JSON.stringify(err));
				  }else{	
                  	res.should.have.status(200);
                  	res.body.should.be.a('object');
                  	console.log(res.body);
              	   	done();
              	  }
              });
		})
		it('List No Error fanpage', (done)=> {
			chai.request(app)
				.get('/v1.0/fanpage/listNoError')
				.set('accept', 'application/json')
				.end((err, res) => {
				  if(err){
				  	console.log('\x1b[31m%s\x1b[0m', 'error2 en : ' + JSON.stringify(err));
				  }else{		
                  	res.should.have.status(200);
                  	res.body.should.be.a('object');
                 	//console.log(res.body);
              		done();
              	  }	
              });
		})
		it('List fanpage no validadas', (done)=> {
			chai.request(app)
				.get('/v1.0/fanpage/listUnvalidated')
				.set('accept', 'application/json')
				.end((err, res) => {
					if(err){
						console.log('\x1b[31m%s\x1b[0m', 'error2 en : ' + JSON.stringify(err));
					}else{
						res.should.have.status(200);
                  		res.body.should.be.a('object');
                 		//console.log(res.body);
              			done();
					}
              });
		})

	})
 /*
  * ADD AND DELETE FANPAGE
  */	
  	describe('/POST fanpage', ()=>{
		it('agregar fanpage', (done)=> {
		
			let fanpage = {
				url : "testingFanpage"
			};
			chai.request(app)
			    .post('/v1.0/fanpage/add')
			    .send(fanpage)
			    .end((err, res)=>{
			    	if(err){
						console.log('\x1b[31m%s\x1b[0m', 'error2 en : ' + JSON.stringify(err));
			    	}else{
			    		res.should.have.status(200);
                  		res.body.should.be.a('object');
            			//console.log(res.body);
            			done();
            		}	
			    })
		})
		it('eleminar fanpage', (done)=> {
		
			let fanpage = {
				url : "testingFanpage"
			};
			chai.request(app)
			    .post('/v1.0/fanpage/delete')
			    .send(fanpage)
			    .end((err, res)=>{
			    	if(err){
			    		console.log('\x1b[31m%s\x1b[0m', 'error2 en : ' + JSON.stringify(err));
			    	}else{
			    		res.should.have.status(200);
                  		res.body.should.be.a('object');
            			//console.log(res.body);
            			done();
            		}	
			    })
		})
	})

 /*
  * GET TOKEN
  */

  describe('/GET TOKEN', ()=>{

		it('List all token', (done)=> {
			chai.request(app)
				.get('/v1.0/token/listAll')
				.set('accept', 'application/json')
				.end((err, res) => {
               	if(err){
               		console.log('\x1b[31m%s\x1b[0m', 'error2 en : ' + JSON.stringify(err));
               	}else{
                  	res.should.have.status(200);
                  	res.body.should.be.a('object');
                  	//console.log(res.body);
              		done();
              	}
              });
		})

		it('List error token', (done)=> {
			chai.request(app)
				.get('/v1.0/token/listError')
				.set('accept','application/json')
				.end((err, res) => {
					if(err){
						console.log('\x1b[31m%s\x1b[0m', 'error2 en : ' + JSON.stringify(err));
					}else{	
                  		res.should.have.status(200);
                  		res.body.should.be.a('object');
                  		//console.log(res.body);
              			done();
              		}	
              });
		})
	})


 /*
  * ADD TOKEN
  */	
  	describe('/POST token', ()=>{
		it('agregar token', (done)=> {
		
			let token = {
				token : "321jh321hjgjhj21jkhg"
			};
			chai.request(app)
			    .post('/v1.0/token/add')
			    .send(token)
			    .end((err, res)=>{
			    	if(err){
			    		console.log('\x1b[31m%s\x1b[0m', 'error2 en : ' + JSON.stringify(err));
			    	}else{
			    		res.should.have.status(200);
                  		res.body.should.be.a('object');
            			//console.log(res.body);
            			done();
            		}	
			    })
		})
	})
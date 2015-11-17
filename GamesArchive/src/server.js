var mongojs = require('mongojs');

var db = mongojs('mongodb://localhost:27017/games', ['games']);


var restify = require('restify');

var server = restify.createServer();
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());


var getGameByName = function(req, res, next){
	
	var games = db.games;
	games.find({"name":req.params.name}, function (err, data) {
        res.send(200, data);
    });
};

var searchGameByName = function(req, res, next){
	
	var games = db.games;
	games.find({"name":{ $regex: new RegExp(req.params.filter, 'i') }}, function (err, data) {
        res.send(200, data);
    });	
};

var searchGameByCategory = function(req, res, next){
	
	var games = db.games;
	games.find({"categories": req.params.filter}, function (err, data) {
        res.send(200, data);
    });
};

var searchGameByScore = function(req, res, next){
	var games = db.games;
	var collectionFilter = {};
	if(req.query.operation == 'gt'){
		collectionFilter = {"score":{$gt:req.params.filter}};
	} else if(req.query.operation == 'lt'){
		collectionFilter = {"score":{$lt:req.params.filter}};
	//} else if(req.query.operation == 'between'){
		//TODO, richiederebbe due parametri
	} else {
		collectionFilter = {"score": req.params.filter};
	}
	
	games.find(collectionFilter, function (err, data) {
        res.send(200, data);
    });
};

server.get('/games/:name', getGameByName);

server.get('/games/search/:filter', searchGameByName);

server.get('/games/search/category/:filter', searchGameByCategory);

server.get('/games/search/score/:filter', searchGameByScore);

/*server.head('/hello/:name', function(req, res, next){
	
	res.send(200, "{}");
	
});*/

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});

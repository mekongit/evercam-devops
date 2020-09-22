var http = require('http');
var fs = require('fs');
var port = process.env.port || 9000;

var app = http.createServer(function(req,res){
	var number = parseInt(Math.random()*100) % 4; // from 0 to 3
	fs.readFile('./assets/snapshot'+number+'.jpg', function (err, buf) {
		if (err) return done(err)
		res.setHeader('Content-Type', 'image/jpeg')
		res.end(buf)
	})
});

app.listen(port);
console.log('Phony camera is now running on http://localhost:'+port+'/');

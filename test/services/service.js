var path = require('path');
var launch = require('../../index');

var service = launch(path.join(__dirname, '/fibonacci/index'), '127.0.0.1');

process.send('');

process.on('exit', service.server.close);
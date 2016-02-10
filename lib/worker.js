require('babel-register');

var path = process.argv[2];
var addr = process.argv[3];

require(__dirname + '/index')(path, addr);
var path = process.argv[2];
var queue = process.argv[3];
var addr = process.argv[4];

require(__dirname + '/index')(path, queue, addr);
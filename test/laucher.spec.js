var amqp = require('micro-node-amqp');
var cp = require('child_process');
var assert = require('assert');

var children = [];

// helper functions
function server(cb){

  var child = cp.exec(__dirname+'/../bin/micro   '+__dirname + '/services/fibonacci/index.js 127.0.0.1');

  children.push(child);

  cb();
}

process.on('exit', function(){

  children.forEach(function(child){

    child.kill();
  })
})

var client = amqp.client('127.0.0.1');

describe('Service Launcher', function() {

  before(server);

  it('should launch a service', function(done){

    var req = {

      jsonrpc: '2.0',
      method: 'fast',
      id: 1,
      params: [40]
    };

    client(req, function(err, result){

      assert.equal(result, 102334155);
      done(err);
    });
  })

  it('should retrun defintion', function(done){

    this.timeout(5000);

    var req = {

      jsonrpc: '2.0',
      method: '$definition',
      id: 2,
      params: []
    };

    var defintion = {
      "methods": {
        "$definition": {
            "name": "$definition",
            "params": [
                "cb"
              ]
          },
        "fast": {
            "name": "fast",
            "params": [
                "n",
                "callback"
              ]
          },
        "slow": {
            "name": "slow",
            "params": [
                "n",
                "callback"
              ]
          }
      },
      "type": "multi-method"
    };


    client(req, function(err, result){

      assert.deepEqual(result, defintion);
      done(err);
    });
  })
});

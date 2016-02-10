var assert = require('assert');
var path = require('path');
var amqp = require('micro-node-amqp');

var cp = require('child_process');

var children = [];

// helper functions
function server(cb){

  children.push(cp.fork(__dirname + '/services/service.js').on('message', cb));
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

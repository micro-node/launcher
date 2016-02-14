var amqp = require('micro-node-amqp');
var rpc = require('micro-node-json-rpc');
var cp = require('child_process');
var assert = require('assert');
var uuid = require('node-uuid');
var resolve = require('path').resolve;

var launcher = require('../build/index')

var children = [];

var service;

// helper functions
function server(cb){

  var child = cp.exec('npm run micro');
  children.push(child);

  //service = launcher(resolve(__dirname, 'services/fibonacci/index.js'), 'rpc_queue');

  cb();
}

process.on('exit', function(){

  children.forEach(function(child){

    child.kill();
  })
})

var client = amqp.client('127.0.0.1', 'rpc_queue');

describe('Service Launcher', function() {

  this.timeout(10000);

  before(server);

  it('should respond for methods', function(done){

    var req = {

      jsonrpc: '2.0',
      method: 'fast',
      id: uuid.v4(),
      params: [40]
    };

    client(req, function(resp){

      assert.equal(resp.result, 102334155);
      done();
    });
  })

  it('should respond for values', function(done){

    var req = {

      jsonrpc: '2.0',
      id: uuid.v4(),
      method: 'pi'
    };

    client(req, function(resp){

      assert.equal(resp.result, Math.PI);
      done();
    });
  })

  it('should respond for deep methods', function(done){

    var req = {

      jsonrpc: '2.0',
      method: 'deep.fast',
      id: uuid.v4(),
      params: [40]
    };

    client(req, function(resp){

      assert.equal(resp.result, 102334155);
      done();
    });
  })

  it('should return defintion', function(done){

    var req = {

      jsonrpc: '2.0',
      id: uuid.v4(),
      method: rpc.DEFINITIONMETHOD,
      params: []
    };

    client(req, function(resp){

      assert(resp.result.fast.type, rpc.FUNCTIONTYPE);
      assert(resp.result.pi.type, rpc.VALUETYPE);
      done();
    });
  })
});

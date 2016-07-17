const amqp = require('micro-node-amqp');
const rpc = require('micro-node-json-rpc');
const cp = require('child_process');
const assert = require('assert');
const uuid = require('node-uuid');

const children = [];

// helper functions
function server(cb){

  const child = cp.exec('npm run micro');

  children.push(child);

  setTimeout(cb, 3000);
}

process.on('exit', function(){

  children.forEach(function(child){

    child.kill();
  })
})

const client = amqp.client('127.0.0.1', 'rpc_queue');

describe('Service Launcher', function() {

  this.timeout(10000);

  before(server);

  it('should respond for methods', function(done){

    const req = {

      jsonrpc: '2.0',
      method: 'fast',
      id: uuid.v4(),
      params: [40]
    };

    client(req, function(err, resp){

      console.log(err);

      assert.equal(resp, 102334155);
      done(err);
    });
  })

  it('should respond for values', function(done){

    const req = {

      jsonrpc: '2.0',
      id: uuid.v4(),
      method: 'pi'
    };

    client(req, function(err, resp){

      console.log(err);

      assert.equal(resp, Math.PI);
      done(err);
    });
  })

  it('should respond for deep methods', function(done){

    const req = {

      jsonrpc: '2.0',
      method: 'deep.fast',
      id: uuid.v4(),
      params: [40]
    };

    client(req, function(err, resp){

      console.log(err);

      assert.equal(resp, 102334155);
      done(err);
    });
  })

  it('should return defintion', function(done){

    const req = {

      jsonrpc: '2.0',
      id: uuid.v4(),
      method: rpc.DEFINITIONMETHOD,
      params: []
    };

    client(req, function(err, resp){

      console.log(err);

      assert(resp.fast.type, rpc.FUNCTIONTYPE);
      assert(resp.pi.type, rpc.VALUETYPE);
      done(err);
    });
  })
});

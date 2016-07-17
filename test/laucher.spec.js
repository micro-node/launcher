const amqp = require('micro-node-amqp');
const rpc = require('micro-node-json-rpc');
const cp = require('child_process');
const assert = require('assert');
const uuid = require('node-uuid');
const fkill = require('fkill');

const children = [];

// helper functions
function server(cb){

  const child = cp.exec('npm run micro-pkg', (error, stdout, stderr) => {

    if (error) {

      console.error(`exec error: ${error}`);
      return;
    };
  });

  children.push(child);

  setTimeout(cb, 3000);
}

function killAll(){

  children.forEach((child) => fkill(child.pid));
}

process.on('exit', killAll);

const client = amqp.client('127.0.0.1', 'fib');

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

  after(killAll)
});

[![Build Status](https://travis-ci.org/micro-node/launcher.svg)](http://travis-ci.org/micro-node/launcher)
# micro-node-launcher

This is the heart of micronode. This module can start any `node-module` as a micro-service with an `AMQP JSON-RPC 2.0` communication layer.


## Usage

### nodejs

```
// my_module.js

module.exports = {
    
    foo: function(cb){...}
           
    value: 'value',
    
    deep: {
    
        bar: function(cb){...}
    
    }
}

```

```
// app.js

var launch = require('micro-node-launcher');

launch('./my_module.js', 'rpc_queue', '127.0.0.1'); // listening on 127.0.0.1 for rpc calls

```

This will launch an AMPQ server listening on `127.0.0.1` for `JSON-RPC 2.0` messages coming to the `rpc_queue` queue. 
From the shape of the module, the server can also proxy methods deeply in the object.
That means that a deep methods like `deep.bar` is accesible with an RPC request like this one:
```
{
   
  jsonrpc: '2.0',
  method: 'deep.bar',
  id: SOMEUNIQUEID
}
```

The server add an additional internal method `rpc.definition` that contains information about the methods and the static values of module that it exposes. 

We recommand that you use our client [micro-node-client](https://github.com/micro-node/client) to communicate with this server.

## cli

You could also use our CLI to start the server after installing the `micro-node-launcher` locally or globally like this:

```
micro my_module.js rpc_queue 127.0.0.1

```

## Requirement

- NodeJS
- RabbitMQ



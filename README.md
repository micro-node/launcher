[![Build Status](https://travis-ci.org/micro-node/launcher.svg)](http://travis-ci.org/micro-node/launcher)
# micro-node-launcher
This is the heart of micronode. This module can start any `node-module` as a micro-service with an AMQP RPC communication layer.

## Usage

### nodejs

```
// my_module.js

module.exports.parrot = function(a, cb){
    
    cb(null, a)
}

```

```
// app.js

var launch = require('micro-node-launcher');

launch('./my_module.js', '127.0.0.1'); // listening on 127.0.0.1 for rpc calls

```

## cli

After installing the `micro-node-launcher` locally or globally

```
micro my_module.js 127.0.0.1

```

## How

The exported function is used internally to respond to `JSON-RPC 2.0` messages coming to an AMPQ Queue called `rpc_queue`.
This laucher should be used with the `micro-node-client`.

## Requirement

- NodeJS
- RabbitMQ



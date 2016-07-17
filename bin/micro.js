#!/usr/bin/env node
'use strict';

process.title = 'micro';

const resolve = require('path').resolve;
const colors = require('colors');
const meow = require('meow');
const start = require(resolve(__dirname, '../build/index.js'));

const defaultOpts = { addr: '127.0.0.1'};

var opts = {};

// define cli
const cli = meow(`
    
    Usage
      $ micro -file <service file> -queue <amqp queue> -addr <amqp address>
      $ micro ./ <path to directory with package.json>

    Options
      --verbose, -v logs the communication data  

    Examples
      $ micro -f service.js -queue service-queue -addr 127.0.0.1
`, {
  alias: {
    f: 'file',
    q: 'queue',
    a: 'addr',
    v: 'verbose',
  }
});

// read package.json
if(cli.input.length){

  const path = resolve(cli.input[0]);
  const pkgPath = resolve(path, 'package.json');

  try {

    const pkg = require(pkgPath);
    const microOpts = pkg['micro-node'];

    if(microOpts.file){

      microOpts.file = resolve(path, microOpts.file);
    }

    opts = Object.assign(opts, {queue: pkg.name}, microOpts);

  }catch(e){

    error(`no package.json found on ${path}`);
    process.exit();
  }
}

opts = Object.assign({}, defaultOpts, opts, cli.flags);

// required options
['file', 'queue'].forEach((prop) =>{

  if(!opts[prop]){

    error(prop +' is not defined');
    process.exit();
  }
})

// verbose
if(opts.verbose){

  process.env.DEBUG = 'amqp';
}

log(`starting ${opts.file} with queue ${opts.queue} on ${opts.addr}`);

// start the service
const service = start(opts.file, opts.queue, opts.addr);

// on exit close
process.on('exit', service.close);


// helper functions

function log(){

  console.log(colors.green.apply(arguments));
}

function error(){

  console.log(colors.apply(arguments));
}





#!/usr/bin/env node
'use strict';

const resolve = require('path').resolve;
const colors = require('colors');
const fork = require('child_process').fork;
const meow = require('meow');

process.title = 'micro';

const defaultOpts = { addr: '127.0.0.1'};

const cli = meow(`
    
    Usage
      $ micro -file <service-file> -queue <amqp-queue> -addr <amqp-address>

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

const opts = Object.assign({}, defaultOpts, cli.flags);

['file', 'queue'].forEach((prop) =>{

  if(! opts[prop]){

    console.log(colors.red(prop +' is not defined'));
    process.exit();
  }
})

if(opts.verbose){

  process.env.DEBUG = 'amqp';
}

console.log(colors.green(`launching ${opts.file} with queue ${opts.queue} on ${opts.addr}`));

fork(__dirname+'/../build/worker.js', [resolve(opts.file), opts.queue, opts.addr], {stdio: 'inherit'});


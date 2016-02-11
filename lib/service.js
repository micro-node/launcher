import {server} from 'micro-node-amqp';
import {response, methodsDefinition} from 'micro-node-json-rpc';

export default class Service{

  constructor(path, queue, host){

    this.service = require(path);
    this.host = host;

    this.service.$definition = (cb) => cb(null, this.definition);

    this.definition = methodsDefinition(this.service);

    this.server = server(host, queue, response(this.service));
  }
}

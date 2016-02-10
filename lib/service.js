import {server} from 'micro-node-amqp';
import {response, methodsDefinition} from 'micro-node-json-rpc';

export default class Service{

  constructor(service, host){

    this.service = service;
    this.host = host;

    this.service.$definition = (cb) => cb(null, this.definition);

    this.definition = methodsDefinition(this.service);

    this.server = server(host, response(this.service));
  }
}

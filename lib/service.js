import {server} from 'micro-node-amqp';
import {response, methodsDefinition} from 'micro-node-json-rpc';

export default class Service{

  /**
   * constructor for the micro service
   * @param path
   * @param queue
   * @param host
   */
  constructor(path, queue, host){

    // require the service
    this.service = require(path);

    // save the queue
    this.queue = queue;

    // the host addr
    this.host = host;

    // service definition
    this.definition = methodsDefinition(this.service);

    // rpc responder
    this.responder = response(this.service);

    // the rpc server
    this.server = server(host, queue, this.responder);
  }
}

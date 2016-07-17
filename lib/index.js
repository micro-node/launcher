import {server} from 'micro-node-amqp';
import {response, methodsDefinition} from 'micro-node-json-rpc';

/**
 * the service class
 */
class Service {

  /**
   * constructor for the micro service
   * @param file
   * @param queue
   * @param addr
   */
  constructor(file, queue, addr) {

    // require the service
    this.service = require(file);

    // save opts
    this.queue = queue;
    this.addr = addr;

    // service definition
    this.definition = methodsDefinition(this.service);

    // rpc responder
    this.responder = response(this.service);

    // the rpc server
    this.server = server(addr, queue, this.responder);
  }

  close() {

    this.server.close();
  }
}



/**
 * launch a js path as a microservice
 * @param path
 * @param addr
 * @returns {ServiceManager}
 */
module.exports = function start(file, queue, addr = '127.0.0.1') {

  return new Service(file, queue, addr);
}

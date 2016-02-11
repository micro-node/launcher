import Service from './service';

/**
 * launch a js path as a microservice
 * @param path
 * @param addr
 * @returns {ServiceManager}
 */
module.exports = function launch(path, queue, addr = '127.0.0.1') {

  // TODO add path resolve test
  return new Service(path, queue, addr);
}

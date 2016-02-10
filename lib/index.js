import Service from './service';

/**
 * launch a js path as a microservice
 * @param path
 * @param addr
 * @returns {ServiceManager}
 */
module.exports = function launch(path, addr) {

  return new Service(require(path), addr);
}

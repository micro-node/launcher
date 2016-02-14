
module.exports = {

  fast: require('./fast'),
  slow: require('./slow'),
  deep:{ fast: require('./fast') },
  pi: Math.PI
};



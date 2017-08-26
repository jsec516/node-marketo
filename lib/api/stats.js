var _ = require('lodash'),
    Promise = require('bluebird'),
    util = require('../util'),
    log = util.logger();

var LISTS = util.createRestPath('lists.json');

function Stats(marketo, connection) {
  this._marketo = marketo;
  this._connection = connection;
}

Stats.prototype = {

  usage: function() {
    var path = util.createRestPath('stats', 'usage.json');
    return this._connection.get(path);
  },

  usageLast7Days: function() {
    var path = util.createRestPath('stats', 'usage', 'last7days.json');
    return this._connection.get(path);
  },

  errors: function() {
    var path = util.createRestPath('stats', 'errors.json');
    return this._connection.get(path);
  },

  errorsLast7Days: function() {
    var path = util.createRestPath('stats', 'errors', 'last7days.json');
    return this._connection.get(path);
  }
}

module.exports = Stats;

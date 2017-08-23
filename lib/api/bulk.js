var _ = require('lodash'),
    Promise = require('bluebird'),
    util = require('../util'),
    log = util.logger();

function Bulk(marketo, connection) {
  this._marketo = marketo;
  this._connection = connection;
}

Bulk.prototype = {
  create: function(fields, filter) {
    var path = util.createBulkPath('leads', 'export', 'create.json');
    var columnHeaderNames = {};
    _.forEach(fields, function(field) {
      columnHeaderNames[field] = field;
    });
    var data = {
      fields: fields || [],
      format: "CSV",
      columnHeaderNames: columnHeaderNames,
      filter: filter || {},
      _method: 'GET'
    }
    return this._connection.postJson(path, data);
  },

  enqueue: function(exportId) {
    var path = util.createBulkPath('leads', 'export', exportId, 'enqueue.json');
    return this._connection.post(path);
  },

  status: function() {
    var path = util.createBulkPath('leads', 'export', exportId, 'status.json');
    return this._connection.get(path);
  },

  file: function() {
    var path = util.createBulkPath('leads', 'export', exportId, 'file.json');
    return this._connection.get(path);
  },
};

module.exports = Bulk;

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

  jobs: function(statuses) {
    var path = util.createBulkPath('leads', 'export.json?status=' + statuses.join(','));
    return this._connection.get(path);
  },

  status: function(exportId) {
    var path = util.createBulkPath('leads', 'export', exportId, 'status.json');
    return this._connection.get(path);
  },

  file: function(exportId) {
    var path = util.createBulkPath('leads', 'export', exportId, 'file.json');
    return this._connection.get(path);
  },

  cancel: function(exportId) {
    var path = util.createBulkPath('leads', 'export', exportId, 'cancel.json');
    return this._connection.post(path);
  },
};

module.exports = Bulk;

var _ = require('lodash'),
    Promise = require('bluebird'),
    Readable = require('stream').Readable,
    util = require('util'),
    log = require('./util').logger();

function MarketoStream(marketoResultPromise, options) {
  options = _.defaults(options || {}, {objectMode: true});
  Readable.call(this, options);
  this._setData(marketoResultPromise || Promise.resolve({}));
  this.cacheOptions = options;
  this.marketoIns = arguments[2];
  this.leadNumber = arguments[3];
  log.debug('additional information status ', {cacheOptions: this.cacheOptions, marketoIns: this.marketoIns, leadNumber: this.leadNumber});
}

util.inherits(MarketoStream, Readable);

/* edit for failover */
MarketoStream.prototype._retry = function(marketoObj, options, leadNumber) {
  var self = this;
  var resumeOptions = {nextPageToken: self.nextPageToken};
  var marketoResultPromise = marketoObj.list.getLeads(leadNumber, resumeOptions);
  options = _.defaults(options || {}, {objectMode: true});
  Readable.call(this, options);
  this._setData(marketoResultPromise || Promise.resolve({}));
};

MarketoStream.prototype._setData = function(dataPromise) {
  this._ready = false;

  var self = this;
  this._dataPromise = dataPromise;
  return dataPromise.then(
    function(data) {
      if (data.result) {
        self._data = data;
        self.nextPageToken = data.nextPageToken;
        self._resultIndex = 0;
        self._ready = true;
        self._pushNext();
      } else {
        self.push(null);
      }
    },
    function(err) {
      if (err.errors && err.errors[0].code == '605') {
        self._retry(self.marketoIns, self.cacheOptions, self.leadNumber);
      } else {
        self.emit('error', err);
        // end the stream
        self.push(null);
      }
      
    });
};

MarketoStream.prototype._read = function() {

  if (!this._ready) {
    return;
  }

  if (this._data.result) {
    if (this._pushNext()) {
      return;
    } else if (this._data.nextPageToken) {
      this._setData(this._data.nextPage())
    } else {
      // No data left and no more data from marketo
      this.push(null);
    }
  } else {
    this.push(null);
  }
};

MarketoStream.prototype._pushNext = function() {
  var result;
  if (this._data.result) {
    result = this._data.result;
    if (this._resultIndex < result.length) {
      this.push(result[this._resultIndex++]);
      return true;
    }
  }

  return false;
};

MarketoStream.prototype.endMarketoStream = function() {
  this.push(null);
}

module.exports = MarketoStream;

var util = require('../util')

function Activities(marketo, connection) {
  this._marketo = marketo;
  this._connection = connection;
}

Activities.prototype = {
  getActivityTypes: function() {
    var path = util.createRestPath('activities', 'types.json');
    
    return this._connection.get(path, { _method: 'GET' });
  }
}

module.exports = Activities;
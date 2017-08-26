var _ = require('lodash'),
    Promise = require('bluebird'),
    util = require('../util'),
    log = util.logger();

function Campaign(marketo, connection) {
  this._marketo = marketo;
  this._connection = connection;
}

Campaign.prototype = {
  request: function(campaignId, leads, tokens, options) {
    if (!_.isArray(leads)) {
      var msg = 'leads needs to be an Array';
      log.error(msg);
      return Promise.reject(msg);
    }

    options = _.extend({}, options, {
      input: { leads: leads, tokens: tokens },
      _method: 'POST'
    });
    options = util.formatOptions(options);

    return this._connection.post(util.createRestPath('campaigns',campaignId,'trigger.json'), 
	{data: JSON.stringify(options), headers: {'Content-Type': 'application/json'}});
  },
  getCampaigns: function(options) {
    var path = util.createRestPath( 'campaigns.json' );
    options = _.extend({}, options, {
      _method: 'GET'
    });
    return this._connection.get(path, {data: options});
  },

};

module.exports = Campaign;

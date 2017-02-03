var config = require('config');
var syslogd = require('./syslogd/rfc5424.js');
var winston = require('winston');
var Elasticsearch = require('winston-elasticsearch');
var elasticsearch = require('elasticsearch');

var elasticClient = new elasticsearch.Client({
  host: config.syslogd2kibana_elastic_url
});

var esTransportOpts = {
  level: 'info',
  client: elasticClient
};

var logger = new winston.Logger({
  transports: [
    new Elasticsearch(esTransportOpts)
  ]
});

syslogd(function(info) {
  // 'Emergency Alert Critical Error Warning Notice Informational Debug'
  switch (info.severity) {
    case 0: logger.emerg(info.msg);
            break;
    case 1: logger.alert(info.msg);
            break;
    case 2: logger.crit(info.msg);
            break;
    case 3: logger.error(info.msg);
            break;
    case 4: logger.warning(info.msg);
            break;
    case 5: logger.notice(info.msg);
            break;
    case 6: logger.info(info.msg);
            break;
    case 7: logger.debug(info.msg);
            break;
  }
}).listen(514, function(error) {
  if (error) {
    return console.log(error);
  }
  console.log('start')
})

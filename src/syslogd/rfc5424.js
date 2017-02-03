// code Forked from github chunpu/syslogd

var dgram = require('dgram');
var moment = require('moment');

module.exports = exports = Syslogd;

function noop() {}

function Syslogd(fn, opt) {
  if (!(this instanceof Syslogd)) {
    return new Syslogd(fn, opt);
  }
  this.opt = opt || {};
  this.handler = fn;
  this.server = dgram.createSocket('udp4');
}

var proto = Syslogd.prototype;

proto.listen = function(port, cb) {
    var server = this.server;
    if (this.port) {
        return;
    }
    cb = cb || noop;
    this.port = port || 514; // default is 514
    var me = this;
    server
        .on('error', function(err) {
            cb(err);
        })
        .on('listening', function() {
            cb(null);
        })
        .on('message', function(msg, rinfo) {
            var info = parser(msg, rinfo);
            me.handler(info);
        })
        .bind(port);

    return this;
}

var Severity = {};
'Emergency Alert Critical Error Warning Notice Informational Debug'.split(' ').forEach(function(x, i) {
    Severity[x.toUpperCase()] = i;
});

exports.Severity = Severity;

var Facility = {};
'kern user mail daemon auth syslog lpr news uucp clock authpriv ftp ntp logaudit logalert cron local0 local1 local2 local3 local4 local5 local 6 local7'.split(' ').forEach(function(x, i) {
  Facility[x] = i;
});

function parser(msg, rinfo) {
    msg = msg + '';
    var priIndexGt = msg.indexOf('>');
    var priIndexLt = msg.indexOf('<');
    var r = parseInt(msg.substr(priIndexLt+1, priIndexGt - priIndexLt - 1));
    var facility = Math.floor(r/8);
    var severity = r % 8;
    var rest = msg.substr(priIndexGt+1).split(' ');
    var version = rest[0];
    var timestamp = moment(rest[1]).toDate();
    var hostname = rest[2];
    var appname = rest[3];
    var pid = rest[4];
    var msgid = rest[5];
    var message = rest.slice(6).join(' ');
    return {
          facility: facility
        , severity: severity
        , version: version
        , timestamp: timestamp
        , hostname: hostname
        , appname: appname
        , pid: pid
        , msgid: msgid
        , msg: message
        , address: rinfo.address
        , family: rinfo.family
        , port: rinfo.port
        , size: rinfo.size
    };
}

exports.parser = parser;

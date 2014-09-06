/**
 * Created by Pierre-Olivier on 05/09/2014.
 */
var manager = require('./manager');
var crypto = require('crypto');

exports.mysql = {};
exports.mysql.connection = function(cb) {
    manager.getDatabase().getConnection(function (err, connection) {
        cb(err, connection);

        if (!err) {
            connection.release();
        }
    });
};
exports.mysql.stringifyDate = function(date) {
    var m = date.getMonth() + 1;
    if (m <= 9) {
        m = '0' + m;
    }
    var d = date.getDate();
    if (d <= 9) {
        d = '0' + d;
    }
    var h = date.getHours();
    if (h <= 9) {
        h = '0' + h;
    }
    var i = date.getMinutes();
    if (i <= 9) {
        i = '0' + i;
    }
    var s = date.getSeconds();
    if (s <= 9) {
        s = '0' + s;
    }
    return date.getFullYear() + '-' + m + '-' + d + ' ' + h + ':' + i + ':' + s;
};

exports.utils = {};
exports.utils.sha256 = function(string) {
    string = (string == undefined ? '' : string);

    var sha = crypto.createHash('sha256');
    sha.update(string);
    return sha.digest('hex');
};
exports.utils.random = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

exports.utils.randomString = function (length) {
    var chars = "abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789$!([-_)]";
    var rnd = crypto.randomBytes(length - 1);
    var value = new Array(length - 1);
    var len = chars.length;

    for (var i = 0; i < length - 1; i++) {
        value[i] = chars[rnd[i] % len]
    }

    return exports.utils.random(0, 9) + value.join('');
};

exports.utils.randomStringNoSymbolDigits = function (length) {
    var chars = "abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ";
    var rnd = crypto.randomBytes(length);
    var value = new Array(length);
    var len = chars.length;

    for (var i = 0; i < length; i++) {
        value[i] = chars[rnd[i] % len]
    }

    return value.join('');
};

exports.utils.randomStringNoSymbol = function (length) {
    var chars = "abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789";
    var rnd = crypto.randomBytes(length);
    var value = new Array(length);
    var len = chars.length;

    for (var i = 0; i < length; i++) {
        value[i] = chars[rnd[i] % len]
    }

    return value.join('');
};

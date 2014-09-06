/**
 * Created by Pierre-Olivier on 05/09/2014.
 */
var validator = require('validator');
var helper = require('./helper');
var configuration = require('../configuration');

function getKey(connection, pre, longUrl, cb) {
    connection.query('SELECT * FROM urls WHERE `url` = "' + longUrl + '"', function (err, rows) {
        if (!err) {
            if (rows.length > 0) {
                cb(false, rows[0].key, true);
            } else {
                generateKey(connection, pre, cb);
            }
        } else {
            cb(true, '', false);
        }
    });
}

function generateKey(connection, pre, cb) {
    var key = pre + helper.utils.randomString(4);

    connection.query('SELECT * FROM urls WHERE `key` = "' + key + '"', function (err, rows) {
        if (!err) {
            if (rows.length == 0) {
                cb(false, key, false);
            } else {
                generateKey(connection, pre, cb);
            }
        } else {
            cb(true, '', false);
        }
    });
}

exports.shorten = function(json, res) {
    if (validator.isAlphanumeric(json.key) && validator.isURL(json.url) && (json.protection == undefined || json.protection == 'password' || json.protection == 'cookie') && (json.password == undefined || validator.isAlphanumeric(json.password)) && (json.timeout == undefined || validator.isNumeric(json.timeout))) {
        helper.mysql.connection(function (err, connection) {
            if (!err) {
                connection.query('SELECT * FROM users WHERE `key` = "' + json.key + '"', function (err, rows) {
                    if (!err) {
                        if (rows.length > 0) {
                            var user = rows[0];

                            var group = Math.round(user.id_user / 1000.0);

                            getKey(connection, group + user.short_key, json.url, function (err, key, exists) {
                                if (!err) {
                                    if (!exists) {
                                        json.protection = (json.protection == undefined ? '' : json.protection);
                                        json.password = (json.password == undefined || json.protection == '' ? '' : helper.utils.sha256(json.password));
                                        json.timeout = (json.timeout == undefined ? '0000-00-00 00:00:00' : helper.mysql.stringifyDate(new Date(Date.now() + json.timeout * 1000)));

                                        connection.query('INSERT INTO urls SET ?', {id_user: user.id_user, key: key, url: json.url, protection: json.protection, protection_argument: json.password, created: helper.mysql.stringifyDate(new Date()), timeout: json.timeout});
                                    }

                                    res.send({shortUrl: 'https://' + configuration.server.domain + '/' + key, longUrl: json.url, status: 'ok'});
                                } else {
                                    res.send(JSON.stringify({shortUrl: '', longUrl: json.url, status: 'error', error: exports.error(0)}));
                                }
                            });
                        } else {
                            res.send(JSON.stringify({shortUrl: '', longUrl: json.url, status: 'error', error: exports.error(2)}));
                        }
                    } else {
                        res.send(JSON.stringify({shortUrl: '', longUrl: json.url, status: 'error', error: exports.error(0)}));
                    }
                });
            } else {
                res.send(JSON.stringify({shortUrl: '', longUrl: json.url, status: 'error', error: exports.error(0)}));
            }
        });
    } else {
        res.send(JSON.stringify({shortUrl: '', longUrl: json.url, status: 'error', error: exports.error(1)}));
    }
};

exports.redirect = function (key, res) {
    if (key.match(/^[a-zA-Z0-9\$\!\(\[\-\_\)\]]*$/g)) {
        helper.mysql.connection(function (err, connection) {
            if (!err) {
                connection.query('SELECT * FROM urls WHERE `key` = "' + key + '"', function (err, rows) {
                    if (!err) {
                        if (rows.length > 0) {
                            res.statusCode = 302;
                            res.location(rows[0].url);
                            res.end();
                        } else {
                            res.send(JSON.stringify({key: key, status: 'error', error: exports.error(3)}));
                        }
                    } else {
                        res.send(JSON.stringify({key: key, status: 'error', error: exports.error(0)}));
                    }
                });
            } else {
                res.send(JSON.stringify({key: key, status: 'error', error: exports.error(0)}));
            }
        });

    } else {
        res.send(JSON.stringify({key: key, status: 'error', error: exports.error(1)}));
    }
};

exports.error = function(code) {
    var error = {};

    error.code = code;

    switch(code) {
        case 0:
            error.reason = 'database_error';
            error.message = 'Database error';
            break;
        case 1:
            error.reason = 'syntax_error';
            error.message = 'Syntax error';
            break;
        case 2:
            error.reason = 'user_not_found';
            error.message = 'User not found';
            break;
        case 3:
            error.reason = 'url_not_found';
            error.message = 'Url not found';
            break;
    }

    return error;
};
/**
 * Created by Pierre-Olivier on 05/09/2014.
 */
var validator = require('validator');
var helper = require('./helper');
var configuration = require('../configuration');

function getKey(connection, pre, size, longUrl, cb) {
    connection.query('SELECT * FROM urls WHERE `url` = "' + longUrl + '"', function (err, rows) {
        if (!err) {
            if (rows.length > 0) {
                cb(false, rows[0].key, true);
            } else {
                generateKey(connection, pre, size, cb);
            }
        } else {
            cb(true, '', false);
        }
    });
}

function generateKey(connection, pre, size, cb) {
    var key = pre + helper.utils.randomString(size);

    connection.query('SELECT * FROM urls WHERE `key` = "' + key + '"', function (err, rows) {
        if (!err) {
            if (rows.length == 0) {
                cb(false, key, false);
            } else {
                generateKey(connection, pre, size, cb);
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

                            var size = 4;

                            if (json.long_key == 1) {
                                size = 16;
                            }

                            var group = Math.round(user.id_user / 1000.0);

                            getKey(connection, group + user.short_key, size, json.url, function (err, key, exists) {
                                if (!err) {
                                    if (!exists) {
                                        json.protection = (json.protection == undefined ? '' : json.protection);
                                        json.password = (json.password == undefined || json.protection == '' ? '' : helper.utils.sha256(json.password));
                                        json.timeout = (json.timeout == undefined ? '0000-00-00 00:00:00' : helper.mysql.stringifyDate(new Date(Date.now() + json.timeout * 1000)));

                                        connection.query('INSERT INTO urls SET ?', {id_user: user.id_user, key: key, url: json.url, protection: json.protection, protection_argument: json.password, created: helper.mysql.stringifyDate(new Date()), timeout: json.timeout});
                                    }

                                    res.send({shortUrl: 'https://' + configuration.server.domain + '/' + key, longUrl: json.url, status: 'ok'});
                                } else {
                                    res.send({shortUrl: '', longUrl: json.url, status: 'error', error: exports.error(0)});
                                }
                            });
                        } else {
                            res.send({shortUrl: '', longUrl: json.url, status: 'error', error: exports.error(2)});
                        }
                    } else {
                        res.send({shortUrl: '', longUrl: json.url, status: 'error', error: exports.error(0)});
                    }
                });
            } else {
                res.send({shortUrl: '', longUrl: json.url, status: 'error', error: exports.error(0)});
            }
        });
    } else {
        res.send({shortUrl: '', longUrl: json.url, status: 'error', error: exports.error(1)});
    }
};

exports.expand = function (json, res) {
    if (validator.isAlphanumeric(json.key) && json.urls.match(/^[a-zA-Z0-9\,\$\!\(\[\-\_\)\]]*$/g)) {
        helper.mysql.connection(function (err, connection) {
            if (!err) {
                connection.query('SELECT * FROM users WHERE `key` = "' + json.key + '"', function (err, rows) {
                    if (!err) {
                        if (rows.length > 0) {
                            var user = rows[0];

                            connection.query('SELECT CONCAT("https://' + configuration.server.domain + '/", `key`) as shortUrl, `url` as longUrl FROM urls WHERE `id_user` = "' + user.id_user + '" AND `key` IN ("' + json.urls.split(',').join('","') + '")', function (err2, rows2) {
                                if (!err2) {
                                    res.send({urls: rows2, status: 'ok'});
                                } else {
                                    res.send({status: 'error', error: exports.error(0)});
                                }
                            });
                        } else {
                            res.send({status: 'error', error: exports.error(2)});
                        }
                    } else {
                        res.send({status: 'error', error: exports.error(0)});
                    }
                });
            } else {
                res.send({status: 'error', error: exports.error(0)});
            }
        });
    } else {
        res.send({status: 'error', error: exports.error(1)});
    }
};

exports.list = function (json, res) {
    if (validator.isAlphanumeric(json.key)) {
        helper.mysql.connection(function (err, connection) {
            if (!err) {
                connection.query('SELECT * FROM users WHERE `key` = "' + json.key + '"', function (err, rows) {
                    if (!err) {
                        if (rows.length > 0) {
                            var user = rows[0];

                            connection.query('SELECT `key`, CONCAT("https://' + configuration.server.domain + '/", `key`) as shortUrl, `url` as longUrl, `protection`, `protection_argument` as password, `created`, `timeout`, `clicks` FROM urls WHERE `id_user` = "' + user.id_user + '"', function (err2, rows2) {
                                if (!err2) {
                                    res.send({urls: rows2, status: 'ok'});
                                } else {
                                    res.send({status: 'error', error: exports.error(0)});
                                }
                            });
                        } else {
                            res.send({status: 'error', error: exports.error(2)});
                        }
                    } else {
                        res.send({status: 'error', error: exports.error(0)});
                    }
                });
            } else {
                res.send({status: 'error', error: exports.error(0)});
            }
        });
    } else {
        res.send({status: 'error', error: exports.error(1)});
    }
};

exports.get = function (json, res) {
    if (validator.isAlphanumeric(json.key) && json.urls.match(/^[a-zA-Z0-9\,\$\!\(\[\-\_\)\]]*$/g)) {
        helper.mysql.connection(function (err, connection) {
            if (!err) {
                connection.query('SELECT * FROM users WHERE `key` = "' + json.key + '"', function (err, rows) {
                    if (!err) {
                        if (rows.length > 0) {
                            var user = rows[0];

                            connection.query('SELECT `key`, CONCAT("https://' + configuration.server.domain + '/", `key`) as shortUrl, `url` as longUrl, `protection`, `protection_argument` as password, `created`, `timeout`, `clicks` FROM urls WHERE `id_user` = "' + user.id_user + '" AND `key` IN ("' + json.urls.split(',').join('","') + '")', function (err2, rows2) {
                                if (!err2) {
                                    res.send({urls: rows2, status: 'ok'});
                                } else {
                                    res.send({status: 'error', error: exports.error(0)});
                                }
                            });
                        } else {
                            res.send({status: 'error', error: exports.error(2)});
                        }
                    } else {
                        res.send({status: 'error', error: exports.error(0)});
                    }
                });
            } else {
                res.send({status: 'error', error: exports.error(0)});
            }
        });
    } else {
        res.send({status: 'error', error: exports.error(1)});
    }
};

exports.deleteUrls = function (json, res) {
    if (validator.isAlphanumeric(json.key) && json.urls.match(/^[a-zA-Z0-9\,\$\!\(\[\-\_\)\]]*$/g)) {
        helper.mysql.connection(function (err, connection) {
            if (!err) {
                connection.query('SELECT * FROM users WHERE `key` = "' + json.key + '"', function (err, rows) {
                    if (!err) {
                        if (rows.length > 0) {
                            var user = rows[0];

                            if (json.urls == '-1') {
                                connection.query('DELETE FROM urls WHERE `id_user` = "' + user.id_user + '"');
                            } else {
                                connection.query('DELETE FROM urls WHERE `id_user` = "' + user.id_user + '" AND `key` IN ("' + json.urls.split(',').join('","') + '")');
                            }

                            res.send({status: 'ok'});
                        } else {
                            res.send({status: 'error', error: exports.error(2)});
                        }
                    } else {
                        res.send({status: 'error', error: exports.error(0)});
                    }
                });
            } else {
                res.send({status: 'error', error: exports.error(0)});
            }
        });
    } else {
        res.send({status: 'error', error: exports.error(1)});
    }
};

function isPasswordInCookies(cookies, password) {
    for (var key in cookies) {
        if (cookies.hasOwnProperty(key)) {
            if (cookies[key] == password) {
                return true;
            }
        }
    }

    return false;
}

exports.redirect = function (key, query, cookies, res) {
    if (key.match(/^[a-zA-Z0-9\$\!\(\[\-\_\)\]]*$/g)) {
        helper.mysql.connection(function (err, connection) {
            if (!err) {
                connection.query('SELECT * FROM urls WHERE `key` = "' + key + '"', function (err, rows) {
                    if (!err) {
                        if (rows.length > 0) {
                            var password = helper.utils.sha256(query.password);
                            var date = new Date();

                            if ((rows[0].timeout == '0000-00-00 00:00:00' || date <= rows[0].timeout) && (rows[0].protection == '' || (rows[0].protection == 'password' && rows[0].protection_argument == password) || (rows[0].protection == 'cookie' && isPasswordInCookies(cookies, rows[0].protection_argument)))) {
                                connection.query('UPDATE urls SET clicks = ' + (parseInt(rows[0].clicks) + 1) + ' WHERE id_url = "' + rows[0].id_url + '"');

                                res.statusCode = 302;
                                res.location(rows[0].url);
                                res.end();
                            } else {
                                res.send({key: key, status: 'error', error: exports.error(4)});
                            }
                        } else {
                            res.send({key: key, status: 'error', error: exports.error(3)});
                        }
                    } else {
                        res.send({key: key, status: 'error', error: exports.error(0)});
                    }
                });
            } else {
                res.send({key: key, status: 'error', error: exports.error(0)});
            }
        });

    } else {
        res.send({key: key, status: 'error', error: exports.error(1)});
    }
};

exports.register = function(json, cookies, res) {
    if (validator.isAlphanumeric(json.password)) {
        var password = helper.utils.sha256(json.password);

        var exists = false;
        var length = 0;
        for (var key in cookies) {
            if (cookies.hasOwnProperty(key)) {
                if (cookies[key] == password) {
                    exists = true;
                }
                length++;
            }
        }

        if (!exists) {
            res.cookie('password_' + length, password);
        }

        res.send({status: 'ok'});
    } else {
        res.send({status: 'error', error: exports.error(1)});
    }
};

exports.startRemoveOutdatedProcess = function() {
    setInterval(function() {
        helper.mysql.connection(function (err, connection) {
            if (!err) {
                connection.query('DELETE FROM urls WHERE timeout != "0000-00-00 00:00:00" AND timeout < "' + helper.mysql.stringifyDate(new Date()) + '"');
            }
        });
    }, 1000 * 60 * 60);
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
        case 4:
            error.reason = 'authentication_error';
            error.message = 'Authentication error';
            break;
    }

    return error;
};
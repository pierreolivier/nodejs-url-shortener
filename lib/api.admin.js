/**
 * Created by Pierre-Olivier on 06/09/2014.
 */
var validator = require('validator');
var helper = require('./helper');
var configuration = require('../configuration');
var api = require('./api');

function getKey(connection, cb) {
    var shortKey = helper.utils.randomStringNoSymbolDigits(2);
    var key = helper.utils.randomStringNoSymbol(16);

    connection.query('SELECT * FROM users WHERE `key` = "' + key + '" OR `short_key` = "' + shortKey + '"', function (err, rows) {
        if (!err) {
            if (rows.length == 0) {
                cb(false, shortKey, key);
            } else {
                getKey(connection, cb);
            }
        } else {
            cb(true, '', '');
        }
    });
}

exports.userNew = function (json, res) {
    if (json.password == configuration.server.password) {
        helper.mysql.connection(function (err, connection) {
            if (!err) {
                getKey(connection, function (err, shortKey, key) {
                    if (!err) {
                        connection.query('INSERT INTO users SET ?', {key: key, short_key: shortKey});

                        res.send({shortKey: shortKey, key: key, status: 'ok'});
                    } else {
                        res.send({status: 'error', error: api.error(0)});
                    }
                });
            } else {
                res.send({status: 'error', error: api.error(0)});
            }
        });
    } else {
        res.send({status: 'error', error: api.error(4)});
    }
};

exports.userList = function (json, res) {
    if (json.password == configuration.server.password) {
        helper.mysql.connection(function (err, connection) {
            if (!err) {
                connection.query('SELECT * FROM users', function (err, rows) {
                    if (!err) {
                        res.send(rows);
                    } else {
                        res.send({status: 'error', error: api.error(0)});
                    }
                });
            } else {
                res.send({status: 'error', error: api.error(0)});
            }
        });
    } else {
        res.send({status: 'error', error: api.error(4)});
    }
};

exports.userGet = function (json, res) {
    if (json.password == configuration.server.password && validator.isAlphanumeric(json.key)) {
        helper.mysql.connection(function (err, connection) {
            if (!err) {
                connection.query('SELECT * FROM users WHERE `key` = "' + json.key + '"', function (err, rows) {
                    if (!err) {
                        if (rows.length > 0) {
                            connection.query('SELECT * FROM urls WHERE `id_user` = "' + rows[0].id_user + '"', function (err2, rows2) {
                                if (!err2) {
                                    res.send({user: rows[0], links: rows2, status: 'ok'});
                                } else {
                                    res.send({status: 'error', error: api.error(0)});
                                }
                            });
                        } else {
                            res.send({status: 'error', error: api.error(2)});
                        }
                    } else {
                        res.send({status: 'error', error: api.error(0)});
                    }
                });
            } else {
                res.send({status: 'error', error: api.error(0)});
            }
        });
    } else {
        res.send({status: 'error', error: api.error(4)});
    }
};

exports.userDelete = function (json, res) {
    if (json.password == configuration.server.password && validator.isAlphanumeric(json.key)) {
        helper.mysql.connection(function (err, connection) {
            if (!err) {
                connection.query('SELECT * FROM users WHERE `key` = "' + json.key + '"', function (err, rows) {
                    if (!err) {
                        if (rows.length > 0) {
                            connection.query('DELETE FROM urls WHERE `id_user` = "' + rows[0].id_user + '"');
                            connection.query('DELETE FROM users WHERE `id_user` = "' + rows[0].id_user + '"');

                            res.send({status: 'ok'});
                        } else {
                            res.send({status: 'error', error: api.error(2)});
                        }
                    } else {
                        res.send({status: 'error', error: api.error(0)});
                    }
                });
            } else {
                res.send({status: 'error', error: api.error(0)});
            }
        });
    } else {
        res.send({status: 'error', error: api.error(4)});
    }
};

exports.urlDelete = function (json, res) {
    if (json.keys.match(/^[a-zA-Z0-9\,\$\!\(\[\-\_\)\]]*$/g)) {
        if (json.password == configuration.server.password) {
            helper.mysql.connection(function (err, connection) {
                if (!err) {
                    connection.query('DELETE FROM urls WHERE `key` IN ("' + json.keys.split(',').join('","') + '")');

                    res.send({status: 'ok'});
                } else {
                    res.send({status: 'error', error: api.error(0)});
                }
            });
        } else {
            res.send({status: 'error', error: api.error(4)});
        }
    } else {
        res.send({status: 'error', error: api.error(1)});
    }
};
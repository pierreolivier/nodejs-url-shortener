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
                        res.send(JSON.stringify({status: 'error', error: api.error(0)}));
                    }
                });
            } else {
                res.send(JSON.stringify({status: 'error', error: api.error(0)}));
            }
        });
    } else {
        res.send(JSON.stringify({status: 'error', error: api.error(4)}));
    }
};
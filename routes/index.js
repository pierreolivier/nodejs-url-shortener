var express = require('express');
var router = express.Router();
var helper = require('../lib/helper');
var api = require('../lib/api');
var admin = require('../lib/api.admin');

router.post('/shorten', function(req, res) {
    api.shorten(req.body, res);
});
router.post('/expand', function(req, res) {
    api.expand(req.body, res);
});
router.post('/list', function(req, res) {
    api.list(req.body, res);
});
router.post('/get', function(req, res) {
    api.get(req.body, res);
});
router.post('/delete', function(req, res) {
    api.deleteUrls(req.body, res);
});
router.get('/register', function(req, res) {
    api.register(req.query, req.cookies, res);
});
router.post('/register', function(req, res) {
    api.register(req.body, req.cookies, res);
});
router.get('/login', function(req, res) {
    api.login(req, req.query, res);
});
router.post('/login', function(req, res) {
    api.login(req, req.body, res);
});

router.post('/server/login', function(req, res) {
    admin.serverLogin(req, req.body, res);
});
router.post('/user/new', function(req, res) {
    admin.userNew(req.body, res);
});
router.post('/user/list', function(req, res) {
    admin.userList(req.body, res);
});
router.post('/user/get', function(req, res) {
    admin.userGet(req.body, res);
});
router.post('/user/delete', function(req, res) {
    admin.userDelete(req.body, res);
});
router.post('/url/delete', function(req, res) {
    admin.urlDelete(req.body, res);
});

module.exports = router;

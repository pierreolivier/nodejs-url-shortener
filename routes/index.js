var express = require('express');
var router = express.Router();
var helper = require('../lib/helper');
var api = require('../lib/api');

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'Express' });
});

router.post('/shorten', function(req, res) {
    api.shorten(req.body, res);
});

router.get('/login', function(req, res) {
    api.login(req.query, req.cookies, res);
});
router.post('/login', function(req, res) {
    api.login(req.body, req.cookies, res);
});

module.exports = router;

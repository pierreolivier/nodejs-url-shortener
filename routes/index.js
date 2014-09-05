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

module.exports = router;

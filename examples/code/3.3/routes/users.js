var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res) {
    res.render('users');
});

router.get('/:id', function (req, res) {
    res.render('user', {id: req.params.id})
});
module.exports = router;

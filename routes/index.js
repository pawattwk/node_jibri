var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/:directory', function(req, res, next) {
  console.log(req.params.directory)
  res.send({status : 'Success!'})
  // res.render('index', { title: 'Express' });
});

module.exports = router;

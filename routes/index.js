var express = require('express');
var router = express.Router();
const connection = require('../model/database.js')
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart({ uploadDir: './uploads'});
const bodyParser = require('body-parser');
const xlsx = require('node-xlsx')

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/submit', function(req, res) {
  const body = req.body;
  connection.query(
    'INSERT INTO Survey (section_id, q_1a, q_1b, q_1c, q_1d, q_1e, q_1f, q_2a, q_2b, q_2c, q_2d, q_2e, q_2f, q_2g, q_3a, q_3b, q_3c, q_3d, q_4a, q_4b, q_4c, q_5a) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', 
      [body.section_id, body.q_1a, body.q_1b, body.q_1c, body.q_1d, body.q_1e, body.q_1f,
      body.q_2a, body.q_2b, body.q_2c, body.q_2d,	body.q_2e, body.q_2f, body.q_2g,
      body.q_3a, body.q_3b, body.q_3c, body.q_3d,
      body.q_4a, body.q_4b,	body.q_4c, 
      body.q_5a],
      (err,result) => {
    if(err) res.send(err);
    else res.send(result);
  });
});

//upload api
router.post('/api/upload', multipartMiddleware, (req, res) => {
   console.log(req);
	// var file = req.files.file
	// console.log(file)
	// console.log('uploaded file with name ' + file.name)
    // console.log(file.type)
    //var workbook = xlsx.readFile('./uploads/')

	res.json({
        'message': 'File uploaded successfully'
    });
})

/* test json for /submit
{
	"section_id": "123456",	
	"q_1a": "1",
	"q_1b": "2",
	"q_1c": "3",
	"q_1d": "4",
	"q_1e": "Good",
	"q_1f": "Bad",
	"q_2a": "5",
	"q_2b": "4",
	"q_2c": "3",
	"q_2d": "2",
	"q_2e": "1",
	"q_2f": "0",
	"q_2g": "Great",
	"q_3a": "1",
	"q_3b": "2",
	"q_3c": "3",
	"q_3d": "Fabulous",
	"q_4a": "4",
	"q_4b": "5",
	"q_4c": "4",
	"q_5a": "Superb"
}
*/

module.exports = router;

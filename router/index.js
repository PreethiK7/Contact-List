var express = require('express');
var router = express.Router();
var path = require('path');
var contactController = require('../Controller/ContactController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname+'/../views/Home.html'));
});

router.get('/getAllContacts', function (req, res, next) {
  var prom = contactController.displayContacts();
  prom.then(function (prom) {
    res.json(prom);
  });
});

router.get('/Home', function(req, res, next) {
  res.sendFile(path.join(__dirname+'/../views/Home.html'));
});

router.get('/addContact', function(req, res, next) {
  res.sendFile(path.join(__dirname+'/../views/addContact.html'))
  //res.render('Home.html');
});

router.get('/showContact', function(req, res, next) {
  res.sendFile(path.join(__dirname+'/../views/showContacts.html'));
});

router.get('/searchContact', function (req, res, next) {
  res.sendFile(path.join(__dirname+'/../views/searchContact.html'));
});

router.get('/stylesheets/style.css',function (req,res, next) {
  res.sendFile(path.join(__dirname+'/../views/stylesheets/style.css'));
});

router.get('/scripts/contactScript.js',function (req,res, next) {
  res.sendFile(path.join(__dirname+'/../views/scripts/contactScript.js'));
});

router.get('/scripts/getContacts.js',function (req,res, next) {
  res.sendFile(path.join(__dirname+'/../views/scripts/getContacts.js'));
});

router.get('/stylesheets/images/background.png',function (req,res, next) {
  res.sendFile(path.join(__dirname+'/../views/stylesheets/images/background.png'));
});

router.get('/stylesheets/images/linkbackground.jpg',function (req,res, next) {
  res.sendFile(path.join(__dirname+'/../views/stylesheets/images/linkbackground.jpg'));
});

router.get('/scripts/bootstrap.min.js',function (req,res, next) {
  res.sendFile(path.join(__dirname+'/../views/scripts/contactScript.js'));
});

router.get('/stylesheets/bootstrap.min.css',function (req,res, next) {
  res.sendFile(path.join(__dirname+'/../views/stylesheets/style.css'));
});


router.get('/getEditContact',function (req, res, next) {
  var contactId = req.query.contact_id;
  var jsonResp = contactController.getContactDetailsFromId(contactId);
  jsonResp.then(function (jsonResp) {
    res.json(jsonResp);
  });
});

router.post('/editContact',function (req, res, next) {
  var response = contactController.saveEditContact(req);
  response.then(function (response) {
    res.json(response);
  });
});

router.get('/deleteContact', function (req, res, next) {
  var contactId = req.query.contact_id;
  var jsonResp = contactController.deleteContactById(contactId);
  jsonResp.then(function (jsonResp) {
    res.json(jsonResp);
  });
});

router.post('/createContact', function (req, res, next) {
  var response = contactController.insertNewContact(req);
  response.then(function (response) {
    res.json(response);
  });
});

router.post('/searchInDB', function (req, res, next) {
  var strList = req.body.searchString;
  var jsonResp = contactController.searchInDatabase(strList);
  jsonResp.then(function (jsonResp) {
    res.json(jsonResp);
  });
});

module.exports = router;

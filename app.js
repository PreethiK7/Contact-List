var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var mysql = require('mysql');
var conn = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "password",
  database: "CONTACTLIST"
});

conn.connect(function (err) {
  if(err) {
    throw err;
  }
  console.log("Connected to DB");
});

/* Initial Population of Database */
var fs = require("fs");
var fastcsv = require("fast-csv");

var stream = fs.createReadStream("Contacts.csv");
var csvData = [];
var csvStream = fastcsv
    .parse()
    .on("data", function(data) {
      csvData.push(data);
    })
    .on("end", function() {
      // remove the first line: header
      csvData.shift();
      //Checking whether database is empty or not
      conn.query("SELECT COUNT(*) AS CONTCOUNT FROM CONTACT",[],function (err, res) {
        if(err){
          console.log(err);
        }
        else{
          var counts = res[0]['CONTCOUNT'];
          if(counts == 0){
            populateDatabase();
          }
        }
      });
    });

stream.pipe(csvStream);

//Adding contacts
async function addRow(row){
  var sqlQuery = "INSERT INTO CONTACT(FNAME, MNAME, LNAME) VALUES(?, ?, ?)";
  var fname = row[1];
  var mname = row[2];
  var lname = row[3];
  var contactId = -1;
  conn.query(sqlQuery, [fname, mname, lname], async function (err, res) {
    if (err) {
      console.log(err);
    } else {
      contactId = res.insertId;
      var r1 = await addAddress(row,contactId);
      var r2 = await addPhone(row,contactId);
      var r3 = await addDate(row,contactId);
    }
  });
}

//Populating database initially
async function populateDatabase() {
  for (var i = 0; i < csvData.length; i++) {
    var row = csvData[i];
    var res = await addRow(row);
  }
}

//Adding addresses
async function addAddress(row,contactId) {
  var addrType = ["home", "work"];
  var addrInd = [6,11];
  for (var j = 0;j<addrType.length;j++) {
    var addressType = addrType[j];
    var ind = addrInd[j];
    var address = row[ind];
    var zip = row[ind+3];
    var city = row[ind+1];
    var state = row[ind+2];

    if (address != "" || zip != "" || city != "" || state != "") {
      var sqlQuery = "INSERT INTO ADDRESS(CONTACT_ID, ADDRESS_TYPE, ADDRESS, CITY, STATE, ZIP) VALUES (?, ?, ?, ?, ?, ?)";
      conn.query(sqlQuery, [contactId, addressType, address, city, state, zip],function (err, res) {
        if(err){
          console.log(err);
        }
      });
    }
  }
}

//Adding phone numbers
async function addPhone(row, contactId) {
  var phInd = [4,5,10];
  var phType = ["home", "cell", "work"];
  for (var j = 0; j < phType.length; j++) {
    var phoneType = phType[j];
    var ind = phInd[j];
    var phoneNum = row[ind];
    if (phoneNum != "") {
      var areaCode = phoneNum.substr(0, 3);
      phoneNum = phoneNum.substr(4, 8);

      var sqlQuery = "INSERT INTO PHONE(CONTACT_ID, PHONE_TYPE, AREA_CODE, NUMBER) VALUES (?, ?, ?, ?)";
      conn.query(sqlQuery, [contactId, phoneType, areaCode, phoneNum], function (err, res) {
        if (err) {
          console.log(err);
        }
      });
    }
  }
}

//Adding the date
async function addDate(row, contactId) {
  var dateType = "birthday";
  var date = new Date(row[15]);
  if (date != "") {
    var sqlQuery = "INSERT INTO DATE(CONTACT_ID, DATE_TYPE, DATE) VALUES (?, ?, ?)";
    conn.query(sqlQuery, [contactId, dateType, date], function (err, res) {
      if (err) {
        console.log(err);
      }
    });
  }
}


var indexRouter = require('./routes/index');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine','pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/Home', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;


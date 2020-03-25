var contactController = function(){};
var async = require('async');
var mysql = require('mysql');
contactController.promises = [];
var conn = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "password",
    database: "CONTACTLIST"
});

//Function to get all Contacts present in the Database
contactController.getAllContacts = function(){
    return new Promise(function(resolve, reject) {
        conn.query("SELECT * FROM CONTACT", null, async function (err, result) {
            if (err) {
                console.log(err);
            } else {
                resolve(result);
            }
        });
    });
};

//Function to get Addresses of a particular contact using the contact id
contactController.getAddressFromId = function(contactId) {
    return new Promise(function (resolve, reject) {
        conn.query("SELECT * FROM ADDRESS WHERE CONTACT_ID = ?",[contactId],async function (err, result) {
            if(err){
                console.log(err);
            }
            else{
                resolve(result);
            }
        });
    });
};

//Function to get Phone numbers of a particular contact using the contact id
contactController.getPhoneFromId = function(contactId) {
    return new Promise(function (resolve, reject) {
        conn.query("SELECT * FROM PHONE WHERE CONTACT_ID = ?",[contactId],function (err, result) {
            if(err){
                console.log(err);
            }
            else{
                resolve(result);
            }
        });
    });
};

//Function to get Dates of a particular contact using the contact id
contactController.getDateFromId = function(contactId){
    return new Promise(function (resolve, reject) {
        conn.query("SELECT * FROM DATE WHERE CONTACT_ID = ?",[contactId],function (err, result) {
            if(err){
                console.log(err);
            }
            else{
                resolve(result);
            }
        });
    });
};

//Function to get full name of a particular contact using the contact id
contactController.getContactNameFromId = function(contactId){
  return new Promise(function(resolve, reject){
      conn.query("SELECT * FROM CONTACT WHERE CONTACT_ID = ?",[contactId], function (err, result) {
         if(err){
             console.log(err);
         }
         else{
             resolve(result);
         }
      });
  });
};

//Function to get all contact details of a particular contact using the contact id
contactController.getContactDetailsFromId = function(contactId){
    return new Promise(function (resolve, reject) {
        var jsonResp = {};
        var contactName = contactController.getContactNameFromId(contactId);
        var address = contactController.getAddressFromId(contactId);
        var phone = contactController.getPhoneFromId(contactId);
        var date = contactController.getDateFromId(contactId);
        contactName.then(function (results) {
            jsonResp['contact'] = results;
            address.then(function(resAdd){
                jsonResp['address'] = resAdd;
                phone.then(function (resPhone) {
                    jsonResp['phone'] = resPhone;
                    date.then(function (resDate) {
                        jsonResp['date'] = resDate;
                        resolve(jsonResp);
                    });
                });
            });
        });
    });
};

//Function to display all contacts with their details
contactController.displayContacts = function(){
    return new Promise(function(resolve, reject){
        var result = contactController.getAllContacts();
        result.then(function(results){
            var jsonArr = [];
            async.forEachOf(results,async function(row,i){
                var jsonObj = {};
                var address = contactController.getAddressFromId(row.CONTACT_ID);
                var phone = contactController.getPhoneFromId(row.CONTACT_ID);
                var date = contactController.getDateFromId(row.CONTACT_ID);
                contactController.promises.push(address);
                contactController.promises.push(phone);
                contactController.promises.push(date);
                address.then(function (resAdd) {
                    jsonObj['address'] = resAdd;
                }).then(function () {
                    phone.then(function (resPhone) {
                        jsonObj['phone'] = resPhone;
                    }).then(function(){
                        date.then(function (resDate) {
                            jsonObj['date'] = resDate;
                        }).then(function () {
                            jsonObj['contact'] = row;
                            jsonArr.push(jsonObj);
                        });
                    });
                });
            });
            Promise.all(contactController.promises).then(function(){
                resolve(jsonArr);
            });
        });
    });
};

//Function to update the contact name using the contact's id
contactController.editContact = function(contactId,contact){
    return new Promise(function (resolve, reject) {
       conn.query("UPDATE CONTACT SET FNAME = ?, MNAME = ?, LNAME = ? WHERE CONTACT_ID = ?",[contact.fname, contact.mname, contact.lname, contactId], function(err, result){
           if(err){
               console.log(err);
           }
           else{
               resolve(result);
           }
       });
    });
};

//Function to insert one address for a particular contact using the contact id
contactController.insertAAddress = function(contactId,addr){
    return new Promise(function (resolve, reject) {
        conn.query("INSERT INTO ADDRESS(CONTACT_ID, ADDRESS_TYPE, ADDRESS, CITY, STATE, ZIP) VALUES(?, ?, ?, ?, ?, ?)",[contactId, addr.address_type, addr.address, addr.city, addr.state, addr.zip], function(err, result){
            if(err){
                console.log(err);
            }
            else{
                resolve(result);
            }
        });
    });
};


//Function to insert all addresses for a particular contact using the contact id
contactController.insertContactAddress = function(contactId,address){
    return new Promise(function (resolve, reject) {
        var addrProm = [];
        async.forEachOf(address, async function(addr,i){
            var addrRes = contactController.insertAAddress(contactId,JSON.parse(addr));
            addrProm.push(addrRes);
        });
        Promise.all(addrProm).then(function () {
           resolve("success - address added");
        });
    });
};

//Function to insert one phone number for a particular contact using the contact id
contactController.insertAPhone = function(contactId,ph){
    return new Promise(function (resolve, reject) {
        conn.query("INSERT INTO PHONE(CONTACT_ID, PHONE_TYPE, AREA_CODE, NUMBER) VALUES(?, ?, ?, ?)",[contactId, ph.phone_type, ph.area_code, ph.number], function(err, result){
            if(err){
                console.log(err);
            }
            else{
                resolve(result);
            }
        });
    });
};

//Function to insert all phone numbers for a particular contact using the contact id
contactController.insertContactPhone = function(contactId,phone){
    return new Promise(function (resolve, reject) {
        var phProm = [];
        async.forEachOf(phone, async function(ph,i){
            var phoneRes = contactController.insertAPhone(contactId,JSON.parse(ph));
            phProm.push(phoneRes);
        });
        Promise.all(phProm).then(function () {
            resolve("success - phone added");
        });
    });
};

//Function to insert one date for a particular contact using the contact id
contactController.insertADate = function(contactId,date){
    return new Promise(function (resolve, reject) {
        conn.query("INSERT INTO DATE(CONTACT_ID, DATE_TYPE, DATE) VALUES(?, ?, ?)",[contactId, date.date_type, date.date], function(err, result){
            if(err){
                console.log(err);
            }
            else{
                resolve(result);
            }
        });
    });
};

//Function to insert all dates for a particular contact using the contact id
contactController.insertContactDate = function(contactId, dates){
    return new Promise(function (resolve, reject) {
        var dateProm = [];
        async.forEachOf(dates, async function(date,i){
            var dateRes = contactController.insertADate(contactId,JSON.parse(date));
            dateProm.push(dateRes);
        });
        Promise.all(dateProm).then(function () {
            resolve("success - date added");
        });
    });
};

//Function to delete all addresses for a particular contact using the contact id
contactController.deleteAddressByContactId = function(contactId){
  return new Promise(function (resolve, reject) {
     conn.query("DELETE FROM ADDRESS WHERE CONTACT_ID = ?",[contactId],function (err, res) {
         if(err){
             console.log(err);
         }
         else{
             resolve("Success");
         }
     });
  });
};

//Function to delete all phone numbers for a particular contact using the contact id
contactController.deletePhoneByContactId = function(contactId){
    return new Promise(function (resolve, reject) {
        conn.query("DELETE FROM PHONE WHERE CONTACT_ID = ?",[contactId],function (err, res) {
            if(err){
                console.log(err);
            }
            else{
                resolve("Success");
            }
        });
    });
};

//Function to delete all dates for a particular contact using the contact id
contactController.deleteDateByContactId = function(contactId){
    return new Promise(function (resolve, reject) {
        conn.query("DELETE FROM DATE WHERE CONTACT_ID = ?",[contactId],function (err, res) {
            if(err){
                console.log(err);
            }
            else{
                resolve("Success");
            }
        });
    });
};

//Function to delete a particular contact using the contact id
contactController.deleteContactByContactId = function(contactId){
    return new Promise(function (resolve, reject) {
        conn.query("DELETE FROM CONTACT WHERE CONTACT_ID = ?",[contactId],function (err, res) {
            if(err){
                console.log(err);
            }
            else{
                resolve("Success");
            }
        });
    });
};

//Function to update the edited contact in the database
contactController.saveEditContact = function(req){
    return new Promise(function (resolve, reject) {
        var contactId = req.body.contactId;
        var contact = req.body.contact;
        var address = req.body.address;
        var phone = req.body.phone;
        var date = req.body.date;
        var contactRes = contactController.editContact(contactId,contact);
        contactRes.then(function(res){
            var delAddRes = contactController.deleteAddressByContactId(contactId);
            delAddRes.then(function (delAddRes) {
                var addressRes = contactController.insertContactAddress(contactId,address);
                addressRes.then(function (addressRes) {
                    var delPhRes = contactController.deletePhoneByContactId(contactId);
                    delPhRes.then(function (delPhRes) {
                        var phoneRes = contactController.insertContactPhone(contactId,phone);
                        phoneRes.then(function(phoneRes){
                            var delDateRes = contactController.deleteDateByContactId(contactId);
                            delDateRes.then(function (delDateRes) {
                                var dateRes = contactController.insertContactDate(contactId,date);
                                dateRes.then(function(dateRes){
                                    resolve({"success":true});
                                });
                            });
                        });
                    });
                });
            });
        });
    });
};

//Function to delete the whole contact using the contact id
contactController.deleteContactById = function(contactId){
    return new Promise(function (resolve, reject) {
        var addrDelRes = contactController.deleteAddressByContactId(contactId);
        addrDelRes.then(function (addrDelRes) {
           var phDelRes = contactController.deletePhoneByContactId(contactId);
           phDelRes.then(function (phDelRes) {
              var dateDelRes = contactController.deleteDateByContactId(contactId);
              dateDelRes.then(function (dateDelRes) {
                 var contDelRes = contactController.deleteContactByContactId(contactId);
                 contDelRes.then(function (contDelRes) {
                    resolve({"success":true});
                 });
              });
           });
        });
    });
};

//Function to insert a new contact name in the database
contactController.insertContact = function(contact){
  return new Promise(function (resolve, reject) {
      conn.query("INSERT INTO CONTACT(FNAME, MNAME, LNAME) VALUES(?, ?, ?)",[contact.fname, contact.mname, contact.lname], function (err, res) {
         if(err){
             console.log(err);
         } else{
             resolve(res.insertId);
         }
      });
  });
};


//Function to insert a new contact with the details in the database
contactController.insertNewContact = function(req){
  return new Promise(function (resolve, reject) {
      var contact = req.body.contact;
      var address = req.body.address;
      var phone = req.body.phone;
      var date = req.body.date;
      var contRes = contactController.insertContact(contact);
      contRes.then(function (contRes) {
          var contactId = contRes;
          var addrRes = contactController.insertContactAddress(contactId, address);
          addrRes.then(function (addrRes) {
              var phRes = contactController.insertContactPhone(contactId, phone);
              phRes.then(function (phRes) {
                  var dateRes = contactController.insertContactDate(contactId, date);
                  dateRes.then(function (dateRes) {
                     resolve({"success":true});
                  });
              });
          });
      });
  });
};

//Function to search for a contact using the search string in the contact name
contactController.searchStringInContact = function(str){
    return new Promise(function(resolve,reject){
        conn.query("SELECT CONTACT_ID FROM CONTACT WHERE FNAME LIKE ? OR MNAME LIKE ? OR LNAME LIKE ?",['%'+str+'%','%'+str+'%','%'+str+'%'],function (err, res) {
           if(err){
               console.log(err);
           }else{
               resolve(res);
           }
        });
    });
};

//Function to search for a contact using the full name
contactController.searchFullName = function(strArr){
    return new Promise(function (resolve, reject) {
        var fullStr = "%";
        for(var i =0;i<strArr.length;i++){
            fullStr += strArr[i] + "%";
        }
        conn.query("SELECT CONTACT_ID FROM CONTACT WHERE CONCAT_WS(' ',FNAME, MNAME, LNAME) LIKE ?",[fullStr], function (err, res) {
            if(err){
                console.log(err);
            }else{
                resolve(res);
            }
        });
    });
};

//Function to search for a contact using the search string in the contact address
contactController.searchStringInAddress = function(str,contactId){
    return new Promise(function(resolve,reject){
        var sqlQuery;
        if(contactId != null){
            sqlQuery = "SELECT CONTACT_ID FROM ADDRESS WHERE (ADDRESS LIKE ? OR STATE LIKE ? OR CITY LIKE ? OR ZIP LIKE ? OR ADDRESS_TYPE LIKE ?) AND (CONTACT_ID IN ?)";
        }
        else{
            sqlQuery = "SELECT CONTACT_ID FROM ADDRESS WHERE ADDRESS LIKE ? OR STATE LIKE ? OR CITY LIKE ? OR ZIP LIKE ? OR ADDRESS_TYPE LIKE ?";
        }
        conn.query(sqlQuery,['%'+str+'%','%'+str+'%','%'+str+'%','%'+str+'%','%'+str+'%',contactId],function (err, res) {
            if(err){
                console.log(err);
            }else{
                resolve(res);
            }
        });
    });
};

//Function to get details of contacts for all the given contact ids
contactController.getContactDetailsFromIds = function(contactIds){
    return new Promise(function (resolve, reject) {
        var promArr = [];
       async.forEachOf(contactIds, function (contactId,i) {
           var conDet = contactController.getContactDetailsFromId(contactId);
           promArr.push(conDet);
       });
       Promise.all(promArr).then(function(promArr){
          resolve(promArr);
       });
    });
};

//Function to search for a contact using the search string in the contact phone numbers
contactController.searchStringInPhone = function(str, contactId){
    return new Promise(function(resolve,reject){
        var sqlQuery;
        if(contactId != null){
            sqlQuery = "SELECT CONTACT_ID FROM PHONE WHERE (AREA_CODE LIKE ? OR PHONE_TYPE LIKE ? OR NUMBER LIKE ?) AND CONTACT_ID IN ?";
        }
        else{
            sqlQuery = "SELECT CONTACT_ID FROM PHONE WHERE AREA_CODE LIKE ? OR PHONE_TYPE LIKE ? OR NUMBER LIKE ?";
        }
        conn.query(sqlQuery,['%'+str+'%','%'+str+'%','%'+str+'%',contactId],function (err, res) {
            if(err){
                console.log(err);
            }else{
                resolve(res);
            }
        });
    });
};

//Function to search for a contact using the search string in the contact dates
contactController.searchStringInDate = function(str){
    return new Promise(function(resolve,reject){
        conn.query("SELECT CONTACT_ID FROM DATE WHERE DATE_TYPE LIKE ? OR DATE LIKE ?",['%'+str+'%','%'+str+'%'],function (err, res) {
            if(err){
                console.log(err);
            }else{
                resolve(res);
            }
        });
    });
};

//Function to get details of contact for the given contact id
contactController.getOnlyId = function(arr){
    var resArr = [];
    for(var i=0;i<arr.length;i++){
      resArr.push(arr[i].CONTACT_ID);
    }
    return resArr;
};

//Function to search for a contact in the database
contactController.searchInDatabase = function(strArr){
  return new Promise(function (resolve, reject) {
     var resIds = [];
     var searchContProm = [];
      async.forEachOf(strArr, async function(str,i) {
          var contSearchRes = contactController.searchStringInContact(str);
          searchContProm.push(contSearchRes);
      });
      Promise.all(searchContProm).then(function (searchContProm) {
         var searchAddrProm = [];
          async.forEachOf(strArr, async function(str,i) {
              var contSearchRes = contactController.searchStringInAddress(str,null);
              searchAddrProm.push(contSearchRes);
          });
          Promise.all(searchAddrProm).then(function (searchAddrProm){
             var searchPhProm = [];
              async.forEachOf(strArr, async function(str,i) {
                  var contSearchRes = contactController.searchStringInPhone(str,null);
                  searchPhProm.push(contSearchRes);
              });
              Promise.all(searchPhProm).then(function(searchPhProm){
                  var searchFullProm = contactController.searchFullName(strArr);
                  searchFullProm.then(function(searchFullProm){
                      for(var i=0;i<searchFullProm.length;i++) {
                              var curFullName = searchFullProm[i].CONTACT_ID;
                              if(resIds.indexOf(curFullName) <0) {
                                  resIds.push(curFullName);
                              }
                      }
                    if(resIds.length == 0) {
                        for (var j = 0; j < searchContProm.length; j++) {
                            if (searchContProm[j].length > 0) {
                                var curCont = contactController.getOnlyId(searchContProm[j]);
                                for (var k = 0; k < searchAddrProm.length; k++) {
                                    if (j != k) {
                                        var curAddr = contactController.getOnlyId(searchAddrProm[k]);
                                        for (var l = 0; l < searchPhProm.length; l++) {
                                            if (l != j && l != k) {
                                                var curPhone = contactController.getOnlyId(searchPhProm[l]);
                                                var inter1 = curCont.filter(a => curAddr.includes(a));
                                                var finInter = inter1.filter(a => curPhone.includes(a));
                                                for (var m = 0; m < finInter.length; m++) {
                                                    if (resIds.indexOf(finInter[m]) < 0) {
                                                        resIds.push(finInter[m]);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if(resIds.length == 0){
                        for(var j=0;j<searchContProm.length;j++){
                            if(searchContProm[j].length > 0){
                                var curCont = contactController.getOnlyId(searchContProm[j]);
                                for(var k=0;k<searchAddrProm.length;k++){
                                    if(j != k){
                                        var curAddr = contactController.getOnlyId(searchAddrProm[k]);
                                        var finInter = curCont.filter(a => curAddr.includes(a));
                                        for (var m=0;m<finInter.length;m++){
                                            if(resIds.indexOf(finInter[m]) <0) {
                                                resIds.push(finInter[m]);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if(resIds.length == 0){
                          for(var j=0;j<searchContProm.length;j++){
                              if(searchContProm[j].length > 0){
                                  var curCont = contactController.getOnlyId(searchContProm[j]);
                                  for(var l=0;l<searchPhProm.length;l++){
                                      if(j != l){
                                          var curPhone = contactController.getOnlyId(searchPhProm[l]);
                                          var finInter = curCont.filter(a => curPhone.includes(a));
                                          for (var m=0;m<finInter.length;m++){
                                              if(resIds.indexOf(finInter[m]) <0) {
                                                  resIds.push(finInter[m]);
                                              }
                                          }
                                      }
                                  }
                              }
                          }
                    }
                    if(resIds.length == 0){
                          for(var k=0;k<searchAddrProm.length;k++){
                              if(searchAddrProm[k].length > 0){
                                  var curAddr = contactController.getOnlyId(searchAddrProm[k]);
                                  for(var l=0;l<searchPhProm.length;l++){
                                      if(k != l){
                                          var curPhone = contactController.getOnlyId(searchPhProm[l]);
                                          var finInter = curAddr.filter(a => curPhone.includes(a));
                                          for (var m=0;m<finInter.length;m++){
                                              if(resIds.indexOf(finInter[m]) <0) {
                                                  resIds.push(finInter[m]);
                                              }
                                          }
                                      }
                                  }
                              }
                          }
                    }

                    if(resIds.length == 0){
                        for(var j=0;j<searchContProm.length;j++){
                            if(searchContProm[j].length > 0){
                                var curCont = contactController.getOnlyId(searchContProm[j]);
                                for(var m=0;m<curCont.length;m++){
                                    if(resIds.indexOf(curCont[m]) <0) {
                                        resIds.push(curCont[m]);
                                    }
                                }
                            }
                        }
                    }

                    if(resIds.length == 0){
                        for(var k=0;k<searchAddrProm.length;k++){
                            if(searchAddrProm[k].length > 0){
                                var curAddr = contactController.getOnlyId(searchAddrProm[k]);
                                for(var m=0;m<curAddr.length;m++){
                                    if(resIds.indexOf(curAddr[m]) <0) {
                                        resIds.push(curAddr[m]);
                                    }
                                }
                            }
                        }
                    }

                    if(resIds.length == 0){
                        for(var l=0;l<searchPhProm.length;l++) {
                            if (searchPhProm[l].length > 0) {
                                var curPhone = contactController.getOnlyId(searchPhProm[l]);
                                for (var m = 0; m < curPhone.length; m++) {
                                    if(resIds.indexOf(curPhone[m]) <0) {
                                        resIds.push(curPhone[m]);
                                    }
                                }
                            }
                        }
                    }

                    if(resIds.length != 0) {
                        var resContDet = contactController.getContactDetailsFromIds(resIds);
                        resContDet.then(function (resContDet) {
                            resolve(resContDet);
                        });
                    }
                    else{
                        resolve({"noresult":true});
                    }
                  });
              });
          });
      });
  });
};

module.exports = contactController;

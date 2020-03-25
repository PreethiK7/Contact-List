document.onload = sendGetAllContacts();
var dateCounter = 0;
var addressCounter = 0;
var phoneCounter = 0;

function sendGetAllContacts() {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/getAllContacts", true);
    xhttp.send();
    xhttp.onload = function(){
        var status = xhttp.status;
        if (status == 200) {
            processContacts(xhttp.responseText,true);
        }
    };
}

function displayAllContacts(jsonArr,ele){
    if(ele != null) {
        for (var i = 0; i < jsonArr.length; i++) {
            var jsonVal = jsonArr[i];

            var contact = jsonVal.contact;
            if(ele.id == "searchResults"){
                contact = jsonVal.contact[0];
            }
            var conEle = document.createElement("div");
            conEle.id = "conDiv_" + contact.CONTACT_ID;
            conEle.innerText = "Contact " + (i + 1);

            var buttonDiv = document.createElement("div");
            buttonDiv.style = "display:inline-block;float:right";

            var editButton = document.createElement("button");
            editButton.innerHTML = "Edit";
            editButton.id = contact.CONTACT_ID;
            editButton.className = "myButton";
            editButton.addEventListener('click', function () {
                getEditContact(this.id);
            });
            buttonDiv.appendChild(editButton);

            var deleteButton = document.createElement("button");
            deleteButton.innerHTML = "Delete";
            deleteButton.id = contact.CONTACT_ID;
            deleteButton.className = "myButton";
            deleteButton.addEventListener('click', function () {
                getDeleteContact(this.id);
            });
            buttonDiv.appendChild(deleteButton);
            conEle.appendChild(buttonDiv);
            var name = document.createElement("div");
            name.style = "font-weight:bold";
            name.innerText = contact.FNAME + " " + contact.MNAME + " " + contact.LNAME;
            conEle.appendChild(name);




            /*var addrEle = document.createElement("div");
            addrEle.id = "addrDiv_" + contact.CONTACT_ID;
            var addressList = jsonVal.address;
            if (addressList.length > 0) {
                addrEle.innerText = "ADDRESSES";
            }

            for (var j = 0; j < addressList.length; j++) {
                var address = addressList[j];
                var eachAddr = document.createElement("div");
                eachAddr.id = "addr_" + (j + 1);
                var addType = document.createElement("div");
                addType.innerText = (j + 1) + " " + address.ADDRESS_TYPE;
                var addrCity = document.createElement("div");
                addrCity.innerText = address.CITY;
                var addrState = document.createElement("div");
                addrState.innerText = address.STATE;
                var addrZip = document.createElement("div");
                addrZip.innerText = address.ZIP;
                var addrAddr = document.createElement("div");
                addrAddr.innerText = address.ADDRESS;
                eachAddr.appendChild(addType);
                eachAddr.appendChild(addrAddr);
                eachAddr.appendChild(addrCity);
                eachAddr.appendChild(addrState);
                eachAddr.appendChild(addrZip);
                addrEle.appendChild(eachAddr);
            }

            var phoneEle = document.createElement("div");
            phoneEle.id = "phoneDiv_" + contact.CONTACT_ID;
            var phoneList = jsonVal.phone;
            if (phoneList.length > 0) {
                phoneEle.innerText = "PHONES";
            }
            for (var j = 0; j < phoneList.length; j++) {
                var phone = phoneList[j];
                var eachPhone = document.createElement("div");
                eachPhone.id = "phone_" + (j + 1);
                var phoneType = document.createElement("div");
                phoneType.innerText = (j + 1) + " " + phone.PHONE_TYPE;
                var phoneNumber = document.createElement("div");
                phoneNumber.innerText = phone.AREA_CODE + '-' + phone.NUMBER;
                eachPhone.appendChild(phoneType);
                eachPhone.appendChild(phoneNumber);
                phoneEle.appendChild(eachPhone);
            }

            var dateEle = document.createElement("div");
            dateEle.id = "dateDiv_" + contact.CONTACT_ID;
            var dateList = jsonVal.date;
            if (dateList.length > 0) {
                dateEle.innerText = "DATES";
            }
            for (var j = 0; j < dateList.length; j++) {
                var date = dateList[j];
                var eachDate = document.createElement("div");
                eachDate.id = "date_" + (j + 1);
                eachDate.innerText = (j + 1) + " " + date.DATE_TYPE;
                var dateDiv = document.createElement("div");
                dateDiv.innerText = (date.DATE).substring(0, 10);
                eachDate.appendChild(dateType);
                eachDate.appendChild(dateDiv);
                dateEle.appendChild(eachDate);
            }

            conEle.appendChild(addrEle);
            conEle.appendChild(phoneEle);
            conEle.appendChild(dateEle);*/
            ele.appendChild(conEle);
        }
    }
}


function processContacts(responseArray,allContacts) {
    var jsonArr = JSON.parse(responseArray);
    if(allContacts == true){
        var ele = document.getElementById("contactsDiv");
        displayAllContacts(jsonArr,ele);
    }
    else{
        if(jsonArr.noresult == true || (jsonArr[0].contact.length == 0)){
            var ele = document.getElementById('alert-success');
            ele.style = "display:block";
            ele.innerText = "No such contact found";
        }
        else {
            var ele = document.getElementById("searchResults");
            ele.style = "display:block";
            displayAllContacts(jsonArr, ele);
        }
    }
}

function getEditContact(id) {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/getEditContact?contact_id="+id, true);
    xhttp.send();
    xhttp.onload = function(){
        var status = xhttp.status;
        if (status == 200) {
            fillEditContact(xhttp.responseText);
        }
    };
}

function getDeleteContact(id) {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/deleteContact?contact_id="+id, true);
    xhttp.send();
    xhttp.onload = function(){
        var status = xhttp.status;
        if (status == 200) {
            deleteContactResponse(xhttp.responseText);
        }
    };
}

function deleteContactResponse(response) {
    var jsonResponse = JSON.parse(response);
    if(jsonResponse.success == true){
        document.getElementById('content_main').style = "display:none";
        var succesDiv = document.getElementById('alert-success');
        succesDiv.innerText = "Contact deleted successfully";
        succesDiv.style = "display:block";
    }else{
        alert("Error while deleting contact. Please try again");
    }
}

function fillEditContact(response) {
    document.getElementById("content_main").style = "display:none";
    var editPopUp = document.getElementById("editPopUp");
    editPopUp.style = "display:block";
    var jsonObj = JSON.parse(response);

    var contact = jsonObj.contact[0];
    editPopUp.children[1].id = 'editContact_' + contact.CONTACT_ID;
    document.getElementById('fname').value = contact.FNAME + "";
    document.getElementById('mname').value = contact.MNAME + "";
    document.getElementById('lname').value = contact.LNAME + "";

    var addressObj = jsonObj.address;
    for(var j=0;j<addressObj.length;j++){
        var divAdd = document.getElementById('addressTemp');
        var address = divAdd.cloneNode(true);
        address.style = "display:block";
        address.id = 'addressDiv' + (j+1);
        address.children[0].id = 'removeAddress' + (j+1);
        addressDiv = document.getElementById('addressDiv');
        addressDiv.appendChild(address);
        document.getElementById(address.id).querySelector('#addType').value = addressObj[j].ADDRESS_TYPE;
        document.getElementById(address.id).querySelector('#address').value = addressObj[j].ADDRESS;
        document.getElementById(address.id).querySelector('#state').value = addressObj[j].STATE;
        document.getElementById(address.id).querySelector('#city').value = addressObj[j].CITY;
        document.getElementById(address.id).querySelector('#zip').value = addressObj[j].ZIP;
    }
    addressCounter = addressObj.length;

    var phoneObj = jsonObj.phone;
    for(var j=0;j<phoneObj.length;j++){
        var divPhone = document.getElementById('phoneTemp');
        var phone = divPhone.cloneNode(true);
        phone.style = "display:block";
        phone.id = 'phoneDiv' + (j+1);
        phone.children[0].id = 'removePhone' + (j+1);
        phoneDiv = document.getElementById('phoneDiv');
        phoneDiv.appendChild(phone);
        document.getElementById(phone.id).querySelector('#phoneType').value = phoneObj[j].PHONE_TYPE;
        document.getElementById(phone.id).querySelector('#areaCode').value = phoneObj[j].AREA_CODE;
        document.getElementById(phone.id).querySelector('#number').value = phoneObj[j].NUMBER;
    }
    phoneCounter = phoneObj.length;

    var dateArr = jsonObj.date;
    for(var j=0;j<dateArr.length;j++){
        var divDate = document.getElementById('dateTemp');
        var date = divDate.cloneNode(true);
        date.style = "display:block";
        date.id = 'dateDiv' + (j+1);
        date.children[0].id = 'removeDate' + (j+1);
        dateDiv = document.getElementById('dateDiv');
        dateDiv.appendChild(date);
        document.getElementById(date.id).querySelector('#dateType').value = dateArr[j].DATE_TYPE;
        document.getElementById(date.id).querySelector('#date').value = dateArr[j].DATE.substring(0,10);
    }
    dateCounter = dateArr.length;
}

function removeAddDate(id){
    var count = id.substring(10);
    var ele = document.getElementById('dateDiv'+count);
    var parentEle = ele.parentElement;
    parentEle.removeChild(ele);
}

function removeAddPhone(id){
    var count = id.substring(11);
    var ele = document.getElementById('phoneDiv'+count);
    var parentEle = ele.parentElement;
    parentEle.removeChild(ele);
}

function removeAddAddress(id){
    var count = id.substring(13);
    var ele = document.getElementById('addressDiv'+count);
    var parentEle = ele.parentElement;
    parentEle.removeChild(ele);
}

function  editContact() {
    var form = document.getElementById('editPopUp').children[1];
    var contactId = form.id.substring(12);
    var xhttp = new XMLHttpRequest();
    var contactFname = document.getElementById('fname').value;
    var contactMname = document.getElementById('mname').value;
    var contactLname = document.getElementById('lname').value;
    var addressesDiv = document.getElementById('addressDiv').childNodes;
    var addressArr  = [];
    for(var j=1;j<addressesDiv.length;j++){
        var addressDiv = addressesDiv[j];
        var addressType = addressDiv.querySelector('#addType').value;
        var address = addressDiv.querySelector('#address').value;
        var state = addressDiv.querySelector('#state').value;
        var city = addressDiv.querySelector('#city').value;
        var zip = addressDiv.querySelector('#zip').value;
        var addressJson = JSON.stringify({"address_type":addressType, "address":address, "state":state, "city":city, "zip":zip});
        addressArr.push(addressJson);
    }
    var phonesDiv = document.getElementById('phoneDiv').childNodes;
    var phoneArr = [];
    for(var j=1;j<phonesDiv.length;j++){
        var phoneDiv = phonesDiv[j];
        var phoneType = phoneDiv.querySelector('#phoneType').value;
        var areaCode = phoneDiv.querySelector('#areaCode').value;
        var number = phoneDiv.querySelector('#number').value;
        var phoneJson = JSON.stringify({"phone_type":phoneType, "area_code":areaCode, "number":number});
        phoneArr.push(phoneJson);
    }
    var datesDiv = document.getElementById('dateDiv').childNodes;
    var dateArr = [];
    for(var j=1;j<datesDiv.length;j++){
        var dateDiv = datesDiv[j];
        var dateType = dateDiv.querySelector('#dateType').value;
        var date = dateDiv.querySelector('#date').value;
        var dateJson = JSON.stringify({"date_type":dateType, "date":date});
        dateArr.push(dateJson);
    }
    var params = JSON.stringify({
                "contactId":contactId,
                "contact":{"fname":contactFname, "mname":contactMname, "lname":contactLname},
                "address":addressArr,
                "phone":phoneArr,
                "date":dateArr});
    xhttp.open("POST", "/editContact", true);
    xhttp.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(params);
    xhttp.onreadystatechange = function(){
        var status = xhttp.status;
        if (status == 200) {
            editContactResponse(xhttp.responseText);
        }
    };
}

function editContactResponse(response){
    var jsonResponse = JSON.parse(response);
    if(jsonResponse.success == true){
        document.getElementById('editPopUp').style = "display:none";
        var succesDiv = document.getElementById('alert-success');
        succesDiv.innerText = "Contact saved successfully";
        succesDiv.style = "display:block";
    }else{
        alert("Error while saving contact. Please try again");
    }
}

function showAddAddress(){
    var divAdd = document.getElementById('addressTemp');
    var address = divAdd.cloneNode(true);
    addressCounter++;
    address.style = "display:block";
    address.id = 'addressDiv' + addressCounter;
    address.children[0].id = 'removeAddress' + addressCounter;
    addressDiv = document.getElementById('addressDiv');
    addressDiv.appendChild(address);
}

function showAddPhone(){
    var divPhone = document.getElementById('phoneTemp');
    var phone = divPhone.cloneNode(true);
    phoneCounter++;
    phone.style = "display:block";
    phone.id = 'phoneDiv' + phoneCounter;
    phone.children[0].id = 'removePhone' + phoneCounter;
    phoneDiv = document.getElementById('phoneDiv');
    phoneDiv.appendChild(phone);
}

function showAddDate(){
    var divDate = document.getElementById('dateTemp');
    var date = divDate.cloneNode(true);
    dateCounter++;
    date.style = "display:block";
    date.id = 'dateDiv' + dateCounter;
    date.children[0].id = 'removeDate' + dateCounter;
    dateDiv = document.getElementById('dateDiv');
    dateDiv.appendChild(date);
}

function cancelEditContact() {
    document.getElementById('editPopUp').style = "display:none";
    document.getElementById('content_main').style = "display:block";
}

function searchContact(){
    var searchStr = document.getElementById('searchField').value;
    var searchDiv = document.getElementById("searchResults");
    searchDiv.innerHTML = null;
    var succDiv = document.getElementById('alert-success');
    succDiv.style = "display:none";
    var strArr = searchStr.split(' ');
    var params = JSON.stringify({"searchString":strArr});
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/searchInDB", true);
    xhttp.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(params);
    xhttp.onload = function() {
        var status = xhttp.status;
        if (status == 200) {
            processContacts(xhttp.responseText,false);
        }
    };
}

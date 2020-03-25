var addressCounter = 0;
var phoneCounter = 0;
var dateCounter = 0;

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

function removeAddAddress(id){
	var count = id.substring(13);
	var ele = document.getElementById('addressDiv'+count);
	var parentEle = ele.parentElement;
	parentEle.removeChild(ele);
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

function removeAddPhone(id){
	var count = id.substring(11);
	var ele = document.getElementById('phoneDiv'+count);
	var parentEle = ele.parentElement;
	parentEle.removeChild(ele);
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

function removeAddDate(id){
	var count = id.substring(10);
	var ele = document.getElementById('dateDiv'+count);
	var parentEle = ele.parentElement;
	parentEle.removeChild(ele);
}

function createContact(){
	var form = document.getElementsByTagName('form')[0];
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
		"contact":{"fname":contactFname, "mname":contactMname, "lname":contactLname},
		"address":addressArr,
		"phone":phoneArr,
		"date":dateArr});
	xhttp.open("POST", "/createContact", true);
	xhttp.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
	xhttp.setRequestHeader('Content-Type', 'application/json');
	xhttp.send(params);
	xhttp.onreadystatechange = function(){
		var status = xhttp.status;
		if (status == 200) {
			createContactResponse(xhttp.responseText);
		}
	};
}

function createContactResponse(response){
	var jsonResp = JSON.parse(response);
	if(jsonResp.success == true){
		document.getElementById('content_main').style = "display:none";
		var succesDiv = document.getElementById('alert-success');
		succesDiv.innerText = "Contact saved successfully";
		succesDiv.style = "display:block";
	}else{
		alert("Error while saving contact. Please try again");
	}
}


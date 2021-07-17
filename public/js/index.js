///////////////////////////////////////////////////////
//
// File: index.js
// This is application file for login page to accept login credentials
//
// Last Updated: 29-11-2018
// Reformat, Indentation, Inline Comments
//
/////////////////////////////////////////////////////


window.onload = function () {

    document.querySelector("#version_num").innerText = EnxRtc.version;
    $(".login_join_div").show();

}
var username = "demo";
var password = "enablex";



// Verifies login credentials before moving to Conference page

document.getElementById('login_form').addEventListener('submit', function (event) {
    event.preventDefault();

    $("#joinRoom").attr("disabled","disabled");
    var name = document.querySelector('#nameText'), room = document.querySelector('#roomName'), agree = document.querySelector('[name="agree"]'), errors = [];
    if (name.value.trim() === '') {
        errors.push('Enter your name.');
    }
    if (room.value.trim() === '') {
        errors.push('Enter your Room Id.');
    }

    if (!agree.checked ) {
        errors.push('Accept terms of use and privacy policy.')
    }

    if (errors.length > 0) {
        var mappederrors = errors.map(function (item) {
            return item + "</br>";
        });
        var allerrors = mappederrors.join('').toString();
        toastr.error(allerrors);

        $("#joinRoom").removeAttr("disabled");
        return false;
    }


    joinRoom(document.getElementById('roomName').value, function (data) {

        if (!jQuery.isEmptyObject(data)) {

            room_id = data.room_id;
            var user_ref = document.getElementById('nameText').value;
            var role = document.getElementById('attendeeRole').value;
            var retData = {
                name: user_ref,
                role: role,
                roomId:room_id,
                user_ref: user_ref,
            };

            createToken(retData,function(response){
                var token = response;
                window.location.href = "confo.html?token="+token;

            });



        } else {
            toastr.error("Room Not Found");

        }
    });
});

var loadingElem = document.querySelector('.loading');
document.getElementById('create_room').addEventListener('click', function (event) {
    loadingElem.classList.add('yes');
    createRoom(function (result) {
        document.getElementById("roomName").value = result;
        document.getElementById("create_room_div").style.display = "none";
        document.getElementById("message").innerHTML = "We have prefilled the form with room-id. Share it with someone you want to talk to";
    });
});

// create room api call using XML request

var createRoom = function (callback) {
	var apiUrl = '/api/create-room/';
	if (typeof baseUrl !== 'undefined') {
		// todo - to support PHP app api url
		apiUrl = baseUrl + apiUrl;
	}
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var response =  JSON.parse(this.responseText);
            if(response.error){
                toastr.error(response.error);

            }
            else {
                callback(response.room.room_id);
                loadingElem.classList.remove('yes');
            }
        }
    };
    xhttp.open("POST", apiUrl, true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.setRequestHeader ("Authorization", "Basic " + btoa(username + ":" + password));
    xhttp.send();
};

var createToken = function (details, callback) {
	var apiUrl = '/api/create-token/';
	if (typeof baseUrl !== 'undefined') {
		// todo - to support PHP app api url
		apiUrl = baseUrl + apiUrl;
	}
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var response =  JSON.parse(this.responseText);
            if(response.error){
                toastr.error(response.error);

            }
            else {
                callback(response.token);
            }
        }
    };
    xhttp.open("POST", apiUrl, true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(details));
};



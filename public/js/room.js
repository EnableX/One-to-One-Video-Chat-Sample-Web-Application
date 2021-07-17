///////////////////////////////////////////////////////
//
// File: room.js
// This function fetches Room-Information to which the user is logging in
//
// Last Updated: 29-11-2018
// Reformat, Indentation, Inline Comments
//
/////////////////////////////////////////////////////


var joinRoom = function (roomName, callback) {
	var apiUrl = '/api/get-room/';
	if (typeof baseUrl !== 'undefined') {
		// todo - to support PHP app api url
		apiUrl = baseUrl + apiUrl + '?roomId=' + roomName;
	} else {
        apiUrl = apiUrl + roomName;
    }
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var response =  JSON.parse(this.responseText);
            if(response.error){
                toastr.error(response.error);
            }
            else {
                callback(response.room);
            }


        }
    };
    xhttp.open("GET", apiUrl, true);
    xhttp.send();
};


///////////////////////////////////////////////////////
//
// File: util.js
// This function tries to get a Token for a Room
//
// Last Updated: 29-11-2018
// Reformat, Indentation, Inline Comments
//
/////////////////////////////////////////////////////

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
                $.toast({
                    heading: 'Error',
                    text: response.error,
                    showHideTransition: 'fade',
                    icon: 'error',
                    position: 'top-right',
                    showHideTransition: 'slide'
                });
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

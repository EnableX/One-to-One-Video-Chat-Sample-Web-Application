///////////////////////////////////////////////////////
//
// File: index.js
// This is applicaiton file for login page to accept login credentials
//
// Last Updated: 29-11-2018
// Reformat, Indentation, Inline Comments
//
/////////////////////////////////////////////////////


window.onload = function () {
    $(".login_join_div").show();
    document.getElementById('moderator').setAttribute('checked', 'true');
}



// Verifies login credentials before moving to Conference page

document.getElementById('joinRoom').addEventListener('click', function (event) {
    joinRoom(document.getElementById('roomName').value, function (data) {
        var resData = JSON.parse(data);
        if (!jQuery.isEmptyObject(resData)) {

            var user_ref = document.getElementById('nameText').value;
            var usertype = undefined;
            if (document.getElementById('moderator').checked) {
                usertype = document.getElementById('moderator').value;
            }
            if (document.getElementById('participant').checked) {
                usertype = document.getElementById('participant').value;
            }

            /* Load the basic clling environment*/
            window.location.href = "confo.html?roomId=" + resData.room_id + "&usertype=" + usertype + "&user_ref=" + user_ref;
        } else {
            alert('No room found');
        }
    });
});

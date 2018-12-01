///////////////////////////////////////////////////////
//
// File: confo.js
// This is the main application file for client end point. It tries to use Enablex Web Toolkit to
// communicate with EnableX Servers
//
// Last Updated: 29-11-2018
// Reformat, Indentation, Inline Comments
//
/////////////////////////////////////////////////////


var localStream = null;
var username = null;
var room;

// Player Options
var options = {
    id: 'vcx_1001',
    attachMode: '',
    player: {
        'autoplay': '',
        'name': '',
        'nameDisplayMode': '',
        'frameFitMode': 'bestFit',
        'skin': 'classic',
        'class': '',
        'height': '400px',
        'width': '400px',
        'minHeight': '120px',
        'minWidth': '160px',
        'aspectRatio': '',
        'volume': 0,
        'media': '',
        'loader': {
            'show': false, 'url': '/img/loader.gif', 'style': 'default', 'class': ''
        },
        'backgroundImg': '/img/player-bg.gif'
    },
    toolbar: {
        'displayMode': 'auto',
        'autoDisplayTimeout': 0,
        'position': 'top',
        'skin': 'default',
        'iconset': 'default',
        'class': '',
        'buttons': {
            'play': false,
            'share': false,
            'mic': false,
            'resize': false,
            'volume': false,
            'mute': false,
            'record': false,
            'playtime': false,
            'zoom': false,
        },
        'branding': {
            'display': false,
            'clickthru': 'https://www.enablex.io',
            'target': 'new',
            'logo': '/img/enablex.png',
            'title': 'EnableX',
            'position': 'right'
        }
    }
};
window.onload = function () {

    // Local Stream Definition
    var config = {
        audio: true,
        video: true,
        data: true,
        videoSize: [640, 480, 640, 480],
        options: options
    };

    var countStream = 0;

    var localStreamId = null;
    var setLiveStream = function (stream) {

        // Listening to Text Data
        stream.addEventListener('stream-data', function (e) {
            console.log('stream data received : ');
            console.log(e);
            var text = e.msg.textMessage;
            var html = $(".multi_text_container_div").html();
            $(".multi_text_container_div").html(html + text + "<br>");
        });

        if (!stream.local) {
            var newStreamDiv = document.createElement('div');
            newStreamDiv.setAttribute('id', 'liveStream_' + countStream);
            newStreamDiv.setAttribute('class', 'live_stream_div');
            document.getElementsByClassName('multi_video_container_div')[0].appendChild(newStreamDiv);
            options.player.height = "120px";
            options.player.width = "120px";
            options.player.loader.class = "small_loader";
            stream.show('liveStream_' + countStream, options);
            countStream++;
        }
        else {
            options.player.loader.class = "";
            options.player.loader.show = false;
            stream.show('local_vedio_div', options);
        }

    }


    // URL Parsing to fetch Room Information to join

    var parseURLParams = function (url) {
        var queryStart = url.indexOf("?") + 1,
            queryEnd = url.indexOf("#") + 1 || url.length + 1,
            query = url.slice(queryStart, queryEnd - 1),
            pairs = query.replace(/\+/g, " ").split("&"),
            parms = {}, i, n, v, nv;

        if (query === url || query === "") return;

        for (i = 0; i < pairs.length; i++) {
            nv = pairs[i].split("=", 2);
            n = decodeURIComponent(nv[0]);
            v = decodeURIComponent(nv[1]);

            if (!parms.hasOwnProperty(n)) parms[n] = [];
            parms[n].push(nv.length === 2 ? v : null);
        }
        return parms;
    }

    // Function: To create user-json for Token Request
    var createDataJson = function (url) {
        var urlData = parseURLParams(url);
        username = urlData.user_ref[0];
        var retData = {
            "name": urlData.user_ref[0],
            "role": urlData.usertype[0],
            "roomId": urlData.roomId[0],
            "user_ref": urlData.user_ref[0],
        };
        return retData;

    }


    // Function: Create Token

    createToken(createDataJson(window.location.href), function (response) {
        var responseData = JSON.parse(response);
        var token = responseData.token;
        var ATList = null;

        // JOin Room
        localStream = EnxRtc.joinRoom(token, config, function (success, error) {
            if (error && error != null) {

            }
            if (success && success != null) {
                room = success.room;
                var ownId = success.publishId;
                setLiveStream(localStream);
                for (var i = 0; i < success.streams.length; i++) {
                    room.subscribe(success.streams[i]);
                }

                // Active Talker list is updated
                room.addEventListener('active-talkers-updated', function (event) {
                    ATList = event.message.activeList;
                    var video_player_len = document.querySelector('.multi_video_container_div').childNodes;
                    if (event.message && event.message !== null && event.message.activeList && event.message.activeList !== null) {

                        if (ATList.length == video_player_len.length) {
                            return;
                        }
                        else {
                            document.querySelector('.multi_video_container_div').innerHTML = "";
                            for (stream in room.remoteStreams.getAll()) {
                                var st = room.remoteStreams.getAll()[stream];
                                for (j = 0; j < ATList.length; j++) {
                                    if (ATList[j].streamId == st.getID()) {
                                        setLiveStream(st);
                                    }
                                }
                            }
                        }
                    }
                    console.log("Active Talker List :- " + JSON.stringify(event));
                });

                // Stream has been subscribed successfully
                room.addEventListener('stream-subscribed', function (streamEvent) {
                    var stream = (streamEvent.data && streamEvent.data.stream) ? streamEvent.data.stream : streamEvent.stream;
                    for (k = 0; k < ATList.length; k++) {
                        if (ATList[k].streamId == stream.getID()) {
                            setLiveStream(stream);
                        }
                    }
                });


                // Listening to Incoming Data
                room.addEventListener("active-talker-data-in", function (data) {
                    console.log("active-talker-data-in" + data);
                    var obj = {
                        'msg': data.message.message,
                        'timestamp': data.message.timestamp,
                        'username': data.message.from
                    };
                    plotChat(obj);
                });

                // Stream went out of Room
                room.addEventListener("stream-removed", function (event) {
                    console.log(event);
                });
            }
        });
    });
}

$(document).on("click", "div.vcx_bar", function (e) {
    $(this).parent().parent().toggleClass("fullScreen");
});


$(document).on("click", ".nav-tabs li a", function (e) {
    $(document).find(".nav-tabs li").removeClass("active");
    $(this).parent().addClass("active");
    $(document).find("div.tab-pane").removeClass("active");
    var activeDivId = $(this).attr("href");
    $(activeDivId).addClass("active");
});


$(document).on("click", "#sendText", function (e) {
    var rawText = $("#textArea").val();
    var text = username + ': ' + rawText;
    $("#textArea").val("");
    localStream.sendData({textMessage: text});
});


$(document).on("click", "#user_radio", function (e) {
    $(document).find(".user_select_div").show();
});


$(document).on("click", "#all_user_radio", function (e) {
    $(document).find(".user_select_div").hide();
});
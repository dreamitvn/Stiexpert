"use strict";
var session = function () {
    "use strict";
    $.sessionTimeout({
        keepAliveUrl      : 'keep-alive.html',
        logoutUrl         : 'pvr_components_session.html',
        redirUrl          : 'pvr_components_session.html',
        warnAfter         : 3000,
        redirAfter        : 15000,
        ignoreUserActivity: true,
        countdownBar      : true
    });

    var now = new Date(),
        hourDeg = now.getHours() / 12 * 360 + now.getMinutes() / 60 * 30,
        minuteDeg = now.getMinutes() / 60 * 360 + now.getSeconds() / 60 * 6,
        secondDeg = now.getSeconds() / 60 * 360,
        stylesDeg = [
            "@-webkit-keyframes rotate-hour{from{transform:rotate(" + hourDeg + "deg);}to{transform:rotate(" + (hourDeg + 360) + "deg);}}",
            "@-webkit-keyframes rotate-minute{from{transform:rotate(" + minuteDeg + "deg);}to{transform:rotate(" + (minuteDeg + 360) + "deg);}}",
            "@-webkit-keyframes rotate-second{from{transform:rotate(" + secondDeg + "deg);}to{transform:rotate(" + (secondDeg + 360) + "deg);}}",
            "@-moz-keyframes rotate-hour{from{transform:rotate(" + hourDeg + "deg);}to{transform:rotate(" + (hourDeg + 360) + "deg);}}",
            "@-moz-keyframes rotate-minute{from{transform:rotate(" + minuteDeg + "deg);}to{transform:rotate(" + (minuteDeg + 360) + "deg);}}",
            "@-moz-keyframes rotate-second{from{transform:rotate(" + secondDeg + "deg);}to{transform:rotate(" + (secondDeg + 360) + "deg);}}"
        ].join("");
    document.getElementById("clock-animations").innerHTML = stylesDeg;
};
var Session = function () {
    "use strict";
    return {
        init: function () {
            session();
        }
    }
}();
$(function () {
    Session.init();
});
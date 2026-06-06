"use strict";
var full_screen = function () {
    "use strict";

    var a = [ {
        featureType: "all",
        elementType: "all",
        stylers    : [ {
            invert_lightness: true
        }, {
            saturation: 15
        }, {
            lightness: 15
        }, {
            gamma: .8
        }, {
            hue: "#4e54c8"
        } ]
    }, {
        featureType: "water",
        stylers    : [ {
            visibility: "on"
        }, {
            color: "#293036"
        } ]
    } ];

    function t() {
        var t = {
            zoom            : 13,
            center          : new google.maps.LatLng(12.970, 77.600),
            mapTypeId       : google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: true
        };
        e = new google.maps.Map(document.getElementById("google-map"), t);
        e.setOptions({
            styles: a
        });
    }

    var e;
    google.maps.event.addDomListener(window, "load", t);
    $(window).on("resize", function () {
        google.maps.event.trigger(e, "resize")
    });


};
var map = function () {
    "use strict";
    return {
        init: function () {
            full_screen();
        }
    }
}();
$(function () {
    map.init();
});
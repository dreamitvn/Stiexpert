"use strict";
var v2 = function () {
    "use strict";
    $('.preloader').fadeOut('slow');
    $('#ri-grid').gridrotator({
        rows    : 5,
        columns : 8,
        maxStep : 2,
        interval: 1000,
        w1024   : {
            rows   : 5,
            columns: 6
        },
        w768    : {
            rows   : 5,
            columns: 5
        },
        w480    : {
            rows   : 6,
            columns: 4
        },
        w320    : {
            rows   : 7,
            columns: 4
        },
        w240    : {
            rows   : 7,
            columns: 3
        },
    });

    $(".form-control").on("focus", function () {
        $(this).parent().addClass("focused")
    }), $(".form-control").focusout(function () {
        var a = $(this);
        a.parents(".form-group-pvr").hasClass("form-float") ? "" == a.val() && a.parents(".form-line-pvr").removeClass("focused") : a.parents(".form-line-pvr").removeClass("focused")
    }), $("body").on("click", ".form-float .form-line-pvr .form-label", function () {
        $(this).parent().find("input").focus()
    });
};
var Login = function () {
    "use strict";
    return {
        init: function () {
            v2();
        }
    }
}();
$(function () {
    Login.init();
});
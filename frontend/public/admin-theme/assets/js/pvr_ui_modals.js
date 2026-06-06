"use strict";

function open_custombox(effect) {
    new Custombox.modal({
        content: {
            effect : effect,
            speedIn: 600,
            target : '#custom_box_modal'
        }
    }).open();
}

var modal = function () {
    "use strict";
    $(".open_custombox").on("click", function () {
        open_custombox($(this).attr('data-effect'));
    });

    var classes = new Array('btn-success', 'btn-primary', 'btn-warning', "btn-danger", "btn-info");
    var length = classes.length;
    var links = $('.custom_box button.btn');
    $.each(links, function (key, value) {
        $(value).addClass(classes[ Math.floor(Math.random() * length) ]);
        $(value).addClass("m-r-5 m-b-5 btn-wd");
    });
};
var Modal = function () {
    "use strict";
    return {
        init: function () {
            modal();
        }
    }
}();
$(function () {
    Modal.init();
});
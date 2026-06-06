"use strict";
var v1 = function () {
    "use strict";
    {
        const DOM = {};
        DOM.intro = document.querySelector('.content--intro');
        DOM.shape = DOM.intro.querySelector('svg.shape');
        DOM.path = DOM.shape.querySelector('path');
        DOM.enter = document.querySelector('.enter');
        charming(DOM.enter);
        DOM.enterLetters = Array.from(DOM.enter.querySelectorAll('span'));

        const init = () => {
        imagesLoaded(document.body, {background: true} , () => document.body.classList.remove('loading'));
        DOM.enter.addEventListener('click', navigate);
        DOM.enter.addEventListener('touchenter', navigate);
        navigate();
    }

        var loaded;
        const navigate = () => {
        if ( loaded ) return;
        loaded = true;

        anime({
            targets: DOM.intro,
            duration: 1800,
            easing: 'easeInOutSine',
            translateY: '-200vh'
        });

        anime({
            targets: DOM.path,
            duration: 1800,
            easing: 'easeInOutSine',
            d: DOM.path.getAttribute('pathdata:id')
        });
    };

        init();

        $(".form-control").on("focus", function () {
            $(this).parent().addClass("focused")
        }), $(".form-control").focusout(function () {
            var a = $(this);
            a.parents(".form-group-pvr").hasClass("form-float") ? "" == a.val() && a.parents(".form-line-pvr").removeClass("focused") : a.parents(".form-line-pvr").removeClass("focused")
        }), $("body").on("click", ".form-float .form-line-pvr .form-label", function () {
            $(this).parent().find("input").focus()
        });

        $('.preloader').fadeOut('slow');
    };
};
var Login = function () {
    "use strict";
    return {
        init: function () {
            v1();
        }
    }
}();
$(function () {
    Login.init();
});
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
        // Set the SVG transform origin.
        DOM.shape.style.transformOrigin = '50% 0%';

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
            duration: 1100,
            easing: 'easeInOutSine',
            translateY: '-200vh'
        });

        anime({
            targets: DOM.shape,
            scaleY: [
                {value:[0.8,1.8],duration: 550,easing: 'easeInQuad'},
                {value:1,duration: 550,easing: 'easeOutQuad'}
            ]
        });

        anime({
            targets: DOM.path,
            duration: 1100,
            easing: 'easeOutQuad',
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
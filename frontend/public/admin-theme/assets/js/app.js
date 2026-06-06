"use strict";
var pvrSlimScroll = function () {
        "use strict";
        $("[data-scrollbar=true]").each(function () {
            generateSlimScroll($(this))
        })
    },
    generateSlimScroll = function (e) {
        if (!$(e).attr("data-init")) {
            var a = $(e).attr("data-height"),
                t = {
                    height       : a = a || $(e).height(),
                    alwaysVisible: !0
                };
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? ($(e).css("height", a), $(e).css("overflow-x", "scroll")) : $(e).slimScroll(t), $(e).attr("data-init", !0)
        }
    },
    pvrSidebarMenu = function () {
        "use strict";
        $(".sidebar .nav > .has-sub > a").on("click", function () {
            var e = $(this).next(".sub-menu");
            0 === $(".page-sidebar-minified").length && ($(".sidebar .nav > li.has-sub > .sub-menu").not(e).slideUp(250, function () {
                $(this).closest("li").removeClass("expand")
            }), $(e).slideToggle(250, function () {
                var e = $(this).closest("li");
                $(e).hasClass("expand") ? $(e).removeClass("expand") : $(e).addClass("expand")
            }))
        }), $(".sidebar .nav > .has-sub .sub-menu li.has-sub > a").on('click', function () {
            if (0 === $(".page-sidebar-minified").length) {
                var e = $(this).next(".sub-menu");
                $(e).slideToggle(250)
            }
        })
    },
    pvrMobileSidebarToggle = function () {
        "use strict";
        var e = !1;
        $(".sidebar").on("bind", "click touchstart", function (a) {
            0 !== $(a.target).closest(".sidebar").length ? e = !0 : (e = !1, a.stopPropagation())
        }), $(document).on("bind", "click touchstart", function (a) {
            0 === $(a.target).closest(".sidebar").length && (e = !1), a.isPropagationStopped() || !0 === e || ($("#pvr-container").hasClass("page-sidebar-toggled") && (e = !0, $("#pvr-container").removeClass("page-sidebar-toggled")), $(window).width() <= 767 && $("#pvr-container").hasClass("page-right-sidebar-toggled") && (e = !0, $("#pvr-container").removeClass("page-right-sidebar-toggled")))
        }), $("[data-click=right-sidebar-toggled]").on("click", function (a) {
            a.stopPropagation();
            var t = "page-right-sidebar-collapsed";
            t = $(window).width() < 979 ? "page-right-sidebar-toggled" : t, $("#pvr-container").hasClass(t) ? $("#pvr-container").removeClass(t) : !0 !== e ? $("#pvr-container").addClass(t) : e = !1, $(window).width() < 480 && $("#pvr-container").removeClass("page-sidebar-toggled"), $(window).trigger("resize")
        }), $("[data-click=sidebar-toggled]").on("click", function (a) {
            a.stopPropagation();
            $("#pvr-container").hasClass("page-sidebar-toggled") ? $("#pvr-container").removeClass("page-sidebar-toggled") : !0 !== e ? $("#pvr-container").addClass("page-sidebar-toggled") : e = !1, $(window).width() < 480 && $("#pvr-container").removeClass("page-right-sidebar-toggled")
        });
    },
    pvrSidebarMinify = function () {
        "use strict";
        $("[data-click=sidebar-minify]").on("click", function (e) {
            e.preventDefault();
            $('#sidebar [data-scrollbar="true"]').css("margin-top", "0"), $('#sidebar [data-scrollbar="true"]').removeAttr("data-init"), $("#sidebar [data-scrollbar=true]").stop(), $("#pvr-container").hasClass("page-sidebar-minified") ? ($("#pvr-container").removeClass("page-sidebar-minified"), $("#pvr-container").hasClass("fixed_sidebar") ? (0 !== $("#sidebar .slimScrollDiv").length && ($('#sidebar [data-scrollbar="true"]').slimScroll({
                destroy: !0
            }), $('#sidebar [data-scrollbar="true"]').removeAttr("style")), generateSlimScroll($('#sidebar [data-scrollbar="true"]')), $("#sidebar [data-scrollbar=true]").trigger("mouseover")) : /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && (0 !== $("#sidebar .slimScrollDiv").length && ($('#sidebar [data-scrollbar="true"]').slimScroll({
                destroy: !0
            }), $('#sidebar [data-scrollbar="true"]').removeAttr("style")), generateSlimScroll($('#sidebar [data-scrollbar="true"]')))) : ($("#pvr-container").addClass("page-sidebar-minified"), /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? ($('#sidebar [data-scrollbar="true"]').css("margin-top", "0"), $('#sidebar [data-scrollbar="true"]').css("overflow", "visible")) : ($("#pvr-container").hasClass("fixed_sidebar") && ($('#sidebar [data-scrollbar="true"]').slimScroll({
                destroy: !0
            }), $('#sidebar [data-scrollbar="true"]').removeAttr("style")), $("#sidebar [data-scrollbar=true]").trigger("mouseover"))), $(window).trigger("resize")
        });
        if ($("#pvr-container").hasClass("page-sidebar-minified") && $("#pvr-container").hasClass("hover-sidebar")) {
            $("#sidebar").on("mouseover", function () {
                $("#pvr-container").removeClass("page-sidebar-minified")
            }).on("mouseout", function () {
                $("#pvr-container").addClass("page-sidebar-minified")
            });
        }
    },
    pvrPageContentView = function () {
        "use strict";
        $('.preloader').fadeOut('slow');
        $("#pvr-container").addClass("in");
        $("#make_theme_dark").on("click", function () {
            $("body").toggleClass("dark_version");
            if ($("body").hasClass("dark_version")) {
                $(this).find("span").text("Light Version");
                $(this).find("i").text("radio_button_unchecked");
            } else {
                $(this).find("span").text("Dark Version");
                $(this).find("i").text("radio_button_checked");
            }
        });
        $(".mt-cookie-consent-btn").on("click", function () {
            $(".pvr-cookie-consent-bar").addClass("animated fadeOutDown")
        });
    },
    panelActionRunning = !1,
    pvrPanelAction = function () {
        "use strict";
        if (panelActionRunning) return !1;
        panelActionRunning = !0, $(document).on("hover", "[data-click=panel-remove]", function (e) {
            $(this).attr("data-init") || ($(this).tooltip({
                title    : "Remove",
                placement: "top",
                trigger  : "hover",
                container: "body"
            }), $(this).tooltip("show"), $(this).attr("data-init", !0))
        }), $(document).on("click", "[data-click=panel-remove]", function (e) {
            e.preventDefault(), $(this).tooltip("destroy"), $(this).closest(".panel").addClass("removed-item")
        }), $(document).on("hover", "[data-click=panel-collapse]", function (e) {
            $(this).attr("data-init") || ($(this).tooltip({
                title    : "Collapse / Expand",
                placement: "top",
                trigger  : "hover",
                container: "body"
            }), $(this).tooltip("show"), $(this).attr("data-init", !0))
        }), $(document).on("click", "[data-click=panel-collapse]", function (e) {
            e.preventDefault(), $(this).closest(".panel").find(".panel-body").slideToggle(),
                $(this).closest(".panel").find(".panel-body").toggleClass("panel-body-hidden");
            if ($(this).closest(".panel").find(".panel-body").hasClass("panel-body-hidden")) {
                $(this).closest(".panel").find(".panel-heading").addClass("hide_afer");
            } else {
                $(this).closest(".panel").find(".panel-heading").removeClass("hide_afer");
            }
        }), $(document).on("hover", "[data-click=panel-reload]", function (e) {
            $(this).attr("data-init") || ($(this).tooltip({
                title    : "Reload",
                placement: "top",
                trigger  : "hover",
                container: "body"
            }), $(this).tooltip("show"), $(this).attr("data-init", !0))
        }), $(document).on("click", "[data-click=panel-reload]", function (e) {
            e.preventDefault();
            var a = $(this).closest(".panel");
            if (!$(a).hasClass("panel-loading")) {
                var t = $(a).find(".panel-body");
                $(a).addClass("panel-loading"), $(t).prepend('<div class="panel-loader"><span class="loading_small"></span></div>'), setTimeout(function () {
                    $(a).removeClass("panel-loading"), $(a).find(".panel-loader").remove()
                }, 2e3)
            }
        }), $(document).on("hover", "[data-click=panel-expand]", function (e) {
            $(this).attr("data-init") || ($(this).tooltip({
                title    : "Expand / Compress",
                placement: "top",
                trigger  : "hover",
                container: "body"
            }), $(this).tooltip("show"), $(this).attr("data-init", !0))
        }), $(document).on("click", "[data-click=panel-expand]", function (e) {
            e.preventDefault();
            var a = $(this).closest(".panel"),
                t = $(a).find(".panel-body"),
                i = 40;
            if (0 !== $(t).length) {
                var n = $(a).offset().top;
                i = $(t).offset().top - n
            }
            if ($("body").hasClass("panel-expand") && $(a).hasClass("panel-expand")) $("body, .panel").removeClass("panel-expand"), $(".panel").removeAttr("style"), $(t).removeAttr("style");
            else if ($("body").addClass("panel-expand"), $(this).closest(".panel").addClass("panel-expand"), 0 !== $(t).length && 40 != i) {
                var o = 40;
                $(a).find(" > *").each(function () {
                    var e = $(this).attr("class");
                    "panel-heading" != e && "panel-body" != e && (o += $(this).height() + 30)
                }), 40 != o && $(t).css("top", o + "px")
            }
            $(window).trigger("resize")
        })
    },
    handelTooltipPopoverActivation = function () {
        "use strict";
        0 !== $('[data-toggle="tooltip"]').length && $("[data-toggle=tooltip]").tooltip(), 0 !== $('[data-toggle="popover"]').length && $("[data-toggle=popover]").popover()
    },
    pvrScrollToTopButton = function () {
        "use strict";
        $(document).scroll(function () {
            $(document).scrollTop() >= 200 ? $("[data-click=scroll-top]").addClass("in") : $("[data-click=scroll-top]").removeClass("in")
        }), $("[data-click=scroll-top]").on("click", function (e) {
            e.preventDefault(), $("html, body").animate({scrollTop: 0}, 300);
            $("html, body").animate({scrollTop: 40}, 150);
            $("html, body").animate({scrollTop: 0}, 100);
            $("html, body").animate({scrollTop: 20}, 100);
            $("html, body").animate({scrollTop: 0}, 100);
            $("html, body").animate({scrollTop: 10}, 50);
            $("html, body").animate({scrollTop: 0}, 100);
            $("html, body").animate({scrollTop: 5}, 50);
            $("html, body").animate({scrollTop: 0}, 100);
        })
    },
    pvrAfterPageLoadAddClass = function () {
        "use strict";
        0 !== $("[data-pageload-addclass]").length && $(window).on('load', function () {
            $("[data-pageload-addclass]").each(function () {
                var e = $(this).attr("data-pageload-addclass");
                $(this).addClass(e)
            })
        })
    },
    pvrIEFullHeightContent = function () {
        "use strict";
        (window.navigator.userAgent.indexOf("MSIE ") > 0 || navigator.userAgent.match(/Trident.*rv\:11\./)) && $('.vertical-box-row [data-scrollbar="true"][data-height="100%"]').each(function () {
            var e = $(this).closest(".vertical-box-row"),
                a = $(e).height();
            $(e).find(".vertical-box-cell").height(a)
        })
    },
    pvrUnlimitedTabsRender = function () {
        "use strict";

        function e(e, a) {
            parseInt($(e).css("margin-left"), 10);
            var t = $(e).width(),
                i = $(e).find("li.active").width(),
                n = a > -1 ? a : 150,
                o = 0;
            if ($(e).find("li.active").prevAll().each(function () {
                    i += $(this).width()
                }), $(e).find("li").each(function () {
                    o += $(this).width()
                }), i >= t) {
                var s = i - t;
                o != i && (s += 40), $(e).find(".nav.nav-tabs").animate({
                    marginLeft: "-" + s + "px"
                }, n)
            }
            i != o && o >= t ? $(e).addClass("overflow-right") : $(e).removeClass("overflow-right"), i >= t && o >= t ? $(e).addClass("overflow-left") : $(e).removeClass("overflow-left")
        }

        function a(e, a) {
            var t = $(e).closest(".tab-overflow"),
                i = parseInt($(t).find(".nav.nav-tabs").css("margin-left"), 10),
                n = $(t).width(),
                o = 0,
                s = 0;
            switch ($(t).find("li").each(function () {
                $(this).hasClass("next-button") || $(this).hasClass("prev-button") || (o += $(this).width())
            }), a) {
                case "next":
                    (l = o + i - n) <= n ? (s = l - i, setTimeout(function () {
                        $(t).removeClass("overflow-right")
                    }, 150)) : s = n - i - 80, 0 != s && $(t).find(".nav.nav-tabs").animate({
                        marginLeft: "-" + s + "px"
                    }, 150, function () {
                        $(t).addClass("overflow-left")
                    });
                    break;
                case "prev":
                    var l = -i;
                    l <= n ? ($(t).removeClass("overflow-left"), s = 0) : s = l - n + 80, $(t).find(".nav.nav-tabs").animate({
                        marginLeft: "-" + s + "px"
                    }, 150, function () {
                        $(t).addClass("overflow-right")
                    })
            }
        }

        function t() {
            $(".tab-overflow").each(function () {
                var a = $(this).width(),
                    t = 0,
                    i = $(this),
                    n = a;
                $(i).find("li").each(function () {
                    var e = $(this);
                    t += $(e).width(), $(e).hasClass("active") && t > a && (n -= t)
                }), e(this, 0)
            })
        }

        $('[data-click="next-tab"]').on("click", function (e) {
            e.preventDefault(), a(this, "next")
        }), $('[data-click="prev-tab"]').on("click", function (e) {
            e.preventDefault(), a(this, "prev")
        }), $(window).on("resize", function () {
            $(".tab-overflow .nav.nav-tabs").removeAttr("style"), t()
        }), t()
    },
    pvrMobileSidebar = function () {
        "use strict";
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && $("#pvr-container").hasClass("page-sidebar-minified") && ($('#sidebar [data-scrollbar="true"]').css("overflow", "visible"), $('.page-sidebar-minified #sidebar [data-scrollbar="true"]').slimScroll({
            destroy: !0
        }), $('.page-sidebar-minified #sidebar [data-scrollbar="true"]').removeAttr("style"), $(".page-sidebar-minified #sidebar [data-scrollbar=true]").trigger("mouseover"));
        var e = 0;
        $(".page-sidebar-minified .sidebar [data-scrollbar=true] a").on("bind", "touchstart", function (a) {
            var t = (a.originalEvent.touches[ 0 ] || a.originalEvent.changedTouches[ 0 ]).pageY;
            e = t - parseInt($(this).closest("[data-scrollbar=true]").css("margin-top"), 10)
        }), $(".page-sidebar-minified .sidebar [data-scrollbar=true] a").on("bind", "touchmove", function (a) {
            if (a.preventDefault(), /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                var t = (a.originalEvent.touches[ 0 ] || a.originalEvent.changedTouches[ 0 ]).pageY - e;
                $(this).closest("[data-scrollbar=true]").css("margin-top", t + "px")
            }
        }), $(".page-sidebar-minified .sidebar [data-scrollbar=true] a").on("bind", "touchend", function (a) {
            var t = $(this).closest("[data-scrollbar=true]"),
                i = $(window).height(),
                n = parseInt($("#sidebar").css("padding-top"), 10),
                o = $("#sidebar").height();
            e = $(t).css("margin-top");
            var s = n;
            if ($(".sidebar").not(".sidebar-right").find(".nav").each(function () {
                    s += $(this).height()
                }), -parseInt(e, 10) + $(".sidebar").height() >= s && i <= s && o <= s) {
                var l = i - s - 20;
                $(t).animate({
                    marginTop: l + "px"
                })
            } else parseInt(e, 10) >= 0 || o >= s ? $(t).animate({
                marginTop: "0px"
            }) : (l = e, $(t).animate({
                marginTop: l + "px"
            }))
        })
    },
    pvrUnlimitedTopMenuRender = function () {
        "use strict";

        function e(e, a) {
            var t = $(e).closest(".nav"),
                i = parseInt($(t).css("margin-left"), 10),
                n = $(".top-menu").width() - 88,
                o = 0,
                s = 0;
            switch ($(t).find("li").each(function () {
                $(this).hasClass("menu-control") || (o += $(this).width())
            }), a) {
                case "next":
                    (l = o + i - n) <= n ? (s = l - i + 128, setTimeout(function () {
                        $(t).find(".menu-control.menu-control-right").removeClass("show")
                    }, 150)) : s = n - i - 128, 0 != s && $(t).animate({
                        marginLeft: "-" + s + "px"
                    }, 150, function () {
                        $(t).find(".menu-control.menu-control-left").addClass("show")
                    });
                    break;
                case "prev":
                    var l = -i;
                    l <= n ? ($(t).find(".menu-control.menu-control-left").removeClass("show"), s = 0) : s = l - n + 88, $(t).animate({
                        marginLeft: "-" + s + "px"
                    }, 150, function () {
                        $(t).find(".menu-control.menu-control-right").addClass("show")
                    })
            }
        }

        function a() {
            var e = $(".top-menu .nav"),
                a = $(".top-menu .nav > li"),
                t = $(".top-menu .nav > li.active"),
                i = $(".top-menu"),
                n = (parseInt($(e).css("margin-left"), 10), $(i).width() - 128),
                o = $(".top-menu .nav > li.active").width(),
                s = 0;
            if ($(t).prevAll().each(function () {
                    o += $(this).width()
                }), $(a).each(function () {
                    $(this).hasClass("menu-control") || (s += $(this).width())
                }), o >= n) {
                var l = o - n + 128;
                $(e).animate({
                    marginLeft: "-" + l + "px"
                }, 0)
            }
            o != s && s >= n ? $(e).find(".menu-control.menu-control-right").addClass("show") : $(e).find(".menu-control.menu-control-right").removeClass("show"), o >= n && s >= n ? $(e).find(".menu-control.menu-control-left").addClass("show") : $(e).find(".menu-control.menu-control-left").removeClass("show")
        }

        $('[data-click="next-menu"]').on("click", function (a) {
            a.preventDefault(), e(this, "next")
        }), $('[data-click="prev-menu"]').on("click", function (a) {
            a.preventDefault(), e(this, "prev")
        }), $(window).on("resize", function () {
            $(".top-menu .nav").removeAttr("style"), a()
        }), a()
    },
    pvrTopMenuSubMenu = function () {
        "use strict";
        $(".top-menu .sub-menu .has-sub > a").on("click", function () {
            var e = $(this).closest("li").find(".sub-menu").first(),
                a = $(this).closest("ul").find(".sub-menu").not(e);
            $(a).not(e).slideUp(250, function () {
                $(this).closest("li").removeClass("expand")
            }), $(e).slideToggle(250, function () {
                var e = $(this).closest("li");
                $(e).hasClass("expand") ? $(e).removeClass("expand") : $(e).addClass("expand")
            })
        })
    },
    pvrMobileTopMenuSubMenu = function () {
        "use strict";
        $(".top-menu .nav > li.has-sub > a").on("click", function () {
            if ($(window).width() <= 767) {
                var e = $(this).closest("li").find(".sub-menu").first(),
                    a = $(this).closest("ul").find(".sub-menu").not(e);
                $(a).not(e).slideUp(250, function () {
                    $(this).closest("li").removeClass("expand")
                }), $(e).slideToggle(250, function () {
                    var e = $(this).closest("li");
                    $(e).hasClass("expand") ? $(e).removeClass("expand") : $(e).addClass("expand")
                })
            }
        })
    },
    pvrTopMenuMobileToggle = function () {
        "use strict";
        $('[data-click="top-menu-toggled"]').on("click", function () {
            $(".top-menu").slideToggle(250)
        })
    },
    pvrClearSidebarSelection = function () {
        "use strict";
        $(".sidebar .nav > li, .sidebar .nav .sub-menu").removeClass("expand").removeAttr("style")
    },
    pvrClearSidebarMobileSelection = function () {
        "use strict";
        $("#pvr-container").removeClass("page-sidebar-toggled")
    },
    pvrSidebarChart = function () {
        "use strict";
        // Sidebar Chart
        if ($("#visit_chart_canvas").length !== 0) {
            var donutChart = $("#visit_chart_canvas");
            var data = {
                labels  : [ "USA", "Brazil", "Russia", "India", "Australia" ],
                datasets: [ {
                    data                : [ 300, 150, 50, 75, 200 ],
                    backgroundColor     : [ "#5797fc", "#7e6fff", "#4ecc48", "#ffcc29", "#f37070" ],
                    hoverBackgroundColor: [ "#5797fc", "#7e6fff", "#4ecc48", "#ffcc29", "#f37070" ],
                    borderWidth         : 0
                } ]
            };
            new Chart(donutChart, {
                type   : 'doughnut',
                data   : data,
                options: {
                    legend          : {
                        display: false
                    },
                    animation       : {
                        animateScale: true
                    },
                    cutoutPercentage: 80
                }
            });
        }
    },
    pvrCountJS = function () {
        "use strict";
        $("[data-count=true]").each(function () {
            generateCount($(this))
        })
    },
    generateCount = function (e) {
        "use strict";
        if (!$(e).attr("data-init")) {
            var a = $(e).attr("data-number");
            var id = $(e).attr("id");
            var options = {
                useEasing  : true,
                useGrouping: true,
                separator  : ',',
                decimal    : '.',
            };
            var demo = new CountUp(id, 0, parseInt(a, 10), 0, 2.5, options);
            if (!demo.error) {
                demo.start();
            } else {
                console.error(demo.error);
            }
        }
    },
    pvrTypeitJS = function () {
        "use strict";
        $("[data-typeit=true]").each(function () {
            generateTypeit($(this))
        })
    },
    generateTypeit = function (e) {
        "use strict";
        if ("[data-typeit=true]".length !== 0) {
            var a = $.trim($(e).text());
            var id = $(e).attr("id");
            $('#' + id).typeIt({
                whatToType: a,
                typeSpeed : 100,
                cursor    : true,
            });
        }
    },
    pvrSearch = function () {
        'use strict';
        var openCtrl = document.getElementById('btn-search'),
            closeCtrl = document.getElementById('btn-search-close'),
            searchContainer = document.querySelector('.search'),
            inputSearch = searchContainer.querySelector('.search__input');

        function init() {
            initEvents();
        }

        function initEvents() {
            openCtrl.addEventListener('click', openSearch);
            closeCtrl.addEventListener('click', closeSearch);
            document.addEventListener('keyup', function (ev) {
                // escape key.
                if (ev.keyCode == 27) {
                    closeSearch();
                }
            });
        }

        function openSearch() {
            searchContainer.classList.add('search--open');
            setTimeout(function () {
                inputSearch.focus();
            }, 0)
        }

        function closeSearch() {
            searchContainer.classList.remove('search--open');
            inputSearch.blur();
            inputSearch.value = '';
        }

        init();
    },
    pvrFullScreen = function () {
        'use strict';

        function toggleFullScreenMode() {
            if ((document.fullScreenElement && document.fullScreenElement !== null) ||
                (!document.mozFullScreen && !document.webkitIsFullScreen)) {
                if (document.documentElement.requestFullScreen) {
                    document.documentElement.requestFullScreen();
                } else if (document.documentElement.mozRequestFullScreen) {
                    document.documentElement.mozRequestFullScreen();
                } else if (document.documentElement.webkitRequestFullScreen) {
                    document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
                }
                $("#toggleFullScreen i").text("fullscreen_exit");
            } else {
                if (document.cancelFullScreen) {
                    document.cancelFullScreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                }
                $("#toggleFullScreen i").text("fullscreen");
            }
        }

        $("#toggleFullScreen").on("click", function () {
            toggleFullScreenMode();
        });
    },
    pluginInitialization = function () {
        $.fn._datepicker = function () {
            $('.date_picker').datepicker({
                autoclose     : !0,
                todayBtn      : true,
                todayHighlight: true,
            });
        };
        $.fn._daterange_picker = function () {
            $(".daterange_picker").datepicker({
                autoclose     : !0,
                todayBtn      : true,
                todayHighlight: true,
            })
        };
        $.fn._format_date_picker = function () {
            $(".format_date_picker").datepicker({
                autoclose     : !0,
                todayBtn      : true,
                todayHighlight: true,
                format        : "dd/mm/yyyy"
            })
        };
        $.fn._date_picker_disable_future = function () {
            var EndDate = new Date();
            $('.date_picker_disable_future').datepicker({
                endDate       : EndDate,
                autoclose     : !0,
                todayBtn      : true,
                todayHighlight: true,
            });
        };
        $.fn._date_picker_disable_past = function () {
            var StartDate = new Date();
            $('.date_picker_disable_past').datepicker({
                startDate     : StartDate,
                autoclose     : !0,
                todayBtn      : true,
                todayHighlight: true,
            });
        };
        $.fn._date_picker_start_view = function () {
            $('.date_picker_start_view').datepicker({
                startView     : 2,
                autoclose     : !0,
                todayBtn      : true,
                todayHighlight: true,
            });
        };
        $.fn._date_picker_clear = function () {
            $('.date_picker_clear').datepicker({
                clearBtn      : true,
                autoclose     : !0,
                todayBtn      : true,
                todayHighlight: true,
            });
        };
        $.fn._date_picker_multidate = function () {
            $('.date_picker_multidate').datepicker({
                multidate     : true,
                todayBtn      : true,
                todayHighlight: true,
            });
        };
        $.fn._date_picker_calendarweeks = function () {
            $('.date_picker_calendarweeks').datepicker({
                calendarWeeks : true,
                autoclose     : !0,
                todayBtn      : true,
                todayHighlight: true,
            });
        };
        $.fn._date_inline = function () {
            $('.date_inline').datepicker({
                calendarWeeks : true,
                autoclose     : !0,
                todayBtn      : true,
                todayHighlight: true,
            });
        };
        $.fn._date_time_picker = function () {
            $('.date_time_picker').datetimepicker({
                autoclose: !0,
            });
        };
        $.fn._time_picker = function () {
            $('.time_picker').datetimepicker({
                format      : "HH:ii P",
                showMeridian: true,
                autoclose   : true,
                startView   : 1
            });
        };
        $.fn._positioning_time_picker = function () {
            $('.positioning_time_picker').datetimepicker({
                pickerPosition: "top-left"
            });
        };
        $.fn._date_time_mirror_field = function () {
            $('.date_time_mirror_field').datetimepicker({
                format    : "dd MM yyyy - hh:ii",
                linkField : "mirror_field",
                linkFormat: "yyyy-mm-dd hh:ii",
                autoclose : true
            });
        };
        $.fn._date_time_inline = function () {
            $('.date_time_inline').datetimepicker({
                format    : "dd MM yyyy - hh:ii",
                linkFormat: "yyyy-mm-dd hh:ii",
            });
        };
        $.fn._date_range_picker = function () {
            $(".date_range_picker").daterangepicker({
                opens         : "right",
                format        : "MM/DD/YYYY",
                pickerPosition: "top-left",
                separator     : " to ",
                startDate     : moment().subtract("days", 29),
                endDate       : moment(),
                minDate       : "01/01/2012",
                maxDate       : "12/31/2018"
            }, function (e, t) {
                $(".date_range_picker input").val(e.format("MMMM D, YYYY") + " - " + t.format("MMMM D, YYYY"))
            });
        };
        $.fn._advance_daterange = function () {
            $(".advance_daterange span").html(moment().subtract("days", 29).format("MMMM D, YYYY") + " - " + moment().format("MMMM D, YYYY")),
                $(".advance_daterange").daterangepicker({
                    format             : "MM/DD/YYYY",
                    startDate          : moment().subtract(29, "days"),
                    endDate            : moment(),
                    dateLimit          : {
                        days: 60
                    },
                    showDropdowns      : !0,
                    showWeekNumbers    : !0,
                    timePicker         : !1,
                    timePickerIncrement: 1,
                    timePicker12Hour   : !0,
                    ranges             : {
                        Today         : [ moment(), moment() ],
                        Yesterday     : [ moment().subtract(1, "days"), moment().subtract(1, "days") ],
                        "Last 7 Days" : [ moment().subtract(6, "days"), moment() ],
                        "Last 30 Days": [ moment().subtract(29, "days"), moment() ],
                        "This Month"  : [ moment().startOf("month"), moment().endOf("month") ],
                        "Last Month"  : [ moment().subtract(1, "month").startOf("month"), moment().subtract(1, "month").endOf("month") ]
                    },
                    opens              : "right",
                    drops              : "down",
                    buttonClasses      : [ "btn", "btn-sm" ],
                    applyClass         : "btn-primary",
                    cancelClass        : "btn-default",
                    separator          : " to ",
                    locale             : {
                        applyLabel      : "Submit",
                        cancelLabel     : "Cancel",
                        fromLabel       : "From",
                        toLabel         : "To",
                        customRangeLabel: "Custom",
                        daysOfWeek      : [ "Su", "Mo", "Tu", "We", "Th", "Fr", "Sa" ],
                        monthNames      : [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ],
                        firstDay        : 1
                    }
                }, function (e, t, a) {
                    $(".advance_daterange span").html(e.format("MMMM D, YYYY") + " - " + t.format("MMMM D, YYYY"))
                });
        };
        $.fn._select2 = function () {
            $(".select_2").select2();
        };
        $.fn._select_2_multiple = function () {
            $(".select_2_multiple").select2({
                placeholder: "Multiple Select"
            });
        };
        $.fn._select_2_search_starts = function () {
            $(".select_2_search_starts").select2({
                placeholder: "Search from Starting letter",
                matcher    : function (params, data) {
                    if ($.trim(params.term) === '') {
                        return data;
                    }
                    if (data.text.toLowerCase().startsWith(params.term.toLowerCase())) {
                        var modifiedData = $.extend({}, data, true);
                        return modifiedData;
                    }
                    return null;
                }
            });
        };
        $.fn._select_2_limit = function () {
            $(".select_2_limit").select2({
                placeholder           : "Limit Selection",
                maximumSelectionLength: 2
            });
        };
        $.fn._select_2_clear = function () {
            $(".select_2_clear").select2({
                placeholder: 'Clearable Select',
                allowClear : true
            });
        };
        $.fn._select_2_hide_search = function () {
            $(".select_2_hide_search").select2({
                minimumResultsForSearch: Infinity
            });
        };
        $.fn._duallistbox = function () {
            $(".duallistbox").bootstrapDualListbox();
            $("#duallistbox").submit(function () {
                alert($('[name="duallistbox_demo1[]"]').val());
                return false;
            });
        };
        $.fn._clipboard = function () {
            new Clipboard(".btn").on("success", function (e) {
                $(e.trigger).tooltip({
                    title    : "Copied",
                    placement: "top"
                }), $(e.trigger).tooltip("show"), setTimeout(function () {
                    $(e.trigger).tooltip("destroy")
                }, 500)
            })
        };
        if ($(".date_picker").length > 0) {
            $()._datepicker();
        }
        if ($(".daterange_picker").length > 0) {
            $()._daterange_picker();
        }
        if ($(".format_date_picker").length > 0) {
            $()._format_date_picker();
        }
        if ($(".date_picker_disable_future").length > 0) {
            $()._date_picker_disable_future();
        }
        if ($(".date_picker_disable_past").length > 0) {
            $()._date_picker_disable_past();
        }
        if ($(".date_picker_start_view").length > 0) {
            $()._date_picker_start_view();
        }
        if ($(".date_picker_clear").length > 0) {
            $()._date_picker_clear();
        }
        if ($(".date_picker_multidate").length > 0) {
            $()._date_picker_multidate();
        }
        if ($(".date_picker_calendarweeks").length > 0) {
            $()._date_picker_calendarweeks();
        }
        if ($(".date_inline").length > 0) {
            $()._date_inline();
        }
        if ($(".date_time_picker").length > 0) {
            $()._date_time_picker();
        }
        if ($(".time_picker").length > 0) {
            $()._time_picker();
        }
        if ($(".positioning_time_picker").length > 0) {
            $()._positioning_time_picker();
        }
        if ($(".date_time_mirror_field").length > 0) {
            $()._date_time_mirror_field();
        }
        if ($(".date_time_inline").length > 0) {
            $()._date_time_inline();
        }
        if ($(".date_range_picker").length > 0) {
            $()._date_range_picker();
        }
        if ($(".advance_daterange").length > 0) {
            $()._advance_daterange();
        }
        if ($(".select_2").length > 0) {
            $()._select2();
        }
        if ($(".select_2_multiple").length > 0) {
            $()._select_2_multiple();
        }
        if ($(".select_2_search_starts").length > 0) {
            $()._select_2_search_starts();
        }
        if ($(".select_2_limit").length > 0) {
            $()._select_2_limit();
        }
        if ($(".select_2_clear").length > 0) {
            $()._select_2_clear();
        }
        if ($(".select_2_hide_search").length > 0) {
            $()._select_2_hide_search();
        }
        if ($(".duallistbox").length > 0) {
            $()._duallistbox();
        }
        if ($(".clipboard").length > 0) {
            $()._clipboard();
        }
    },
    live_customizer = function () {
        (function () {
            $("#theme").after('<script src="assets/plugins/classie/classie.js"></script><link href="assets/plugins/switchery/switchery.min.css" rel="stylesheet"/><script src="assets/plugins/switchery/switchery.min.js"></script>');
            $("#make_theme_dark").after('<!-- begin Live Customizer --><div class="pvr-floated-chat-btn" id="live_customizer"><i class="material-icons live_customizer_btn">settings</i><span class="live_customizer_btn">Settings</span></div><!-- end Live Customizer --> <!-- begin Live Customizer --><div class="menu-wrap live_customizer"><nav class="menu">   <div class="profile">  <img src="http://via.placeholder.com/128x128" alt="Andrew"/>  <span>Andrew</span></div>   <div class="link-list fixed-plugin">  <a href="javascript:void(0)"> <span class="fl">Dark Layout</span> <span><input type="checkbox" class="color_dark_settings"/></span>  </a>  <a href="javascript:void(0)"> <span class="fl">Minified Sidebar</span> <span><input type="checkbox" class="minified_switch_settings"/></span>  </a>  <a href="javascript:void(0)"> <span class="fl">Mega Menu Dark Layout</span> <span><input type="checkbox" class="minified_switch_mega_menu"/></span>  </a>   <a href="javascript:void(0)"> <span class="fl">Colors</span>  </a>   <div class="pull-right p-t-10 color_panel"> <span class="badge filter badge-purple active" data-color="blue"></span> <span class="badge filter badge-orange" data-color="orange"></span> <span class="badge filter badge-green" data-color="green"></span> <span class="badge filter badge-red" data-color="red"></span> <span class="badge filter badge-azure" data-color="azure"></span> <span class="badge filter badge-black" data-color="black"></span>  </div>  <div class="clearfix"></div>   </div>   <div class="icon-list_bottom">  <a href="javascript:void(0)"><i class="fa fa-fw fa-home"></i></a>  <a href="javascript:void(0)"><i class="fa fa-fw fa-question-circle"></i></a>  <a href="javascript:void(0)"><i class="fa fa-fw fa-power-off"></i></a>   </div></nav></div><!-- end Live Customizer -->');

            function init() {
                initEvents();
            }

            function initEvents() {
                openbtn.addEventListener('click', toggleMenu);
                if (closebtn) {
                    closebtn.addEventListener('click', toggleMenu);
                }
                // close the menu element if the target it´s not the menu element or one of its descendants..
                content.addEventListener('click', function (ev) {
                    var target = ev.target;
                    if (isOpen && target !== openbtn) {
                        toggleMenu();
                    }
                });
            }

            function toggleMenu() {
                if (isOpen) {
                    classie.remove(bodyEl, 'show-menu');
                }
                else {
                    classie.add(bodyEl, 'show-menu');
                }
                isOpen = !isOpen;
            }

            if ($("#make_theme_dark").length != 0) {
                var elem = document.querySelector('.color_dark_settings');
                var switchery = new Switchery(elem, {color: '#4e54c8', size: 'small'});
                var elem_2 = document.querySelector('.minified_switch_settings');
                var switchery_2 = new Switchery(elem_2, {color: '#4e54c8', size: 'small'});
                var elem_3 = document.querySelector('.minified_switch_mega_menu');
                var switchery_3 = new Switchery(elem_3, {color: '#4e54c8', size: 'small'});
                elem.onchange = function () {
                    if (elem.checked) {
                        $("body").addClass("dark_version");
                    } else {
                        $("body").removeClass("dark_version");
                    }
                };
                elem_2.onchange = function () {
                    if (elem_2.checked) {
                        $("#pvr-container").addClass("page-sidebar-minified");
                    } else {
                        $("#pvr-container").removeClass("page-sidebar-minified");
                    }
                };
                elem_3.onchange = function () {
                    if($(".dropdown-menu.dropdown-menu-lg").length){
                        if (elem_3.checked) {
                            $(".dropdown-menu.dropdown-menu-lg").addClass("dark_dropdown");
                        } else {
                            $(".dropdown-menu.dropdown-menu-lg").removeClass("dark_dropdown");
                        }
                    }
                };
                $(".color_panel span").on("click", function () {
                    var color = $(this).attr("data-color");
                    if (color == "blue") {
                        $("body").removeClass("blue").removeClass("orange").removeClass("green").removeClass("red").removeClass("azure").removeClass("black");
                    } else {
                        $("body").removeClass("blue").removeClass("orange").removeClass("green").removeClass("red").removeClass("azure").removeClass("black");
                        $("body").addClass(color);
                    }
                });
                var bodyEl = document.body,
                    content = document.querySelector('.content'),
                    openbtn = document.getElementById('live_customizer'),
                    closebtn = document.getElementById('content'),
                    isOpen = false;
                init();
            }
        })();
    },
    App = function () {
        "use strict";
        return {
            init                      : function () {
                this.initSidebar(), this.initTopMenu(), this.initPageLoad(), this.initComponent()
            },
            initSidebar               : function () {
                pvrSidebarMenu(), pvrMobileSidebarToggle(), pvrSidebarMinify(), pvrMobileSidebar(), pvrSidebarChart(), pvrCountJS();
                pvrTypeitJS(), pvrFullScreen();
                if ($(".search__input").length !== 0) {
                    pvrSearch();
                }
            },
            initSidebarSelection      : function () {
                pvrClearSidebarSelection()
            },
            initSidebarMobileSelection: function () {
                pvrClearSidebarMobileSelection()
            },
            initTopMenu               : function () {
                pvrUnlimitedTopMenuRender(), pvrTopMenuSubMenu(), pvrMobileTopMenuSubMenu(), pvrTopMenuMobileToggle()
            },
            initPageLoad              : function () {
                pvrPageContentView();
                live_customizer();
            },
            initComponent             : function () {
                pvrIEFullHeightContent(), pvrSlimScroll(), pvrUnlimitedTabsRender(), pvrPanelAction(), handelTooltipPopoverActivation(), pvrScrollToTopButton(), pvrAfterPageLoadAddClass();
                pluginInitialization();
            },
            scrollTop                 : function () {
                $("html, body").animate({
                    scrollTop: $("body").offset().top
                }, 0)
            }
        }
    }();
$(document).ready(function () {
    App.init();
});
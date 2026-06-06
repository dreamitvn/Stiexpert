"use strict";
var v2 = function () {
    "use strict";

    if ($("#pvrLineChart_1").length) {
        var pvrLineChart = $("#pvrLineChart_1");
        var pvrLineGradient = pvrLineChart[ 0 ].getContext('2d').createLinearGradient(0, 0, 0, 200);
        pvrLineGradient.addColorStop(0, 'rgba(147,104,233,0.48)');
        pvrLineGradient.addColorStop(1, 'rgba(148, 59, 234, 0.7)');
        var liteLineData = {
            labels  : [ "January 1", "January 5", "January 10", "January 15", "January 20", "January 25" ],
            datasets: [ {
                label                    : "Sold",
                fill                     : true,
                lineTension              : 0.4,
                backgroundColor          : pvrLineGradient,
                borderColor              : "#8f1cad",
                borderCapStyle           : 'butt',
                borderDash               : [],
                borderDashOffset         : 0.0,
                borderJoinStyle          : 'miter',
                pointBorderColor         : "#fff",
                pointBackgroundColor     : "#2a2f37",
                pointBorderWidth         : 2,
                pointHoverRadius         : 6,
                pointHoverBackgroundColor: "#943BEA",
                pointHoverBorderColor    : "#fff",
                pointHoverBorderWidth    : 2,
                pointRadius              : 4,
                pointHitRadius           : 5,
                data                     : [ 13, 28, 19, 24, 43, 49 ],
                spanGaps                 : false
            } ]
        };
        var mypvrLineChart = new Chart(pvrLineChart, {
            type   : 'line',
            data   : liteLineData,
            options: {
                tooltips: {
                    enabled: false
                },
                legend  : {
                    display: false
                },
                scales  : {
                    xAxes: [ {
                        display  : false,
                        ticks    : {
                            fontSize : '11',
                            fontColor: '#969da5'
                        },
                        gridLines: {
                            color        : 'rgba(0,0,0,0.0)',
                            zeroLineColor: 'rgba(0,0,0,0.0)'
                        }
                    } ],
                    yAxes: [ {
                        display: false,
                        ticks  : {
                            beginAtZero: true,
                            max        : 55
                        }
                    } ]
                }
            }
        });
    }

    if ($("#pvrLineChart_2").length) {
        var pvrLineChart = $("#pvrLineChart_2");
        var pvrLineGradient = pvrLineChart[ 0 ].getContext('2d').createLinearGradient(0, 0, 0, 200);
        pvrLineGradient.addColorStop(0, 'rgba(255, 165, 52,0.48)');
        pvrLineGradient.addColorStop(1, 'rgba(255, 82, 33, 0.7)');
        var liteLineData = {
            labels  : [ "January 1", "January 5", "January 10", "January 15", "January 20", "January 25" ],
            datasets: [ {
                label                    : "Sold",
                fill                     : true,
                lineTension              : 0.4,
                backgroundColor          : pvrLineGradient,
                borderColor              : "#FFA534",
                borderCapStyle           : 'butt',
                borderDash               : [],
                borderDashOffset         : 0.0,
                borderJoinStyle          : 'miter',
                pointBorderColor         : "#fff",
                pointBackgroundColor     : "#2a2f37",
                pointBorderWidth         : 2,
                pointHoverRadius         : 6,
                pointHoverBackgroundColor: "#FF5221",
                pointHoverBorderColor    : "#fff",
                pointHoverBorderWidth    : 2,
                pointRadius              : 4,
                pointHitRadius           : 5,
                data                     : [ 13, 28, 39, 24, 43, 19 ],
                spanGaps                 : false
            } ]
        };
        var mypvrLineChart = new Chart(pvrLineChart, {
            type   : 'line',
            data   : liteLineData,
            options: {
                tooltips: {
                    enabled: false
                },
                legend  : {
                    display: false
                },
                scales  : {
                    xAxes: [ {
                        display  : false,
                        ticks    : {
                            fontSize : '11',
                            fontColor: '#969da5'
                        },
                        gridLines: {
                            color        : 'rgba(0,0,0,0.0)',
                            zeroLineColor: 'rgba(0,0,0,0.0)'
                        }
                    } ],
                    yAxes: [ {
                        display: false,
                        ticks  : {
                            beginAtZero: true,
                            max        : 55
                        }
                    } ]
                }
            }
        });
    }

    if ($("#pvrLineChart_3").length) {
        var liteLineChart = $("#pvrLineChart_3");

        var liteLineGradient = liteLineChart[0].getContext('2d').createLinearGradient(0, 0, 0, 200);
        liteLineGradient.addColorStop(0, 'rgba(30,22,170,0.08)');
        liteLineGradient.addColorStop(1, 'rgba(30,22,170,0)');

        // line chart data
        var liteLineData = {
            labels: ["January 1", "January 5", "January 10", "January 15", "January 20", "January 25"],
            datasets: [{
                label: "Sold",
                fill: true,
                lineTension: 0.4,
                backgroundColor: liteLineGradient,
                borderColor: "#8f1cad",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "#fff",
                pointBackgroundColor: "#2a2f37",
                pointBorderWidth: 2,
                pointHoverRadius: 6,
                pointHoverBackgroundColor: "#FC2055",
                pointHoverBorderColor: "#fff",
                pointHoverBorderWidth: 2,
                pointRadius: 4,
                pointHitRadius: 5,
                data: [13, 28, 19, 24, 43, 49],
                spanGaps: false
            }]
        };

        // line chart init
        var myLiteLineChart = new Chart(liteLineChart, {
            type: 'line',
            data: liteLineData,
            options: {
                legend: {
                    display: false
                },
                scales: {
                    xAxes: [{
                        display: false,
                        ticks: {
                            fontSize: '11',
                            fontColor: '#969da5'
                        },
                        gridLines: {
                            color: 'rgba(0,0,0,0.0)',
                            zeroLineColor: 'rgba(0,0,0,0.0)'
                        }
                    }],
                    yAxes: [{
                        display: false,
                        ticks: {
                            beginAtZero: true,
                            max: 55
                        }
                    }]
                }
            }
        });
    }

    if ($("#pvrLineChart_4").length) {
        var pvrLineChart = $("#pvrLineChart_4");
        var pvrLineGradient = pvrLineChart[ 0 ].getContext('2d').createLinearGradient(0, 0, 0, 200);
        pvrLineGradient.addColorStop(0, 'rgba(135, 203, 22,0.48)');
        pvrLineGradient.addColorStop(1, 'rgba(109, 192, 48, 0.7)');
        var liteLineData = {
            labels  : [ "January 1", "January 5", "January 10", "January 15", "January 20", "January 25" ],
            datasets: [ {
                label                    : "Sold",
                fill                     : true,
                lineTension              : 0.4,
                backgroundColor          : pvrLineGradient,
                borderColor              : "#87CB16",
                borderCapStyle           : 'butt',
                borderDash               : [],
                borderDashOffset         : 0.0,
                borderJoinStyle          : 'miter',
                pointBorderColor         : "#fff",
                pointBackgroundColor     : "#2a2f37",
                pointBorderWidth         : 2,
                pointHoverRadius         : 6,
                pointHoverBackgroundColor: "#6DC030",
                pointHoverBorderColor    : "#fff",
                pointHoverBorderWidth    : 2,
                pointRadius              : 4,
                pointHitRadius           : 5,
                data                     : [ 13, 28, 39, 24, 43, 19 ],
                spanGaps                 : false
            } ]
        };
        var mypvrLineChart = new Chart(pvrLineChart, {
            type   : 'line',
            data   : liteLineData,
            options: {
                tooltips: {
                    enabled: false
                },
                legend  : {
                    display: false
                },
                scales  : {
                    xAxes: [ {
                        display  : false,
                        ticks    : {
                            fontSize : '11',
                            fontColor: '#969da5'
                        },
                        gridLines: {
                            color        : 'rgba(0,0,0,0.0)',
                            zeroLineColor: 'rgba(0,0,0,0.0)'
                        }
                    } ],
                    yAxes: [ {
                        display: false,
                        ticks  : {
                            beginAtZero: true,
                            max        : 55
                        }
                    } ]
                }
            }
        });
    }

    $(".add_shadow").realshadow({
        followMouse: false,
        type       : 'drop'
    });

    $(".upcoming_event_carasol").owlCarousel({
        items             : 5,
        autoplay          : true,
        loop              : true,
        margin            : 30,
        autoplayTimeout   : 5000,
        autoplayHoverPause: true,
        lazyLoad          : true,
        center            : true,
        nav               : true,
        navText           : [ '<i class="material-icons badge badge-success f-s-18">arrow_back</i> ', ' &nbsp;<i class="material-icons badge badge-success f-s-18">arrow_forward</i>' ],
        navClass          : [ 'owl-prev', 'owl-next' ],
        responsive        : {
            0   : {
                items: 1
            },
            600 : {
                items: 1
            },
            1100: {
                items: 1
            },
            1200: {
                items: 1
            }
        }
    });
};
var Dashboard = function () {
    "use strict";
    return {
        init: function () {
            v2();
        }
    }
}();
$(function () {
    Dashboard.init();
	$("#btn-search").trigger("click");
});
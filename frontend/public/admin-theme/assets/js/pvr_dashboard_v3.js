"use strict";
var v2 = function () {
    "use strict";
    if ($("#btc-chartjs").length) {
        var i;
        var pvrLineChart = $("#btc-chartjs");
        var a = pvrLineChart[ 0 ].getContext('2d');
        (i = a.createLinearGradient(0, 0, 0, 150)).addColorStop(0, 'rgba(147,104,233,1)'), i.addColorStop(1, "rgba(255,255,255,0)");
        new Chart(a, {
            type   : "line",
            options: {
                responsive         : !0,
                maintainAspectRatio: !1,
                datasetStrokeWidth : 3,
                pointDotStrokeWidth: 4,
                tooltipFillColor   : "rgba(255, 145, 73,0.8)",
                legend             : {
                    display: !1
                },
                hover              : {
                    mode: "label"
                },
                scales             : {
                    xAxes: [ {
                        display: !1
                    } ],
                    yAxes: [ {
                        display: !1,
                        ticks  : {
                            min: 0,
                            max: 85
                        }
                    } ]
                },
                title              : {
                    display  : !1,
                    fontColor: "#FFF",
                    fullWidth: !1,
                    fontSize : 30,
                    text     : "52%"
                }
            },
            data   : {
                labels  : [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul" ],
                datasets: [ {
                    label          : "BTC",
                    data           : [ 20, 18, 35, 60, 38, 40, 70 ],
                    backgroundColor: i,
                    borderColor    : "#8f1cad",
                    borderWidth    : 1.5,
                    strokeColor    : "#8f1cad",
                    pointRadius    : 0
                } ]
            }
        });
    }
    if ($("#eth-chartjs").length) {
        var i;
        var pvrLineChart = $("#eth-chartjs");
        var r = pvrLineChart[ 0 ].getContext('2d');
        (i = r.createLinearGradient(0, 0, 0, 150)).addColorStop(0, 'rgba(255, 165, 52,0.48)'), i.addColorStop(1, "rgba(255,255,255,0)");
        new Chart(r, {
            type   : "line",
            options: {
                responsive         : !0,
                maintainAspectRatio: !1,
                datasetStrokeWidth : 3,
                pointDotStrokeWidth: 4,
                tooltipFillColor   : "rgba(120, 144, 156,0.8)",
                legend             : {
                    display: !1
                },
                hover              : {
                    mode: "label"
                },
                scales             : {
                    xAxes: [ {
                        display: !1
                    } ],
                    yAxes: [ {
                        display: !1,
                        ticks  : {
                            min: 0,
                            max: 85
                        }
                    } ]
                },
                title              : {
                    display  : !1,
                    fontColor: "#FFF",
                    fullWidth: !1,
                    fontSize : 30,
                    text     : "52%"
                }
            },
            data   : {
                labels  : [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul" ],
                datasets: [ {
                    label          : "ETH",
                    data           : [ 40, 30, 60, 40, 45, 30, 60 ],
                    backgroundColor: i,
                    borderColor    : "#FFA534",
                    borderWidth    : 1.5,
                    strokeColor    : "#FFA534",
                    pointRadius    : 0
                } ]
            }
        });
    }
    if ($("#xrp-chartjs").length) {
        var pvrLineChart = $("#xrp-chartjs");
        var i, l = pvrLineChart[ 0 ].getContext('2d');
        (i = l.createLinearGradient(0, 0, 0, 150)).addColorStop(0, "rgba(135, 203, 22,0.48)"), i.addColorStop(1, "rgba(255,255,255,0)");
        new Chart(l, {
            type   : "line",
            options: {
                responsive         : !0,
                maintainAspectRatio: !1,
                datasetStrokeWidth : 3,
                pointDotStrokeWidth: 4,
                tooltipFillColor   : "rgba(30,159,242,0.8)",
                legend             : {
                    display: !1
                },
                hover              : {
                    mode: "label"
                },
                scales             : {
                    xAxes: [ {
                        display: !1
                    } ],
                    yAxes: [ {
                        display: !1,
                        ticks  : {
                            min: 0,
                            max: 85
                        }
                    } ]
                },
                title              : {
                    display  : !1,
                    fontColor: "#FFF",
                    fullWidth: !1,
                    fontSize : 30,
                    text     : "52%"
                }
            },
            data   : {
                labels  : [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul" ],
                datasets: [ {
                    label          : "XRP",
                    data           : [ 70, 20, 35, 60, 20, 40, 30 ],
                    backgroundColor: i,
                    borderColor    : "#87CB16",
                    borderWidth    : 1.5,
                    strokeColor    : "#87CB16",
                    pointRadius    : 0
                } ]
            }
        });
    }
    if ($("#lite-chartjs").length) {
        var i;
        var pvrLineChart = $("#lite-chartjs");
        var r = pvrLineChart[ 0 ].getContext('2d');
        (i = r.createLinearGradient(0, 0, 0, 100)).addColorStop(0, "rgba(255, 87, 85,0.48)"), i.addColorStop(1, "rgba(255,255,255,0)");
        new Chart(r, {
            type   : "line",
            options: {
                responsive         : !0,
                maintainAspectRatio: !1,
                datasetStrokeWidth : 3,
                pointDotStrokeWidth: 4,
                tooltipFillColor   : "rgba(120, 144, 156,0.8)",
                legend             : {
                    display: !1
                },
                hover              : {
                    mode: "label"
                },
                scales             : {
                    xAxes: [ {
                        display: !1
                    } ],
                    yAxes: [ {
                        display: !1,
                        ticks  : {
                            min: 0,
                            max: 85
                        }
                    } ]
                },
                title              : {
                    display  : !1,
                    fontColor: "#FFF",
                    fullWidth: !1,
                    fontSize : 30,
                    text     : "52%"
                }
            },
            data   : {
                labels  : [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul" ],
                datasets: [ {
                    label          : "ETH",
                    data           : [ 40, 30, 60, 40, 45, 30, 60 ],
                    backgroundColor: i,
                    borderColor    : "#ff5755",
                    borderWidth    : 1.5,
                    strokeColor    : "#ff5755",
                    pointRadius    : 0
                } ]
            }
        });
    }

    function altDate(value) {
        return function (value) {
            var diff = Date.now() - new Date(value);

            /**
             * If in a hour
             * e.g. "2 minutes ago"
             */
            if (diff < (60 * 60 * 1000)) {
                return moment(value).fromNow();
            }
            /*
             * If in the day
             * e.g. "11:23"
             */
            else if (diff < (60 * 60 * 24 * 1000)) {
                return moment(value).format('HH:mm');
            }
            /*
             * If in week
             * e.g "Tuesday"
             */
            else if (diff < (60 * 60 * 24 * 7 * 1000)) {
                return moment(value).format('dddd');
            }
            /*
             * If more than a week
             * e.g. 03/29/2016
             */
            else {
                return moment(value).calendar();
            }

        };
    }

    if ($("#cryptocoins").length) {
        var icons = [ "ADA", "ADA-alt", "ADC", "ADC-alt", "AEON", "AEON-alt", "AMP", "AMP-alt", "ANC", "ANC-alt", "ARCH", "ARCH-alt", "ARDR", "ARDR-alt", "ARK", "ARK-alt", "AUR", "AUR-alt", "BANX", "BANX-alt", "BAT", "BAT-alt", "BAY", "BAY-alt", "BC", "BC-alt", "BCN", "BCN-alt", "BFT", "BFT-alt", "BRK", "BRK-alt", "BRX", "BRX-alt", "BSD", "BSD-alt", "BTA", "BTC", "BTC-alt", "BCC", "BCC-alt", "BTCD", "BTCD-alt", "BTM", "BTM-alt", "BTS", "BTS-alt", "CLAM", "CLAM-alt", "CLOAK", "CLOAK-alt", "DAO", "DAO-alt", "DASH", "DASH-alt", "DCR", "DCR-alt", "DCT", "DCT-alt", "DGB", "DGB-alt", "DGD", "DGX", "DMD", "DMD-alt", "DOGE", "DOGE-alt", "EMC", "EMC-alt", "EOS", "EOS-alt", "ERC", "ERC-alt", "ETC", "ETC-alt", "ETH", "ETH-alt", "FC2", "FC2-alt", "FCT", "FCT-alt", "FLO", "FLO-alt", "FRK", "FRK-alt", "FTC", "FTC-alt", "GAME", "GAME-alt", "GBYTE", "GBYTE-alt", "GDC", "GDC-alt", "GEMZ", "GEMZ-alt", "GLD", "GLD-alt", "GNO", "GNO-alt", "GNT", "GNT-alt", "GOLOS", "GOLOS-alt", "GRC", "GRC-alt", "GRS", "HEAT", "HEAT-alt", "ICN", "ICN-alt", "IFC", "IFC-alt", "INCNT", "INCNT-alt", "IOC", "IOC-alt", "IOTA", "IOTA-alt", "JBS", "JBS-alt", "KMD", "KMD-alt", "KOBO", "KORE", "KORE-alt", "LBC", "LBC-alt", "LDOGE", "LDOGE-alt", "LSK", "LSK-alt", "LTC", "LTC-alt", "MAID", "MAID-alt", "MCO", "MCO-alt", "MINT", "MINT-alt", "MONA", "MONA-alt", "MRC", "MSC", "MSC-alt", "MTR", "MTR-alt", "MUE", "MUE-alt", "NBT", "NEO", "NEO-alt", "NEOS", "NEOS-alt", "NEU", "NEU-alt", "NLG", "NLG-alt", "NMC", "NMC-alt", "NOTE", "NOTE-alt", "NVC", "NVC-alt", "NXT", "NXT-alt", "OK", "OK-alt", "OMG", "OMG-alt", "OMNI", "OMNI-alt", "OPAL", "OPAL-alt", "PART", "PART-alt", "PIGGY", "PIGGY-alt", "PINK", "PINK-alt", "PIVX", "PIVX-alt", "POT", "POT-alt", "PPC", "PPC-alt", "QRK", "QRK-alt", "QTUM", "QTUM-alt", "RADS", "RADS-alt", "RBIES", "RBIES-alt", "RBT", "RBT-alt", "RBY", "RBY-alt", "RDD", "RDD-alt", "REP", "REP-alt", "RISE", "RISE-alt", "SALT", "SALT-alt", "SAR", "SAR-alt", "SCOT", "SCOT-alt", "SDC", "SDC-alt", "SIA", "SIA-alt", "SJCX", "SJCX-alt", "SLG", "SLG-alt", "SLS", "SLS-alt", "SNRG", "SNRG-alt", "START", "START-alt", "STEEM", "STEEM-alt", "STR", "STR-alt", "STRAT", "STRAT-alt", "SWIFT", "SWIFT-alt", "SYNC", "SYNC-alt", "SYS", "SYS-alt", "TRIG", "TRIG-alt", "TX", "TX-alt", "UBQ", "UBQ-alt", "UNITY", "UNITY-alt", "USDT", "USDT-alt", "VIOR", "VIOR-alt", "VNL", "VNL-alt", "VPN", "VPN-alt", "VRC", "VRC-alt", "VTC", "VTC-alt", "WAVES", "WAVES-alt", "XAI", "XAI-alt", "XBS", "XBS-alt", "XCP", "XCP-alt", "XEM", "XEM-alt", "XMR", "XPM", "XPM-alt", "XRP", "XRP-alt", "XTZ", "XTZ-alt", "XVG", "XVG-alt", "XZC", "XZC-alt", "YBC", "YBC-alt", "ZEC", "ZEC-alt", "ZEIT", "ZEIT-alt" ];

        $('#cryptocoins').DataTable({
            "serverSide": true,
            "processing": true,
            "searching" : false,
            "paging"    : false,
            "ordering"  : false,
            "info"      : false,
            "ajax"      : {"url": "https://api.coinmarketcap.com/v1/ticker/?limit=100", "dataSrc": ""},
            "columnDefs": [ {
                "targets": 0,
                "render" : function (data, type, row, meta) {
                    if (jQuery.inArray(data, icons) !== -1) {
                        return "<div class=\"user_box\">\n" +
                            "<div class=\"user-with-avatar\">\n" +
                            "    <i class=\"cc " + data + " f-s-22\" title=\"BTC\"></i>\n" +
                            "</div>\n" +
                            "<div class=\"user_email\">\n" +
                            "            <span>\n" +
                            "                " + row[ 'name' ] + "\n" +
                            "            </span>\n" +
                            "    <span class=\"f-s-11\">\n" +
                            "                Rank: " + row[ 'rank' ] + " | $" + row[ 'price_usd' ] + "\n" +
                            "            </span>\n" +
                            "</div>\n" +
                            "</div>";
                    } else {
                        return "<div class=\"user_box\">\n" +
                            "<div class=\"user-with-avatar\">\n" +
                            "    <i class=\"cc " + icons[ Math.floor(Math.random() * length) ] + " f-s-22\" title=\"BTC\"></i>\n" +
                            "</div>\n" +
                            "<div class=\"user_email\">\n" +
                            "            <span>\n" +
                            "                " + row[ 'name' ] + "\n" +
                            "            </span>\n" +
                            "    <span class=\"f-s-11\">\n" +
                            "                Rank: " + row[ 'rank' ] + " | $" + row[ 'price_usd' ] + "\n" +
                            "            </span>\n" +
                            "</div>\n" +
                            "</div>";
                    }
                },
            }, {
                "targets": 3,
                "render" : function (data, type, row, meta) {
                    return altDate(data);
                },
            }, {
                "targets": 1,
                "render" : function (data, type, row, meta) {
                    return "<span><i class=\"cc BTC\" title=\"BTC\"></i> " + data + "</span>";
                },
            }, {
                "targets": 2,
                "render" : function (data, type, row, meta) {
                    return "<span><i class=\"fa fa-dollar BTC\"></i> " + data + "</span>";
                },
            } ],
            "columns"   : [
                {"data": "symbol"},
                {"data": "price_usd"},
                {"data": "price_btc"},
                {"data": "last_updated"}
            ]
        });
    }

    if ($("#dynamic_chart").length) {
        Highcharts.chart('dynamic_chart', {
            chart    : {
                type       : 'spline',
                animation  : Highcharts.svg, // don't animate in old IE
                marginRight: 10,
                events     : {
                    load: function () {
                        // set up the updating of the chart each second
                        var series = this.series[ 0 ];
                        setInterval(function () {
                            var x = (new Date()).getTime(), // current time
                                y = Math.random();
                            series.addPoint([ x, y ], true, true);
                        }, 1000);
                    }
                }
            },
            title    : {
                text: 'BTC Live USD Update'
            },
            xAxis    : {
                type             : 'datetime',
                tickPixelInterval: 150
            },
            yAxis    : {
                title    : {
                    text: 'Value'
                },
                plotLines: [ {
                    value: 0,
                    width: 1,
                    color: '#808080'
                } ]
            },
            tooltip  : {
                formatter: function () {
                    return '<b>' + this.series.name + '</b><br/>' +
                        Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                        Highcharts.numberFormat(this.y, 2);
                }
            },
            legend   : {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            series   : [ {
                name: 'Random data',
                data: (function () {
                    // generate an array of random data
                    var data = [],
                        time = (new Date()).getTime(),
                        i;

                    for (i = -19; i <= 0; i += 1) {
                        data.push({
                            x: time + i * 1000,
                            y: Math.random()
                        });
                    }
                    return data;
                }())
            } ]
        });
    }

    function t() {
        var t = [ 50, 30, 45, 40, 50, 20, 35, 40, 50, 70, 90, 40 ];
        e.type = "line";
        e.height = "23px";
        e.lineColor = red;
        e.highlightLineColor = red;
        e.highlightSpotColor = red;
        var n = $("#sparkline-unique-visitor").width();
        if (n >= 200) {
            e.width = "200px"
        } else {
            e.width = "100%"
        }
        $("#sparkline-unique-visitor").sparkline(t, e);
        e.lineColor = orange;
        e.highlightLineColor = orange;
        e.highlightSpotColor = orange;
        $("#sparkline-bounce-rate").sparkline(t, e);
        e.lineColor = green;
        e.highlightLineColor = green;
        e.highlightSpotColor = green;
        $("#sparkline-total-page-views").sparkline(t, e);
        e.lineColor = blue;
        e.highlightLineColor = blue;
        e.highlightSpotColor = blue;
        $("#sparkline-avg-time-on-site").sparkline(t, e);
        e.lineColor = grey;
        e.highlightLineColor = grey;
        e.highlightSpotColor = grey;
        $("#sparkline-new-visits").sparkline(t, e);
        e.lineColor = dark;
        e.highlightLineColor = dark;
        e.highlightSpotColor = grey;
        $("#sparkline-return-visitors").sparkline(t, e)
    }

    if ($("#bit_source").length) {
        var blue = "#348fe2",
            orange = "#f59c1a",
            green = "#00acac",
            grey = "#b6c2c9",
            dark = "#2d353c",
            red = "#ff5b57";

        var e = {
            height            : "50px",
            width             : "100%",
            fillColor         : "transparent",
            lineWidth         : 2,
            spotRadius        : "4",
            highlightLineColor: blue,
            highlightSpotColor: blue,
            spotColor         : false,
            minSpotColor      : false,
            maxSpotColor      : false
        };
        t();
        $(window).on("resize", function () {
            $("#sparkline-unique-visitor").empty();
            $("#sparkline-bounce-rate").empty();
            $("#sparkline-total-page-views").empty();
            $("#sparkline-avg-time-on-site").empty();
            $("#sparkline-new-visits").empty();
            $("#sparkline-return-visitors").empty();
            t()
        });
    }

    if ($("#sales_chart").length) {
        var ctx = document.getElementById('sales_chart').getContext('2d');
        var myBarChart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'bar',

            // The data for our dataset
            data: {
                labels  : [ "Bitcoin", "Ethereum", "Ripple", "BTC Cash", "Litecoin" ],
                datasets: [ {
                    label               : "Bitcoin",
                    data                : [ 40, 90, 210, 160, 230 ],
                    backgroundColor     : '#ffa534',
                    borderColor         : '#ffa534',
                    pointBorderColor    : '#ffffff',
                    pointBackgroundColor: '#ffa534',
                    pointBorderWidth    : 2,
                    pointRadius         : 4

                }, {
                    label               : "My Second dataset",
                    data                : [ 160, 140, 20, 270, 110 ],
                    backgroundColor     : '#3d74f1',
                    borderColor         : '#3d74f1',
                    pointBorderColor    : '#ffffff',
                    pointBackgroundColor: '#3d74f1',
                    pointBorderWidth    : 2,
                    pointRadius         : 4
                } ]
            },

            // Configuration options go here
            options: {
                maintainAspectRatio: false,
                legend             : {
                    display: false
                },

                scales  : {
                    xAxes: [ {
                        display  : true,
                        gridLines: {
                            zeroLineColor     : '#e7ecf0',
                            color             : '#e7ecf0',
                            borderDash        : [ 5, 5, 5 ],
                            zeroLineBorderDash: [ 5, 5, 5 ],
                            drawBorder        : false
                        }
                    } ],
                    yAxes: [ {
                        display  : true,
                        gridLines: {
                            zeroLineColor     : '#e7ecf0',
                            color             : '#e7ecf0',
                            borderDash        : [ 5, 5, 5 ],
                            zeroLineBorderDash: [ 5, 5, 5 ],
                            drawBorder        : false
                        }
                    } ]

                },
                elements: {
                    line : {
                        tension    : 0.00001,
//              tension: 0.4,
                        borderWidth: 1
                    },
                    point: {
                        radius     : 2,
                        hitRadius  : 10,
                        hoverRadius: 6,
                        borderWidth: 4
                    }
                }
            }
        });
    }

    if ($("#state_order_chart").length && $("#users_online").length) {
        $("#users_online").sparkline([ 102, 109, 120, 99, 110, 80, 87, 114, 102, 109, 120, 99, 110, 80, 87, 74 ], {
            type      : 'bar',
            height    : '100',
            barWidth  : 9,
            barSpacing: 10,
            barColor  : 'rgba(255,255,255,.3)'
        });

        var ctx = document.getElementById('state_order_chart').getContext('2d');
        var chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'line',

            // The data for our dataset
            data: {
                labels  : [ "BTC", "Ethereum", "Ripple", "Litecoin", "BTC", "Cash" ],
                datasets: [ {
                    label               : "Dollar",
                    backgroundColor     : 'rgba(251,146,140,.15)',
                    borderColor         : '#fb928c',
                    pointBackgroundColor: "#ffffff",
                    data                : [ 120, 200, 170, 200, 150, 170 ]
                } ]
            },

            // Configuration options go here
            options: {
                maintainAspectRatio: false,
                legend             : {
                    display: false
                },

                scales  : {
                    xAxes: [ {
                        display: false
                    } ],
                    yAxes: [ {
                        display  : false,
                        gridLines: {
                            zeroLineColor     : '#e7ecf0',
                            color             : '#e7ecf0',
                            borderDash        : [ 5, 5, 5 ],
                            zeroLineBorderDash: [ 5, 5, 5 ],
                            drawBorder        : false
                        }
                    } ]

                },
                elements: {
                    line : {
                        tension    : 0.00001,
                        //tension: 0.4,
                        borderWidth: 1
                    },
                    point: {
                        radius     : 2,
                        hitRadius  : 10,
                        hoverRadius: 6,
                        borderWidth: 2
                    }
                }
            }
        });
    }

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
                tooltips: {enabled: false},
                legend  : {display: false},
                scales  : {
                    xAxes     : [ {
                        display  : false,
                        ticks    : {fontSize: '11', fontColor: '#969da5'},
                        gridLines: {color: 'rgba(0,0,0,0.0)', zeroLineColor: 'rgba(0,0,0,0.0)'}
                    } ], yAxes: [ {display: false, ticks: {beginAtZero: true, max: 55}} ]
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
                tooltips: {enabled: false},
                legend  : {display: false},
                scales  : {
                    xAxes     : [ {
                        display  : false,
                        ticks    : {fontSize: '11', fontColor: '#969da5'},
                        gridLines: {color: 'rgba(0,0,0,0.0)', zeroLineColor: 'rgba(0,0,0,0.0)'}
                    } ], yAxes: [ {display: false, ticks: {beginAtZero: true, max: 55}} ]
                }
            }
        });
    }
    if ($("#pvrLineChart_3").length) {
        var pvrLineChart = $("#pvrLineChart_3");
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
                tooltips: {enabled: false},
                legend  : {display: false},
                scales  : {
                    xAxes     : [ {
                        display  : false,
                        ticks    : {fontSize: '11', fontColor: '#969da5'},
                        gridLines: {color: 'rgba(0,0,0,0.0)', zeroLineColor: 'rgba(0,0,0,0.0)'}
                    } ], yAxes: [ {display: false, ticks: {beginAtZero: true, max: 55}} ]
                }
            }
        });
    }
    if ($("#pvrLineChart_4").length) {
        var pvrLineChart = $("#pvrLineChart_4");
        var pvrLineGradient = pvrLineChart[ 0 ].getContext('2d').createLinearGradient(0, 0, 0, 200);
        pvrLineGradient.addColorStop(0, 'rgba(251, 64, 75,0.48)');
        pvrLineGradient.addColorStop(1, 'rgba(251, 102, 110, 0.7)');
        var liteLineData = {
            labels  : [ "January 1", "January 5", "January 10", "January 15", "January 20", "January 25" ],
            datasets: [ {
                label                    : "Sold",
                fill                     : true,
                lineTension              : 0.4,
                backgroundColor          : pvrLineGradient,
                borderColor              : "#FB404B",
                borderCapStyle           : 'butt',
                borderDash               : [],
                borderDashOffset         : 0.0,
                borderJoinStyle          : 'miter',
                pointBorderColor         : "#fff",
                pointBackgroundColor     : "#2a2f37",
                pointBorderWidth         : 2,
                pointHoverRadius         : 6,
                pointHoverBackgroundColor: "#FB404B",
                pointHoverBorderColor    : "#fff",
                pointHoverBorderWidth    : 2,
                pointRadius              : 4,
                pointHitRadius           : 5,
                data                     : [ 13, 8, 29, 24, 43, 49 ],
                spanGaps                 : false
            } ]
        };
        var mypvrLineChart = new Chart(pvrLineChart, {
            type   : 'line',
            data   : liteLineData,
            options: {
                tooltips: {enabled: false},
                legend  : {display: false},
                scales  : {
                    xAxes     : [ {
                        display  : false,
                        ticks    : {fontSize: '11', fontColor: '#969da5'},
                        gridLines: {color: 'rgba(0,0,0,0.0)', zeroLineColor: 'rgba(0,0,0,0.0)'}
                    } ], yAxes: [ {display: false, ticks: {beginAtZero: true, max: 55}} ]
                }
            }
        });
    }


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
});
﻿
            var chart1;

            $(function () {

                myTemperatureData();
                myDataChart2();
                gaugeChart();
                csvChart();
                schemeChart();

            });

            function myTemperatureData() {
                $.getJSON('/account/temperature', function (data) {

                    var dates = [];
                    for (var i = 0; i < data.time.length; i++) {
                        var date = new Date(data.time[i] * 1000);
                        dates[i] = date;
                    }

                    var options = {
                        chart: {
                            renderTo: 'container-temp',
                            type: 'spline'
                        },
                        title: {
                            text: 'Monthly Average Temperature',
                            x: -20 //center
                        },
                        subtitle: {
                            text: 'Source: WorldClimate.com',
                            x: -20
                        },
                        xAxis: {
                            categories: dates//data.months
                            , labels: {
                                formatter: function () {
                                    var monthStr = Highcharts.dateFormat('%b', this.value);
                                    return monthStr;
                                }
                            }
                        },
                        global: { useUTC: true },
                        yAxis: {
                            title: {
                                text: 'Temperature (°C)'
                            },
                            plotLines: [{
                                value: 0,
                                width: 1,
                                color: '#808080'
                            }]
                        },
                        tooltip: {
                            valueSuffix: '°C'
                        },
                        legend: {
                            layout: 'vertical',
                            align: 'right',
                            verticalAlign: 'middle',
                            borderWidth: 0
                        },
                        series: []
                    };

                    var k = 0;
                    $.each(data.t, function (key, value) {
                        options.series[k] = value;
                        k++;
                    });
                    var chart = new Highcharts.Chart(options);
                });
            }

            function myDataChart2() {
                $.getJSON('/account/app', function (data) {
                    var dates = [];
                    for (var i = 0; i < data.Stamp.length; i++) {
                        var date = new Date(data.Stamp[i] * 1000);
                        dates[i] = date;
                    }

                    var options = {
                        chart: {
                            renderTo: 'container-date',
                            type: 'spline'
                        },
                        title: {
                            text: "Apps data"
                        },
                        yAxis: {
                            title: {
                                text: 'Speed'
                            },
                            plotLines: [{
                                value: 0,
                                width: 1,
                                color: '#808080'
                            }]
                        },
                        xAxis: {
                            type: 'datetime',
                            tickPixelInterval: 100,
                            categories: dates,
                            labels: {
                                formatter: function () {
                                    var monthStr = Highcharts.dateFormat('%e %b', this.value);
                                    return monthStr;
                                }
                            }
                        },
                        global: { useUTC: true },
                        series: [
                            {
                                name: 'Tasks of ' + data.Name,
                                data: data.Tasks
                            }
                        ]
                    };

                    var k = 0;
                    $.each(data, function (key, value) {
                        //options.series[k] = value;
                        k++;
                    });


                    var chart = new Highcharts.Chart(options);
                });
            }

            function gaugeChart() {
                $('#container-gauge').highcharts({

                    chart: {
                        type: 'gauge',
                        plotBorderWidth: 1,
                        plotBackgroundColor: {
                            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                            stops: [
                                [0, '#FFF4C6'],
                                [0.3, '#FFFFFF'],
                                [1, '#FFF4C6']
                            ]
                        },
                        plotBackgroundImage: null,
                        height: 200
                    },

                    title: {
                        text: 'VU meter'
                    },

                    pane: [{
                        startAngle: -45,
                        endAngle: 45,
                        background: null,
                        center: ['50%', '145%'],
                        size: 300
                    }],

                    yAxis: [{
                        min: -20,
                        max: 6,
                        minorTickPosition: 'outside',
                        tickPosition: 'outside',
                        labels: {
                            rotation: 'auto',
                            distance: 20
                        },
                        plotBands: [{
                            from: 0,
                            to: 6,
                            color: '#C02316',
                            innerRadius: '100%',
                            outerRadius: '105%'
                        }],
                        pane: 0,
                        title: {
                            text: 'VU<br/><span style="font-size:8px">Channel A</span>',
                            y: -40
                        }
                    }],

                    plotOptions: {
                        gauge: {
                            dataLabels: {
                                enabled: false
                            },
                            dial: {
                                radius: '100%'
                            }
                        }
                    },


                    series: [{
                        data: [-20],
                        yAxis: 0
                    }]

                },

                    // Let the music play
                    function (chart) {
                        setInterval(function () {
                            var left = chart.series[0].points[0],

                                leftVal,

                                inc = (Math.random() - 0.5) * 3;

                            leftVal = left.y + inc;

                            if (leftVal < -20 || leftVal > 6) {
                                leftVal = left.y - inc;
                            }


                            left.update(leftVal, false);

                            chart.redraw();

                        }, 500);

                    });
            }

            function csvChart() {
                // Get the CSV and create the chart
                $.getJSON('http://www.highcharts.com/samples/data/jsonp.php?filename=analytics.csv&callback=?', function (csv) {

                    $('#container').highcharts({

                        data: {
                            csv: csv
                        },

                        title: {
                            text: 'Daily visits at www.highcharts.com'
                        },

                        subtitle: {
                            text: 'Source: Google Analytics'
                        },

                        xAxis: {
                            tickInterval: 7 * 24 * 3600 * 1000, // one week
                            tickWidth: 0,
                            gridLineWidth: 1,
                            labels: {
                                align: 'left',
                                x: 3,
                                y: -3
                            }
                        },

                        yAxis: [{ // left y axis
                            title: {
                                text: null
                            },
                            labels: {
                                align: 'left',
                                x: 3,
                                y: 16,
                                format: '{value:.,0f}'
                            },
                            showFirstLabel: false
                        }, { // right y axis
                            linkedTo: 0,
                            gridLineWidth: 0,
                            opposite: true,
                            title: {
                                text: null
                            },
                            labels: {
                                align: 'right',
                                x: -3,
                                y: 16,
                                format: '{value:.,0f}'
                            },
                            showFirstLabel: false
                        }],

                        legend: {
                            align: 'left',
                            verticalAlign: 'top',
                            y: 20,
                            floating: true,
                            borderWidth: 0
                        },

                        tooltip: {
                            shared: true,
                            crosshairs: true
                        },

                        plotOptions: {
                            series: {
                                cursor: 'pointer',
                                point: {
                                    events: {
                                        click: function (e) {
                                            hs.htmlExpand(null, {
                                                pageOrigin: {
                                                    x: e.pageX || e.clientX,
                                                    y: e.pageY || e.clientY
                                                },
                                                headingText: this.series.name,
                                                maincontentText: Highcharts.dateFormat('%A, %b %e, %Y', this.x) + ':<br/> ' +
                                                    this.y + ' visits',
                                                width: 200
                                            });
                                        }
                                    }
                                },
                                marker: {
                                    lineWidth: 1
                                }
                            }
                        },

                        series: [{
                            name: 'All visits',
                            lineWidth: 4,
                            marker: {
                                radius: 4
                            }
                        }, {
                            name: 'New visitors'
                        }]
                    });
                });
            }

            function schemeChart() {
                chart1 = new Highcharts.Chart({
                    chart: {
                        renderTo: 'container-scheme',
                        backgroundColor: 'white',
                        events: {
                            load: function () {

                                // Draw the flow chart
                                var ren = this.renderer,
                                    colors = Highcharts.getOptions().colors,
                                    rightArrow = ['M', 0, 0, 'L', 100, 0, 'L', 95, 5, 'M', 100, 0, 'L', 95, -5],
                                    leftArrow = ['M', 100, 0, 'L', 0, 0, 'L', 5, 5, 'M', 0, 0, 'L', 5, -5];

                                // Separator, client from service
                                ren.path(['M', 120, 40, 'L', 120, 330])
                                    .attr({
                                        'stroke-width': 2,
                                        stroke: 'silver',
                                        dashstyle: 'dash'
                                    })
                                    .add();

                                // Separator, CLI from service
                                ren.path(['M', 420, 40, 'L', 420, 330])
                                    .attr({
                                        'stroke-width': 2,
                                        stroke: 'silver',
                                        dashstyle: 'dash'
                                    })
                                    .add();

                                // Headers
                                ren.label('Web client', 20, 40)
                                    .css({
                                        fontWeight: 'bold'
                                    })
                                    .add();
                                ren.label('Web service / CLI', 220, 40)
                                    .css({
                                        fontWeight: 'bold'
                                    })
                                    .add();
                                ren.label('Command line client', 440, 40)
                                    .css({
                                        fontWeight: 'bold'
                                    })
                                    .add();

                                // SaaS client label
                                ren.label('SaaS client<br/>(browser or<br/>script)', 10, 82)
                                    .attr({
                                        fill: colors[0],
                                        stroke: 'white',
                                        'stroke-width': 2,
                                        padding: 5,
                                        r: 5
                                    })
                                    .css({
                                        color: 'white'
                                    })
                                    .add()
                                    .shadow(true);

                                // Arrow from SaaS client to Phantom JS
                                ren.path(rightArrow)
                                    .attr({
                                        'stroke-width': 2,
                                        stroke: colors[3]
                                    })
                                    .translate(95, 95)
                                    .add();

                                ren.label('POST options in JSON', 90, 75)
                                    .css({
                                        fontSize: '10px',
                                        color: colors[3]
                                    })
                                    .add();

                                ren.label('PhantomJS', 210, 82)
                                    .attr({
                                        r: 5,
                                        width: 100,
                                        fill: colors[1]
                                    })
                                    .css({
                                        color: 'white',
                                        fontWeight: 'bold'
                                    })
                                    .add();

                                // Arrow from Phantom JS to Batik
                                ren.path(['M', 250, 110, 'L', 250, 185, 'L', 245, 180, 'M', 250, 185, 'L', 255, 180])
                                    .attr({
                                        'stroke-width': 2,
                                        stroke: colors[3]
                                    })
                                    .add();

                                ren.label('SVG', 255, 120)
                                    .css({
                                        color: colors[3],
                                        fontSize: '10px'
                                    })
                                    .add();

                                ren.label('Batik', 210, 200)
                                    .attr({
                                        r: 5,
                                        width: 100,
                                        fill: colors[1]
                                    })
                                    .css({
                                        color: 'white',
                                        fontWeight: 'bold'
                                    })
                                    .add();

                                // Arrow from Batik to SaaS client
                                ren.path(['M', 235, 185, 'L', 235, 155, 'C', 235, 130, 235, 130, 215, 130,
                                        'L', 95, 130, 'L', 100, 125, 'M', 95, 130, 'L', 100, 135])
                                    .attr({
                                        'stroke-width': 2,
                                        stroke: colors[3]
                                    })
                                    .add();

                                ren.label('Rasterized image', 100, 110)
                                    .css({
                                        color: colors[3],
                                        fontSize: '10px'
                                    })
                                    .add();

                                // Browser label
                                ren.label('Browser<br/>running<br/>Highcharts', 10, 180)
                                    .attr({
                                        fill: colors[0],
                                        stroke: 'white',
                                        'stroke-width': 2,
                                        padding: 5,
                                        r: 5
                                    })
                                    .css({
                                        color: 'white',
                                        width: '100px'
                                    })
                                    .add()
                                    .shadow(true);



                                // Arrow from Browser to Batik
                                ren.path(rightArrow)
                                    .attr({
                                        'stroke-width': 2,
                                        stroke: colors[1]
                                    })
                                    .translate(95, 205)
                                    .add();

                                ren.label('POST SVG', 110, 185)
                                    .css({
                                        color: colors[1],
                                        fontSize: '10px'
                                    })
                                    .add();

                                // Arrow from Batik to Browser
                                ren.path(leftArrow)
                                    .attr({
                                        'stroke-width': 2,
                                        stroke: colors[1]
                                    })
                                    .translate(95, 215)
                                    .add();

                                ren.label('Rasterized image', 100, 215)
                                    .css({
                                        color: colors[1],
                                        fontSize: '10px'
                                    })
                                    .add();

                                // Script label
                                ren.label('Script', 450, 82)
                                    .attr({
                                        fill: colors[2],
                                        stroke: 'white',
                                        'stroke-width': 2,
                                        padding: 5,
                                        r: 5
                                    })
                                    .css({
                                        color: 'white',
                                        width: '100px'
                                    })
                                    .add()
                                    .shadow(true);

                                // Arrow from Script to PhantomJS
                                ren.path(leftArrow)
                                    .attr({
                                        'stroke-width': 2,
                                        stroke: colors[2]
                                    })
                                    .translate(330, 90)
                                    .add();

                                ren.label('Command', 340, 70)
                                    .css({
                                        color: colors[2],
                                        fontSize: '10px'
                                    })
                                    .add();

                                // Arrow from PhantomJS to Script
                                ren.path(rightArrow)
                                    .attr({
                                        'stroke-width': 2,
                                        stroke: colors[2]
                                    })
                                    .translate(330, 100)
                                    .add();

                                ren.label('Rasterized image', 330, 100)
                                    .css({
                                        color: colors[2],
                                        fontSize: '10px'
                                    })
                                    .add();
                            }
                        }
                    },
                    title: {
                        text: 'Highcharts export server overview',
                        style: {
                            color: 'black'
                        }
                    }
                })
            }

            function setDarkTheme() {
                // Load the fonts
                Highcharts.createElement('link', {
                    href: '//fonts.googleapis.com/css?family=Unica+One',
                    //href: '//fonts.googleapis.com/css?family=Signika:400,700',
                    rel: 'stylesheet',
                    type: 'text/css'
                }, null, document.getElementsByTagName('head')[0]);

                Highcharts.theme = {
                    colors: ["#2b908f", "#90ee7e", "#f45b5b", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee",
                        "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"],
                    chart: {
                        backgroundColor: {
                            linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
                            stops: [
                                [0, '#2a2a2b'],
                                [1, '#3e3e40']
                            ]
                        },
                        style: {
                            fontFamily: "'Unica One', sans-serif"
                            //fontFamily: "Signika, serif"
                        },
                        plotBorderColor: '#606063'
                    },
                    title: {
                        style: {
                            color: '#E0E0E3',
                            textTransform: 'uppercase',
                            fontSize: '20px'
                        }
                    },
                    subtitle: {
                        style: {
                            color: '#E0E0E3',
                            textTransform: 'uppercase'
                        }
                    },
                    xAxis: {
                        gridLineColor: '#707073',
                        labels: {
                            style: {
                                color: '#E0E0E3'
                            }
                        },
                        lineColor: '#707073',
                        minorGridLineColor: '#505053',
                        tickColor: '#707073',
                        title: {
                            style: {
                                color: '#A0A0A3'

                            }
                        }
                    },
                    yAxis: {
                        gridLineColor: '#707073',
                        labels: {
                            style: {
                                color: '#E0E0E3'
                            }
                        },
                        lineColor: '#707073',
                        minorGridLineColor: '#505053',
                        tickColor: '#707073',
                        tickWidth: 1,
                        title: {
                            style: {
                                color: '#A0A0A3'
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.85)',
                        style: {
                            color: '#F0F0F0'
                        }
                    },
                    plotOptions: {
                        series: {
                            dataLabels: {
                                color: '#B0B0B3'
                            },
                            marker: {
                                lineColor: '#333'
                            }
                        },
                        boxplot: {
                            fillColor: '#505053'
                        },
                        candlestick: {
                            lineColor: 'white'
                        },
                        errorbar: {
                            color: 'white'
                        }
                    },
                    legend: {
                        itemStyle: {
                            color: '#E0E0E3'
                        },
                        itemHoverStyle: {
                            color: '#FFF'
                        },
                        itemHiddenStyle: {
                            color: '#606063'
                        }
                    },
                    credits: {
                        style: {
                            color: '#666'
                        }
                    },
                    labels: {
                        style: {
                            color: '#707073'
                        }
                    },

                    drilldown: {
                        activeAxisLabelStyle: {
                            color: '#F0F0F3'
                        },
                        activeDataLabelStyle: {
                            color: '#F0F0F3'
                        }
                    },

                    navigation: {
                        buttonOptions: {
                            symbolStroke: '#DDDDDD',
                            theme: {
                                fill: '#505053'
                            }
                        }
                    },

                    // scroll charts
                    rangeSelector: {
                        buttonTheme: {
                            fill: '#505053',
                            stroke: '#000000',
                            style: {
                                color: '#CCC'
                            },
                            states: {
                                hover: {
                                    fill: '#707073',
                                    stroke: '#000000',
                                    style: {
                                        color: 'white'
                                    }
                                },
                                select: {
                                    fill: '#000003',
                                    stroke: '#000000',
                                    style: {
                                        color: 'white'
                                    }
                                }
                            }
                        },
                        inputBoxBorderColor: '#505053',
                        inputStyle: {
                            backgroundColor: '#333',
                            color: 'silver'
                        },
                        labelStyle: {
                            color: 'silver'
                        }
                    },

                    navigator: {
                        handles: {
                            backgroundColor: '#666',
                            borderColor: '#AAA'
                        },
                        outlineColor: '#CCC',
                        maskFill: 'rgba(255,255,255,0.1)',
                        series: {
                            color: '#7798BF',
                            lineColor: '#A6C7ED'
                        },
                        xAxis: {
                            gridLineColor: '#505053'
                        }
                    },

                    scrollbar: {
                        barBackgroundColor: '#808083',
                        barBorderColor: '#808083',
                        buttonArrowColor: '#CCC',
                        buttonBackgroundColor: '#606063',
                        buttonBorderColor: '#606063',
                        rifleColor: '#FFF',
                        trackBackgroundColor: '#404043',
                        trackBorderColor: '#404043'
                    },

                    // special colors for some of the
                    legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
                    background2: '#505053',
                    dataLabelsColor: '#B0B0B3',
                    textColor: '#C0C0C0',
                    contrastTextColor: '#F0F0F3',
                    maskColor: 'rgba(255,255,255,0.3)'
                };

                // Apply the theme
                Highcharts.setOptions(Highcharts.theme);
            }

            function sandTheme() {
                // Load the fonts
                Highcharts.createElement('link', {
                    href: '//fonts.googleapis.com/css?family=Signika:400,700',
                    rel: 'stylesheet',
                    type: 'text/css'
                }, null, document.getElementsByTagName('head')[0]);

                // Add the background image to the container
                Highcharts.wrap(Highcharts.Chart.prototype, 'getContainer', function (proceed) {
                    proceed.call(this);
                    this.container.style.background = 'url(http://www.highcharts.com/samples/graphics/sand.png)';
                });


                Highcharts.theme = {
                    colors: ["#f45b5b", "#8085e9", "#8d4654", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee",
                        "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"],
                    chart: {
                        backgroundColor: null,
                        style: {
                            fontFamily: "Signika, serif"
                        }
                    },
                    title: {
                        style: {
                            color: 'black',
                            fontSize: '16px',
                            fontWeight: 'bold'
                        }
                    },
                    subtitle: {
                        style: {
                            color: 'black'
                        }
                    },
                    tooltip: {
                        borderWidth: 0
                    },
                    legend: {
                        itemStyle: {
                            fontWeight: 'bold',
                            fontSize: '13px'
                        }
                    },
                    xAxis: {
                        labels: {
                            style: {
                                color: '#6e6e70'
                            }
                        }
                    },
                    yAxis: {
                        labels: {
                            style: {
                                color: '#6e6e70'
                            }
                        }
                    },
                    plotOptions: {
                        series: {
                            shadow: true
                        },
                        candlestick: {
                            lineColor: '#404048'
                        },
                        map: {
                            shadow: false
                        }
                    },

                    // Highstock specific
                    navigator: {
                        xAxis: {
                            gridLineColor: '#D0D0D8'
                        }
                    },
                    rangeSelector: {
                        buttonTheme: {
                            fill: 'white',
                            stroke: '#C0C0C8',
                            'stroke-width': 1,
                            states: {
                                select: {
                                    fill: '#D0D0D8'
                                }
                            }
                        }
                    },
                    scrollbar: {
                        trackBorderColor: '#C0C0C8'
                    },

                    // General
                    background2: '#E0E0E8'

                };

                // Apply the theme
                Highcharts.setOptions(Highcharts.theme);
            }


var ip = "https://sensorapp-nguyentruongthanhtam.c9users.io";
var socket = io.connect(ip);

var connectMenu = $('#type').next();
 var sensorType;
 var sensorState ={sta:"",type:""};
 function discover()
    {
        sensorState.sta=0;
        sensorState.type="cc2650";
        socket.emit('state',{
            state:sensorState.sta,
            type:sensorState.type
         });
    }
    function connect()
    {
        sensorState.sta=1;
        sensorState.type="cc2650";
        socket.emit('state',{
            state:sensorState.sta,
            type:sensorState.type
         });
    }
   
var connected,discovering,discovered;
$(function () { 
   
    // console.log($('#typeChoice').val());
    
     socket.on('signal',function(signalData){
        // console.log(Number(data.sta));
        // $('#type').text(data.type);
        // When sensor recognized but NOT connected
        if(Number(signalData.sta)!=1 && typeof(signalData.type)!='undefined') // not connected
        {
        $('.disconnected').text("Sensor "+signalData.type+" detected!!");
            $('.disconnected').on('click',function(){
                $('#type').next().fadeIn(200);
            
                });        

        }
        // When sensor recognized and connected
        else if(Number(signalData.sta)==1)
        {
            $('.disconnected').text("Sensor "+signalData.type+" connected!!");
            $('.disconnected').off('click');
            $('.disconnected').removeClass('disconnected').addClass('connected');
            // $('.connected').attr('src',"connected1small.png");
            $('.circle2').removeClass('blackC').addClass('pinkC');
            $('#type').css("color","#25cedd");
            $('.circle').addClass('rotate');
            
            socket.on('tempOut',function(data)
            {
                    $("#humidity").text(data.humi);
                     $("#temperature").text(data.temp);                    
                     $("#luxometer").text(data.lux);
                     sensorType = data.type;          
                });
        }
});
    // events fired when you click connect to device Button
    $('#type').next().on('click',function(){
        socket.emit('state',{
            state:1,
            type:"cc2650"
         });
        $('.disconnected').off('click');
        $('.disconnected').removeClass('disconnected').addClass('connected');
        $('#type').next().fadeOut(200);
        // $('#type').css("color","#4c1a51");
        
    });
    // $('#disconnected').on('click',function(){
    //     $('#type').css("color","green");
    // });
    
/**
 * Dark theme for Highcharts JS
 * @author Torstein Honsi
 */

// Load the fonts
Highcharts.setOptions({
    global: {
        useUTC: false
    }
});
Highcharts.createElement('link', {
   href: '//fonts.googleapis.com/css?family=Unica+One',
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

   Highcharts.setOptions(Highcharts.theme);

    var chart = new Highcharts.Chart({
        chart: {
                type: 'spline',
                renderTo:'graphTemp',
                animation: Highcharts.svg, // don't animate in old IE
                marginRight: 10,
                events: {
                    load: 
                        // getData 
                        function (){
                            
                            series = this.series[0];
                            socket.on('tempOut',function(data)
                        {
                                var x = (new Date()).getTime(), // current time
                                            y = Number(data.temp);
                                series.addPoint([x,y],true,true);
                            
                        });
                        
                        }
                        
                }
            },
            title: {
                text: 'Live Temperature Graph'
            },
            xAxis: {
                type: 'datetime',
                tickPixelInterval: 150
            },
            yAxis: {
                title: {
                    text: "\xB0C"
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                formatter: function () {
                    return '<b>' + this.series.name + '</b><br/>' +
                        Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                        Highcharts.numberFormat(this.y, 2);
                }
            },
            legend: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            series: [{
                name: 'Ambient Temperature',
                color:'#ef7573',
                data: (function () {
                    // generate an array of random data
                    var data = [],
                        time = (new Date()).getTime(),
                        i;
                    for (i = -19; i <= 0; i += 1) {
                        data.push({
                            x: time + i * 1000,
                            y: 0
                        });
                    }
                    // console.log(data);
                    return data;
                }())
            }]
    });
 
    // Live Graph for Humidity 
    // -----------------------
    var chart2 = new Highcharts.Chart({
        chart: {
                type: 'spline',
                renderTo:'graphHumi',
                animation: Highcharts.svg, // don't animate in old IE
                marginRight: 10,
                events: {
                    load: 
                        // getData 
                        function (){
                            
                            series2 = this.series[0];
                            socket.on('tempOut',function(data)
                        {
                                var x = (new Date()).getTime(), // current time
                                            y = Number(data.humi);
                                series2.addPoint([x,y],true,true);
                            
                        });
                        }
                        
                }
            },
            title: {
                text: 'Live Humidity Graph'
            },
            xAxis: {
                type: 'datetime',
                tickPixelInterval: 150
            },
            yAxis: {
                title: {
                    text: '%H'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                formatter: function () {
                    return '<b>' + this.series.name + '</b><br/>' +
                        Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                        Highcharts.numberFormat(this.y, 2);
                }
            },
            legend: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            series: [{
                name: 'Humidity',
                color:'#45859e',
                data: (function () {
                    // generate an array of random data
                    var data1 = [],
                        time = (new Date()).getTime(),
                        i;
                    for (i = -19; i <= 0; i += 1) {
                        data1.push({
                            x: time + i * 1000,
                            y: 0
                        });
                    }
                    // console.log(data);
                    return data1;
                }())
            }]
    });
 
 // Live Graph for Light Level
    // -----------------------
    var chart3 = new Highcharts.Chart({
        chart: {
                type: 'spline',
                renderTo:'graphLux',
                animation: Highcharts.svg, // don't animate in old IE
                marginRight: 10,
                events: {
                    load: 
                        // getData 
                        function (){
                            
                            series3 = this.series[0];
                            socket.on('tempOut',function(data)
                        {
                                var x = (new Date()).getTime(), // current time
                                            y = Number(data.lux);
                                series3.addPoint([x,y],true,true);
                            
                        });
                        }
                        
                }
            },
            title: {
                text: 'Live Light Level Graph'
            },
            xAxis: {
                type: 'datetime',
                tickPixelInterval: 150
            },
            yAxis: {
                title: {
                    text: 'Lux'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                formatter: function () {
                    return '<b>' + this.series.name + '</b><br/>' +
                        Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                        Highcharts.numberFormat(this.y, 2);
                }
            },
            legend: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            series: [{
                name: 'Light Level',
                color:'#ffe37f',
                data: (function () {
                    // generate an array of random data
                    var data1 = [],
                        time = (new Date()).getTime(),
                        i;
                    for (i = -19; i <= 0; i += 1) {
                        data1.push({
                            x: time + i * 1000,
                            y: 0
                        });
                    }
                    // console.log(data);
                    return data1;
                }())
            }]
    });
 

});
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// database inported library
/*var mongo = require('mongodb');*/
var MongoClient = require('mongodb').MongoClient;
// var monk = require('monk');
// var db = monk('192.168.11.7:27017/sensorApp');
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = "mongodb://nguyentruongthanhtam-sensorapp-3397893:27017/sensorApp";
// var jsdom = require('jsdom').jsdom;
//  var document = jsdom('<html></html>', {});
//  var window = document.defaultView;
//  var $ = require('jquery')(window);

var db;
var collection;
// var sensortag = require('./routes/sensortag');
var routes = require('./routes/index');
var users = require('./routes/users');
var app = express();
var server = require('http').Server(app);
var debug = require('debug')('sensorApp:server');
var http = require('http');
var port = normalizePort(process.env.PORT);
var sensorType,sStatus;
var output,chosenType,chosenDate,chosenHourF,chosenHourT;
var io = require('socket.io')(server);
var gDate ={d:"",t:"",full:"",h:0,m:0,s:0};
var stateRec;
getDayTime(gDate);

server.listen(process.env.PORT);
server.on('error', onError);
server.on('listening', onListening);
// app.set('port', port);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
MongoClient.connect(url,function(err,database)
     {
       console.log(url);
       db = database;
       /*database.listCollections(gDate.d,function(err,result){*/
        /* if(result.length>0)
         {*/
           db.createCollection(gDate.d,function(err,result)
           {if(err) console.log("there is an error: " + err);});
          
         /*}*/
       /*});*/
       if(err) console.log(err);
     });
              
io.on('connection',function(socket)
      {
          
          socket.removeAllListeners();
          var s;
          socket.emit('date',{
            points:output,
            type:s
          });
          
          socket.on('state',function(data){
            s = data.state;
            if(data.state==1)
            {
              setInterval(function(){ 
            
                socket.emit('signal',{
                      sta: data.state,
                      type:data.type
                  });
             
              var temp=getRandomInt(20,30);
              var humi=getRandomInt(50,100);
              var lux=getRandomInt(20,80);
              // sending values to dashboard
                socket.emit('tempOut',
                {
                      temp:temp,
                      humi:humi,
                      lux:lux
                });
                
                console.log("Adding value to database...");
                insertDocumentExplicit(db,temp,humi,lux,function(){    
                });  
            
            // console.log(typeof(sensortag.temp)); 
            },1000);
            }
            else
            {
              socket.emit('signal',{
                      sta: data.state,
                      type:data.type
                  });
             
            }
          })
      });
// sensortag.status = sStatus;
app.get('/',function(req, res, next) {
  res.render('index', { title: 'Express',});
});

app.get('/dashboard', function(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.statusCode = 200;
  
  // console.log("Sending value from server... "+sensortag.type);
   db.listCollections().toArray(function(err, items) {
          if(err) console.log(err);
          res.render('dashboard', {
             "datelist" : items
            });
         });
   
});



app.post('/report',function(req,res)
{
  var timestamp = function(objId)
{
  var output = {full:"" , timeOnly:""};
  var t = objId.toString().substring(0,8);
  var d = new Date(parseInt (t,16) * 1000);
  output.full = d.getTime();
  return output;
}

  console.log("choosen date called");
  function exportData(array,option)
    {
      var yValue;
        var data = [];
          for(var i=0;i<array.length;i++)
        {
            switch(option)
            {
                case 1:
                yValue=array[i].temp;
                break;

                case 2:
                yValue=array[i].humi;
                break;

                case 3:
                yValue=array[i].lux;
                break;
            }
            data.push({
                            x: timestamp(array[i]._id).full,
                            y: Number(yValue)
                          });
        }
       return data;
        
    }
  res.statusCode=200;   
  chosenDate = req.body.dateForm;
  chosenType = req.body.typeForm;
  chosenHourF = Number(req.body.hourF); 
  chosenHourT = Number(req.body.hourT);

  if(chosenHourF==0 && chosenHourT==0)
  {
    chosenHourF=0;
    chosenHourT=23;
  } 
      
  console.log("from: " + chosenHourF + "to: " +  ' on:' + chosenDate);
  
   collection =db.collection(chosenDate);
   // find entry in specific time period 

    switch(chosenType)
    {
     case "temp":
         collection.find({hour:{$gte:chosenHourF,$lte:chosenHourT}} , {temp:1}).toArray(function(err,items){
          output=exportData(items,1);
         });
         break;

     case "humi":
         collection.find({hour:{$gte:chosenHourF,$lte:chosenHourT}} , {humi:1}).toArray(function(err,items){
         output=exportData(items,2);
         });
         break;

     case "lux":
         collection.find({hour:{$gte:chosenHourF,$lte:chosenHourT}} , {lux:1}).toArray(function(err,items){
 output=exportData(items,3);
         });
         break;
    }
    
    res.render('report',
    {
      "day":chosenDate
    });
  
  // send data from Database to Date List Page to display in graph
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use(function(req,res,next){
//     req.db = db;
//     next();
// }); 
// app.use('/', routes);
app.use('/users', users);
// app.use('/', sensortag);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// database
var insertDocumentExplicit = function(db,temp,humi,lux,callback) {  
       // getDayTime(gDate);
       getDayTime(gDate);
       // console.log(gDate.t);
          db.collection(gDate.d).insert
          ({
                "hour": gDate.h,
                "minute": gDate.m,
                "second": gDate.s,
                "temp": temp,
                "humi": humi,
                "lux": lux
          }, function(err,result) 
            {
              // assert.equal(err, null);
              // // console.log(result);

              if(err)
                console.log("Error: "+err);
              callback(result);
            });
        
        
    };    

   //---------------
function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}
function getDayTime(gDate)
{
    var t = new Date();
    var h= t.getHours();
    var m= t.getMinutes();
    var s= t.getSeconds();
    var day = t.getDate();
    var month = t.getMonth()+1;
    var year = t.getFullYear();
    var fullTime = h + ":" + m + ":" + s ;
    var fullDate = day + "/" + month + "/" + year ;
    gDate.t=fullTime;
    gDate.d=fullDate;

    gDate.h = h;
    gDate.m = m;
    gDate.s = s;

    gDate.full = t.getTime();
    // console.log(fullTime);
    // console.log(fullDate);
}
 function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
//---------------

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}


module.exports = app;

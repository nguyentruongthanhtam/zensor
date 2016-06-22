/*
	sensorTag IR Temperature sensor example

	This example uses Sandeep Mistry's sensortag library for node.js to
	read data from a TI sensorTag.

	Although the sensortag library functions are all asynchronous,
	there is a sequence you need to follow in order to successfully
	read a tag:
		1) discover the tag
		2) connect to and set up the tag
		3) turn on the sensor you want to use (in this case, IR temp)
		4) turn on notifications for the sensor
		5) listen for changes from the sensortag

	This example does all of those steps in sequence by having each function
	call the next as a callback. Discover calls connectAndSetUp and so forth.

	This example is heavily indebted to Sandeep's test for the library, but
	achieves more or less the same thing without using the async library.

	created 15 Jan 2015
	modified 7 April 2015
	by Tom Igoe
*/

var SensorTag = require('sensortag');// sensortag library
// var MongoClient = require('mongodb').MongoClient;
// var assert = require('assert');
// var ObjectId = require('mongodb').ObjectID;
// var ip = "193.166.93.42";
// var url = 'mongodb://'+ip+':27017/sensorApp';
// var www = require('../bin/www');
// www.io.on('connection',function(socket){
// 	socket.removeAllListeners();
// 	socket.on('connect',function(data){

// 		console.log('Connect state : ',data.state);
// 	});
// 	console.log("Device: "+tag.type+" with id of: "+tag.id+" connected !");
// 	enableIrTempMe();
// })

// listen for tags:
var status=0;

SensorTag.discover(function(tag) {


	// when you disconnect from a tag, exit the program:
	tag.on('disconnect', function() {
		console.log('disconnected!');
		process.exit(0);
	});

	function connectAndSetUpMe() {			// attempt to connect to the tag
     console.log('connectAndSetUp');
     tag.connectAndSetUp(enableIrTempMe);		// when you connect, call enableIrTempMe
   
   }

   function enableIrTempMe() {		// attempt to enable the IR Temperature sensor
     // console.log('enableIRTemperatureSensor');
     // when you enable the IR Temperature sensor, start notifications:
     // tag.enableIrTemperature();
     tag.enableHumidity(tag.enableLuxometer(tag.enableIrTemperature(notifyMe)));
     

   }

	function notifyMe() {
		console.log('Sensor '+tag.type+' is connected!');
		console.log('Device\'s ID detected: '+tag.id);
		console.log('--------------------------------');
		console.log('Services have started !...');
		console.log('Humidity sensor Enabled !...');
		console.log('Temperature sensor Enabled !...');
		console.log('Luxometer sensor Enabled!...');
		console.log('--------------------------------');
		console.log('--------------------------------');
		console.log('');
		tag.unnotifySimpleKey();
		tag.notifyIrTemperature(tag.setIrTemperaturePeriod(1000,listenForTempReading));
		tag.notifyHumidity(tag.setHumidityPeriod(1000,listenForHumidity));
		tag.notifyLuxometer(tag.setLuxometerPeriod(1000,listenForLuxometer));

		// console.log('Accelerometer sensor Enabled!...');
		// tag.notifyAccelerometer(tag.setAccelerometerPeriod(1000, listenForAccelerometer));

   }
   function listenForAccelerometer(){
   		// Listen for Luxometer 
   		tag.on('accelerometerChange', function(x, y, z){
   			console.log('x: ',x.toFixed(1));
   			console.log('y: ',y.toFixed(1));
   			console.log('z: ',z.toFixed(1));
   			module.exports.acc = x.toFixed(1) +" | "+ y.toFixed(1)+ " | " + z.toFixed(1);
   			// module.exports.acc = (Number(x.toFixed(1))+ Number(y.toFixed(1))+ Number(z.toFixed(1))).toFixed(1);
   		});
   		

   	}
   function listenForLuxometer(){
   		// Listen for Luxometer 
   		tag.on('luxometerChange', function(lux){
   			console.log('lux value = ',lux);
   			module.exports.lux = lux.toFixed(1);
   		});
   }



   // When you get an accelermeter change, print it out:
	function listenForTempReading() {
		tag.on('irTemperatureChange', function(objectTemp, ambientTemp) {
	    console.log('\tObject Temp = %d deg. C', objectTemp.toFixed(1));
	    console.log('\tAmbient Temp = %d deg. C', ambientTemp.toFixed(1));
	    var intemp = ambientTemp.toFixed(1);
	    module.exports.temp= ambientTemp.toFixed(1);


	   });
	}
	
   
   	// Get data from Humidity Sensor ( + Temperature )
	function listenForHumidity() {
		tag.on('humidityChange', function(temperature, humidity) {
	     console.log('\tTemperature = %d deg. C', temperature.toFixed(1));
	     console.log('\tHumidity = %d %H', humidity.toFixed(1));
	     module.exports.humi= humidity.toFixed(1);
	     var intemp = temperature.toFixed(1);
	     var inhumid = humidity.toFixed(1);
	    
		
	   });
	}
	// when you get a button change, print it out:
	function listenForButton() {
		tag.on('simpleKeyChange', function(left, right) {
			console.log("Device: "+tag.type);
			console.log("Device ID: "+tag.id);
			if (left) {
				console.log('left button PRESSED!');
			}
			if (right) {
				console.log('right button PRESSED!');
			}
			// if both buttons are pressed, disconnect:
			if (left && right) {
				console.log("Device: "+tag.type+" with id of: "+tag.id+" connected !");
				enableIrTempMe();
				// tag.disconnect();

			}
	   });
	}


 //  });
	// Now that you've defined all the functions, start the process:
	tag.connectAndSetUp(
		function(){
			// module.exports.status = status;
			// io.on('connection',function(socket){
			// socket.removeAllListeners();
			// socket.on('custom',function(data){
			// // console.log('Connect state : ',data.status);
			// if(status==0)
			// {
			var intervalID=setInterval(function(){
					console.log("Check status: ",status);
							if(status==1)
							{
							 	enableIrTempMe();// connected signal
								clearInterval(intervalID);
							 	
							}
							
						},1000);

			module.exports.sta = status;

			// }
			// 	console.log("Connection status: ",data.status);
			// });

			// });
        	console.log("Sensor Type: ",tag.type);
        	console.log("Sensor ID: ",tag.id);
        	
        	module.exports.type= tag.type;
     		tag.notifySimpleKey(listenForButton); // start the button listener);   	
        });
	 
});
	module.exports= function(s)
{
	status=s;
	console.log("Check status: ",status);
	// if(s == 1)
	// 	enableIrTempMe();// connected signal
}
